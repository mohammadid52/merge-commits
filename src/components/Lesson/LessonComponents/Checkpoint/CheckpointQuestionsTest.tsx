import React, { useState, useContext, useEffect } from "react";
import { LessonContext } from "../../../../contexts/LessonContext";
import queryString from "query-string";
import { useCookies } from "react-cookie";
import SelectOneQuestions from "./Questions/SelectOneQuestions";
import TextQuestions from "./Questions/TextQuestions";
import Pagination from "../../../General/Pagination";

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
  handleSetTitle: React.Dispatch<React.SetStateAction<string>>;
}

const CheckpointQuestions = (props: CheckpointQuestionsProps) => {

  const { handleSetTitle } = props;
  const { state, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies(["questionData"]);
  const queryParams = queryString.parse(location.search);
//   console.log("params", queryParams);

  const testCheck = [
    {
      position: 1,
      checkpoint: {
        id: "2",
        title: "Checkpoint",
        instructions:
          "Please tell us how easy or difficult each of the following are for you",
        label: "sel-short-form-assessment-1",
        type: "sel",
        questions: {
          items: [
            {
              required: true,
              question: {
                id: "10",
                label: "sel-short-form-assessment-3",
                type: "selectOne",
                question: "Knowing the emotions I feel.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: null,
                    label: "1",
                    color: null
                  },
                  { text: "Difficult", icon: null, label: "2", color: null },
                  { text: "Easy", icon: null, label: "3", color: null },
                  { text: "Very Easy", icon: null, label: "4", color: null }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "11",
                label: "sel-short-form-assessment-4",
                type: "selectOne",
                question: "Knowing ways I calm myself down.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: null,
                    label: "1",
                    color: null
                  },
                  { text: "Difficult", icon: null, label: "2", color: null },
                  { text: "Easy", icon: null, label: "3", color: null },
                  { text: "Very Easy", icon: null, label: "4", color: null }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "8",
                label: "sel-short-form-assessment-1",
                type: "selectOne",
                question: "Knowing what my strengths are.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "9",
                label: "sel-short-form-assessment-2",
                type: "selectOne",
                question:
                  "Knowing when my feelings are making it hard for me to focus.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            }
          ],
        }
      }
    },
    {
      position: 2,
      checkpoint: {
        id: "3",
        title: "Checkpoint",
        instructions:
          "Please tell us how easy or difficult each of the following are for you",
        label: "sel-short-form-assessment-2",
        type: "sel",
        questions: {
          items: [
            {
              required: true,
              question: {
                id: "12",
                label: "sel-short-form-assessment-5",
                type: "selectOne",
                question:
                  "Learning from people with different opinions than me.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "13",
                label: "sel-short-form-assessment-6",
                type: "selectOne",
                question:
                  "Knowing what people may be feeling by the look on their face.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "14",
                label: "sel-short-form-assessment-7",
                type: "selectOne",
                question: "Knowing when someone needs help.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            }
          ],
        }
      }
    },
    {
      position: 3,
      checkpoint: {
        id: "4",
        title: "Checkpoint",
        instructions:
          "Please tell us how easy or difficult each of the following are for you",
        label: "sel-short-form-assessment-3",
        type: "sel",
        questions: {
          items: [
            {
              required: true,
              question: {
                id: "15",
                label: "sel-short-form-assessment-8",
                type: "selectOne",
                question:
                  "Getting through something even when I feel frustrated.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "16",
                label: "sel-short-form-assessment-9",
                type: "selectOne",
                question: "Being patient even when I am really excited.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "17",
                label: "sel-short-form-assessment-10",
                type: "selectOne",
                question: "Finishing tasks even if they are hard for me.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            }
          ],
        }
      }
    },
    {
      position: 4,
      checkpoint: {
        id: "5",
        title: "Checkpoint",
        instructions:
          "Please tell us how easy or difficult each of the following are for you",
        label: "sel-short-form-assessment-4",
        type: "sel",
        questions: {
          items: [
            {
              required: true,
              question: {
                id: "18",
                label: "sel-short-form-assessment-11",
                type: "selectOne",
                question: "Setting goals for myself.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "19",
                label: "sel-short-form-assessment-12",
                type: "selectOne",
                question:
                  "Doing my schoolwork even when I do not feel like it.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "20",
                label: "sel-short-form-assessment-13",
                type: "selectOne",
                question: "Being prepared for tests.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            }
          ],
        }
      }
    },
    {
      position: 5,
      checkpoint: {
        id: "6",
        title: "Checkpoint",
        instructions:
          "Please tell us how easy or difficult each of the following are for you",
        label: "sel-short-form-assessment-5",
        type: "sel",
        questions: {
          items: [
            {
              required: true,
              question: {
                id: "21",
                label: "sel-short-form-assessment-14",
                type: "selectOne",
                question:
                  "Respecting a classmate's opinions during a disagreement.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "22",
                label: "sel-short-form-assessment-15",
                type: "selectOne",
                question: "Getting along with my classmates.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "23",
                label: "sel-short-form-assessment-16",
                type: "selectOne",
                question:
                  "Thinking about what might happen before making a decision.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            },
            {
              required: true,
              question: {
                id: "24",
                label: "sel-short-form-assessment-17",
                type: "selectOne",
                question: "Knowing what is right or wrong.",
                options: [
                  {
                    text: "Very Difficult",
                    icon: '',
                    label: "1",
                    color: ''
                  },
                  { text: "Difficult", icon: '', label: "2", color: '' },
                  { text: "Easy", icon: '', label: "3", color: '' },
                  { text: "Very Easy", icon: '', label: "4", color: '' }
                ]
              }
            }
          ],
        }
      }
    }
  ];

  const checkpoints = state.data.lesson.checkpoints.items;

  console.log(state, "state");

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

  useEffect(() => {
    // if ( cookies.questionData ) {
    //     dispatch({
    //         type: 'SET_QUESTION_DATA',
    //         payload: cookies.questionData
    //     })
    // }

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
    // if ( cookies.questionData ) {
    //     dispatch({
    //         type: 'SET_QUESTION_DATA',
    //         payload: cookies.questionData
    //     })
    // }

    // if (!input && !state.questionData) {
    //   setInput(() => {
    //     return setInitialState(checkpoint.checkpoint.questions.items);
    //   });
    // }
  }, []);

  useEffect(() => {
    if (checkpoint.checkpoint.title) {
      handleSetTitle(checkpoint.checkpoint.title);
    }

    // if (input && checkpoint.checkpoint.questions.items) {
    //   checkpoint.checkpoint.questions.items.forEach(
    //     (item: { question: { id: string; type: string; label: string } }) => {
    //       let inputKeys = Object.keys(input);
    //       let found = inputKeys.some((key: string) => {
    //         item.question.id === key;
    //       });

    //       if (!found) {
    //         setInput((prev: any) => {
    //           return {
    //             ...prev,
    //             [item.question.id]:
    //               item.question.type === "text"
    //                 ? ""
    //                 : item.question.type === "input"
    //                 ? ""
    //                 : item.question.type === "selectOne"
    //                 ? null
    //                 : item.question.type === "selectMany"
    //                 ? []
    //                 : null
    //           };
    //         });
    //       }
    //     }
    //   );
    // }
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
    console.log('input', input);

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

    // if (input && cookies.questionData !== input) {
    //   setCookie('questionData', input);
    // }
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
      <h4 className={`w-full text-2xl font-open font-semibold text-gray-200 mb-1`}>{checkpoint.checkpoint.instructions}</h4>

      <div className={`h-8/10 w-full flex flex-col text-gray-200`}>
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
