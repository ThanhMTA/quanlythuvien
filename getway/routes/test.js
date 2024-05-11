import React, { useState } from 'react';
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

const UploadImage = () => {
    // const [selectedFile, setSelectedFile] = useState(null);

    // const handleFileChange = (event) => {
    //     setSelectedFile(event.target.files[0]);
    // };

    // const uploadToMinio = () => {
    //     if (selectedFile) {
    //         const metaData = {
    //             'Content-Type': selectedFile.type,
    //             'X-Amz-Meta-Testing': 1234
    //         };

    //         minioClient.putObject('bucketbook', selectedFile.name, selectedFile, metaData, function (err, etag) {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //             console.log('Upload success: ', etag);
    //         });
    //     }
    // };

    return (
        <>
            <div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={uploadToMinio}>Upload</button>
            </div>
        </>

    );
}
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
export default UploadImage;
