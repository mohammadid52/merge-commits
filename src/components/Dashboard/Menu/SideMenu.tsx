import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import SignOutButton from '../../Auth/SignOut';
import { getAsset } from '../../../assets';
interface SideMenuProps {
  children: React.ReactNode;
  [key: string]: any;
  updateAuthState: Function;
}

const SideMenu: React.FC<SideMenuProps> = ({ children, ...props }: SideMenuProps) => {
  const { currentPage, setCurrentPage } = props;
  const { dispatch, theme, clientKey } = useContext(GlobalContext);

  const handleLink = (e: React.MouseEvent) => {
    const {id} = e.target as HTMLElement;

    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'classroom'}})
  };

  return (
    <div className={theme.sidemenu.primary}>
      <div
        className={`hidden w-full h-12 md:flex justify-center items-center text-2xl font-bold z-50`}>
        <NavLink id="dashboard" to="/dashboard" onClick={handleLink}>
          <img
            id="dashboard"
            className="bg-white p-2 h-full"
            src={getAsset(clientKey, 'main_logo')}
            alt="Logo"
          />
        </NavLink>
      </div>
      <div className={`sidebar w-full h-1/2 text-gray-200 cursor-pointer`}>{children}</div>
      <div className={`mt-auto mb-2 text-gray-200`}>
        <SignOutButton updateAuthState={props.updateAuthState} />
      </div>
    </div>
  );
};

export default SideMenu;
