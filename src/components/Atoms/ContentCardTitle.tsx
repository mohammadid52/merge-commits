import React from 'react';
import { Widget } from '../../interfaces/ClassroomComponentsInterfaces';

function ContentCardTitle(props: { title: string, theme: any, widgetObj: Widget }) {
  return <div className={`p-2`}>
    <h2 className={`w-full flex text-xl border-b border-dark-gray pb-1 ${props.theme.dashboard.sectionTitle}`}>
      {props.title}
    </h2>
  </div>;
}

export default ContentCardTitle;