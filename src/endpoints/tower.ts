import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
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

const getTower: Endpoint = {
    url: '/tower/:towerId/get',
    method: 'get',
    async handler(req, res) {
        const { towerId } = req.params;
        const db = await getTowerDb();
        const blocks = await db.all('SELECT * FROM tower WHERE towerId = ?', [
            towerId || 'main'
        ]);
        res.json(blocks.length ? blocks[0].unsigned : 0);
    }
};

const incrementTower: Endpoint = {
    url: '/tower/:towerId/increment/:amount',
    method: 'get',
    async handler(req, res) {
        const { towerId, amount } = req.params;
        const db = await getTowerDb();
        await db.run(
            'UPDATE tower SET unsigned = unsigned + ? WHERE towerId = ?',
            [amount, towerId || 'main']
        );
        res.sendStatus(204);
    }
};

export default [getTower, incrementTower];
