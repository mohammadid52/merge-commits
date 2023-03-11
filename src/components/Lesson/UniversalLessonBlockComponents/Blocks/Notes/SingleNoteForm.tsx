import FormInput from "atoms/Form/FormInput";
import React, { useState } from "react";
import ColorPicker from "@UlbUI/ColorPicker/ColorPicker";
import Selector from "atoms/Form/Selector";

const SingleNote = ({
  singleNoteData,
  idx,
  removeItemFromList,
  onChange,
  onFieldUpdate,
}: any) => {
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  return (
    <div
      key={singleNoteData.id}
      className="flex flex-col items-center justify-start mb-4 gap-x-4"
    >
      <div className="mb-2">
        <FormInput
          label={"Add note text"}
          onChange={(e) => onChange(e, idx)}
          error={singleNoteData.error}
          name={"noteText"}
          value={singleNoteData.noteText}
          placeHolder={"Enter your notes text here"}
        />
      </div>

      <div className="flex items-end space-x-4 justify-between">
        <div className="relative h-full w-auto flex items-center space-x-4">
          <div className="w-auto">
            <label
              htmlFor={"bgColor"}
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700"
            >
              Select background color
            </label>
            <button
              onClick={() => setColorPicker(!colorPicker)}
              className={`border-0 focus:outline-none hover:theme-bg:200 hover:theme-border:400 hover:theme-text:400 focus:ring-2 border-gray-300 rounded-full shadow-sm flex items-center justify-start  h-10 px-3`}
            >
              <span className={"text-gray-700 w-auto text-sm mr-2 capitalize"}>
                {singleNoteData.bgColor?.split("-")[0]}{" "}
              </span>

              <span
                className={`h-4 block w-4 bg-gradient-to-t from-${singleNoteData.bgColor}-500 to-${singleNoteData.bgColor}-300 rounded-full `}
              ></span>
            </button>
            {colorPicker && (
              <ColorPicker
                isMainPage
                customColors={{
                  colors: [
                    { label: "Red", value: "red" },
                    { label: "Red", value: "green" },
                    { label: "Red", value: "blue" },
                    { label: "Red", value: "yellow" },
                    { label: "Red", value: "indigo" },
                    { label: "Red", value: "purple" },
                  ],
                  values: [{ label: 500, value: 500 }],
                }}
                callbackColor={(pickedColor) => {
                  setColorPicker(false);
                  onFieldUpdate("bgColor", pickedColor.split("-")[0], idx);
                }}
                styleString={{ top: "100%" }}
              />
            )}
          </div>
          <div className="w-auto">
            <label
              htmlFor={"size"}
              className="mb-2 block text-xs font-semibold leading-5 text-gray-700"
            >
              Select size
            </label>
            <Selector
              width="w-56"
              dropdownWidth="w-56"
              placeholder="Select size"
              selectedItem={
                singleNoteData.size !== "undefined"
                  ? singleNoteData.size
                  : "large"
              }
              onChange={(_, name) => onFieldUpdate("size", name, idx)}
              list={[
                { id: 0, name: "small" },
                { id: 1, name: "medium" },
                { id: 2, name: "large" },
              ]}
            />
          </div>
        </div>

        {idx !== 0 && (
          <div className="w-auto">
            <button
              onClick={() => removeItemFromList(singleNoteData.id)}
              className={`text-center transition-all duration-200 hover:bg-red-200 text-xs font-semibold text-red-400 border-red-200 px-2 py-1 cursor-pointer rounded mt-2 border-2 hover:text-red-600 w-auto`}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SingleNote;
