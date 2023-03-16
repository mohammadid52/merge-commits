import {Select} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import {orderBy} from 'lodash';
import React from 'react';

type Item = {
  label: string;
  id?: string;
  value?: string;
};

interface SelectorProps {
  list?: Item[];
  selectedItem?: string;
  btnClass?: string;
  additionalClass?: string;
  arrowHidden?: boolean;
  placeholder: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | undefined;
  onChange: (value: string, option: Item | Item[]) => void;
  disabled?: boolean;
  disableSort?: boolean;
  isRequired?: boolean;
  style?: any;
  loading?: boolean;
  size?: SizeType;
  label?: string;
  labelTextClass?: string;
  noOptionMessage?: string;
  width?: number;
  error?: string;
  btnId?: string;
  isClearable?: boolean;
  onClear?: () => void;
  setHoveringItem?: React.Dispatch<React.SetStateAction<{}>>;
  setSelectedItem?: React.Dispatch<React.SetStateAction<{}>>;

  dataCy?: string;
  dropdownWidth?: string;
  showSearch?: boolean;
  noSpace?: boolean;
  direction?: 'left' | 'right' | 'topleft' | 'topright';
}

const Selector: React.FC<SelectorProps> = (selectorProps: SelectorProps) => {
  const {
    list,
    selectedItem,
    disabled,

    placeholder = 'Select value',

    error = '',
    onChange,
    showSearch = false,

    loading = false,
    size = 'large',

    width = 250,

    disableSort = false,

    placement
  } = selectorProps;

  const sortedList = disableSort ? list : orderBy(list, ['label'], ['asc']);
  console.log('🚀 ~ file: Selector.tsx:68 ~ sortedList:', sortedList, selectedItem);

  return (
    <Select
      defaultValue={selectedItem}
      value={selectedItem}
      placeholder={placeholder}
      status={error.length === 0 ? '' : 'error'}
      style={{width}}
      disabled={disabled}
      showSearch={showSearch}
      size={size}
      loading={loading}
      onChange={onChange}
      placement={placement}
      options={sortedList}
    />
    // <div
    //   className={`relative ${noSpace ? '' : 'space-y-1'} ${additionalClass}`}
    //   ref={currentRef}>
    //   {label && <Label dark={false} label={label} isRequired={isRequired} />}
    //   <span
    //     title={capitalizeFirstLetter(selectedItem ? selectedItem : placeholder)}
    //     className="inline-block w-full h-full rounded-full">
    //     <button
    //       data-cy={`${dataCy}-button`}
    //       disabled={disabled || loading}
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         setShowList(!showList);
    //       }}
    //       type="button"
    //       id={btnId}
    //       aria-haspopup="listbox"
    //       aria-expanded="true"
    //       aria-labelledby="listbox-label"
    //       className={`${
    //         disabled || loading
    //           ? 'bg-gray-200 cursor-not-allowed pointer-events-none'
    //           : 'cursor-pointer'
    //       } flex focus:outline-none hover:theme-bg:200 hover:theme-border:400 hover:theme-text:400 focus:ring-2 focus:ring-${
    //         themeColor === 'iconoclastIndigo' ? 'indigo' : 'blue'
    //       }-600 focus:border-transparent  relative items-center  ${width} h-full rounded-full ${
    //         error.length === 0 ? 'border-gray-300' : 'border-red-300'
    //       }  border-0 bg-white px-4 pr-0 py-2 justify-between text-left transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
    //         btnClass ? btnClass : ''
    //       }`}>
    //       <span className="block w-auto truncate text-gray-700">
    //         {capitalizeFirstLetter(selectedItem ? selectedItem : placeholder)}
    //       </span>

    //       {!loading ? (
    //         <div className="h-full flex items-center ml-8 w-auto justify-center">
    //           <AnimatedContainer
    //             animationType="translateY"
    //             className="w-auto absolute right-1"
    //             show={isClearable && selectedItem !== null}>
    //             {isClearable && selectedItem !== null && (
    //               <span
    //                 role={'button'}
    //                 title="clear sort"
    //                 className="z-100 relative flex justify-center  cursor-pointer hover:bg-gray-200
    //                rounded-full"
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   clearSort();
    //                 }}>
    //                 <IoClose
    //                   size={'1rem'}
    //                   className="hover:iconoclast:text-main hover:curate:text-main transition-all text-gray-600"
    //                 />
    //               </span>
    //             )}
    //           </AnimatedContainer>
    //         </div>
    //       ) : null}

    //       <div className="w-auto flex items-center">
    //         {error.length > 0 && (
    //           <ExclamationCircleIcon
    //             className={`h-5 relative mr-2 w-5 text-red-500 ${
    //               error.length === 0 ? 'hidden' : ''
    //             }`}
    //             aria-hidden="true"
    //           />
    //         )}
    //         <span
    //           className={`relative justify-end w-auto inset-y-0 pr-2 right-0 items-center pointer-events-none ${
    //             arrowHidden ? 'hidden' : 'flex'
    //           }`}>
    //           {loading ? (
    //             <Spinner />
    //           ) : (
    //             <svg
    //               className="h-5 w-5 text-gray-400"
    //               viewBox="0 0 20 20"
    //               fill="none"
    //               stroke="currentColor">
    //               <path
    //                 d="M7 7l3-3 3 3m0 6l-3 3-3-3"
    //                 strokeWidth="1.5"
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //               />
    //             </svg>
    //           )}
    //         </span>
    //       </div>
    //     </button>
    //     <Transition
    //       show={error.length > 0}
    //       enter="transition duration-300"
    //       enterFrom="opacity-0 transform -translate-y-6"
    //       enterTo="opacity-100 transform translate-y-0"
    //       leave="transition duration-300"
    //       leaveFrom="opacity-100 transform translate-y-0"
    //       leaveTo="opacity-0 transform -translate-y-6">
    //       <p className="text-red-500 mt-1 text-xs">{error}</p>
    //     </Transition>
    //   </span>
    //   <AnimatedContainer
    //     className="z-50 absolute w-full "
    //     style={
    //       direction.includes('top')
    //         ? {
    //             bottom: '5rem'
    //           }
    //         : {}
    //     }
    //     show={showList}>
    //     {showList && (
    //       <div
    //         className="z-50 absolute mt-1 w-full "
    //         style={{
    //           ...style,
    //           left: direction === 'left' || direction === 'topleft' ? '0rem' : 'unset'
    //         }}>
    //         <ul
    //           role="listbox"
    //           aria-labelledby="listbox-label"
    //           aria-activedescendant="listbox-item-3"
    //           className={`rounded-xl bg-white customShadow ${
    //             dropdownWidth || 'w-132'
    //           } relative  max-h-60 text-base overflow-y-auto leading-6 focus:shadow-none focus:outline-none sm:text-sm sm:leading-5`}>
    //           {list?.length && list?.length > 0 ? (
    //             sortedList?.map((item, index) => (
    //               <SelectorItem
    //                 isSelected={(name) => Boolean(isSelected(name))}
    //                 index={index}
    //                 updateSelectedItem={updateSelectedItem}
    //                 setHoveringItem={setHoveringItem}
    //                 dataCy={dataCy}
    //                 item={item as any}
    //                 key={item.id}
    //               />
    //             ))
    //           ) : (
    //             <li className="flex justify-center relative py-2 px-4">
    //               <span className="font-normal">{noOptionMessage || 'No Results'}</span>
    //             </li>
    //           )}
    //         </ul>
    //       </div>
    //     )}
    //   </AnimatedContainer>
    // </div>
  );
};

export default Selector;
