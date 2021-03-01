import AWS from 'aws-sdk';
import fs from 'fs';

class UploadController {
    constructor () {
        this.s3 = new AWS.S3({
          accessKeyId: process.env.KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        });
        this.defaultParams = {
          Bucket: process.env.BUCKET
        };
      }
      async uploadFile (fileStream, name, extension = 'zip') {
        try {
          const data = await this.s3
            .upload({
              ...this.defaultParams,
              Key: `${name}.${extension}`,
              Body: fileStream,
              ContentType: 'application/json'
            })
            .promise();
          return Promise.resolve(data.Location);
        } catch (err) {
          throw err;
        }
      }
}

module.exports = new UploadController();

const file = fs.createReadStream('./pic.json');

new S3FileUploader().uploadFile(file, 'pic', 'json');
