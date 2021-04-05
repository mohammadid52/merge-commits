import Storage from '@aws-amplify/storage';
import awsconfig from '../aws-exports';

export const getImageFromS3 = (key: string, isPrivate?: boolean, checkAvailability:boolean=false) => {
  if (key) {

    // Needs to fetch full URL to support image editing without refresh.

    if (!isPrivate) {
      const bucketname = awsconfig.aws_user_files_s3_bucket;
      const bucketRegion = awsconfig.aws_user_files_s3_bucket_region;
      if (bucketname) {
        const url = `https://${bucketname}.s3.${bucketRegion}.amazonaws.com/public/${key}?now=${new Date}`;
        let exists = true

        if(checkAvailability){
        const  http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send(); 
          exists = http.status !== 404 && http.status !== 403; 
        }
        return exists && url
      }
    }
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

