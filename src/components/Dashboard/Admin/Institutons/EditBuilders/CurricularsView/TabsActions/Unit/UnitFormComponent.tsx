import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useParams} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';

import Buttons from '../../../../../../../Atoms/Buttons';
import FormInput from '../../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../../Atoms/Form/TextArea';
import MultipleSelector from '../../../../../../../Atoms/Form/MultipleSelector';

import {languageList} from '../../../../../../../../utilities/staticData';
import * as mutations from '../../../../../../../../graphql/mutations';
import * as customQueries from '../../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../../customGraphql/customMutations';
import {GlobalContext} from '../../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../../customHooks/dictionary';
import {getAsset} from '../../../../../../../../assets';

interface AddSyllabusProps {
  syllabusDetails: any;
  postAddSyllabus: (syllabusId: string) => void;
  onCancel: () => void;
}
interface InitialData {
  name: string;
  description: string;
  methodology: string;
  policies: string;
  purpose: string;
  objectives: string;
  languages: {id: string; name: string; value: string}[];
}

const UnitFormComponent = ({
  onCancel,
  postAddSyllabus,
  syllabusDetails,
}: AddSyllabusProps) => {
  const urlParams: any = useParams();
  const curricularId = urlParams.curricularId;
  const initialData = {
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    languages: [{id: '1', name: 'English', value: 'EN'}],
  };
  const [syllabusData, setSyllabusData] = useState<InitialData>(initialData);
  const [syllabusIds, setSyllabusIds] = useState([]);
  const [universalSyllabusSeq, setUniversalSyllabusSeq] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {AddSyllabusDict} = useDictionary(clientKey);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const params = useQuery();

  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false,
  });

  useEffect(() => {
    if (syllabusDetails?.id) {
      setSyllabusData({
        ...syllabusDetails,
        name: syllabusDetails.name,
        languages: languageList.filter((item) =>
          syllabusDetails.languages.includes(item.value)
        ),
        description: syllabusDetails.description,
        objectives: syllabusDetails.objectives,
        purpose: syllabusDetails.pupose,
        methodology: syllabusDetails.methodology,
        policies: syllabusDetails.policies,
      });
    }
  }, [syllabusDetails]);

  const onInputChange = (e: any) => {
    setSyllabusData({
      ...syllabusData,
      [e.target.name]: e.target.value,
    });
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false,
      });
    }
  };

  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = syllabusData.languages;
    const selectedItem = currentLanguages.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, {id, name, value}];
    } else {
      updatedList = currentLanguages.filter((item) => item.id !== id);
    }
    setSyllabusData({
      ...syllabusData,
      languages: updatedList,
    });
  };

  const fetchSyllabusSequence = async () => {
    let result: any = await API.graphql(
      graphqlOperation(customQueries.getCurriculumUniversalSyllabusSequence, {
        id: `${curricularId}`,
      })
    );
    setUniversalSyllabusSeq(result?.data.getCurriculum?.universalSyllabusSeq || []);
  };

  const saveSyllabusDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = syllabusData.languages.map(
          (item: {value: string}) => item.value
        );
        const input: any = {
          name: syllabusData.name,
          curriculumID: curricularId,
          description: syllabusData.description,
          methodology: syllabusData.methodology,
          policies: syllabusData.policies,
          pupose: syllabusData.purpose,
          objectives: syllabusData.objectives,
          languages: languagesCode,
          universalLessonsSeq: [],
        };
        if (syllabusDetails?.id) {
          await API.graphql(
            graphqlOperation(mutations.updateUniversalSyllabus, {
              input: {...input, id: syllabusDetails?.id},
            })
          );
          setMessages({
            show: true,
            message: AddSyllabusDict[userLanguage]['messages']['unitupdate'],
            isError: false,
          });
          setIsLoading(false);
        } else {
          const newSyllabus: any = await API.graphql(
            graphqlOperation(mutations.createUniversalSyllabus, {input})
          );
          const newItem = newSyllabus.data.createUniversalSyllabus;
          // replace this with custom mutation updateCurriculumSyllabusSequence
          await API.graphql(
            graphqlOperation(customMutations.updateCurriculumSyllabusSequence, {
              input: {
                id: curricularId,
                universalSyllabusSeq: [...universalSyllabusSeq, newItem.id],
              },
            })
          );
          if (newItem) {
            postAddSyllabus(newItem.id);
          } else {
            console.log('Could not add unit');
          }
        }
      } catch {
        setMessages({
          show: true,
          message: AddSyllabusDict[userLanguage]['messages']['unablesave'],
          isError: true,
        });
      }
    }
  };

  const validateForm = async () => {
    if (syllabusData.name.trim() === '') {
      setMessages({
        show: true,
        message: AddSyllabusDict[userLanguage]['messages']['namerequired'],
        isError: true,
      });
      return false;
    }
    // TODO: Need to confirm that syllabus name should be uniq or not?

    // else if (syllabusData.name.trim() !== '') {
    //   const isUniq = await checkUniqSyllabusName()
    //   if (!isUniq) {
    //     setMessages({
    //       show: true,
    //       message: 'This syllabus name is already exist, please add another name.',
    //       isError: true
    //     })
    //     return false;
    //   } else {
    //     return true
    //   }
    // }
    else {
      return true;
    }
  };

  useEffect(() => {
    // fetchPersonsList();
    fetchSyllabusSequence();
  }, []);

  const {
    name,
    languages,
    description,
    purpose,
    objectives,
    methodology,
    policies,
  } = syllabusData;

  return (
    <div className="bg-white shadow-5 overflow-hidden mb-4">
      <div className={`border-b-0 p-4 pl-2 ${theme.borderColor[themeColor]} mt-6`}>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {AddSyllabusDict[userLanguage]['heading']}
        </h3>
      </div>
      <div className="m-auto">
        <div className="px-4">
          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <FormInput
                value={name}
                id="name"
                onChange={onInputChange}
                name="name"
                label={AddSyllabusDict[userLanguage]['unitname']}
                isRequired
              />
            </div>
            {/* <div>
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {AddSyllabusDict[userLanguage]['designer']}
                </label>
                <MultipleSelector
                  selectedItems={selectedDesigners}
                  placeholder={AddSyllabusDict[userLanguage]['placeholder']}
                  list={designersList}
                  onChange={selectDesigner}
                />
              </div> */}
            <div>
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                {AddSyllabusDict[userLanguage]['language']}
              </label>
              <MultipleSelector
                selectedItems={languages}
                placeholder={AddSyllabusDict[userLanguage]['placeholderlanguage']}
                list={languageList}
                onChange={selectLanguage}
              />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <TextArea
                value={description}
                rows={5}
                id="description"
                onChange={onInputChange}
                name="description"
                label={AddSyllabusDict[userLanguage]['description']}
              />
            </div>
            <div>
              <TextArea
                value={purpose}
                rows={5}
                id="purpose"
                onChange={onInputChange}
                name="purpose"
                label={AddSyllabusDict[userLanguage]['purpose']}
              />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <TextArea
                value={objectives}
                rows={5}
                id="objectives"
                onChange={onInputChange}
                name="objectives"
                label={AddSyllabusDict[userLanguage]['objective']}
              />
            </div>
            <div>
              <TextArea
                value={methodology}
                rows={5}
                id="methodology"
                onChange={onInputChange}
                name="methodology"
                label={AddSyllabusDict[userLanguage]['methodology']}
              />
            </div>
          </div>
          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <TextArea
                value={policies}
                rows={5}
                id="policies"
                onChange={onInputChange}
                name="policies"
                label={AddSyllabusDict[userLanguage]['policy']}
              />
            </div>
          </div>
        </div>
      </div>
      {messages.show ? (
        <div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
            {messages.message && messages.message}
          </p>
        </div>
      ) : null}
      <div className="flex my-8 justify-center">
        <Buttons
          btnClass="py-3 px-10 text-sm mr-4"
          label="Cancel"
          onClick={onCancel}
          transparent
        />
        <Buttons
          btnClass="py-3 px-10"
          label={
            loading
              ? AddSyllabusDict[userLanguage]['saving']
              : AddSyllabusDict[userLanguage]['save']
          }
          onClick={saveSyllabusDetails}
          disabled={loading ? true : false}
        />
      </div>
    </div>
  );
};

export default UnitFormComponent;
