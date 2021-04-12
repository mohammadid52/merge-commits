import React, { Fragment } from 'react';

const PageSelector = (props: { universalBuilderDict: any, userLanguage: any, loading: boolean }) => {
  return <>
    <div className='px-4 py-5 border-b-0 border-gray-200 sm:px-6'>
      <h3 className='text-lg leading-6 font-medium text-gray-900'>
        {props.universalBuilderDict[props.userLanguage]['GALLERY']['LESSON_PAGES']}
      </h3>
    </div>
    {props.loading ? (
      <div className='py-20 text-center mx-auto'>
        <p>{props.universalBuilderDict[props.userLanguage]['FETCHING']}</p>
      </div>
    ) : (
      <Fragment>
        <div className='p-4 max-h-screen overflow-y-auto'>
          <div className='py-2'>
            <ul className='grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
              <li
                className='col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200'>
                <div className='flex-1 flex flex-col p-8'>Page</div>
              </li>
            </ul>
          </div>
        </div>
      </Fragment>
    )}
  </>;
}

export default PageSelector;