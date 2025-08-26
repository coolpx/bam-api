import { open } from 'sqlite';
import { Database } from 'sqlite3';
import path from 'path';
import process from 'process';
import { isValidBamStat } from '../modules/stats';
import { Endpoint } from '../types';

const endpoint: Endpoint = {
    url: '/bam/getSorted/:stat/:amount',
    method: 'get',
    async handler(req, res) {
        // get and validate parameters
        const { stat, amount } = req.params;

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

        // read top N users from database
        const rows = await database.all(
            `SELECT * FROM ${stat} ORDER BY amount DESC LIMIT ?`,
            amount
        );

        // close database
        await database.close();

        // send response
        res.json({ success: true, data: rows });
    }
};

export default endpoint;
