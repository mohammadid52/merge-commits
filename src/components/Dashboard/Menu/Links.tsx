import React, { useContext, useState, useEffect, SetStateAction } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ToolTip from '../../General/ToolTip/ToolTip';
// Iconz
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FiUsers } from 'react-icons/fi';
import { AiOutlineSchedule, AiOutlineAudit, AiOutlineUsergroupAdd } from 'react-icons/ai';

type LinkObject = {
  name: string;
  path: string;
};

type LinkProps = {
  children?: React.ReactNode;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  currentPage: string;
};

const Links: React.FC<LinkProps> = (linkProps: LinkProps) => {
  const history = useHistory();
  const match = useRouteMatch();
  const { state } = useContext(GlobalContext);
  const [links, setLinks] = useState<Array<LinkObject>>([]);

  const userLinks = (role: string): void => {
    switch (role) {
      case 'SUP':
        return setLinks((links) => {
          return [
            ...links,
            {
              name: 'User Management',
              path: 'manage-users',
            },
            {
              name: 'Registration',
              path: 'registration',
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
              name: 'User Management',
              path: 'manage-users',
            },
            {
              name: 'Registration',
              path: 'registration',
            },
            {
              name: 'Classroom',
              path: 'classroom',
            },
            {
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
          ];
        });
      case 'FLW':
        return setLinks((links) => {
          return [
            ...links,
            {
              name: 'User Management',
              path: 'manage-users',
            },
            {
              name: 'Lesson Planner',
              path: 'lesson-planner',
            },
            {
              name: 'Registration',
              path: 'registration',
            },
          ];
        });
      default:
        return;
    }
  };

  useEffect(() => {
    userLinks(state.user.role);
    // console.log(state.user.role);
  }, [state.user.role]);

  const handleLink = (e: any) => {
    let id = e.target.id.toLowerCase();
    history.push(`${match.url}/${id}`);
    linkProps.setCurrentPage(id);
    console.log('handleLink: ', linkProps.currentPage);
  };

  const getMenuIcon = (label: string, url: string) => {
    switch (label) {
      case 'User Management':
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
      default:
        return '';
    }
  };
  const getClassStyle = (label: string) => {
    switch (label) {
      case 'User Management':
        return `${
          linkProps.currentPage === 'manage-users' && 'bg-grayscale'
        } border-l-4 border-mustard-yellow`;
        break;
      case 'Registration':
        return `${
          linkProps.currentPage === 'registration' && 'bg-grayscale'
        } border-l-4 border-ketchup`;
        break;
      case 'Classroom':
        return `${
          linkProps.currentPage === 'classroom' && 'bg-grayscale'
        } border-l-4 border-blueberry`;
        break;
      case 'Lesson Planner':
        return `${
          linkProps.currentPage === 'lesson-planner' && 'bg-grayscale'
        } border-l-4 border-sea-green`;
        break;
      default:
        return '';
    }
  };

  return (
    <div className='link  w-full h-12 py-4 z-40'>
      {state.user.role && links.length > 0
        ? links.map((link: { name: string; path: string }, key: number) => (
            <div
              id={link.path}
              key={key}
              className={`w-full h-16 text-center text-sm mx-auto py-4 flex flex-col items-center justify-center ${getClassStyle(link.name)}`}
              onClick={handleLink}>
              <div className='w-full text-center'>
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  {getMenuIcon(link.name, link.path)}
                </IconContext.Provider>
              </div>
              {link.name}
            </div>
          ))
        : null}
    </div>
  );
};

export default Links;
