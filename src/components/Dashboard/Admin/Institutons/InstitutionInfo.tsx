import React from 'react';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaGraduationCap, FaChalkboardTeacher, FaHotel } from 'react-icons/fa';

import ActionButton from '../Actions/ActionButton';
import { initials, stringToHslColor } from '../../../../utilities/strings';
import UnderlinedTabs from '../../../Atoms/UnderlinedTabs';
import { IoPeople } from 'react-icons/io5';

interface InstitutionInfoProps {
  name?: string;
}

const InstitutionInfo = (instProps: InstitutionInfoProps) => {
  const { } = instProps;
  const match = useRouteMatch();

  const tabs = [
    { index: 0, title: 'Curricular', icon: <FaGraduationCap />, active: true, content: <p className="p-16 text-center">No data</p> },
    { index: 1, title: 'Classes', icon: <FaChalkboardTeacher />, active: false, content: <p className="p-16 text-center">No data</p> },
    { index: 2, title: 'Staff', icon: <IoPeople />, active: false, content: <p className="p-16 text-center">No data</p> },
    { index: 3, title: 'Rooms', icon: <FaHotel />, active: false, content: <p className="p-16 text-center">No data</p> }
  ]
  return (
    <div>
      <div className="h-9/10 flex flex-col md:flex-row">

        {/* Profile section */}
        <div className="w-auto p-4 flex mr-4 flex-col text-center items-center">
          <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex flex-shrink-0 justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
            <div className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full" style={{ background: `${stringToHslColor('I' + ' ' + 'N')}`, textShadow: '0.2rem 0.2rem 3px #423939b3' }}>
              {initials('IN', 'NI')}
            </div>
          </div>
          <div className="text-xl font-bold font-open text-gray-900 mt-4">
            <p>
              ICONOCLAST ARTISTS
            </p>
          </div>
        </div>

        {/* General information section */}
        <div className='w-full'>
          {/* <UnderlinedTabs tabs={tabs} /> */}

          <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                General Information
              </h3>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-400 p-4">
              <div className="p-8">
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Address:</span>
                  <span className="w-auto">
                    1234 Somewhere St., <br />NYC street, Houston, <br />TX.-36002
                  </span>
                </p>
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Contact No:</span>
                  <span className="w-auto">1234567898</span>
                </p>
              </div>
              <div className="p-8">
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Institution Type:</span>
                  <span className="w-auto">ORG</span>
                </p>
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Website:</span>
                  <span className="w-auto">iconoclastartist.org</span>
                </p>
              </div>
            </div>
          </div>
          <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg'>
            {/* <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Other Information
              </h3>
            </div> */}
            <div className='px-4 py-5 sm:px-6'>
              <UnderlinedTabs tabs={tabs} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstitutionInfo;

const InstituteData = {

}