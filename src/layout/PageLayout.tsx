import {Card, CardProps} from 'antd';

import Buttons from '@components/Atoms/Buttons';
import React from 'react';
import {MdOutlineKeyboardBackspace} from 'react-icons/md';
import {useHistory} from 'react-router-dom';
import InstitutionProfile from '@components/Dashboard/Admin/Institutons/InstitutionProfile';
import useAuth from '@customHooks/useAuth';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: CardProps['title'];
  subtitle?: string;
  footer?: React.ReactNode;
  extra?: React.ReactNode;
  type?: CardProps['type'];
  onBackUrl?: string;
}

// add jsDocs for this component

/**
 *
 * @example
 *
 * <PageLayout extra={<div>Button1</div>} title="Page Title">
 * <div>Page Content</div>
 * </PageLayout>
 *
 */

const PageLayout = ({
  children,
  footer = null,
  extra,
  title,

  type,
  onBackUrl
}: PageLayoutProps) => {
  const history = useHistory();
  const {user} = useAuth();
  const institute =
    user && user.associateInstitute && user?.associateInstitute[0]?.institution;

  return (
    <div className="px-2 flex flex-col items-start  gap-2 py-8 md:px-4 lg:p-8">
      <Buttons
        Icon={MdOutlineKeyboardBackspace}
        label={'Go back'}
        // variant="text"

        onClick={() => {
          if (onBackUrl) {
            history.push(onBackUrl);
          } else {
            history.goBack();
          }
        }}
        variant="link"
      />
      <Card
        className="w-full"
        bordered={type === 'inner' ? true : false}
        type={type}
        title={title}
        extra={extra}>
        {children}
        <InstitutionProfile institute={institute} />
      </Card>
      {footer}
    </div>
  );
};

export default PageLayout;
