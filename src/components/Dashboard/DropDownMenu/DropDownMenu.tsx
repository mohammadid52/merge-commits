// import {BsFillInfoCircleFill} from 'react-icons/bs';
import SignOutButton from '@components/Auth/SignOut';
import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import {getImageFromS3Static} from '@utilities/services';
import {getUserRoleString, initials, stringToHslColor} from '@utilities/strings';
import React, {Fragment} from 'react';
import {FiUser} from 'react-icons/fi';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory} from 'react-router-dom';

interface IDropDownMenu {
  firstName: string;
  lastName: string;
  role: string;
  image: string;
  theme: string;
  updateAuthState: Function;
}

const DropDownMenu = ({
  firstName,
  lastName,
  role,
  image,
  theme,
  updateAuthState,
}: IDropDownMenu) => {
  const history = useHistory();

  if (firstName && lastName && theme) {
    return (
      <Menu as="div" className="relative inline-block text-left w-auto">
        {({open}) => (
          <>
            <div>
              <Menu.Button
                className={`${
                  open ? 'bg-indigo-300 text-indigo-700' : ''
                } hover:bg-gray-400 hover:text-gray-700 inline-flex justify-center w-full px-4 py-2 text-sm font-medium ${
                  theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
                } rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 ease-in-out transform hover:scale-105 text-gray-700`}>
                <div className="w-auto inline-flex items-center">
                  <div className="w-12 h-12">
                    {image ? (
                      <img
                        className="inline-block rounded-full border-2 border-gray-400"
                        style={{width: 48, height: 48}}
                        src={getImageFromS3Static(image)}
                        alt=""
                      />
                    ) : (
                      <div
                        style={{
                          /* stylelint-disable */
                          background: `${
                            firstName
                              ? stringToHslColor(firstName + ' ' + lastName)
                              : '#272730'
                          }`,
                          textShadow: '0.1rem 0.1rem 2px #423939b3',
                        }}
                        className="rounded flex justify-center items-center text-xs text-white h-full font-sans">
                        {`${initials(firstName, lastName)}`}
                      </div>
                    )}
                  </div>

                  {/* <span>{[firstName, lastName].join(' ')}</span> */}
                  <ChevronDownIcon
                    className="w-8 h-8 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-1 w-52 mt-1 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none cursor-pointer z-max">
                <div className="px-1 py-1 shadow-lg">
                  <Menu.Item key={'role'}>
                    <div className="p-4 border-b-0 border-gray-400">
                      <span>
                        {[firstName, lastName].join(' ')} ({getUserRoleString(role)})
                      </span>
                    </div>
                  </Menu.Item>
                  <Menu.Item key={'profile'}>
                    <div
                      onClick={() => history.push('/dashboard/profile')}
                      className="flex-shrink-0 flex border-t p-4 hover:bg-indigo-200 rounded-md">
                      <div className="flex-shrink-0 group block">
                        <div className="flex items-center">
                          <IconContext.Provider
                            value={{
                              size: '24px',
                              className: 'w-auto mr-1',
                            }}>
                            <FiUser className="cursor-pointer" />
                          </IconContext.Provider>
                          <p className="text-sm ml-2 font-medium">Edit Profile</p>
                        </div>
                      </div>
                    </div>
                  </Menu.Item>
                  <Menu.Item key={'logout'}>
                    <SignOutButton updateAuthState={updateAuthState} />
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    );
  } else {
    return null;
  }
};

export default React.memo(DropDownMenu);
