import {useGlobalContext} from 'contexts/GlobalContext';
import {Fragment} from 'react';

interface TextAreaProps {
  error?: string;
  id?: string;
  name?: string;
  label?: string;
  isRequired?: boolean;
  onChange?: (e: any) => void;
  value?: string;
  placeHolder?: string;
  rows?: number;
  maxLength?: number;
  showCharacterUsage?: boolean;
  dataCy?: string;
}

const TextArea = (props: TextAreaProps) => {
  const {
    error,
    id,
    name,
    label,
    isRequired,
    onChange,
    rows,
    value,
    maxLength,
    placeHolder,
    showCharacterUsage,
    dataCy
  } = props;
  const {theme} = useGlobalContext();
  const otherInputProps: any = {};
  if (maxLength) {
    otherInputProps.maxLength = maxLength;
  }
  return (
    <Fragment>
      <label htmlFor={id} className="block text-xs font-semibold leading-5 text-dark  ">
        {label} <span className="text-red-500"> {isRequired ? '*' : null}</span>
      </label>
      <textarea
        data-cy={dataCy}
        id={id}
        name={name}
        onChange={(e: any) => onChange?.(e)}
        className={`mt-1 block w-full sm:text-sm rounded-xl sm:leading-5  border-0 border-lightest  py-2 px-3  shadow-sm ${theme.outlineNone}`}
        value={value ? value : ''}
        placeholder={placeHolder}
        rows={rows ? rows : 5}
        {...otherInputProps}
      />
      <div className="flex">
        <p className="text-red-500 text-xs">{error}</p>
        {showCharacterUsage ? (
          <div className="text-right text-light ">
            {value?.length || 0} of {maxLength}
          </div>
        ) : null}
      </div>
    </Fragment>
  );
};

export default TextArea;
