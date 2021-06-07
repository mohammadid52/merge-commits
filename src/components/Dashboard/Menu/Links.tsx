import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {GlobalContext} from '../../../contexts/GlobalContext';
// Iconz
import {IoMdDisc} from 'react-icons/io';
import {FaAppleAlt} from 'react-icons/fa';
import {AiOutlineUsergroupAdd, AiOutlineBook} from 'react-icons/ai';
import {HiOutlineOfficeBuilding} from 'react-icons/hi';
import {IoIosPeople, IoMdBuild} from 'react-icons/io';
import {IoBarChart, IoBookOutline} from 'react-icons/io5';
import {BsReverseLayoutSidebarReverse} from 'react-icons/bs';
import {IoIosHome} from 'react-icons/io';

import useDictionary from '../../../customHooks/dictionary';
import {getAsset} from '../../../assets';
import {findIndex} from 'lodash';

type LinkObject = {
  name: string;
  path: string;
  title?: string;
  label?: string;
};

export interface Room {
  id: string;
  classID: string;
  teacherAuthID: string;
  name: string;
}

export interface LinkProps {
  children?: React.ReactNode;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  currentPage: string;
  image?: string;
  role?: string;
  setActiveRoomName: Function;
  updateAuthState?: Function;
  setActiveRoomSyllabus: Function;
  setLessonLoading: Function;
  setSyllabusLoading: Function;
  handleRoomSelection: Function;
}

const Links: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const {state, dispatch, theme, userLanguage, clientKey} = useContext(GlobalContext);
  const {handleRoomSelection} = linkProps;

  const themeColor = getAsset(clientKey, 'themeClassNameAlt');
  const {sideBarLinksDict} = useDictionary(clientKey);
  const history = useHistory();
  const match = useRouteMatch();
  const {role} = linkProps;
  const [links, setLinks] = useState<Array<LinkObject>>([]);
  const [openItems, setOpenItems] = useState([]);

  /**
   * DISPLAY OTHER MENU ITEMS FOR
   * DIFFERENT USERS
   */
  useEffect(() => {
    userLinks(role);
    if (state.roomData?.rooms?.length > 0) {
      setOpenItems([...openItems, 'Classrooms', 'Lesson Planner']);
    }
  }, [role, state.roomData.rooms, state.activeRoom, state.currentPage]);

  const userLinks = (role: string): void => {
    switch (role) {
      case 'SUP':
        return setLinks((links) => {
          return [
            {
              title: sideBarLinksDict[userLanguage].REGISTRATION,
              name: sideBarLinksDict[userLanguage].REGISTRATION,
              label: 'Registration',
              path: 'registration',
            },
            {
              title: sideBarLinksDict[userLanguage].PEOPLE,
              name: sideBarLinksDict[userLanguage].PEOPLE,
              label: 'People',
              path: 'manage-users',
            },
            {
              title: sideBarLinksDict[userLanguage].CLASSROOM,
              name: sideBarLinksDict[userLanguage].CLASSROOM,
              label: 'Classroom',
              path: 'classroom',
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              name: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              label: 'Lesson Planner',
              path: 'lesson-planner',
            },
            {
              title: sideBarLinksDict[userLanguage].INSTITUTIONS,
              name: sideBarLinksDict[userLanguage].INSTITUTIONS,
              label: 'Institutions',
              path: 'manage-institutions',
            },
          ];
        });
      case 'ADM':
        return setLinks((links) => {
          return [
            {
              title: sideBarLinksDict[userLanguage].INSTITUTIONS,
              name: sideBarLinksDict[userLanguage].INSTITUTIONS,
              label: 'Institutions',
              path: 'manage-institutions',
              subMenuItems: [{title: 'Add New', path: 'manage-institutions/add'}],
            },
            {
              title: sideBarLinksDict[userLanguage].PEOPLE,
              name: sideBarLinksDict[userLanguage].PEOPLE,
              label: 'People',
              path: 'manage-users',
              subMenuItems: [{title: 'Add New Person', path: 'registration'}],
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_BUILDER,
              name: sideBarLinksDict[userLanguage].LESSON_BUILDER,
              label: 'Lesson Builder',
              path: 'lesson-builder',
              subMenuItems: [
                {title: 'Add New Lesson', path: 'lesson-builder/lesson/add'},
              ],
            },
            {
              title: sideBarLinksDict[userLanguage].RESEARCHANALYTICS,
              name: sideBarLinksDict[userLanguage].RESEARCHANALYTICS,
              label: 'Research & Analytics',
              path: 'csv',
            },
          ];
        });
      case 'TR':
      case 'FLW':
        return setLinks((links) => {
          return [
            {
              title: sideBarLinksDict[userLanguage].DASHBOARD,
              name: sideBarLinksDict[userLanguage].DASHBOARD,
              label: 'Dashboard',
              path: 'home',
            },
            {
              title: sideBarLinksDict[userLanguage].INSTITUTIONS,
              name: sideBarLinksDict[userLanguage].INSTITUTIONS,
              label: 'Institutions',
              path: 'manage-institutions',
            },

            {
              title: sideBarLinksDict[userLanguage].PEOPLE,
              name: sideBarLinksDict[userLanguage].PEOPLE,
              label: 'People',
              path: 'manage-users',
              subMenuItems: [{title: 'Add New Person', path: 'registration'}],
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              name: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              label: 'Lesson Planner',
              path: '',
              subMenuItems:
                state.roomData.rooms.length &&
                state.roomData.rooms.map((room: Room, i: number) => {
                  return {
                    title: room.name,
                    active:
                      room.id === state.activeRoom &&
                      state.currentPage === 'lesson-planner',
                    path: room.id,
                    onClick: (e: any) =>
                      handleRoomSelection(room.id, room.name, i, 'lesson-planner'),
                  };
                }),
            },
            {
              title: sideBarLinksDict[userLanguage].NOTICEBOARD,
              name: sideBarLinksDict[userLanguage].NOTICEBOARD,
              label: 'Noticeboard',
              path: 'noticeboard',
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_BUILDER,
              name: sideBarLinksDict[userLanguage].LESSON_BUILDER,
              label: 'Lesson Builder',
              path: 'lesson-builder',
              subMenuItems: [
                {title: 'Add New Lesson', path: 'lesson-builder/lesson/add'},
              ],
            },
            {
              title: sideBarLinksDict[userLanguage].RESEARCHANALYTICS,
              name: sideBarLinksDict[userLanguage].RESEARCHANALYTICS,
              label: 'Research & Analytics',
              path: 'csv',
            },
            {
              title: sideBarLinksDict[userLanguage].UNIVERSAL_LESSON_BUILDER,
              name: sideBarLinksDict[userLanguage].UNIVERSAL_LESSON_BUILDER,
              label: 'Universal Lesson Builder',
              path: 'universal-lesson-builder',
            },
          ];
        });
      case 'ST':
        return setLinks((links) => {
          return [
            {
              title: sideBarLinksDict[userLanguage].DASHBOARD,
              name: sideBarLinksDict[userLanguage].DASHBOARD,
              label: 'Dashboard',
              path: 'home',
            },
            {
              title: sideBarLinksDict[userLanguage].CLASSROOM,
              name: sideBarLinksDict[userLanguage].CLASSROOM,
              label: 'Classrooms',
              path: '',
              subMenuItems:
                state.roomData.rooms.length &&
                state.roomData.rooms.map((room: Room, i: number) => {
                  return {
                    title: room.name,
                    active:
                      room.id === state.activeRoom && state.currentPage === 'classroom',
                    path: room.id,
                    onClick: (e: any) =>
                      handleRoomSelection(room.id, room.name, i, 'classroom'),
                  };
                }),
            },
            {
              title: sideBarLinksDict[userLanguage].ANTHOLOGY,
              name: sideBarLinksDict[userLanguage].ANTHOLOGY,
              label: 'Anthology',
              path: 'anthology',
              subMenuItems: [],
            },
          ];
        });
      default:
        return;
    }
  };

  const isRoomLink = (linkStr: string) => {
    const isMatch = linkStr.match(
      /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/gi
    );
    if (isMatch) {
      return true;
    } else {
      return false;
    }
  };

  const handleLink = (id: any, label: string, toggle: boolean = false) => {
    const lastCharacter = match.url.charAt(match.url.length - 1);

    if (!isRoomLink(id)) {
      dispatch({type: 'UPDATE_ACTIVEROOM', payload: {data: ''}});
    }

    if (id !== '') {
      if (lastCharacter === '/') {
        const sliced = match.url.slice(0, match.url.length - 1);
        history.push(`${sliced}/${id}`);
      } else {
        history.push(`${match.url}/${id}`);
      }
      linkProps.setCurrentPage(id);
    }

    if (toggle) {
      const exists = openItems.indexOf(label) !== -1;
      if (exists) {
        setOpenItems([...openItems.filter((d) => d !== label)]);
      } else {
        setOpenItems([...openItems, label]);
      }
    }
  };

  // const pageUrlEndsWith = (pageLabel: string) => {
  //   const pageUrl = window.location.href;
  //   const lastPart = pageUrl.match(/[^/]+$/g);
  //   return lastPart.includes(pageLabel);
  // };

  // const pageUrlContains = (pageLabel: string) => {
  //   const pageUrl = window.location.href;
  //   return pageUrl.indexOf(pageLabel) !== -1;
  // };

  const getMenuIcon = (label: string, url: string, active: boolean = false) => {
    switch (label) {
      case 'People':
        return (
          <IoIosPeople
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Registration':
        return (
          <AiOutlineUsergroupAdd
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Classroom':
        return (
          <IoBookOutline
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Classrooms':
        return (
          <IoBookOutline
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Dashboard':
        return (
          <IoIosHome
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Lesson Planner':
        return (
          <FaAppleAlt
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Lesson Builder':
        return (
          <IoMdBuild
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Institutions':
        return (
          <HiOutlineOfficeBuilding
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Anthology':
        return (
          <AiOutlineBook
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Noticeboard':
        return (
          <BsReverseLayoutSidebarReverse
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      case 'Research & Analytics':
        return (
          <IoBarChart
            className={`h-4 w-4 ${
              active ? theme.textColor[themeColor] : 'sidenav_icon_inactive'
            } sidenav_icon`}
            id={url}
          />
        );
      default:
        return '';
    }
  };

  // const linkClass =
  //   'w-full h-20 text-center text-xs tracking-wider mx-auto py-4 flex flex-col items-center justify-center';
  // const dividerClass = 'w-1/2 h-1px mx-auto bg-gradient-to-r from-transparent via-white20 to-transparent';
  // const activeClass = 'bg-gray-200 text-dark-gray';

  const ellipse = (string: string = ''): string => {
    return string.length > 20 ? `${string.slice(0, 20)}...` : string;
  };

  const path = history.location.pathname;

  return (
    <div className={`link w-full h-12 z-40`}>
      {state.user.role && links && links.length > 0
        ? links.map(
            (
              link: {
                subMenuItems: any;
                name: string;
                path: string;
                label: string;
                active: boolean;
              },
              key: number
            ) => {
              const currentPath = `/dashboard/${link.path}`;
              const open =
                path === currentPath ||
                (link.subMenuItems &&
                  findIndex(
                    link.subMenuItems,
                    (d: any) => path === `/dashboard/${d.path}`
                  ) !== -1);

              const exists = openItems.indexOf(link.label) !== -1;

              const innerLinkActive = (link.subMenuItems || []).filter((d: any) => {
                const activeLink =
                  findIndex(
                    link.subMenuItems,
                    (d: any) => path === `/dashboard/${d.path}`
                  ) !== -1 || d.active;

                return activeLink;
              });

              return link.subMenuItems && link.subMenuItems.length > 0 ? (
                <div key={`link_${key}`} className={`pb-2`}>
                  <a
                    id={link.path}
                    onClick={(e) => handleLink(link.path, link.label, true)}
                    type="button"
                    className={`${
                      path === currentPath
                        ? `sidenav_main_item_active ${theme.borderColor[themeColor]}`
                        : 'border-transparent'
                    } ${
                      (open || innerLinkActive.length > 0) &&
                      'sidenav_main_item_active_color'
                    } cursor-pointer sidenav_main_item border-l-4 px-4 flex items-center py-2 text-sm font-regular`}
                    aria-controls="sub-menu-1"
                    aria-expanded="false">
                    <span className={`sidenav_icon_wrapper`}>
                      {getMenuIcon(link.label, link.path, open)}
                    </span>
                    {link.name}
                    <svg
                      className={`${
                        exists ? 'rotate-90' : 'text-gray-300'
                      }  ml-auto h-5 w-5 transform transition-colors ease-in-out duration-150`}
                      viewBox="0 0 20 20"
                      aria-hidden="true">
                      <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                    </svg>
                  </a>
                  {exists && (
                    <div className="" id="sub-menu-1">
                      {link.subMenuItems.map((d: any) => {
                        const activeLink =
                          findIndex(
                            link.subMenuItems,
                            (d: any) => path === `/dashboard/${d.path}`
                          ) !== -1 || d.active;

                        return (
                          <div key={`${d.path}_key`} className="custom_tooltip_container">
                            <a
                              id={d.path}
                              style={{paddingLeft: '3.5rem'}}
                              onClick={(e) => {
                                if (d.onClick) {
                                  d.onClick();
                                } else handleLink(d.path, link.label);
                              }}
                              className={`${
                                activeLink
                                  ? `sidenav_sub_item_active ${theme.borderColor[themeColor]}`
                                  : 'border-transparent'
                              } group sidenav_sub_item block flex cursor-pointer my-1 border-l-4 w-full px-4 items-center pr-4 py-2 text-sm font-regular`}>
                              <span className="sidenav_sub_icon_wrapper">
                                <IoMdDisc
                                  className={
                                    activeLink
                                      ? theme.textColor[themeColor]
                                      : 'sidenav_sub_icon_color'
                                  }
                                />
                              </span>
                              <span className="truncate">{d.title}</span>
                            </a>
                            <span className="custom_tooltip">{d.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={`link_${key}`}
                  id={link.path}
                  onClick={(e) => handleLink(link.path, link.label)}
                  className={`truncate px-4 mb-2 cursor-pointer sidenav_main_item group border-l-4 flex items-center py-2 text-sm font-regular ${
                    path === `/dashboard/${link.path}`
                      ? `sidenav_main_item_active sidenav_main_item_active_color ${theme.borderColor[themeColor]}`
                      : `border-transparent`
                  }`}>
                  <span className="sidenav_icon_wrapper">
                    {getMenuIcon(
                      link.label,
                      link.path,
                      path === `/dashboard/${link.path}`
                    )}
                  </span>
                  {link.name}
                </a>
              );
            }
          )
        : null}
    </div>
  );
};

export default Links;
