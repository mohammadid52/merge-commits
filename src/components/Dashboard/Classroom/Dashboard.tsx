import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaClock, FaUserAlt } from 'react-icons/fa';


const Dashboard: React.FC = () => {
    const history = useHistory();
    const { theme } = useContext(GlobalContext);


    return (
            <div className={`relative shadow-container rounded-xl opacity-60 bg-grayscale-light text-grayscale w-full h-auto flex flex-col p-2`}>        
               
                <div className="h-20 w-full flex justify-center items-center">
                    <div className="text-grayscale-lightest text-xl font-bold text-center">
                        Dashboard coming soon...
                    </div>
                </div> 
                  
            </div>
    )
}

export default Dashboard;