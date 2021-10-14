import NotesBlock from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import NotesContainer from '@components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesFab';
import map from 'lodash/map';
import React from 'react';
import {
  DIVIDER,
  FORM_TYPES,
  SPACER,
  TABLE,
} from '../UniversalLessonBuilder/UI/common/constants';
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

const Spacer = (props: any) => {
  return <div style={{margin: `${props.value[0].value || 32}px 0px`}} />;
};

const composePartContent = (
  id: string,
  type: string,
  value: any,
  inputKey: string,
  classString: string = '',
  pagePartId: string,
  mode?: 'building' | 'viewing' | 'lesson',
  updateBlockContentULBHandler?: any,
  position?: number,
  notesData?: any,
  isStudent: boolean = true
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
  } else if (type.includes(SPACER)) {
    return <Spacer id={id} type={type} value={value} mode={mode} />;
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
  } else if (type.includes('form') && type !== 'notes-form') {
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
  } else if (type === 'notes-form' && isStudent) {
    return (
      notesData &&
      notesData.length > 0 && (
        <div id="fab-download">
          <NotesContainer notes={notesData} />
        </div>
      )
    );
  } else if (type === 'notes-form' && !isStudent) {
    const modifiyValues = map(value, (v: any, idx: number) => ({
      class: v.class,
      pagePartId: pagePartId,
      partContentId: id,
      id: v.id,
      value: v.value,
    }));

    return <NotesBlock preview grid={{cols: 4, rows: 3}} value={modifiyValues} />;
  } else {
    return <StringifyBlock key={inputKey} id={id} anyObj={value} mode={mode} />;
  }
};

export default composePartContent;
