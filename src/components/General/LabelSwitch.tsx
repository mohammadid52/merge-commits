import React, { useContext } from 'react';
import useDictionary from '../../customHooks/dictionary';
import { GlobalContext } from '../../contexts/GlobalContext';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
  label: string;
  counter?: number;
};

const FooterLabels = (props: LabelProps) => {
  const { label, counter } = props;

  const { clientKey, userLanguage } = useContext(GlobalContext);
  const { lessonPlannerDict } = useDictionary(clientKey);

  const labelSwitch = (input: string) => {
    if (RegExp('Breakdown', 'i').test(input)) {
      return lessonPlannerDict[userLanguage]['BREAKDOWN'];
    } else {
      if (RegExp('intro', 'i').test(input)) return lessonPlannerDict[userLanguage]['INTRO'];
      if (RegExp('Warmup', 'i').test(input)) return lessonPlannerDict[userLanguage]['WARM_UP'];
      if (RegExp('Corelesson', 'i').test(input)) return lessonPlannerDict[userLanguage]['CORE_LESSON'];
      if (RegExp('Activity', 'i').test(input)) return lessonPlannerDict[userLanguage]['ACTIVITY'];
      if (RegExp('Checkpoint', 'i').test(input)) return lessonPlannerDict[userLanguage]['CHECKPOINT'];
      if (RegExp('Outro', 'i').test(input)) return lessonPlannerDict[userLanguage]['OUTRO'];
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
