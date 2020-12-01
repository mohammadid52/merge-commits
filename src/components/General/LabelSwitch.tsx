import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
  label: any;
};

const FooterLabels = ({ label }: LabelProps) => {
  switch (label) {
    case 'Intro':
      return <div className='whitespace-pre'>Intro</div>;
    case 'Warmup':
      return <div className='whitespace-pre'>Warm Up</div>;
    case 'Corelesson':
      return <div className='whitespace-pre'>Core Lesson</div>;
    case 'Activity':
      return <div className='whitespace-pre'>Activity</div>;
    case label.includes('checkpoint?'):
      return <div className='whitespace-pre'>Checkpoint</div>;
    case 'Checkpoint?id=1':
      return <div className='whitespace-pre'>Checkpoint</div>;
    case 'Checkpoint?id=8':
      return <div className='whitespace-pre'>Checkpoint</div>;
    case 'Checkpoint?id=9':
      return <div className='whitespace-pre'>Checkpoint</div>;
    case 'Checkpoint?id=10':
      return <div className='whitespace-pre'>Checkpoint</div>;
    case 'Checkpoint?id=11':
      return <div className='whitespace-pre'>Checkpoint</div>;
    case 'Checkpoint?id=12':
      return <div className='whitespace-pre'>Checkpoint</div>;
    case 'Warmup/breakdown':
      return <div className='whitespace-pre'>Breakdown</div>;
    case 'Corelesson/breakdown':
      return <div className='whitespace-pre'>Breakdown</div>;
    case 'Activity/breakdown':
      return <div className='whitespace-pre'>Breakdown</div>;
    case 'Outro':
      return <div className='whitespace-pre'>Outro</div>;
    default:
      return label;
  }
};

export default FooterLabels;
