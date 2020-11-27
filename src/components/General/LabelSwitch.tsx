import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
  label: any;
};

const FooterLabels = ({ label }: LabelProps) => {
  switch (label) {
    case 'Intro':
      return <div>Intro</div>;
    case 'Warmup':
      return <div>Warm Up</div>;
    case 'Corelesson':
      return <div>Core Lesson</div>;
    case 'Activity':
      return <div>Activity</div>;
    case label.includes('checkpoint?'):
      return <div>Checkpoint</div>;
    case 'Checkpoint?id=1':
      return <div>Checkpoint</div>;
    case 'Checkpoint?id=8':
      return <div>Checkpoint</div>;
    case 'Checkpoint?id=9':
      return <div>Checkpoint</div>;
    case 'Checkpoint?id=10':
      return <div>Checkpoint</div>;
    case 'Checkpoint?id=11':
      return <div>Checkpoint</div>;
    case 'Checkpoint?id=12':
      return <div>Checkpoint</div>;
    case 'Warmup/breakdown':
      return <div>Breakdown</div>;
    case 'Corelesson/breakdown':
      return <div>Breakdown</div>;
    case 'Activity/breakdown':
      return <div>Breakdown</div>;
    case 'Outro':
      return <div>Outro</div>;
    default:
      return label;
  }
};

export default FooterLabels;
