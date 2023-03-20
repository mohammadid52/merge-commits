import Buttons from '@components/Atoms/Buttons';
import Placeholder from '@components/Atoms/Placeholder';
import SignOutButton from '@components/Auth/SignOut';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import useAuth from '@customHooks/useAuth';
import {getImageFromS3Static} from '@utilities/services';
import {Divider, Dropdown, Space, theme} from 'antd';
import {ItemType} from 'rc-menu/lib/interface';
import React from 'react';
import UserRole from '../Admin/UserManagement/UserRole';
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
          label: getLink('/dashboard/test-cases', TABS['TEST_CASES']),
          key: TABS['TEST_CASES'],
          href: '/dashboard/test-cases'
        },
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
              <UserRole role={role} />
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
                src={getImageFromS3Static(image)}
                alt=""
              />
            ) : (
              <Placeholder firstName={firstName} lastName={lastName} size="h-6 w-6" />
            )}
          </div>
        }
      />
    </Dropdown>
    // <Popover
    //   content={content}
    //   trigger="click"
    //   placement="bottomRight"
    //   title={
    // <span className="flex">
    //   {[firstName, lastName].join(' ')}

    //   <div className="w-auto ml-2">
    //     <UserRole role={role} />
    //   </div>
    // </span>
    //   }>
    // <Buttons
    //   variant="link"
    //   insideElement={
    //     <div className="w-6 h-6">
    //       {image ? (
    //         <img
    //           className="inline-block rounded-full border-0 theme-border w-6 h-6"
    //           // style={{width: 48, height: 48}}
    //           src={getImageFromS3Static(image)}
    //           alt=""
    //         />
    //       ) : (
    //         <Placeholder firstName={firstName} lastName={lastName} size="h-6 w-6" />
    //       )}
    //     </div>
    //   }
    // />
    // </Popover>
  );
  // if (firstName && lastName) {
  //   return (

  //     // <Menu
  //     //   as="div"
  //     //   data-cy="dropdown-button"
  //     //   className="relative inline-block text-left w-auto">
  //     //   {({open}) => (
  //     //     <>
  //     //       <div>
  //     //         <Menu.Button
  //     //           className={`${open ? 'active' : ''} ${
  //     //             open ? 'theme-bg' : ''
  //     //           } theme-border:500 border-0 hover:theme-bg:500 theme-bg:200 theme-text:600 hover:text-gray-700 inline-flex justify-center w-full px-2 text-sm font-medium rounded-full  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 drop-down-group ease-in-out transform  `}>
  //     //           <div className="w-auto my-1 inline-flex items-center">
  //  v>

  //     //             {/* <span>{[firstName, lastName].join(' ')}</span> */}
  //     //             <ChevronDownIcon
  //     //               className="w-6 dropdown-arrow h-6 2xl:w-8 2xl:h-8 text-violet-200 hover:text-violet-100"
  //     //               aria-hidden="true"
  //     //             />
  //     //           </div>
  //     //         </Menu.Button>
  //     //       </div>
  //     //       <Transition
  //     //         as={Fragment}
  //     //         enter="transition ease-out duration-100"
  //     //         enterFrom="transform opacity-0 scale-95"
  //     //         enterTo="transform opacity-100 scale-100"
  //     //         leave="transition ease-in duration-75"
  //     //         leaveFrom="transform opacity-100 scale-100"
  //     //         leaveTo="transform opacity-0 scale-95">
  //     //         <Menu.Items className="absolute right-1 w-56 mt-1 origin-top-right bg-white divide-y divide-gray-100 rounded-xl customShadow focus:outline-none cursor-pointer z-max">
  //     //           <div className="px-2 py-1 customShadow">
  //     //             <Menu.Item key={'role'}>

  // </Menu.Item>

  //     //             <Item
  //     //               onClick={() => history.push('/dashboard/profile')}
  //     //               label={TABS['EDIT_PROFILE']}
  //     //               _key={'profile-1'}
  //     //               Icon={FiUser}
  //     //             />

  //     //             {!isStudent && (
  //     //               <Item
  //     //                 onClick={() => history.push('/dashboard/dictionary')}
  //     //                 label={TABS['DICTIONARY']}
  //     //                 _key={'dictionary'}
  //     //                 Icon={AiOutlineBook}
  //     //               />
  //     //             )}

  //     //             {checkIfAdmin() && (
  //     //               <>
  //     //                 <Item
  //     //                   onClick={() => history.push('/dashboard/test-cases')}
  //     //                   label={TABS['TEST_CASES']}
  //     //                   _key={'test-cases'}
  //     //                   Icon={VscChecklist}
  //     //                 />
  //     //                 <Item
  //     //                   onClick={() => history.push('/dashboard/errors')}
  //     //                   label={TABS['ERRORS']}
  //     //                   _key={'profile-2'}
  //     //                   Icon={VscChecklist}
  //     //                 />
  //     //                 <Item
  //     //                   onClick={() => history.push('/dashboard/upload-logs')}
  //     //                   label={TABS['UPLOAD_LOGS']}
  //     //                   _key={'profile-3'}
  //     //                   Icon={VscChecklist}
  //     //                 />
  //     //               </>
  //     //             )}
  //     //             <Menu.Item key={'logout'}>
  //     //               <SignOutButton />
  //     //             </Menu.Item>
  //     //           </div>
  //     //         </Menu.Items>
  //     //       </Transition>
  //     //     </>
  //     //   )}
  //     // </Menu>
  //   );
  // } else {
  //   return null;
  // }
};

export default React.memo(DropDownMenu);
