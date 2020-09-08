import React, { useContext } from 'react';
import { useHistory, NavLink, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa';
import { GlobalContext } from '../../../contexts/GlobalContext';

const ProfileLink: React.FC = () => {
    const { state } = useContext(GlobalContext)
    const match = useRouteMatch()
    const history = useHistory()

    const firstInitialFunc = (str: string) => {
        if (typeof str !== 'string' || str === '') { return 'Profile' }
        let firstInitial = str.charAt(0)
        firstInitial = firstInitial.toUpperCase() + '.';
        return firstInitial;
    }

    return (
        <NavLink to={`${match.url}/profile`}>
            <div className="size h-14 flex justify-center items-center md:border-t md:border-b md:border-gray-200 py-4 md:px-4">
                <IconContext.Provider value={{ size: '2rem', color: 'white' }}>
                    <FaUserCircle />
                </IconContext.Provider>
                <div className="flex-grow w-auto h-full flex justify-start pl-4">
                    {`${ state.user.firstName } ${ firstInitialFunc(state.user.lastName) }`}
                </div>
            </div>
        </NavLink>
    )
}

export default ProfileLink;