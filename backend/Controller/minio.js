import { Client as MinioClient } from 'minio';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const minioClient = new MinioClient({
    endPoint: 'localhost',
    port: 9000,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin',
    useSSL: true,
    caPath: 'E:/setup/minio/certs/public.crt', // Path to CA certificate file
});
export async function uploadFileToMinio(bucketName, filePath, fileName) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const fileSize = fs.statSync(filePath).size;

        minioClient.putObject(bucketName, fileName, fileStream, fileSize, (err, etag) => {
            if (err) {
                console.error('Error occurred while uploading file to Minio:', err);
                reject(err);
            } else {
                console.log('File uploaded successfully to Minio.');
                resolve();
            }
        });
    });
}
async function getImage(req, res) {
    try {
        const imageName = req.params.imageName;

        // Kiểm tra xem hình ảnh có tồn tại trên Minio không
        const stat = await minioClient.statObject('bucketbook', imageName);

        // Nếu hình ảnh tồn tại, đọc nội dung và gửi về client
        const dataStream = await minioClient.getObject('bucketbook', imageName);

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
// lấy ảnh từ minio 
export async function getImageFromMinio(bucketName, imageName, outputPath) {
    return new Promise((resolve, reject) => {
        minioClient.getObject(bucketName, imageName, (err, dataStream) => {
            if (err) {
                console.error('Error occurred while retrieving image from Minio:', err);
                reject(err);
            } else {
                const fileStream = fs.createWriteStream(outputPath);
                dataStream.pipe(fileStream);
                fileStream.on('finish', () => {
                    console.log('Image retrieved successfully from Minio.');
                    resolve();
                });
                fileStream.on('error', (err) => {
                    console.error('Error occurred while writing image to file:', err);
                    reject(err);
                });
            }
        });
    });
}