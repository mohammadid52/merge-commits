import {InstitutionInfoProps} from '@interfaces/InstitutionInterface';
import {useEffect, useState} from 'react';
import NavBarRouter from '../../../../router/NavBarRouter';
import InstitutionProfile from './InstitutionProfile';

const InstitutionInfo = (instProps: InstitutionInfoProps) => {
  const {institute} = instProps;

  // ~~~~~~~~~~~ CURRICULAR LIST ~~~~~~~~~~~ //
  const [curricular, setCurricular] = useState<any>({});
  useEffect(() => {
    if (instProps?.institute?.curricula) {
      setCurricular(instProps?.institute?.curricula);
    }
  }, [instProps?.institute?.curricula]);

  const updateCurricularList = (itemObj: any) => {
    setCurricular({
      ...curricular,
      items: curricular.items.filter(
        (curriculumObj: any) => curriculumObj.id !== itemObj.id
      )
    });
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div>
      <div className="">
        {/* Profile section */}
        <div className="flex-col flex justify-center lg:justify-start w-full">
          <div className="flex flex-1 overflow-x-hidden mb-8">
            <div className="w-full">
              <NavBarRouter
                {...instProps}
                updateCurricularList={updateCurricularList}
                curricular={curricular}
              />
            </div>
          </div>

          <InstitutionProfile institute={institute} />
        </div>
      </div>
    </div>
  );
};

export default InstitutionInfo;
