import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/tower/create',
    method: 'post',
    async handler(req, res) {
        const { id, name, ownerId } = req.body;

        const tower = await prisma.tower.create({
            data: {
                id,
                name,
                ownerId: BigInt(ownerId)
            }
        });

        res.json({
            success: true,
            tower: {
                ...tower,
                ownerId: tower.ownerId.toString()
            }
        });
    }
};

export default endpoint;
