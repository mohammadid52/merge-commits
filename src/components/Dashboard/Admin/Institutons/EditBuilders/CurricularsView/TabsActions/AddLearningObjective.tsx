import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {message} from 'antd';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {
  updateLearningObjective,
  createLearningObjective,
  createCSequences,
  updateCSequences
} from 'graphql/mutations';
import {getCSequences} from 'graphql/queries';
import {useEffect, useState} from 'react';

interface AddLearningObjectiveProps {
  curricularId: string;
  learningObjectiveData: any;
  handleCancel: () => void;
  postMutation: (data: any) => void;
}

const AddLearningObjective = (props: AddLearningObjectiveProps) => {
  const {curricularId, handleCancel, learningObjectiveData, postMutation} = props;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState({isValid: true, msg: ''});
  const [learningsIds, setLearningsIds] = useState<any[]>([]);
  const {userLanguage} = useGlobalContext();
  const {ADDLEARINGOBJDICT} = useDictionary();

  useEffect(() => {
    if (learningObjectiveData?.id) {
      setName(learningObjectiveData.name);
      setDescription(learningObjectiveData.description);
    }
  }, [learningObjectiveData?.id]);

  const onInputChange = (e: any) => {
    if (e.target.name === 'name') {
      const value = e.target.value;
      setName(value);
      if (!validation.isValid && value.length) setValidation({isValid: true, msg: ''});
    }
    if (e.target.name === 'description') setDescription(e.target.value);
  };

  const saveLearningObjectiveDetails = async () => {
    if (!name.length) {
      setValidation({
        isValid: false,
        msg: ADDLEARINGOBJDICT[userLanguage]['VALIDATION']
      });
      return;
    }
    setValidation({isValid: true, msg: ''});
    const input = {
      name,
      description,
      curriculumID: curricularId
    };
    setLoading(true);
    try {
      if (learningObjectiveData?.id) {
        const item: any = await API.graphql(
          graphqlOperation(updateLearningObjective, {
            input: {
              ...input,
              id: learningObjectiveData?.id
            }
          })
        );
        postMutation(item.data?.updateLearningObjective);
        messageApi.success('Learning Objective updated successfully');
      } else {
        const item: any = await API.graphql(
          graphqlOperation(createLearningObjective, {input})
        );
        const addedItem = item.data.createLearningObjective;

        setName('');
        setDescription('');

        if (!learningsIds.length) {
          let seqItem: any = await API.graphql(
            graphqlOperation(createCSequences, {
              input: {id: `l_${curricularId}`, sequence: [addedItem.id]}
            })
          );
          seqItem = seqItem.data.createCSequences;
          console.log('seqItem', seqItem);
        } else {
          let seqItem: any = await API.graphql(
            graphqlOperation(updateCSequences, {
              input: {
                id: `l_${curricularId}`,
                sequence: [...learningsIds, addedItem.id]
              }
            })
          );
          seqItem = seqItem.data.updateCSequences;
          console.log('seqItem', seqItem);
        }
        if (addedItem) {
          postMutation(addedItem);
          messageApi.success('Learning Objective added successfully');
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      messageApi.error('Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLOSequence = async () => {
    let item: any = await API.graphql(
      graphqlOperation(getCSequences, {id: `l_${curricularId}`})
    );
    item = item?.data.getCSequences?.sequence || [];
    if (item) {
      setLearningsIds(item);
    }
  };

  useEffect(() => {
    fetchLOSequence();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="">
      {contextHolder}
      <div className="grid w-full grid-cols-1 gap-4">
        <FormInput
          value={name}
          id="name"
          onChange={onInputChange}
          name="name"
          label={ADDLEARINGOBJDICT[userLanguage]['NAME']}
          isRequired
          maxLength={30}
          error={validation.msg}
          showCharacterUsage
        />

        <FormInput
          textarea
          id="description"
          value={description}
          rows={5}
          onChange={onInputChange}
          name="description"
          label={ADDLEARINGOBJDICT[userLanguage]['DESC']}
        />
      </div>
      <div className="flex my-4 gap-4 justify-end">
        <Buttons label={'Cancel'} onClick={handleCancel} transparent />
        <Buttons
          label={ADDLEARINGOBJDICT[userLanguage]['SAVE']}
          onClick={saveLearningObjectiveDetails}
          disabled={loading}
        />
      </div>
      {/* </PageWrapper> */}
    </div>
  );
};

export default AddLearningObjective;
