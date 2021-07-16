import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router';

import BuilderRowComposer from './CoreBuilder/BuilderRowComposer';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {GlobalContext} from '../../../../contexts/GlobalContext';

import Loader from '../../../Atoms/Loader';
import Toolbar from '../UI/UIComponents/Toolbar';

import {findLastIndex, remove} from 'lodash';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import useDictionary from '../../../../customHooks/dictionary';
import ModalPopUp from '../../../Molecules/ModalPopUp';
import {useQuery} from '../../../../customHooks/urlParam';
import useOnScreen from '../../../../customHooks/useOnScreen';
import {IconType} from 'react-icons/lib';
import Tooltip from '../../../Atoms/Tooltip';
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineFileAdd,
  AiOutlineFileSearch,
  AiOutlineSave,
} from 'react-icons/ai';

import {VscDiscard} from 'react-icons/vsc';

interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  initialUniversalLessonPagePartContent: PartContent;

  lessonId: string;
  handleModalPopToggle?: (dialogToToggle: string) => void;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number
  ) => void;

  activePageData: UniversalLessonPage;
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const history = useHistory();

  const {
    mode,

    createNewBlockULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    universalLessonDetails,
    lessonId,
    selectedPageID,
    setSelectedPageID,
    targetID,
    setTargetID,
    selectedPagePartID,
    setSelectedPagePartID,
    selectedPartContentID,
    setSelectedPartContentID,
    handleEditBlockContent,
    handleModalPopToggle,
    handleTagModalOpen,
    activePageData,
  } = props;
  const {
    setUniversalLessonDetails,
    setNewLessonPlanShow,
    fetchingLessonDetails,
    setLessonPlanFields,
    setEditMode,
    toolbarOnTop,
    previewMode,
    setPreviewMode,
  } = useULBContext();
  const {
    clientKey,
    userLanguage,
    state: {lessonPage: {themeBackgroundColor = ''} = {}},
  } = useContext(GlobalContext);

  const {
    state: {
      lessonPage: {
        theme = 'dark',
        themeSecBackgroundColor = 'bg-gray-700',
        themeTextColor = '',
      } = {},
    },
  } = useContext(GlobalContext);

  const params = useQuery(location.search);

  const pageId = params.get('pageId');

  useEffect(() => {
    if (pageId === 'open-overlay') {
      setNewLessonPlanShow(true);
      setEditMode(false);
    }
  }, [pageId]);

  const {LessonBuilderDict} = useDictionary(clientKey);

  const goToLessonPlan = () => {
    history.push(
      `/dashboard/lesson-builder/lesson/edit?lessonId=${lessonId}&step=activities`
    );
  };
  const Button = ({
    onClick,
    icon: Icon,
    text = '',
    tooltip = '',
    invert = false,
    color = 'text-white',
  }: {
    onClick?: () => void;
    icon?: IconType;
    tooltip?: string;
    text?: string;
    color?: string;
    invert?: boolean;
  }) => {
    return (
      <Tooltip show={tooltip.length > 0} text={tooltip} placement="bottom">
        <button
          onClick={onClick}
          type="button"
          className={`${
            invert ? 'bg-indigo-600' : 'bg-transparent'
          } ${color} mx-2 hover:shadow-lg w-auto  inline-flex justify-center items-center p-2 border border-transparent rounded-md hover:text-white  transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
          {text}
        </button>
      </Tooltip>
    );
  };

  const Divider = ({theme = 'dark'}: any) => (
    <span
      style={{width: 1}}
      className={`h-8 mx-2 ${
        theme === 'dark' ? 'bg-white' : 'bg-gray-600'
      } bg-opacity-50 `}
    />
  );

  const Container = ({children}: {children: any}) => (
    <div className={`flex items-center flex-col w-auto ${!toolbarOnTop ? 'mb-2' : ''}`}>
      {children}
    </div>
  );
  // const activePageData: UniversalLessonPage = universalLessonDetails.lessonPlan.find(
  //   (lessonPage: UniversalLessonPage) => lessonPage.id === selectedPageID
  // );

  const [confirmationConfig, setConfirmationConfig] = useState<{
    show: boolean;
    message: string;
    saveAction?: () => void;
  }>({
    show: false,
    message: '',
  });

  /**
   * @void trigger delete modal
   */
  const onDeleteButtonClick = () => {
    setConfirmationConfig({
      message:
        'Are you sure you want to delete the this page? All of your data will be permanently removed. This action cannot be undone.',
      show: true,
    });
  };
  const closeAction = () => {
    setConfirmationConfig({
      message: '',
      show: false,
    });
  };

  const {message = '', show = false} = confirmationConfig;

  /**
   * @param id - pageId - string
   * @void this function will delete the current lesson
   */
  const deleteLessonPlan = async (id: string) => {
    remove(universalLessonDetails.lessonPlan, (item: any) => item.id === id);
    setUniversalLessonDetails({...universalLessonDetails});
    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan],
    };
    closeAction();
    await updateLessonPageToDB(input);
    const lastIndex = findLastIndex(universalLessonDetails.lessonPlan);
    if (lastIndex > -1) {
      const pageID: string =
        universalLessonDetails.lessonPlan[universalLessonDetails.lessonPlan.length - 1]
          .id;
      setSelectedPageID(pageID);
    } else {
      goToLessonPlan();
    }
  };
  // 150px hide
  // 0px show
  return (
    <>
      {activePageData && show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() => deleteLessonPlan(activePageData.id)}
        />
      )}
      <div style={{top: '30rem'}} className="w-16 bg-gray-800 fixed right-5 z-10">
        {!previewMode && (
          <div
            className={`customShadow rounded-lg toolbar ${themeSecBackgroundColor} w-auto p-2`}>
            <div className="flex items-center flex-col">
              <Container>
                <Button
                  onClick={() => setPreviewMode(!previewMode)}
                  tooltip="Preview"
                  color={themeTextColor}
                  icon={previewMode ? AiOutlineEyeInvisible : AiOutlineEye}
                />

                <>
                  <Button
                    color={themeTextColor}
                    tooltip="Add New Page"
                    onClick={() => {
                      setNewLessonPlanShow(true);
                      setEditMode(false);
                      // setFields({
                      //   title: '',
                      //   label: '',
                      //   instructions: '',
                      //   instructionsHtml: '',
                      //   description: '', // ignore this field
                      //   interactionType: [],
                      //   tags: [],
                      //   estTime: '1 min',
                      //   classwork: true,
                      // });
                    }}
                    icon={AiOutlineFileAdd}
                  />
                </>
              </Container>

              <Container>
                {/* <Button
                color={themeTextColor}
                tooltip="Enable Drag"
                icon={enableDnD ? RiDragDropFill : RiDragDropLine}
              /> */}
                <Button
                  color={themeTextColor}
                  tooltip="Search Page"
                  icon={AiOutlineFileSearch}
                />
              </Container>

              <Container>
                <Button
                  color={themeTextColor}
                  tooltip="Save changes"
                  icon={AiOutlineSave}
                />
                <Button
                  color={themeTextColor}
                  tooltip="Discard changes"
                  icon={VscDiscard}
                />

                <Button
                  color="text-red-500"
                  tooltip="Delete this page"
                  icon={AiOutlineDelete}
                  onClick={() => {}}
                />
              </Container>
            </div>
          </div>
        )}
      </div>

      <div
        className={`relative grid gap-4 p-4 grid-cols-5 h-full overflow-hidden overflow-y-scroll ${themeBackgroundColor} ${
          activePageData && activePageData.class ? activePageData.class : ''
        }`}>
        <div
          className={`col-start-2 items-center col-end-5 w-full h-full col-span-3 flex flex-col mx-auto`}>
          {!fetchingLessonDetails && (
            <Toolbar
              setFields={setLessonPlanFields}
              setEditMode={setEditMode}
              deleteLesson={onDeleteButtonClick}
              setNewLessonPlanShow={setNewLessonPlanShow}
            />
          )}
          <LessonPageWrapper>
            {fetchingLessonDetails ? (
              <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">Loading...</p>
                </div>
              </div>
            ) : (
              <BuilderRowComposer
                mode={mode}
                createNewBlockULBHandler={createNewBlockULBHandler}
                deleteFromULBHandler={deleteFromULBHandler}
                updateFromULBHandler={updateFromULBHandler}
                universalLessonDetails={universalLessonDetails}
                selectedPageID={selectedPageID}
                setSelectedPageID={setSelectedPageID}
                targetID={targetID}
                setTargetID={setTargetID}
                selectedPagePartID={selectedPagePartID}
                setSelectedPagePartID={setSelectedPagePartID}
                selectedPartContentID={selectedPartContentID}
                setSelectedPartContentID={setSelectedPartContentID}
                handleModalPopToggle={handleModalPopToggle}
                handleTagModalOpen={handleTagModalOpen}
                handleEditBlockContent={handleEditBlockContent}
              />
            )}
          </LessonPageWrapper>
        </div>
      </div>
    </>
  );
};
