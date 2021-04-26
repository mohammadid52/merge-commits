import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import SignOutButton from '../../Auth/SignOut';
import { getAsset } from '../../../assets';
import Links from './Links';
import { useHistory } from 'react-router';
import ProfileLink from './ProfileLink';
import { IoIosMenu } from 'react-icons/io';

interface SideMenuProps {
  children?: React.ReactNode;
  [key: string]: any;
  updateAuthState?: Function;
  role: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ children, ...props }: SideMenuProps) => {
  const {
    currentPage,
    setCurrentPage,
    role,
    updateAuthState,
    setActiveRoomName,
    setActiveRoomSyllabus,
    setSyllabusLoading,
    setLessonLoading,
    handleRoomSelection,
  } = props;
  const { dispatch, theme, clientKey } = useContext(GlobalContext);
  const history = useHistory();
  const [collapse, setCollapse] = useState(false);

  const handleLink = (e: React.MouseEvent) => {
    history.push('/dashboard/home');
    dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'homepage' } });
  };

  return (
    <div
      onClick={() => {
        if (collapse) {
          setCollapse(false);
        }
      }}
      style={{
        minWidth: collapse ? '0.5rem' : '16rem',
        maxWidth: collapse ? '0.5rem' : '16rem',
      }}
      className={`md:flex w-auto md:flex-shrink-0 w-60 sidenav overflow-x-hidden ${collapse && 'cursor-pointer'}`}>
      {!collapse && (
        <div
          style={{
            minWidth: '16rem',
            overflow: 'hidden',
          }}
          className="flex flex-col">
          <div className="flex flex-col h-screen flex-1">
            <div className="flex justify-between sidenav_logo items-center h-16 flex-shrink-0 px-4">
              <img onClick={handleLink} className="h-8 w-auto" src={getAsset(clientKey, 'main_logo')} alt="Workflow" />
              <IoIosMenu
                onClick={() => setCollapse(!collapse)}
                className="w-auto cursor-pointer sidenav_icon h-6 w-6"
              />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <ProfileLink
                handleRoomSelection={handleRoomSelection}
                setActiveRoomSyllabus={setActiveRoomSyllabus}
                setLessonLoading={setLessonLoading}
                setSyllabusLoading={setSyllabusLoading}
                setActiveRoomName={setActiveRoomName}
                role={role}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
              <nav className="flex-1 py-4 space-y-1">
                <Links
                  handleRoomSelection={handleRoomSelection}
                  setActiveRoomSyllabus={setActiveRoomSyllabus}
                  setLessonLoading={setLessonLoading}
                  setSyllabusLoading={setSyllabusLoading}
                  setActiveRoomName={setActiveRoomName}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  role={role}
                />
              </nav>
            </div>
            <SignOutButton updateAuthState={updateAuthState} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
