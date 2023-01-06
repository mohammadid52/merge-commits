import Highlighted from 'atoms/Highlighted';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import React, {useContext, useState} from 'react';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {useHistory, useRouteMatch} from 'react-router-dom';
import Popover from 'atoms/Popover';
import {Status} from '../UserManagement/UserStatus';
import {RoomStatus} from 'API';

interface ICloneModalProps {
  show: boolean;
  lessonId: string;
}

interface LessonsListRow {
  id: string;
  index: number;
  institution: {
    id: string;
    name: string;
  };
  title: string;
  type: string;
  languages: string[];
  lessonObject?: any;
  status: RoomStatus;
  checkIfRemovable?: any;
  handleToggleDelete?: any;
  createdAt: Date;
  updatedAt: Date;
  zebraStripping?: boolean;
  targetAudience?: string;
  setShowCloneModal?: React.Dispatch<React.SetStateAction<ICloneModalProps>>;
  isSuperAdmin?: boolean;
  redirectToInstitution: () => void;
  searchTerm?: string;
}

const LessonsListRow = (props: LessonsListRow) => {
  const match: any = useRouteMatch();
  const history = useHistory();
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonsListDict} = useDictionary(clientKey);

  const handleLessonsEdit = (type: string) => {
    history.push(`${match.url}/${id}`);
  };

  const {
    id,
    index,
    institution: {name: institutionName},
    title,
    type,
    languages,
    lessonObject,
    checkIfRemovable,
    handleToggleDelete,
    isSuperAdmin,
    setShowCloneModal,
    targetAudience,
    createdAt,
    updatedAt,
    redirectToInstitution,
    searchTerm,
    status
  } = props;

  const [showMenu, setShowMenu] = useState(false);

  const onCloneLesson = () => {
    setShowCloneModal({show: true, lessonId: id});
    setShowMenu(false);
  };

  const textClass = `text-sm leading-5 text-gray-800 hover:iconoclast:text-500 transition-all duration-50 hover:curate:text-500`;

  return (
    <td
      id={id}
      className={`flex justify-between  bg-white w-full border-b-0 border-gray-200 ${
        props.zebraStripping && index % 2 !== 0 ? 'bg-gray-50' : ''
      } hover:bg-gray-200 transition-all`}>
      <tr className="w-.5/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 font-medium">
        {index + 1}.
      </tr>
      <tr
        title={title ? title : '--'}
        className={`${
          isSuperAdmin ? 'w-1.5/10' : 'w-3/10'
        } flex items-center px-8 py-4 cursor-pointer text-sm leading-5 font-medium whitespace-normal`}
        onClick={() => handleLessonsEdit(type)}>
        <Highlighted text={title} highlight={searchTerm} />
      </tr>
      {isSuperAdmin && (
        <tr
          className="w-1.5/10 flex items-center px-8 py-4 hover:text-gray-600 text-sm leading-5 font-bold text-gray-900 whitespace-normal cursor-pointer"
          onClick={redirectToInstitution}>
          <span>{institutionName || '--'}</span>
        </tr>
      )}

      <tr className="w-1/10 flex justify-start items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">{type ? type : '--'}</span>
      </tr>

      <tr className="w-1.5/10 flex justify-start items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        {targetAudience || '-'}
      </tr>

      <tr className="w-1.5/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <Status
          className={
            status?.toLowerCase() === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }>
          {status || RoomStatus.ACTIVE}
        </Status>
      </tr>

      <tr className="w-1.5/10 flex justify-center items-center px-8 py-4 whitespace-normal text-sm leading-5 text-gray-500">
        <span className="w-auto">
          {updatedAt ? new Date(updatedAt).toLocaleDateString() : '--'}
        </span>
      </tr>

      <tr
        className={`w-1/10 flex justify-center items-center pr-4 py-4 whitespace-nowrap text-sm leading-5 font-medium`}>
        <span className="w-auto">
          <Popover
            show={showMenu}
            bottom={0.6}
            dir={'top'}
            minWidth={48}
            minHeight={16}
            rounded="lg"
            setShow={setShowMenu}
            content={
              <dl className="grid grid-cols-1 gap-y-3">
                <div className="col-span-1">
                  <dt
                    onClick={() => handleLessonsEdit(type)}
                    className={`${textClass} cursor-pointer`}>
                    Edit
                  </dt>
                </div>
                <div className="col-span-1">
                  <dt onClick={onCloneLesson} className={`${textClass} cursor-pointer`}>
                    Clone Lesson
                  </dt>
                </div>
                <div className="col-span-1">
                  {checkIfRemovable(lessonObject) ? (
                    <dt
                      onClick={() => handleToggleDelete(title, lessonObject)}
                      className={`cursor-pointer text-red-500 hover:text-red-600`}>
                      {/* <HiOutlineTrash className="w-4 h-4 pointer-events-none" /> */}
                      Delete
                    </dt>
                  ) : (
                    <dt
                      className={`text-center text-gray-500 flex flex-row text-xs pointer-events-none`}>
                      <span className="w-auto">
                        Delete {LessonsListDict[userLanguage]['NO_DELETE']}
                      </span>
                    </dt>
                  )}
                </div>
              </dl>
            }>
            <span className="h-6 w-6 flex items-center justify-center p-1 hover:bg-gray-200 transition-all cursor-pointer rounded-full">
              <BiDotsVerticalRounded
                title="show menu"
                className="h-full w-full text-lg text-gray-500"
              />
            </span>
          </Popover>
        </span>
      </tr>
    </td>
  );
};

export default LessonsListRow;
