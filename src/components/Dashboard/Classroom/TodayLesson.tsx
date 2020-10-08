import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaClock, FaUserAlt } from 'react-icons/fa';
import ProgressRing from './ProgressRing';
import { CurriculumInfo } from './Classroom';
import ToolTip from '../../General/ToolTip/ToolTip';

interface ClassProps {
        link: string,
        display?: boolean,
        curriculum: CurriculumInfo
    }


const Today: React.FC<ClassProps> = (props: ClassProps) => {
    const { link, curriculum, display } = props
    const [ accessible, setAccessible ] = useState<boolean>(true);
    const history = useHistory();
    const { theme } = useContext(GlobalContext);


    const handleLink = () => {
        // come back to this later
        if ( accessible ) { history.push(link); }
    }

    useEffect(() => {
        if ( display ) {
            setAccessible(false)
        }

        if ( !display ) {
            setAccessible(true)
        }

    }, [props])

    return (
            <div className={`relative bg-white rounded-xl shadow-container ${theme.elem.text}  w-64rem h-auto flex mb-8`}>
                
                <div className={`w-2.5/10 bg-dark rounded-tl-xl rounded-bl-xl`}>
                    <div className="h-6/10 flex justify-center items-center">
                        <img className=" w-32 rounded-full " src={`${curriculum && curriculum.artist.images ? curriculum.artist.images : null}`} alt={`${curriculum && curriculum.artist.name ? curriculum.artist.name : ''}`} />
                    </div>
                    <div className="h-1/10 pl-6">
                        <div className="tracking-widest border-b text-gray-300 border-ketchup">
                            FEATURED ARTIST
                        </div>
                    </div>
                    <div className="h-3/10 flex flex-row-reverse">
                        <h2 className={`first w-6/10 text-2xl font-open leading-8 font-medium tracking-widest mb-4 text-gray-200`}>
                            <p>{ curriculum && curriculum.artist.name ? curriculum.artist.name : null }</p>
                        </h2>
                    </div>
                </div>
                <div className="w-7.5/10 flex flex-col ">
                    <div className="h-8.7/10 p-4 flex flex-col justify-center items-center">
                        <h1 className={`text-2xl text-black font-open text-left`}>
                            { curriculum && curriculum.title ? curriculum.title : null }
                        </h1>
                        <p className="text-md text-left">
                            { curriculum && curriculum.summary ? curriculum.summary : null }
                        </p>
                        {/* <div className="flex w-3/10">
                            <span className="mt-4 inline-flex rounded-full shadow-md">
                                <button type="submit" onClick={handleLink} className={`${ accessible ? 'bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white' : 'bg-gray-500 text-gray-700 cursor-default' }
                                tracking-wider 
                                inline-flex justify-center py-2 px-2 border border-transparent leading-5 font-medium rounded-full focus:outline-none transition duration-150 ease-in-out`}>
                                    START LESSON
                                </button>
                            </span>
                        </div> */}

                    </div>
                    <div className={`h-2/10 bg-dark flex justify-between rounded-br-xl`}>
                        <div className={`flex justify-center items-center my-2 w-3/10 text-gray-300`} >
                            <div className="w-auto text-gray-300">
                                <IconContext.Provider value={{ size: '1.5rem', style: {width: 'auto'}}}>
                                    <FaClock />
                                </IconContext.Provider>
                            </div>
                            <div className={`w-auto mx-4 text-gray-300`}>
                                45 min.
                            </div>
                        </div>
                        <div className={`flex justify-center items-center my-2 w-3/10`} >
                            <div className="w-auto text-gray-300">
                                <IconContext.Provider value={{ size: '1.5rem', style: {width: 'auto'} }}>
                                    <FaUserAlt />
                                </IconContext.Provider>
                            </div>
                            <div className={`w-auto mx-4 text-gray-200`}>
                                Marlon
                            </div>
                        </div>
                        <div className="flex w-3/10">
                            
                                <button type="submit" onClick={handleLink} className={`${ accessible ? 'bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white' : 'bg-gray-500 text-gray-700 cursor-default' }
                                w-full text-white rounded-br-xl focus:outline-none transition duration-150 ease-in-out`}>
                                    <span className='w-auto h-auto'>START LESSON</span>
                                </button>
                            
                        </div>
                    </div>
                </div>
    </div>
  );
};

export default Today;
