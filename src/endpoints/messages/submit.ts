import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/messages/submit',
    method: 'post',
    async handler(req, res) {
        const { content, senderId, senderName } = req.body;

        const message = await prisma.message.create({
            data: { content, senderId, senderName }
        });

        res.json({ success: true, message });
    }
};

export default endpoint;
