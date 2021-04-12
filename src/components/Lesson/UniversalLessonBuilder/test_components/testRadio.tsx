import React, { Fragment, useContext, useEffect, useState } from 'react';
const TestRadio = () => {
  return (

    <fieldset>
      <legend className='sr-only'>
        Privacy setting
      </legend>
      <div className='bg-white rounded-md -space-y-px'>
        <label className='border-gray-200 rounded-tl-md rounded-tr-md relative border p-4 flex cursor-pointer'>
          <input type='radio' name='privacy_setting' value='Public access'
                 className='h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500'
                 aria-labelledby='privacy-setting-0-label' aria-describedby='privacy-setting-0-description' />
          <div className='ml-3 flex flex-col'>
          <span id='privacy-setting-0-label' className='text-gray-900 block text-sm font-medium'>
          Public access
        </span>
            <span id='privacy-setting-0-description' className='text-gray-500 block text-sm'>
          This project would be available to anyone who has the link
        </span>
          </div>
        </label>

        <label className='border-gray-200 relative border p-4 flex cursor-pointer'>
          <input type='radio' name='privacy_setting' value='Private to Project Members'
                 className='h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500'
                 aria-labelledby='privacy-setting-1-label' aria-describedby='privacy-setting-1-description' />
          <div className='ml-3 flex flex-col'>
          <span id='privacy-setting-1-label' className='text-gray-900 block text-sm font-medium'>
          Private to Project Members
        </span>
            <span id='privacy-setting-1-description' className='text-gray-500 block text-sm'>
          Only members of this project would be able to access
        </span>
          </div>
        </label>

        <label className='border-gray-200 rounded-bl-md rounded-br-md relative border p-4 flex cursor-pointer'>
          <input type='radio' name='privacy_setting' value='Private to you'
                 className='h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500'
                 aria-labelledby='privacy-setting-2-label' aria-describedby='privacy-setting-2-description' />
          <div className='ml-3 flex flex-col'>
          <span id='privacy-setting-2-label' className='text-gray-900 block text-sm font-medium'>
          Private to you
        </span>
            <span id='privacy-setting-2-description' className='text-gray-500 block text-sm'>
          You are the only one able to access this project
        </span>
          </div>
        </label>
      </div>
    </fieldset>

  );
};

export default TestRadio;