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
      async uploadFile (file) {
        try {
          const data = await this.s3
            .upload({
              ...this.defaultParams,
              Key: `${file.filename}`,
              Body: fileStream, //modificar para pegar de onde tem os dados do arquivo
              ContentType: file.mimetype
            })
            .promise();
          return Promise.resolve(data.Location);
        } catch (err) {
          throw err;
        }
      }
}

module.exports = new UploadController();
