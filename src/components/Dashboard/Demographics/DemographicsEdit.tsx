import FormInput from '@components/Atoms/Form/FormInput';
import MultipleSelector from '@components/Atoms/Form/MultipleSelector';
import Selector from '@components/Atoms/Form/Selector';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {Empty} from 'antd';
import React, {Fragment} from 'react';

// Add interface for props
interface IDemographicsProps {
  stdCheckpoints: any;
  checkpointData: any;
  setCheckpointData: any;
}

export const selectedMultiOptions = (options: any[]) => {
  if (typeof options === 'string') {
    return [{id: '0', name: options, value: options}];
  }
  if (options && typeof options[0] === 'string') {
    const newArr: any = options?.map((option: any, index: number) => {
      return {
        id: index.toString(),
        name: option,
        value: option
      };
    });

    return [...newArr];
  } else {
    return [...options];
  }
};

const convertToSelectorList = (options: any) => {
  const newArr: any = options.map((item: any, index: number) => ({
    id: index,
    name: item.text,
    value: item.text
  }));

  return newArr;
};
const convertToMultiSelectList = (options: any) => {
  const newArr: any = options.map((item: any, index: number) => ({
    id: index.toString(),
    name: item.text,
    value: item.text
  }));
  return newArr;
};

const DemographicsEdit = ({
  stdCheckpoints,
  checkpointData,
  setCheckpointData
}: IDemographicsProps) => {
  // Code for Other Field
  const hasOther = (val: string | string[], other: string) => {
    try {
      return val ? val.toString().includes(other) : false;
    } catch (err) {
      console.log('errrr', err);
      return false;
    }
  };

  const isOther = (val: any) => {
    if (hasOther(val, 'Other')) {
      return true;
    } else return false;
  };
  // ⬆️ Ends here ⬆️

  const getValue = (checkpointId: string, questionId: string) => {
    if (checkpointData[checkpointId]) {
      const currentQuestionResponse = checkpointData[checkpointId][questionId];
      return currentQuestionResponse
        ? currentQuestionResponse.split(' || ').length === 2
          ? currentQuestionResponse.split(' || ')[1]
          : ''
        : '';
    }
  };

  const onInputChange = (e: any, checkpointID: string, questionID: string) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: e.target.value
      }
    });
  };

  const onOtherInputChange = (e: any, checkpointID: string, questionID: string) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: `Other || ${e.target.value}`
      }
    });
  };

  const onMultipleSelection = (
    option: any[],
    checkpointID: string,
    questionID: string
  ) => {
    const selectedQuestion = checkpointData[checkpointID]
      ? checkpointData[checkpointID][questionID]
      : [];

    if (selectedQuestion?.length > 0) {
      if (typeof selectedQuestion === 'string') {
        setCheckpointData({
          ...checkpointData,
          [checkpointID]: {
            ...checkpointData[checkpointID],
            [questionID]: []
          }
        });
      }

      setCheckpointData({
        ...checkpointData,
        [checkpointID]: {
          ...checkpointData[checkpointID],
          [questionID]: [...option]
        }
      });
    } else {
      setCheckpointData({
        ...checkpointData,
        [checkpointID]: {
          ...checkpointData[checkpointID],
          [questionID]: [...option]
        }
      });
    }
  };
  const onSingleSelect = (
    name: string,

    checkpointID: string,
    questionID: string
  ) => {
    setCheckpointData({
      ...checkpointData,
      [checkpointID]: {
        ...checkpointData[checkpointID],
        [questionID]: name
      }
    });
  };

  return (
    <>
      {stdCheckpoints?.length > 0 ? (
        <div className="">
          {stdCheckpoints.map((checkpoint: any) => (
            <Fragment key={checkpoint.id}>
              <div className="">
                <div className="h-full px-4 py-5 sm:px-6">
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-gray-900">
                    {checkpoint.questions?.items.map((item: any) => (
                      <Fragment key={item.question.id}>
                        <div className="sm:col-span-3 p-2 flex items-end">
                          <div className="flex flex-col justify-between w-full">
                            {item.question.type === 'text' ? (
                              <FormInput
                                value={
                                  checkpointData[checkpoint.id]
                                    ? checkpointData[checkpoint.id][item.question.id]
                                    : ''
                                }
                                id={item.question.id}
                                name=""
                                label={item?.question?.question}
                                onChange={(e) =>
                                  onInputChange(e, checkpoint.id, item.question.id)
                                }
                              />
                            ) : null}
                            {/* Will change it to text box if required. */}
                            {item.question.type === 'input' ? (
                              <FormInput
                                value={
                                  checkpointData[checkpoint.id]
                                    ? checkpointData[checkpoint.id][item.question.id]
                                    : ''
                                }
                                id={item.question.id}
                                name=""
                                label={item?.question?.question}
                                onChange={(e) =>
                                  onInputChange(e, checkpoint.id, item.question.id)
                                }
                              />
                            ) : null}
                            {item.question.type === 'link' ? (
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="date picker"
                                  className="block text-m font-medium leading-5 text-gray-700">
                                  {item?.question?.question}
                                </label>
                                <div className="mt-1  border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                                  <input
                                    id={item.question.id}
                                    type="url"
                                    name="url"
                                    placeholder="https://example.com"
                                    pattern="https://.*"
                                    size={30}
                                    required
                                    value={
                                      checkpointData[checkpoint.id]
                                        ? checkpointData[checkpoint.id][item.question.id]
                                        : ''
                                    }
                                    onChange={(e) =>
                                      onInputChange(e, checkpoint.id, item.question.id)
                                    }
                                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 text-gray-900"
                                  />
                                </div>
                              </div>
                            ) : null}
                            {item.question.type === 'datePicker' ? (
                              <FormInput
                                value={
                                  checkpointData[checkpoint.id]
                                    ? checkpointData[checkpoint.id][item.question.id]
                                    : ''
                                }
                                id={item.question.id}
                                name=""
                                label={item?.question?.question}
                                onChange={(e) =>
                                  onInputChange(e, checkpoint.id, item.question.id)
                                }
                              />
                            ) : null}
                            {item.question.type === 'selectOne' ? (
                              <Fragment>
                                <Selector
                                  label={item?.question?.question}
                                  selectedItem={
                                    checkpointData[checkpoint.id]
                                      ? isOther(
                                          checkpointData[checkpoint.id][item.question.id]
                                        )
                                        ? 'Other'
                                        : checkpointData[checkpoint.id][item.question.id]
                                      : ''
                                  }
                                  placeholder=""
                                  list={convertToSelectorList(item?.question?.options)}
                                  onChange={(value) =>
                                    onSingleSelect(
                                      value,

                                      checkpoint.id,
                                      item.question.id
                                    )
                                  }
                                />
                                {checkpointData[checkpoint.id] &&
                                  isOther(
                                    checkpointData[checkpoint.id][item.question.id]
                                  ) && (
                                    <div className="sm:col-span-3">
                                      <FormInput
                                        value={getValue(checkpoint.id, item.question.id)}
                                        id={item.question.id}
                                        placeHolder="Mention other"
                                        name="other"
                                        onChange={(e) => {
                                          onOtherInputChange(
                                            e,
                                            checkpoint.id,
                                            item.question.id
                                          );
                                        }}
                                      />
                                    </div>
                                  )}
                              </Fragment>
                            ) : null}
                            {item.question.type === 'selectMany' ? (
                              <div className="sm:col-span-3">
                                <MultipleSelector
                                  label={item?.question?.question}
                                  list={convertToMultiSelectList(item?.question?.options)}
                                  selectedItems={
                                    checkpointData[checkpoint.id] &&
                                    checkpointData[checkpoint.id][item.question.id]
                                      ? selectedMultiOptions(
                                          checkpointData[checkpoint.id][item.question.id]
                                        )
                                      : []
                                  }
                                  placeholder=""
                                  onChange={(_, option) =>
                                    onMultipleSelection(
                                      option,
                                      checkpoint.id,
                                      item.question.id
                                    )
                                  }
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <Empty description={'No Demographics Data'} />
      )}
    </>
  );
};

export default DemographicsEdit;
