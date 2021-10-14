import React from 'react';

// type Role = 'ADM' | 'BLD' | 'FLW' | 'CRD' | 'TR' | 'ST';

type LabelProps = {
  label: string;
};

const FooterLabels = (props: LabelProps) => {
  const {label} = props;

  return <div className="whitespace-pre">{label}</div>;
};

export default FooterLabels;
