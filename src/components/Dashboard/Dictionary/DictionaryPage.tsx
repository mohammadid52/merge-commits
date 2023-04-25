import AddButton from '@components/Atoms/Buttons/AddButton';
import PageWrapper from '@components/Atoms/PageWrapper';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import CommonActionsBtns from '@components/MicroComponents/CommonActionsBtns';
import Table, {ITableProps} from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import {logError} from 'graphql-functions/functions';
import {setLocalStorageData} from '@utilities/localStorage';
import {Dicitionary, ListDicitionariesQueryVariables} from 'API';
import {orderBy, truncate} from 'lodash';
import {useCallback, useState} from 'react';
import DictionaryMutationModal from './DictionaryMutationModal';
import {listDicitionaries} from '@customGraphql/customQueries';
import {deleteDicitionary} from '@graphql/mutations';
import PageLayout from 'layout/PageLayout';

import * as dictionaries from 'dictionary/dictionary.iconoclast';
import {Card, Col, Divider, List, Row} from 'antd';

const DictionaryPage = () => {
  const {
    data,
    setData = () => {},
    isLoading,
    refetch
  } = useGraphqlQuery<ListDicitionariesQueryVariables, Dicitionary[]>(
    'listDicitionaries',
    listDicitionaries,
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

  const deleteDicitionaryMt = useGraphqlMutation('deleteDicitionary', deleteDicitionary, {
    onSuccess: () => {
      refetch();
    }
  });

  const {authId, email} = useAuth();

  const onDelete = async (dictId: string) => {
    try {
      await deleteDicitionaryMt.mutate({input: {id: dictId}});
    } catch (error) {
      logError(error, {authId, email}, 'DictionaryPage @onDelete');
      console.error(error);
    }
  };
  const dictionary = Object.entries(dictionaries);

  const getValues = useCallback((index: number, lang: 'EN' | 'ES') => {
    return Object.values(dictionary[index][1][lang]);
  }, []);

  const onlyKeys = dictionary.map((dict) => {
    const obj = dict[1];
    return {name: dict[0], keys: Object.keys(obj.EN)};
  });

  const dataList: any[] = onlyKeys.map((dict, idx) => ({
    no: idx + 1,
    parent: dict.name,
    value: (
      // antd list
      <List bordered={false}>
        {dict.keys.map((key, idx) => (
          <List.Item>
            {key}:{' '}
            {typeof getValues(idx, 'EN') === 'object'
              ? JSON.stringify(getValues(idx, 'EN'))
              : getValues(idx, 'EN')}
            -{' '}
            {typeof getValues(idx, 'ES') === 'object'
              ? JSON.stringify(getValues(idx, 'ES'))
              : getValues(idx, 'ES')}
          </List.Item>
        ))}
      </List>
    )
  }));

  const tableConfig: ITableProps = {
    headers: ['No', 'Parent', 'Value'],
    dataList,
    config: {
      dataList: {
        loading: isLoading
      }
    }
  };

  console.log(onlyKeys);

  const onSuccessMutation = () => {
    refetch();
  };

  // make the dictionary object into an array

  // split this into 4 columns

  console.log();

  const getInnerValues = useCallback((index: number) => {
    return Object.entries(dictionary[index][1].EN);
  }, []);

  return (
    <PageLayout title="Dictionary">
      {/* <SectionTitleV3
          title={'Glossary'}
          fontSize="xl"
          fontStyle="semibold"
          extraClass="leading-6 text-darkest"
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
        /> */}

      <Table {...tableConfig} />

      {/* <DictionaryMutationModal
          open={showModal}
          onSuccessMutation={onSuccessMutation}
          dictionary={editDictionary}
          closeAction={closeAction}
        /> */}
    </PageLayout>
  );
};

export default DictionaryPage;
