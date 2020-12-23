import React, {useState} from 'react';

const Success = () => {

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open)
    }
    
    return (
        ///change INFO, MARGIN and WIDTH if needed
        <div className={`${open ? 'hidden' : 'display'} rounded-md bg-green-100 p-2`}>
            <div className="flex">
                <div className="flex-shrink-0 w-8">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <div className="ml-3">
                <p className="text-sm leading-5 font-medium text-green-800">
                    Successfully uploaded
                </p>
                </div>
                <div className="ml-auto pl-3 w-8" onClick={handleClick}>
                <div className="-mx-1.5 -my-1.5">
                    <button className="flex justify-end rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:bg-green-100 transition ease-in-out duration-150" aria-label="Dismiss">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </button>
                </div>
                </div>
            </div>
        </div>
      
    );

}

export default Success;