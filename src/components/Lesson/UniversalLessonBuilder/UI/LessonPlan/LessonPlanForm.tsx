import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router';
import FormInput from '../../../../Atoms/Form/FormInput';
import Buttons from '../../../../Atoms/Buttons';
import TextArea from '../../../../Atoms/Form/TextArea';
import Selector from '../../../../Atoms/Form/Selector';
import * as customMutations from '../../../../../customGraphql/customMutations';
import {graphqlOperation, API} from 'aws-amplify';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {useQuery} from '../../../../../customHooks/urlParam';
import {v4 as uuidV4} from 'uuid';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {getAsset} from '../../../../../assets';
interface ILessonInputs {
  id: string;
  label: string;
  title: string;
  description: string;
  estTime: string;
}

const estimatedTimeList = Array(30)
  .fill({})
  .map((_, index: number) => ({
    id: index + 1,
    name: `${index + 1} min`,
    value: index + 1,
  }));

const LessonPlanForm = () => {
  const history = useHistory();
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BUTTONS, LessonBuilderDict} = useDictionary(clientKey);
  const {universalLessonDetails, setActiveTab} = useULBContext();
  const [inputObj, setInputObj] = useState<ILessonInputs>({
    id: '',
    label: '',
    title: '',
    description: '',
    estTime: '1 min',
  });
  const [errors, setErrors] = useState<any>({});
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');
  const pages = universalLessonDetails?.lessonPlan;

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;
    setInputObj((prevInputs: ILessonInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
    setErrors((errors: any) => ({
      ...errors,
      [name]: '',
    }));
  };

  const createPage = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true);
        const input = {
          id: lessonId,
          lessonPlan: [
            ...pages,
            {
              title: inputObj.title,
              label: inputObj.label,
              description: inputObj.description,
              pageContent: [],
              // estTime: Number(inputObj.estTime?.split(' ')[0]),
            },
          ],
        };
        const res: any = await API.graphql(
          graphqlOperation(customMutations.updateUniversalLesson, {
            input,
          })
        );
        const data = res.data.updateUniversalLesson;
        setLoading(false);
        if (data) {
          setActiveTab(1);
          history.push(`/dashboard/lesson-builder/lesson/view?lessonId=${lessonId}`);
        }
      } catch (error) {
        setLoading(false);
        console.error(error.message);
      } finally {
        setCreatingLesson(false);
      }
    }
  };

  const validateForm = () => {
    const {label = '', title = ''} = inputObj;
    let isValid = true,
      formErrors: any = {};

    if (!label) {
      isValid = false;
      formErrors.label = 'Label is required';
    }
    if (!title) {
      isValid = false;
      formErrors.title = 'Title is required';
    }
    setErrors(formErrors);
    return isValid;
  };

  const onSelectOption = (_: any, name: string) => {
    setInputObj((prevInputs: ILessonInputs) => ({
      ...prevInputs,
      estTime: name,
    }));
  };

  return (
    <div className="w-full m-auto">
      <div className="mb-4">
        <div className="p-4">
          <div className="py-2">
            <div className="grid grid-cols-3">
              <div className="p-2">
                <FormInput
                  label={LessonBuilderDict[userLanguage]['LESSON_PLAN_FORM'].LABEL}
                  value={inputObj.label}
                  onChange={onInputChange}
                  name={'label'}
                  isRequired={true}
                  error={errors.label}
                  maxLength={12}
                  showCharacterUsage
                />
              </div>
              <div className="p-2">
                <FormInput
                  label={LessonBuilderDict[userLanguage]['LESSON_PLAN_FORM'].TITLE}
                  value={inputObj.title}
                  onChange={onInputChange}
                  name={'title'}
                  isRequired={true}
                  error={errors.title}
                />
              </div>
              <div className="p-2">
                {/* <label
                htmlFor={'estTime'}
                className="block text-xs font-semibold leading-5 text-gray-700">
                {LessonBuilderDict[userLanguage]['LESSON_PLAN_FORM'].ESTIMATED_TIME}{' '}
              </label> */}
                {/* <InputMask
                className={`mt-1 block w-full sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-${
                  themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
                }-600 focus:border-transparent border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm ${
                  theme.outlineNone
                }`}
                mask={'99:99'}
                placeholder="hh:mm"
                name="fullCourseTime"
                value={fullCourseTime}
                onChange={this.handleChange}
              /> */}
                <Selector
                  label={
                    LessonBuilderDict[userLanguage]['LESSON_PLAN_FORM'].ESTIMATED_TIME
                  }
                  placeholder={'Select estimate time'}
                  list={estimatedTimeList}
                  selectedItem={inputObj.estTime}
                  onChange={onSelectOption}
                />
              </div>
            </div>
            <div className="p-2">
              <TextArea
                error={errors.description}
                label={LessonBuilderDict[userLanguage]['LESSON_PLAN_FORM'].DESCRIPTION}
                name={'description'}
                onChange={onInputChange}
                rows={2}
                value={inputObj.description}
              />
            </div>
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                disabled={creatingLesson}
                label={
                  loading
                    ? BUTTONS[userLanguage]['SAVING']
                    : BUTTONS[userLanguage]['SAVE']
                }
                type="submit"
                onClick={createPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanForm;
