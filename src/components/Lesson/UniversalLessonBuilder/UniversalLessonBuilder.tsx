import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {LessonPlansProps} from '../../Dashboard/Admin/LessonsBuilder/LessonEdit';
import BuilderWrapper from './views/BuilderWrapper';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../interfaces/UniversalLessonInterfaces';
import {exampleUniversalLesson} from './example_data/exampleUniversalLessonData';
import {ULBSelectionProps} from '../../../interfaces/UniversalLessonBuilderInterfaces';
import {filter} from 'rxjs/operators';

interface UniversalLessonBuilderProps extends ULBSelectionProps {
  designersList?: {id: string; name: string; value: string}[];
  lessonID?: string;
  lessonPlans?: LessonPlansProps[] | null;
  updateLessonPlan?: (plan: LessonPlansProps[]) => void;
  setUnsavedChanges?: (val: boolean) => void;
  activeStep?: string;
  lessonName?: string;
  lessonType?: string;
}

/*******************************************
 * INITIAL VALUES                          *
 *******************************************/
const initialUniversalLessonData: UniversalLesson = {
  id: '',
  summary: '',
  designers: [''],
  teachers: [''],
  categories: [''],
  universalLessonPlan: [],
  universalLessonPages: [],
};

const initialUniversalLessonPage: UniversalLessonPage = {
  id: '',
  title: '',
  description: '',
  class: '',
  pageContent: [],
};

const initialUniversalLessonPagePart: PagePart = {
  id: '',
  partType: 'default',
  class: '',
  partContent: [],
};

const initialUniversalLessonPagePartContent: PartContent = {
  id: '',
  type: '',
  value: [],
};

/*******************************************
 * THE BUILDER PARENT                      *
 *******************************************/
const UniversalLessonBuilder = (props: UniversalLessonBuilderProps) => {
  const {state, dispatch} = useContext(GlobalContext);

  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(() => {
    if (state.user.role === 'TR' || state.user.role === 'FLW') {
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'universal-lesson-builder'}});
    }
  }, [state.user.role]);

  /**********************************************
   * FUNCTIONALITY AND DATA FETCHES WILL
   * BE DONE BELOW THIS AREA
   *
   * setUniversalLessonDetails will be updated
   * here
   **********************************************/

  // in this area ^
  useEffect(() => {
    setUniversalLessonDetails(exampleUniversalLesson);
  }, []);

  //  WHICH COMPONENT DO WE RETURN?
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'BuilderWrapper':
        return (
          <BuilderWrapper
            mode={`building`}
            deleteFromULBHandler={deleteULBHandler}
            universalLessonDetails={universalLessonDetails}
            universalBuilderStep={universalBuilderStep}
            setUniversalBuilderStep={setUniversalBuilderStep}
            selectedPageID={selectedPageID}
            setSelectedPageID={setSelectedPageID}
            initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
          />
        );
      default:
        return <h1>Current Universal Builder step is invalid</h1>;
    }
  };

  //  CORE DATA MANAGEMENT
  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );
  const [selectedPageID, setSelectedPageID] = useState<string>('');


  const listPages = universalLessonDetails.universalLessonPages;
  const getPage = universalLessonDetails.universalLessonPages.find(
    (thePage: UniversalLessonPage) => thePage.id === selectedPageID
  );

  /**
   *
   *
   * C(not R)UD
   *
   *
   * */

  const loopThroughPartContent = (
    partContentArray: PartContent[],
    operation: 'create' | 'update' | 'delete',
    idForTargeting: string
  ) => {
    return partContentArray.reduce((acc: PartContent[], val: PartContent) => {
      if (val.id === idForTargeting) {
        return acc;
      } else {
        return [...acc, val];
      }
    }, []);
  };

  const loopThroughPageContent = (
    pageContentArray: PagePart[],
    operation: 'create' | 'updated' | 'delete',
    idForTargeting: string
  ) => {
    return pageContentArray.reduce((acc: PagePart[], val: PagePart) => {
      if (val.id === idForTargeting) {
        return acc;
      } else {
        return [
          ...acc,
          {
            ...val,
            partContent: loopThroughPartContent(
              val.partContent,
              'delete',
              idForTargeting
            ),
          },
        ];
      }
    }, []);
  };

  const loopThroughPages = (
    pagesArray: UniversalLessonPage[],
    operation: 'create' | 'updated' | 'delete',
    idForTargeting: string
  ) => {
    return pagesArray.reduce((acc: UniversalLessonPage[], val: UniversalLessonPage) => {
      if (val.id === idForTargeting) {
        return acc;
      } else {
        return [...acc, val];
      }
    }, []);
  };

  const deleteULBHandler = (targetID:string, targetSpec?: 'page' | 'part' | 'content') => {
    const updatedLessonDetails = () => {
      switch (targetSpec) {
        case 'page':
          const updatedPages = loopThroughPages(listPages, 'delete', targetID);
          return {...universalLessonDetails, universalLessonPages: updatedPages}
        case 'part':
          const updatedPageContent = loopThroughPageContent(
            getPage.pageContent,
            'delete',
            targetID
          );
          return {
            ...universalLessonDetails,
            universalLessonPages: universalLessonDetails.universalLessonPages.map(
              (thePage: UniversalLessonPage) => {
                if (thePage.id === selectedPageID) {
                  return {...thePage, pageContent: updatedPageContent};
                } else {
                  return thePage;
                }
              }
            ),
          };
        case 'content':
        default:
          break;
      }
    }
    setUniversalLessonDetails(updatedLessonDetails());
  };

  return (
    /**
     *
     *  Pages:
     *    1. lesson overview page
     *    2. create new & edit page (similar)
     *    3. add a page part dialog
     *    4. apply a template dialog
     *    5. builder body
     *
     */
    <div
      id={`universalLessonBuilder`}
      className="h-full flex bg-white shadow-5 sm:rounded-lg">
      {currentStepComp(universalBuilderStep)}
    </div>
  );
};

export default UniversalLessonBuilder;
