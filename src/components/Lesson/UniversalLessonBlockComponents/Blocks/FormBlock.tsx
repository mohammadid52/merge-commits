import React from 'react';

interface FormBlockProps {
  value?: { id: string; type: string; label: string; value: string[] };
}

export const FormBlock = (props: FormBlockProps) => {
  const { value } = props;

  const composeInput = (id: string, type: string, label: string, value: string[]) => {
    switch (type) {
      case 'text-input':
        return (
          <div className={`mb-4`}>
            <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
              {label}
            </label>
            <input
              id={id}
              className={`w-full py-2 px-4 text-gray-800 rounded-xl bg-darker-gray text-blue-100`}
              name="title"
              type="text"
              placeholder={value.length > 0 ? value[0] : 'Please input...'}
              value={''}
            />
          </div>
        );
      case 'text-area':
        return (
          <div className={`mb-4`}>
            <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
              {label}
            </label>
            <textarea
              id="story"
              className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl bg-darker-gray text-blue-100`}
              name="story"
              placeholder={value.length > 0 ? value[0] : 'Please input...'}
              value={''}
            />
          </div>
        );
      default:
        return <p>No valid form input type</p>;
    }
  };

  return value && composeInput(value.id, value.type, value.label, value.value);
};
