import React, {useCallback, useMemo} from 'react';
import {Page, Text, View, Document, PDFViewer, StyleSheet} from '@react-pdf/renderer';
import {PagePart, PartContent} from '@interfaces/UniversalLessonInterfaces';
import {BuilderRowWrapper} from '../../Lesson/UniversalLessonBuilder/views/CoreBuilder/BuilderRowWrapper';
import {
  DIVIDER,
  FORM_TYPES,
} from '../../Lesson/UniversalLessonBuilder/UI/common/constants';
import composePartContent from '../../Lesson/UniversalLessonBlockComponents/composePartContent';
import {filter} from 'lodash';
import ErrorBoundary from '../../Error/ErrorBoundary';
import {LessonPageWrapper} from '../../Lesson/UniversalLessonBlockComponents/LessonPageWrapper';
import LessonRowComposer from '../../Lesson/UniversalLesson/views/CoreUniversalLesson';
import {GlobalContextProvider} from '@contexts/GlobalContext';

const SurveyPDF = ({lessonPDFData}: any) => {
  console.log(
    '🚀 ~ file: SurveyPDF.tsx ~ line 13 ~ SurveyPDF ~ lessonPDFData',
    lessonPDFData
  );
  // this is only for header component

  return (
    <GlobalContextProvider>
      <Document>
        <Page size="A4">
          <View>
            {lessonPDFData.map((page: PagePart, idx: number): any => {
              return page.pageContent.map((pagePart: PagePart, idx1: number): any => {
                return pagePart.partContent.map((content: PartContent, idx2: number) => {
                  return (
                    <Text key={idx2} style={{fontSize: 18, fontWeight: 'bold'}}>
                      {composePartContent(
                        content.id,
                        content.type,
                        content.value,
                        `pp_${idx1}_pc_${idx2}`,
                        content.class,
                        pagePart.id,
                        'lesson',
                        undefined, // function related to builder
                        undefined, // position number related to builder
                        false // isStudent,
                      )}
                    </Text>
                  );
                });
              });
            })}
          </View>
        </Page>
      </Document>
    </GlobalContextProvider>
  );
};

export default React.memo(SurveyPDF);
