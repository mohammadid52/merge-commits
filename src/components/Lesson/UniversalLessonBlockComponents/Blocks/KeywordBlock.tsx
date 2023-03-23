import {useEffect, useState} from 'react';

import {useGlobalContext} from 'contexts/GlobalContext';

import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';

interface KeywordBlockProps extends RowWrapperProps {
  id?: string;
  value?: string;
  type?: string;
}

const KeywordBlock = (props: KeywordBlockProps) => {
  const {
    state: {lessonPage: {themeTextColor = ''} = {}}
  } = useGlobalContext();
  const {id, value} = props;

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
      <div className={`flex flex-row gap-4 pt-4`}>
        {mappedKeywords.length > 0 &&
          mappedKeywords.map((row: any[], i0: number) => (
            <div key={`cardKWP_${i0}`} className={`flex flex-col`}>
              {row.length > 0 &&
                row.map(
                  (
                    word: {
                      id: string;
                      type: string;
                      label: string;
                      value: string;
                    },
                    idx: number
                  ) => (
                    <div
                      key={`cardKW_${idx}`}
                      className={`pb-4 pt-4 px-4 mb-4 h-32 hover:h-64 hover:min-h-32 transition-height duration-500 ease-in-out overflow-ellipsis overflow-hidden rounded-lg bg-darker-blue`}>
                      <div className={`h-full overflow-ellipsis overflow-hidden ...`}>
                        <h5
                          dangerouslySetInnerHTML={{__html: word.label}}
                          className={`text-lg font-medium ${themeTextColor}`}></h5>
                        <p
                          dangerouslySetInnerHTML={{__html: word.value}}
                          className={`text-sm leading-5 text-gray-100`}></p>
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
