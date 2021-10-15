import AWS from 'aws-sdk';
import Storage from '@aws-amplify/storage';
import awsconfig from '../aws-exports';
import awsmobile from '../aws-exports';

AWS.config.update({
  region: awsmobile.aws_cognito_region,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsmobile.aws_cognito_identity_pool_id,
  }),
});

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
    return new Promise((resolve, reject) => {
      new AWS.S3().listObjectsV2(
        {
          Bucket: awsconfig.aws_user_files_s3_bucket,
          Prefix: `public/${key}/`,
          MaxKeys: limit,
          StartAfter: startAfter,
        },
        function (err, data) {
          // an error occurred
          if (err) {
            reject(err);
          } else {
            resolve(data);
          } // successful response
        }
      );
    });

    // const result = await Storage.list(`${key}/`, {
    //   // maxKeys: 2,
    // });
  } catch (error) {
    return {};
  }
};
