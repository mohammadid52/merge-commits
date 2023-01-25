import Placeholder from '@components/Atoms/Placeholder';
import {getImageFromS3} from '@utilities/services';
import {API, graphqlOperation} from 'aws-amplify';
import InformationalWalkThrough from 'components/Dashboard/Admin/Institutons/InformationalWalkThrough/InformationalWalkThrough';
import HeaderTextBar from 'components/Dashboard/HeaderTextBar/HeaderTextBar';
import * as customQueries from 'customGraphql/customQueries';
import React, {useEffect, useState} from 'react';
import {BsFillInfoCircleFill} from 'react-icons/bs';
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
  const [institute, setInstitute] = useState(null);

  const fetchInfo = async () => {
    try {
      setIsLoading(true);
      const res: any = await API.graphql(
        graphqlOperation(customQueries.getInstitutionBasicInfo, {id: id})
      );
      setInstitute(res.data.getInstitution);
      // await getUrl(res.data.getInstitution.image);
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

  if (isLoading && !Boolean(institute)) return <div className="py-4" />;
  return (
    <div>
      <div className="flex items-center justify-center">
        <h4 className="w-auto text-sm font-medium">{institute.name}</h4>
        <h4 className="w-auto text-sm font-medium ml-2">|| {courseName}</h4>
      </div>
    </div>
  );
};

const DashboardContainer = ({
  user,

  bannerTitle,
  bannerImg,
  children,
  institutionId,
  showTitleBanner = true,
  courseName = ''
}: DashboardContainerProps) => {
  const isTeacher = user?.role === 'TR' || user?.role === 'FLW';
  const isOnDemandStudent = user?.onDemand;

  const [openWalkThroughModal, setOpenWalkThroughModal] = useState(false);

  return (
    <>
      <div className={`flex flex-row`}>
        <div>
          <HeroBanner imgUrl={bannerImg} title={bannerTitle} />
          {showTitleBanner ? (
            <HeaderTextBar>
              <div className="flex items-center justify-center">
                {institutionId ? (
                  <InstitutionName courseName={courseName} id={institutionId} />
                ) : (
                  <div className="py-4"></div>
                )}
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
