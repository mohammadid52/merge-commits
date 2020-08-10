import React, {useContext} from 'react';

const Status: React.FC = () => {

    return (

        <div>
            <span className="w-auto px-2 inline-flex text-xs leading-5 font-semibold uppercase rounded-full bg-green-100 text-green-800">
                ACTIVE
            </span>

            <span className="w-auto px-2 inline-flex text-xs leading-5 font-semibold uppercase rounded-full bg-gray-100 text-gray-500">
                INACTIVE
            </span>

            <span className="w-auto px-2 inline-flex text-xs leading-5 font-semibold uppercase rounded-full bg-teal-100 text-teal-600">
                SUSPENDED
            </span>

            <span className="w-auto px-2 inline-flex text-xs leading-5 font-semibold uppercase rounded-full bg-yellow-100 text-yellow-700">
                HOLD
            </span>

            <span className="w-auto px-2 inline-flex text-xs leading-5 font-semibold uppercase rounded-full bg-red-100 text-red-800">
                EXPIRED
            </span>
        </div>
    )

}

export default Status;