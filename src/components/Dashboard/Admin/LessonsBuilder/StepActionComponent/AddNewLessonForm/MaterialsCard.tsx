import {Tabs, TabsProps} from 'antd';
import RichTextEditor from 'atoms/RichTextEditor';

const MaterialsCard = ({purposeHtml, studentMaterials, setEditorContent}: any) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Teacher`,
      children: (
        <div className="mt-5">
          <RichTextEditor
            initialValue={purposeHtml}
            onChange={(htmlContent, plainText) =>
              setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')
            }
          />
        </div>
      )
    },
    {
      key: '2',
      label: `Student`,
      children: (
        <div className="mt-5">
          <RichTextEditor
            initialValue={studentMaterials}
            onChange={(htmlContent, plainText) =>
              setEditorContent(htmlContent, plainText, 'studentMaterials', '')
            }
          />
        </div>
      )
    }
  ];

  return (
    <div className="">
      <Tabs defaultActiveKey="1" animated items={items} />
    </div>
  );
};

export default MaterialsCard;
