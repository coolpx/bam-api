import prisma from '../../../modules/prisma';
import { Endpoint } from '../../../types';

const endpoint: Endpoint = {
    url: '/v2/tower/:towerId/bricks',
    method: 'get',
    async handler(req, res) {
        const { towerId } = req.params;

        const tower = await prisma.tower.findUnique({
            where: {
                id: towerId || 'main'
            }
        });

        res.json(
            tower
                ? { success: true, bricks: tower.bricks }
                : { success: false, error: 'Tower not found' }
        );
    }
};

export default endpoint;
