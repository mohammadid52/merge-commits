import React, { useContext } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import Banner from '../LessonComponents/Banner';

const SurveyOutro = (props: any) => {
  const { state } = useContext(LessonContext);

  const quickRepair = (str: string) => {
    if(str){
      return str.replace('color: black', 'color: white');
    } else return '';
  }

  return (
    <>
      <Banner subtitle={state.data.lesson?.summaryTitle } />
      <p dangerouslySetInnerHTML={{ __html: quickRepair(state.data.lesson?.summary )}} />
    </>
  );
};

export default SurveyOutro;