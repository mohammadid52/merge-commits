import React from 'react';
import ActionButton from '../Actions/ActionButton';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaGraduationCap } from 'react-icons/fa';

interface InstitutionInfoProps {
  children?: React.ReactNode;
  id?: string;
  name?: string;
  website?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  state?: string;
  address?: string;
}

const InstitutionInfo: React.FC<InstitutionInfoProps> = (
  instPrps: InstitutionInfoProps
) => {
  const match = useRouteMatch();

  return (
    <>
      <div className='w-full'>
        <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg'>
          {/* <p>{instPrps.temp}</p> */}
          <div className='px-4 py-5 flex border-b border-gray-200 sm:px-6'>
            <span>
              <IconContext.Provider
                value={{
                  size: '1rem',
                  color: '#4a5568',
                  style: { maxWidth: '2rem' },
                }}
              >
                <FaGraduationCap />
              </IconContext.Provider>
            </span>
            <span style={{ display: 'inline-block' }}>
              Specific Institution Info
            </span>
          </div>

          <div className='px-4 py-5 sm:px-6'>
            <dl className='grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2'>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Title
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.name ? instPrps.name : 'n/a'}`}
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Website
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.website ? instPrps.website : 'n/a'}`}
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Contact Person
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.contactPerson ? instPrps.contactPerson : 'n/a'}`}
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Email
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.email ? instPrps.email : 'n/a'}`}
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Phone
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.phone ? instPrps.phone : 'n/a'}`}
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  State
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.state ? instPrps.state : 'n/a'}`}
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Address
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.address ? instPrps.address : 'n/a'}`}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className='px-4 mt-4 flex justify-end'>
        <NavLink to={`${match.url}/edit`}>
          <ActionButton
            label='Edit'
            compClass='w-32 text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700
          inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out'
          />
        </NavLink>
      </div>
    </>
  );
};

export default InstitutionInfo;
