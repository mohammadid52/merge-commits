import React, {useState, useContext, useEffect, Fragment} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoCaretDownCircleOutline, IoCaretUpCircleOutline} from 'react-icons/io5';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import {GlobalContext} from '../../contexts/GlobalContext';
import {getAsset} from '../../assets';

interface DragableAccordionProps {
  titleList: {id: string; title: string; subtitle?: string; content: React.ReactNode}[];
  showSequence?: boolean;
  showEdit?: boolean;
  onItemEdit?: (id: string) => void;
  onDragEnd?: (result: any) => void;
}

const DragableAccordion = (props: DragableAccordionProps) => {
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {titleList, showSequence, showEdit, onItemEdit, onDragEnd} = props;
  const [selectedItem, setSelectedItem] = useState('');

  const changeView = (step: string) => {
    if (selectedItem !== step) {
      setSelectedItem(step);
    } else {
      setSelectedItem('');
    }
  };

  const onItemDrag = (result: any) => {
    onDragEnd(result);
  };

  return (
    <div className="bg-white mx-auto  border-0 border-gray-200 rounded-xl">
      <DragDropContext onDragEnd={onItemDrag}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <ul className="rounded-xl">
                {titleList.map(
                  (
                    item: {
                      id: string;
                      title: string;
                      scope?: string;
                      subtitle?: string;
                      content: React.ReactNode;
                    },
                    index
                  ) => (
                    <Fragment key={item.id}>
                      <li
                        className={`relative border-b-0 border-gray-200 ${
                          selectedItem === item.id ? 'rounded-lg' : ''
                        }`}>
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              <div
                                className={`w-full px-8 py-2 2xl:py-6 text-left ${
                                  theme.outlineNone
                                } ${
                                  selectedItem === item.id
                                    ? `border-0 rounded-lg ${theme.borderColorLight[themeColor]}`
                                    : ''
                                }`}>
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-xs md:text-base font-medium cursor-pointer flex ${
                                      selectedItem === item.id &&
                                      theme.textColor[themeColor]
                                    } `}
                                    onClick={() => changeView(item.id)}>
                                    <div className="w-auto">
                                      <span className="mr-4">{index + 1}. </span>
                                    </div>
                                    <div>
                                      <span>
                                        {item.title}{' '}
                                        {item.scope === 'private' && (
                                          <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium  w-auto bg-gray-100 text-gray-800`}>
                                            private
                                          </span>
                                        )}
                                      </span>
                                      <br />
                                      <span className="text-sm leading-6 text-gray-500">
                                        {item.subtitle ? item.subtitle : ''}
                                      </span>
                                    </div>
                                  </span>
                                  {showEdit && (
                                    <div
                                      className={`w-auto text-xs md:text-base mx-16 cursor-pointer ${theme.textColor[themeColor]} `}>
                                      <span onClick={() => onItemEdit(item.id)}>
                                        Edit
                                      </span>
                                    </div>
                                  )}
                                  <span
                                    className="w-8 h-8 flex items-center cursor-pointer"
                                    onClick={() => changeView(item.id)}>
                                    <IconContext.Provider
                                      value={{
                                        size: '2rem',
                                        color: theme.iconColor[themeColor],
                                      }}>
                                      {selectedItem === item.id ? (
                                        <IoCaretUpCircleOutline />
                                      ) : (
                                        <IoCaretDownCircleOutline />
                                      )}
                                    </IconContext.Provider>
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>

                        {selectedItem === item.id && (
                          <div className="px-8 py-6 max-h-140 overflow-auto">
                            {item.content}
                          </div>
                        )}
                      </li>
                    </Fragment>
                  )
                )}
              </ul>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragableAccordion;
