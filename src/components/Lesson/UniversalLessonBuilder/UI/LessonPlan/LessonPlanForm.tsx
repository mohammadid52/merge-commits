import Buttons from "atoms/Buttons";
import FormInput from "atoms/Form/FormInput";
import Selector from "atoms/Form/Selector";
import TextArea from "atoms/Form/TextArea";
import { API, graphqlOperation } from "aws-amplify";
import { useGlobalContext } from "contexts/GlobalContext";
import { useULBContext } from "contexts/UniversalLessonBuilderContext";
import * as customMutations from "customGraphql/customMutations";
import useDictionary from "customHooks/dictionary";
import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { estimatedTimeList } from "utilities/staticData";
import { v4 as uuidV4 } from "uuid";

interface ILessonInputs {
  id: string;
  label: string;
  title: string;
  description: string;
  estTime: string;
}

const LessonPlanForm = () => {
  const history = useHistory();
  const { userLanguage } = useGlobalContext();
  const { BUTTONS, LessonBuilderDict } = useDictionary();
  const { universalLessonDetails, setActiveTab } = useULBContext();
  const [inputObj, setInputObj] = useState<ILessonInputs>({
    id: "",
    label: "",
    title: "",
    description: "",
    estTime: "1 min",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  // const lessonId = params.get('lessonId');
  const route: any = useRouteMatch();

  const lessonId = route.params.lessonId;
  const pages = universalLessonDetails?.lessonPlan;

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name: string = (event.target as HTMLInputElement).name;
    const value: string = (event.target as HTMLInputElement).value;
    setInputObj((prevInputs: ILessonInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
    setErrors((errors: any) => ({
      ...errors,
      [name]: "",
    }));
  };

  const createPage = async () => {
    const isValid = validateForm();
    if (isValid) {
      try {
        setLoading(true);
        const input = {
          id: lessonId,
          lessonPlan: [
            ...pages,
            {
              id: uuidV4().toString(),
              title: inputObj.title,
              label: inputObj.label,
              description: inputObj.description,
              pageContent: [],
              estTime: Number(inputObj.estTime?.split(" ")[0]),
            },
          ],
        };
        const res: any = await API.graphql(
          graphqlOperation(customMutations.updateUniversalLesson, {
            input,
          })
        );
        const data = res.data.updateUniversalLesson;
        setLoading(false);
        if (data) {
          setActiveTab(1);
          history.push(
            `/dashboard/lesson-builder/lesson/edit?lessonId=${lessonId}&step=activities`
          );
        }
      } catch (error) {
        setLoading(false);
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const { label = "", title = "" } = inputObj;
    let isValid = true,
      formErrors: any = {};

    if (!label) {
      isValid = false;
      formErrors.label = "Label is required";
    }
    if (!title) {
      isValid = false;
      formErrors.title = "Title is required";
    }
    setErrors(formErrors);
    return isValid;
  };

  const onSelectOption = (_: any, name: string) => {
    setInputObj((prevInputs: ILessonInputs) => ({
      ...prevInputs,
      estTime: name,
    }));
  };

  return (
    <div className="w-full m-auto">
      <div className="mb-4">
        <div className="p-4">
          <div className="py-2">
            <div className="grid grid-cols-3">
              <div className="p-2">
                <FormInput
                  label={
                    LessonBuilderDict[userLanguage]["LESSON_PLAN_FORM"].LABEL
                  }
                  value={inputObj.label}
                  onChange={onInputChange}
                  name={"label"}
                  isRequired={true}
                  error={errors.label}
                  maxLength={12}
                  showCharacterUsage
                />
              </div>
              <div className="p-2">
                <FormInput
                  label={
                    LessonBuilderDict[userLanguage]["LESSON_PLAN_FORM"].TITLE
                  }
                  value={inputObj.title}
                  onChange={onInputChange}
                  name={"title"}
                  isRequired={true}
                  error={errors.title}
                />
              </div>
              <div className="p-2">
                <Selector
                  label={
                    LessonBuilderDict[userLanguage]["LESSON_PLAN_FORM"]
                      .ESTIMATED_TIME
                  }
                  placeholder={"Select estimate time"}
                  list={estimatedTimeList}
                  selectedItem={inputObj.estTime}
                  onChange={onSelectOption}
                />
              </div>
            </div>
            <div className="p-2">
              <TextArea
                error={errors.description}
                label={
                  LessonBuilderDict[userLanguage]["LESSON_PLAN_FORM"]
                    .DESCRIPTION
                }
                name={"description"}
                onChange={onInputChange}
                rows={2}
                value={inputObj.description}
              />
            </div>
          </div>
          <div className="flex mt-4 justify-center px-6 pb-4">
            <div className="flex justify-end">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                disabled={loading}
                label={
                  loading
                    ? BUTTONS[userLanguage]["SAVING"]
                    : BUTTONS[userLanguage]["SAVE"]
                }
                type="submit"
                onClick={createPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanForm;
