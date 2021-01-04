import React from 'react'
import { useLocation, useHistory, useRouteMatch } from 'react-router';
import { IoArrowUndoCircleOutline, IoSpeedometerSharp } from 'react-icons/io5';
import { BiNotepad } from 'react-icons/bi';
import { MdSpeakerNotes } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

import BreadCrums from '../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../Atoms/PageWrapper';
import UnderlinedTabs from '../../../../../Atoms/UnderlinedTabs';
import SyllabusList from './TabsListing/SyllabusList';
import TopicsList from './TabsListing/TopicsList';
import MeasMntList from './TabsListing/MeasMntList';

interface CurricularViewProps {

}

const CurricularView = (props: CurricularViewProps) => {
  const { } = props;

  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, "");
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Curricular Info', url: `/dashboard/manage-institutions/curricular?id=${params.get('id')}`, last: true }
  ]
  const tabs = [
    { index: 0, title: 'Topics', icon: <MdSpeakerNotes />, active: true, content: <TopicsList /> },
    { index: 1, title: 'Syllabus', icon: <BiNotepad />, active: false, content: <SyllabusList /> },
    { index: 2, title: 'Measurements', icon: <IoSpeedometerSharp />, active: false, content: <MeasMntList /> },
  ]
  return (
    <div className="w-9/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Curricular Info" subtitle="Curricular information" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
          {currentPath !== 'edit' ? (
            <Buttons btnClass="mr-4" onClick={() => history.push(`${match.url}/edit?id=${params.get('id')}`)} Icon={FaEdit} />
          ) : null
          }
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-full">
            <div className='bg-white shadow-5 sm:rounded-lg mb-4'>
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  General Information
                </h3>
              </div>

              <div className="grid grid-cols-2 divide-x divide-gray-400 p-4">
                <div className="p-8">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Name:</span>
                    <span className="w-auto">
                      Static curricular name
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Institution Name:</span>
                    <span className="w-auto">Iconoclast artist.</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Description:</span>
                    <span className="w-7/10">
                      Description...Lorem Ipsum is simply dummy text of the printing
                      and typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown printer
                    </span>
                  </p>
                </div>
                <div className="p-8">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Designers:</span>
                    <span className="w-auto">
                      Designer Name
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Languages:</span>
                    <span className="w-auto">Englist, Spanish</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">Objective:</span>
                    <span className="w-7/10">
                      Objectives...Lorem Ipsum is simply dummy text of the printing
                      and typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown printer
                      </span>
                  </p>
                </div>
              </div>

            </div>
            <div className='bg-white shadow-5 sm:rounded-lg'>
              <div className='px-4 py-5 sm:px-6'>
                <UnderlinedTabs tabs={tabs} />
              </div>
            </div>

          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

export default CurricularView
