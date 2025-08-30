import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/tower/updatePlayers',
    method: 'post',
    async handler(req, res) {
        const { id, players } = req.body;

        if (!id || !players) {
            return res.json({ success: false, error: 'Invalid input' });
        }

        const tower = await prisma.tower.update({
            where: { id },
            data: {
                players: players.toString(),
                playersUpdated: new Date()
            }
        });

        res.json({ success: true, tower });
    }
};

export default endpoint;
