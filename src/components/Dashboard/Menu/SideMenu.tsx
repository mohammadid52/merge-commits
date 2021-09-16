import React, {useContext, useEffect, useState} from 'react';
import {IoIosMenu} from 'react-icons/io';
import {RiArrowRightSLine} from 'react-icons/ri';
import {useHistory, useLocation} from 'react-router';
import {getAsset} from '../../../assets';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDeviceDetect from '../../../customHooks/deviceDetect';
import Tooltip from '../../Atoms/Tooltip';
import SignOutButton from '../../Auth/SignOut';
import Links from './Links';
import ProfileLink from './ProfileLink';

interface SideMenuProps {
  children?: React.ReactNode;
  [key: string]: any;
  updateAuthState?: Function;
  role: string;
}

const SideMenu: React.FC<SideMenuProps> = ({children, ...props}: SideMenuProps) => {
  const {
    currentPage,
    setCurrentPage,
    role,
    updateAuthState,
    setActiveRoomName,

    setSyllabusLoading,
    setLessonLoading,
    handleRoomSelection,
  } = props;
  const {mobile} = useDeviceDetect();
  const {dispatch, clientKey} = useContext(GlobalContext);
  const history = useHistory();
  const {pathname} = useLocation();
  const [collapse, setCollapse] = useState(false);

  const handleLink = (e: React.MouseEvent) => {
    history.push('/dashboard/home');
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'homepage'}});
  };

  useEffect(() => {
    if (mobile) {
      setCollapse(true);
    }
  }, [pathname, mobile]);

  return (
    <>
      {collapse && (
        <div
          onClick={() => {
            if (collapse) {
              setCollapse(false);
            }
          }}
          className={`${
            !collapse ? 'not-collapse' : 'collapse'
          } absolute flex items-center justify-end bg-gray-700 h-10 w-6 cursor-pointer animate__sidebar-btn rounded-r-lg top-2 z-100`}>
          <Tooltip placement="right" text="Show Sidebar">
            <div className="w-auto mr-1">
              <RiArrowRightSLine color="#fff" size={24} />
            </div>
          </Tooltip>
        </div>
      )}
      <div
        // onClick={() => {
        //   if (collapse) {
        //     setCollapse(false);
        //   }
        // }}
        style={{
          minWidth: collapse ? '0rem' : '16rem',
          maxWidth: collapse ? '0rem' : '16rem',
        }}
        className={`md:flex md:flex-shrink-0 w-60 sidenav bg-charcoal ${
          collapse && 'cursor-pointer'
        }`}>
        {!collapse && (
          <div
            style={{
              minWidth: '16rem',
            }}
            className="flex flex-col">
            <div className="flex flex-col hide-scrollbar h-screen flex-1">
              <div className="flex justify-between sidenav_logo items-center h-16 flex-shrink-0 px-4">
                <img
                  onClick={handleLink}
                  className="h-8 w-auto"
                  src={getAsset(clientKey, 'main_logo')}
                  alt="Workflow"
                />
                <IoIosMenu
                  onClick={() => setCollapse(!collapse)}
                  className=" cursor-pointer sidenav_icon h-6 w-6 text-gray-400"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <ProfileLink
                  handleRoomSelection={handleRoomSelection}
                  // setActiveRoomSyllabus={setActiveRoomSyllabus}
                  setLessonLoading={setLessonLoading}
                  setSyllabusLoading={setSyllabusLoading}
                  setActiveRoomName={setActiveRoomName}
                  role={role}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                />
                <nav className="flex-1 py-4 space-y-1 h-full overflow-y-auto overflow-x-hidden">
                  <Links
                    handleRoomSelection={handleRoomSelection}
                    // setActiveRoomSyllabus={setActiveRoomSyllabus}
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
    </>
  );
};

export default SideMenu;
