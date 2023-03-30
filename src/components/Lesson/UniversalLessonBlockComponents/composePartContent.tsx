import {Divider} from 'antd';
import {GameChangerProvider} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import ErrorBoundary from 'components/Error/ErrorBoundary';
import ActivityBlock from 'components/Lesson/UniversalLessonBlockComponents/Blocks/Activities/ActivityBlock';

import NotesBlock from 'components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesBlock';
import NotesContainer from 'components/Lesson/UniversalLessonBlockComponents/Blocks/Notes/NotesFab';
import map from 'lodash/map';
import {
  DIVIDER,
  FORM_TYPES,
  GAME_CHANGERS,
  SPACER
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
import {VideoBlock} from './Blocks/VideoBlock';

const Spacer = (props: any) => {
  return (
    <Divider
      style={{margin: `${props.value[0].value || 32}px 0px`}}
      className="bg-gray-600"
      dashed
    />
  );
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
  const _mode = mode || 'lesson';

  const commonBlockProps = {
    classString,
    id,
    type,
    value,
    mode: _mode
  };

  if (type.includes('jumbotron')) {
    return (
      <ErrorBoundary componentName="ActivityBlock">
        <JumbotronBlock {...commonBlockProps} />
      </ErrorBoundary>
    );
  } else if (type.includes('keyword')) {
    return (
      <ErrorBoundary componentName="KeywordBlock">
        <KeywordBlock id={id} type={type} value={value} mode={_mode} />
      </ErrorBoundary>
    );
  } else if (type.includes(SPACER)) {
    return (
      <ErrorBoundary componentName="Spacer">
        <Spacer id={id} type={type} value={value} mode={mode} />
      </ErrorBoundary>
    );
  } else if (type.includes('highlighter')) {
    return (
      <ErrorBoundary componentName="HighlighterBlock">
        <HighlighterBlock
          updateBlockContentULBHandler={updateBlockContentULBHandler}
          position={position}
          pagePartId={pagePartId}
          {...commonBlockProps}
        />
      </ErrorBoundary>
    );
  } else if (type.includes('links')) {
    return (
      <ErrorBoundary componentName="LinksBlock">
        <LinksBlock {...commonBlockProps} />
      </ErrorBoundary>
    );
  } else if (type.includes('header')) {
    return (
      <ErrorBoundary componentName="HeaderBlock">
        <HeaderBlock pagePartId={pagePartId} {...commonBlockProps} />
      </ErrorBoundary>
    );
  } else if (type.includes('paragraph')) {
    return (
      <ErrorBoundary componentName="HighlighterBlock">
        <ParagraphBlock pagePartId={pagePartId} {...commonBlockProps} />
      </ErrorBoundary>
    );
  } else if (
    (type.includes('form') && type !== 'notes-form') ||
    type.includes(FORM_TYPES.POEM) ||
    type.includes(FORM_TYPES.WRITING_EXERCISE)
  ) {
    return (
      <ErrorBoundary componentName="FormBlock">
        <FormBlock
          pagePartId={pagePartId}
          numbered={type === 'form-numbered'}
          {...commonBlockProps}
        />
      </ErrorBoundary>
    );
  } else if (type.includes('image')) {
    return (
      <ErrorBoundary componentName="ImageBlock">
        <ImageBlock key={inputKey} dataIdAttribute={inputKey} {...commonBlockProps} />
      </ErrorBoundary>
    );
  } else if (type.includes('custom_video')) {
    return (
      <ErrorBoundary componentName="CustomVideoBlock">
        <CustomVideoBlock
          key={inputKey}
          dataIdAttribute={inputKey}
          {...commonBlockProps}
        />
      </ErrorBoundary>
    );
  } else if (type.includes('video')) {
    return (
      <ErrorBoundary componentName="VideoBlock">
        <VideoBlock key={inputKey} dataIdAttribute={inputKey} {...commonBlockProps} />
      </ErrorBoundary>
    );
  } else if (type === DIVIDER) {
    return (
      <ErrorBoundary componentName="DividerBlock">
        <DividerBlock value={value[0]?.value} />
      </ErrorBoundary>
    );
  }
  //  else if (type === TABLE) {
  //   return (
  //     <ErrorBoundary componentName="TableBlock">
  //       <TableBlock classString={classString} value={value} />
  //     </ErrorBoundary>
  //   );
  // }
  else if (type === FORM_TYPES.DOWNLOAD) {
    return (
      <ErrorBoundary componentName="DownloadBlock">
        <DownloadBlock value={value} />
      </ErrorBoundary>
    );
  } else if (type === 'notes-form' && isStudent) {
    return (
      notesData &&
      notesData.length > 0 && (
        <ErrorBoundary componentName="NotesContainer">
          <NotesContainer id={id} notes={notesData} />
        </ErrorBoundary>
      )
    );
  } else if (type === 'notes-form' && !isStudent) {
    const modifiyValues = map(value, (v: any) => ({
      class: v.class,
      pagePartId: pagePartId,
      partContentId: id,
      id: v.id,
      value: v.value
    }));

    return (
      <ErrorBoundary componentName="NotesBlock">
        <NotesBlock preview grid={{cols: 4, rows: 3}} value={modifiyValues} />
      </ErrorBoundary>
    );
  } else if (type.includes(GAME_CHANGERS) || type === 'square') {
    return (
      <GameChangerProvider>
        <ErrorBoundary
          componentName="ActivityBlock"
          fallback={<h1>Something wrong with activity</h1>}>
          <ActivityBlock value={value} />
        </ErrorBoundary>
      </GameChangerProvider>
    );
  } else {
    return <div className="hidden"></div>;
  }
};

export default composePartContent;
