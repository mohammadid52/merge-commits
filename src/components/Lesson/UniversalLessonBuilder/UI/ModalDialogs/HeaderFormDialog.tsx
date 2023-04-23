import {EditQuestionModalDict} from '@dictionary/dictionary.iconoclast';

import {HeaderBlock} from '@UlbBlocks/HeaderBlock';
import ColorPicker from '@UlbUI/ColorPicker/ColorPicker';
import DummyContent from '@UlbUI/Preview/DummyContent';
import PreviewLayout from '@UlbUI/Preview/Layout/PreviewLayout';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import RichTextEditor from 'atoms/RichTextEditor';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {IContentTypeComponentProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';

import {Form, Switch, Tabs, TabsProps} from 'antd';
import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

interface IHeaderModalComponentProps extends IContentTypeComponentProps {
  inputObj?: any;
  classString?: string;
  selectedPageID?: string;
  setUnsavedChanges: any;
  askBeforeClose: () => void;
}

interface IInput {
  title: string;
  animated?: boolean;
  instructions?: boolean;
  instructionsText?: string;
  instructionsHtml?: string;
  notes?: boolean;
  notesHtml?: string;
}

const HeaderModalComponent = ({
  closeAction,
  inputObj,
  classString = '',
  setUnsavedChanges,
  askBeforeClose,
  createNewBlockULBHandler,
  updateBlockContentULBHandler
}: IHeaderModalComponentProps) => {
  const {userLanguage} = useGlobalContext();
  const {blockConfig} = useULBContext();

  const [errors, setErrors] = useState({animation: '', title: ''});
  const [selectedValues, setSelectedValues] = useState({
    size: 'medium',
    color: 'No Border'
  });

  // ---------- constants -------------
  const NO_BORDER_SELECTED = selectedValues.color === 'No Border';

  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  const onChange = (e: any) => {
    setUnsavedChanges(true);
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value
    });
  };

  const onAnimationToggle = () => {
    if (!NO_BORDER_SELECTED) {
      setUnsavedChanges(true);

      onToggle('animated');
    } else {
      setErrors({...errors, animation: 'Please select border color first.'});
    }
  };

  const onToggle = (name: string) => {
    setInputFields({
      ...inputFields,
      // @ts-ignore
      [name]: !inputFields[name]
    });
  };

  const [inputFields, setInputFields] = useState<IInput>({
    title: '',
    animated: false,
    instructions: false,
    instructionsText: '',
    instructionsHtml: '<p></p>',
    notes: false,
    notesHtml: '<p></p>'
  });

  useEffect(() => {
    if (inputObj && inputObj.length) {
      setInputFields((prevInputFields: any) => ({
        ...prevInputFields,
        title: inputObj[0].value,
        animated: classString.includes('animated-border-on'),
        instructionsText: inputObj[1]?.value || '',
        instructions: inputObj[1]?.value?.length > 0 || false,
        instructionsHtml: inputObj[1]?.value || '<p></p>',
        notes: inputObj[2]?.value?.length > 0 || false,
        notesHtml: inputObj[2]?.value || '<p></p>'
      }));
      // retrieves the result of matching a string against border color
      const matchBorderColor: any[] | null = classString.match(/border-\w\w+-\d+/);
      setSelectedValues({
        size: convertClassToSizeName(classString),
        color:
          matchBorderColor && matchBorderColor.length
            ? matchBorderColor[0].split('border-')[1]
            : ''
      });
      setIsEditingMode(true);
    }
  }, [inputObj]);

  const convertSizeNameToClass = (sizeName: string) => {
    switch (sizeName) {
      case 'smallest':
        return 'text-base';
      case 'small':
        return 'text-lg';
      case 'medium':
        return 'text-xl';
      case 'large':
        return 'text-2xl';
      case 'largest':
        return 'text-3xl';
      default:
        return 'text-xl';
    }
  };
  const convertClassToSizeName = (classString: string) => {
    let sizeName = 'medium';
    if (classString) {
      if (classString.includes('text-base')) {
        sizeName = 'smallest';
      } else if (classString.includes('text-lg')) {
        sizeName = 'small';
      } else if (classString.includes('text-2xl')) {
        sizeName = 'large';
      } else if (classString.includes('text-3xl')) {
        sizeName = 'largest';
      }
    }
    return sizeName;
  };

  const animationClass = 'animated-border-on fade__animation-short';

  const generateBorderCSS = () =>
    `animated-border animated-border-${selectedValues.color} ${
      inputFields.animated ? animationClass : ''
    } `;

  const addToDB = async (list: any) => {
    closeAction();

    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
  };

  const fontSizeClass: string = convertSizeNameToClass(selectedValues.size);

  const classValue = `${generateBorderCSS()} ${fontSizeClass}`;

  const onHeaderCreate = async () => {
    const isValid = validate();
    if (isValid) {
      const value: string = inputFields.title;

      if (isEditingMode) {
        const updatedList: any = updateBlockContentULBHandler(
          '',
          '',
          'header',
          [
            {id: uuidv4().toString(), value},
            {
              id: uuidv4().toString(),
              value: inputFields.instructionsHtml || ''
            },
            {
              id: uuidv4().toString(),
              value: inputFields.notesHtml || ''
            }
          ],
          blockConfig.position,
          classValue
        );

        await addToDB(updatedList);
      } else {
        const updatedList: any = createNewBlockULBHandler(
          '',
          '',
          'header',

          [
            {id: uuidv4().toString(), value},
            {
              id: uuidv4().toString(),
              value: inputFields.instructionsHtml || ''
            },
            {
              id: uuidv4().toString(),
              value: inputFields.notesHtml || ''
            }
          ],
          blockConfig.position,

          classValue
        );
        await addToDB(updatedList);
      }

      // close modal after saving
      // clear fields
      setInputFields({
        ...inputFields,
        animated: false,
        title: ''
      });
    }
  };

  const fontSizeList = [
    {id: 1, label: 'smallest', value: 'smallest'},
    {id: 2, label: 'small', value: 'small'},
    {id: 3, label: 'medium', value: 'medium'},
    {id: 4, label: 'large', value: 'large'},
    {id: 5, label: 'largest', value: 'largest'}
  ];

  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const handleColorPickerSelect = (pickedColor: string) => {
    setErrors({...errors, animation: ''});
    setSelectedValues({...selectedValues, color: pickedColor});
    setColorPickerActive(false);
  };

  const validate = (): boolean => {
    let isValid = true;

    if (inputFields.title.trim().length <= 0) {
      errors.title = 'Please add title';
      isValid = false;
    } else {
      errors.title = '';
    }

    setErrors({...errors});
    return isValid;
  };

  const onEditorStateChange = (html: string, text: string) => {
    setUnsavedChanges(true);
    setInputFields({
      ...inputFields,
      instructionsText: text,
      instructionsHtml: html
    });
  };
  const onNotesChange = (html: string, text: string) => {
    setUnsavedChanges(true);
    setInputFields({
      ...inputFields,
      notesHtml: html
    });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Component Details`,
      children: (
        <>
          <div className="grid grid-cols-2 my-2 gap-4">
            <div className="col-span-2">
              <FormInput
                onChange={onChange}
                label={'Title'}
                isRequired
                value={inputFields.title}
                id={'title'}
                placeHolder={`Enter title`}
                type="text"
                error={errors.title}
              />
            </div>

            <div className="col-span-1">
              <Selector
                label={'Select font size'}
                onChange={(name: string) =>
                  setSelectedValues({...selectedValues, size: name})
                }
                list={fontSizeList}
                placeholder="Select font size"
                selectedItem={selectedValues.size}
              />
            </div>

            <div className="col-span-1 relative h-full">
              <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                Select Border Color
              </label>
              <button
                onClick={() => setColorPickerActive(!colorPickerActive)}
                className={`border-0 border-lightest  rounded-full shadow-xs flex items-center justify-start  h-10 px-3`}>
                <span className={'text-dark   w-auto text-sm mr-2 capitalize'}>
                  {selectedValues.color.split('-')[0]}
                </span>

                <span
                  className={`h-4 block w-4 bg-${selectedValues.color} rounded-full border-3 border-light `}></span>
              </button>
              {colorPickerActive && (
                <ColorPicker
                  isMainPage
                  noneLabel="No Border"
                  onNoneClick={() => {
                    setSelectedValues({
                      ...selectedValues,
                      color: 'No Border'
                    });
                    setColorPickerActive(false);
                  }}
                  classString={classString}
                  callbackColor={handleColorPickerSelect}
                  styleString={{top: '100%'}}
                />
              )}
            </div>
          </div>
          <div className="col-span-1 my-4 flex items-center w-auto">
            <Form.Item label="Animated title" valuePropName="checked">
              <Switch
                checked={Boolean(inputFields.animated)}
                disabled={NO_BORDER_SELECTED}
                onClick={onAnimationToggle}
              />
            </Form.Item>
          </div>
          <div className="col-span-1 my-4 flex items-center w-auto">
            <Form.Item label="Instructions" valuePropName="checked">
              <Switch
                checked={Boolean(inputFields.instructions)}
                onClick={() => onToggle('instructions')}
              />
            </Form.Item>
          </div>
          {inputFields.instructions && (
            <div className="col-span-2 max-w-256">
              <RichTextEditor
                withStyles
                initialValue={inputFields?.instructionsText || ''}
                onChange={(htmlContent, plainText) =>
                  onEditorStateChange(htmlContent, plainText)
                }
              />
            </div>
          )}
          <div className="col-span-2 my-4 flex items-center w-auto">
            <Form.Item label="Teacher Notes" valuePropName="checked">
              <Switch
                checked={Boolean(inputFields.notes)}
                onClick={() => onToggle('notes')}
              />
            </Form.Item>
          </div>
          {inputFields.notes && (
            <div className="col-span-2 max-w-256">
              <RichTextEditor
                withStyles
                initialValue={inputFields?.notesHtml || ''}
                onChange={(htmlContent, plainText) =>
                  onNotesChange(htmlContent, plainText)
                }
              />
            </div>
          )}
          <div className="flex mt-8 justify-end px-6 pb-4">
            <div className="flex justify-end gap-4">
              <Buttons
                label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                onClick={askBeforeClose}
                size="middle"
                transparent
              />
              <Buttons
                size="middle"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                onClick={onHeaderCreate}
              />
            </div>
          </div>
        </>
      )
    },
    {
      key: '2',
      label: `Preview`,
      children: (
        <PreviewLayout
          notAvailable={
            inputFields.title.length < 3 ? 'Please add title to see preview' : false
          }>
          <HeaderBlock
            classString={classValue}
            mode="building"
            value={[{id: uuidv4().toString(), value: inputFields.title}]}
          />
          <DummyContent />
        </PreviewLayout>
      )
    }
  ];

  return (
    <div>
      <Tabs items={items} defaultActiveKey="1" />
    </div>
  );
};

export default HeaderModalComponent;
