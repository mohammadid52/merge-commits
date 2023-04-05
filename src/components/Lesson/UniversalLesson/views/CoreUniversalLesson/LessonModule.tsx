import Label from '@components/Atoms/Form/Label';
import {Modal, Table, Tabs, TabsProps} from 'antd';
import {UniversalLesson} from 'API';

import map from 'lodash/map';

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
        className="text-light   remove-draft-styles font-medium text-lg leading-7"
      />
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-32">
      <p className="text-light  font-medium text-lg leading-3 w-auto">{emptyText}</p>
    </div>
  );
};

const LessonModule = ({currentLesson}: {currentLesson: UniversalLesson}) => {
  const [open, setOpen] = useState(true);

  const [selectedMeasurements, setSelectedMeasurements] = useState<any[]>([]);
  const [checkedEvidence, setCheckedEvidence] = useState<any[]>([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState<any[]>([]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Objectives',
      children: (
        <WithHtml
          emptyText="No Objectives Listed"
          html={currentLesson?.objectives?.[0] || ''}
        />
      )
    },

    {
      key: '2',
      label: 'Evidences',
      children: (
        <WithHtml
          emptyText="No Resources Listed"
          html={currentLesson?.studentMaterials || ''}
        />
      )
    },

    {
      key: '3',
      label: 'Resources',
      children: (
        <EvidenceTab
          selectedMeasurements={selectedMeasurements}
          setSelectedMeasurements={setSelectedMeasurements}
          checkedEvidence={checkedEvidence}
          setCheckedEvidence={setCheckedEvidence}
          selectedCurriculumList={selectedCurriculumList}
          setSelectedCurriculumList={setSelectedCurriculumList}
          currentLesson={currentLesson}
        />
      )
    }
  ];

  const dataList = map(currentLesson?.lessonPlan, (lesson) => ({
    name: lesson?.label,
    key: lesson?.id,
    time: `${lesson?.estTime} min`,
    instructions: lesson?.description || '<p>---</p>'
  }));

  const lessonPlanTableConfig = {
    dataSource: dataList,
    className: 'universal-table dark-table mt-2',
    columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time'
      },
      {
        title: 'Instructions',
        dataIndex: 'instructions',
        key: 'instructions',
        render: (text: string) => <WithHtml html={text} emptyText="--" />
      }
    ]
  };

  return (
    <Modal
      footer={null}
      width={1000}
      className="dark-modal"
      title={`${currentLesson?.title} - Overview`}
      open={open}
      onCancel={() => setOpen(false)}>
      <div className="bg-dark-blue">
        <Tabs items={items} className="dark-tabs" defaultActiveKey="1" />

        <div className="min-h-56 py-4">
          <Label dark label="Lesson Plan" />

          <Table {...lessonPlanTableConfig} />
        </div>
      </div>
    </Modal>
  );
};

export default LessonModule;
