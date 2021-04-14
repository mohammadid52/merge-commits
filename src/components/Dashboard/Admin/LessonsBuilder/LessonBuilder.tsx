import React, { useState, useEffect, Fragment, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IoArrowUndoCircleOutline, IoDocumentText, IoCardSharp } from 'react-icons/io5';
import { FaRegEye, FaQuestionCircle } from 'react-icons/fa';

import * as customQueries from '../../../../customGraphql/customQueries';

import ModalPopUp from '../../../Molecules/ModalPopUp';
import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import WizardScroller from '../../../Atoms/WizardScroller';

import AddNewLessonForm from './StepActionComponent/AddNewLessonForm';
import AssessmentInstuctions from './StepActionComponent/AssessmentInstuctions';
import CheckpointBuilder from './StepActionComponent/CheckpointBuilder';
import PreviewForm from './StepActionComponent/PreviewForm';
import { InstructionInitialState, SavedLessonDetailsProps, LessonPlansProps } from './LessonEdit';
import useDictionary from '../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../contexts/GlobalContext';

export interface InitialData {
  name: string;
  type: InputValueObject;
  purpose: string;
  purposeHtml: string;
  objective: string;
  objectiveHtml: string;
  languages: { id: string; name: string; value: string }[];
  institution?: InputValueObject;
  language: string[];
}
export interface InputValueObject {
  id: string;
  name: string;
  value: string;
}
interface LessonBuilderProps {
  designersList: any[];
  institutionList: any[];
}

const LessonBuilder = (props: LessonBuilderProps) => {
  const { designersList, institutionList } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const { theme, clientKey, userLanguage } = useContext(GlobalContext);
  const { BreadcrumsTitles, LessonBuilderDict } = useDictionary(clientKey);

  const breadCrumsList = [
    { title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
    { title: BreadcrumsTitles[userLanguage]['LESSONS'], url: '/dashboard/lesson-builder', last: false },
    { title: BreadcrumsTitles[userLanguage]['LESSONPLANBUILDER'], url: `${match.url}`, last: true },
  ];

  const initialData = {
    name: '',
    type: { id: '', name: '', value: '' },
    purpose: '',
    purposeHtml: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
    languages: [{ id: '1', name: 'English', value: 'EN' }],
    institution: { id: '', name: '', value: '' },
    language: [''],
  };
  const instructionInitialState = {
    introductionTitle: '',
    instructionsTitle: '',
    summaryTitle: '',
    introduction: '',
    instructions: '',
    summary: '',
  };

  const assessmentScrollerStep = [
    { name: 'Overview', icon: <IoCardSharp /> },
    { name: 'Instructions', icon: <IoDocumentText />, isDisabled: true },
    { name: 'Builder', icon: <FaQuestionCircle />, isDisabled: true },
    { name: 'Preview Details', icon: <FaRegEye />, isDisabled: true },
  ];
  const lessonScrollerStep = [
    { name: 'Overview', icon: <IoCardSharp /> },
    { name: 'Preview Details', icon: <FaRegEye />, isDisabled: true },
  ];

  const [formData, setFormData] = useState<InitialData>(initialData);
  const [measurementList, setMeasurementList] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState([]);
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState,
  });
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [activeStep, setActiveStep] = useState('Overview');
  const [lessonBuilderSteps, setLessonBuilderSteps] = useState(lessonScrollerStep);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonBuilderDict[userLanguage]['MESSAGES']['UNSAVE'],
  });

  const changeLessonType = (type: string) => {
    if (type === 'lesson') {
      setLessonBuilderSteps(lessonScrollerStep);
    } else {
      setLessonBuilderSteps(assessmentScrollerStep);
    }
  };

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'Overview':
        return (
          <AddNewLessonForm
            lessonId={lessonId}
            changeLessonType={changeLessonType}
            formData={formData}
            setFormData={setFormData}
            designersList={designersList}
            selectedDesigners={selectedDesigners}
            setSelectedDesigners={setSelectedDesigners}
            postLessonCreation={postLessonCreation}
            allMeasurement={measurementList}
            lessonMeasurements={selectedMeasurement}
            setLessonMeasurements={setSelectedMeasurement}
            institutionList={institutionList}
            setUnsavedChanges={setUnsavedChanges}
          />
        );
      case 'Instructions':
        return (
          <AssessmentInstuctions
            lessonId={lessonId}
            setUnsavedChanges={setUnsavedChanges}
            savedInstructions={savedLessonDetails?.lessonInstructions}
            updateParentState={(obj) => onInstructionSaved(obj)}
            lessonType={formData.type?.value}
            lessonName={formData.name}
          />
        );
      case 'Builder':
        return (
          <CheckpointBuilder
            lessonPlans={savedLessonDetails?.lessonPlans}
            designersList={designersList}
            lessonID={lessonId}
            updateLessonPlan={updateLessonPlan}
            setUnsavedChanges={setUnsavedChanges}
            activeStep={activeStep}
            lessonName={formData.name}
            lessonType={formData.type?.value}
          />
        );
      case 'Preview Details':
        return (
          <PreviewForm
            lessonName={formData.name}
            lessonID={lessonId}
            lessonPlans={savedLessonDetails.lessonPlans}
            lessonType={formData.type?.value}
          />
        );
      // default:
      //   return <AddNewLessonForm
      //     changeLessonType={changeLessonType}
      //     formData={formData}
      //     setFormData={setFormData}
      //     designersList={designersList}
      //     selectedDesigners={selectedDesigners}
      //     setSelectedDesigners={setSelectedDesigners}
      //     postLessonCreation={postLessonCreation}
      //   />;
    }
  };

  const gobackToLessonsList = () => {
    if (unsavedChanges) {
      toggleModal();
    } else {
      history.push('/dashboard/lesson-builder');
    }
  };

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show,
    });
  };
  const fetchMeasurementList = async () => {
    try {
      let list: any = await API.graphql(graphqlOperation(customQueries.listRubrics));
      list = list.data.listRubrics?.items || [];
      const measuList = list.sort((a: any, b: any) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      const filteredList = measuList.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          value: item.name,
          topic: item?.topic?.name,
        };
      });
      setMeasurementList(filteredList);
    } catch {
      console.log('Error while fetching lesson data');
    }
  };

  const postLessonCreation = (lessonId: string) => {
    const currentSteps = [...lessonBuilderSteps];
    const updatedState = currentSteps.map((item) => ({ ...item, isDisabled: false }));
    setLessonBuilderSteps(updatedState);
    setLessonId(lessonId);
    if (formData.type?.id === '1') {
      setActiveStep('Preview Details');
    } else {
      setActiveStep('Instructions');
    }
  };

  const onInstructionSaved = (obj: InstructionInitialState) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonInstructions: obj,
    });
    setActiveStep('Builder');
  };

  const updateLessonPlan = (lessonPlan: LessonPlansProps[]) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonPlans: lessonPlan,
    });
  };
  useEffect(() => {
    if (formData.type?.id) {
      changeLessonType(formData.type?.value);
    }
  }, [formData.type?.id]);

  useEffect(() => {
    fetchMeasurementList();
  }, []);
  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={LessonBuilderDict[userLanguage]['TITLE']}
          subtitle={LessonBuilderDict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go back" btnClass="mr-4" onClick={gobackToLessonsList} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="w-full m-auto">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LESSON BUILDER</h3> */}
          <div className="grid grid-cols-5 divide-x-0 divide-gray-400 p-4">
            <div className="sm:col-span-1">
              <WizardScroller
                stepsList={lessonBuilderSteps}
                activeStep={activeStep}
                setActiveStep={(step) => setActiveStep(step)}
              />
            </div>
            <div className="sm:col-span-4">
              <Fragment>
                <div className="mx-6">{currentStepComp(activeStep)}</div>
              </Fragment>
            </div>
          </div>
        </div>
        {warnModal.show && (
          <ModalPopUp
            closeAction={toggleModal}
            saveAction={history.goBack}
            saveLabel="Yes"
            message={warnModal.message}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default LessonBuilder;
