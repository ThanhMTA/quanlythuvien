import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { Client as MinioClient } from 'minio';
import dotenv from "dotenv";
const router = express.Router();
const app = express();
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

        // Kiểm tra xem hình ảnh có tồn tại trên Minio không
        const stat = await minioClient.statObject('thanh', imageName);
        
        // Nếu hình ảnh tồn tại, đọc nội dung và gửi về client
        const dataStream = await minioClient.getObject('thanh', imageName);

        // Thiết lập header và gửi dữ liệu về client
        res.setHeader('Content-Type', 'image/jpeg'); // Điều chỉnh loại hình ảnh tùy theo loại file
        dataStream.pipe(res);
    } catch (err) {
        console.log('Error occurred while retrieving image:', err);
        if (err.code === 'NoSuchKey') {
            res.status(404).send('Image not found');
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}


app.get('/images/:imageName', getImage);
async function uploadImageToMinio(bucketName, filePath, fileName) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const fileSize = fs.statSync(filePath).size;

        minioClient.putObject(bucketName, fileName, fileStream, fileSize, (err, etag) => {
            if (err) {
                console.error('Error occurred while uploading image to Minio:', err);
                reject(err);
            } else {
                console.log('Image uploaded successfully to Minio.');
                resolve();
            }
        });
    });
}

// Route để xử lý yêu cầu tải lên ảnh
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const bucketName = 'thanh'; // Tên bucket trong Minio
        const fileName = file.originalname; // Tên file sẽ được lưu trữ trong Minio
        const filePath = file.path; // Đường dẫn đến file tạm thời

        await uploadImageToMinio(bucketName, filePath, fileName);

        // Xóa tệp tạm thời sau khi đã tải lên thành công
        fs.unlinkSync(filePath);

        res.status(200).send('Image uploaded to Minio successfully.');
    } catch (err) {
        console.error('Error occurred while uploading image:', err);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
