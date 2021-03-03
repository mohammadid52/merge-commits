import React, { useState, useEffect } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';

import CheckpointLookup from './CheckPointSteps/CheckpointLookup';
import AddNewCheckPoint from './CheckPointSteps/AddNewCheckPoint';
import EditCheckPoint from './CheckPointSteps/EditCheckPoint';
import AddNewQuestion from './CheckPointSteps/AddNewQuestion';
import QuestionLookup from './CheckPointSteps/QuestionLookup';
import SelectedCheckPointsList from './CheckPointSteps/SelectedCheckPointsList';
import EditQuestion from './CheckPointSteps/EditQuestion';
import { LessonPlansProps } from '../LessonEdit';
import { InitialData } from './CheckPointSteps/AddNewCheckPoint';

import * as queries from '../../../../../graphql/queries';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import { reorder, createFilterToFetchSpecificItemsOnly } from '../../../../../utilities/strings';

interface CheckpointBuilderProps {
  designersList?: { id: string, name: string, value: string }[]
  lessonID: string
  lessonPlans?: LessonPlansProps[] | null
  updateLessonPlan: (plan: LessonPlansProps[]) => void
}

// TODO: Replace type any with actual type wherever required.


/** 
 * This coponent is responsible for rendering all components for 
 * checkpoint builder ( Step 3 in Assessment builder)
 */


const CheckpointBuilder = (props: CheckpointBuilderProps) => {
  const { designersList, lessonID, lessonPlans, updateLessonPlan } = props;

  const initialCheckpData = {
    title: '',
    subtitle: '',
    label: '',
    instructionsTitle: '',
    purposeHtml: '<p></p>',
    objectiveHtml: '<p></p>',
    instructionHtml: '<p></p>',
    language: { id: '1', name: "English", value: 'EN' }
  }

  const [builderStep, setBuilderStep] = useState('SelectedCheckPointsList');
  // const [builderStep, setBuilderStep] = useState('AddNewCheckPoint');

  const [allCheckPointsList, setAllCheckPointsList] = useState([]);
  const [fileredCheckpointList, setFilteredCheckpointList] = useState([]);
  const [savedCheckPoints, setSavedCheckpoints] = useState([]);
  const [parentLessonPlans, setParentLessonPlans] = useState(lessonPlans);
  const [checkpointDetails, setCheckpointDetails] = useState<InitialData>(initialCheckpData);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [checkpQuestions, setCheckpQuestions] = useState([]);
  const [previouslySelectedId, setPreviouslySelectedId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  const languageList = [
    { id: 1, name: 'English', value: 'EN' },
    { id: 2, name: 'Spanish', value: 'ES' },
  ];

  // Funtion to render diffrent components based on states.
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'SelectedCheckPointsList':
        return <SelectedCheckPointsList
          changeStep={changeBuilderStep}
          activeCheckpoints={savedCheckPoints}
          DeleteCheckpoint={(id) => DeleteCheckpoint(id, lessonPlans)}
          editCheckPoint={fetchCheckDetails}
          onDragEnd={onDragEnd}
        />;
      case 'CheckpointLookup':
        return <CheckpointLookup
          checkpointList={fileredCheckpointList}
          changeStep={changeBuilderStep}
          onSave={saveCheckpoints}
        />;
      case 'AddNewCheckPoint':
        return <AddNewCheckPoint
          lessonPlans={parentLessonPlans}
          updateLessonPlan={onNewCheckpCreation}
          changeStep={changeBuilderStep}
          designersList={designersList}
          lessonID={lessonID}
          checkPointData={checkpointDetails}
          setCheckPointData={setCheckpointDetails}
          selectedDesigners={selectedDesigners}
          setSelectedDesigners={setSelectedDesigners}
          checkpQuestions={checkpQuestions}
          setCheckpQuestions={setCheckpQuestions}
        />;

      case 'EditCheckPoint':
        return <EditCheckPoint
          lessonPlans={parentLessonPlans}
          updateLessonPlan={onNewCheckpCreation}
          changeStep={changeBuilderStep}
          designersList={designersList}
          lessonID={lessonID}
          checkPointData={checkpointDetails}
          setCheckPointData={setCheckpointDetails}
          selectedDesigners={selectedDesigners}
          setSelectedDesigners={setSelectedDesigners}
          checkpQuestions={checkpQuestions}
          setCheckpQuestions={setCheckpQuestions}
          previouslySelectedId={previouslySelectedId} />;

      case 'AddNewQuestion':
        return <AddNewQuestion changeStep={changeBuilderStep} setCheckpQuestions={onAddNewQuestion} goBackToPreviousStep={goBackToPreviousStep} />;
      case 'QuestionLookup':
        return <QuestionLookup selecteList={checkpQuestions} changeStep={changeBuilderStep} onSave={saveQuestionsList} goBackToPreviousStep={goBackToPreviousStep} />;
      // case 'EditQuestion':
      //   return <EditQuestion changeStep={changeBuilderStep} setCheckpQuestions={onAddNewQuestion} />;
      default:
        return <SelectedCheckPointsList
          changeStep={changeBuilderStep}
          activeCheckpoints={savedCheckPoints}
          DeleteCheckpoint={(id) => DeleteCheckpoint(id, lessonPlans)}
          editCheckPoint={fetchCheckDetails}
          onDragEnd={onDragEnd}
        />;
    }
  }

  // To change step inside checkpoint builder.
  const changeBuilderStep = (step: string) => {
    setBuilderStep(step)
  }

  // Remember questions selected questions list from question lookup while creating new checkpoint.
  const saveQuestionsList = (list: any[]) => {
    setCheckpQuestions([...list]);
    goBackToPreviousStep()
  }

  // Moving to add/edit checkpoint view from question lookup
  const goBackToPreviousStep = () => {
    if (checkpointDetails?.id) {
      setBuilderStep('EditCheckPoint');
    } else {
      setBuilderStep('AddNewCheckPoint');
    }
  }
  // Create new question while creating new checkpoint.
  const onAddNewQuestion = (obj: any) => {
    setCheckpQuestions([...checkpQuestions, obj]);
    goBackToPreviousStep()
  }

  // Update list after creating new checkpoint.
  const onNewCheckpCreation = (newLessonPlans: any, newData: any) => {
    updateLessonPlan(newLessonPlans);
    setSavedCheckpoints([
      ...savedCheckPoints,
      ...newData
    ])
  }

  // To fetch checkpoint details for edit checkpoint view.
  const fetchCheckDetails = async (checkpId: string) => {
    try {
      setLoading(true);
      const fetchCheckpointsData: any = await API.graphql(graphqlOperation(queries.getCheckpoint, {
        id: checkpId
      }));
      if (!fetchCheckpointsData) {
        throw new Error('fail!');
      } else {
        const results = fetchCheckpointsData.data?.getCheckpoint;
        const designers = designersList.filter(item => results.designers.includes(item.id));
        const selectedLanguage: any = languageList.find(item => item.value === results.language);
        setCheckpointDetails({
          ...checkpointDetails,
          id: checkpId,
          title: results.title,
          subtitle: results.subtitle,
          label: results.label,
          instructionsTitle: results.instructionsTitle,
          purposeHtml: results.purpose,
          objectiveHtml: results.objectives,
          instructionHtml: results.instructions,
          language: selectedLanguage,
          checkpQuestions: results?.questions?.items
        });
        setSelectedDesigners(designers);
        const checkpointQuestions = results?.questions?.items;
        const quesionsListIds = checkpointQuestions.map((item: { questionID: string }) => item.questionID);
        if (quesionsListIds?.length > 0) {
          const results: any = await API.graphql(graphqlOperation(queries.listQuestions, {
            filter: { ...createFilterToFetchSpecificItemsOnly(quesionsListIds, 'id') }
          }));
          const questionsList: any = results.data.listQuestions.items
          const questionsWithState = questionsList.map((item: any) => {
            return {
              ...item,
              required: checkpointQuestions.find((que: any) => que.questionID === item.id)?.required || false
            }
          })
          setCheckpQuestions(questionsWithState);
          setPreviouslySelectedId(quesionsListIds);
        }
        else {
          setCheckpQuestions([])
        }
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  }

  // Delete selected checkpoint from Assessment/Survey.
  const DeleteCheckpoint = async (checkpId: string, lessonPlans: LessonPlansProps[]) => {
    let previousList = [...lessonPlans];
    const selectedItem = previousList.find((item) => item.LessonComponentID === checkpId)
    const lessonPlansInput = previousList.filter((item) => item.LessonComponentID !== checkpId)
      .map(item => {
        if (item.sequence > selectedItem.sequence) {
          item.sequence = item?.sequence - 1
        }
        return item
      });
    try {
      const result: any = await API.graphql(graphqlOperation(customMutations.updateLesson, {
        input: {
          id: lessonID,
          lessonPlan: lessonPlansInput
        }
      }));
      const deletedlessonCheckp = result?.data?.updateLesson?.checkpoints;
      const deletedlessonCheckpId = deletedlessonCheckp?.items.find((obj: any) => obj.checkpointID === checkpId).id;
      if (deletedlessonCheckpId) {
        const result: any = await API.graphql(graphqlOperation(customMutations.deleteLessonCheckpoint, {
          input: {
            id: deletedlessonCheckpId,
          }
        }))
      }
      const updatedPlan = result?.data?.updateLesson?.lessonPlan;
      if (updatedPlan) {
        const updatedList = updatedPlan.map((item: any) => {
          const checkpointDetails = allCheckPointsList.find(checkp => checkp.id === item.LessonComponentID)
          return {
            ...item,
            ...checkpointDetails
          };
        })

        setSavedCheckpoints(() => {
          updateLessonPlan(updatedPlan);
          return updatedList;
        });
      }
    } catch {
      setError(true);
    }
  }

  // Drag functionality for checkpoint's list.
  const onDragEnd = async (result: any) => {

    if (result.source.index !== result.destination.index) {
      const updatedPlan: any = reorder(lessonPlans, result.source.index, result.destination.index);
      updatedPlan.map((item: { sequence: number }, index: any) => {
        item.sequence = index;
        return item
      });
      const updatedList = updatedPlan.map((item: any) => {
        const checkpointDetails = allCheckPointsList.find(checkp => checkp.id === item.LessonComponentID)
        return {
          ...item,
          ...checkpointDetails
        };
      })
      // setSavedCheckpoints(updatedList);
      // updateLessonPlan(updatedPlan);

      setSavedCheckpoints(() => {
        updateLessonPlan(updatedPlan);
        return updatedList;
      });

      try {
        const result: any = await API.graphql(graphqlOperation(customMutations.updateLesson, {
          input: {
            id: lessonID,
            lessonPlan: updatedPlan
          }
        }));
      } catch {
        setError(true);
      }
    }
  }

  const updateMultiLessonPlans = async (lessonPlans: any, remainingCheckp: any) => {
    const lessonPlansInput = lessonPlans.map((item: { type: string, LessonComponentID: string, sequence: number, stage: string }) => ({
      type: item.type,
      LessonComponentID: item.LessonComponentID,
      sequence: item.sequence,
      stage: item.stage
    }))
    try {
      const result: any = await API.graphql(graphqlOperation(customMutations.updateLesson, {
        input: {
          id: lessonID,
          lessonPlan: lessonPlansInput
        }
      }));
      const updatedPlan = result?.data?.updateLesson?.lessonPlan;
      if (updatedPlan) {
        updateLessonPlan(updatedPlan);
        setSavedCheckpoints(lessonPlans);
        setFilteredCheckpointList(remainingCheckp);
        setBuilderStep('SelectedCheckPointsList')
      }
    } catch {
      setError(true);
    }
  }

  // Update data in lesson checkpoint table.
  const saveLessonCheckpointMutation = async (checkpointID: string) => {
    try {
      let lessonCheckpointInput = {
        lessonID: lessonID,
        checkpointID: checkpointID,
        position: 0,
      }
      await API.graphql(graphqlOperation(customMutations.createLessonCheckpoint, {
        input: lessonCheckpointInput
      }))
    } catch {
      setError(true);
    }
  }

  const saveCheckpoints = async (selectedId: string[]) => {
    if (selectedId?.length > 0) {
      const updatedList = fileredCheckpointList.filter(item => selectedId.includes(item.id));
      const remainingCheckp = fileredCheckpointList.filter(item => !selectedId.includes(item.id));
      const newCkeckpoints = updatedList.map((item, index) => {
        return {
          ...item,
          sequence: (parentLessonPlans?.length || 0) + index,
          LessonComponentID: item.id,
          type: 'checkpoint',
          stage: 'checkpoint'
        }
      })
      const lessonComponentPlans = [
        ...savedCheckPoints,
        ...newCkeckpoints
      ]
      await updateMultiLessonPlans(lessonComponentPlans, remainingCheckp);
      let lessonCheckpoints = Promise.all(
        updatedList.map(async (item: any) => saveLessonCheckpointMutation(item.id))
      )
    }
  }

  const filteredLessonPlans = () => {
    if (allCheckPointsList?.length > 0) {
      if (parentLessonPlans?.length > 0) {
        const savedLessonPlans = [...parentLessonPlans];
        const lessonPlanIds = savedLessonPlans.map(item => item.LessonComponentID)
        const updatedList = savedLessonPlans.map(item => {
          const checkpointDetails = allCheckPointsList.find(checkp => checkp.id === item.LessonComponentID)
          return {
            ...item,
            ...checkpointDetails
          };
        })
        const remainingCheckps = allCheckPointsList.filter(item => !lessonPlanIds.includes(item.id))
        setSavedCheckpoints(updatedList);
        setFilteredCheckpointList(remainingCheckps);
      } else {
        setFilteredCheckpointList(allCheckPointsList);
      }
    }
  }

  const fetchCheckpointLists = async () => {
    try {
      setLoading(true);
      const fetchCheckpointsData: any = await API.graphql(
        graphqlOperation(customQueries.listCheckpoints, {
          filter: { type: { ne: 'profile' } },
        })
      );
      if (!fetchCheckpointsData) {
        throw new Error('fail!');
      } else {
        const checkpointList = fetchCheckpointsData.data?.listCheckpoints?.items;
        const sortedList = checkpointList.sort((a: any, b: any) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
        setAllCheckPointsList(sortedList);
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCheckpointLists();
  }, [])

  useEffect(() => {
    filteredLessonPlans();
  }, [allCheckPointsList])

  useEffect(() => {
    setParentLessonPlans(lessonPlans);
  }, [lessonPlans])

  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>
      {currentStepComp(builderStep)}
    </div>
  )
}

export default CheckpointBuilder
