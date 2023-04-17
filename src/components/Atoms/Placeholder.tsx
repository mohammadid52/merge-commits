import {getImageFromS3} from '@utilities/services';
import {initials, stringToHslColor} from '@utilities/strings';
import {Avatar, Image} from 'antd';

const Placeholder = ({
  name = ' ',
  size = 'w-10 h-10 md:w-12 md:h-12',
  textSize,
  firstName = '',
  lastName = '',
  image = null,
  useAntdImage
}: {
  name?: string;
  textSize?: string;
  className?: string;
  size?: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
  useAntdImage?: boolean;
}) => {
  if (image) {
    // if image includes "https" don't use s3
    const shouldUseS3 = !image.includes('https');
    const finalImage = shouldUseS3 ? (getImageFromS3(image) as string) : image;
    console.log('🚀 ~ file: Placeholder.tsx:27 ~ finalImage:', finalImage);

    const imageClass = 'rounded-full w-full h-full  customShadow bg-medium ';
    return (
      <div className={`${size} rounded-full flex justify-center items-center`}>
        {useAntdImage ? (
          <Image src={finalImage} className={imageClass} />
        ) : (
          <img src={finalImage} className={imageClass} />
        )}
      </div>
    );
  } else {
    const [_firstName, _lastName] = name?.split(' ');

    const _f = firstName || _firstName;
    const _l = lastName || _lastName;

    return (
      <Avatar
        className={`${size} ${textSize} flex items-center justify-center`}
        style={{background: `${_f ? stringToHslColor(_f + ' ' + _l) : null}`}}>
        {_f && initials(_f, _l)}
      </Avatar>
    );
  }
};

export default Placeholder;
