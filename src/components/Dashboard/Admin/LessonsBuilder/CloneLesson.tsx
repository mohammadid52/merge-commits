import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {map} from 'lodash';
import React, {useContext, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {v4 as uuidv4} from 'uuid';
import {UniversalLesson} from '@interfaces/UniversalLessonInterfaces';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import * as mutations from '../../../../graphql/mutations';
import {wait} from '../../../../utilities/functions';
import Buttons from '../../../Atoms/Buttons';
import Modal from '../../../Atoms/Modal';

interface Props {
  getCloneLessonDetails?: () => UniversalLesson;
  setShowCloneModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; lessonId: string}>
  >;
}

const CloneLesson = ({setShowCloneModal, getCloneLessonDetails}: Props) => {
  const onCloneModalClose = () => {
    setShowCloneModal({show: false, lessonId: ''});
  };
  const {clientKey, userLanguage} = useContext(GlobalContext);

  const history = useHistory();
  const match = useRouteMatch();

  const {EditQuestionModalDict, LessonsListDict} = useDictionary(clientKey);

  const cloneLesson: UniversalLesson = getCloneLessonDetails();

  const getCloneData = () => {
    /**
     * This object will replace all the existing ids with new ones
     * hope this works 😼
     */

    const replaceAllExistingIds: any = {
      ...cloneLesson,
      id: uuidv4(),
      //@ts-ignore
      title: `${cloneLesson.title} Cloned`,
      lessonPlan: map(cloneLesson.lessonPlan, (page) => ({
        ...page,
        id: uuidv4(),
        title: 'TBD',
        pageContent:
          page.pageContent && page.pageContent.length > 0
            ? map(page.pageContent, (pgContent) => ({
                ...pgContent,

                id: uuidv4(),
                partContent:
                  pgContent.partContent && pgContent.partContent.length > 0
                    ? map(pgContent.partContent, (ptContent) => ({
                        ...ptContent,
                        id: uuidv4(),
                        value:
                          ptContent.value && ptContent.value.length > 0
                            ? map(ptContent.value, (ptValue) => ({
                                ...ptValue,
                                id: uuidv4(),
                                options:
                                  ptValue.options && ptValue.options.length > 0
                                    ? map(ptValue.options, (opt) => ({
                                        ...opt,
                                        id: uuidv4(),
                                      }))
                                    : null,
                              }))
                            : [],
                      }))
                    : [],
              }))
            : [],
      })),
    };

    return replaceAllExistingIds;
  };

  const [cloningStatus, setCloningStatus] = useState<
    'initial' | 'cloning' | 'success' | 'failed'
  >('initial');

  const bookLoading = getAsset('general', 'bookLoading');

  const [newLessonId, setNewLessonId] = useState('');

  const onRedirectToNewLesson = () => {
    onCloneModalClose();
    const redirectionUrl = `${match.url}/lesson/edit?lessonId=${newLessonId}&step=overview&refName=name`;

    history.push(redirectionUrl);
  };

  const startClone = () => {
    setCloningStatus('cloning');
    try {
      const data = getCloneData();
      // Because this is auto generated
      delete data.createdAt;
      delete data.updatedAt;
      wait(3000).then(async () => {
        const result: any = await API.graphql(
          graphqlOperation(mutations.createUniversalLesson, {input: data})
        );

        const newLesson = result.data.createUniversalLesson;
        setNewLessonId(newLesson?.id);

        setCloningStatus('success');
      });
    } catch (error) {
      setCloningStatus('failed');
      console.error(error.message);
    }
  };

  const cloning = cloningStatus === 'cloning';
  const failed = cloningStatus === 'failed';
  const success = cloningStatus === 'success';
  const initial = cloningStatus === 'initial';

  return (
    <Modal
      title={
        cloningStatus !== 'success'
          ? 'Please confirm you want to clone this lesson'
          : failed
          ? 'Failed'
          : 'What do you want to do next?'
      }
      showHeaderBorder
      closeAction={onCloneModalClose}
      showHeader
      scrollHidden
      showFooter={false}>
      <div className="min-w-132 max-w-256">
        {initial && (
          <div>
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-800 sm:mt-0 sm:col-span-2">
                  {
                    //@ts-ignore
                    cloneLesson.title || '--'
                  }
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-800 sm:mt-0 sm:col-span-2">
                  {
                    //@ts-ignore
                    cloneLesson.type || '--'
                  }
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Summary</dt>
                <dd className="mt-1 text-sm text-gray-800 sm:mt-0 sm:col-span-2">
                  {cloneLesson.summary || '--'}
                </dd>
              </div>
              <p className="text-gray-400 italic mt-2 text-xs font-medium sm:px-6">
                Found {cloneLesson.lessonPlan.length}{' '}
                {cloneLesson.lessonPlan.length > 1 ? 'pages' : 'page'} with this lesson
              </p>
            </dl>
          </div>
        )}

        {cloning && (
          <div className="flex items-center justify-center">
            <img src={bookLoading} alt="loading" className="h-56 w-56" />
          </div>
        )}

        {success && (
          <div className="flex items-center justify-center ">
            <Buttons
              btnClass="py-1 px-4 text-xs mr-2"
              label={'Back to lessons'}
              onClick={onCloneModalClose}
              transparent
            />
            <Buttons
              btnClass="py-1 px-8 text-xs ml-2"
              label={'Update new cloned lesson details'}
              onClick={onRedirectToNewLesson}
            />
          </div>
        )}

        {failed && (
          <div className="flex items-center justify-center ">
            <h4 className="text-center text-lg text-gray-800">
              Oops! Something went wrong
            </h4>
          </div>
        )}

        {!failed && !success && (
          <div className="flex mt-8 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-4 text-xs mr-2"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                onClick={onCloneModalClose}
                transparent
                disabled={cloning}
              />
              <Buttons
                disabled={cloning}
                btnClass="py-1 px-8 text-xs ml-2"
                label={LessonsListDict[userLanguage]['BUTTON']['START_CLONING']}
                onClick={startClone}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CloneLesson;
