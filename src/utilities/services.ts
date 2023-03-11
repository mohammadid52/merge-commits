// import AWS from 'aws-sdk';
import { Storage } from "@aws-amplify/storage";
import awsconfig from "../aws-exports";

// ~~~~~~~ OPTIMIZED MODULE IMPORTS ~~~~~~ //

// ~~~~~~~~~~ CLIENT CONSTRUCTOR ~~~~~~~~~ //

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
          console.error("Error in fetching file to s3", err);
          reject(err);
        });
    });
  }
  return "";
};

export const deleteImageFromS3 = (key: string) => {
  // Remove image from bucket
  return new Promise((resolve, reject) => {
    Storage.remove(key)
      .then((result) => {
        console.log("deleted: ", key);
        resolve(result);
      })
      .catch((err) => {
        console.error(err.message);

        reject(err);
      });
  });
};

export const getImageFromS3Static = (
  key: string,
  isPrivate?: boolean
): string => {
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
  return "";
};
