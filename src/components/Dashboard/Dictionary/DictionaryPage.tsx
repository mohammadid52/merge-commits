import AddButton from '@components/Atoms/Buttons/AddButton';
import PageWrapper from '@components/Atoms/PageWrapper';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import CommonActionsBtns from '@components/MicroComponents/CommonActionsBtns';
import Table, {ITableProps} from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {logError} from '@graphql/functions';
import {setLocalStorageData} from '@utilities/localStorage';
import {Dicitionary, ListDicitionariesQueryVariables} from 'API';
import {orderBy, truncate} from 'lodash';
import {useState} from 'react';
import DictionaryMutationModal from './DictionaryMutationModal';

const DictionaryPage = () => {
  const {
    data,
    setData = () => {},
    isLoading,
    refetch
  } = useGraphqlQuery<ListDicitionariesQueryVariables, Dicitionary[]>(
    'listDicitionaries',
    {limit: SEARCH_LIMIT},
    {
      onSuccess: (data) => {
        if (data.length > 0) {
          const orderedList = orderBy([...data], ['createdAt'], ['desc']);
          setData([...orderedList]);
          setLocalStorageData('dictionaries', orderedList);
        } else {
          setData([]);
        }
      }
    }
  );

  const [showModal, setShowModal] = useState(false);

  const [editDictionary, setEditDictionary] = useState<Dicitionary | null>(null);

  const closeAction = () => {
    setShowModal(false);
  };

  const deleteDicitionary = useGraphqlMutation('deleteDicitionary', {
    onSuccess: () => {
      refetch();
    }
  });

  const {authId, email} = useAuth();

  const onDelete = async (dictId: string) => {
    try {
      await deleteDicitionary.mutate({input: {id: dictId}});
    } catch (error) {
      logError(error, {authId, email}, 'DictionaryPage @onDelete');
      console.error(error);
    }
  };

  const dataList: any[] = data.map((dict, idx) => ({
    no: idx + 1,
    englishPhrase: <div className="">{dict.englishPhrase}</div>,
    englishDefinition: (
      <div className="">{truncate(dict.englishDefinition || '', {length: 200})}</div>
    ),

    languageTranslation: (
      <div className="">
        <ol>
          {dict?.translation?.length === 0 ? (
            <li>N/A</li>
          ) : (
            dict?.translation?.map((translation) => {
              return (
                <li key={translation?.id}>
                  <div className="font-medium text-gray-600">
                    In {translation?.translateLanguage || '--'}:
                  </div>
                  <p>{translation?.languageTranslation || '--'}</p>
                </li>
              );
            })
          )}
        </ol>
      </div>
    ),
    languageDefinition: (
      <div className="">
        <ol>
          {dict?.translation?.length === 0 ? (
            <li>N/A</li>
          ) : (
            dict?.translation?.map((translation) => {
              return (
                <li key={translation?.id}>
                  <div className="font-medium text-gray-600">
                    In {translation?.translateLanguage || '--'}:
                  </div>
                  <p>{translation?.languageDefinition || '--'}</p>
                </li>
              );
            })
          )}
        </ol>
      </div>
    ),
    actions: (
      <CommonActionsBtns
        button1Action={() => {
          setShowModal(true);
          setEditDictionary(dict);
        }}
        button2Action={() => {
          onDelete(dict.id);
        }}
      />
    )
  }));

  const tableConfig: ITableProps = {
    headers: [
      'No',
      'English Phrase',
      'English Definition',
      'Language Translation',
      'Language Definition',
      'Actions'
    ],
    dataList,
    config: {
      dataList: {
        loading: isLoading
      }
    }
  };

  const onSuccessMutation = () => {
    refetch();
  };

  return (
    <div className="p-4 pt-8">
      <PageWrapper wrapClass="px-8">
        <SectionTitleV3
          title={'Glossary'}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-gray-900"
          borderBottom
          shadowOff
          withButton={
            <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
              <AddButton
                label={'New Entry'}
                onClick={() => {
                  setEditDictionary(null);
                  setShowModal(true);
                }}
              />
            </div>
          }
        />

        <Table {...tableConfig} />

        <DictionaryMutationModal
          open={showModal}
          onSuccessMutation={onSuccessMutation}
          dictionary={editDictionary}
          closeAction={closeAction}
        />
      </PageWrapper>
    </div>
  );
};

export default DictionaryPage;
