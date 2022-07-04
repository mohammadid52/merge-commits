import React from 'react';
import {Page, Text, View, Document, Image, StyleSheet} from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import {PagePart, PartContent} from '@interfaces/UniversalLessonInterfaces';
import {GlobalContextProvider} from '@contexts/GlobalContext';
import {getAsset} from 'assets';

const SurveyPDF = ({lessonPDFData, clientKey}: any) => {
  const styles = StyleSheet.create({
    body: {
      padding: 24,
    },
    pageView: {},
    pageTitle: {
      fontSize: 20,
      marginTop: 18,
      marginBottom: -4,
      fontWeight: 'bold',
    },
    pageParagraph: {},
    pageRadioInput: {
      marginTop: 10,
      marginBottom: 10,
    },
    logo: {
      width: '100%',
      maxWidth: 140,
      margin: '0 auto',
    },
    optionsWrap: {
      display: 'flex',
      fontSize: 12,
      gap: 50,
      marginTop: 9,
      marginBottom: 28,
      marginLeft: 12,
      justifyContent: 'space-between',
    },
    paginations: {
      marginTop: 14,
      fontSize: 14,
      textAlign: 'right',
    },
  });

  const paragraphStylesheet = {
    div: {
      display: 'block',
      width: '100%',
      marginTop: 2,
      lineHeight: 1.5,
      fontSize: 12,
    },
  };

  const categoryStylesheet = {
    div: {
      width: 'auto',
      borderBottom: '1px solid #000',
      fontWeight: 'bold',
      fontSize: 12,
      marginTop: 18,
      marginBottom: 10,
      paddingBottom: 3,
    },
  };

  const questionStylesheet = {
    div: {
      marginTop: 8,
      fontSize: 16,
    },
  };

  return (
    <GlobalContextProvider>
      <Document>
        <Page size="A4" style={styles.body}>
          <Image style={styles.logo} src={getAsset(clientKey, `pdf_symbol`)} />
          {lessonPDFData.slice(1).map((page: PagePart): any => {
            return page.pageContent.map((pagePart: PagePart): any => {
              return pagePart.partContent.map((content: PartContent) => {
                return (
                  <View key={content.id} style={styles.pageView}>
                    {content.type.includes('header') &&
                      content.value &&
                      content.value.length > 0 &&
                      content.value.map((v: any) => {
                        return (
                          <Text style={styles.pageTitle} key={v.id} id={v.id}>
                            {v.value}
                          </Text>
                        );
                      })}
                    {content.type.includes('paragraph') && (
                      <>
                        {content.value &&
                          content.value.length > 0 &&
                          content.value.map((v: any) => (
                            <Html key={v.value} stylesheet={paragraphStylesheet}>
                              {v.value}
                            </Html>
                          ))}
                      </>
                    )}
                    {content.type.includes('divider') &&
                      content.value &&
                      content.value.length > 0 &&
                      content.value.map((v: any) => {
                        const html = `
                        <div>Category | ${v.value}</div>
                        `;
                        return (
                          <Html stylesheet={categoryStylesheet} key={v.value}>
                            {html}
                          </Html>
                        );
                      })}
                    {content.type.includes('form') &&
                      content.type !== 'notes-form' &&
                      content.value &&
                      content.value.length > 0 &&
                      content.value.map((v: any, i: number) => {
                        const questionHtml = `
                          <div>${content.type === 'form-numbered' && i + 1}. ${
                          v.label
                        }</div>
                        `;
                        return (
                          v.type.includes('radio-input') && (
                            <React.Fragment key={v.id}>
                              <Html stylesheet={questionStylesheet}>{questionHtml}</Html>
                              <Text style={styles.optionsWrap}>
                                {v.options.map((option: any) => {
                                  const optionHtml = `
                                  <html>
                                  <body>
                                  <style>
                                    .option-wrap{
                                        display: inline-flex;
                                        fontSize: 10px;
                                        gap: 50px;
                                    }
                                  </style>
                                    <div className='option-wrap'>
                                      <span>${option.text} | </span>
                                    </div>
                                    </body>
                                  </html>
                                  `;
                                  return <Html key={option.id}>{optionHtml}</Html>;
                                })}
                              </Text>
                            </React.Fragment>
                          )
                        );
                      })}
                  </View>
                );
              });
            });
          })}
          <Text
            style={styles.paginations}
            render={({pageNumber, totalPages}) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      </Document>
    </GlobalContextProvider>
  );
};

export default React.memo(SurveyPDF);
