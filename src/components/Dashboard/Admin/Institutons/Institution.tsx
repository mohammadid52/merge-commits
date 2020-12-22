import React, { useState, useEffect, useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaEdit } from 'react-icons/fa';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { GlobalContext } from '../../../../contexts/GlobalContext';
import * as queries from '../../../../graphql/queries';
import ActionButton from '../Actions/ActionButton';
import { initials, stringToHslColor } from '../../../../utilities/strings';
import InstitutionInfo from './InstitutionInfo';
import InstitutionEdit from './InstitutionEdit';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import Buttons from '../../../Atoms/Buttons';
import PageWrapper from '../../../Atoms/PageWrapper';


export interface InstitutionInfo {
  id: string;
  name: string;
  institutionTypeId?: string;
  institutionType?: null;
  district?: null;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  contact?: { name: string; email: string; phone: string };
  website?: string;
  type?: null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  addressLine2?: any
}

/**
 * Institution parent component
 * Responsible for fetching institution data and populating the component
 * with data from the API
 */
const Institution: React.FC = () => {
  const [institutionData, setInstitutionData] = useState<InstitutionInfo>({
    id: '',
    name: '',
    institutionTypeId: '',
    institutionType: null,
    district: null,
    address: '',
    city: '',
    state: '',
    zip: '',
    contact: { name: '', email: '', phone: '' },
    website: '',
    type: null,
    image: '',
    createdAt: '',
    updatedAt: '',
    addressLine2: ''
  });
  const { theme } = useContext(GlobalContext);
  const history = useHistory();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, "");
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const match = useRouteMatch();
  const urlQueryParams = queryString.parse(location.search);
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Institution Management', url: '/dashboard/manage-institutions', last: false },
    { title: 'Institute Info', url: `${location.pathname}${location.search}`, last: true }
  ];

  // async function getInstitutionData() {
  //   try {
  //     const fetchInstitutionData: any = await API.graphql(
  //       /**
  //        * Below query will get the 'id' parameter from the url
  //        * DO NOT change the ' urlQueryParams.id ' unless you also change the url
  //        * in ' InstitutionRow.tsx '
  //        */
  //       graphqlOperation(queries.getInstitution, { id: urlQueryParams.id })
  //     );
  //     if (!fetchInstitutionData) {
  //       throw new Error('getInstitutionData() fetch : fail!');
  //     } else {
  //       setInstitutionData(fetchInstitutionData.data.getInstitution);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  useEffect(() => {
    // getInstitutionData();
    // setInstitutionData(tempInstitutionData)
  }, []);

  return (
    <div className={`w-full h-full mt-4`}>

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Institute Information" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
          {currentPath !== 'edit' ? (
              <Buttons btnClass="mr-4" onClick={() => history.push(`${match.url}/edit`)} Icon={FaEdit} />
            ) : null
            }
        </div>
      </div>

      <PageWrapper>
        {/* <div className="h-9/10 flex flex-col md:flex-row"> */}

          {/* Profile section */}
          {/* <div className="w-auto p-4 flex flex-col text-center items-center">
            <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
              <div className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full" style={{ background: `${stringToHslColor('I' + ' ' + 'N')}`, textShadow: '0.2rem 0.2rem 3px #423939b3' }}>
                {initials('IN', 'NI')}
              </div>
            </div>
          </div> */}

          {/* Other Info Section */}
          <Switch>
            <Route
              path={`${match.url}/edit`}
              render={() => (
                <InstitutionEdit institute={institutionData} />
              )}
            />

            <Route
              path={`${match.url}/`}
              render={() => (
                <InstitutionInfo />
              )}
            />
          </Switch>
        {/* </div> */}
        <div>

        </div>
      </PageWrapper>
      {/* <div
        className={`w-full h-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
        <div className='h-9/10 flex flex-row flex-end'>

          <div className='w-auto p-4 flex flex-col text-center items-center'>
            <div
              className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
              <IconContext.Provider value={{ size: '8rem', color: '#4a5568' }}>
                <FaGraduationCap />
              </IconContext.Provider>
            </div>
            <div
              className={`text-lg md:text-3xl font-bold font-open text-gray-900 mt-4`}>
              <p className='text-md md:text-lg'>
                {`${institutionData.name ? institutionData.name : ''}`}
              </p>
            </div>
          </div>
          <div className='w-full md:px-2 pt-2 flex flex-col'>
            <div className='mb-4 w-full flex justify-end'>
              <div className="w-auto">
                <button type="button" onClick={() => history.goBack} className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out items-center">
                  Back
                  <span className="w-8 pl-3 h-4 flex items-center">
                    <IconContext.Provider value={{ size: '2rem', color: '#ffffff' }}>
                      <IoArrowUndoCircleOutline />
                    </IconContext.Provider>
                  </span>
                </button>
              </div>
            </div>
            {/* 
              INFO/edit switch
              */}
      {/* <Switch>
              <Route
                path={`${match.url}/edit`}
                render={() => (
                  <InstitutionEdit institute={institutionData} />
                )}
              />

              <Route
                path={`${match.url}/`}
                render={() => (
                  <InstitutionInfo institute={institutionData} />
                )}
              />
            </Switch>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Institution;

// const tempInstitutionData = {
//   address: "1234 Somewhere St.",
//   addressLine2: null,
//   city: "Houston",
//   classes: { items: [], nextToken: null },
//   createdAt: "2020-07-23T10:30:09.985Z",
//   curricula: { items: [], nextToken: null },
//   district: null,
//   filters: null,
//   id: "1",
//   image: null,
//   isServiceProvider: null,
//   name: "Iconoclast Artists",
//   phone: null,
//   rooms: { items: [], nextToken: null },
//   serviceProviders: { items: [], nextToken: null },
//   staff: { items: [], nextToken: null },
//   state: "TX",
//   type: "ORG",
//   updatedAt: "2020-07-23T10:30:09.985Z",
//   website: "www.iconoclastartists.org",
//   zip: "77077",
// }