import React, {useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import QuoteBlock from './JumbotronBlock/QuoteBlock';
import {PartContentSub} from '../../../../interfaces/UniversalLessonInterfaces';

interface JumbotronBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
}

interface JumbotronInterface {
  src?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export const JumbotronBlock = (props: JumbotronBlockProps) => {
  const {id, value} = props;
  const [jumbotronInfo, setJumbotronInfo] = useState<JumbotronInterface>({
    src: '',
    title: '',
    subtitle: '',
    description: '',
  });

  useEffect(() => {
    if (value.length > 0) {
      try {
        const newJumbotronInfo = value.reduce(
          (acc: JumbotronInterface, val: PartContentSub) => {
            if (val.type === 'background') {
              return {...acc, src: val.value};
            } else if (val.type === 'title') {
              return {...acc, title: val.value};
            } else if (val.type === 'subtitle') {
              return {...acc, subtitle: val.value};
            } else if (val.type === 'description') {
              return {...acc, description: val.value};
            } else {
              return acc;
            }
          },
          {}
        );
        setJumbotronInfo(newJumbotronInfo);
      } catch (e) {
        console.error('error setting up jumbotron - ', e);
      }
    }
  }, [value]);

  return (
    <div
      className="h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-lg z-10"
      style={{backgroundImage: `url(${jumbotronInfo.src})`}}>
      <QuoteBlock
        title={jumbotronInfo.title}
        subtitle={jumbotronInfo.subtitle}
        description={jumbotronInfo.description}
      />
    </div>
  );
};
