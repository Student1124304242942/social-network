import { BlobServiceClient } from "@azure/storage-blob";
import { NextApiRequest, NextApiResponse } from "next";

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.BLOB_YUNUS_SOCIAL_NETWORK_READ_WRITE_TOKEN!);
const container = 'images';

async function checkConnection() {
    try {
        await blobServiceClient.getAccountInfo();
        alert('ffdd');
        return true;
    } catch (error) {
        console.error('Ошибка подключения к аккаунту Azure Blob Storage:', error);
        return false;
    }
}

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: 'Изображение не предоставлено' });
        }
        const isConnected = await checkConnection();
        if (!isConnected) {
            alert('fdfsdf')
            return res.status(500).json({ error: 'Не удалось подключиться к Azure Blob Storage' });
        }
        try {
            const fileName = `image_${Date.now()}.png`;  
            const containerClient = blobServiceClient.getContainerClient(container);
            await containerClient.createIfNotExists();
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            await blockBlobClient.upload(Buffer.from(image, 'base64'), Buffer.byteLength(image, 'base64'));
            const resultUrl = blockBlobClient.url;

            return res.status(200).json({ url: resultUrl });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Ошибка загрузки изображения' });
        }
    } else {
        return res.status(405).json({ error: 'Метод не разрешен' });
    }
}

 