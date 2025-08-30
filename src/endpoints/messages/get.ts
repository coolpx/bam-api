import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/messages',
    method: 'get',
    async handler(req, res) {
        const messages = await prisma.message.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 1000 * 15)
                }
            }
        });

        const formattedMessages = messages.map(msg => ({
            ...msg,
            senderId: msg.senderId.toString()
        }));

        res.json({ success: true, messages: formattedMessages });
    }
};

export default endpoint;
