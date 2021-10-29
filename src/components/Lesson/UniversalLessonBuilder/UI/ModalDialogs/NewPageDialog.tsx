import React, {useContext, useState} from 'react';
import {VscNewFile} from 'react-icons/vsc';
import {FaCopy} from 'react-icons/fa';
import PageTile from '../common/PageTile';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import Tooltip from '../../../../Atoms/Tooltip';
import {UniversalLesson} from '../../../../../interfaces/UniversalLessonInterfaces';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as customMutations from '../../../../../customGraphql/customMutations';
interface ILessonInputs {
  id: string;
  label: string;
  title: string;
  description: string;
}

interface INewPageDialog {
  universalLessonDetails: UniversalLesson;
  closeAction: () => void;
}

const NewPageDialog = ({universalLessonDetails, closeAction}: INewPageDialog) => {
  const {addNewPageHandler, setSelectedPageID} = useULBContext();
  const {userLanguage} = useContext(GlobalContext);
  const [focussed, setFocussed] = useState<
    'new_page' | 'existing_page' | 'template' | ''
  >('');
  const pages = universalLessonDetails?.lessonPlan;

  const [inputObj, setInputObj] = useState<ILessonInputs>({
    id: '',
    label: '',
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [copiedPageIndex, setCopiedPageIndex] = useState<number>(-1);

  const handleToggleFocussed = (
    sectionTag: 'new_page' | 'existing_page' | 'template' | ''
  ) => {
    if (focussed !== sectionTag) {
      setFocussed(sectionTag);
    } else {
      setFocussed('');
    }
  };

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

  const addLessonToDatabase = async (id: string) => {
    try {
      const input: any = {
        id,
        lessonPlan: [
          ...universalLessonDetails.lessonPlan,
          {
            ...inputObj,
            pageContent: [],
          },
        ],
      };
      const result = await API.graphql(
        graphqlOperation(customMutations.updateUniversalLesson, {input})
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      addNewPageHandler({
        ...inputObj,
        pageContent: [],
      });

      // if (selectedLessonID) {
      //   addLessonToDatabase(selectedLessonID);
      // }
      closeAction();
      setSelectedPageID(inputObj.id);
    } else {
      return;
    }
  };

  const addExistingPage = () => {
    const id: string = `page_${pages.length + 1}`;
    addNewPageHandler({
      ...pages[copiedPageIndex],
      id,
      pageContent:
        copiedPageIndex > -1
          ? pages[copiedPageIndex].pageContent.map((part: any, partIndex: number) => ({
              ...part,
              id: `${id}_part_${partIndex}`,
              partContent: part.partContent.map((content: any, contentIndex: number) => ({
                ...content,
                id: `${id}_part_${partIndex}_${content.type}_${
                  part.partContent.filter(
                    (c: any, i: number) => c.type === content.type && i < contentIndex
                  ).length
                }`,
              })),
            }))
          : [],
    });
    closeAction();
  };

  const validateForm = () => {
    const {id = '', label = '', title = '', description = ''} = inputObj;
    let isValid = true,
      formErrors: any = {};
    if (!id) {
      isValid = false;
      formErrors.id = 'Id is required';
    } else if (pages.findIndex((page: any) => page.id === id) > -1) {
      isValid = false;
      formErrors.id = 'This id is already associated with different page';
    } else {
      isValid = true;
      formErrors.id = '';
    }

    if (!label) {
      isValid = false;
      formErrors.label = 'Label is required';
    }
    if (!title) {
      isValid = false;
      formErrors.title = 'Title is required';
    }
    if (!description) {
      isValid = false;
      formErrors.description = 'Description is required';
    }
    setErrors(formErrors);
    return isValid;
  };

  const onCopyPageContent = (selectedPageIndex: number) => {
    setCopiedPageIndex(selectedPageIndex);
  };

  return (
    <>
      <div className={`flex flex-row z-50`}>
        {/* LEFT */}
        <div
          className={`
        ${
          focussed === ''
            ? ''
            : focussed === 'new_page'
            ? 'w-full h-full m-4 '
            : 'w-0 overflow-hidden opacity-0'
        }
        transition-all duration-400 ease-in-out m-2 
        flex flex-col`}>
          <div className="relative flex items-center">
            <h2 className="w-full bg-white text-lg font-semibold text-gray-900 truncate">
              Create New Page
            </h2>
          </div>
          {/* <div className={`bg-gray-200 mb-4 p-2`}>
          <label
            htmlFor="field1"
            className="text-left block text-xs font-medium text-gray-700">
            Lesson Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="lessonNameInput"
              id="lessonNameInput"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="My Custom Lesson"
            />
          </div>
        </div>
        <div className={`bg-gray-200 mb-4 p-2`}>
          <label
            htmlFor="field1"
            className="text-left block text-xs font-medium text-gray-700">
            Subject
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="lessonSubjectInput"
              id="lessonSubjectInput"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="Creative Writing"
            />
          </div>
        </div>
        <div className={`bg-gray-200 mb-4 p-2`}>
          <label
            htmlFor="field1"
            className="text-left block text-xs font-medium text-gray-700">
            Type
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="lessonTypeInput"
              id="lessonTypeInput"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              placeholder="Standard Lesson"
            />
          </div>
        </div>
       */}
          <div className="bg-gray-200 py-2">
            <div className="p-2">
              <FormInput
                value={inputObj.id}
                label={'Id'}
                onChange={onInputChange}
                name={'id'}
                isRequired={true}
                error={errors.id}
              />
            </div>

            <div className="p-2">
              <FormInput
                label={'Label'}
                value={inputObj.label}
                onChange={onInputChange}
                name={'label'}
                isRequired={true}
                error={errors.label}
              />
            </div>
            <div className="p-2">
              <FormInput
                label={'Title'}
                value={inputObj.title}
                onChange={onInputChange}
                name={'title'}
                isRequired={true}
                error={errors.title}
              />
            </div>
            <div className="p-2">
              <FormInput
                label={'Description'}
                value={inputObj.description}
                onChange={onInputChange}
                name={'description'}
                isRequired={true}
                error={errors.description}
              />
            </div>
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                type="submit"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>

        {/* MIDDLE */}
        <div
          className={`
        ${
          focussed === ''
            ? ' m-2'
            : focussed === 'existing_page'
            ? 'w-full'
            : 'w-0 overflow-hidden opacity-0 m-0'
        }
        transition-all duration-400 ease-in-out
      `}>
          <div className="relative flex items-center justify-between mb-2">
            <h2 className="w-auto bg-white text-lg font-semibold  text-gray-900 truncate">
              Use Existing Page
            </h2>
            <Buttons
              onClick={() => handleToggleFocussed('existing_page')}
              Icon={VscNewFile}
              label={`${focussed === 'existing_page' ? 'Less' : 'More'}`}
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-indigo-400 rounded-lg hover:bg-indigo-500 transition-all"
            />
          </div>

          <div className={`w-full bg-gray-200 rounded py-2`}>
            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              This lesson
            </p>
            <div className={`mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200`}>
              {pages && pages.length
                ? pages
                    .slice(0, focussed === 'existing_page' ? pages.length : 3)
                    .map((page: any, index: number) => (
                      <div key={page.id} className="flex flex-col">
                        <PageTile whClass={`w-20 h-28 mt-1`} marginClass={`mx-auto`} />
                        <div className="flex mx-auto flex-col text-gray-400">
                          <div className="text-md text-center">{page.label}</div>
                          {index === copiedPageIndex ? (
                            <div className="text-center">Copied</div>
                          ) : (
                            <div className="cursor-pointer">
                              <Tooltip
                                placement="top"
                                text={`Click here to copy the content of this page`}>
                                <FaCopy onClick={() => onCopyPageContent(index)} />
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                : null}
            </div>
            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              Other lessons
            </p>
            <div className="mt-2 p-4 py-2 grid grid-cols-1 bg-gray-200">
              <div className={`w-auto h-32 flex items-center bg-white shadow rounded`}>
                <div className="text-center text-gray-400">Coming Soon</div>
              </div>
            </div>
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                disabled={copiedPageIndex < 0}
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                type="submit"
                onClick={addExistingPage}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`
        ${
          focussed === ''
            ? ''
            : focussed === 'template'
            ? 'w-full'
            : 'w-0 overflow-hidden opacity-0 m-0'
        }
        transition-all duration-400 ease-in-out m-2
      `}>
          <div className="relative flex items-center justify-between mb-2">
            <h2 className="w-auto bg-white text-lg font-semibold  text-gray-900 truncate">
              Page From Template
            </h2>
            <Buttons
              onClick={() => handleToggleFocussed('template')}
              Icon={VscNewFile}
              label={`${focussed === 'template' ? 'Less' : 'More'}`}
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-indigo-400 rounded-lg hover:bg-indigo-500 transition-all"
            />
          </div>

          <div className={`w-full bg-gray-200 rounded py-2`}>
            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              Style 1
            </p>
            <div className="mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200">
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            </div>

            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              Style 2
            </p>
            <div className="mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200">
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
              <PageTile whClass={`w-20 h-28`} marginClass={`mx-auto`} />
            </div>
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                type="submit"
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex mt-4 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={closeAction}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            type="submit"
            onClick={handleSubmit}
          />
        </div>
      </div> */}
    </>
  );
};

export default NewPageDialog;
