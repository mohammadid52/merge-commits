import React from 'react';
import Banner from './Banner';

interface InstructionBlockProps {
  isTeacher?: boolean;
  titleVisible?: boolean;
  instructionsTitle?: string;
  instructions?: string | string[];
}

const InstructionsBlock = (props: InstructionBlockProps) => {
  const { isTeacher, titleVisible, instructionsTitle, instructions } = props;
  // const { state, theme } = useContext(LessonContext);

  // const [videoMode, setVideoMode] = useState(false);
  // const instructionsArr = state.data.lesson.coreLesson.instructions.text;

  // const toggleVideoMode = () => {
  //   setVideoMode(!videoMode);
  // };

  const quickRepair = (str: string) => {
    if(str){
      return str.replace('color: black', 'color: white');
    } else return '';
  }

  return (
    <>
      {/**
       * DISPLAY DEFAULT TITLE...
       */}
   {/* {
      (titleVisible === undefined && !instructionsTitle) ?
        (
          <Banner subtitle={`Instructions`} />
        ) :
        null
    }*/}
    {/**
     * DISPLAY PROPS TITLE...
     */}
    {
      (titleVisible && instructionsTitle) ?
        (
          <Banner subtitle={instructionsTitle} />
        ) :
        null
    }
    {/**
     * ARRAY OF INSTRUCTIONS...
     */}
    {
      Array.isArray(instructions) && instructions.map((inst: any, key: number) => (
        <p key={key} className='mb-1' dangerouslySetInnerHTML={{ __html: quickRepair(inst) }}>
        </p>
      ))
    }
    {/**
     * STRING OF INSTRUCTIONS...
     */}
    {
      typeof instructions === 'string' && (
        <p className='mb-1' dangerouslySetInnerHTML={{ __html: instructions }}>
        </p>
      )
    }
    </>
  );
};

export default InstructionsBlock;
