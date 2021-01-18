import React, { useContext, useState, useEffect, SetStateAction } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
// Iconz
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FiUsers } from 'react-icons/fi';
import { FaUniversity, FaRulerVertical } from 'react-icons/fa';
import { AiOutlineSchedule, AiOutlineAudit, AiOutlineUsergroupAdd } from 'react-icons/ai';
import useDictionary from '../../../customHooks/dictionary';

type LinkObject = {
  name: string;
  path: string;
  title: string;
};

export interface LinkProps {
  children?: React.ReactNode;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  currentPage: string;
  image?: string;
  role?: string;
  updateAuthState?: Function;
}

const Links: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const { sideBarLinksDict } = useDictionary();
  const history = useHistory();
  const match = useRouteMatch();
  const { state, userLanguage } = useContext(GlobalContext);
  const { role } = linkProps;
  const [links, setLinks] = useState<Array<LinkObject>>([]);

  const userLinks = (role: string): void => {
    switch (role) {
      case 'SUP':
        return setLinks((links) => {
          return [
            ...links,
            {
              title: 'REGISTRATION',
              name: 'Registration',
              path: 'registration',
            },
            {
              title: 'PEOPLE',
              name: 'People',
              path: 'manage-users',
            },
            {
              title: 'CLASSROOM',
              name: 'Classroom',
              path: 'classroom',
            },
            {
              title: 'LESSON_PLANNER',
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
            {
              title: 'INSTITUTIONS',
              name: 'Institutions',
              path: 'manage-institutions',
            },
          ];
        });
      case 'ADM':
        return setLinks((links) => {
          return [
            ...links,
            {
              title: 'INSTITUTIONS',
              name: 'Institutions',
              path: 'manage-institutions',
            },
            {
              title: 'PEOPLE',
              name: 'People',
              path: 'manage-users',
            },
            {
              title: 'LESSON_PLANNER',
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
            {
              title: 'CLASSROOM',
              name: 'Classroom',
              path: 'classroom',
            },
          ];
        });
      case 'FLW':
        return setLinks((links) => {
          return [
            ...links,
            {
              title: 'PEOPLE',
              name: 'People',
              path: 'manage-users',
            },
            {
              title: 'LESSON_PLANNER',
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
          ];
        });
      default:
        return;
    }
  };

  useEffect(() => {
    userLinks(role);
  }, [role]);

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

  const getMenuIcon = (label: string, url: string) => {
    switch (label) {
      case 'People':
        return <FiUsers id={url} />;
        break;
      case 'Registration':
        return <AiOutlineUsergroupAdd id={url} />;
        break;
      case 'Classroom':
        return <AiOutlineAudit id={url} />;
        break;
      case 'Lesson Planner':
        return <AiOutlineSchedule id={url} />;
        break;
      case 'Lesson Builder':
        return <FaRulerVertical id={url} />;
        break;
      case 'Institutions':
        return <FaUniversity id={url} />;
        break;
      default:
        return '';
    }
  };

  const linkClass = 'w-full h-20 text-center text-sm mx-auto py-4 flex flex-col items-center justify-center';
  const dividerClass = 'w-1/2 h-1px mx-auto bg-gradient-to-r from-transparent via-white20 to-transparent';
  const activeClass = 'bg-gray-200 text-dark-gray';

  const getClassStyle = (label: string) => {
    switch (label) {
      case 'People':
        return `${
          linkProps.currentPage === 'manage-users' && activeClass
        } w-full text-center border-l-4 border-mustard-yellow`;
      case 'Registration':
        return `${
          linkProps.currentPage === 'registration' && activeClass
        } w-full text-center border-l-4 border-ketchup`;
      case 'Classroom':
        return `${linkProps.currentPage === 'classroom' && activeClass} w-full text-center border-l-4 border-blueberry`;
      case 'Lesson Planner':
        return `${
          linkProps.currentPage === 'lesson-planner' && activeClass
        } w-full text-center border-l-4 border-sea-green`;
      case 'Lesson Builder':
        return `${
          linkProps.currentPage === 'lesson-builder' && activeClass
        } w-full text-center border-l-4 border-sea-green`;
      case 'Institutions':
        return `${
          linkProps.currentPage === 'manage-institutions' && activeClass
        } w-full text-center border-l-4 border-ketchup`;
      default:
        return '';
    }
  };

  return (
    <div className="link  w-full h-12 z-40">
      {state.user.role && links.length > 0
        ? links.map((link: { name: string; path: string }, key: number) => (
            <div key={`link_${key}`} id={link.path} onClick={handleLink}>
              <div
                id={link.path}
                className={`${linkClass} ${getClassStyle(link.name)}`}
                >
                <IconContext.Provider value={{ size: '24px', style: { pointerEvents: 'none' } }}>
                  {getMenuIcon(link.name, link.path)}
                </IconContext.Provider>
                {link.name}
              </div>

              <div className={dividerClass}></div>
            </div>
          ))
        : null}
    </div>
  );
};

export default Links;
