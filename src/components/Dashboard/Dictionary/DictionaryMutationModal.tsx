import FormInput from '@components/Atoms/Form/FormInput';
import Modal from '@components/Atoms/Modal';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {addNewDictionary, logError} from 'graphql-functions/functions';
import {
  CreateDicitionaryInput,
  Dicitionary,
  TranslationInput,
  UpdateDicitionaryInput
} from 'API';
import {isEmpty, update} from 'lodash';
import {useEffect, useState} from 'react';

import {v4 as uuidV4} from 'uuid';

interface FormType {
  translation?: TranslationInput[] | any[];
  englishPhrase: CreateDicitionaryInput['englishPhrase'];
  englishDefinition: CreateDicitionaryInput['englishDefinition'];
  englishAudio: CreateDicitionaryInput['englishAudio'];
}

const INITIAL_DATA = {
  englishPhrase: '',
  englishDefinition: '',
  englishAudio: '',
  translation: [
    {
      id: uuidV4(),
      translateLanguage: 'Spanish',
      languageTranslation: '',
      languageDefinition: ''
    }
  ]
};

const DictionaryMutationModal = ({
  closeAction,
  dictionary,
  onSuccessMutation,
  open
}: {
  dictionary?: Dicitionary | null;
  closeAction: () => void;
  open: boolean;
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
        translation: dictionary?.translation || []
      });
    } else {
      setFormData(INITIAL_DATA);
    }
  }, [isEdit]);

  const [formData, setFormData] = useState<FormType>(INITIAL_DATA);

  const _updateDictionary = useGraphqlMutation('updateDicitionary', {
    onSuccess: onSuccessMutation
  });

  const updateDictionary = async () => {
    try {
      if (dictionary) {
        const input: UpdateDicitionaryInput = {
          id: dictionary.id,
          englishPhrase: formData.englishPhrase,
          englishDefinition: formData.englishDefinition,
          englishAudio: formData.englishAudio,
          translation: formData.translation
        };

        _updateDictionary.mutate({input: input});
      }
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

  const translationChange = (idx: number, name: string, value: string) => {
    update(formData?.translation?.[idx], name, () => value);
    setFormData({...formData});
  };

  const _addNewDictionary = async () => {
    await addNewDictionary({...formData, authID: authId, email});
    closeAction();
    onSuccessMutation && onSuccessMutation();
  };

  return (
    <Modal
      open={open}
      saveAction={isEdit ? updateDictionary : _addNewDictionary}
      closeAction={() => {
        setFormData(INITIAL_DATA);
        closeAction();
      }}
      closeLabel="Cancel"
      title={isEdit ? 'Edit Dictionary' : 'Add Dictionary'}
      showHeader
      showFooter>
      <div className="max-w-132  pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 ">
          <div className="mb-4">
            <FormInput
              name="englishPhrase"
              isRequired
              rows={5}
              textarea
              value={formData.englishPhrase}
              onChange={onChange}
              label="English Phrase"
              placeHolder="Add english phrase"
            />
          </div>

          <div className="mb-4">
            <FormInput
              name="englishDefinition"
              value={formData?.englishDefinition || ''}
              onChange={onChange}
              textarea
              label="English Definition"
              rows={5}
              placeHolder="Add english definition"
            />
          </div>
        </div>
        <hr />

        {formData?.translation?.map((translation, idx) => {
          const {translateLanguage, languageDefinition, languageTranslation} =
            translation;

          return (
            <div
              className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-x-4"
              key={translation.id}>
              <div className="">
                <FormInput
                  name={'languageDefinition'}
                  textarea
                  rows={5}
                  value={languageDefinition}
                  onChange={(e) => translationChange(idx, e.target.name, e.target.value)}
                  label={`${translateLanguage} Definition`}
                  placeHolder={`Add ${translateLanguage} definition`}
                />
              </div>

              <div className="mb-2">
                <FormInput
                  textarea
                  rows={5}
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
