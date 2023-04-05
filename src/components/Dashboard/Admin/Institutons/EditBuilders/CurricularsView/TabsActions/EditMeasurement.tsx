import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import TextArea from 'atoms/Form/TextArea';
import PageWrapper from 'atoms/PageWrapper';
import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory, useParams} from 'react-router';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {useGlobalContext} from 'contexts/GlobalContext';
import {updateRubric} from 'customGraphql/customMutations';
import {getRubric} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';

const EditMeasurement = () => {
  const urlParams: any = useParams();
  const curricularId = urlParams.curricularId;
  const measurementId = urlParams.id;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({name: '', topic: ''});

  const {userLanguage} = useGlobalContext();
  const {EditMeasurementDict, BreadcrumsTitles} = useDictionary();
  const [measurement, setMeasurement] = useState({
    id: measurementId,
    name: '',
    curriculumID: curricularId,
    topic: {id: '', name: '', value: ''},
    criteria: ''
  });

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: measurement.topic.value,
      href: `/dashboard/manage-institutions/:instituteID/curricular?id=${curricularId}`,
      last: false,
      goBack: true
    },
    {
      title: BreadcrumsTitles[userLanguage]['EditMeasurement'],
      href: `/dashboard/curricular/${curricularId}/measurement/edit/${measurementId}'}`,
      last: true
    }
  ];

  const onInputChange = (e: any) => {
    const value = e.target.value;
    if (e.target.name === 'name') {
      setMeasurement({...measurement, name: value});
      if (value.length && validation.name) setValidation({...validation, name: ''});
    } else {
      setMeasurement({...measurement, [e.target.name]: value});
    }
  };

  const fetchMeasurement = async () => {
    setLoading(true);
    let item: any = await API.graphql(graphqlOperation(getRubric, {id: measurementId}));
    item = item.data.getRubric;
    if (item?.curriculumID === curricularId) {
      setMeasurement({
        ...measurement,
        name: item.name,
        topic: {
          id: item.topic.id,
          name: item.topic.name,
          value: item.topic.name
        },
        criteria: item.criteria
      });
      setLoading(false);
    } else {
      console.error('wrong cr');
      setLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!measurement.name.length) {
      isValid = false;
      msgs.name = EditMeasurementDict[userLanguage]['messages']['namerequierd'];
    } else {
      msgs.name = '';
    }
    if (!measurement.topic.id) {
      isValid = false;
      msgs.topic = EditMeasurementDict[userLanguage]['messages']['topicrequired'];
    } else {
      msgs.topic = '';
    }
    setValidation({...msgs});
    return isValid;
  };

  const saveMeasurementDetails = async () => {
    const isValid = validateForm();
    if (isValid) {
      const input = {
        id: measurement.id,
        name: measurement.name,
        criteria: measurement.criteria,
        topicID: measurement.topic.id,
        curriculumID: curricularId
      };
      const item: any = await API.graphql(graphqlOperation(updateRubric, {input}));
      const updatedItem = item.data.updateRubric;
      if (updatedItem) {
        history.goBack();
      } else {
        console.error('Could not update topic');
      }
    }
  };

  useEffect(() => {
    fetchMeasurement();
  }, []);

  return (
    <div className="w-8/10 h-full mt-4 p-4">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitleV3
          title={EditMeasurementDict[userLanguage]['title']}
          subtitle={EditMeasurementDict[userLanguage]['subtitle']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            onClick={history.goBack}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-darkest   text-center pb-8 ">
            {EditMeasurementDict[userLanguage]['heading']}
          </h3>
        </div>
        {!loading ? (
          <>
            <div className="w-6/10 m-auto">
              <div className="">
                <div className="px-3 py-4">
                  <FormInput
                    id="name"
                    value={measurement.name}
                    onChange={onInputChange}
                    name="name"
                    label={EditMeasurementDict[userLanguage]['labelmeasur']}
                    isRequired
                  />
                </div>
                {/* <div className="px-3 py-4">
                    <div>
                    <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                      Select Sequence
                    </label>
                    <Selector selectedItem={measurement.topic.value} placeholder="topic" list={topics} onChange={selectTopic} />
                  </div>
                    <div>
                      <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                        {EditMeasurementDict[userLanguage]['seltopic']}
                    </label>
                      <Selector selectedItem={measurement.topic.value} placeholder={EditMeasurementDict[userLanguage]['topic']} list={topics} onChange={selectTopic} />
                    </div>
                  </div> */}

                <div className="px-3 py-4">
                  <TextArea
                    rows={3}
                    id="criteria"
                    value={measurement.criteria}
                    onChange={onInputChange}
                    name="criteria"
                    label={EditMeasurementDict[userLanguage]['criteria']}
                  />
                </div>
              </div>
            </div>
            <div className="flex my-8 justify-center">
              <Buttons
                label={EditMeasurementDict[userLanguage]['button']['cancel']}
                onClick={history.goBack}
                transparent
              />
              <Buttons
                label={EditMeasurementDict[userLanguage]['button']['save']}
                onClick={saveMeasurementDetails}
              />
            </div>
          </>
        ) : (
          <div className="py-12 my-12 m-auto text-center">
            {EditMeasurementDict[userLanguage]['fetching']}
          </div>
        )}
      </PageWrapper>
    </div>
  );
};

export default EditMeasurement;
