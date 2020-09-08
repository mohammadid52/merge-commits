import React from 'react';
import ActionButton from '../Actions/ActionButton';

interface InstitutionRowProps {
  children?: React.ReactNode;
  id?: string;
  state?: string;
  address?: string;
  website?: string;
}

const InstitutionRow: React.FC<InstitutionRowProps> = (
  instRowPrps: InstitutionRowProps
) => {
  return (
    <div className='w-full flex justify-between border-b border-gray-200 '>
      <div className='w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span>{instRowPrps.id}</span>
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
      <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
        <span className='w-auto'>
          <ActionButton 
          label='view' 
          compClass='text-indigo-600 hover:text-indigo-900'
          />
        </span>
      </div>
    </div>
  );
};

export default InstitutionRow;
