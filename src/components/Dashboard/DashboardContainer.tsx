import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import HeroBanner from '../Header/HeroBanner';
import SideWidgetBar from './Noticebooard/SideWidgetBar';
import isEmpty from 'lodash/isEmpty';
import { getAsset } from '../../assets';

interface DashboardContainerProps {
  currentPage: string;
  bannerTitle: string;
  bannerImg: string;
  children: any;
}

const DashboardContainer = ({ currentPage, bannerTitle, bannerImg, children }: DashboardContainerProps) => {
  const { state, theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const user = !isEmpty(state) ? { firstName: state.user.firstName, preferredName: state.user.firstName } : null;
  const currentUnit = () => {
    if (!isEmpty(state)) {
      const filtered = state.roomData.syllabus.find((syllabusObj: any) => syllabusObj.active);
      if (filtered) {
        return filtered.name;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <>
      <HeroBanner imgUrl={bannerImg} title={bannerTitle} />
      {user && (
        <div
          className={`${theme.section} -mt-6 mb-4 px-6 py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
          <h2 className={`text-base text-center font-normal`}>
            <span className="font-semibold">{currentUnit() || 'Unit'}</span>
          </h2>
        </div>
      )}
      <div className="flex-1 h-full relative z-0 flex">
        <main className="flex-1 relative z-0 focus:outline-none">{children}</main>
        {state.roomData && state.roomData.widgets.length > 0 && (
          <aside className="hidden relative xl:flex xl:flex-col flex-shrink-0 w-96">
            <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
              <SideWidgetBar currentPage={currentPage} />
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default DashboardContainer;
