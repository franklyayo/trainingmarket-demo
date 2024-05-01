const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();
class FileHandlerService {
  constructor() {
    AWS.config.update({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECURITY_ACCESS_KEY,
    });
  }

  async uploadToS3(file) {
    try {
      const s3 = new AWS.S3();
      const bucketName = process.env.BUCKET_NAME;
      const params = {
        Bucket: bucketName,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();

      return uploadResult;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

module.exports = FileHandlerService;
