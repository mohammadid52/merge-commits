import React, {useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  getImagesFromS3Folder,
  getImageFromS3Static,
} from '../../../../utilities/services';
import Loader from '../../../Atoms/Loader';

const limit = 10;

const ImageGallery = ({basePath, onSelectImage}: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<any>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  useEffect(() => {
    fetchImagesFromS3();
  }, []);

  const fetchImagesFromS3 = async (startAfter: string = '') => {
    const response: any = await getImagesFromS3Folder(basePath, startAfter, limit);
    setImages((prevImages: any) => [
      ...prevImages,
      ...response.Contents,
    ]);
    setHasMore(response.IsTruncated);
    setLoading(false);
  };

  const onLoadMore = () => {
    fetchImagesFromS3(images[images.length-1].key);
  }
  return (
    <div id="scrollableDiv" className="h-84 overflow-auto">
      {loading ? <Loader /> : null}
      {/*Put the scroll bar always on the bottom*/}
      <InfiniteScroll
        dataLength={images.length}
        next={onLoadMore}
        hasMore={hasMore}
        loader={images.length >= limit ? <h4>Loading...</h4> : null}
        scrollableTarget="scrollableDiv">
        <div className="grid grid-cols-5 gap-1">
          {images.map((image: any, index: number) => {
            const imageKey: string = image.Key.split('public/')[1];
            return (
              <div
                key={index}
                className={`w-48 h-44 border-0 border-gray-400 flex items-center`}
                onClick={() => onSelectImage(imageKey)}>
                <img
                  className="mx-auto cursor-pointer"
                  width={'auto'}
                  height={'auto'}
                  src={getImageFromS3Static(imageKey)}
                  alt="Content image"
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ImageGallery;
