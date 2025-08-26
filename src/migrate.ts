
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';


const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'bam.db');


async function migrate() {
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    // Create or update the tower table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tower (
            towerId TEXT NOT NULL DEFAULT 'main',
            unsigned INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY (towerId)
        );
    `);

    // Create or update the messages table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            content TEXT NOT NULL,
            senderId TEXT NOT NULL,
            senderName TEXT NOT NULL,
            towerId TEXT NOT NULL DEFAULT 'main',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // BAM_STATS tables
    const stats = [
        'playtime',
        'placedBricks',
        'rareBricks',
        'layersComplete',
        'money'
    ];
    for (const stat of stats) {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS ${stat} (
                userId INTEGER PRIMARY KEY,
                amount INTEGER NOT NULL DEFAULT 0
            );
        `);
    }

    await db.close();
    console.log('Migration complete.');
}

migrate().catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
});
