import DropDownMenu from '@components/Dashboard/DropDownMenu/DropDownMenu';
import HeaderMegaMenu from '@components/Dashboard/Menu/HeaderMegaMenu';
import {useGlobalContext} from '@contexts/GlobalContext';
import {getClientKey} from '@utilities/strings';
import {getAsset} from 'assets';
import React from 'react';
import {useHistory} from 'react-router';

const Navbar = () => {
  const history = useHistory();

  const {dispatch} = useGlobalContext();

  const handleLink = () => {
    history.push('/dashboard/home');
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'homepage'}});
  };

  // check if url contains game-changers
  const isGameChangers = window.location.href.includes('game-changers');

  return (
    <div id="top-menu" className={`w-full ${isGameChangers ? 'bg-black' : 'bg-white'}`}>
      <div className="flex px-8 justify-between items-center">
        <div className="w-auto mr-5">
          <img
            onClick={handleLink}
            className="h-12 w-auto cursor-pointer"
            src={getAsset(getClientKey(), 'loading_logo')}
            alt="Workflow"
          />
        </div>
        <HeaderMegaMenu />
        <DropDownMenu />
      </div>
    </div>
  );
};

export default Navbar;
