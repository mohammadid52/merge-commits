import {Storage} from '@aws-amplify/storage';

export const uploadImageToS3 = async (file: any, key: string, type: string) => {
  // Upload file to s3 bucket

  try {
    const result = await Storage.put(key, file, {
      contentType: type,
      acl: 'public-read',
      ContentEncoding: 'base64',
      progressCallback: ({loaded, total}: any) => {}
    });

    console.log('New profile image uploaded to s3 successfully: ', result);
    return result;
  } catch (error) {
    console.log('Error in uploading file to s3', {file, key, type}, error);
  }
};

export const deleteImageFromS3 = async (key: string) => {
  // Remove image from bucket

  try {
    await Storage.remove(key);
    console.log('File with key: ', key, ' deleted successfully');
  } catch (error) {
    console.log('Error in deleting file from s3', {key}, error);
  }
};
