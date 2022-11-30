// import {BsFillInfoCircleFill} from 'react-icons/bs';
import useAuth from '@customHooks/useAuth';
import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import {Role} from 'API';
import SignOutButton from 'components/Auth/SignOut';
import React, {Fragment} from 'react';
import {FiUser} from 'react-icons/fi';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {VscChecklist} from 'react-icons/vsc';
import {useHistory} from 'react-router-dom';
import {getImageFromS3Static} from 'utilities/services';
import {initials, stringToHslColor} from 'utilities/strings';
import LocationBadge from '../Admin/Institutons/EditBuilders/LocationBadge';
import UserRole from '../Admin/UserManagement/UserRole';

interface IDropDownMenu {
  firstName: string;
  lastName: string;
  role: Role | string;
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
  updateAuthState
}: IDropDownMenu) => {
  const history = useHistory();

  const {onDemand} = useAuth();

  if (firstName && lastName && theme) {
    return (
      <Menu
        as="div"
        data-cy="dropdown-button"
        className="relative inline-block text-left w-auto">
        {({open}) => (
          <>
            <div>
              <Menu.Button
                className={`${
                  open ? 'iconoclast:bg-main curate:bg-main' : ''
                } hover:bg-gray-400 hover:text-gray-700 inline-flex justify-center w-full px-2 py-1 text-sm font-medium ${
                  theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
                } rounded-full 
                
                hover:bg-gray-400
                bg-opacity-20 hover:bg-opacity-30

                 
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 drop-down-group ease-in-out transform  text-gray-700`}>
                <div className="w-auto  inline-flex items-center">
                  <div className="w-8 h-8 2xl:w-12 2xl:h-12">
                    {image ? (
                      <img
                        className="inline-block rounded-full border-2 border-gray-400 w-8 h-8 2xl:w-12 2xl:h-12"
                        // style={{width: 48, height: 48}}
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
                          textShadow: '0.1rem 0.1rem 2px #423939b3'
                        }}
                        className="rounded-full flex justify-center items-center text-xs text-white h-full font-sans">
                        {`${initials(firstName, lastName)}`}
                      </div>
                    )}
                  </div>

                  {/* <span>{[firstName, lastName].join(' ')}</span> */}
                  <ChevronDownIcon
                    className="w-6 dropdown-arrow h-6 2xl:w-8 2xl:h-8 text-violet-200 hover:text-violet-100"
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
              <Menu.Items className="absolute right-1 w-56 mt-1 origin-top-right bg-white divide-y divide-gray-100 rounded-xl customShadow focus:outline-none cursor-pointer z-max">
                <div className="px-2 py-1 customShadow">
                  <Menu.Item key={'role'}>
                    <div className="p-4 border-b-0 border-gray-400">
                      <span>
                        {[firstName, lastName].join(' ')}
                        <br />
                        {role === 'ST' ? (
                          <div className="w-auto mb-1">
                            <UserRole role={role} />
                          </div>
                        ) : null}
                        <LocationBadge onDemand={onDemand} />
                      </span>
                    </div>
                  </Menu.Item>
                  <Menu.Item data-cy="dropdown-item-profile" key={'profile-1'}>
                    <div
                      onClick={() => history.push('/dashboard/profile')}
                      className="mt-2 flex-shrink-0  flex border-t p-2 px-4 hover:iconoclast:bg-400 hover:curate:bg-400 hover:text-white rounded-full">
                      <div className="flex-shrink-0 group block">
                        <div className="flex items-center">
                          <IconContext.Provider
                            value={{
                              size: '24px',
                              className: 'w-auto mr-1'
                            }}>
                            <FiUser className="cursor-pointer" />
                          </IconContext.Provider>
                          <p className="text-sm ml-2 font-medium">Edit Profile</p>
                        </div>
                      </div>
                    </div>
                  </Menu.Item>
                  <Menu.Item key={'profile-2'}>
                    <div
                      onClick={() => history.push('/dashboard/test-cases')}
                      className="flex-shrink-0 mt-2 flex border-t p-2 px-4 hover:iconoclast:bg-400 hover:curate:bg-400 hover:text-white rounded-full">
                      <div className="flex-shrink-0 group block">
                        <div className="flex items-center">
                          <IconContext.Provider
                            value={{
                              size: '24px',
                              className: 'w-auto mr-1'
                            }}>
                            <VscChecklist className="cursor-pointer" />
                          </IconContext.Provider>
                          <p className="text-sm ml-2 font-medium">Test Cases</p>
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
