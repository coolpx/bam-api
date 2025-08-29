import { open } from 'sqlite';
import { Database } from 'sqlite3';
import path from 'path';
import process from 'process';
import { isValidBamStat } from '../../modules/stats';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/bam/getUserRank/:stat/:userId',
    method: 'get',
    async handler(req, res) {
        // get and validate parameters
        const { stat, userId } = req.params;

        if (!stat || !isValidBamStat(stat)) {
            res.status(400).json({ error: 'Stat is invalid' });
            return;
        }

        if (!userId || !/^[0-9]+$/.test(userId)) {
            res.status(400).json({ error: 'User ID is invalid' });
            return;
        }

        // open database
        const database = await open({
            filename: path.join(process.cwd(), 'data', 'bam.db'),
            driver: Database
        });

        // get user rank from database
        const [row] = await database.all(
            `SELECT ROW_NUMBER() OVER (ORDER BY amount DESC) AS rank FROM ${stat} WHERE userId = ?`,
            userId
        );

        // close database
        await database.close();

        // send response
        res.json({ success: true, rank: row ? row.rank : null });
    }
};

export default endpoint;
