import React from 'react';

interface WritingAlertProps {
    handleCancel: () => void,
    handleEdit: () => void
}

const PosAlert = (props: WritingAlertProps) => {
    const {handleCancel, handleEdit} = props

    return (
        ///change the POSITION if needed
        <div className="z-50 w-full flex justify-center items-center">
            <div className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                <div>
                <div className="mx-auto flex items-center justify-center h-14 w-20 rounded-full">
                    {/* <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg> */}
                    <svg className="h-14 w-14 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#629cf3">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Are you ready to edit your poem?
                    </h3>
                    <div className="mt-2">
                    <p className="text-sm leading-5 text-gray-500">
                        Once you go to 'Final Edits' you will not be able to come back to these line prompts, but you will be able to see the line prompts on the side of the page
                    </p>
                    </div>
                </div>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-between">
                <span className="flex w-4/10 rounded-md shadow-sm">
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5" onClick={handleEdit}>
                    Go to Final Edits
                    </button>
                </span>
                <span className="flex w-4/10 rounded-md shadow-sm">
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5" onClick={handleCancel}>
                    Go back to Line Prompts
                    </button>
                </span>
                </div>
            </div>
        </div>


    );

}

export default PosAlert;