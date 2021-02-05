import React, { useState, useContext, useEffect, Fragment } from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoCaretDownCircleOutline, IoCaretUpCircleOutline } from 'react-icons/io5';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { GlobalContext } from '../../contexts/GlobalContext';

interface DragableAccordionProps {
  titleList: { id: string, title: string, subtitle?: string, content: React.ReactNode }[]
  showSequence?: boolean
  onDragEnd?: (result: any) => void
}

const DragableAccordion = (props: DragableAccordionProps) => {
  const { theme } = useContext(GlobalContext);
  const { titleList, showSequence, onDragEnd } = props;
  const [selectedItem, setSelectedItem] = useState('');

  const changeView = (step: string) => {
    if (selectedItem !== step) {
      setSelectedItem(step);
    } else {
      setSelectedItem('');
    }
  }

  const onItemDrag = (result: any) => {
    onDragEnd(result);
  }

  return (
    <div className="bg-white mx-auto border border-gray-200 rounded-xl">
      <DragDropContext onDragEnd={onItemDrag}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <ul className="rounded-xl">

                {titleList.map((item: { id: string, title: string, subtitle?: string, content: React.ReactNode }, index) => (


                  <Fragment key={item.id}>
                    <li className={`relative border-b border-gray-200 ${selectedItem === item.id ? 'rounded-lg' : ''}`}>

                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className={`w-full px-8 py-6 text-left cursor-pointer ${theme.outlineNone} ${selectedItem === item.id ? 'border border-indigo-400 rounded-lg' : ''}`} onClick={() => changeView(item.id)}>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs md:text-base font-medium ${selectedItem === item.id && 'text-indigo-600'}`}>
                                  <span>{item.title}</span><br />
                                  <span className="text-sm leading-6 text-gray-500">{item.subtitle ? item.subtitle : ''}</span>
                                </span>
                                <span className="w-8 h-8 flex items-center">
                                  <IconContext.Provider value={{ size: '2rem', color: '#667eea' }}>
                                    {(selectedItem === item.id) ? <IoCaretUpCircleOutline /> : <IoCaretDownCircleOutline />}
                                  </IconContext.Provider>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>

                      {(selectedItem === item.id) && (
                        <div className="px-8 py-6 max-h-140 overflow-auto">
                          {item.content}
                        </div>
                      )}
                    </li>
                  </Fragment>

                ))}
              </ul >

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div >
  )
}

export default DragableAccordion
