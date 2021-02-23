import React, { useState, Fragment } from 'react';
import { useHistory, useParams } from 'react-router';
import { IoArrowUndoCircleOutline, IoOptionsOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib/esm/iconContext';

import { getTypeString } from '../../../../../../../utilities/strings';

import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import BreadCrums from '../../../../../../Atoms/BreadCrums';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../../Atoms/Form/Selector';
import Buttons from '../../../../../../Atoms/Buttons';
import AddQuestion from './QuestionComponents/AddQuestion';
import SelectPreviousQuestion from './QuestionComponents/SelectPreviousQuestion';

interface EditProfileCheckpointProps {

}

const EditProfileCheckpoint = (props: EditProfileCheckpointProps) => {
  const { } = props;
  const history = useHistory();
  const urlParams: any = useParams()
  const curricularId = urlParams.curricularId;

  const initialData = {
    title: '',
    label: '',
    language: { id: '1', name: "English", value: 'EN' }
  }
  const tempQuestionData: any = [
    // { id: '1', question: 'Question one', type: 'text' },
    // { id: '2', question: 'Question two', type: 'text' },
    // { id: '3', question: 'Question three', type: 'selectMany' },
    // { id: '4', question: 'Question four', type: 'text' },
  ]
  const [checkpointData, setCheckpointData] = useState(initialData);
  const [selectedDesigners, setSelectedDesigner] = useState([]);
  const [checkpQuestions, setCheckpQuestions] = useState(tempQuestionData);
  const [questionOptions, setQuestionOptions] = useState({ quesId: '', options: [] });
  const [currentState, setCurrentState] = useState('checkpoint');
  const [validation, setValidation] = useState({
    title: '',
    label: '',
    message: '',
    isError: true
  });
  const designersList: any = [];

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Add Checkpoint', url: `/dashboard/curricular/${curricularId}/checkpoint/addNew`, last: true }
  ];

  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];

  const onInputChange = (e: any) => {
    setCheckpointData({
      ...checkpointData,
      [e.target.name]: e.target.value
    })
    if (validation.title || validation.label) {
      setValidation({
        ...validation,
        title: '',
        label: ''
      })
    }
  }

  const selectLanguage = (value: string, name: string, id: string) => {
    setCheckpointData({
      ...checkpointData,
      language: {
        id,
        name,
        value
      }
    })
  }

  const selectDesigner = (id: string, name: string, value: string) => {
    let updatedList;
    const currentDesigners = selectedDesigners;
    const selectedItem = currentDesigners.find(item => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentDesigners, { id, name, value }];
    } else {
      updatedList = currentDesigners.filter(item => item.id !== id);
    }
    setSelectedDesigner(updatedList)
  }

  const showOptions = (quesId: string, options: any[]) => {
    if (questionOptions.quesId !== quesId) {
      setQuestionOptions({ quesId, options })
    } else {
      setQuestionOptions({ quesId: '', options: [] })
    }
  }

  const backToInitials = () => {
    setCurrentState('checkpoint')
  }

  const saveNewCheckpoint = () => {

  }
  const { title, language, label } = checkpointData;

  return (
    <div className="w-full h-full px-4 pb-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Add Checkpoint" subtitle="Add new checkpoint to curricular." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        {currentState !== 'checkpoint' ? (
          <Fragment>
            {currentState === 'addQuestion' && <AddQuestion goBackToPreviousStep={backToInitials} />}
            {currentState === 'questionsList' && <SelectPreviousQuestion goBackToPreviousStep={backToInitials} />}
          </Fragment>
        ) : (
            <Fragment>
              <div className="w-8/10 m-auto">
                <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">ADD NEW CHECKPOINT</h3>
              </div>
              <div className="w-9/10 m-auto">
                <div className="">

                  <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                    <div>
                      <FormInput value={title} id='title' onChange={onInputChange} name='title' label='Title' isRequired />
                      {validation.title && <p className="text-red-600 text-sm">{validation.title}</p>}
                    </div>
                    <div>
                      <FormInput value={label} id='label' onChange={onInputChange} name='label' label="Checkpoint Label" isRequired />
                      {validation.label && <p className="text-red-600 text-sm">{validation.label}</p>}
                    </div>
                  </div>

                  <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                        Select Designers
                      </label>
                      <MultipleSelector selectedItems={selectedDesigners} placeholder="Designers" list={designersList} onChange={selectDesigner} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                        Select Language
                      </label>
                      <Selector selectedItem={language.name} placeholder="Language" list={languageList} onChange={selectLanguage} />
                    </div>
                  </div>


                  {/* Question table */}
                  <div className="p-6 border-gray-400 border my-4 border-dashed">
                    <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">Checkpoint Questions: </p>
                    {!checkpQuestions?.length ? (
                      <div className="my-8">
                        <p className="text-center p-8"> Please add questions to this checkpoint.</p>
                        <div className="flex w-full mx-auto p-8 justify-center ">
                          <Buttons btnClass="mr-4" onClick={() => setCurrentState('questionsList')} label="Add Existing Questions" />
                          <Buttons btnClass="ml-4" onClick={() => setCurrentState('addQuestion')} label="Create New Question" />
                        </div>
                      </div>
                    ) : (
                        <Fragment>
                          <div className="max-h-112 overflow-auto">
                            <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
                              <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                <span>No.</span>
                              </div>
                              <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                <span>Question</span>
                              </div>
                              <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                <span>Type</span>
                              </div>
                              <div className="w-1.5/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                <span>Options</span>
                              </div>
                            </div>

                            <div className="w-full m-auto">
                              {checkpQuestions.length > 0 ? checkpQuestions.map((item: any, index: number) => (
                                <Fragment key={item.id}>
                                  <div key={item.id} className={`flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200 ${questionOptions.quesId === item.id && 'bg-gray-200'}`}>
                                    <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4"> {index + 1}.</div>
                                    <div className="flex w-6/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.question} </div>
                                    <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.type ? getTypeString(item.type) : '--'}</div>
                                    {/* <div className="flex w-1.5/10 px-6 py-3 text-s leading-4 items-center justify-center">
                                      <span className="cursor-pointer">
                                        <CheckBox value={item.required ? true : false} onChange={() => console.log(item.id)} name='isRequired' />
                                      </span>
                                    </div> */}
                                    <div className="flex w-1.5/10 px-6 py-1 text-s leading-4 items-center justify-center">
                                      {(item.type === 'selectMany' || item.type === 'selectOne') && (<div className="w-6 h-6 cursor-pointer text-indigo-600" onClick={() => showOptions(item.id, item.options)}>
                                        <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
                                          <IoOptionsOutline />
                                        </IconContext.Provider>
                                      </div>)}
                                    </div>
                                  </div>
                                  {(questionOptions.quesId === item.id) && (<div className="px-16 py-4 flex flex-col text-gray-700 font-medium text-sm border-b border-gray-200">
                                    <p className="text-gray-900 px-2 py-2 text-base">Options:</p>
                                    {questionOptions.options?.map((item, index) => (
                                      <span className="px-12 py-2" key={item.label}>{index + 1}. {item.text}</span>
                                    ))}
                                  </div>)}
                                </Fragment>
                              )) : (
                                  <div className="py-12 my-6 text-center">
                                    <p> This checkpoint does not have any questions</p>
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex w-full mx-auto p-8 justify-center ">
                            <Buttons btnClass="mr-4" onClick={() => setCurrentState('questionsList')} label="Add Existing Questions" />
                            <Buttons btnClass="ml-4" onClick={() => setCurrentState('addQuestion')} label="Create New Question" />
                          </div>
                        </Fragment>
                      )}
                  </div>

                </div>
              </div>
              <div className="flex my-8 justify-center">
                <Buttons btnClass="py-3 px-10 mr-4" label="Cancel" onClick={history.goBack} transparent />
                <Buttons btnClass="py-3 px-10 ml-4" label="Save" onClick={saveNewCheckpoint} />
              </div>
            </Fragment>
          )}
      </PageWrapper>
    </div>
  )
}

export default EditProfileCheckpoint