import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaClock, FaUserAlt } from 'react-icons/fa';
import ProgressRing from './ProgressRing';
import Class from './Class';
import Upcoming from './Upcoming';
import Completed from './Completed';

const Classroom: React.FC = () => {
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const handleLink = () => {
        history.push('/lesson');
    }

    return (
        <div className={`w-full h-9.28/10 md:h-full flex flex-col p-4 md:p-8`}>
            <Class />
            <Upcoming />
            <Completed />
        </div>
    )
}

export default Classroom;