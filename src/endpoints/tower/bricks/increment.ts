import prisma from '../../../modules/prisma';
import { Endpoint } from '../../../types';

const endpoint: Endpoint = {
    url: '/v2/tower/:towerId/bricks/increment/:amount',
    method: 'get',
    async handler(req, res) {
        const { towerId, amount } = req.params;

        if (!amount || typeof amount !== 'number') {
            return res.json({ success: false, error: 'Invalid amount' });
        }

        const tower = await prisma.tower.update({
            where: {
                id: towerId || 'main'
            },
            data: {
                bricks: {
                    increment: amount
                }
            }
        });

        res.json({ success: true, bricks: tower.bricks });
    }
};

export default endpoint;
