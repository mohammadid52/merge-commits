import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';

import {IconContext} from 'react-icons/lib/cjs';
import {FaTrash} from 'react-icons/fa';

import useDictionary from '../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';

import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';
import Loader from '../../../../Atoms/Loader';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

const LessonMeasurements = ({lessonId}: any) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict} = useDictionary(clientKey);

  const [measurementList, setMeasurementList] = useState([]);
  const [lessonMeasurements, setLessonMeasurements] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState({
    id: '',
    name: '',
    value: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState({
    id: '',
    state: false,
    message: AddNewLessonFormDict[userLanguage]['MESSAGES']['REMOVE'],
  });
  const [errors, setErrors] = useState({
    serverError: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMeasurementList();
    fetchRubricsList();
  }, []);

  const fetchRubricsList = async () => {
    try {
      const [results, topics]: any = await Promise.all([
        await API.graphql(
          graphqlOperation(customQueries.listLessonRubricss, {
            filter: {
              lessonID: {eq: lessonId},
            },
          })
        ),
        await API.graphql(graphqlOperation(customQueries.listTopics)),
      ]);

      const topicsList = topics.data?.listTopics?.items;
      const lessonRubrics = results.data?.listLessonRubricss?.items?.map((item: any) => {
        return {
          id: item.id,
          rubricID: item.rubricID,
          measurement: item?.rubric?.name,
          topic:
            topicsList.find((topic: any) => topic.id === item.rubric.topicID)?.name || '',
          curriculumId: item?.rubric?.curriculumID,
        };
      });
      setLessonMeasurements([...lessonRubrics]);
      setLoading(false);
    } catch {
      // setValidation({
      //   name: '',
      //   type: '',
      //   message: GeneralInformationDict[userLanguage]['MESSAGES']['FETCHERR'],
      //   isError: true,
      // });
    }
  };

  const fetchMeasurementList = async () => {
    try {
      let list: any = await API.graphql(graphqlOperation(customQueries.listRubrics));
      list = list.data.listRubrics?.items || [];
      const measuList = list.sort((a: any, b: any) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      const filteredList = measuList.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          value: item.name,
        };
      });
      setMeasurementList(filteredList);
    } catch {
      console.log('Error while fetching lesson data');
    }
  };

  const addNewMeasurement = () => {
    setLessonMeasurements((prevLessonMeasurements: any) => [
      ...prevLessonMeasurements,
      {
        id: selectedMeasurement.id,
        measurement: selectedMeasurement.name,
        topic:
          measurementList.find((item) => item.id.toString() === selectedMeasurement.id)
            ?.topic || '',
      },
    ]);
    setSelectedMeasurement({id: '', name: '', value: ''});
  };

  const toggleModal = (id?: string) => {
    setShowDeleteModal({
      ...showDeleteModal,
      id: id ? id : '',
      state: !showDeleteModal.state,
    });
  };

  const deleteMeasurement = async () => {
    if (showDeleteModal?.id) {
      const filteredRubrics = [...lessonMeasurements].filter(
        (item) => item.id !== showDeleteModal?.id
      );
      setLessonMeasurements([...filteredRubrics]);
    }
    toggleModal();
  };
  const saveMeasurements = async (lessonId: string, rubricsId: string) => {
    try {
      const input = {
        lessonID: lessonId,
        rubricID: rubricsId,
      };
      const results: any = await API.graphql(
        graphqlOperation(customMutations.createLessonRubrics, {input: input})
      );
      const lessonRubric = results.data.createLessonRubrics;
    } catch {
      setErrors({
        serverError: AddNewLessonFormDict[userLanguage]['ADDERR'],
      });
    }
  };

  const handleSelectMeasurement = (val: string, name: string, id: string) => {
    setSelectedMeasurement({id, name, value: val});
  };

  const handleSave = () => {
    setSaving(true);
    Promise.all(
      lessonMeasurements.map(async (item: any) => saveMeasurements(lessonId, item.id))
    ).then((res) => setSaving(false));
  };

  return (
    <div className="p-6 border-gray-400 my-4">
      <p className="text-m font-medium leading-5 text-gray-700 my-2 text-center">
        {AddNewLessonFormDict[userLanguage]['MEASUREMENTLESSON']}
      </p>
      {loading ? (
        <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
          <div className="w-5/10">
            <Loader />
            <p className="mt-2 text-center text-lg text-gray-500">
              Loading Measurements...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="my-12 w-6/10 m-auto flex items-center justify-center">
            <div className="mr-4">
              <Selector
                selectedItem={selectedMeasurement.name}
                list={measurementList}
                placeholder={AddNewLessonFormDict[userLanguage]['SELECTMEASURE']}
                onChange={handleSelectMeasurement}
              />
            </div>
            <div className="ml-4 w-auto">
              <Buttons
                btnClass="ml-4 py-1"
                label="Add"
                onClick={addNewMeasurement}
                disabled={selectedMeasurement.value ? false : true}
              />
            </div>
          </div>
          <div>
            {lessonMeasurements?.length > 0 ? (
              <div>
                {/* Table header */}
                <div className="flex justify-between w-full px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-gray-200">
                  <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{AddNewLessonFormDict[userLanguage]['NO']}</span>
                  </div>
                  <div className="w-4.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{AddNewLessonFormDict[userLanguage]['MEASUREMENT']}</span>
                  </div>
                  <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{AddNewLessonFormDict[userLanguage]['TOPIC']}</span>
                  </div>
                  <div className="w-2/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    <span>{AddNewLessonFormDict[userLanguage]['ACTION']}</span>
                  </div>
                  {/** <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      <span>Action</span>
                    </div> */}
                </div>

                {/* Table column */}
                <div className="w-full m-auto max-h-88 overflow-auto">
                  {lessonMeasurements.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                      <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                        {' '}
                        {index + 1}.
                      </div>
                      <div className="flex w-4.5/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                        {' '}
                        {item.measurement}{' '}
                      </div>
                      <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                        {item.topic ? item.topic : '--'}
                      </div>
                      <div className="flex w-2/10 px-8 py-3 text-s leading-4 items-center justify-center">
                        <div
                          className="w-6 h-6 cursor-pointer"
                          onClick={() => toggleModal(item.id)}>
                          <IconContext.Provider value={{size: '1rem', color: '#B22222'}}>
                            <FaTrash />
                          </IconContext.Provider>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 my-6 text-center">
                <p className="text-gray-600 font-medium">
                  {AddNewLessonFormDict[userLanguage]['MESSAGES']['LESSONNOTHAVE']}
                </p>
              </div>
            )}
          </div>
          <div className="flex mb-8 mt-4 justify-center">
            <Buttons
              btnClass="py-3 px-10"
              label={
                saving
                  ? AddNewLessonFormDict[userLanguage]['SAVING']
                  : AddNewLessonFormDict[userLanguage]['SAVE']
              }
              onClick={handleSave}
              disabled={saving || !lessonMeasurements?.length}
            />
          </div>
        </>
      )}
      {showDeleteModal.state && (
        <ModalPopUp
          deleteModal
          deleteLabel="Remove"
          closeAction={toggleModal}
          saveAction={deleteMeasurement}
          message={showDeleteModal.message}
        />
      )}
    </div>
  );
};

export default LessonMeasurements;
