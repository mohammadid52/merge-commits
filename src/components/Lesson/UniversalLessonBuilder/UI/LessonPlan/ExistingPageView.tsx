import React, {useState, useContext, useEffect} from 'react';
import {useHistory} from 'react-router';
import {FaCopy} from 'react-icons/fa';

import Buttons from '../../../../Atoms/Buttons';
import Tooltip from '../../../../Atoms/Tooltip';

import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import {useQuery} from '../../../../../customHooks/urlParam';
import PageTile from '../common/PageTile';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as customQueries from '../../../../../customGraphql/customQueries';
import {graphqlOperation, API} from 'aws-amplify';
import {ILessonPlan} from './LessonPlan';
import {v4 as uuidV4} from 'uuid';
import {
  UniversalLessonPage,
  UniversalLesson,
} from '../../../../../interfaces/UniversalLessonInterfaces';
import {HiOutlineArrowRight} from 'react-icons/hi';
import {MdTitle} from 'react-icons/md';
import {ImFileEmpty} from 'react-icons/im';
import {debounce} from 'lodash';

const ExistingPageView = ({addNewPageHandler, universalLessonDetails}: ILessonPlan) => {
  const history = useHistory();
  const {clientKey, userLanguage} = useContext(GlobalContext);

  const {LessonBuilderDict} = useDictionary(clientKey);
  const [copiedPageId, setCopiedPageId] = useState<string>('');
  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');

  const pages = universalLessonDetails?.lessonPlan || [];
  const [otherPages, setOtherPages] = useState<UniversalLessonPage[]>([]);
  const currentLessonID = universalLessonDetails.id;
  useEffect(() => {
    fetchOtherLessonPlans();
  }, []);

  const fetchOtherLessonPlans = async () => {
    try {
      const fetchAllList: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessons)
      );
      if (!fetchAllList) {
        throw new Error('fail!');
      } else {
        const data = fetchAllList?.data?.listUniversalLessons.items;

        data.forEach((item: UniversalLesson) => {
          if (item.id !== currentLessonID) {
            otherPages.push(...item.lessonPlan);
          }
        });

        setOtherPages([...otherPages]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addExistingPageToDB = async () => {
    const currentPage = pages.find((page) => page.id === copiedPageId);
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
        graphqlOperation(customMutations.updateUniversalLesson, {input})
      );
    } catch (error) {
      console.error(error.message);
      console.log('Error adding existing_page');
    }
  };

  const addExistingPage = () => {
    const id: string = `page_${pages.length + 1}`;
    const currentPage = pages.find((page) => page.id === copiedPageId);
    addNewPageHandler({
      ...currentPage,
      id,
      pageContent:
        copiedPageId.length > 0
          ? currentPage.pageContent.map((part: any, partIndex: number) => ({
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

  const onCopyPageContent = (selectedPageId: string) => {
    setCopiedPageId(selectedPageId);
  };

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }
  const Content = ({pages}: {pages: UniversalLessonPage[]}) => {
    const colorList = [
      {
        iconForeground: 'text-teal-700',
        iconBackground: 'bg-teal-100',
      },
      {
        iconForeground: 'text-red-700',
        iconBackground: 'bg-red-100',
      },
      {
        iconForeground: 'text-yellow-700',
        iconBackground: 'bg-yellow-100',
      },
      {
        iconForeground: 'text-blue-700',
        iconBackground: 'bg-blue-100',
      },
      {
        iconForeground: 'text-pink-700',
        iconBackground: 'bg-pink-100',
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-2 my-4">
        {pages &&
          pages.length > 0 &&
          pages.map((content, idx: number) => {
            console.log(content.id);

            const pallete =
              idx < colorList.length - 1
                ? colorList[idx]
                : colorList[Math.floor(Math.random() * pages.length)];

            return (
              <div
                onClick={() => {}}
                key={content.id}
                className={`relative form-button rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:${pallete.iconBackground} transition-all focus-within:ring-2`}>
                <span
                  className={classNames(
                    pallete.iconBackground,
                    pallete.iconForeground,
                    'rounded-lg inline-flex p-3 w-auto'
                  )}>
                  <ImFileEmpty className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <a href="#" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{content.title}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {content?.description || '--'}
                    </p>
                  </a>
                </div>

                <div className="w-auto relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyPageContent(content.id);
                    }}
                    type="button"
                    className={`inline-flex items-center px-3 py-2 border-0 border-${
                      pallete.iconBackground.split('-')[1]
                    }-300 shadow-sm text-sm leading-4 font-medium rounded-md ${
                      pallete.iconForeground
                    } bg-white transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                    {copiedPageId === content.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    );
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
            <Content pages={pages} />
            {/* <div className={`mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200`}>
              {pages && pages.length
                ? pages
                    // .slice(0, focussed === 'existing_page' ? pages.length : 3)
                    .map((page: any, index: number) => (
                      <div key={page.id} className="flex flex-col">
                        <PageTile whClass={`w-20 h-28 mt-1`} marginClass={`mx-auto`} />
                        <div className="flex mx-auto flex-col text-gray-400">
                          <div className="text-md text-center">{page.label}</div>
                          {index === copiedPageId ? (
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
            </div> */}

            {/* 
            <div className={`mt-2 p-4 py-2 grid grid-cols-3 bg-gray-200`}>
              {otherPages && otherPages.length
                ? otherPages
                    // .slice(0, focussed === 'existing_page' ? pages.length : 3)
                    .map((page: any, index: number) => (
                      <div key={page.id} className="flex flex-col">
                        <PageTile whClass={`w-20 h-28 mt-1`} marginClass={`mx-auto`} />
                        <div className="flex mx-auto flex-col text-gray-400">
                          <div className="text-md text-center">{page.label}</div>
                          {index === copiedPageId ? (
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
            </div> */}

            {otherPages && otherPages.length > 0 && (
              <>
                <p className={`px-2 text-left block text-xs font-medium text-gray-700`}>
                  Other lessons
                </p>
                <Content pages={otherPages} />
              </>
            )}
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                disabled={copiedPageId.length === 0}
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
