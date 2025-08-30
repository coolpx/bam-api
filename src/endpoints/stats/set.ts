import prisma from '../../modules/prisma';
import { isValidBamStat } from '../../modules/stats';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/stats/:userId/:stat/set',
    method: 'post',
    async handler(req, res) {
        const { userId, stat } = req.params;
        const { amount } = req.body;

        if (
            !userId ||
            !stat ||
            !isValidBamStat(stat) ||
            !amount ||
            typeof amount !== 'number'
        ) {
            res.status(400).json({
                success: false,
                error: 'Invalid parameters'
            });
            return;
        }

        await prisma.playerLeaderboardStats.update({
            where: { userId: BigInt(userId) },
            data: { [stat]: amount }
        });

        res.json({ success: true });
    }
};

export default endpoint;
