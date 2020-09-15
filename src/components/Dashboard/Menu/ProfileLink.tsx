import React, { useContext } from 'react';
import { useHistory, NavLink, useRouteMatch } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa';
import { GlobalContext } from '../../../contexts/GlobalContext';

const ProfileLink: React.FC = () => {
    const { state } = useContext(GlobalContext)
    const match = useRouteMatch()
    const history = useHistory()

    const initials = (firstName: string, lastName: string) => {
        let firstInitial = firstName.charAt(0).toUpperCase() 
        let lastInitial = lastName.charAt(0).toUpperCase()
        return firstInitial + lastInitial;
    }

    const stringToHslColor = (str: string) => {
        let hash = 0;
        let i;
        for (i = 0; i < str.length; i ++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        let h = hash % 360;
        return 'hsl('+h+', 70%, 72%)';
    }

    const firstInitialFunc = (str: string) => {
        if (typeof str !== 'string' || str === '') { return 'Profile' }
        let firstInitial = str.charAt(0)
        firstInitial = firstInitial.toUpperCase() + '.';
        return firstInitial;
    }

    return (
        <NavLink to={`${match.url}/profile`}>
            <div className="size h-14 flex justify-center items-center md:border-t md:border-b md:border-gray-200 py-4 md:px-4">
            <div className="h-8 w-8 rounded-full flex justify-center items-center text-sm font-bold text-white font-sans"
                style={{background: `${stringToHslColor(state.user.firstName + ' ' + state.user.lastName)}`, textShadow: '0.1rem 0.1rem 2px #423939b3'}}>
                    {`${initials(state.user.firstName, state.user.lastName)}`}
                </div>
                <div className="flex-grow w-auto h-full flex justify-start pl-4">
                    {`${ state.user.firstName } ${ firstInitialFunc(state.user.lastName) }`}
                </div>
            </div>
        </NavLink>
    )
}

export default ProfileLink;