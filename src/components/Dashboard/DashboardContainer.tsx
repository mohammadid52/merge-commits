import React, {useState} from 'react';
import {BsFillInfoCircleFill} from 'react-icons/bs';
import {getAsset} from '../../assets';
import HeroBanner from '../Header/HeroBanner';
import InformationalWalkThrough from './Admin/Institutons/InformationalWalkThrough/InformationalWalkThrough';

interface DashboardContainerProps {
  user?: any;
  theme?: any;
  clientKey?: any;
  showTitleBanner?: boolean;
  bannerTitle: string;
  bannerImg: string;
  children: any;
  label?: string;
}

const DashboardContainer = ({
  user,
  theme,
  clientKey,
  bannerTitle,
  bannerImg,
  children,
  label,
  showTitleBanner = true,
}: DashboardContainerProps) => {
  const isTeacher = user?.role === 'TR' || user?.role === 'FLW';
  const isOnDemandStudent = user?.onDemand;
  const themeColor = getAsset(clientKey, 'themeClassName');
  const themeSection = theme?.section ? theme?.section : '';
  const themeBackground = theme?.backGround ? theme?.backGround[themeColor] : '';

  const [openWalkThroughModal, setOpenWalkThroughModal] = useState(false);

  // const userObject = !isEmpty(user)
  //   ? {firstName: user.firstName, preferredName: user.firstName}
  //   : null;
  // const currentUnit = () => {
  //   if (!isEmpty(state)) {
  //     const filtered = state.roomData.syllabus?.find(
  //       (syllabusObj: any) => syllabusObj.active
  //     );
  //     if (filtered) {
  //       return filtered.name;
  //     } else {
  //       return null;
  //     }
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <>
      <div className={`flex flex-row`}>
        <div>
          <HeroBanner imgUrl={bannerImg} title={bannerTitle} />
          {showTitleBanner ? (
            <div
              className={`${themeSection} -mt-4 2xl:-mt-6 mb-4 px-6 py-2 2xl:py-4 m-auto relative ${themeBackground} text-white rounded`}>
              <h2 className={`text-sm 2xl:text-xl text-center font-normal`}>
                {isTeacher ? (
                  <span className="font-semibold">{'Classroom Manager'}</span>
                ) : isOnDemandStudent ? (
                  <span className="font-semibold">{'Classroom Lessons On-Demand'}</span>
                ) : (
                  <span className="font-semibold">{'Classroom Lessons'}</span>
                )}
              </h2>
              <div className="absolute z-100 w-6 right-1">
                <span
                  className="w-auto cursor-pointer"
                  onClick={() => setOpenWalkThroughModal(true)}>
                  <BsFillInfoCircleFill className={`h-5 w-5 text-white`} />
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-4" />
          )}
          <div className="flex-1 h-full relative z-0 flex">
            <main className="flex-1 relative z-0 focus:outline-none">{children}</main>
          </div>
        </div>
      </div>
      <InformationalWalkThrough
        open={openWalkThroughModal}
        onCancel={() => setOpenWalkThroughModal(false)}
      />
    </>
  );
};

export default React.memo(DashboardContainer);
