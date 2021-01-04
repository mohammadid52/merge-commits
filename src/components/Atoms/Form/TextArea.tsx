import React, { useContext, Fragment } from 'react'
import { GlobalContext } from '../../../contexts/GlobalContext';

interface TextAreaProps {
  id?: string
  name?: string
  label?: string
  isRequired?: boolean
  onChange?: (e: any) => void
  value?: string
  placeHolder?: string

}

const TextArea = (props: TextAreaProps) => {
  const { id, name, label, isRequired, onChange, value, placeHolder, } = props;
  const { theme } = useContext(GlobalContext);

  return (
    <Fragment>
      <label htmlFor={id} className="block text-m font-medium leading-5 text-gray-700">
        {label} <span className="text-red-500"> {isRequired ? '*' : null}</span>
      </label>
      <textarea
        id={id}
        name={name}
        onChange={(e: any) => onChange(e)}
        className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
        value={value ? value : ''}
        placeholder={placeHolder}
        rows={5}
      />
    </Fragment>
  )
}

export default TextArea
