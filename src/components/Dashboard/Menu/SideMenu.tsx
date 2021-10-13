import Tooltip from '@atoms/Tooltip';
import SignOutButton from '@components/Auth/SignOut';
import Links from '@components/Dashboard/Menu/Links';
import ProfileLink from '@components/Dashboard/Menu/ProfileLink';
import {GlobalContext} from '@contexts/GlobalContext';
import {useOverlayContext} from '@contexts/OverlayContext';
import useDeviceDetect from '@customHooks/deviceDetect';
import useKeyPress from '@customHooks/useKeyPress';
import {getAsset} from 'assets';
import React, {useContext, useEffect} from 'react';
import {IoIosMenu} from 'react-icons/io';
import {RiArrowRightSLine} from 'react-icons/ri';
import {useHistory, useLocation} from 'react-router';

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
  const {collapseSidebarOverlay, setCollapseSidebarOverlay} = useOverlayContext();

  const handleLink = (e: React.MouseEvent) => {
    history.push('/dashboard/home');
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'homepage'}});
  };

  useEffect(() => {
    if (mobile) {
      setCollapseSidebarOverlay(true);
    }
  }, [pathname, mobile]);

  // event listener for '[' press. if pressed expand or collapseSidebarOverlay sidemenu
  const bracketsOpenPress = useKeyPress('[');

  useEffect(() => {
    if (bracketsOpenPress) {
      setCollapseSidebarOverlay((prev: any) => !prev);
    }
  }, [bracketsOpenPress]);

  return (
    <>
      {collapseSidebarOverlay && (
        <div
          onClick={() => {
            if (collapseSidebarOverlay) {
              setCollapseSidebarOverlay(false);
            }
          }}
          className={`${
            !collapseSidebarOverlay ? 'not-collapse' : 'collapse'
          } absolute flex items-center justify-end bg-gray-700 h-10 w-6 cursor-pointer animate__sidebar-btn rounded-r-lg top-2 z-100`}>
          <Tooltip placement="right" text="Expand [">
            <div className="w-auto mr-1">
              <RiArrowRightSLine color="#fff" size={24} />
            </div>
          </Tooltip>
        </div>
      )}
      <div
        style={{
          minWidth: collapseSidebarOverlay ? '0rem' : '16rem',
          maxWidth: collapseSidebarOverlay ? '0rem' : '16rem',
        }}
        className={`md:flex md:flex-shrink-0 w-60 sidenav bg-charcoal ${
          collapseSidebarOverlay && 'cursor-pointer'
        }`}>
        {!collapseSidebarOverlay && (
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
                  onClick={() => setCollapseSidebarOverlay(!collapseSidebarOverlay)}
                  className="cursor-pointer sidenav_icon h-6 w-6 text-gray-400"
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
