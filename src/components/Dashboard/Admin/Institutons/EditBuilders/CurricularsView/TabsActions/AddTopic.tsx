import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import API, {graphqlOperation} from '@aws-amplify/api';
import BreadCrums from '../../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../Atoms/Form/TextArea';
import Selector from '../../../../../../Atoms/Form/Selector';
import * as queries from '../../../../../../../graphql/queries';
import * as mutations from '../../../../../../../graphql/mutations';
import * as customMutations from '../../../../../../../customGraphql/customMutations';
import useDictionary from '../../../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
interface AddTopicProps {
  curricularId: string;
  onCancel?: () => void;
  postMutation: (data: any) => void;
  topicData: any;
}

const AddTopic = (props: AddTopicProps) => {
  const {curricularId, onCancel, postMutation, topicData} = props;

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const urlGetParams: any = useQuery();
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {AddTopicDict, BreadcrumsTitles} = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [learning, setLearning] = useState({id: '', name: '', value: ''});
  const [validation, setValidation] = useState({name: '', learning: ''});
  const [learnings, setLearnings] = useState([]);
  const [topicIds, setTopicIds] = useState([]);
  const [evalution, setEvalution] = useState({
    distinguished: '',
    excelled: '',
    adequite: '',
    basic: '',
  });

  useEffect(() => {
    if (topicData?.id) {
      setName(topicData.name);
      setDescription(topicData.description);
      setEvalution({
        distinguished: topicData.distinguished,
        excelled: topicData.excelled,
        adequite: topicData.adequite,
        basic: topicData.basic,
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
        [e.target.name]: e.target.value,
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
    // if (!learning.id) {
    //   isValid = false;
    //   msgs.learning = AddTopicDict[userLanguage]['messages']['objectiverequired'];
    // } else {
    //   msgs.learning = '';
    // }
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
        learningObjectiveID: topicData.learningObjectiveID,
      };
      if (topicData?.id) {
        const item: any = await API.graphql(
          graphqlOperation(customMutations.updateTopic, {
            input: {...input, id: topicData.id},
          })
        );
        const updatedItem = item.data.updateTopic;
        if (updatedItem) {
          postMutation(updatedItem);
        }else{
          setLoading(false);
        }
      } else {
        const item: any = await API.graphql(
          graphqlOperation(customMutations.createTopic, {input})
        );
        const addedItem = item.data.createTopic;
        if (addedItem) {
          postMutation(addedItem);
        }else{
          setLoading(false);
        }
      }
      console.log('Could not add topic');
    }
  };

  const selectLearning = (val: string, name: string, id: string) => {
    if (validation.learning) {
      setValidation({...validation, learning: ''});
    }
    setLearning({id, name, value: val});
  };

  const fetchTopicsSequence = async (leraningID: string) => {
    let seq: any = await API.graphql(
      graphqlOperation(queries.getCSequences, {id: `t_${leraningID}`})
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

  return (
    <div className="min-w-256">
      {/* Section Header */}
      {/* <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title={AddTopicDict[userLanguage]['title']} subtitle={AddTopicDict[userLanguage]['subtitle']} />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div> */}

      {/* Body section */}
      {/* <PageWrapper> */}
      <div className="w-full m-auto">
        {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">{AddTopicDict[userLanguage]['heading']}</h3> */}
        <div className="grid grid-cols-2 gap-2">
          <div className="px-3 py-4">
            <FormInput
              value={name}
              id="name"
              onChange={onInputChange}
              name="name"
              label={AddTopicDict[userLanguage]['topicname']}
              isRequired
              maxLength={30}
              showCharacterUsage
            />
            {validation.name && <p className="text-red-600">{validation.name}</p>}
          </div>
          <div></div>

          {/* <div className="px-3 py-4">
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                {AddTopicDict[userLanguage]['learningobj']} <span className="text-red-500">*</span>
              </label>
              <Selector selectedItem={learning.value} placeholder={AddTopicDict[userLanguage]['learningobjpl']} list={learnings} onChange={selectLearning} />
              {
                validation.learning && <p className="text-red-600">{validation.learning}</p>
              }
            </div> */}

          <div className="px-3 py-4">
            <TextArea
              id="description"
              value={description}
              onChange={onInputChange}
              name="description"
              label={AddTopicDict[userLanguage]['description']}
            />
          </div>

          <div className="px-3 py-4">
            <TextArea
              id="distinguished"
              value={distinguished}
              onChange={onInputChange}
              name="distinguished"
              label="Distinguished"
            />
          </div>
          <div className="px-3 py-4">
            <TextArea
              id="excelled"
              value={excelled}
              onChange={onInputChange}
              name="excelled"
              label="Excelled"
            />
          </div>
          <div className="px-3 py-4">
            <TextArea
              id="adequite"
              value={adequite}
              onChange={onInputChange}
              name="adequite"
              label="Adequate"
            />
          </div>
          <div className="px-3 py-4">
            <TextArea
              id="basic"
              value={basic}
              onChange={onInputChange}
              name="basic"
              label="Basic"
            />
          </div>
        </div>
      </div>
      <div className="flex my-8 justify-center">
        <Buttons
          btnClass="py-3 px-10 mr-4"
          label={AddTopicDict[userLanguage]['button']['cancel']}
          onClick={onCancel}
          transparent
        />
        <Buttons
          btnClass="py-3 px-10 ml-4"
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
