import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import TextArea from 'atoms/Form/TextArea';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import React, {useContext, useEffect, useState} from 'react';

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

  const [validation, setValidation] = useState({name: '', topic: ''});

  const {clientKey, userLanguage} = useContext(GlobalContext);

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
        curriculumID: curricularId
      };
      if (rubricData?.id) {
        const item: any = await API.graphql(
          graphqlOperation(customMutations.updateRubric, {
            input: {...input, id: rubricData?.id}
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
    }
  };

  return (
    <div className="lg:min-w-132">
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

          <div className="px-3 py-4">
            <FormInput
              textarea
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
    </div>
  );
};

export default AddMeasurement;
