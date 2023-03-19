import Label from '@components/Atoms/Form/Label';
import {Checkbox, Radio} from 'antd';
import {FORM_TYPES} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {useGlobalContext} from 'contexts/GlobalContext';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {IFormBlockProps} from 'interfaces/UniversalLessonInterfaces';

const SelectMany = ({
  onChange,

  value
}: {
  onChange: (e: any) => void;

  getCheckValue: (id: string) => boolean;
  classString: string;
  value: any;
}) => {
  // map id into value and text as label and return new array
  const mappedOptions = value.map((item: {text: any; id: any}) => {
    const {text, id} = item;
    return {
      label: text,
      value: id
    };
  });

  return (
    <Checkbox.Group
      options={mappedOptions}
      defaultValue={['Apple']}
      onChange={onChange}
    />

    // <div className={classString}>
    //   {value.map((item: any) => {
    //     const {label, text, id} = item;

    //     return (
    //       <div className={`flex my-2 w-auto justify-center items-center mr-8 `}>
    //         <input
    //           id={id}
    //           data-key={id}
    //           data-value={label}
    //           type="checkbox"
    //           className={`w-5 h-5 flex-shrink-0 mx-4 transition-all cursor-pointer border-0 ${themePlaceholderColor} ${
    //             getCheckValue(id) ? 'theme-bg border-white' : 'bg-white border-black '
    //           }`}
    //           onChange={onChange}
    //           checked={getCheckValue(id)}
    //         />

    //         <span className={`ml-2 ${theme.elem.text} ${themeTextColor}`}>{text}</span>
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

const SelectOne = ({
  onChange,
  getCheckValue,

  classString,
  value
}: {
  onChange: (e: any) => void;
  getCheckValue: (id: string) => boolean;
  isStudent: boolean;
  isInLesson: boolean;
  classString: string;
  value: any;
}) => {
  return (
    <Radio.Group>
      {value.map((item: {text: any; id: any}) => {
        const {text, id} = item;
        return (
          <Radio
            key={id}
            onChange={(e) => {
              onChange(e);
            }}
            checked={getCheckValue(id)}
            value={id}>
            {text}
          </Radio>
        );
      })}
    </Radio.Group>
    // <div className={classString}>
    //   {value.map((item: any) => {
    //     const {label, text, id} = item;
    //     return (
    //       <div key={id} className={`w-auto flex justify-center items-center mr-8 my-2`}>
    //         <input
    //           id={id}
    //           data-key={id}
    //           data-value={label}
    //           type="radio"
    //           className={`w-5 h-5 flex-shrink-0 mx-4 transition-all rounded-full cursor-pointer border-0 ${themePlaceholderColor} ${
    //             getCheckValue(id) ? 'theme-bg border-white' : 'bg-white border-black '
    //           }`}
    //           onChange={(e) => {
    //             if (e.target.id.includes('other')) {
    //               setOtherOptSel(true);
    //             } else {
    //               setOther('');
    //               setOtherOptSel(false);
    //             }
    //             onChange(e);
    //           }}
    //           checked={getCheckValue(id)}
    //         />

    //         <span className={`w-auto`}>{text}</span>
    //       </div>
    //     );
    //   })}

    //   {otherOptSel && (
    //     <div key={`question_}`} className={`w-auto ml-4  my-4`}>
    //       <input
    //         id={'sdsd'}
    //         className={`${themePlaceholderColor} ${themeTextColor} ${
    //           lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
    //         } w-full rounded-xl`}
    //         type="text"
    //         name={'Other'}
    //         value={other}
    //         onChange={(e) => setOther(e.target.value)}
    //       />
    //     </div>
    //   )}
    // </div>
  );
};

interface IOptionProps extends IFormBlockProps {
  options: any;
}

const OptionBlock = (props: IOptionProps) => {
  const {
    id = '',
    required = false,
    numbered = false,
    label,

    classString = '',
    index = '',

    type,
    options,
    inputID = '',
    isStudent
  } = props;

  const gContext = useGlobalContext();

  const gState = gContext.state;
  const {lessonPage: {theme: lessonPageTheme = 'dark', themeTextColor = ''} = {}} =
    gState;

  const isInLesson = isStudent ? useInLessonCheck() : false;

  const {getDataValue, setDataValue} = useStudentDataValue();

  // ~~~~~~~~ SELECTMANY CHECKBOXES ~~~~~~~~ //
  const generateCheckbox = (
    values: {label: string; text: string; id: string}[],
    selectMany: boolean,
    inputID: string,
    classString: string
  ) => {
    if (values && Array.isArray(values)) {
      const studentDataValue = getDataValue(inputID) || [];

      let selectedOptionList: string[] = [...studentDataValue].filter((d) => d !== '');

      const getCheckValue = (id: string): boolean => studentDataValue.includes(id);
      const onChange = (e: any) => {
        const {id} = e.target;
        if (isInLesson) {
          if (selectMany) {
            if (selectedOptionList.includes(id)) {
              selectedOptionList = selectedOptionList.filter((d) => d !== id);
            } else {
              selectedOptionList.push(id);
            }
          } else {
            selectedOptionList[0] = id;
          }

          setDataValue(inputID, [...selectedOptionList]);
        }
      };
      return (
        <div>
          {selectMany ? (
            <SelectMany
              classString={`mt-2 py-2 flex flex-wrap ${themeTextColor} ${
                lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
              } px-4 rounded-xl ${classString}`}
              onChange={isStudent && isInLesson ? onChange : () => {}}
              key={`question_${id}`}
              getCheckValue={getCheckValue}
              value={values}
            />
          ) : (
            <SelectOne
              classString={`mt-2 py-2 flex flex-wrap ${themeTextColor} ${
                lessonPageTheme === 'light' ? 'bg-gray-200' : 'bg-darker-gray'
              } px-4 rounded-xl ${classString}`}
              onChange={isStudent && isInLesson ? onChange : () => {}}
              key={`question_${id}`}
              isStudent={Boolean(isStudent)}
              getCheckValue={getCheckValue}
              isInLesson={isInLesson}
              value={values}
            />
          )}
        </div>
      );
    }
    return <div className="hidden w-auto" />;
  };

  return (
    <div
      key={inputID}
      id={`${inputID}_for_error`}
      className={`questionItemChild lesson-form-block`}>
      {label && <Label isRequired={required} label={label} />}

      {generateCheckbox(
        options,
        type === FORM_TYPES.MULTIPLE ? true : false,
        inputID,
        classString
      )}
    </div>
  );
};

export default OptionBlock;
