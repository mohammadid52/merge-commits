import React, {useState, useContext} from 'react';
import {useHistory} from 'react-router';
import {FaCopy} from 'react-icons/fa';

import Buttons from '../../../../Atoms/Buttons';
import Tooltip from '../../../../Atoms/Tooltip';

import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {useQuery} from '../../../../../customHooks/urlParam';
import {getAsset} from '../../../../../assets';
import PageTile from '../common/PageTile';
import * as mutations from '../../../../../graphql/mutations';
import {graphqlOperation, API} from 'aws-amplify';
import {ILessonPlan} from './LessonPlan';
import {v4 as uuidV4} from 'uuid';

const ExistingPageView = ({addNewPageHandler, universalLessonDetails}: ILessonPlan) => {
  const history = useHistory();
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {LessonBuilderDict} = useDictionary(clientKey);
  const [copiedPageIndex, setCopiedPageIndex] = useState<number>(-1);
  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');

  const pages = universalLessonDetails?.lessonPlan;

  const addExistingPageToDB = async () => {
    const currentPage = pages[copiedPageIndex];
    try {
      const input = {
        id: lessonId,
        lessonPlan: [
          ...pages,
          {
            id: uuidV4().toString(),
            title: currentPage.title,
            label: currentPage.label,
            description: currentPage.description,
            pageContent: currentPage.pageContent || [],
          },
        ],
      };
      const result = await API.graphql(
        graphqlOperation(mutations.updateUniversalLesson, {input})
      );
    } catch (error) {
      console.error(error.message);
      console.log('Error adding existing_page');
    }
  };

  const addExistingPage = () => {
    const id: string = `page_${pages.length + 1}`;
    addNewPageHandler({
      ...pages[copiedPageIndex],
      id,
      pageContent:
        copiedPageIndex > -1
          ? pages[copiedPageIndex].pageContent.map((part: any, partIndex: number) => ({
              ...part,
              id: `${id}_part_${partIndex}`,
              partContent: part.partContent.map((content: any, contentIndex: number) => ({
                ...content,
                id: `${id}_part_${partIndex}_${content.type}_${
                  part.partContent.filter(
                    (c: any, i: number) => c.type === content.type && i < contentIndex
                  ).length
                }`,
              })),
            }))
          : [],
    });
    // add to database
    addExistingPageToDB();
    history.push(
      `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonId}&pageId=${id}`
    );
  };

  const onCopyPageContent = (selectedPageIndex: number) => {
    setCopiedPageIndex(selectedPageIndex);
  };

  return (
    <div className="w-full m-auto">
      <div className="overflow-hidden mb-4">
        <div className="relative flex items-center justify-between mb-2">
          {/* <h2 className="w-auto bg-white text-lg font-semibold  text-gray-900 truncate">
            Use Existing Page
          </h2> */}
          {/* <Buttons
            onClick={() => handleToggleFocussed('existing_page')}
            Icon={VscNewFile}
            label={`${focussed === 'existing_page' ? 'Less' : 'More'}`}
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-indigo-400 rounded-lg hover:bg-indigo-500 transition-all"
          /> */}
        </div>
        <div className="px-4">
          <div className={`w-full bg-gray-200 rounded py-2`}>
            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              This lesson
            </p>
            <div className={`mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200`}>
              {pages && pages.length
                ? pages
                    // .slice(0, focussed === 'existing_page' ? pages.length : 3)
                    .map((page: any, index: number) => (
                      <div key={page.id} className="flex flex-col">
                        <PageTile whClass={`w-20 h-28 mt-1`} marginClass={`mx-auto`} />
                        <div className="flex mx-auto flex-col text-gray-400">
                          <div className="text-md text-center">{page.label}</div>
                          {index === copiedPageIndex ? (
                            <div className="text-center">Copied</div>
                          ) : (
                            <div className="cursor-pointer">
                              <Tooltip
                                placement="top"
                                text={`Click here to copy the content of this page`}>
                                <FaCopy onClick={() => onCopyPageContent(index)} />
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                : null}
            </div>
            <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
              Other lessons
            </p>
            <div className="mt-2 p-4 py-2 grid grid-cols-1 bg-gray-200">
              <div className={`w-auto h-32 flex items-center bg-white shadow rounded`}>
                <div className="text-center text-gray-400">Coming Soon</div>
              </div>
            </div>
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                disabled={copiedPageIndex < 0}
                label={LessonBuilderDict[userLanguage]['BUTTON']['SAVE']}
                type="submit"
                onClick={addExistingPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingPageView;
