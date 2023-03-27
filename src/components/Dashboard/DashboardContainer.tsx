import ErrorBoundary from '@components/Error/ErrorBoundary';
import {API, graphqlOperation} from 'aws-amplify';
import HeaderTextBar from 'components/Dashboard/HeaderTextBar/HeaderTextBar';
import * as customQueries from 'customGraphql/customQueries';
import React, {useEffect, useState} from 'react';
import HeroBanner from '../Header/HeroBanner';

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
  institutionId?: string;
}

const InstitutionName = ({id, courseName}: {id: string; courseName: string}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [institute, setInstitute] = useState({name: '--'});

  const fetchInfo = async () => {
    try {
      setIsLoading(true);
      const res: any = await API.graphql(
        graphqlOperation(customQueries.getInstitutionBasicInfo, {id: id})
      );
      setInstitute(res.data.getInstitution);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInfo();
    }
  }, [id]);

  return !isLoading ? (
    <div className="flex items-center flex-col sm:flex-row justify-center">
      <h4 className=" mb-0 w-auto text-sm font-medium">{institute.name || '--'}</h4>
      <span className=" mb-0 hidden w-auto sm:block mx-4">•</span>
      <h4 className=" mb-0 w-auto text-sm font-medium">{courseName || '--'}</h4>
    </div>
  ) : (
    <div>--</div>
  );
};

const DashboardContainer = ({
  bannerTitle,
  bannerImg,
  children,
  institutionId,
  showTitleBanner = true,
  courseName = ''
}: DashboardContainerProps) => {
  return (
    <ErrorBoundary componentName="DashboardContainer">
      <div className={`flex flex-row`}>
        <div className="w-full">
          <HeroBanner imgUrl={bannerImg} title={bannerTitle} />
          {showTitleBanner ? (
            <HeaderTextBar>
              <div className="header-text-bar_inner flex items-center justify-center">
                {institutionId ? (
                  <InstitutionName courseName={courseName} id={institutionId} />
                ) : (
                  <div className="py-4"></div>
                )}
                {/* {isTeacher && (
                  <div className="w-auto">
                    <span
                      className="w-auto cursor-pointer"
                      onClick={() => setOpenWalkThroughModal(true)}>
                      <BsFillInfoCircleFill
                        className={`h-4 w-4 md:w-5 md:h-5 text-white`}
                      />
                    </span>
                  </div>
                )} */}
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
      {/* <InformationalWalkThrough
        open={openWalkThroughModal}
        onCancel={() => setOpenWalkThroughModal(false)}
      /> */}
    </ErrorBoundary>
  );
};

export default React.memo(DashboardContainer);
