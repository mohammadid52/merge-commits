import Highlighted from '@components/Atoms/Highlighted';
import Placeholder from '@components/Atoms/Placeholder';
import {getImageFromS3} from '@utilities/services';
import React, {useEffect, useState} from 'react';

const InstituteName = ({
  image,
  name,
  searchTerm,
  id
}: {
  image: string;
  searchTerm: string;
  name: string;
  id: string;
}) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(image);
      setImageUrl(imageUrl);
    }

    if (!Boolean(imageUrl)) {
      getUrl();
    }
  }, [image, imageUrl]);

  return (
    <div className="flex hover:underline cursor-pointer hover:theme-text:400  items-center">
      <div className="flex-shrink-0 h-10 w-10 flex items-center">
        {Boolean(image && imageUrl) ? (
          <img src={imageUrl} className="h-8 w-8 rounded-full" />
        ) : (
          <Placeholder name={name} size="h-8 w-8 rounded-full" />
        )}
      </div>
      <div className="ml-2">
        <Highlighted text={name} highlight={searchTerm} />
      </div>
    </div>
  );
};

export default InstituteName;
