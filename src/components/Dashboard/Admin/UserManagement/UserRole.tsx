import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type RoleProps = {
    role: any
}

const UserRole = ({role}: RoleProps) => {
    switch (role) {
        case 'ADM':
            return <div>Admin</div>;
        case 'BLD':
            return <div>Builder</div>;
        case 'FLW':
            return <div>Fellow</div>;
        case 'CRD':
            return <div>Coordinator</div>;
        case 'TR':
            return <div>Teacher</div>;
        case 'ST':
            return <div>Student</div>;
        default: 
        return null;  
    }

}

export default UserRole;