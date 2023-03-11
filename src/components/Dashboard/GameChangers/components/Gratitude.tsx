import CustomRichTextEditor from "@components/Lesson/UniversalLessonBlockComponents/Blocks/HighlighterBlock/CustomRichTextEditor";
import { useGlobalContext } from "@contexts/GlobalContext";
import {
  CreateGameChangerInput,
  CreateGameChangerLogInput,
  GameChangerLog,
} from "API";
import { getAsset } from "assets";
import Buttons from "atoms/Buttons";
import { GRATITUDE } from "components/Lesson/UniversalLessonBuilder/UI/common/constants";
import AnimatedContainer from "components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer";
import useAuth from "customHooks/useAuth";
import useGraphqlMutation from "customHooks/useGraphqlMutation";
import { nanoid } from "nanoid";
import { useState } from "react";
import { awsFormatDate, dateString } from "utilities/time";
import { useGameChangers } from "../context/GameChangersContext";

const Gratitude = () => {
  const { email, authId } = useAuth();
  const { clientKey } = useGlobalContext();

  const [_, setError] = useState("");

  const { setIsCompleted, isCompleted } = useGameChangers();
  const [fields, setFields] = useState({
    summary: "",
    summaryHtml: "<p>1.</p>\n<p>2.</p>\n<p>3.</p>\n",
  });

  const mutationLog = useGraphqlMutation<
    { input: CreateGameChangerLogInput },
    GameChangerLog
  >("createGameChangerLog", {
    onSuccess: () => {
      setIsCompleted(true);
    },
  });

  const mutation = useGraphqlMutation<
    { input: CreateGameChangerInput },
    GameChangerLog
  >("createGameChanger");

  const onEditorStateChange = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setError("");
    setFields({ ...fields, [field]: text, [fieldHtml]: html });
  };

  const onSave = () => {
    const gameChangerID = nanoid(24);

    mutation.mutate({
      input: {
        id: gameChangerID,
        gameChangerName: GRATITUDE,
        objective: fields.summaryHtml,
      },
    });

    mutationLog.mutate({
      input: {
        id: nanoid(24),
        gameChangerID,
        personAuthID: authId,
        personEmail: email,
        startTime: awsFormatDate(dateString("-", "WORLD")),
      },
    });
  };

  // useEffect(() => {
  //   gsap.fromTo(
  //     '#journal-editor',
  //     {
  //       delay: 1,
  //       height: 0,
  //       duration: 2,
  //       opacity: 0
  //     },
  //     {height: 'auto', opacity: 1, delay: 1}
  //   );
  // }, []);
  const themeColor = getAsset(clientKey, "themeClassName");
  const features: string[] = ["colorPicker", "inline"];

  return (
    <>
      <AnimatedContainer show={!isCompleted}>
        {!isCompleted && (
          <div>
            <h1 className="text-2xl text-white mb-4">
              Write down 3 things that you feel grateful for right now.
            </h1>
            <div id="journal-editor">
              <CustomRichTextEditor
                theme={themeColor}
                withStyles
                features={features}
                rounded
                customStyle
                dark
                initialValue={fields.summaryHtml}
                onChange={(htmlContent, plainText) =>
                  onEditorStateChange(
                    htmlContent,
                    plainText,
                    "summaryHtml",
                    "summary"
                  )
                }
              />

              <div className="w-auto flex items-center justify-end mt-4">
                <Buttons
                  onClick={onSave}
                  label={
                    mutationLog.isLoading || mutation.isLoading
                      ? "saving"
                      : "save"
                  }
                />
              </div>
            </div>
          </div>
        )}
      </AnimatedContainer>
    </>
  );
};

export default Gratitude;
