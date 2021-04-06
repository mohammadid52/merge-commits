import React, { useContext, useState } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import AddQuestionModal from '../HelperComponents/AddQuestionModal';
import Buttons from '../../../../Atoms/Buttons';
import { getAsset } from '../../../../../assets';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';

interface QuestionBuilderProps {
  setActiveStep: (step: string) => void
}

const QuestionBuilder = (props: QuestionBuilderProps) => {
  const { setActiveStep } = props;
  const [showModal, setShowModal] = useState(false);

  const { theme, clientKey ,userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { BUTTONS, QuestionBuilderDict } = useDictionary(clientKey);
  
  const questionsList = [
    { id: '1' },
    { id: '2' }
  ]
  const toggleModal = () => {
    setShowModal(!showModal)
  }
  const addNewQuestion = () => {

  }
  const onDragEnd = async (result: any) => {

  }
  return (
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900"> {QuestionBuilderDict[userLanguage]['HEADING']} </h3>
      </div>

      <div className="p-4">
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 flex items-center px-4">{QuestionBuilderDict[userLanguage]['NOTE']}</p>
          <Buttons label="Add New Question" onClick={toggleModal} btnClass="px-4 py-4 w-1/4" />
        </div>
        <div>
          <div className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
            <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{QuestionBuilderDict[userLanguage]['NO']}</span>
            </div>
            <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{QuestionBuilderDict[userLanguage]['QUESTION']}</span>
            </div>
            <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{QuestionBuilderDict[userLanguage]['LABEL']}</span>
            </div>
            <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{QuestionBuilderDict[userLanguage]['TYPE']}</span>
            </div>
            <div className="w-2/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              <span>{QuestionBuilderDict[userLanguage]['ACTION']}</span>
            </div>
          </div>

          <div className="w-full m-auto max-h-88 overflow-y-auto">

            {/* Drag and drop listing */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {questionsList.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >

                            <div key={index} className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 cursor-pointer">
                              <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                              <div className="flex w-3/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {QuestionBuilderDict[userLanguage]['WHERARE']} </div>
                              <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{QuestionBuilderDict[userLanguage]['WHERYOU']}</div>
                              <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{QuestionBuilderDict[userLanguage]['TEXTINPUT']}</div>
                              <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center">
                                <span className={`w-auto cursor-pointer ${theme.textColor[themeColor] }`}>
                                  <IconContext.Provider value={{ size: '1.5rem', color: theme.iconColor[themeColor] }}>
                                    <FaEdit />
                                  </IconContext.Provider>
                                </span>
                                <span className={`w-auto cursor-pointer ${theme.textColor[themeColor] }`}>
                                  <IconContext.Provider value={{ size: '1.5rem', color: '#B22222' }}>
                                    <FaTrashAlt />
                                  </IconContext.Provider>
                                </span>
                              </div>
                            </div>

                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

          </div>
        </div>
      </div>
      {showModal && <AddQuestionModal saveAction={addNewQuestion} closeAction={toggleModal} setActiveStep={(step) => setActiveStep(step)} />}
    </div>
  )
}

export default QuestionBuilder
