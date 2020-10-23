import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
    label: any
}

const FooterLabels = ({label}: LabelProps) => {
    switch (label) {
        case 'Intro':
            return <div>Intro</div>;
        case 'Story':
            return <div>Warm Up</div>;
        case 'List':
            return <div>Warm Up</div>;
        case 'Lyrics':
            return <div>Core Lesson</div>;
        case 'Poem':
            return <div>Activity</div>;
        case 'Survey':
            return <div>Checkpoint</div>;
        case 'Breakdown':
            return <div>Breakdown</div>;
        case 'Outro':
            return <div>Outro</div>;
        default: 
        return null;  
    }

}

export default FooterLabels;