import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {message} from 'antd';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import {createTopic, updateTopic} from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {getCSequences} from 'graphql/queries';
import {useEffect, useState} from 'react';
interface AddTopicProps {
  curricularId: string;
  onCancel?: () => void;
  postMutation: (data: any) => void;
  topicData: any;
}

const AddTopic = (props: AddTopicProps) => {
  const {curricularId, onCancel, postMutation, topicData} = props;

  const {userLanguage} = useGlobalContext();
  const {AddTopicDict} = useDictionary();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [learning] = useState({id: '', name: '', value: ''});
  const [validation, setValidation] = useState({name: '', learning: ''});

  const [_, setTopicIds] = useState<any[]>([]);
  const [evalution, setEvalution] = useState({
    distinguished: '',
    excelled: '',
    adequite: '',
    basic: ''
  });

  useEffect(() => {
    if (topicData?.id) {
      setName(topicData.name);
      setDescription(topicData.description);
      setEvalution({
        distinguished: topicData.distinguished,
        excelled: topicData.excelled,
        adequite: topicData.adequite,
        basic: topicData.basic
      });
    }
  }, [topicData?.id]);

  const onInputChange = (e: any) => {
    if (e.target.name === 'name') {
      const value = e.target.value;
      setName(value);
      if (value.length && validation.name) setValidation({...validation, name: ''});
    } else if (e.target.name === 'description') setDescription(e.target.value);
    else {
      setEvalution({
        ...evalution,
        [e.target.name]: e.target.value
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!name.length) {
      isValid = false;
      msgs.name = AddTopicDict[userLanguage]['messages']['namerequired'];
    } else {
      msgs.name = '';
    }

    setValidation({...msgs});
    return isValid;
  };

  const saveTopicDetails = async () => {
    const isValid = validateForm();
    if (isValid) {
      setLoading(true);
      const input = {
        name,
        description,
        distinguished,
        excelled,
        adequite,
        basic,
        curriculumID: curricularId,
        learningObjectiveID: topicData.learningObjectiveID
      };
      try {
        if (topicData?.id) {
          const item: any = await API.graphql(
            graphqlOperation(updateTopic, {
              input: {...input, id: topicData.id}
            })
          );
          const updatedItem = item.data.updateTopic;
          if (updatedItem) {
            postMutation(updatedItem);
            messageApi.success('Topic updated successfully');
          } else {
            setLoading(false);
          }
        } else {
          const item: any = await API.graphql(graphqlOperation(createTopic, {input}));
          const addedItem = item.data.createTopic;
          if (addedItem) {
            postMutation(addedItem);
            messageApi.success('Topic added successfully');
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        messageApi.error("Couldn't add topic");
        console.error(error);
      }
    }
    console.error('Could not add topic');
    messageApi.error("Couldn't add topic");
  };

  const fetchTopicsSequence = async (leraningID: string) => {
    let seq: any = await API.graphql(
      graphqlOperation(getCSequences, {id: `t_${leraningID}`})
    );
    seq = seq?.data?.getCSequences?.sequence || [];
    setTopicIds(seq);
  };

  useEffect(() => {
    if (learning?.id) {
      fetchTopicsSequence(learning?.id);
    }
  }, [learning.id]);

  const {distinguished, excelled, adequite, basic} = evalution;
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="">
      {contextHolder}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormInput
            value={name}
            id="name"
            onChange={onInputChange}
            name="name"
            label={AddTopicDict[userLanguage]['topicname']}
            isRequired
            maxLength={30}
            error={validation.name}
            showCharacterUsage
          />
        </div>

        <div className="">
          <FormInput
            textarea
            rows={5}
            id="description"
            value={description}
            onChange={onInputChange}
            name="description"
            label={AddTopicDict[userLanguage]['description']}
          />
        </div>

        <div className="">
          <FormInput
            textarea
            rows={5}
            id="distinguished"
            value={distinguished}
            onChange={onInputChange}
            name="distinguished"
            label="Distinguished"
          />
        </div>
        <div className="">
          <FormInput
            id="excelled"
            value={excelled}
            textarea
            rows={5}
            onChange={onInputChange}
            name="excelled"
            label="Excelled"
          />
        </div>
        <div className="">
          <FormInput
            textarea
            rows={5}
            id="adequite"
            value={adequite}
            onChange={onInputChange}
            name="adequite"
            label="Adequate"
          />
        </div>
        <div className="">
          <FormInput
            id="basic"
            textarea
            rows={5}
            value={basic}
            onChange={onInputChange}
            name="basic"
            label="Basic"
          />
        </div>
      </div>

      <div className="flex my-8 gap-4 justify-center">
        <Buttons
          label={AddTopicDict[userLanguage]['button']['cancel']}
          onClick={onCancel}
          transparent
        />
        <Buttons
          label={AddTopicDict[userLanguage]['button']['save']}
          onClick={saveTopicDetails}
          disabled={loading}
        />
      </div>
      {/* </PageWrapper> */}
    </div>
  );
};

export default AddTopic;
