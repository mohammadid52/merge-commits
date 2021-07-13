import React, {useContext, useEffect, useState} from 'react';
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
import NewLessonPlanSO from '../UI/UIComponents/NewLessonPlanSO';

import {findLastIndex, remove} from 'lodash';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import useDictionary from '../../../../customHooks/dictionary';
import ModalPopUp from '../../../Molecules/ModalPopUp';
import {useQuery} from '../../../../customHooks/urlParam';
interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  initialUniversalLessonPagePartContent: PartContent;
  pageDetailsModal: boolean;
  setPageDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  lessonId: string;
  handleModalPopToggle?: (dialogToToggle: string) => void;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number
  ) => void;
  setEditModal: React.Dispatch<React.SetStateAction<any>>;
  editMode?: boolean;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FieldsInterface {
  description: string;
  title: string;
  label: string;
  instructions: string;
  instructionsHtml: any;
  interactionType: string[];
  tags?: string[];
  estTime: string;
  classwork: boolean;
}
const INITIAL_STATE: FieldsInterface = {
  title: '',
  label: '',
  instructions: '',
  instructionsHtml: '',
  description: '', // ignore this field
  interactionType: [],
  tags: [],
  estTime: '1 min',
  classwork: true,
};

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
    editMode,
    setEditMode,
  } = props;
  const {
    previewMode,
    setUniversalLessonDetails,
    newLessonPlanShow,
    setNewLessonPlanShow,
    fetchingLessonDetails,
  } = useULBContext();
  const {
    clientKey,
    userLanguage,
    state: {
      lessonPage: {theme: lessonPageTheme = 'dark', themeBackgroundColor = ''} = {},
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

  const activePageData: UniversalLessonPage = universalLessonDetails.lessonPlan.find(
    (lessonPage) => lessonPage.id === selectedPageID
  );

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
  const [fields, setFields] = useState(INITIAL_STATE);

  return (
    <>
      {show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() => deleteLessonPlan(activePageData.id)}
        />
      )}

      <div
        className={`relative grid gap-4 p-4 grid-cols-5 h-full overflow-hidden overflow-y-scroll ${themeBackgroundColor} ${
          activePageData && activePageData.class ? activePageData.class : ''
        }`}>
        <div
          className={`col-start-2 items-center col-end-5 w-full h-full col-span-3 flex flex-col mx-auto`}>
          {!fetchingLessonDetails && (
            <Toolbar
              setFields={setFields}
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

        <div className={`col-span-1`}>
          <NewLessonPlanSO
            editMode={editMode}
            setEditMode={setEditMode}
            fields={fields}
            setFields={setFields}
            pageDetails={editMode ? activePageData : {}} // don't send unwanted page details if not editing
            open={newLessonPlanShow}
            setOpen={setNewLessonPlanShow}
          />
        </div>
      </div>
    </>
  );
};
