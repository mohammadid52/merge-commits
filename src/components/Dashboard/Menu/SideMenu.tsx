import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import SignOutButton from '../../Auth/SignOut';
import { getAsset } from '../../../assets';
import Links from './Links';
import { useHistory } from 'react-router';
import ProfileLink from './ProfileLink';

interface SideMenuProps {
  children?: React.ReactNode;
  [key: string]: any;
  updateAuthState?: Function;
  role: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ children, ...props }: SideMenuProps) => {
  const { currentPage, setCurrentPage, role, updateAuthState } = props;
  const { dispatch, theme, clientKey } = useContext(GlobalContext);
  const history = useHistory();

  const handleLink = (e: React.MouseEvent) => {
    history.push('/dashboard/home');
    dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'classroom' } });
  };

  return (
    <div className="bg-gray-800 md:flex w-auto md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div onClick={handleLink} className="flex items-center h-16 justify-center flex-shrink-0 px-4 bg-gray-900">
            <img className="h-8 w-auto" src={getAsset(clientKey, 'main_logo')} alt="Workflow" />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <ProfileLink role={role} setCurrentPage={setCurrentPage} currentPage={currentPage} />
            <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
              <Links setCurrentPage={setCurrentPage} currentPage={currentPage} role={role} />
            </nav>
          </div>
          <SignOutButton updateAuthState={updateAuthState} />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

{
  /* 
// <div className={theme.sidemenu.primary}>
    //   <div className={`hidden w-full h-12 md:flex justify-center items-start text-2xl font-bold z-50`}>
    //     <NavLink id="dashboard" to="/dashboard" onClick={handleLink}>
    //       <img
    //         id="dashboard"
    //         className={` ${clientKey === 'demo' ? 'bg-white' : 'bg-gray-900'} p-2 w-4 h-2`}
    //         src={getAsset(clientKey, 'main_logo')}
    //         alt="Logo"
    //       />
    //     </NavLink>
    //   </div>
    //   <div className={`sidebar w-full h-1/2 text-gray-200 cursor-pointer`}>{children}</div>
    //   {/* <div className={`mt-auto mb-2 text-gray-200`}>
    //     <SignOutButton updateAuthState={props.updateAuthState} />
    //   </div> 
    // </div> */
}
