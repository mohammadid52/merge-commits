import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
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

  return (
    <div className='w-full flex justify-between border-b border-gray-200 '>
      <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto'>{instRowPrps.id}</span>
      </div>
      <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto'>{instRowPrps.name}</span>
      </div>
      <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto'>{instRowPrps.state}</span>
      </div>
      <div className='w-3/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto'>{instRowPrps.address}</span>
      </div>
      <div className='w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto'>{instRowPrps.website}</span>
      </div>
      <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left whitespace-no-wrap text-right text-sm leading-5 font-medium'>
        <span className='w-auto'>
          <ActionButton
            label='View'
            compClass='text-indigo-600 hover:text-indigo-900'
            func={handleInstitutionView}
          />
        </span>
      </div>
    </div>
  );
};

export default InstitutionRow;
