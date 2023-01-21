import FormInput from '@components/Atoms/Form/FormInput';
import Selector from '@components/Atoms/Form/Selector';
import Modal from '@components/Atoms/Modal';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {logError} from '@graphql/functions';
import {CreateDicitionaryInput, Dicitionary, UpdateDicitionaryInput} from 'API';
import {isArray, isEmpty, update} from 'lodash';
import React, {useEffect, useState} from 'react';

import {v4 as uuidV4} from 'uuid';

interface FormType {
  translation?: CreateDicitionaryInput['translation'];
  englishPhrase: CreateDicitionaryInput['englishPhrase'];
  englishDefinition: CreateDicitionaryInput['englishDefinition'];
  englishAudio: CreateDicitionaryInput['englishAudio'];
}

const INITIAL_DATA = {
  englishPhrase: '',
  englishDefinition: '',
  englishAudio: ''
};

const DictionaryMutationModal = ({
  closeAction,
  dictionary,
  onSuccessMutation
}: {
  dictionary?: Dicitionary;
  closeAction: () => void;
  onSuccessMutation?: () => void;
}) => {
  const {authId, email} = useAuth();

  const isEdit = !isEmpty(dictionary);

  useEffect(() => {
    if (isEdit) {
      setFormData({
        ...formData,
        englishPhrase: dictionary.englishPhrase,
        englishDefinition: dictionary.englishDefinition,
        englishAudio: dictionary.englishAudio,
        translation: dictionary.translation
      });
    } else {
      setFormData(INITIAL_DATA);
    }
  }, [isEdit]);

  const [formData, setFormData] = useState<FormType>(INITIAL_DATA);

  const createDicitionary = useGraphqlMutation('createDicitionary', {
    onSuccess: onSuccessMutation
  });
  const _updateDictionary = useGraphqlMutation('updateDicitionary', {
    onSuccess: onSuccessMutation
  });

  const addNewDictionary = async () => {
    try {
      const input: CreateDicitionaryInput = {
        authID: authId,
        email,
        id: uuidV4(),
        englishPhrase: formData.englishPhrase,
        englishDefinition: formData.englishDefinition,
        englishAudio: isEmpty(formData.englishAudio) ? formData.englishAudio : '',
        translation: isEmpty(formData.translation) ? [] : formData.translation
      };

      createDicitionary.mutate({input: input});
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'DictionaryPage @addNewDictionary');
    } finally {
      closeAction();
    }
  };

  const updateDictionary = async () => {
    try {
      const input: UpdateDicitionaryInput = {
        id: dictionary.id,
        englishPhrase: formData.englishPhrase,
        englishDefinition: formData.englishDefinition,
        englishAudio: formData.englishAudio,
        translation: formData.translation
      };

      _updateDictionary.mutate({input: input});
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'DictionaryPage @addNewDictionary');
    } finally {
      closeAction();
    }
  };

  const onChange = (e: any) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const langs = [{id: 1, name: 'Spanish'}];
  const filteredLangs = langs.filter((l) =>
    isEmpty(formData?.translation?.find((d) => d.translateLanguage === l.name))
  );

  const onLangAdd = (name: string) => {
    const existing = !isArray(formData.translation) ? [] : [...formData.translation];

    const newTranslationObj = {
      id: uuidV4(),
      translateLanguage: name,
      languageTranslation: '',
      languageDefinition: ''
    };

    const updatedTranslationList = [...existing, newTranslationObj];

    setFormData({...formData, translation: updatedTranslationList});
  };

  const translationChange = (idx: number, name: string, value: string) => {
    update(formData.translation[idx], name, () => value);
    setFormData({...formData});
  };

  return (
    <Modal
      saveAction={isEdit ? updateDictionary : addNewDictionary}
      closeAction={() => {
        setFormData(INITIAL_DATA);
        closeAction();
      }}
      title={isEdit ? 'Edit Dictionary' : 'Add Dictionary'}
      showHeader
      showFooter>
      <div className="w-132 pb-24">
        <div className="grid grid-cols-2 gap-x-4 ">
          <div className="mb-4">
            <FormInput
              name="englishPhrase"
              isRequired
              value={formData.englishPhrase}
              onChange={onChange}
              label="English Phrase"
              placeHolder="Add english phrase"
            />
          </div>

          <div className="mb-4">
            <FormInput
              name="englishDefinition"
              value={formData.englishDefinition}
              onChange={onChange}
              label="English Definition"
              placeHolder="Add english definition"
            />
          </div>

          <hr />

          <div className="col-span-2 mt-4 flex items-center justify-end">
            <Selector
              list={filteredLangs}
              placeholder="Add a language"
              onChange={(_, name) => onLangAdd(name)}
            />
          </div>
        </div>

        {formData?.translation?.map((translation, idx) => {
          const {
            translateLanguage,
            languageDefinition,
            languageTranslation
          } = translation;

          return (
            <div className="mt-4 grid grid-cols-2 gap-x-4" key={translation.id}>
              <div className="">
                <FormInput
                  name={'languageDefinition'}
                  isRequired
                  value={languageDefinition}
                  onChange={(e) => translationChange(idx, e.target.name, e.target.value)}
                  label={`${translateLanguage} Definition`}
                  placeHolder={`Add ${translateLanguage} definition`}
                />
              </div>

              <div className="mb-2">
                <FormInput
                  name={'languageTranslation'}
                  value={languageTranslation}
                  onChange={(e) => translationChange(idx, e.target.name, e.target.value)}
                  label={`${translateLanguage} Translation`}
                  placeHolder={`Add ${translateLanguage} translation`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default DictionaryMutationModal;
