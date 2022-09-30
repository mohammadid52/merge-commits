// import AWS from 'aws-sdk';
import {Storage} from '@aws-amplify/storage';
import awsconfig from '../aws-exports';

// ~~~~~~~ OPTIMIZED MODULE IMPORTS ~~~~~~ //
const {CognitoIdentityClient} = require('@aws-sdk/client-cognito-identity');
const {fromCognitoIdentityPool} = require('@aws-sdk/credential-providers');
const {
  S3Client,
  S3,
  ListObjectsCommand,
  PutObjectCommand
} = require('@aws-sdk/client-s3');
// const {Upload} = require('@aws-sdk/lib-storage');

// ~~~~~~~~~~ CLIENT CONSTRUCTOR ~~~~~~~~~ //
const s3Client = new S3Client({
  region: awsconfig.aws_cognito_region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({region: awsconfig.aws_cognito_region}),
    identityPoolId: awsconfig.aws_cognito_identity_pool_id
  })
});

export const _uploadImageToS3 = async (file: any, id: string, type: string) => {
  const newS3Client = new S3Client({
    region: awsconfig.aws_cognito_region,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({region: awsconfig.aws_cognito_region}),
      identityPoolId: awsconfig.aws_cognito_identity_pool_id
    })
  });

  // Upload file to s3 bucket
  // const upload = new Upload({
  //   client: newS3Client,
  //   params: {
  //     Bucket: awsconfig.aws_user_files_s3_bucket,
  //     Key: `profile_image_${id}`,
  //     Body: file,
  //     ContentType: type,
  //   },
  // });

  // return await upload.done();

  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: awsconfig.aws_user_files_s3_bucket,
      Key: `profile_image_${id}`,
      Body: file,
      ACL: 'public-read'
    });
    await newS3Client.send(uploadCommand);
  } catch (e) {
    console.error('error uploading image to s3', e);
  }

  // return new Promise((resolve, reject) => {
  //   Storage.put(`profile_image_${id}`, file, {
  //     contentType: type,
  //     ContentEncoding: 'base64',
  //   })
  //     .then((result) => {
  //       resolve(true);
  //     })
  //     .catch((err) => {
  //       console.log('Error in uploading file to s3', err);
  //       reject(err);
  //     });
  // });
};

export const getImageFromS3 = (key: string, isPrivate?: boolean) => {
  if (key) {
    // Needs to fetch full URL to support image editing without refresh.

    if (!isPrivate) {
      const bucketname = awsconfig.aws_user_files_s3_bucket;
      const bucketRegion = awsconfig.aws_user_files_s3_bucket_region;
      if (bucketname) {
        return `https://${bucketname}.s3.${bucketRegion}.amazonaws.com/public/${key}?now=${new Date()}`;
      }
    }
    return new Promise((resolve, reject) => {
      Storage.get(key)
        .then((result: string) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('Error in fetching file to s3', err);
          reject(err);
        });
    });
  }
  return '';
};

export const deleteImageFromS3 = (key: string) => {
  // Remove image from bucket
  return new Promise((resolve, reject) => {
    Storage.remove(key)
      .then((result) => {
        console.log('deleted: ', key);
        resolve(result);
      })
      .catch((err) => {
        console.error(err.message);

        reject(err);
      });
  });
};

export const getImageFromS3Static = (key: string, isPrivate?: boolean): string => {
  if (key) {
    // Needs to fetch full URL to support image editing without refresh.

    if (!isPrivate) {
      const bucketname = awsconfig.aws_user_files_s3_bucket;
      const bucketRegion = awsconfig.aws_user_files_s3_bucket_region;
      if (bucketname) {
        return `https://${bucketname}.s3.${bucketRegion}.amazonaws.com/public/${key}`;
      }
    }
  }
  return '';
};

export const getImagesFromS3Folder = async (
  key: string,
  startAfter: string = '', // where you want Amazon S3 to start listing from
  limit: number = 10
) => {
  try {
    return await s3Client.send(
      new ListObjectsCommand({
        Bucket: awsconfig.aws_user_files_s3_bucket,
        Prefix: `public/${key}/`,
        MaxKeys: limit,
        StartAfter: startAfter
      })
    );

    // return new Promise((resolve, reject) => {
    //   new AWS.S3().listObjectsV2(
    //     {
    //       Bucket: awsconfig.aws_user_files_s3_bucket,
    //       Prefix: `public/${key}/`,
    //       MaxKeys: limit,
    //       StartAfter: startAfter,
    //     },
    //     function (err, data) {
    //       // an error occurred
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(data);
    //       } // successful response
    //     }
    //   );
    // });

    // const result = await Storage.list(`${key}/`, {
    //   // maxKeys: 2,
    // });
  } catch (error) {
    console.error('getImagesFromS3Folder ', error);
  }
};
