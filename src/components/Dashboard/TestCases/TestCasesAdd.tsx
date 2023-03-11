import { useState } from "react";
import { useHistory } from "react-router-dom";

import Buttons from "atoms/Buttons";
import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";
import DropdownForm from "../Profile/DropdownForm";

const TestCasesAdd = () => {
  const history = useHistory();
  const { userLanguage } = useGlobalContext();
  const { dashboardTestCasesDict } = useDictionary();
  // const {status, setStatus} = props;
  const [test, setTest] = useState<any>({
    id: "",
    name: "",
    type: "",
    steps: "",
    data: "",
    expResults: "",
    edgeCases: "",
  });

  async function createTestCase() {
    try {
      console.log({ test });

      // const results: any = await API.graphql(
      //   graphqlOperation(createCypressTesting, {input: input})
      // );

      history.push(`/dashboard/test-cases`);
      // console.log({results});
    } catch (error) {
      console.error(error);
    }
  }

  const handleChangeType = (type: { name: string; code: string }) => {
    setTest(() => {
      return {
        ...test,
        type: type.code,
      };
    });
  };

  const TYPE = [
    {
      code: "realtime",
      name: "Realtime",
    },
    {
      code: "stub",
      name: "Stub",
    },
  ];

  // if (status !== 'done') {
  //   return <LessonLoading />;
  // }

  // ⬆️ Ends here ⬆️

  const onChange = (e: any) => {
    const { id, value } = e.target;
    setTest(() => {
      return {
        ...test,
        [id]: value,
      };
    });
  };

  {
    return (
      <div className="h-full w-full md:px-4 pt-4">
        <form>
          <div>
            <div className="h-auto bg-white border-l-0 border-gray-200 mb-4">
              <div className="h-full px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-gray-900">
                  <>
                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="id"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        {
                          dashboardTestCasesDict[userLanguage][
                            "EDIT_TEST_CASES"
                          ]["TEST_ID"]
                        }
                      </label>
                      <div className="mt-1 border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                        <input
                          id="id"
                          onChange={onChange}
                          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={test.id}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        {
                          dashboardTestCasesDict[userLanguage][
                            "EDIT_TEST_CASES"
                          ]["TEST_NAME"]
                        }
                      </label>
                      <div className="mt-1 border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                        <input
                          id="name"
                          onChange={onChange}
                          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={test.name}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="steps"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        {
                          dashboardTestCasesDict[userLanguage][
                            "EDIT_TEST_CASES"
                          ]["TEST_STEPS"]
                        }
                      </label>
                      <div className="border-0 border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                        <textarea
                          id="steps"
                          onChange={onChange}
                          className="form-input outline-none border-none block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={test.steps}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="data"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        {
                          dashboardTestCasesDict[userLanguage][
                            "EDIT_TEST_CASES"
                          ]["TEST_DATA"]
                        }
                      </label>
                      <div className="border-0 border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                        <textarea
                          id="data"
                          onChange={onChange}
                          className="form-input outline-none border-none block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={test.data}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <DropdownForm
                        handleChangeLanguage={handleChangeType}
                        userLanguage={"Select Type"}
                        label={
                          dashboardTestCasesDict[userLanguage][
                            "EDIT_TEST_CASES"
                          ]["TEST_TYPE"]
                        }
                        items={TYPE}
                      />
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="expResults"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        {
                          dashboardTestCasesDict[userLanguage][
                            "EDIT_TEST_CASES"
                          ]["TEST_EXP_RESULTS"]
                        }
                      </label>
                      <div className="border-0 border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                        <input
                          id="expResults"
                          onChange={onChange}
                          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={test.expResults}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 p-2">
                      <label
                        htmlFor="edgeCases"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        {
                          dashboardTestCasesDict[userLanguage][
                            "EDIT_TEST_CASES"
                          ]["TEST_EDGE_CASES"]
                        }
                      </label>
                      <div className="border-0 border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                        <input
                          id="edgeCases"
                          onChange={onChange}
                          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          defaultValue={test.edgeCases}
                        />
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pt-4 mb-8 w-full flex justify-end">
            <div className="flex justify-center">
              <Buttons
                btnClass="py-1 px-4 text-xs mr-2"
                label={
                  dashboardTestCasesDict[userLanguage]["EDIT_TEST_CASES"][
                    "CANCEL"
                  ]
                }
                onClick={() => history.push(`/dashboard/test-cases`)}
                transparent
              />
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={
                  dashboardTestCasesDict[userLanguage]["EDIT_TEST_CASES"][
                    "SAVE"
                  ]
                }
                onClick={() => createTestCase()}
                disabled={false}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default TestCasesAdd;
