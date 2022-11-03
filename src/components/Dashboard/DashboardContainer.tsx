import React, {useState} from 'react';
import {BsFillInfoCircleFill} from 'react-icons/bs';
import {getAsset} from 'assets';
import HeroBanner from '../Header/HeroBanner';
import InformationalWalkThrough from 'components/Dashboard/Admin/Institutons/InformationalWalkThrough/InformationalWalkThrough';
import HeaderTextBar from 'components/Dashboard/HeaderTextBar/HeaderTextBar';

interface DashboardContainerProps {
  user?: any;
  theme?: any;
  clientKey?: any;
  showTitleBanner?: boolean;
  bannerTitle: string;
  bannerImg: string;
  children: any;
  label?: string;
  courseName?: string;
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
  courseName = ''
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
            <HeaderTextBar>
              <div className="flex items-center justify-center">
                <h2 className={`text-sm mr-2 w-auto 2xl:text-xl text-center font-normal`}>
                  {isTeacher ? (
                    <span className="font-semibold">{'Classroom Manager'}</span>
                  ) : isOnDemandStudent ? (
                    <span className="font-semibold">
                      {'Classroom Lessons Self-Paced'}
                    </span>
                  ) : (
                    <span className="font-semibold">{`Classroom Lessons - ${courseName}`}</span>
                  )}
                </h2>
                {isTeacher && (
                  <div className="w-auto">
                    <span
                      className="w-auto cursor-pointer"
                      onClick={() => setOpenWalkThroughModal(true)}>
                      <BsFillInfoCircleFill
                        className={`h-4 w-4 md:w-5 md:h-5 text-white`}
                      />
                    </span>
                  </div>
                )}
              </div>
            </HeaderTextBar>
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
