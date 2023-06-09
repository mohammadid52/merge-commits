import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {message} from 'antd';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import {updateRubric, createRubric} from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {useEffect, useState} from 'react';

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

  const {userLanguage} = useGlobalContext();

  const {AddMeasurementDict} = useDictionary();

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

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!name.length) {
      isValid = false;
      msgs.name = AddMeasurementDict[userLanguage]['messages']['namerequired'];
    } else {
      msgs.name = '';
    }

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
      try {
        if (rubricData?.id) {
          const item: any = await API.graphql(
            graphqlOperation(updateRubric, {
              input: {...input, id: rubricData?.id}
            })
          );
          const updatedItem = item.data.updateRubric;
          if (updatedItem) {
            postMutation(updatedItem);
            messageApi.success('Successfully updated measurement');
          } else {
            setLoading(false);
          }
        } else {
          const item: any = await API.graphql(graphqlOperation(createRubric, {input}));
          const addedItem = item.data.createRubric;
          if (addedItem) {
            postMutation(addedItem);
            messageApi.success('Successfully added measurement');
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        setLoading(false);
        messageApi.error('Something went wrong');
      }
    }
  };

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="">
      {contextHolder}
      <div className="w-full m-auto">
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            id="name"
            value={name}
            onChange={onInputChange}
            error={validation.name}
            name="name"
            label={AddMeasurementDict[userLanguage]['mlabel']}
            isRequired
          />

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
      <div className="flex my-8 gap-4 justify-center">
        <Buttons
          label={AddMeasurementDict[userLanguage]['button']['cancel']}
          onClick={onCancel}
          transparent
        />
        <Buttons
          label={AddMeasurementDict[userLanguage]['button']['save']}
          onClick={saveMeasurementDetails}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default AddMeasurement;
