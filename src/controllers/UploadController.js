const AWS = require('aws-sdk');

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
          Body: file.buffer,
          ContentType: file.mimetype
        })
        .promise();
      return Promise.resolve(data.Location);
    } catch (err) {
      throw err;
    }
  }

  getFile (file, expires=604800) {
    try {
      return new Promise((resolve, reject) => {
        this.s3.getSignedUrl(
          'getObject',
          {
            ...this.defaultParams,
            Key: `${file.filename}`,
            Expires: expires,
          },
          (err, url) => {
            if (err) throw new Error(err);
            resolve(url);
          },
        );
      }); 
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UploadController();
