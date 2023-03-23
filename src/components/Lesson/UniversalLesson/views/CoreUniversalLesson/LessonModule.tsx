import Label from '@components/Atoms/Form/Label';
import {Modal} from 'antd';
import {UniversalLesson} from 'API';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {
  Tabs3,
  useTabs
} from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import map from 'lodash/map';
import Table, {ITableProps} from 'molecules/Table';
import {lazy, useState} from 'react';

const EvidenceTab = lazy(() => import('@components/Lesson/Components/EvidenceTab'));

const getFilteredUniversalSyllabus = (curriculum: any, lessonId: string) => {
  const assignedSyllabi = curriculum?.universalSyllabus?.items?.filter(
    (syllabus: any) => {
      const items = syllabus?.unit?.lessons?.items || [];
      const onlyLessonId = items.map((d: {lessonID: any}) => d.lessonID);
      return Boolean(onlyLessonId.includes(lessonId));
    }
  );
  return assignedSyllabi;
};

export const getSelectedCurriculum = (curriculums: any[], lessonId: string) => {
  let selectedCurriculums: any = [];
  curriculums.forEach((curriculum: any) => {
    const assignedSyllabi = getFilteredUniversalSyllabus(curriculum, lessonId);

    const isCourseAdded = assignedSyllabi.length > 0;

    isCourseAdded &&
      selectedCurriculums.push({
        ...curriculum,
        assignedSyllabi: assignedSyllabi.map((syllabus: any) => syllabus.unit.name),
        assignedSyllabusId: assignedSyllabi.map((syllabus: any) => syllabus.id)
      });
  });

  return selectedCurriculums;
};

const WithHtml = ({html, emptyText = '--'}: {html: string; emptyText: string}) => {
  return html && html.length > 0 && html !== '<p></p>' ? (
    <div>
      <span
        dangerouslySetInnerHTML={{__html: html || '<p>---</p>'}}
        className="text-gray-400  remove-draft-styles font-medium text-lg leading-7"
      />
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-32">
      <p className="text-gray-400 font-medium text-lg leading-3 w-auto">{emptyText}</p>
    </div>
  );
};

const LessonModule = ({currentLesson}: {currentLesson: UniversalLesson}) => {
  const [open, setOpen] = useState(true);
  const tabs = [
    {name: 'Objectives', current: true},
    {name: 'Evidences', current: false},
    {name: 'Resources', current: false}
  ];
  const [selectedMeasurements, setSelectedMeasurements] = useState<any[]>([]);
  const [checkedEvidence, setCheckedEvidence] = useState<any[]>([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState<any[]>([]);

  const {curTab, setCurTab, helpers} = useTabs(tabs);
  const [onObjectivesTab, onEvidencesTab, onResourcesTab] = helpers;

  const dataList = map(currentLesson?.lessonPlan, (lesson) => ({
    name: lesson?.label,
    onClick: () => {},
    time: `${lesson?.estTime} min`,
    instructions: lesson?.description || '--'
  }));

  const lessonPlanTableConfig: ITableProps = {
    headers: ['Name', 'Time', 'Instructions'],
    dataList
  };

  return (
    <Modal
      footer={null}
      // dark={Boolean(
      //   currentLesson?.darkMode !== undefined ? currentLesson?.darkMode : true
      // )}
      // subHeader={currentLesson?.summary || ''}
      title={`${currentLesson?.title} - Overview`}
      open={open}
      onCancel={() => setOpen(false)}>
      <div>
        <div className="my-2 border-b-0 border-gray-700 py-4 min-h-56">
          <Tabs3
            config={{fullColor: true}}
            setCurTab={setCurTab}
            curTab={curTab}
            tabs={tabs}
          />

          <div className="mt-4">
            <AnimatedContainer
              duration="500"
              show={onObjectivesTab}
              animationType="scale">
              {onObjectivesTab && (
                <>
                  <WithHtml
                    emptyText="No Objectives Listed"
                    html={currentLesson?.objectives?.[0] || ''}
                  />
                </>
              )}
            </AnimatedContainer>
            <AnimatedContainer duration="500" show={onResourcesTab} animationType="scale">
              {onResourcesTab && (
                <>
                  <WithHtml
                    emptyText="No Resources Listed"
                    html={currentLesson?.studentMaterials || ''}
                  />
                </>
              )}
            </AnimatedContainer>
            <AnimatedContainer duration="500" show={onEvidencesTab} animationType="scale">
              {onEvidencesTab && (
                <EvidenceTab
                  selectedMeasurements={selectedMeasurements}
                  setSelectedMeasurements={setSelectedMeasurements}
                  checkedEvidence={checkedEvidence}
                  setCheckedEvidence={setCheckedEvidence}
                  curTab={curTab}
                  selectedCurriculumList={selectedCurriculumList}
                  setSelectedCurriculumList={setSelectedCurriculumList}
                  currentLesson={currentLesson}
                />
              )}
            </AnimatedContainer>
          </div>
        </div>
        <div className="min-h-56 py-4">
          <Label label="Lesson Plan" />

          <Table {...lessonPlanTableConfig} />
        </div>
      </div>
    </Modal>
  );
};

export default LessonModule;
