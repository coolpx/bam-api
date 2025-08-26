import { open } from 'sqlite';
import { Database } from 'sqlite3';
import path from 'path';
import process from 'process';
import { isValidBamStat } from '../modules/stats';
import { Endpoint } from '../types';

const endpoint: Endpoint = {
    url: '/bam/:userId/increment/:stat/:amount',
    method: 'get',
    async handler(req, res) {
        // get and validate parameters
        const { userId, stat, amount } = req.params;

        if (!userId || !/^[0-9]+$/.test(userId)) {
            res.status(400).json({ error: 'User ID is invalid' });
            return;
        }
        if (!stat || !isValidBamStat(stat)) {
            res.status(400).json({ error: 'Stat is invalid' });
            return;
        }
        if (!amount || !/^[0-9]+$/.test(amount)) {
            res.status(400).json({ error: 'Amount is invalid' });
            return;
        }

        // open database
        const database = await open({
            filename: path.join(process.cwd(), 'data', 'bam.db'),
            driver: Database
        });

        // update database
        await database.run(
            `INSERT INTO ${stat} (userId, amount) VALUES (?, ?) ON CONFLICT(userId) DO UPDATE SET amount = amount + ?`,
            userId,
            amount,
            amount
        );

        // close database
        await database.close();

        // send response
        res.json({ success: true });
    }
};

export default endpoint;
