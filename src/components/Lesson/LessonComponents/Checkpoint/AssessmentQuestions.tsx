import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
// import { useCookies } from "react-cookie";
import SelectOneQuestions from './Questions/SelectOneQuestions';
import TextQuestions from './Questions/TextQuestions';
import Pagination from '../../../General/Pagination';

const setInitialState = (array: Array<any>) => {
  let tempObj: any = {};
  array.forEach(
    (item: { question: { id: string; type: string; label: string } }) => {
      tempObj[item.question.id] =
        item.question.type === "text"
          ? ""
          : item.question.type === "input"
          ? ""
          : item.question.type === "selectOne"
          ? null
          : item.question.type === "selectMany"
          ? []
          : null;
    }
  );
  return tempObj;
};

interface CheckpointQuestionsProps {
  handleSetTitle?: React.Dispatch<React.SetStateAction<string>>;
}

const CheckpointQuestions = (props: CheckpointQuestionsProps) => {
  const { handleSetTitle } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const checkpoints = state.data.lesson.assessment.checkpoints.items;


  const [status, setStatus] = useState("");
  const [input, setInput] = useState<any>();
  const [data, setData] = useState(checkpoints);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(1);

  useEffect(() => {
    setData(checkpoints);
  }, []);

  // Get current data
  const indexOfLastPost = currentPage * dataPerPage;
  const indexOfFirstPost = indexOfLastPost - dataPerPage;
  const currentData = data.slice(indexOfFirstPost, indexOfLastPost);
  const currentId = data.slice(indexOfFirstPost, indexOfLastPost)

  const checkpoint = currentId.pop();

  /**
   * ON ASSESSMENT MOUNT
   */
  useEffect(() => {
    let questionDataKeys = [];

    if (state.questionData[checkpoint.checkpoint.id]) {
      questionDataKeys = Object.keys(
        state.questionData[checkpoint.checkpoint.id]
      );
    }

    if (!input && questionDataKeys.length > 0) {
      setInput(() => {
        return state.questionData[checkpoint.checkpoint.id];
      });
    }

    if (!input && questionDataKeys.length <= 0) {
      setInput(() => {
        return setInitialState(checkpoint.checkpoint.questions.items);
      });
    }

    setStatus("loaded");
  }, []);

  /**
   * ON CHECKPOINT/ASSESSMENT CHANGE
   */
  useEffect(() => {
    if (checkpoint.checkpoint.title) {
      handleSetTitle(checkpoint.checkpoint.title);
    }

    if (input && checkpoint.checkpoint.questions.items) {
      checkpoint.checkpoint.questions.items.forEach(
        (item: { question: { id: string; type: string; label: string } }) => {
          let inputKeys = Object.keys(input);
          let found = inputKeys.some((key: string) => {
            item.question.id === key;
          });

          if (!found) {
            setInput((prev: any) => {
              return {
                ...prev,
                [item.question.id]:
                  item.question.type === "text"
                    ? ""
                    : item.question.type === "input"
                    ? ""
                    : item.question.type === "selectOne"
                    ? null
                    : item.question.type === "selectMany"
                    ? []
                    : null
              };
            });
          }
        }
      );
    }
  }, [checkpoint]);

  const handleSelect = (e: any) => {
    const questionID = e.target.getAttribute("data-key");
    const { id } = e.target;

    let array;
    let found = input[questionID].some((item: string) => {
      return item === id;
    });

    if (found) {
      array = input[questionID].filter((item: string) => {
        return item !== id;
      });
    }

    if (!found) {
      array = input[questionID];
      array.push(id);
    }

    setInput({
      ...input,
      [questionID]: array
    });
  };

  useEffect(() => {
    if (input && state.questionData[checkpoint.checkpoint.id] !== input) {
      let dispatchInput: any = {};
      checkpoint.checkpoint.questions.items.forEach(
        (item: { question: { id: string; type: string; label: string } }) => {
          if (
            input[item.question.id] !== null &&
            input[item.question.id] !== undefined &&
            input[item.question.id] !== ""
          ) {
            dispatchInput[item.question.id] = input[item.question.id];
          }
        }
      );

      dispatch({
        type: "SET_QUESTION_DATA",
        payload: {
          key: checkpoint.checkpoint.id,
          data: dispatchInput
        }
      });
    }

  }, [input]);

  const handleInputChange = (e: any) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value
    });
  };

  const inputSwitch = (
    question: {
      id: string;
      label: string;
      options: Array<{
        label: string;
        icon: string;
        color: string;
        text: string;
      }>;
      question: string;
      type: string;
    },
    key: number
  ) => {
    switch (question.type) {
      case "input":
        return (
          <div key={key} className={"w-full flex flex-col mb-4 mx-2 mb-3"}>
            <label className="mb-2 text-lg" htmlFor={question.label}>
              {question.question}
            </label>
            <input
              id={question.id}
              className="w-9.5/10 py-2 px-4 text-gray-800 rounded-lg"
              type="text"
              name={question.label}
              value={input[question.id]}
              onChange={handleInputChange}
            />
          </div>
        );
      case "text":
        return (
          <TextQuestions
            keyProp={key}
            question={question}
            value={input[question.id]}
            handleInputChange={handleInputChange}
            checkpointID={checkpoint.checkpoint.id}
          />
        );
      case "selectOne":
        return (
          <SelectOneQuestions
            keyProp={key}
            question={question}
            value={input[question.id]}
            handleInputChange={handleInputChange}
            checkpointID={checkpoint.checkpoint.id}
          />
        );
      case "selectMany":
        return (
          <div className={`w-full flex flex-col mx-2 mb-3`}>
            <p className="mb-3 text-lg">{question.question}</p>
            <div id={question.label} className={"w-9.5/10 flex flex-col"}>
              {question.options.map(
                (
                  option: {
                    label: string;
                    icon: string;
                    color: string;
                    text: string;
                  },
                  key: any
                ) => (
                  <div
                    key={key}
                    className={`w-3/4 flex items-center mb-2`}
                    onClick={handleSelect}
                    data-key={question.id}
                  >
                    {input[question.id].indexOf(`${option.label}`) >= 0 ? (
                      <div
                        id={`${option.label}`}
                        className="cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center"
                        style={{ backgroundColor: `${option.color}` }}
                        data-key={question.id}
                      >
                        {option.icon ? option.icon : ""}
                      </div>
                    ) : (
                      <div
                        id={`${option.label}`}
                        className="bg-gray-400 shadow-2 cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center"
                        data-key={question.id}
                      >
                        {option.icon ? option.icon : ""}
                      </div>
                    )}
                    <div id={`${option.label}`} className="mx-4">
                      {option.text}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        );
      default:
        return "";
    }
  };


  if (status !== "loaded") return null;

  return (
    <div className="relative h-full w-full text-gray-200">
    <h4
      className={`w-full text-2xl font-open font-bold text-gray-200 ${
        checkpoint.checkpoint.subtitle ? 'border-b-2 border-gray-200 mb-2' : ''
      }`}>
      { checkpoint.checkpoint.subtitle ? checkpoint.checkpoint.subtitle : null }
    </h4>
    <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>{checkpoint.checkpoint.instructions}</div>

    <div className={`${theme.elem.text}`}>
    {currentData.map(
      (value: {
        position: any;
        checkpoint: {
          id: string;
          instructions: string;
          questions: { items: any };
        };
      }, key: number) => {
        return (
          <div className="flex flex-col h-full w-full justify-around items-center" key={key}>
            {value.checkpoint.questions.items.map(
              (item: any, key: number) => {
                return (
                  <div className="w-5/10 " key={key}> {inputSwitch(item.question, key)} </div>
                );
              }
            )}
          </div>
        );
      }
    )}
    
  </div>
  <Pagination
      data={checkpoints}
      dataPerPage={dataPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  </div>
  );
};

export default CheckpointQuestions;
