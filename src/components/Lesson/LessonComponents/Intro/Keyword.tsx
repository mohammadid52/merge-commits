import React, { useContext, useState, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import useDictionary from '../../../../customHooks/dictionary';
import { LessonComponentsInterface } from '../../../../interfaces/LessonComponentsInterfaces';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

const Keyword = (props: LessonComponentsInterface) => {
  const {isTeacher} = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext)
  const {state, theme, userLanguage, clientKey } = switchContext;
  const { lessonDict } = useDictionary(clientKey);

  const keywords = state.data.lesson?.keywords?.items;
  const [mappedKeywords, setMappedKeywords] = useState<any[]>([]);

  useEffect(() => {
    const abc = (inarr: any, inc: number, out: [any[],any[],any[]]):any => {
      const [head, ...tail] = inarr;
      if (typeof head === 'undefined') {
            return out;
          }
      switch(inc){
        case 0:
          return abc(tail, inc + 1, [
            [...out[0], head],
            out[1],
            out[2]])
        case 1:
          return abc(tail, inc + 1, [
            out[0],
            [...out[1],head],
            out[2]])
        case 2:
          return abc(tail, 0, [
            out[0],
            out[1],
            [...out[2],head]
          ])
      }
    }

    if (keywords && keywords.length > 0) {
      setMappedKeywords(abc(keywords, 0, [[],[],[]]));
    }
  }, []);

  return (
    <div className={`flex flex-col md:w-full ${theme.block.text} rounded-r-lg`}>
      <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
        <h3>{lessonDict[userLanguage].KEYWORDS}:</h3> {/*  e.g. 'Keywords' we will cover this lesson */}
      </div>

      <div className={`flex flex-row`}>
        {
          mappedKeywords.length > 0 &&
          mappedKeywords.map((row: any[], i0:number) => (
            <div key={`cardKWP_${i0}`} className={`flex flex-col px-2`}>
              {
                row.length > 0 && (
                  row.map((item: { word: { word: string; definition: string }; wordID: number }, i1: number) => (
                    <div key={`cardKW_${i1}`}
                         className={`pb-4 pt-4 px-4 mb-4 h-32 hover:h-64 hover:min-h-32 transition-height duration-500 ease-in-out overflow-ellipsis overflow-hidden ... rounded-lg bg-light-gray border-light-gray`}>
                      <div className={`h-full overflow-ellipsis overflow-hidden ...`}>
                        <p className={`${theme.elem.title}`}>{item.word.word}:</p>
                        <p className={`${theme.elem.text}`}>{item.word.definition}</p>
                      </div>
                    </div>
                  ))
                )
              }
            </div>
          ))
        }
      </div>

    </div>
  );
};

export default Keyword;
