import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
  label: string;
  counter?: number;
};

const FooterLabels = (props: LabelProps) => {
  const { label, counter } = props;

  const labelSwitch = (input: string) => {
    if (RegExp('Breakdown', 'i').test(input)) {
      return 'Breakdown';
    } else {
      if (RegExp('intro', 'i').test(input)) return 'Intro';
      if (RegExp('Warmup', 'i').test(input)) return 'Warm Up';
      if (RegExp('Corelesson', 'i').test(input)) return 'Core Lesson';
      if (RegExp('Activity', 'i').test(input)) return 'Activity';
      if (RegExp('Checkpoint', 'i').test(input)) return 'Checkpoint';
      if (RegExp('Outro', 'i').test(input)) return 'Outro';
    }
  };

  return (
    <div className='whitespace-pre'>
      {labelSwitch(label)}
      {counter}
    </div>
  );
};

export default FooterLabels;
