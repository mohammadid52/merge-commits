import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaRegSave, FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';

interface props {
        fullscreen: boolean
    }

const Links = (props: props) => {
    const {  fullscreen } = props;
    // the bottom is from 'LessonHeaderBar.tsx'
    // const { theme, state, dispatch } = useContext(LessonContext);
    // const handleSave = () => {
    //     if ( state.unsavedChanges ) {
    //         if ( !state.firstSave ) {
    //             createClassroomData()
    //         }
    
    //         if ( state.firstSave ) {
    //             updateClassroomData()
    //         }
    //     }
    // }

    return(
        <div className="w-3/10 h-full flex flex-col justify-between items-center rounded-lg text-gray-200">
            
            <div className={`${fullscreen ? 'text-4xl' : 'text-2xl py-2'} h-4.8/10 bg-dark-blue p-4 rounded-lg shadow-2 cursor-pointer flex flex-col justify-center items-center`} 
            // onClick={handleSave}
            >
                <IconContext.Provider value={{ color:  '#EDF2F7' , size: '3rem'}}>
                    <FaRegSave />
                </IconContext.Provider>
                <p className={`${fullscreen ? 'text-lg' : 'text-xs'} text-gray-200 text-center`}>Save your work</p>
            </div>
            <div className={`h-4.8/10 bg-dark-blue p-4 rounded-lg shadow-2 flex flex-col justify-center items-center cursor-pointer`}>
                <NavLink to="/dashboard">
                    <IconContext.Provider value={{ color:  '#EDF2F7', size: '3rem'}}>
                        <FaHome />
                    </IconContext.Provider>
                </NavLink>
                <p className={`${fullscreen ? 'text-lg' : 'text-xs'} text-gray-200 text-center`}>Go back to the dashboard</p>
            </div>

        </div>
    )
}

export default Links;
