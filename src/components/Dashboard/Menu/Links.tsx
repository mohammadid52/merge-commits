import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
// Iconz
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaRulerVertical, FaQuestionCircle, FaAppleAlt, FaDoorOpen } from 'react-icons/fa';
import { AiOutlineSchedule, AiOutlineUsergroupAdd, AiOutlineBook } from 'react-icons/ai';
import { RiDoorClosedLine } from 'react-icons/ri';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { IoIosPeople, IoMdBuild } from 'react-icons/io';
import { GiShinyApple } from 'react-icons/gi';
import { IoBookOutline, IoSchoolOutline } from 'react-icons/io5';
import { BsReverseLayoutSidebarReverse } from 'react-icons/bs';

import useDictionary from '../../../customHooks/dictionary';
import { getAsset } from '../../../assets';
import { findIndex } from 'lodash';

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
}

const Links: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const { state, dispatch, theme, userLanguage, clientKey } = useContext(GlobalContext);
  const {
    currentPage,
    setCurrentPage,
    setActiveRoomName,
    setSyllabusLoading,
    setLessonLoading,
    setActiveRoomSyllabus,
  } = linkProps;
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { sideBarLinksDict } = useDictionary(clientKey);
  const history = useHistory();
  const match = useRouteMatch();
  const { role } = linkProps;
  const [links, setLinks] = useState<Array<LinkObject>>([]);
  const [openItems, setOpenItems] = useState([]);

  /**
   * DISPLAY OTHER MENU ITEMS FOR
   * DIFFERENT USERS
   */
  useEffect(() => {
    userLinks(role);
    if (state.roomData?.rooms?.length > 0) {
      setOpenItems([...openItems, 'Dashboard']);
    }
  }, [role, state.roomData.rooms]);

  const userLinks = (role: string): void => {
    console.log('role', role);
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
            // {
            //   title: sideBarLinksDict[userLanguage].DASHBOARD,
            //   name: sideBarLinksDict[userLanguage].DASHBOARD,
            //   label: 'Dashboard',
            //   path: 'home',
            // },
            {
              title: sideBarLinksDict[userLanguage].INSTITUTIONS,
              name: sideBarLinksDict[userLanguage].INSTITUTIONS,
              label: 'Institutions',
              path: 'manage-institutions',
              subMenuItems: [{ title: 'Add New', path: 'manage-institutions/add' }],
            },
            {
              title: sideBarLinksDict[userLanguage].PEOPLE,
              name: sideBarLinksDict[userLanguage].PEOPLE,
              label: 'People',
              path: 'manage-users',
              subMenuItems: [{ title: 'Add New Person', path: 'registration' }],
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              name: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              label: 'Lesson Planner',
              path: 'lesson-planner',
            },
            {
              title: sideBarLinksDict[userLanguage].CLASSROOM,
              name: sideBarLinksDict[userLanguage].CLASSROOM,
              label: 'Classroom',
              path: 'classroom',
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_BUILDER,
              name: sideBarLinksDict[userLanguage].LESSON_BUILDER,
              label: 'Lesson Builder',
              path: 'lesson-builder',
              subMenuItems: [{ title: 'Add New Lesson', path: 'lesson-builder/lesson/add' }],
            },
            {
              title: sideBarLinksDict[userLanguage].ANTHOLOGY,
              name: sideBarLinksDict[userLanguage].ANTHOLOGY,
              label: 'Anthology',
              path: 'anthology',
            },
          ];
        });
      case 'TR':
      case 'FLW':
        return setLinks((links) => {
          return [
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
              subMenuItems: [{ title: 'Add New Person', path: 'registration' }],
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              name: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              label: 'Lesson Planner',
              path: 'lesson-planner',
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
              subMenuItems: [{ title: 'Add New Lesson', path: 'lesson-builder/lesson/add' }],
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
              subMenuItems:
                state.roomData.rooms.length &&
                state.roomData.rooms.map((room: Room, i: number) => {
                  return {
                    title: room.name,
                    path: room.id,
                    onClick: (e: any) => handleRoomSelection(room.id, room.name, i),
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

  const handleRoomSelection = (id: string, name: string, i: number) => {
    if (state.activeRoom !== id) {
      // setActiveRoom(t.id);
      setActiveRoomName(name);

      dispatch({ type: 'UPDATE_ACTIVEROOM', payload: { data: id } });

      setSyllabusLoading(true); // Trigger loading ui element
      setLessonLoading(true);
      setActiveRoomSyllabus(state.roomData.rooms[i].activeSyllabus);

      history.push('/dashboard/classroom');
    }
  };

  const handleLink = (e: any, label: string, toggle: boolean = false) => {
    const id = e.target.id.toLowerCase();
    const lastCharacter = match.url.charAt(match.url.length - 1);

    if (lastCharacter === '/') {
      const sliced = match.url.slice(0, match.url.length - 1);
      history.push(`${sliced}/${id}`);
    } else {
      history.push(`${match.url}/${id}`);
    }

    if (toggle) {
      const exists = openItems.indexOf(label) !== -1;
      if (exists) {
        setOpenItems([...openItems.filter((d) => d !== label)]);
      } else {
        setOpenItems([...openItems, label]);
      }
    }

    linkProps.setCurrentPage(id);
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

  const getMenuIcon = (label: string, url: string) => {
    switch (label) {
      case 'People':
        return <IoIosPeople className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Registration':
        return <AiOutlineUsergroupAdd className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Classroom':
        return <IoBookOutline className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Dashboard':
        return <IoBookOutline className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Lesson Planner':
        return <FaAppleAlt className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Lesson Builder':
        return <IoMdBuild className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Institutions':
        return <HiOutlineOfficeBuilding className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Anthology':
        return <AiOutlineBook className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      case 'Noticeboard':
        return <BsReverseLayoutSidebarReverse className="text-gray-500 mr-3 h-6 w-6" id={url} />;
      default:
        return '';
    }
  };

  // const linkClass =
  //   'w-full h-20 text-center text-xs tracking-wider mx-auto py-4 flex flex-col items-center justify-center';
  // const dividerClass = 'w-1/2 h-1px mx-auto bg-gradient-to-r from-transparent via-white20 to-transparent';
  // const activeClass = 'bg-gray-200 text-dark-gray';

  const path = history.location.pathname;

  return (
    <div className={`link w-full h-12 z-40`}>
      {state.user.role && links && links.length > 0
        ? links.map((link: { subMenuItems: any; name: string; path: string; label: string }, key: number) => {
            const currentPath = `/dashboard/${link.path}`;
            const open =
              path === currentPath ||
              (link.subMenuItems && findIndex(link.subMenuItems, (d: any) => path === `/dashboard/${d.path}`) !== -1);

            const exists = openItems.indexOf(link.label) !== -1;

            return link.subMenuItems && link.subMenuItems.length > 0 ? (
              <div key={`link_${key}`} className={`space-y-1`}>
                <a
                  id={link.path}
                  onClick={(e) => handleLink(e, link.label, true)}
                  type="button"
                  className={`${
                    open && `bg-gray-700 hover:bg-gray-700`
                  } text-gray-400 hover:text-gray-300 my-2 cursor-pointer hover:text-white flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  aria-controls="sub-menu-1"
                  aria-expanded="false">
                  {getMenuIcon(link.label, link.path)}
                  {link.name}
                  <svg
                    className={`${
                      exists ? 'text-gray-400 rotate-90' : 'text-gray-300'
                    } text-gray-300 ml-auto h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150`}
                    viewBox="0 0 20 20"
                    aria-hidden="true">
                    <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                  </svg>
                </a>
                {exists && (
                  <div className="space-y-1" id="sub-menu-1">
                    {link.subMenuItems.map((d: any) => {
                      const activeLink =
                        findIndex(link.subMenuItems, (d: any) => path === `/dashboard/${d.path}`) !== -1;

                      return (
                        <a
                          key={`${d.path}_key`}
                          id={d.path}
                          onClick={(e) => {
                            if (d.onClick) {
                              d.onClick();
                            } else handleLink(e, link.label);
                          }}
                          className={`group cursor-pointer w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                            activeLink ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                          {d.title}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={`link_${key}`}
                id={link.path}
                onClick={(e) => handleLink(e, link.label)}
                className={`${
                  path === `/dashboard/${link.path}` && `bg-gray-700 hover:bg-gray-700 ${theme.text[themeColor]}`
                } text-gray-400 hover:text-gray-300 my-2 cursor-pointer hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                <div className="w-auto ">{getMenuIcon(link.label, link.path)}</div>
                {link.name}
              </a>
            );
          })
        : null}
    </div>
  );
};

export default Links;
