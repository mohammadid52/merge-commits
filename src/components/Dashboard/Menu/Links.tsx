import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ToolTip from '../../General/ToolTip/ToolTip';

type LinkObject = {
  name: string;
  path: string;
};

const Links: React.FC = () => {
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
  };

  return (
    <div className='link w-full h-12 py-4'>
      {state.user.role && links.length > 0
        ? links.map((link: { name: string; path: string }, key: number) => (
            <div
              id={link.path}
              key={key}
              className={`w-full text-center text-lg mb-4`}
              onClick={handleLink}>
              {link.name}
            </div>
          ))
        : null}
      <div id='testTooltip' className={`w-full text-center text-lg mb-4`}>
        testTooltip
        {/* <ToolTip position='right' header='test' content='hello' /> */}
        <ToolTip position='bottom-right' header='test' content='hello' />
      </div>
    </div>
  );
};

export default Links;
