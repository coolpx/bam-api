import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import crypto from 'crypto';
import { Endpoint } from '../types';

const towerDbPath = path.join(process.cwd(), 'data', 'bam.db');
let towerDbPromise: Promise<any> | null = null;
function getTowerDb() {
    if (!towerDbPromise) {
        towerDbPromise = open({
            filename: towerDbPath,
            driver: sqlite3.Database
        });
    }
    return towerDbPromise;
}

const postMessage: Endpoint = {
    // towerId path param removed — messages are global
    url: '/message',
    method: 'post',
    async handler(req, res) {
        const { content, senderId, senderName } = req.body;
        // messages are global across all towers now; ignore any towerId param
        // keep an explicit global marker to avoid depending on DB defaults
        const db = await getTowerDb();
        await db.run(
            'INSERT INTO messages (content, id, senderId, senderName, towerId) VALUES (?, ?, ?, ?, ?)',
            [content, crypto.randomUUID(), senderId, senderName, 'global']
        );
        res.sendStatus(204);
    }
};

const getMessages: Endpoint = {
    // towerId path param removed — messages are global
    url: '/messages',
    method: 'get',
    async handler(req, res) {
        // messages are global across towers — ignore towerId param and return recent messages
        const db = await getTowerDb();
        const messages = await db.all(
            "SELECT * FROM messages WHERE created_at >= datetime('now', '-10 seconds') ORDER BY created_at DESC"
        );
        res.json(messages || []);
    }
};

export default [postMessage, getMessages];
