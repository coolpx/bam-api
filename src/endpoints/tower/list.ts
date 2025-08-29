import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/tower/list',
    method: 'get',
    async handler(req, res) {
        const towers = await prisma.tower.findMany({
            orderBy: { bricks: 'desc' },
            take: 10
        });

        res.json({ success: true, towers });
    }
};

export default endpoint;
