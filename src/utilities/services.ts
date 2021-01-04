import Storage from '@aws-amplify/storage';

// get image url from s3 Bucket

export const getImageFromS3 = (key: string) => {
  const bucketname = Storage._config.AWSS3.bucket;
  const bucketRegion = Storage._config.AWSS3.region;
  if (bucketname) {
    return `https://${bucketname}.s3.${bucketRegion}.amazonaws.com/public/${key}`;
  }
  return new Promise((resolve, reject) => {
    Storage.get(key).then((result: string) => {
      // console.log('File successfully fetched from s3')
      resolve(result)
    }).catch(err => {
      console.log('Error in fetching file to s3', err)
      reject(err)
    })
  });
}

