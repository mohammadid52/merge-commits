import React, { useContext, useState } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaVideo } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface InstructionsBlockProps {
    fullscreen: boolean
}

const InstructionsBlock = (props: InstructionsBlockProps) => {
    const { fullscreen } = props
    const { state, theme } = useContext(LessonControlContext);
    const [ videoMode, setVideoMode ] = useState(false);
    const { text, video, link } = state.data.lesson.warmUp.instructions;

    const toggleVideoMode = () => {
        setVideoMode(!videoMode);
    }

    return (
      <>
      <div className={`w-full h-full rounded-xl`}>
        <h3 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>Instructions</h3>

        <div className={theme.elem.text}>
          {text.map((inst: string, key: number) => (
            <p key={key} className='mb-1'>
              {inst}
            </p>
          ))}
        </div>
      </div>
    </>
    )
}

export default InstructionsBlock;