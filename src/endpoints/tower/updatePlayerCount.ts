import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/tower/updatePlayerCount',
    method: 'post',
    async handler(req, res) {
        const { id, playerCount } = req.body;

        if (!id || !playerCount || !parseInt(playerCount)) {
            return res.json({ success: false, error: 'Invalid input' });
        }

        const tower = await prisma.tower.update({
            where: { id },
            data: {
                playerCount: parseInt(playerCount),
                playerCountUpdated: new Date()
            }
        });

        res.json({ success: true, tower });
    }
};

export default endpoint;
