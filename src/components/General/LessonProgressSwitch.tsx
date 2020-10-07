import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
    label: any
}

const ProgressLabels = ({label}: LabelProps) => {
    switch (label) {
        case 'intro':
            return <div>Intro</div>;
        case 'warmup':
            return <div>WarmUp</div>;
        case 'warmup/breakdown':
            return <div>WarmUp/Breakdown</div>;
        case 'corelesson':
            return <div>CoreLesson</div>;
        case 'corelesson/breakdown':
            return <div>CoreLesson/Breakdown</div>;
        case 'activity':
            return <div>Activity</div>;
        case 'activity/breakdown':
            return <div>Activity/Breakdown</div>;
        case 'checkpoint?id=1':
            return <div>Checkpoint</div>;
        case 'breakdown':
            return <div>Breakdown</div>;
        case 'outro':
            return <div>Outro</div>;
        default: 
        return null;  
    }

}

export default ProgressLabels;