import {MenuIcon} from '@heroicons/react/outline';
import {Transition} from '@headlessui/react';
import Loader from '../../Atoms/Loader';
import Modal from '../../Atoms/Modal';
import FormInput from '../../Atoms/Form/FormInput';
import React, {useContext, useEffect, useState} from 'react';
import Buttons from '../../Atoms/Buttons';
import useDictionary from '../../../customHooks/dictionary';
import * as customQueries from '../../../customGraphql/customQueries';
import * as customMutations from '../../../customGraphql/customMutations';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {API, graphqlOperation} from '@aws-amplify/api';
import moment from 'moment';
import {findIndex, update} from 'lodash';
import {getAsset} from '../../../assets';

interface ISentiment {
  personAuthID: string;
  personEmail: string;
  backstory: string;
  date: string;
  time: string;
  responseText: string;
  idx: number;
}
const EditBackstory = ({
  show,
  setShow,
  studentSentiments,
  data,
  setStudentSentiments,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setStudentSentiments: React.Dispatch<React.SetStateAction<any[]>>;
  studentSentiments: any[];
  data: ISentiment;
}) => {
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const [backstory, setBackstory] = useState('');

  useEffect(() => {
    setBackstory(data.backstory);
  }, []);

  const [saving, setSaving] = useState(false);

  const {EditQuestionModalDict, General} = useDictionary(clientKey);

  const updateBackstory = async () => {
    setSaving(true);
    try {
      const payload = {
        personAuthID: data.personAuthID,
        personEmail: data.personEmail,
        date: data.date,
        time: data.time,
        backstory,
      };
      await API.graphql(
        graphqlOperation(customMutations.updatePersonSentiments, {input: payload})
      );

      const updateLocalState = () => {
        const idx = data.idx || 0;
        update(studentSentiments[idx], `backstory`, () => backstory);
        setStudentSentiments([...studentSentiments]);
      };

      updateLocalState();
      setShow(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    show && (
      <Modal
        title={General[userLanguage]['SENTIMENT']['MODAL_TITLE']}
        closeAction={() => setShow(false)}
        showHeader={true}
        showFooter={false}>
        <div className="min-w-96 max-w-132 min-h-32">
          <FormInput
            rows={3}
            showCharacterUsage
            className={'mb-2'}
            maxLength={144}
            textarea
            value={backstory}
            onChange={(e: any) => setBackstory(e.target.value)}
            placeHolder={`I'm feeling ${data.responseText} because...`}
          />
          <div className="flex items-center justify-end mt-4">
            <Buttons
              disabled={saving}
              btnClass="py-1 px-8 text-xs ml-2"
              label={
                !saving ? (
                  EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']
                ) : (
                  <Loader className="text-white" />
                )
              }
              onClick={updateBackstory}
            />
          </div>
        </div>
      </Modal>
    )
  );
};

const SentimentTab = () => {
  const [studentSentiments, setStudentSentiments] = useState([]);

  const {state, clientKey, userLanguage} = useContext(GlobalContext);
  const {authId} = state.user;

  const [nextToken, setNextToken] = useState<string>('');

  const [disableLoad, setDisableLoad] = useState(false);

  const [loadingSentiments, setLoadingSentiments] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const {General} = useDictionary(clientKey);

  const fetchSentiments = async (fetchNewRecords: boolean = false) => {
    try {
      if (fetchNewRecords) {
        setLoadingSentiments(true);
      } else {
        setLoadingMore(true);
      }

      let payload: any = {
        personAuthID: authId,
        limit: 8,
        sortDirection: 'DESC',
        nextToken: nextToken || null,
      };

      const res: any = await API.graphql(
        graphqlOperation(customQueries.listPersonSentimentss, payload)
      );

      const temp = res.data.listPersonSentimentss?.items.map((record: any) => ({
        ...record,
        personAuthID: record.personAuthID,
        personEmail: record.personEmail,
        backstory: record.backstory,
        date: record.date,
        time: record.time,
        responseText: record.responseText,
      }));
      if (fetchNewRecords) {
        setStudentSentiments(temp);
      } else {
        const idx = findIndex(studentSentiments, (s: any) => {
          return s.date === temp[0].date && s.time === temp[0].time;
        });

        if (idx === 0) {
          setDisableLoad(true);
        } else {
          setDisableLoad(false);
          setStudentSentiments((prevAttendance: any) => [...prevAttendance, ...temp]);
        }
      }

      setNextToken(res.data.listPersonSentimentss.nextToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSentiments(false);
      setLoadingMore(false);
    }
  };
  const onLoadMore = () => {
    fetchSentiments();
  };

  useEffect(() => {
    if (studentSentiments.length === 0) {
      fetchSentiments(true);
    }
    return () => {
      fetchSentiments(true);
    };
  }, []);

  const emojiGifs = getAsset('general', 'emoji');

  const [view, setView] = useState('emoji');

  const [selectedSentiment, setSelectedSentiment] = useState<ISentiment | null>(null);
  // Modal state for backstory edit
  const [showEditModal, setShowEditModal] = useState(false);

  const getEmojiName = (eName: string = 'OKAY') =>
    General[userLanguage]['SENTIMENT']['EMOJIS'][eName?.toUpperCase()];

  return (
    <div className="mt-8 relative transition-all min-h-96">
      {showEditModal && (
        <EditBackstory
          studentSentiments={studentSentiments}
          setStudentSentiments={setStudentSentiments}
          data={selectedSentiment}
          show={showEditModal}
          setShow={setShowEditModal}
        />
      )}
      <div className="text-lg flex items-center justify-between my-4 px-8">
        <div className="w-auto" />
        <span className="mt-2 block text-xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          {General[userLanguage]['SENTIMENT']['TITLE']}
        </span>
        <span
          className="w-auto"
          title={`Show ${view === 'table' ? 'emoji' : 'table'} view`}>
          <MenuIcon
            onClick={() => setView(view === 'table' ? 'emoji' : 'table')}
            className="block h-6 w-6 cursor-pointer"
            aria-hidden="true"
          />
        </span>
      </div>
      <div className="h-full pb-12">
        <Transition
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          appear
          show={loadingSentiments}>
          <div className="flex h-96 items-center justify-center text-center">
            <Loader className="text-gray-500 text-lg" />
          </div>
        </Transition>

        <Transition
          enter="transform transition ease-in-out duration-500"
          enterFrom="-translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transform transition ease-in-out duration-700"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="-translate-x-full opacity-0"
          show={view === 'table'}
          className=""
          role="table">
          <div className="flex flex-col">
            <div className="">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden border-2 border-gray-200 sm:rounded-lg">
                  <table className="sentiment-table-view min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Backstory
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>

                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSentiments.map((sentiment, sentimentIdx) => (
                        <tr
                          key={sentimentIdx}
                          className={sentimentIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap capitalize flex items-center text-sm font-medium text-gray-900">
                            <p className="w-auto">
                              {getEmojiName(sentiment?.responseText || 'okay')}
                            </p>
                            <img
                              src={emojiGifs[sentiment.responseText || 'okay']}
                              alt={getEmojiName(sentiment?.responseText)}
                              className="ml-2 h-7 w-7 transform hover:scale-110 transition-all duration-100 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sentiment.backstory || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {moment(sentiment.date).format('ll')}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEditModal(true);
                                setSelectedSentiment({
                                  idx: sentimentIdx,
                                  responseText: sentiment.responseText || 'okay',
                                  backstory: sentiment.backstory || '',
                                  personAuthID: sentiment.personAuthID,
                                  personEmail: sentiment.personEmail,
                                  date: sentiment.date,
                                  time: sentiment.time,
                                });
                              }}
                              className={`cursor-pointer iconoclast:curate-600 hover:curate:text-900 iconoclast:text-600 hover:iconoclast:text-900 `}>
                              Edit
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <Transition
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="translate-x-full opacity-0"
          show={view === 'emoji'}
          as="ul"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          role="list">
          {studentSentiments.map((sentiment, sentimentIdx) => (
            <li
              title={getEmojiName(sentiment?.responseText)}
              key={sentimentIdx}
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
                setSelectedSentiment({
                  idx: sentimentIdx,
                  responseText: sentiment.responseText || 'okay',
                  backstory: sentiment.backstory || '',
                  personAuthID: sentiment.personAuthID,
                  personEmail: sentiment.personEmail,
                  date: sentiment.date,
                  time: sentiment.time,
                });
              }}
              className="col-span-1 flex flex-col text-center items-center justify-center">
              <img
                src={emojiGifs[sentiment.responseText || 'okay'] || emojiGifs['okay']}
                alt={getEmojiName(sentiment?.responseText)}
                className="h-32 w-32 transform hover:scale-110 transition-all duration-100 cursor-pointer"
              />
              <span className="w-auto text-gray-500 text-sm">
                {moment(sentiment.date).format('ll')}
              </span>
            </li>
          ))}
        </Transition>
      </div>

      <div className="pr-4 w-auto absolute bottom-0 right-0 ">
        <Buttons
          disabled={disableLoad}
          label={
            !loadingMore ? (
              'Load more'
            ) : (
              <Loader withText="Loading" className="text-white" />
            )
          }
          onClick={onLoadMore}
          type="button"
        />
      </div>
    </div>
  );
};

export default SentimentTab;
