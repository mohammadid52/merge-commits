import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {UniversalLesson} from 'API';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';

import {map} from 'lodash';
import React, {useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';
import {wait} from 'utilities/functions';
import {v4 as uuidv4} from 'uuid';

interface Props {
  getCloneLessonDetails?: () => UniversalLesson;
  setShowCloneModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; lessonId: string}>
  >;
  open: boolean;
}

const CloneLesson = ({setShowCloneModal, open, getCloneLessonDetails}: Props) => {
  const onCloneModalClose = () => {
    setShowCloneModal?.({show: false, lessonId: ''});
  };
  const {userLanguage} = useGlobalContext();

  const history = useHistory();
  const match = useRouteMatch();

  const {EditQuestionModalDict, LessonsListDict} = useDictionary();

  const cloneLesson: UniversalLesson | undefined = getCloneLessonDetails?.();

  const getCloneData = () => {
    /**
     * This object will replace all the existing ids with new ones
     * hope this works 😼
     */

    const replaceAllExistingIds: any = {
      ...cloneLesson,
      id: uuidv4(),
      //@ts-ignore
      title: `${cloneLesson?.title} Cloned`,
      lessonPlan: map(cloneLesson?.lessonPlan, (page) => ({
        ...page,
        id: uuidv4(),
        title: 'TBD',
        pageContent:
          page?.pageContent && page?.pageContent.length > 0
            ? map(page?.pageContent, (pgContent) => ({
                ...pgContent,

                id: uuidv4(),
                partContent:
                  pgContent?.partContent && pgContent?.partContent.length > 0
                    ? map(pgContent?.partContent, (ptContent) => ({
                        ...ptContent,
                        id: uuidv4(),
                        value:
                          ptContent?.value && ptContent?.value.length > 0
                            ? map(ptContent?.value, (ptValue) => ({
                                ...ptValue,
                                id: uuidv4(),
                                options:
                                  ptValue?.options && ptValue?.options.length > 0
                                    ? map(ptValue?.options, (opt) => ({
                                        ...opt,
                                        id: uuidv4()
                                      }))
                                    : null
                              }))
                            : []
                      }))
                    : []
              }))
            : []
      }))
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
    const redirectionUrl = `${match.url}/${newLessonId}?lessonId=${newLessonId}&step=overview&refName=name`;

    history.push(redirectionUrl);
  };

  const startClone = () => {
    if (Boolean(cloneLesson)) {
      setCloningStatus('cloning');
      try {
        const data = getCloneData();

        // Because this is auto generated
        delete data.createdAt;
        delete data.updatedAt;
        delete data.institution;
        delete data.institutionName;
        delete data.institutionId;
        wait(3000)
          .then(async () => {
            const result: any = await API.graphql(
              graphqlOperation(mutations.createUniversalLesson, {input: data})
            );

            const newLesson = result.data.createUniversalLesson;
            setNewLessonId(newLesson?.id);

            setCloningStatus('success');
          })
          .catch((error) => {
            setCloningStatus('failed');
            console.error(error);
          });
      } catch (error) {
        setCloningStatus('failed');
        console.error(error);
      }
    }
  };

  const cloning = cloningStatus === 'cloning';
  const failed = cloningStatus === 'failed';
  const success = cloningStatus === 'success';
  const initial = cloningStatus === 'initial';

  return (
    <Modal
      open={open}
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
              <div className="bg-lightest px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-medium ">Title</dt>
                <dd className="mt-1 text-sm text-darkest    sm:mt-0 sm:col-span-2">
                  {
                    //@ts-ignore
                    cloneLesson?.title || '--'
                  }
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-medium ">Type</dt>
                <dd className="mt-1 text-sm text-darkest    sm:mt-0 sm:col-span-2">
                  {
                    //@ts-ignore
                    cloneLesson?.type || '--'
                  }
                </dd>
              </div>
              <div className="bg-lightest px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-medium ">Summary</dt>
                <dd className="mt-1 text-sm text-darkest    sm:mt-0 sm:col-span-2">
                  {cloneLesson?.summary || '--'}
                </dd>
              </div>
              <p className="text-light  italic mt-2 text-xs font-medium sm:px-6">
                Found {cloneLesson?.lessonPlan?.length}{' '}
                {cloneLesson?.lessonPlan && cloneLesson?.lessonPlan?.length > 1
                  ? 'pages'
                  : 'page'}{' '}
                with this lesson
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
            <Buttons label={'Back to lessons'} onClick={onCloneModalClose} transparent />
            <Buttons
              label={'Update new cloned lesson details'}
              onClick={onRedirectToNewLesson}
            />
          </div>
        )}

        {failed && (
          <div className="flex items-center justify-center ">
            <h4 className="text-center text-lg text-darkest   ">
              Oops! Something went wrong
            </h4>
          </div>
        )}

        {!failed && !success && (
          <div className="flex mt-8 justify-center px-6 pb-4">
            <div className="flex justify-end gap-4">
              <Buttons
                label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                onClick={onCloneModalClose}
                transparent
                disabled={cloning}
              />
              <Buttons
                disabled={cloning}
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
