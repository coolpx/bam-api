import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/tower/list',
    method: 'get',
    async handler(req, res) {
        const { sort, owner } = req.query;

        // Default sort is mostBricks
        let orderBy: any = { bricks: 'desc' };
        if (sort === 'mostPlayers') {
            orderBy = { playerCount: 'desc' };
        }

        // Optional filter by owner
        const where: any = {};
        if (owner) {
            where.ownerId = parseInt(owner.toString());
        }

        const towers = await prisma.tower.findMany({
            where,
            orderBy,
            take: 10
        });

        res.json({ success: true, towers });
    }
};

export default endpoint;
