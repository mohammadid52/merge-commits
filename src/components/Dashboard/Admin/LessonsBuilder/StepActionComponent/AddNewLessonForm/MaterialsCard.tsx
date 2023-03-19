import RichTextEditor from 'atoms/RichTextEditor';
import AnimatedContainer from '../../../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {
  Tabs2,
  useTabs
} from '../../../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';

const MaterialsCard = ({purposeHtml, studentMaterials, setEditorContent}: any) => {
  const tabs = [
    {name: 'Teacher', current: true},
    {name: 'Student', current: false}
  ];

  const {curTab, setCurTab, helpers} = useTabs(tabs);
  const [onTeacherTab, onStudentTab] = helpers;

  return (
    <div className="">
      <Tabs2 curTab={curTab} setCurTab={setCurTab} tabs={tabs} />

      <AnimatedContainer duration="500" animationType="translateY" show={onTeacherTab}>
        {onTeacherTab && (
          <div className="mt-5">
            <RichTextEditor
              initialValue={purposeHtml}
              onChange={(htmlContent, plainText) =>
                setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')
              }
            />
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer duration="500" animationType="translateY" show={onStudentTab}>
        {onStudentTab && (
          <div className="mt-5">
            <RichTextEditor
              initialValue={studentMaterials}
              onChange={(htmlContent, plainText) =>
                setEditorContent(htmlContent, plainText, 'studentMaterials', '')
              }
            />
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default MaterialsCard;
