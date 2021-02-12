import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
// Iconz
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaRulerVertical, FaQuestionCircle } from 'react-icons/fa';
import { AiOutlineSchedule, AiOutlineUsergroupAdd, AiOutlineBook } from 'react-icons/ai';
import useDictionary from '../../../customHooks/dictionary';
import { IoIosPeople } from 'react-icons/io';
import { IoBookOutline, IoSchoolOutline } from 'react-icons/io5';

type LinkObject = {
  name: string;
  path: string;
  title?: string;
  label?: string;
};

export interface LinkProps {
  children?: React.ReactNode;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  currentPage: string;
  image?: string;
  role?: string;
  updateAuthState?: Function;
}

const Links: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const { currentPage, setCurrentPage } = linkProps;
  const { sideBarLinksDict } = useDictionary(clientKey);
  const history = useHistory();
  const match = useRouteMatch();
  const { role } = linkProps;
  const [links, setLinks] = useState<Array<LinkObject>>([]);

  /**
   * DISPLAY OTHER MENU ITEMS FOR
   * DIFFERENT USERS
   */
  useEffect(() => {
    userLinks(role);
  }, [role]);

  const userLinks = (role: string): void => {
    console.log('role', role)
    switch (role) {
      case 'SUP':
        return setLinks((links) => {
          return [
            ...links,
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
            ...links,
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
            },
          ];
        });
      case 'FLW':
        return setLinks((links) => {
          return [
            ...links,
            {
              title: sideBarLinksDict[userLanguage].PEOPLE,
              name: sideBarLinksDict[userLanguage].PEOPLE,
              label: 'People',
              path: 'manage-users',
            },
            {
              title: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              name: sideBarLinksDict[userLanguage].LESSON_PLANNER,
              label: 'Lesson Planner',
              path: 'lesson-planner',
            },
          ];
        });
      case 'ST':
        return setLinks((links) => {
          return [
            ...links,
            {
              title: 'ANTHOLOGY',
              name: 'Anthology',
              label: 'Anthology',
              path: 'anthology',
            },
          ]
        })
      default:
        return;
    }
  };

  const handleLink = (e: any) => {
    const id = e.target.id.toLowerCase();
    const lastCharacter = match.url.charAt(match.url.length - 1);

    if (lastCharacter === '/') {
      const sliced = match.url.slice(0, match.url.length - 1);
      history.push(`${sliced}/${id}`);
    } else {
      history.push(`${match.url}/${id}`);
    }

    linkProps.setCurrentPage(id);
  };

  /**
   * HANDLE MENU LINK COLORS
   */
  useEffect(() => {
    if (pageUrlEndsWith('dashboard')) {
      setCurrentPage('classroom');
    }
    if (pageUrlContains('/dashboard/manage-users')) {
      setCurrentPage('manage-users');
    }
    if (pageUrlContains('/dashboard/registration')) {
      setCurrentPage('registration');
    }
    if (pageUrlContains('/dashboard/classroom')) {
      setCurrentPage('classroom');
    }
    if (pageUrlContains('/dashboard/lesson-planner')) {
      setCurrentPage('lesson-planner');
    }
    if (pageUrlContains('/dashboard/lesson-builder')) {
      setCurrentPage('lesson-builder');
    }
    if (pageUrlContains('/dashboard/manage-institutions')) {
      setCurrentPage('manage-institutions');
    }
    if (pageUrlContains('/dashboard/anthology')) {
      setCurrentPage('anthology');
    }
    if (pageUrlContains('/dashboard/assessments')) {
      setCurrentPage('assessments');
    }
  }, []);

  const pageUrlEndsWith = (pageLabel: string) => {
    const pageUrl = window.location.href;
    const lastPart = pageUrl.match(/[^/]+$/g);
    return lastPart.includes(pageLabel);
  };

  const pageUrlContains = (pageLabel: string) => {
    const pageUrl = window.location.href;
    return pageUrl.indexOf(pageLabel) !== -1;
  };

  const getMenuIcon = (label: string, url: string) => {
    switch (label) {
      case 'People':
        return <IoIosPeople id={url} />;
      case 'Registration':
        return <AiOutlineUsergroupAdd id={url} />;
      case 'Classroom':
        return <IoBookOutline id={url} />;
      case 'Lesson Planner':
        return <AiOutlineSchedule id={url} />;
      case 'Lesson Builder':
        return <FaRulerVertical id={url} />;
      case 'Institutions':
        return <IoSchoolOutline id={url} />;
      case 'Anthology':
        return <AiOutlineBook id={url} />;
      default:
        return '';
    }
  };

  const linkClass =
    'w-full h-20 text-center text-xs tracking-wider mx-auto py-4 flex flex-col items-center justify-center';
  const dividerClass = 'w-1/2 h-1px mx-auto bg-gradient-to-r from-transparent via-white20 to-transparent';
  const activeClass = 'bg-gray-200 text-dark-gray';

  return (
    <div className={`link w-full h-12 z-40`}>
      {state.user.role && links.length > 0
        ? links.map((link: { name: string; path: string, label: string }, key: number) => (
            <div key={`link_${key}`} id={link.path} onClick={handleLink}>
              <div id={link.path} className={`${linkClass} ${currentPage === link.path && activeClass}`}>
                <IconContext.Provider value={{ size: '24px', style: { pointerEvents: 'none' } }}>
                  {getMenuIcon(link.label, link.path)}
                </IconContext.Provider>
                {link.name}
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default Links;
