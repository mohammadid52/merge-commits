import {initials, stringToHslColor} from '@utilities/strings';
import {Avatar} from 'antd';

const Placeholder = ({
  name = ' ',
  size = 'w-10 h-10 md:w-12 md:h-12',
  textSize,
  firstName = '',
  lastName = '',
  image = null
}: {
  name?: string;
  textSize?: string;
  className?: string;
  size?: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
}) => {
  if (image) {
    return (
      <div className={`${size} rounded-full flex justify-center items-center`}>
        <img
          src={image}
          className="rounded-full w-full h-full  customShadow bg-gray-500"
        />
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
