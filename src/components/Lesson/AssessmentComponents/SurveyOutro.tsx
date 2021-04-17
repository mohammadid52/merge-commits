import React, { useContext } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import Banner from '../LessonComponents/Banner';
import { stripStyleFromHTML } from '../../../utilities/strings';

const SurveyOutro = (props: any) => {
  const { state, theme } = useContext(LessonContext);

  return (
    <>
      <Banner titleSection={state.data.lesson?.summaryTitle} />
      <p
        className={`mb-1 text-gray-100 ${theme.elem.text}`}
        dangerouslySetInnerHTML={{
          __html: state.data.lesson?.summary && stripStyleFromHTML(state.data.lesson?.summary),
        }}
      />
    </>
  );
};

export default SurveyOutro;
