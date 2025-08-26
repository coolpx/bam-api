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
    url: '/tower/:towerId/message',
    method: 'post',
    async handler(req, res) {
        const { content, senderId, senderName } = req.body;
        const { towerId } = req.params;
        const db = await getTowerDb();
        await db.run(
            'INSERT INTO messages (content, id, senderId, senderName, towerId) VALUES (?, ?, ?, ?, ?)',
            [
                content,
                crypto.randomUUID(),
                senderId,
                senderName,
                towerId || 'main'
            ]
        );
        res.sendStatus(204);
    }
};

const getMessages: Endpoint = {
    url: '/tower/:towerId/messages',
    method: 'get',
    async handler(req, res) {
        const { towerId } = req.params;
        const db = await getTowerDb();
        const messages = await db.all(
            "SELECT * FROM messages WHERE towerId = ? AND created_at >= datetime('now', '-10 seconds') ORDER BY created_at DESC",
            [towerId || 'main']
        );
        res.json(messages || []);
    }
};

export default [postMessage, getMessages];
