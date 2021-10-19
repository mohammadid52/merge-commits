import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useParams} from 'react-router';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';

import BreadCrums from '../../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../Atoms/Form/TextArea';

import * as queries from '../../../../../../../graphql/queries';
import * as mutations from '../../../../../../../graphql/mutations';
import * as customMutations from '../../../../../../../customGraphql/customMutations';
import useDictionary from '../../../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
interface AddMeasurementProps {
  curricularId: string;
  onCancel?: () => void;
  postMutation: (data: any) => void;
  rubricData: any;
  topicId: string;
}

const AddMeasurement = (props: AddMeasurementProps) => {
  const {curricularId, onCancel, postMutation, rubricData, topicId} = props;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [criteria, setCriteria] = useState('');
  const [topic, setTopic] = useState({id: '', name: '', value: ''});
  const [validation, setValidation] = useState({name: '', topic: ''});
  const [measurementIds, setMeasurementIds] = useState([]);
  const {clientKey, userLanguage, theme} = useContext(GlobalContext);

  const {AddMeasurementDict} = useDictionary(clientKey);

  useEffect(() => {
    if (rubricData?.id) {
      setName(rubricData.name);
      setCriteria(rubricData.criteria);
    }
  }, [rubricData?.id]);

  const onInputChange = (e: any) => {
    const value = e.target.value;
    if (e.target.name === 'name') {
      setName(value);
      if (value.length && validation.name) setValidation({...validation, name: ''});
    }
    if (e.target.name === 'criteria') setCriteria(value);
  };

  // const fetchMeasurementSequence = async (topicId: string) => {
  //   let item: any = await API.graphql(graphqlOperation(queries.getCSequences,
  //     { id: `m_${topicId}` }))
  //   item = item?.data.getCSequences?.sequence || []
  //   if (item) {
  //     setMeasurementIds(item)
  //   }
  // }

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!name.length) {
      isValid = false;
      msgs.name = AddMeasurementDict[userLanguage]['messages']['namerequired'];
    } else {
      msgs.name = '';
    }
    // if (!topic.id) {
    //   isValid = false;
    //   msgs.topic = AddMeasurementDict[userLanguage]['messages']['topicrequired'];
    // } else {
    //   msgs.topic = ''
    // }
    setValidation({...msgs});
    return isValid;
  };

  const saveMeasurementDetails = async () => {
    const isValid = validateForm();
    if (isValid) {
      setLoading(true);
      const input = {
        name,
        topicID: topicId,
        criteria,
        curriculumID: curricularId,
      };
      if (rubricData?.id) {
        const item: any = await API.graphql(
          graphqlOperation(customMutations.updateRubric, {
            input: {...input, id: rubricData?.id},
          })
        );
        const updatedItem = item.data.updateRubric;
        if (updatedItem) {
          postMutation(updatedItem);
        } else {
          setLoading(false);
        }
      } else {
        const item: any = await API.graphql(
          graphqlOperation(customMutations.createRubric, {input})
        );
        const addedItem = item.data.createRubric;
        if (addedItem) {
          postMutation(addedItem);
        } else {
          setLoading(false);
        }
      }
      // if (!measurementIds.length) {
      //   let seqItem: any = await API.graphql(graphqlOperation(mutations.createCSequences, { input: { id: `m_${topic.id}`, sequence: [addedItem.id] } }));
      //   seqItem = seqItem.data.createCSequences
      //   console.log('seqItem', seqItem)
      // } else {
      //   let seqItem: any = await API.graphql(graphqlOperation(mutations.updateCSequences, { input: { id: `m_${topic.id}`, sequence: [...measurementIds, addedItem.id] } }));
      //   seqItem = seqItem.data.updateCSequences
      //   console.log('seqItem', seqItem)
      // }
      // if (addedItem) {
      //   postMutation(addedItem);
      // } else {
      //   console.log('Could not add measurement');
      // }
    }
  };

  // useEffect(() => {
  //   if (topic?.id) {
  //     fetchMeasurementSequence(topic.id)
  //   }
  // }, [topic.id])

  return (
    <div className="min-w-172">
      {/* Section Header
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title={AddMeasurementDict[userLanguage]['title']} subtitle={AddMeasurementDict[userLanguage]['subtitle']} />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      {/* <PageWrapper> */}
      <div className="w-full m-auto">
        <div className="">
          <div className="px-3 py-4">
            <FormInput
              id="name"
              value={name}
              onChange={onInputChange}
              name="name"
              label={AddMeasurementDict[userLanguage]['mlabel']}
              isRequired
            />
            {validation.name && <p className="text-red-600">{validation.name}</p>}
          </div>
          {/* <div className="px-3 py-4">
              <div>
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {AddMeasurementDict[userLanguage]['selecttopic']} <span className="text-red-500">*</span>
                </label>
                <Selector selectedItem={topic.value} placeholder={AddMeasurementDict[userLanguage]['topic']} list={topics} onChange={selectTopic} />
                {
                  validation.topic && <p className="text-red-600">{validation.topic}</p>
                }
              </div>
            </div> */}

          <div className="px-3 py-4">
            <TextArea
              rows={3}
              id="criteria"
              value={criteria}
              onChange={onInputChange}
              name="criteria"
              label={AddMeasurementDict[userLanguage]['criterialabel']}
            />
          </div>
        </div>
      </div>
      <div className="flex my-8 justify-center">
        <Buttons
          btnClass="py-3 px-10 mr-4"
          label={AddMeasurementDict[userLanguage]['button']['cancel']}
          onClick={onCancel}
          transparent
        />
        <Buttons
          btnClass="py-3 px-10 ml-4"
          label={AddMeasurementDict[userLanguage]['button']['save']}
          onClick={saveMeasurementDetails}
          disabled={loading}
        />
      </div>
      {/* </PageWrapper> */}
    </div>
  );
};

export default AddMeasurement;
