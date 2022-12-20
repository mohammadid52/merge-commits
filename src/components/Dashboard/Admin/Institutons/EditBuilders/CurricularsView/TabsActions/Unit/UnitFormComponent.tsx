import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';

import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import {languageList} from 'utilities/staticData';

interface AddSyllabusProps {
  syllabusDetails?: any;
  postAddSyllabus: (syllabusId: string) => void;
  onCancel: () => void;
  instId: string;
  isInModal?: boolean;
}
interface InitialData {
  name: string;
  description: string;
  methodology: string;
  policies: string;
  purpose: string;
  priorities: string;
  objectives: string;
  languages: {id: string; name: string; value: string}[];
}

const UnitFormComponent = ({
  onCancel,
  postAddSyllabus,
  syllabusDetails,
  instId,
  isInModal = false
}: AddSyllabusProps) => {
  const initialData = {
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    priorities: '',
    languages: [{id: '1', name: 'English', value: 'EN'}]
  };
  const [syllabusData, setSyllabusData] = useState<InitialData>(initialData);

  const [loading, setIsLoading] = useState(false);
  const {clientKey, userLanguage} = useContext(GlobalContext);

  const {AddSyllabusDict} = useDictionary(clientKey);

  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
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
        purpose: syllabusDetails?.purpose,
        methodology: syllabusDetails?.methodology,
        policies: syllabusDetails?.policies,
        priorities: syllabusDetails?.priorities
      });
    }
  }, [syllabusDetails]);

  const onInputChange = (e: any) => {
    setSyllabusData({
      ...syllabusData,
      [e.target.name]: e.target.value
    });
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
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
      languages: updatedList
    });
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
          institutionID: instId,
          name: syllabusData.name,
          description: syllabusData.description,
          methodology: syllabusData.methodology,
          policies: syllabusData.policies,
          pupose: syllabusData.purpose,
          objectives: syllabusData.objectives,
          languages: languagesCode,
          universalLessonsSeq: [],
          priorities: syllabusData?.priorities
        };
        if (syllabusDetails?.id) {
          await API.graphql(
            graphqlOperation(mutations.updateUniversalSyllabus, {
              input: {...input, id: syllabusDetails?.id}
            })
          );
          setMessages({
            show: true,
            message: AddSyllabusDict[userLanguage]['messages']['unitupdate'],
            isError: false
          });
          setIsLoading(false);
        } else {
          const newSyllabus: any = await API.graphql(
            graphqlOperation(mutations.createUniversalSyllabus, {input})
          );
          const newItem = newSyllabus.data.createUniversalSyllabus;

          if (newItem) {
            postAddSyllabus(newItem.id);
          } else {
            console.error('Could not add unit');
          }
        }
      } catch {
        setMessages({
          show: true,
          message: AddSyllabusDict[userLanguage]['messages']['unablesave'],
          isError: true
        });
      }
    }
  };

  const validateForm = async () => {
    if (syllabusData.name.trim() === '') {
      setMessages({
        show: true,
        message: AddSyllabusDict[userLanguage]['messages']['namerequired'],
        isError: true
      });
      return false;
    }
    // TODO: Need to confirm that syllabus name should be uniq or not?
    else {
      return true;
    }
  };

  const {name, languages, description, purpose, priorities, objectives} = syllabusData;

  return (
    <div className={`overflow-hidden mb-4`}>
      <div className="m-auto">
        <div className="py-4 px-2">
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

            <div>
              <MultipleSelector
                label={AddSyllabusDict[userLanguage]['language']}
                selectedItems={languages}
                placeholder={AddSyllabusDict[userLanguage]['placeholderlanguage']}
                list={languageList}
                onChange={selectLanguage}
              />
            </div>
          </div>

          <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
            <div>
              <FormInput
                value={description}
                rows={5}
                textarea
                id="description"
                onChange={onInputChange}
                name="description"
                label={AddSyllabusDict[userLanguage]['description']}
              />
            </div>
            <div>
              <FormInput
                value={purpose}
                textarea
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
              <FormInput
                value={priorities}
                textarea
                rows={5}
                id="priorities"
                onChange={onInputChange}
                name="priorities"
                label={AddSyllabusDict[userLanguage]['priority']}
              />
            </div>
            <div>
              <FormInput
                value={objectives}
                textarea
                rows={5}
                id="objectives"
                onChange={onInputChange}
                name="objectives"
                label={AddSyllabusDict[userLanguage]['objective']}
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
          label={AddSyllabusDict[userLanguage][loading ? 'saving' : 'save']}
          onClick={saveSyllabusDetails}
          disabled={loading ? true : false}
        />
      </div>
    </div>
  );
};

export default UnitFormComponent;
