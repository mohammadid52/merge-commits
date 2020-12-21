import React from 'react';
import ActionButton from '../Actions/ActionButton';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaGraduationCap } from 'react-icons/fa';

interface InstitutionInfoProps {
  name: string;
}

const InstitutionInfo = (instProps: InstitutionInfoProps) => {
  const { } = instProps;
  const match = useRouteMatch();

  return (
    <div className='w-full'>
      <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            General Information
            </h3>
        </div>


        <div className='px-4 py-5 sm:px-6'>
          <dl className='grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2'>

            <div className='sm:col-span-1 p-2'>
              <dt className='text-base leading-5 font-medium text-gray-500'>
                Title
                </dt>
              <dd className='mt-2 text-base leading-5 text-gray-900'>
                {/* {`${instPrps.name ? instPrps.name : '--'}`} */}
                name
              </dd>
            </div>
            <div className='sm:col-span-1 p-2'>
              <dt className='text-base leading-5 font-medium text-gray-500'>
                Website
                </dt>
              <dd className='mt-2 text-base leading-5 text-gray-900'>
                {/* {`${instPrps.website ? instPrps.website : '--'}`} */}
                website
              </dd>
            </div>
            <div className='sm:col-span-1 p-2'>
              <dt className='text-base leading-5 font-medium text-gray-500'>
                Contact Person
                </dt>
              <dd className='mt-2 text-base leading-5 text-gray-900'>
                contactname
                {/* {`${instPrps.contact?.name ? instPrps.contact.name : '--'}`} */}
              </dd>
            </div>
            <div className='sm:col-span-1 p-2'>
              <dt className='text-base leading-5 font-medium text-gray-500'>
                Email
                </dt>
              <dd className='mt-2 text-base leading-5 text-gray-900'>
                {/* {`${instPrps.contact.email ? instPrps.contact.email : '--'}`} */}
                  abc@gmail.com
                </dd>
            </div>
            {/* <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Phone
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  {`${instPrps.institute.phone ? instPrps.institute.phone : 'n/a'}`}
                </dd>
              </div> */}
            <div className='sm:col-span-1 p-2'>
              <dt className='text-base leading-5 font-medium text-gray-500'>
                State
                </dt>
              <dd className='mt-2 text-base leading-5 text-gray-900'>
                {/* {`${instPrps.state ? instPrps.state : '--'}`} */}
                state
              </dd>
            </div>
            <div className='sm:col-span-1 p-2'>
              <dt className='text-base leading-5 font-medium text-gray-500'>
                Address
                </dt>
              <dd className='mt-2 text-base leading-5 text-gray-900'>
                addr 1
                {/* {`${instPrps.address ? instPrps.address : '--'}`} */}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg'>

        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Institute Classes
            </h3>
        </div>

        <div className='px-4 py-5 sm:px-6'>
          <dl className='grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2'>

          </dl>
        </div>
      </div>

    </div>
  );
};

export default InstitutionInfo;

const InstituteData = {

}