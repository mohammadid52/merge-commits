import React, {useContext} from 'react';
import useDictionary from '@customHooks/dictionary';
import {GlobalContext} from '@contexts/GlobalContext';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
  label: any;
  id: any;
};

const ProgressLabels = ({label, id}: LabelProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {lessonPlannerDict} = useDictionary(clientKey);

  if (label === 'n/a') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['NA']}
      </div>
    );
  } else if (label.includes('intro')) {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['INTRO']}
      </div>
    );
  } else if (label === 'warmup') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['WARM_UP']}
      </div>
    );
  } else if (label === 'warmup/breakdown') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['WARMUP_BREAKDOWN']}
      </div>
    );
  } else if (label === 'corelesson') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['CORE_LESSON']}
      </div>
    );
  } else if (label === 'corelesson/breakdown') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['CORELESSON_BREAKDOWN']}
      </div>
    );
  } else if (label === 'activity') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['ACTIVITY']}
      </div>
    );
  } else if (label === 'activity/breakdown') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['ACTIVITY_BREAKDOWN']}
      </div>
    );
  } else if (label.startsWith('checkpoint')) {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['CHECKPOINT']}
      </div>
    );
  } else if (label === 'breakdown') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['BREAKDOWN']}
      </div>
    );
  } else if (label === 'outro') {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['OUTRO']}
      </div>
    );
  } else {
    return (
      <div id={id} draggable={false} className={`pointer-events-none`}>
        {lessonPlannerDict[userLanguage]['NA']}
      </div>
    );
  }
};

export default ProgressLabels;
