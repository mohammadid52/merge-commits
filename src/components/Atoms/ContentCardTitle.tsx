import React from 'react';
import { Widget } from '../../interfaces/ClassroomComponentsInterfaces';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineFileZip, AiOutlinePhone } from 'react-icons/ai';
import { GrBlockQuote } from 'react-icons/gr';
import { GoTextSize } from 'react-icons/go';

function ContentCardTitle(props: { icon?: boolean; icontype?: string; title: string; theme: any; widgetObj: Widget }) {

  const switchIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <AiOutlinePhone />;
      case 'quote':
        return <GrBlockQuote />;
      case 'default':
        return <GoTextSize />;
      case 'file':
        return <AiOutlineFileZip />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2
        className={`w-full flex text-sm border-b-0 border-dark-gray w-auto text-dark-gray pb-2 font-medium mb-2 text-left`}>
        {props.icon && (
          <span className={`w-auto mr-2`}>
            <IconContext.Provider value={{ size: '1rem', color: 'darkgrey' }}>
              {switchIcon(props.icontype)}
            </IconContext.Provider>
          </span>
        )}
        {props.title}
      </h2>
    </div>
  );
}

export default ContentCardTitle;
