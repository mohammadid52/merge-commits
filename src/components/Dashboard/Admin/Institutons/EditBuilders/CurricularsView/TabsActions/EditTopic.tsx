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
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as queries from 'graphql/queries';

const EditTopic = () => {
  const urlParams: any = useParams();
  const curricularId = urlParams.curricularId;
  const topicId = urlParams.id;

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState({
    id: topicId,
    name: '',
    description: '',
    distinguished: '',
    excelled: '',
    adequite: '',
    basic: '',
    curriculumID: curricularId,
    learning: {id: '', name: '', value: ''}
  });
  const [_, setLearnings] = useState<any[]>([]);
  const [validation, setValidation] = useState({name: '', learning: ''});
  const {userLanguage} = useGlobalContext();
  const {EditTopicDict, BreadcrumsTitles} = useDictionary();

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: topic?.learning?.value,
      href: `/dashboard/manage-institutions/:instituteID/curricular?id=${curricularId}`,
      last: false,
      goBack: true
    },
    {
      title: BreadcrumsTitles[userLanguage]['EditTopic'],
      href: `/dashboard/curricular/${curricularId}/topic/edit/${topicId}`,
      last: true
    }
  ];

  const onInputChange = (e: any) => {
    const value = e.target.value;
    if (e.target.name === 'name') {
      setTopic({...topic, name: value});
      if (value.length && validation.name) setValidation({...validation, name: ''});
    } else if (e.target.name === 'description') setTopic({...topic, description: value});
    else {
      setTopic({
        ...topic,
        [e.target.name]: e.target.value
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!topic.name.length) {
      isValid = false;
      msgs.name = EditTopicDict[userLanguage]['messages']['namerequired'];
    } else {
      msgs.name = '';
    }
    if (!topic.learning.id) {
      isValid = false;
      msgs.learning = EditTopicDict[userLanguage]['messages']['learningobj'];
    } else {
      msgs.learning = '';
    }
    setValidation({...msgs});
    return isValid;
  };

  const saveTopicDetails = async () => {
    const isValid = validateForm();
    if (isValid) {
      const input = {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        learningObjectiveID: topic.learning.id,
        distinguished: topic.distinguished,
        excelled: topic.excelled,
        adequite: topic.adequite,
        basic: topic.basic
      };
      const item: any = await API.graphql(
        graphqlOperation(customMutations.updateTopic, {input})
      );
      const updatedItem = item.data.updateTopic;
      if (updatedItem) {
        history.goBack();
      } else {
        console.error('Could not update topic');
      }
    }
  };

  const fetchTopic = async () => {
    setLoading(true);
    let item: any = await API.graphql(
      graphqlOperation(customQueries.getTopicDetails, {id: topicId})
    );
    item = item.data.getTopic;
    if (item.curriculumID === curricularId) {
      setTopic({
        ...topic,
        name: item.name,
        description: item.description,
        distinguished: item.distinguished,
        excelled: item.excelled,
        adequite: item.adequite,
        basic: item.basic,
        learning: {
          id: item.learningObjective?.id || '',
          name: item.learningObjective?.name || '',
          value: item.learningObjective?.name || ''
        }
      });
      setLoading(false);
    } else {
      console.error('wrong cr');
      setLoading(false);
    }
  };
  const fetchLearningObjectives = async () => {
    let list: any = await API.graphql(
      graphqlOperation(queries.listLearningObjectives, {
        filter: {curriculumID: {eq: curricularId}}
      })
    );
    list = list.data.listLearningObjectives?.items || [];
    list = list.map((item: any) => ({
      id: item.id,
      name: item.name,
      value: item.name
    }));
    setLearnings(list);
  };

  useEffect(() => {
    fetchLearningObjectives();
    fetchTopic();
  }, []);

  return (
    <div className="w-8/10 h-full mt-4 p-4">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitleV3
          title={EditTopicDict[userLanguage]['title']}
          subtitle={EditTopicDict[userLanguage]['subtitle']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            btnClass="mr-4"
            onClick={history.goBack}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {EditTopicDict[userLanguage]['heading']}
          </h3>
        </div>
        {!loading ? (
          <>
            <div className="w-6/10 m-auto">
              <div className="">
                <div className="px-3 py-4">
                  <FormInput
                    value={topic.name}
                    id="name"
                    onChange={onInputChange}
                    name="name"
                    label={EditTopicDict[userLanguage]['topicname']}
                    isRequired
                  />
                  {validation.name && <p className="text-red-600">{validation.name}</p>}
                </div>

                {/* <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {EditTopicDict[userLanguage]['selectlearning']} <span className="text-red-500">*</span>
                </label>
                <Selector selectedItem={topic.learning.value} placeholder={EditTopicDict[userLanguage]['learningobjective']} list={learnings} onChange={selectLearning} />
                {
                  validation.learning && <p className="text-red-600">{validation.learning}</p>
                }
              </div> */}

                {/* <div className="px-3 py-4">
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                Select Sequence
              </label>
              <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
            </div> */}

                <div className="px-3 py-4">
                  <TextArea
                    id="description"
                    value={topic.description}
                    onChange={onInputChange}
                    name="description"
                    label={EditTopicDict[userLanguage]['desc']}
                  />
                </div>

                <div className="px-3 py-4">
                  <TextArea
                    id="distinguished"
                    value={topic.distinguished}
                    onChange={onInputChange}
                    name="distinguished"
                    label={EditTopicDict[userLanguage]['Distinguished']}
                  />
                </div>
                <div className="px-3 py-4">
                  <TextArea
                    id="excelled"
                    value={topic.excelled}
                    onChange={onInputChange}
                    name="excelled"
                    label={EditTopicDict[userLanguage]['Excelled']}
                  />
                </div>
                <div className="px-3 py-4">
                  <TextArea
                    id="adequite"
                    value={topic.adequite}
                    onChange={onInputChange}
                    name="adequite"
                    label={EditTopicDict[userLanguage]['Adequate']}
                  />
                </div>
                <div className="px-3 py-4">
                  <TextArea
                    id="basic"
                    value={topic.basic}
                    onChange={onInputChange}
                    name="basic"
                    label={EditTopicDict[userLanguage]['Basic']}
                  />
                </div>
              </div>
            </div>
            <div className="flex my-8 justify-center">
              <Buttons
                btnClass="py-3 px-10 mr-4"
                label={EditTopicDict[userLanguage]['button']['cancel']}
                onClick={history.goBack}
                transparent
              />
              <Buttons
                btnClass="py-3 px-10 ml-4"
                label={EditTopicDict[userLanguage]['button']['save']}
                onClick={saveTopicDetails}
              />
            </div>
          </>
        ) : (
          <div className="py-12 my-12 m-auto text-center">
            {EditTopicDict[userLanguage]['fetching']}
          </div>
        )}
      </PageWrapper>
    </div>
  );
};

export default EditTopic;
