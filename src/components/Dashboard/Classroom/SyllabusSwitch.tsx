import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useHistory} from 'react-router';
import {DashboardProps} from '../Dashboard';

import {Syllabus} from '@interfaces/ClassroomInterface';
import {Empty, Radio, Tooltip} from 'antd';
import Buttons from 'atoms/Buttons';

const SyllabusSwitch = ({
  classRoomActiveSyllabus,
  curriculumName,
  activeRoom,

  syllabusLoading,
  handleSyllabusActivation,
  institutionId,
  syllabusActivating
}: DashboardProps) => {
  const history = useHistory();
  const {state} = useGlobalContext();
  const {classRoomDict, userLanguage} = useDictionary();

  const plainOptions = state.roomData?.syllabus?.map((syllabus: Syllabus) => {
    return {
      label: syllabus.name,
      value: syllabus.id
    };
  });

  const currentActive = plainOptions?.find(
    (option) => option.value === classRoomActiveSyllabus
  )?.label;

  return (
    <>
      {syllabusLoading ? (
        <Radio.Group
          disabled
          optionType="button"
          options={[{label: 'Loading...', value: 'Loading...'}]}
        />
      ) : state.roomData?.syllabus?.length ? (
        <Tooltip
          arrow={false}
          showArrow={false}
          title={
            syllabusActivating
              ? 'active unit switching'
              : `${currentActive} is active unit`
          }>
          <Radio.Group
            disabled={syllabusActivating || syllabusLoading}
            optionType="button"
            options={plainOptions}
            onChange={(e) => handleSyllabusActivation?.(e.target.value)}
            value={classRoomActiveSyllabus}
          />
        </Tooltip>
      ) : (
        <Empty
          description={`No units or lessons have been created for ${curriculumName}. Please complete
        curriculum set up to continue.`}>
          <Buttons
            size="middle"
            label="Go to Curriculum"
            className="w-full mb-4"
            onClick={() =>
              history.push(
                `/dashboard/manage-institutions/institution?id=${institutionId}&tab=curricular`
              )
            }
          />
        </Empty>
      )}

      {!syllabusLoading ? (
        activeRoom === '' ? (
          <div className={`py-4 px-6 bg-white rounded-lg shadow`}>
            <p>⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_SYLLABUS}...</p>
          </div>
        ) : (
          activeRoom !== '' &&
          !state.roomData?.syllabus?.length && (
            <div className={`py-4 px-6 bg-white rounded-lg shadow`}>
              <p>⬅️ {classRoomDict[userLanguage].MESSAGES.SELECT_SYLLABUS}...</p>
            </div>
          )
        )
      ) : null}
    </>
  );
};

export default SyllabusSwitch;
