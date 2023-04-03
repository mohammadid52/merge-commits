import {Card, CardProps, theme} from 'antd';

import Buttons from '@components/Atoms/Buttons';
import React from 'react';
import {MdOutlineKeyboardBackspace} from 'react-icons/md';
import {useHistory} from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: CardProps['title'];
  subtitle?: string;
  footer?: React.ReactNode;
  extra?: React.ReactNode;
  type?: CardProps['type'];
  onBack?: () => void;
}

const {useToken} = theme;

const PageLayout = ({
  children,
  footer = null,
  extra,
  title,
  subtitle,
  type,
  onBack
}: PageLayoutProps) => {
  const history = useHistory();
  const {token} = useToken();

  return (
    <div className="px-2 py-8 md:px-4 lg:p-8">
      <Card
        bordered={type === 'inner' ? true : false}
        type={type}
        title={
          <div className="flex items-center">
            <Buttons
              size="large"
              variant="text"
              onClick={onBack ?? history.goBack}
              Icon={MdOutlineKeyboardBackspace}
            />
            <h1
              style={{
                color: token.colorText,
                fontSize: token.fontSizeHeading5,
                fontWeight: 500
              }}>
              {title}
            </h1>
          </div>
        }
        extra={extra}>
        {children}
      </Card>
      {footer}
    </div>
  );
};

export default PageLayout;
