import ModalPopUp from '@components/Molecules/ModalPopUp';
import React, {Fragment, useContext, useState} from 'react';
import {useHistory} from 'react-router';
import * as mutations from '@graphql/mutations';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import AddButton from '../../../../Atoms/Buttons/AddButton';
import CurriculumListRow from './CurriculumListRow';
import API, {graphqlOperation} from '@aws-amplify/api';

interface CurriculumListProps {
  curricular: {items: {name?: string; id: string}[]};
  updateCurricularList?: any;
  instId: string;
  instName: string;
}

const CurriculumList = ({
  curricular,
  updateCurricularList,
  instId,
}: CurriculumListProps) => {
  // ~~~~~~~~~~ CONTEXT_SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;
  const {InstitueCurriculam} = useDictionary(clientKey);
  const history = useHistory();

  //  CHECK TO SEE IF CURRICULUM CAN BE DELETED  //

  /**********************************************************
   *   IF CURRICULUM HAS ANY AMOUNT OF SYLLABI ATTACHED,    *
   * OR IF THIS CURRICULUM HAS EVER HAD ANY ACTIVE SYLLABI, *
   *               THEN DO NOT ALLOW A DELETE               *
   **********************************************************/
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<any>({
    show: false,
    message: '',
    action: () => {},
  });

  const checkIfRemovable = (curriculumObj: any) => {
    if (
      curriculumObj.syllabi?.length > 0 ||
      (curriculumObj.syllabiHistory && curriculumObj.syllabiHistory?.length > 0)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleToggleDelete = (targetString?: string, itemObj?: any) => {
    if (!deleteModal.show) {
      setDeleteModal({
        show: true,
        message: `Are you sure you want to delete the course "${targetString}"?`,
        action: () => handleDelete(itemObj),
      });
    } else {
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  const handleDelete = async (item: any) => {
    setDeleting(true);
    try {
      console.log('deleting...');
      await API.graphql(
        graphqlOperation(mutations.deleteCurriculum, {
          input: {id: item.id},
        })
      );
      updateCurricularList(item);
    } catch (e) {
      console.error('error deleting...', e);
    } finally {
      setDeleting(false);
      setDeleteModal({show: false, message: '', action: () => {}});
    }
  };

  // ~~~~~~~~~~~~ FUNCTIONALITY ~~~~~~~~~~~~ //

  const createNewCurricular = () => {
    history.push(`/dashboard/manage-institutions/institution/${instId}/course-builder`);
  };

  const editCurrentCurricular = (id: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${instId}/course-builder/${id}`
    );
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //
  return (
    <div className="pt-0 flex m-auto justify-center h-full p-8">
      <div className="flex flex-col">
        {curricular.items && curricular.items.length > 0 ? (
          <Fragment>
            <div className="flex justify-between items-center w-full m-auto">
              <h3 className="text-lg leading-6 uppercase text-gray-600 w-auto">
                Courses
              </h3>
              <AddButton
                label={InstitueCurriculam[userLanguage]['BUTTON']['ADD']}
                onClick={createNewCurricular}
              />
            </div>
            <div className="w-full pt-8 m-auto border-b-0 border-gray-200">
              <div className="flex justify-between bg-gray-50 px-8 whitespace-nowrap">
                <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueCurriculam[userLanguage]['NO']}</span>
                </div>
                <div className="w-8/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{InstitueCurriculam[userLanguage]['NAME']}</span>
                </div>
                <div className="w-1/10 m-auto py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">
                    {InstitueCurriculam[userLanguage]['ACTION']}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8 w-full m-auto flex-1 overflow-y-auto">
              {curricular.items.map((item, index) => (
                <CurriculumListRow
                  key={`curr_list_row_${index}`}
                  index={index}
                  item={item}
                  checkIfRemovable={checkIfRemovable}
                  handleToggleDelete={handleToggleDelete}
                  editCurrentCurricular={editCurrentCurricular}
                />
              ))}
            </div>
            {deleteModal.show && (
              <ModalPopUp
                closeAction={handleToggleDelete}
                saveAction={deleting ? () => {} : deleteModal.action}
                saveLabel={deleting ? 'DELETING...' : 'CONFIRM'}
                cancelLabel="CANCEL"
                message={deleteModal.message}
              />
            )}
          </Fragment>
        ) : (
          <Fragment>
            <div className="flex justify-center mt-8">
              <AddButton
                className="mx-4"
                label={InstitueCurriculam[userLanguage]['BUTTON']['ADD']}
                onClick={createNewCurricular}
              />
            </div>
            <p className="text-center p-16">
              {' '}
              {InstitueCurriculam[userLanguage]['INFO']}
            </p>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default CurriculumList;
