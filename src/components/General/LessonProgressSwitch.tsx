import React,{ useContext } from 'react';
import useDictionary from '../../customHooks/dictionary';
import { GlobalContext } from '../../contexts/GlobalContext';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
    label: any
    id: any
}

const ProgressLabels = ({label, id}: LabelProps) => {

    const { clientKey, userLanguage } = useContext(GlobalContext);
    const { lessonPlannerDict } = useDictionary(clientKey);

    switch (label) {
        case 'n/a':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['NA']}</div>;
        case 'intro':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['INTRO']}</div>;
        case 'warmup': 
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['WARM_UP']}</div>;
        case 'warmup/breakdown':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['WARMUP_BREAKDOWN']}</div>;
        case 'corelesson':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['CORE_LESSON']}</div>;
        case 'corelesson/breakdown':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['CORELESSON_BREAKDOWN']}</div>;
        case 'activity':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['ACTIVITY']}</div>;
        case 'activity/breakdown':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['ACTIVITY_BREAKDOWN']}</div>;
        case 'checkpoint?id=1':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['CHECKPOINT']}</div>;
        case 'breakdown':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['BREAKDOWN']}</div>;
        case 'outro':
            return <div id={id} draggable={false} className={`pointer-events-none`}>{lessonPlannerDict[userLanguage]['OUTRO']}</div>;
        default: 
        return null;  
    }

}

export default ProgressLabels;