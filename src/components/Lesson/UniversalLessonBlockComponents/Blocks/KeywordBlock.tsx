import React, {useState, useEffect} from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface KeywordBlockProps extends RowWrapperProps {
  id?: string;
  value?: string;
  type?: string;
}

const KeywordBlock = (props: KeywordBlockProps) => {
  const {
    state: {lessonPage: {theme: lessonPageTheme = '', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const {id, value} = props;
  const keywords: any = [];
  const [mappedKeywords, setMappedKeywords] = useState<any[]>([]);

  useEffect(() => {
    const abc = (inarr: any, inc: number, out: [any[], any[], any[]]): any => {
      const [head, ...tail] = inarr;
      if (typeof head === 'undefined') {
        return out;
      }
      switch (inc) {
        case 0:
          return abc(tail, inc + 1, [[...out[0], head], out[1], out[2]]);
        case 1:
          return abc(tail, inc + 1, [out[0], [...out[1], head], out[2]]);
        case 2:
          return abc(tail, 0, [out[0], out[1], [...out[2], head]]);
      }
    };

    if (value && value.length > 0) {
      setMappedKeywords(abc(value, 0, [[], [], []]));
    }
  }, [value]);

  return (
    <div id={id} className={`flex flex-col md:w-full ${themeTextColor} rounded-r-lg`}>
      <div
        className={`relative flex flex-row items-center w-full pb-2 px-4 mb-2 mt-4 font-medium text-left text-xl border-b border-white border-opacity-10`}>
        <h3>Keywords:</h3>
      </div>

      <div className={`flex flex-row px-2`}>
        {mappedKeywords.length > 0 &&
          mappedKeywords.map((row: any[], i0: number) => (
            <div key={`cardKWP_${i0}`} className={`flex flex-col mx-2`}>
              {row.length > 0 &&
                row.map(
                  (
                    word: {id: string; type: string; label: string; value: string},
                    idx: number
                  ) => (
                    <div
                      key={`cardKW_${idx}`}
                      className={`pb-4 pt-4 px-4 mb-4 h-32 hover:h-64 hover:min-h-32 transition-height duration-500 ease-in-out overflow-ellipsis overflow-hidden ... rounded-lg ${
                        lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-light-gray'
                      } border-light-gray`}>
                      <div className={`h-full overflow-ellipsis overflow-hidden ...`}>
                        <p className={`text-lg font-semibold ${themeTextColor}`}>
                          {word.label}:
                        </p>
                        <p className={`text-sm ${themeTextColor}`}>{word.value}</p>
                      </div>
                    </div>
                  )
                )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default KeywordBlock;
