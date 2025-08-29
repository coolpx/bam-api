import { open } from 'sqlite';
import { Database } from 'sqlite3';
import path from 'path';
import process from 'process';
import { isValidBamStat } from '../../modules/stats';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/bam/:userId/get/:stat',
    method: 'get',
    async handler(req, res) {
        // get and validate parameters
        const { userId, stat } = req.params;

        if (!userId || !/^[0-9]+$/.test(userId)) {
            res.status(400).json({ error: 'User ID is invalid' });
            return;
        }
        if (!stat || !isValidBamStat(stat)) {
            res.status(400).json({ error: 'Stat is invalid' });
            return;
        }

        // open database
        const database = await open({
            filename: path.join(process.cwd(), 'data', 'bam.db'),
            driver: Database
        });

        // read from database
        const [row] = await database.all(
            `SELECT * FROM ${stat} WHERE userId = ?`,
            userId
        );

        // close database
        await database.close();

        // send response
        if (!row) {
            res.json({ success: true, value: 0 });
            return;
        }

        res.json({ success: true, value: row.amount });
    }
};

export default endpoint;
