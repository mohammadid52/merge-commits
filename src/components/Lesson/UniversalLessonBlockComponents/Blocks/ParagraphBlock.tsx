import { useGlobalContext } from "contexts/GlobalContext";
import { RowWrapperProps } from "interfaces/UniversalLessonBuilderInterfaces";
import React from "react";

interface ParagraphBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  pagePartId: string;
}

export const ParagraphBlock = (props: ParagraphBlockProps) => {
  const { id, value } = props;
  const {
    state: { lessonPage: { themeTextColor = "" } = {} },
  } = useGlobalContext();

  const Paragraph = ({ inputID, inputValue }: any) => {
    return (
      <div className="flex w-auto items-center paragraph-block">
        <p
          key={inputID}
          id={inputID}
          dangerouslySetInnerHTML={{ __html: inputValue?.value || "<p></p>" }}
          className={`whitespace-pre-wrap remove-draft-styles  ${themeTextColor}`}
        ></p>
      </div>
    );
  };

  return (
    <div className="w-auto">
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => (
          <React.Fragment key={`paragraphBlock_${i}`}>
            {/* {composeParagraph(id, v, type)} */}
            <Paragraph inputID={id} inputValue={v} />
          </React.Fragment>
        ))}
    </div>
  );
};
