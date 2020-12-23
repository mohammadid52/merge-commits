import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaTrashAlt } from 'react-icons/fa';
import ActionButton from '../Actions/ActionButton';

interface InstitutionRowProps {
  children?: React.ReactNode;
  id?: string;
  name: string;
  state?: string;
  address?: string;
  website?: string;
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

  const handleInstitutionView = () => {
    history.push(`${match.url}/institution?id=${instRowPrps.id}`);
    console.log('Institution view: ', instRowPrps.id)
  }

  const handleInstitutionDelet = () => {
    // Api for deleting institution will go here.
    console.log("instituion delete")
  }

  return (
    <div className='w-full flex justify-between border-b border-gray-200 '>
      <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto flex items-center'>{instRowPrps.id}</span>
      </div>
      <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto flex items-center'>{instRowPrps.name}</span>
      </div>
      <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto flex items-center'>{instRowPrps.state}</span>
      </div>
      <div className='w-3/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto flex items-center'>{instRowPrps.address}</span>
      </div>
      <div className='w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto flex items-center'>{instRowPrps.website}</span>
      </div>
      <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 whitespace-no-wrap text-right text-sm leading-5 font-medium'>
        <span className='w-auto flex'>
          <ActionButton
            label='Edit'
            compClass='text-indigo-600 hover:text-indigo-900 font-medium'
            func={handleInstitutionView}
          />
          <span className="w-8 ml-4" onClick={handleInstitutionDelet}>
            <IconContext.Provider value={{ size: '2rem', color: '#5a67d8' }}>
              <FaTrashAlt />
            </IconContext.Provider>
          </span>
        </span>
      </div>
    </div>
  );
};

export default InstitutionRow;
