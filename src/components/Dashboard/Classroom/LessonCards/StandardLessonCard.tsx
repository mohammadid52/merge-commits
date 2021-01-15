import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import Start from '../Start';

import { LessonCardProps } from '../Classroom';
import { GlobalContext } from '../../../../contexts/GlobalContext';

const StandardLessonCard = (props: LessonCardProps) => {
  const { keyProps, lessonProps, accessible, lessonType } = props;
  const { theme } = useContext(GlobalContext);

  const isSurvey = keyProps.includes('survey') || keyProps.includes('assessment');

  return (
    <div
      key={keyProps}
      className={`relative bg-white rounded border border-dark-gray border-opacity-10 h-auto flex mb-8 ${theme.elem.text} `}>
      {/**
       *  LEFT SECTION IMAGE
       */}
      {!isSurvey && (
        <div
          className={`w-2.5/10 ${theme.dashboard.bg} rounded-tl rounded-bl`}
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),url(${
              lessonProps && lessonProps.lesson.artist.images ? lessonProps.lesson.artist.images : null
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <div className="h-6/10 flex justify-center items-center"></div>

          <>
            <div className="h-1/10 pl-6">
              <div
                className="tracking-widest border-b text-gray-300 border-ketchup"
                style={{ textShadow: '1px 1px black' }}>
                FEATURED ARTIST
              </div>
            </div>
            <div className="h-3/10 flex flex-row-reverse">
              <h2
                className={`first w-full text-2xl text-right font-open font-medium tracking-widest mt-2 mr-1 text-gray-200`}
                style={{ textShadow: '1px 1px black' }}>
                {lessonProps && lessonProps.lesson.artist.name ? lessonProps.lesson.artist.name : null}
              </h2>
            </div>
          </>
        </div>
      )}
      {/**
       *  RIGHT SECTION
       */}
      <div className={`${!isSurvey ? 'w-7.5/10' : 'w-full'} flex flex-col`}>
        <div className={`${!isSurvey ? 'h-44' : 'h-auto'} p-4 flex flex-col justify-start items-center`}>
          <h1 className={`text-2xl text-black font-open text-left`}>
            {lessonProps.lesson && lessonProps.lesson.title ? lessonProps.lesson.title : null}
          </h1>
          <p className="text-sm text-left">
            {lessonProps.lesson && lessonProps.lesson.summary ? lessonProps.lesson.summary : null}
          </p>
        </div>
        <div className={`h-8 ${theme.dashboard.bg} flex justify-between text-sm  rounded-b`}>
          {/* FILLER */}
          {isSurvey && (
            <div className={`flex justify-center items-center my-2 w-3.3/10 text-gray-300`}/>
          )}

          {/* TIME */}
          <div className={`flex justify-center items-center my-2 w-3.3/10 text-gray-300`}>
            <div className="w-auto text-gray-300">
              <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                <AiOutlineClockCircle />
              </IconContext.Provider>
            </div>
            <div className={`w-auto mx-4 text-gray-300`}>45 min.</div>
          </div>

          {/* TEACHER */}
          <div className={`flex justify-center items-center my-2 w-3.3/10`}>
            <div className="w-auto text-gray-300">
              {!isSurvey && (
                <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
                  <AiOutlineUser />
                </IconContext.Provider>
              )}
            </div>
            <div className={`w-auto mx-4 text-gray-200`}>{!isSurvey && 'Marlon'}</div>
          </div>

          {/* START */}
          <div className="flex w-3.3/10">
            <Start
              lessonKey={lessonProps ? lessonProps.lessonID : null}
              open={lessonProps ? lessonProps.open : null}
              accessible={accessible}
              type={lessonType}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default StandardLessonCard;
