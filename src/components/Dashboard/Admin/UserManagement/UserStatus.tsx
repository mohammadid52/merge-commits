import React from 'react';

type Status = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'HOLD';

type StatusProps = {
    status: any
}

const UserStatus = ({status}: StatusProps) => {
    switch (status) {
        case 'ACTIVE':
            return (
                <span className="w-auto px-2 inline-flex text-sm leading-5 font-semibold uppercase rounded-full bg-green-100 text-green-800">
                ACTIVE
                </span>);
        case 'INACTIVE':
            return (
                <span className="w-auto px-2 inline-flex text-sm leading-5 font-semibold uppercase rounded-full bg-gray-100 text-gray-500">
                    INACTIVE
                </span>);
        case 'SUSPENDED':
            return (
                <span className="w-auto px-2 inline-flex text-sm leading-5 font-semibold uppercase rounded-full bg-red-100 text-red-800">
                    SUSPENDED
                </span>);
        case 'HOLD':
            return (
                <span className="w-auto px-2 inline-flex text-sm leading-5 font-semibold uppercase rounded-full bg-yellow-100 text-yellow-700">
                    ON HOLD
                </span>);
        default: 
        return null;  
    }

}

export default UserStatus;