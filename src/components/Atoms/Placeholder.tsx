import {initials} from '@utilities/strings';
import {Avatar} from 'antd';

const colors = [
  {bg: '#ef4444', text: '#fee2e2'},
  {bg: '#f97316', text: '#ffedd5'},
  {bg: '#f59e0b', text: '#fef3c7'},
  {bg: '#eab308', text: '#fef9c3'},
  {bg: '#84cc16', text: '#ecfccb'},
  {bg: '#10b981', text: '#dcfce7'},
  {bg: '#22c55e', text: '#d1fae5'},
  {bg: '#14b8a6', text: '#ccfbf1'},
  {bg: '#06b6d4', text: '#cffafe'},
  {bg: '#0ea5e9', text: '#e0f2fe'},
  {bg: '#3b82f6', text: '#dbeafe'},
  {bg: '#6366f1', text: '#e0e7ff'},
  {bg: '#8b5cf6', text: '#ede9fe'},
  {bg: '#a855f7', text: '#f3e8ff'},
  {bg: '#d946ef', text: '#fae8ff'},
  {bg: '#ec4899', text: '#fce7f3'},
  {bg: '#f43f5e', text: '#ffe4e6'}
];

const pickRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

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

    const color = pickRandomColor();
    return (
      <Avatar
        className={`${size} ${textSize} flex items-center justify-center`}
        style={{background: color.bg, color: color.text}}>
        {_f && initials(_f, _l)}
      </Avatar>
    );
  }
};

export default Placeholder;
