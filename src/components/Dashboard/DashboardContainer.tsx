import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import HeroBanner from '../Header/HeroBanner';
import SideWidgetBar from './Noticebooard/SideWidgetBar';

interface DashboardContainerProps {
  currentPage: string;
  bannerTitle: string;
  bannerImg: string;
  children: any;
}

const DashboardContainer = ({ currentPage, bannerTitle, bannerImg, children }: DashboardContainerProps) => {
  const { state } = useContext(GlobalContext);

  return (
    <>
      <HeroBanner imgUrl={bannerImg} title={bannerTitle} />
      {/* <div className="flex flex-col min-w-0 flex-1">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">{children}</main>
        <aside className="relative xl:flex xl:flex-col flex-shrink-0 w-96 border-l border-gray-200">
          <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
            <SideWidgetBar currentPage={currentPage} />
          </div>
        </aside>
      </div> */}
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
