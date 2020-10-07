import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
    label: any
    id: any
}

const ProgressLabels = ({label, id}: LabelProps) => {
    switch (label) {
        case 'intro':
            return <div id={id}>Intro</div>;
        case 'warmup': 
            return <div id={id}>WarmUp</div>;
        case 'warmup/breakdown':
            return <div id={id}>WarmUp/Breakdown</div>;
        case 'corelesson':
            return <div id={id}>CoreLesson</div>;
        case 'corelesson/breakdown':
            return <div id={id}>CoreLesson/Breakdown</div>;
        case 'activity':
            return <div id={id}>Activity</div>;
        case 'activity/breakdown':
            return <div id={id}>Activity/Breakdown</div>;
        case 'checkpoint?id=1':
            return <div id={id}>Checkpoint</div>;
        case 'breakdown':
            return <div id={id}>Breakdown</div>;
        case 'outro':
            return <div id={id}>Outro</div>;
        default: 
        return null;  
    }

}

export default ProgressLabels;