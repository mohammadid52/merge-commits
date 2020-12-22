import React, { useContext, useState, useEffect, SetStateAction } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
// Iconz
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FiUsers } from 'react-icons/fi';
import { FaUniversity, FaRulerVertical } from 'react-icons/fa';
import { AiOutlineSchedule, AiOutlineAudit, AiOutlineUsergroupAdd } from 'react-icons/ai';

type LinkObject = {
  name: string;
  path: string;
};

export interface LinkProps {
  children?: React.ReactNode;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  currentPage: string;
  image?: string;
  role?: string;
  updateAuthState?: Function
};

const Links: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const history = useHistory();
  const match = useRouteMatch();
  const { state } = useContext(GlobalContext);
  const { role } = linkProps;
  const [links, setLinks] = useState<Array<LinkObject>>([]);

  const userLinks = (role: string): void => {
    switch (role) {
      case 'SUP':
        return setLinks((links) => {
          return [
            ...links,
            {
              name: 'Registration',
              path: 'registration',
            },
            {
              name: 'People',
              path: 'manage-users',
            },
            {
              name: 'Classroom',
              path: 'classroom',
            },
            {
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
            {
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
              name: 'Institutions',
              path: 'manage-institutions',
            },
            {
              name: 'People',
              path: 'manage-users',
            },
            // {
            //   name: 'Lesson Builder',
            //   path: 'lesson-planner',
            // },
            {
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
            {
              name: 'Classroom',
              path: 'classroom',
            },
          ];
        });
      case 'FLW':
        return setLinks((links) => {
          return [
            ...links,
            // {
            //   name: 'Registration',
            //   path: 'registration',
            // },
            {
              name: 'People',
              path: 'manage-users',
            },
            {
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
          ];
        });
      default:
        return;
    }
  };

  // useEffect(() => {
  //   userLinks(state.user.role);
  // }, [state.user.role]);

  useEffect(() => {
    userLinks(role);
  }, [role]);

  // useEffect(() => {
  //   console.log("initial useeffect in links has been called", role)
  //   userLinks(role);
  // }, [])

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
  const getClassStyle = (label: string) => {
    switch (label) {
      case 'People':
        return `${linkProps.currentPage === 'manage-users' && 'bg-grayscale'
          } border-l-4 border-mustard-yellow`;
        break;
      case 'Registration':
        return `${linkProps.currentPage === 'registration' && 'bg-grayscale'
          } border-l-4 border-ketchup`;
        break;
      case 'Classroom':
        return `${linkProps.currentPage === 'classroom' && 'bg-grayscale'
          } border-l-4 border-blueberry`;
        break;
      case 'Lesson Planner':
        return `${linkProps.currentPage === 'lesson-planner' && 'bg-grayscale'
          } border-l-4 border-sea-green`;
        break;
      case 'Lesson Builder':
        return `${linkProps.currentPage === 'lesson-planner' && 'bg-grayscale'
          } border-l-4 border-sea-green`;
        break;
      case 'Institutions':
        return `${linkProps.currentPage === 'manage-institutions' && 'bg-grayscale'
          } border-l-4 border-ketchup`;
        break;
      default:
        return '';
    }
  };

  return (
    <div className='link  w-full h-12 z-40'>
      {/* {state.user.role && links.length > 0 */}
      {role && links.length > 0
        ? links.map((link: { name: string; path: string }, key: number) => (
          <>
            <div
              id={link.path}
              key={key}
              className={`w-full h-16 text-center text-sm mx-auto py-4 flex flex-col items-center justify-center ${getClassStyle(
                link.name
              )}`}
              onClick={handleLink}>

              <div id={link.path} className='w-full text-center'>
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  {getMenuIcon(link.name, link.path)}
                </IconContext.Provider>
              </div>
              {link.name}
            </div>

            <div className={`w-1/2 h-1px mx-auto bg-gradient-to-r from-transparent via-white20 to-transparent`}></div>

          </>
        ))
        : null}
    </div>
  );
};

export default Links;
