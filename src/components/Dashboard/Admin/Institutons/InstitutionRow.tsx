import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import ActionButton from '../Actions/ActionButton';

import { stringToHslColor, formatPattern, initials, getInitialsFromString } from '../../../../utilities/strings';

interface InstitutionRowProps {
  children?: React.ReactNode;
  id?: string;
  name?: string;
  image?: string;
  state?: string;
  address?: string;
  website?: string;
  type?: string;
  city?: string;
  institute?: [];
}

/**
 * This component represents a single row in the institutes page
 * @param instRowPrps - Props which provide a single Institute object with the key/values as described in the interface above
 */

const InstitutionRow: React.FC<InstitutionRowProps> = (
  instRowPrps: InstitutionRowProps
) => {
  const match = useRouteMatch();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState();
  const { } = instRowPrps.institute;
  const handleInstitutionView = () => {
    history.push(`${match.url}/institution?id=${instRowPrps.id}`);
    console.log('Institution view: ', instRowPrps.id)
  }

  const handleInstitutionDelet = () => {
    // Api for deleting institution will go here.
    console.log("instituion delete")
  }

  useEffect(() => {
    console.log(formatPattern('2020-07-23T10:30:09.985Z', '-', 'aaaa-bb-cc', 'bb-cc-aaaa'))
  }, [])
  return (
    // <div className='w-full flex justify-between border-b border-gray-200 '>
    //   <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
    //     <span className='w-auto flex items-center'>{instRowPrps.id}</span>
    //   </div>
    //   <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
    //     <span className='w-auto flex items-center'>{instRowPrps.name}</span>
    //   </div>
    //   <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
    //     <span className='w-auto flex items-center'>{instRowPrps.state}</span>
    //   </div>
    //   <div className='w-3/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
    //     <span className='w-auto flex items-center'>{instRowPrps.address}</span>
    //   </div>
    //   <div className='w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
    //     <span className='w-auto flex items-center'>{instRowPrps.website}</span>
    //   </div>
    //   <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 whitespace-no-wrap text-right text-sm leading-5 font-medium'>
    //     <span className='w-auto flex'>
    //       <ActionButton
    //         label='Edit'
    //         compClass='text-indigo-600 hover:text-indigo-900 font-medium'
    //         func={handleInstitutionView}
    //       />
    //     </span>
    //   </div>
    // </div>

    // -----------------------------------------

    <div id={instRowPrps.id} className="flex justify-between bg-white w-full border-b border-gray-200">

      <div className="w-3.5/10 px-8 py-4 whitespace-no-wrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center">
            {instRowPrps.image ?
              (<img
                src={imageUrl}
                className="h-8 w-8 rounded-full" />) :
              <div className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold" style={{ background: `${stringToHslColor(getInitialsFromString(instRowPrps.name)[0] + ' ' + getInitialsFromString(instRowPrps.name)[1])}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                {instRowPrps.name ? initials(getInitialsFromString(instRowPrps.name)[0], getInitialsFromString(instRowPrps.name)[1]) : initials('N', 'A')}
              </div>}
          </div>
          <div className="ml-2">
            <div id={instRowPrps.id} className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900" onClick={handleInstitutionView} >
              {instRowPrps.name}
            </div>
            {/* <div id={instRowPrps.id} className="text-sm leading-5 text-gray-500">
              {instRowPrps.city ? instRowPrps.city : ''},
            </div> */}
          </div>
        </div>
      </div>
      <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-no-wrap">
        <span id={instRowPrps.id} className="w-auto text-sm leading-5 text-gray-500">
          {instRowPrps.state ? instRowPrps.state : '--'}
        </span>
      </div>
      <div className="w-3.5/10 flex justify-center px-8 py-4 whitespace-no-wrap">
        <div className="flex flex-col justify-center items-center">
          <div id={instRowPrps.id} className="w-auto text-sm leading-5 text-gray-900">{instRowPrps.website ? instRowPrps.website : '--'}</div>
          {/* <div id={instRowPrps.id} className="w-auto text-sm leading-5 text-gray-500">{item.grade ? item.grade : '--'}</div> */}
        </div>
      </div>
      <div className="w-1.5/10 flex justify-center items-center px-8 py-4 whitespace-no-wrap">
        <div className="w-16 flex justify-center text-sm leading-5 text-gray-500">
          {/* <UserStatus
            status={item.status ? item.status : '--'} /> */}
          {instRowPrps.type ? instRowPrps.type : '--'}
        </div>
      </div>
      <div className="w-1/10 flex justify-center items-center pr-4 py-4 cursor-pointer whitespace-no-wrap text-right text-sm leading-5 font-medium" onClick={handleInstitutionView} >
        <div id={instRowPrps.id} className="flex justify-center text-indigo-600 hover:text-indigo-900">Edit</div>
      </div>


    </div>
  );
};

export default InstitutionRow;
