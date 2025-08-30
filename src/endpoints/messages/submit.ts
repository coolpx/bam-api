import prisma from '../../modules/prisma';
import { Endpoint } from '../../types';

const endpoint: Endpoint = {
    url: '/v2/messages/submit',
    method: 'post',
    async handler(req, res) {
        const { content, senderId, senderName } = req.body;

        if (!content || !senderId || !senderName) {
            res.status(400).json({
                success: false,
                error: 'Invalid parameters'
            });
            return;
        }

        const message = await prisma.message.create({
            data: { content, senderId: BigInt(senderId), senderName }
        });

        res.json({ success: true, message });
    }
};

export default endpoint;
