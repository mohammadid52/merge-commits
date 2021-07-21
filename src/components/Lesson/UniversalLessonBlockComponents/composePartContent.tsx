import {JumbotronBlock} from './Blocks/JumbotronBlock';
import KeywordBlock from './Blocks/KeywordBlock';
import HighlighterBlock from './Blocks/HighlighterBlock';
import PoemBlock from './Blocks/PoemBlock';
import LinksBlock from './Blocks/LinksBlock';
import {HeaderBlock} from './Blocks/HeaderBlock';
import {ParagraphBlock} from './Blocks/ParagraphBlock';
import {FormBlock} from './Blocks/FormBlock';
import {ImageBlock} from './Blocks/ImageBlock';
import {VideoBlock} from './Blocks/VideoBlock';
import {StringifyBlock} from './Blocks/StringifyBlock';
import React from 'react';
import CustomVideoBlock from './Blocks/CustomVideoBlock';

const composePartContent = (
  id: string,
  type: string,
  value: any,
  inputKey: string,
  classString: string = '',
  pagePartId: string,
  mode?: 'building' | 'viewing' | 'lesson',
  updateOnSave?: (inputID: string, updatedText: string, pagePartId: string) => void
): JSX.Element => {
  if (type.includes('jumbotron')) {
    return <JumbotronBlock id={id} type={type} value={value} mode={mode} />;
  } else if (type.includes('keyword')) {
    return <KeywordBlock id={id} type={type} value={value} mode={mode} />;
  } else if (type.includes('highlighter')) {
    return <HighlighterBlock id={id} type={type} value={value} mode={mode} />;
  } else if (type.includes('poem')) {
    return <PoemBlock id={id} type={type} value={value} mode={mode} />;
  } else if (type.includes('links')) {
    return <LinksBlock id={id} type={type} value={value} mode={mode} />;
  } else if (type.includes('header')) {
    return (
      <HeaderBlock
        id={id}
        type={type}
        classString={classString}
        value={value}
        mode={mode}
        updateOnSave={updateOnSave}
        pagePartId={pagePartId}
      />
    );
  } else if (type.includes('paragraph')) {
    return (
      <ParagraphBlock
        updateOnSave={updateOnSave}
        id={id}
        pagePartId={pagePartId}
        type={type}
        value={value || []}
        mode={mode}
      />
    );
  } else if (type.includes('form')) {
    return (
      <FormBlock numbered={type === 'form-numbered'} id={id} value={value} mode={mode} />
    );
  } else if (type.includes('image')) {
    return (
      <ImageBlock
        key={inputKey}
        id={id}
        dataIdAttribute={inputKey}
        value={value[0]}
        mode={mode}
      />
    );
  } else if (type.includes('custom_video')) {
    return (
      <CustomVideoBlock
        key={inputKey}
        id={id}
        dataIdAttribute={inputKey}
        value={value[0]}
        mode={mode}
      />
    );
  } else if (type.includes('video')) {
    return (
      <VideoBlock
        key={inputKey}
        id={id}
        dataIdAttribute={inputKey}
        value={value[0]}
        mode={mode}
      />
    );
  } else {
    return <StringifyBlock key={inputKey} id={id} anyObj={value} mode={mode} />;
  }
};

export default composePartContent;
