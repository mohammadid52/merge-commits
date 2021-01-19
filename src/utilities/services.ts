import Storage from '@aws-amplify/storage';
import awsconfig from '../aws-exports';

export const getImageFromS3 = (key: string, isPrivate?: boolean) => {
  if (key) {

    // Needs to fetch full URL to support image editing without refresh.

    // if (!isPrivate) {
    //   const bucketname = awsconfig.aws_user_files_s3_bucket;
    //   const bucketRegion = awsconfig.aws_user_files_s3_bucket_region;
    //   if (bucketname) {
    //     return `https://${bucketname}.s3.${bucketRegion}.amazonaws.com/public/${key}`;
    //   }
    // }
    return new Promise((resolve, reject) => {
      Storage.get(key).then((result: string) => {
        resolve(result);
      }).catch(err => {
        console.log('Error in fetching file to s3', err);
        reject(err);
      })
    });
  }
  return '';
}

