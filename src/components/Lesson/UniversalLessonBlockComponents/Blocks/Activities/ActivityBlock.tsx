import Counter from "components/Dashboard/GameChangers/components/Counter";
import SelectedCard from "components/Dashboard/GameChangers/components/SelectedCard";
import { useGameChangers } from "components/Dashboard/GameChangers/context/GameChangersContext";
import { cardsList } from "components/Dashboard/GameChangers/__contstants";
import { useGlobalContext } from "contexts/GlobalContext";
import { useEffect } from "react";
import AnimatedContainer from "uiComponents/Tabs/AnimatedContainer";

const ActivityBlock = ({ value }: { value: any }) => {
  const { selectedCard, setSelectedCard } = useGameChangers();

  useEffect(() => {
    const initialValue: string = value[0]?.value;

    if (initialValue && selectedCard === null) {
      const card = cardsList.find((card) => initialValue.includes(card.type));

      if (card) {
        setSelectedCard(card?.id);
      }
    }
  }, [value, selectedCard]);

  const onClick = (_: number | null) => {};
  const {
    state: { lessonPage: { themeTextColor = "" } = {} },
  } = useGlobalContext();

  if (selectedCard === null) {
    return <div />;
  } else
    return (
      <AnimatedContainer
        duration={"1000"}
        animationType={"translateY"}
        className="h-full flex items-center justify-center flex-col"
        show={selectedCard !== null && selectedCard !== undefined}
      >
        {selectedCard !== null && selectedCard !== undefined && (
          <div className="">
            {value[0]?.label && selectedCard === 3 && (
              <h3
                className={`relative  w-full flex font-medium  text-3xl px-4  text-left flex-row items-center ${themeTextColor} mt-4 mb-2"`}
              >
                {value[0]?.label}
              </h3>
            )}
            <SelectedCard
              inLesson
              onClick={onClick}
              card={cardsList.find((c) => c.id === selectedCard)}
            />
          </div>
        )}
        <Counter />
      </AnimatedContainer>
    );
};

export default ActivityBlock;
