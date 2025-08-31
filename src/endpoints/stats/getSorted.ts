import prisma from '../../modules/prisma';
import { isValidBamStat } from '../../modules/stats';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/stats/getSorted/:stat',
    method: 'get',
    async handler(req, res) {
        const { stat } = req.params;
        let { amount } = req.query;
        let take: number;

        if (!stat || !isValidBamStat(stat)) {
            res.status(400).json({
                success: false,
                error: 'Invalid parameters'
            });
            return;
        }

        if (!amount || !parseInt(amount.toString())) {
            take = 50;
        } else {
            take = parseInt(amount.toString());
        }

        const sortedStats = await prisma.playerLeaderboardStats.findMany({
            orderBy: {
                [stat]: 'desc'
            },
            take,
            select: {
                userId: true,
                [stat]: true
            }
        });

        res.json({
            success: true,
            sortedStats: sortedStats.map((s) => ({
                userId: String(s.userId),
                [stat]: s[stat as keyof typeof s]
            }))
        });
    }
};

export default endpoint;
