import React from 'react';

interface InstitutionInfoProps {
  children?: React.ReactNode;
}

const InstitutionInfo: React.FC<InstitutionInfoProps> = (
  instPrps: InstitutionInfoProps
) => {
  return (
    <>
      <div className='w-full md:px-2 pt-2'>
        <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>
          {/* <p>{instPrps.temp}</p> */}
          <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Specific Institution Info
            </h3>
          </div>

          <div className='px-4 py-5 sm:px-6'>
            <dl className='grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2'>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Title
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  Institution name
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Website
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  Institution Website
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Contact Person
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  Contact Person
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Email
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  @@@@
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Phone
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  Phone
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  State
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  Institution State
                </dd>
              </div>
              <div className='sm:col-span-1'>
                <dt className='text-base leading-5 font-medium text-gray-500'>
                  Address
                </dt>
                <dd className='mt-2 text-base leading-5 text-gray-900'>
                  Institution Address
                </dd>
              </div>
              
            </dl>
          </div>
        </div>

        <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg'>
          <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Secondary Information
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstitutionInfo;
