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

        // Optional filter by owner (comma-separated list of user IDs)
        const where: any = {};
        if (owner) {
            const ownerIds = owner
                .toString()
                .split(',')
                .map((id) => parseInt(id.trim()))
                .filter((id) => !isNaN(id));
            if (ownerIds.length > 0) {
                where.ownerId = { in: ownerIds };
            }
        }

        // Set take limit: no limit when filtering by owner
        let take: number | undefined = 10;
        if (where.ownerId) {
            take = undefined;
        }

        const options: any = { where, orderBy };
        if (take !== undefined) {
            options.take = take;
        }

        const towers = (await prisma.tower.findMany(options)).map((tower) => {
            if (
                tower.id != 'main' &&
                tower.playersUpdated < new Date(Date.now() - 10 * 1000)
            ) {
                tower.players = '';
            }
            return tower;
        });

        res.json({ success: true, towers });
    }
};

export default endpoint;
