import Buttons from "@components/Atoms/Buttons";
import AnimatedContainer from "components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer";

interface NextButtonProps {
  onClick: () => void;
  countSelected: number;
}

const NextButton = ({ onClick, countSelected }: NextButtonProps) => {
  return (
    <div className={"flex items-center gap-x-6 justify-center"}>
      <AnimatedContainer className="w-auto" show={countSelected === null}>
        {countSelected === null && (
          <Buttons
            // disabled={isActive}
            onClick={onClick}
            // className={classNames(
            //   commonBtnClass,
            //   // isActive ? "bg-opacity-70 pointer-events-none" : "",
            //   ' px-4 py-2  bg-teal-500 hover:bg-teal-600  rounded-lg text-white'
            // )}
            label="Start"
          />
        )}
      </AnimatedContainer>
    </div>
  );
};

export default NextButton;
