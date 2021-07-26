import React, {useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import QuoteBlock from './JumbotronBlock/QuoteBlock';
import {PartContentSub} from '../../../../interfaces/UniversalLessonInterfaces';
import {getImageFromS3Static} from '../../../../utilities/services';
import CustomizedQuoteBlock from './JumbotronBlock/CustomizeQuoteBlock';

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
  const {id, value, classString} = props;
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
              // const url = getImageFromS3Static(val.value);
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

  // because we are concatenating all the classes for different elements in one string
  // so we have to split theme to use it at different places
  const bgClass = classString?.split(' || ')[0] || '';
  const textClass = classString?.split(' || ')[1] || '';
  const animationClass =
    classString?.split(' || ').length === 3 ? classString?.split(' || ')[2] : '';

  return (
    <div
      id={id}
      className={`${animationClass} h-96 flex flex-col mb-4 justify-between z-10 items-center bg-cover bg-right-top rounded-lg`}
      style={{
        backgroundImage: ` url(${jumbotronInfo.src})`,
      }}>
      <CustomizedQuoteBlock
        bgClass={bgClass}
        textClass={textClass}
        title={jumbotronInfo.title}
        subtitle={jumbotronInfo.subtitle}
        description={jumbotronInfo.description}
      />
    </div>
  );
};
