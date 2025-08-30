import prisma from '../../modules/prisma';
import { isValidBamStat } from '../../modules/stats';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/stats/:userId/:stat',
    method: 'get',
    async handler(req, res) {
        const { userId, stat } = req.params;
        if (!userId || !stat || !isValidBamStat(stat)) {
            res.status(400).json({
                success: false,
                error: 'Invalid parameters'
            });
            return;
        }

        const stats = await prisma.playerLeaderboardStats.findUnique({
            where: { userId: BigInt(userId) }
        });

        res.json(
            stats
                ? {
                      success: true,
                      statValue: stats[stat as keyof typeof stats]
                  }
                : { success: false, error: 'User not found' }
        );
    }
};

export default endpoint;
