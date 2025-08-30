import prisma from '../../modules/prisma';
import { isValidBamStat } from '../../modules/stats';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/stats/sorted/:stat',
    method: 'get',
    async handler(req, res) {
        const { stat } = req.params;
        if (!stat || !isValidBamStat(stat)) {
            res.status(400).json({
                success: false,
                error: 'Invalid parameters'
            });
            return;
        }

        const sortedStats = await prisma.playerLeaderboardStats.findMany({
            orderBy: {
                [stat]: 'desc'
            },
            take: 50,
            select: {
                userId: true,
                [stat]: true
            }
        });

        res.json({ 
            success: true, 
            sortedStats: sortedStats.map(s => ({
                userId: String(s.userId),
                [stat]: s[stat as keyof typeof s]
            }))
        });
    }
};

export default endpoint;
