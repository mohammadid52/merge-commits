import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';

import {FaTrash} from 'react-icons/fa';

import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {GeneralInformationDict} from 'dictionary/dictionary.curate';

import Buttons from 'atoms/Buttons';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import ModalPopUp from 'molecules/ModalPopUp';

const LessonMeasurements = ({lessonId}: any) => {
  const {userLanguage} = useGlobalContext();
  const {AddNewLessonFormDict} = useDictionary();

  const [measurementOptions, setMeasurementOptions] = useState<any[]>([]);
  const [lessonMeasurements, setLessonMeasurements] = useState<any[]>([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState({
    id: '',
    name: '',
    value: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState({
    id: '',
    state: false,
    message: AddNewLessonFormDict[userLanguage]['MESSAGES']['REMOVE']
  });
  const [messages, setMessages] = useState({
    measurementError: '',
    serverError: '',
    addSuccess: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const measurementList: any[] = [];

  useEffect(() => {
    if (measurementList.length && lessonMeasurements.length) {
      const measurementIDs = lessonMeasurements.map(
        (measurment: any) => measurment.rubricID
      );
      const temp = measurementList.filter(
        (item: any) => !measurementIDs.includes(item.id)
      );
      setMeasurementOptions(temp);
    }
  }, [measurementList, lessonMeasurements]);

  const addNewMeasurement = async () => {
    try {
      const input = {
        lessonID: lessonId,
        rubricID: selectedMeasurement.id
      };
      setSaving(true);
      const results: any = await API.graphql(
        graphqlOperation(customMutations.createLessonRubrics, {input: input})
      );
      const lessonRubric = results.data.createLessonRubrics;
      if (lessonRubric?.id) {
        setLessonMeasurements((prevLessonMeasurements: any) => [
          ...prevLessonMeasurements,
          {
            id: lessonRubric.id,
            rubricID: lessonRubric.rubricID,
            measurement: selectedMeasurement.name,
            topic: lessonRubric?.rubric?.topic?.name,
            curriculumId: lessonRubric?.rubric?.curriculumID
          }
        ]);
        setSelectedMeasurement({id: '', name: '', value: ''});
      }
      setSaving(false);
    } catch {
      setMessages({
        measurementError: '',
        serverError: GeneralInformationDict[userLanguage]['MESSAGES']['ADDERR'],
        addSuccess: ''
      });
    }
  };

  const toggleModal = (id?: string) => {
    setShowDeleteModal({
      ...showDeleteModal,
      id: id ? id : '',
      state: !showDeleteModal.state
    });
  };

  const deleteMeasurement = async () => {
    try {
      const input = {
        id: showDeleteModal.id
      };
      const results: any = await API.graphql(
        graphqlOperation(customMutations.deleteLessonRubrics, {input: input})
      );
      const lessonRubric = results.data.deleteLessonRubrics;
      if (lessonRubric?.id) {
        setLessonMeasurements((prevLessonMeasurements: any) =>
          prevLessonMeasurements.filter((item: any) => item.id !== lessonRubric?.id)
        );
      }
      toggleModal();
    } catch {
      setMessages({
        measurementError: '',
        serverError: GeneralInformationDict[userLanguage]['MESSAGES']['DELETEERR'],
        addSuccess: ''
      });
    }
  };

  const handleSelectMeasurement = (val: string, name: string, id: string) => {
    setSelectedMeasurement({id, name, value: val});
  };

  return (
    <div className="p-6 border-gray-400 my-4">
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
          <div className="my-12">
            <div className="w-6/10 m-auto flex items-center justify-center">
              <div className="mr-4">
                <Selector
                  selectedItem={selectedMeasurement.name}
                  list={measurementOptions}
                  placeholder={AddNewLessonFormDict[userLanguage]['SELECTMEASURE']}
                  onChange={handleSelectMeasurement}
                />
              </div>
              <div className="ml-4 w-auto">
                <Buttons
                  btnClass="ml-4 py-1"
                  label="Add"
                  onClick={addNewMeasurement}
                  disabled={saving || !measurementOptions.length}
                />
              </div>
            </div>
            {messages.measurementError && (
              <p className={'w-6/10 m-auto text-red-600'}>{messages.measurementError}</p>
            )}
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
                          <FaTrash className="text-red-700" size={'1rem'} />
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
        </>
      )}
      {(messages.serverError || messages.addSuccess) && (
        <div className="py-2 m-auto mt-2 text-center">
          <p className={`${messages.serverError ? 'text-red-600' : 'text-green-600'}`}>
            {messages.serverError || messages.addSuccess}
          </p>
        </div>
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
