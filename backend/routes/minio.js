import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { Client as MinioClient } from 'minio';
import dotenv from "dotenv";
const router = express.Router();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const minioClient = new MinioClient({
    endPoint: 'localhost',
    port: 9000,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    useSSL: true,
    caPath: 'E:/setup/minio/certs/public.crt', // Path to CA certificate file
});
const file = '../front-end/src/images/cover_not_found.jpg'

// Make a bucket called europetrip.

async function getImage(req, res) {
    try {
        const imageName = req.params.imageName;
        try {
            const stat = await minioClient.statObject('bucketbook', imageName);

            // Nếu hình ảnh tồn tại, đọc nội dung và gửi về client
            const dataStream = await minioClient.getObject('bucketbook', imageName);

            // Thiết lập header và gửi dữ liệu về client
            res.setHeader('Content-Type', 'image/jpeg'); // Điều chỉnh loại hình ảnh tùy theo loại file
            dataStream.pipe(res);
        } catch {
            const defaultImageUrl = 'i-love-you-kawaii-7680x4320-11020.jpg';
            res.redirect(defaultImageUrl);
        }
        // Kiểm tra xem hình ảnh có tồn tại trên Minio không

    } catch (err) {
        console.log('Error occurred while retrieving image:', err);
        if (err.code === 'NoSuchKey') {
            // Nếu không tìm thấy hình ảnh, trả về hình ảnh mặc định

        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

router.get('/images/:imageName', getImage);
export default router;