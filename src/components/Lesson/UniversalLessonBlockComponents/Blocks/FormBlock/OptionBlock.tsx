import Label from '@components/Atoms/Form/Label';
import {Checkbox, Radio, Space} from 'antd';
import {FORM_TYPES} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import useInLessonCheck from 'customHooks/checkIfInLesson';
import useStudentDataValue from 'customHooks/studentDataValue';
import {IFormBlockProps} from 'interfaces/UniversalLessonInterfaces';

const SelectMany = ({
  onChange,
  shouldBeVertical,
  value
}: {
  onChange: (e: any) => void;

  getCheckValue: (id: string) => boolean;
  shouldBeVertical: boolean;
  value: any;
}) => {
  // map id into value and text as label and return new array
  const mappedOptions = value.map((item: {text: any; id: any}) => {
    const {text, id} = item;
    return {
      label: text,
      value: id,
      id: id
    };
  });

  return (
    <Checkbox.Group options={mappedOptions} defaultValue={['']} onChange={onChange} />
  );
};

const SelectOne = ({
  onChange,
  getCheckValue,
  shouldBeVertical,
  value
}: {
  onChange: (e: any) => void;
  getCheckValue: (id: string) => boolean;
  shouldBeVertical: boolean;
  value: any;
}) => {
  return (
    <Radio.Group className="">
      <Space direction={shouldBeVertical ? 'vertical' : 'horizontal'} className="w-full">
        {value.map((item: {text: any; id: any}) => {
          const {text, id} = item;
          return (
            <Radio
              className="text-lg"
              key={id}
              id={id}
              onChange={onChange}
              checked={getCheckValue(id)}
              value={id}>
              {text}
            </Radio>
          );
        })}
      </Space>
    </Radio.Group>
  );
};

interface IOptionProps extends IFormBlockProps {
  options: any;
}

const OptionBlock = (props: IOptionProps) => {
  const {
    id = '',
    required = false,

    label,
    classString,

    type,
    options,
    inputID = '',
    isStudent
  } = props;

  const isInLesson = isStudent ? useInLessonCheck() : false;

  const {getDataValue, setDataValue} = useStudentDataValue();

  // ~~~~~~~~ SELECTMANY CHECKBOXES ~~~~~~~~ //
  const generateCheckbox = (
    values: {label: string; text: string; id: string}[],
    selectMany: boolean,
    inputID: string
  ) => {
    if (values && Array.isArray(values)) {
      const studentDataValue = getDataValue(inputID) || [];

      let selectedOptionList: string[] = [...studentDataValue].filter((d) => d !== '');

      const getCheckValue = (id: string): boolean => studentDataValue.includes(id);
      const onChange = (e: any) => {
        const {id} = e.target;
        if (isInLesson) {
          if (selectMany) {
            selectedOptionList = [...e];
          } else {
            selectedOptionList[0] = id;
          }

          setDataValue(inputID, [...selectedOptionList]);
        }
      };
      const shouldBeVertical = Boolean(classString?.includes('flex-row'));
      return (
        <div className="mt-2">
          {selectMany ? (
            <SelectMany
              onChange={isStudent && isInLesson ? onChange : () => {}}
              key={`question_${id}`}
              getCheckValue={getCheckValue}
              value={values}
              shouldBeVertical={shouldBeVertical}
            />
          ) : (
            <SelectOne
              onChange={isStudent && isInLesson ? onChange : () => {}}
              key={`question_${id}`}
              getCheckValue={getCheckValue}
              shouldBeVertical={shouldBeVertical}
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

      {generateCheckbox(options, type === FORM_TYPES.MULTIPLE ? true : false, inputID)}
    </div>
  );
};

export default OptionBlock;
