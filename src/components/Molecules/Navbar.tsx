import DropDownMenu from '@components/Dashboard/DropDownMenu/DropDownMenu';
import HeaderMegaMenu from '@components/Dashboard/Menu/HeaderMegaMenu';
import useAuth from '@customHooks/useAuth';
import {getClientKey} from '@utilities/strings';
import {theme} from 'antd';
import {getAsset} from 'assets';
import {NavLink} from 'react-router-dom';
const {useToken} = theme;

const Navbar = () => {
  const {isTeacher, instId} = useAuth();

  const {token} = useToken();

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    boxShadow: token.boxShadowSecondary
  };

  const homeLink = isTeacher
    ? '/dashboard/home'
    : `/dashboard/manage-institutions/institution/${instId}/staff`;

  return (
    <div id="top-menu" style={contentStyle} className={`w-full `}>
      <div className="flex px-8 justify-between items-center">
        <div className="w-auto mr-5">
          <NavLink to={homeLink}>
            <img
              className="h-12 w-auto cursor-pointer"
              src={getAsset(getClientKey(), 'loading_logo')}
              alt="Workflow"
            />
          </NavLink>
        </div>
        <HeaderMegaMenu />
        <DropDownMenu />
      </div>
    </div>
  );
};

export default Navbar;
