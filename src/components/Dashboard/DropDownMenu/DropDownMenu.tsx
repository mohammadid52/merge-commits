import Buttons from '@components/Atoms/Buttons';
import Placeholder from '@components/Atoms/Placeholder';
import SignOutButton from '@components/Auth/SignOut';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import useAuth from '@customHooks/useAuth';
import {getImageFromS3} from '@utilities/services';
import {Divider, Dropdown, Space, theme} from 'antd';
import {ItemType} from 'rc-menu/lib/interface';
import React from 'react';
import UserRole from '../Admin/UserManagement/UserRole';
import {Role} from 'API';
const {useToken} = theme;

const getLink = (href: string, label: string) => {
  return <a href={href}>{label}</a>;
};

const DropDownMenu = () => {
  const {firstName, isStudent, lastName, image, role} = useAuth();
  const {userLanguage, checkIfAdmin} = useGlobalContext();
  const {Institute_info} = useDictionary();
  const TABS = Institute_info[userLanguage]['TABS'];

  const data = [
    {
      label: getLink('/dashboard/profile', TABS['EDIT_PROFILE']),
      key: TABS['EDIT_PROFILE'],
      href: '/dashboard/profile'
    },
    !isStudent && {
      label: getLink('/dashboard/dictionary', TABS['DICTIONARY']),
      key: TABS['DICTIONARY'],
      href: '/dashboard/dictionary'
    },

    checkIfAdmin() && {
      label: 'Admin links',
      children: [
        checkIfAdmin() && {
          label: getLink('/dashboard/errors', TABS['ERRORS']),
          key: TABS['ERRORS'],
          href: '/dashboard/errors'
        },
        checkIfAdmin() && {
          label: getLink('/dashboard/upload-logs', TABS['UPLOAD_LOGS']),
          key: TABS['UPLOAD_LOGS'],
          href: '/dashboard/upload-logs'
        }
      ]
    }
  ].filter(Boolean);

  const {token} = useToken();

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary
  };

  const menuStyle = {
    boxShadow: 'none'
  };

  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={(menu) => (
        <div style={contentStyle}>
          <Space style={{padding: 16}}>
            {[firstName, lastName].join(' ')}

            <div className="w-auto ml-2">
              <UserRole role={role || Role.ST} />
            </div>
          </Space>
          <Divider style={{margin: 0}} />
          {React.cloneElement(menu as React.ReactElement, {style: menuStyle})}
          <Divider style={{margin: 0}} />

          <Space style={{padding: '8px 16px'}}>
            <SignOutButton />
          </Space>
        </div>
      )}
      placement="bottomLeft"
      menu={{items: data as ItemType[]}}>
      <Buttons
        variant="link"
        insideElement={
          <div className="w-6 h-6">
            {image ? (
              <img
                className="inline-block rounded-full border-0 theme-border w-6 h-6"
                // style={{width: 48, height: 48}}
                src={getImageFromS3(image) as string}
                alt=""
              />
            ) : (
              <Placeholder firstName={firstName} lastName={lastName} size="h-6 w-6" />
            )}
          </div>
        }
      />
    </Dropdown>
  );
};

export default React.memo(DropDownMenu);
