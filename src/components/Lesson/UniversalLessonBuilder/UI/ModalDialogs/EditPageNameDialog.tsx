import {findIndex, update} from 'lodash';
import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import {EditQuestionModalDict} from '../../../../../dictionary/dictionary.iconoclast';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';

const EditPageNameDialog = ({content, closeAction, editOnlyId}: any) => {
  const ID_VALUE: string = content.partContentId || content.pageContentId;
  const [updatedID, setUpdatedID] = useState(ID_VALUE);
  const [updatedValues, setUpdatedValues] = useState({
    id: content.id,
    title: content.title,
    description: content.description,
    label: content.label,
  });

  const {userLanguage} = useContext(GlobalContext);
  const {
    universalLessonDetails,
    setUniversalLessonDetails,
    selectedPageID,
    setSelectedPageID,
  } = useULBContext();

  // to update id
  // #1 - Find current pageObject by id
  // #2 - nav to obj.pageContent
  // #3 - check the contentId
  // #4 - if found the update that
  // #5 - else go map to partContent find object by id and update that

  const updateId = () => {
    closeAction();

    const PAGECONTENT_ID = content.pageContentId;
    const PARTCONTENT_ID = content?.partContentId;
    const pageIdx = findIndex(
      universalLessonDetails.lessonPlan,
      (item: any) => item.id === selectedPageID
    );
    const pageContentIdx = findIndex(
      universalLessonDetails.lessonPlan[pageIdx].pageContent,
      (item: any) => item.id === PAGECONTENT_ID
    );

    const PATH_TO_PAGECONTENT = `lessonPlan[${pageIdx}].pageContent[${pageContentIdx}]`;

    const partContentIdx =
      PARTCONTENT_ID &&
      findIndex(
        universalLessonDetails.lessonPlan[pageIdx].pageContent[pageContentIdx]
          .partContent,
        (item: any) => item.id === PARTCONTENT_ID
      );

    update(
      universalLessonDetails,
      PARTCONTENT_ID
        ? `${PATH_TO_PAGECONTENT}.partContent[${partContentIdx}].id`
        : `${PATH_TO_PAGECONTENT}.id`,
      () => {
        return updatedID;
      }
    );

    setUniversalLessonDetails({...universalLessonDetails});
  };

  const updateData = () => {
    closeAction();

    const PAGECONTENT_ID = content.id;

    const pageIdx = findIndex(
      universalLessonDetails.lessonPlan,
      (item: any) => item.id === PAGECONTENT_ID
    );

    const PATH_TO_PAGECONTENT = `lessonPlan[${pageIdx}]`;
    const updatedObject = {
      ...universalLessonDetails.lessonPlan[pageIdx],
      id: updatedValues.id,
      title: updatedValues.title,
      description: updatedValues.description,
      label: updatedValues.label,
    };

    update(universalLessonDetails, PATH_TO_PAGECONTENT, () => {
      return updatedObject;
    });

    setUniversalLessonDetails({...universalLessonDetails});
    if (selectedPageID === PAGECONTENT_ID) {
      setSelectedPageID(updatedValues.id);
    }
  };

  const onChange = (e: any) => {
    const {id, value} = e.target;
    setUpdatedValues({...updatedValues, [id]: value});
  };

  return (
    <div>
      {editOnlyId ? (
        <FormInput
          label={'Edit Id'}
          value={updatedID}
          onChange={(e) => setUpdatedID(e.target.value)}
        />
      ) : (
        <div>
          <div className="mb-4">
            <FormInput
              value={updatedValues.id}
              label={'Edit Id'}
              onChange={onChange}
              id={'id'}
            />
          </div>

          <div className="mb-4">
            <FormInput
              label={'Edit Label'}
              value={updatedValues.label}
              onChange={onChange}
              id={'label'}
            />
          </div>
          <div className="mb-4">
            <FormInput
              label={'Edit Title'}
              value={updatedValues.title}
              onChange={onChange}
              id={'title'}
            />
          </div>
          <div className="mb-4">
            <FormInput
              label={'Edit Description'}
              value={updatedValues.description}
              onChange={onChange}
              id={'description'}
            />
          </div>
        </div>
      )}

      <div className="flex mt-8 justify-center px-6 pb-4">
        <div className="flex justify-end">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
            onClick={closeAction}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
            onClick={content.editOnlyId ? () => updateId() : () => updateData()}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPageNameDialog;
