import React from 'react';
import {DIVIDER, FORM_TYPES, TABLE} from '../UniversalLessonBuilder/UI/common/constants';
import CustomVideoBlock from './Blocks/CustomVideoBlock';
import DividerBlock from './Blocks/DividerBlock';
import DownloadBlock from './Blocks/DownloadBlock';
import {FormBlock} from './Blocks/FormBlock';
import {HeaderBlock} from './Blocks/HeaderBlock';
import HighlighterBlock from './Blocks/HighlighterBlock';
import {ImageBlock} from './Blocks/ImageBlock';
import {JumbotronBlock} from './Blocks/JumbotronBlock';
import KeywordBlock from './Blocks/KeywordBlock';
import LinksBlock from './Blocks/LinksBlock';
import {ParagraphBlock} from './Blocks/ParagraphBlock';
import {StringifyBlock} from './Blocks/StringifyBlock';
import TableBlock from './Blocks/TableBlock';
import {VideoBlock} from './Blocks/VideoBlock';

const composePartContent = (
  id: string,
  type: string,
  value: any,
  inputKey: string,
  classString: string = '',
  pagePartId: string,
  mode?: 'building' | 'viewing' | 'lesson',
  updateBlockContentULBHandler?: any,
  position?: number
): JSX.Element => {
  const commonBlockProps = {
    classString,
    id,
    type,
    value,
    mode,
  };

  if (type.includes('jumbotron')) {
    return <JumbotronBlock {...commonBlockProps} />;
  } else if (type.includes('keyword')) {
    return <KeywordBlock id={id} type={type} value={value} mode={mode} />;
  } else if (type.includes('highlighter')) {
    return (
      <HighlighterBlock
        updateBlockContentULBHandler={updateBlockContentULBHandler}
        position={position}
        pagePartId={pagePartId}
        {...commonBlockProps}
      />
    );
  } else if (type.includes('links')) {
    return <LinksBlock {...commonBlockProps} />;
  } else if (type.includes('header')) {
    return <HeaderBlock {...commonBlockProps} />;
  } else if (type.includes('paragraph')) {
    return <ParagraphBlock pagePartId={pagePartId} {...commonBlockProps} />;
  } else if (type.includes('form')) {
    return (
      <FormBlock
        pagePartId={pagePartId}
        numbered={type === 'form-numbered'}
        {...commonBlockProps}
      />
    );
  } else if (type.includes('image')) {
    return <ImageBlock key={inputKey} dataIdAttribute={inputKey} {...commonBlockProps} />;
  } else if (type.includes('custom_video')) {
    return (
      <CustomVideoBlock key={inputKey} dataIdAttribute={inputKey} {...commonBlockProps} />
    );
  } else if (type.includes('video')) {
    return <VideoBlock key={inputKey} dataIdAttribute={inputKey} {...commonBlockProps} />;
  } else if (type === DIVIDER) {
    return <DividerBlock value={value[0]?.value} />;
  } else if (type === TABLE) {
    return <TableBlock classString={classString} value={value} />;
  } else if (type === FORM_TYPES.DOWNLOAD) {
    return <DownloadBlock value={value} />;
  } else {
    return <StringifyBlock key={inputKey} id={id} anyObj={value} mode={mode} />;
  }
};

export default composePartContent;
