import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useParams} from 'react-router';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import API, {graphqlOperation} from '@aws-amplify/api';

import BreadCrums from '../../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../Atoms/Form/TextArea';

import * as queries from '../../../../../../../graphql/queries';
import * as mutations from '../../../../../../../graphql/mutations';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../customHooks/dictionary';
interface AddLearningObjectiveProps {
  curricularId: string;
  learningObjectiveData: any;
  handleCancel: () => void;
  postMutation: (data: any) => void;
}

const AddLearningObjective = (props: AddLearningObjectiveProps) => {
  const {curricularId, handleCancel, learningObjectiveData, postMutation} = props;
  const history = useHistory();
  const urlParams: any = useParams();
  // const curricularId = urlParams.curricularId;
  // const institutionId = urlParams.institutionId;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validation, setValidation] = useState({isValid: true, msg: ''});
  const [learningsIds, setLearningsIds] = useState([]);
  const {clientKey, userLanguage, theme} = useContext(GlobalContext);
  const {ADDLEARINGOBJDICT, BreadcrumsTitles} = useDictionary(clientKey);

  // const breadCrumsList = [
  //   {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
  //   {
  //     title: BreadcrumsTitles[userLanguage]['CURRICULUMBUILDER'],
  //     url: `/dashboard/manage-institutions/${institutionId}/curricular?id=${curricularId}`,
  //     last: false,
  //   },
  //   {
  //     title: BreadcrumsTitles[userLanguage]['LEARINGOBJECTIVE'],
  //     url: `/dashboard/manage-institutions/curricular/${curricularId}/learning-objective/add`,
  //     last: true,
  //   },
  // ];

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
      setValidation({isValid: false, msg: ADDLEARINGOBJDICT[userLanguage]['VALIDATION']});
      return;
    }
    setValidation({isValid: true, msg: ''});
    const input = {
      name,
      description,
      curriculumID: curricularId,
    };
    setLoading(true);
    if (learningObjectiveData?.id) {
      const item: any = await API.graphql(
        graphqlOperation(mutations.updateLearningObjective, {
          input: {
            ...input,
            id: learningObjectiveData?.id,
          },
        })
      );
      postMutation(item.data?.updateLearningObjective);
    } else {
      const item: any = await API.graphql(
        graphqlOperation(mutations.createLearningObjective, {input})
      );
      const addedItem = item.data.createLearningObjective;
      if (!learningsIds.length) {
        let seqItem: any = await API.graphql(
          graphqlOperation(mutations.createCSequences, {
            input: {id: `l_${curricularId}`, sequence: [addedItem.id]},
          })
        );
        seqItem = seqItem.data.createCSequences;
        console.log('seqItem', seqItem);
      } else {
        let seqItem: any = await API.graphql(
          graphqlOperation(mutations.updateCSequences, {
            input: {id: `l_${curricularId}`, sequence: [...learningsIds, addedItem.id]},
          })
        );
        seqItem = seqItem.data.updateCSequences;
        console.log('seqItem', seqItem);
      }
      if (addedItem) {
        postMutation(addedItem);
      }else{
        setLoading(false)
      }
    }
    // if (addedItem) {
    //   history.goBack();
    // } else {
    //   console.log('Could not add learning objective');
    // }
  };

  const fetchLOSequence = async () => {
    let item: any = await API.graphql(
      graphqlOperation(queries.getCSequences, {id: `l_${curricularId}`})
    );
    item = item?.data.getCSequences?.sequence || [];
    if (item) {
      setLearningsIds(item);
    }
  };

  useEffect(() => {
    fetchLOSequence();
  }, []);

  return (
    <div>
      {/* Section Header */}
      {/* <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={ADDLEARINGOBJDICT[userLanguage]['TITLE']}
          subtitle={ADDLEARINGOBJDICT[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div> */}

      {/* Body section */}
      {/* <PageWrapper> */}
      <div className="w-full m-auto">
        {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {ADDLEARINGOBJDICT[userLanguage]['HEADING']}
          </h3> */}
        <div className="">
          <div className="px-3 py-4">
            <FormInput
              value={name}
              id="name"
              onChange={onInputChange}
              name="name"
              label={ADDLEARINGOBJDICT[userLanguage]['NAME']}
              isRequired
              maxLength={30}
              showCharacterUsage
            />
            {!validation.isValid ? (
              <p className="text-red-600">{validation.msg}</p>
            ) : null}
          </div>

          {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Select Sequence
              </label>
              <Selector placeholder="Sequence" list={sequenceList} onChange={() => console.log('')} />
            </div> */}

          <div className="px-3 py-4">
            <TextArea
              id="description"
              value={description}
              onChange={onInputChange}
              name="description"
              label={ADDLEARINGOBJDICT[userLanguage]['DESC']}
            />
          </div>
        </div>
      </div>
      <div className="flex my-4 justify-center">
        <Buttons
          btnClass="py-3 px-10 mr-2"
          label={'Cancel'}
          onClick={handleCancel}
          transparent
        />
        <Buttons
          btnClass="py-3 px-10"
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
