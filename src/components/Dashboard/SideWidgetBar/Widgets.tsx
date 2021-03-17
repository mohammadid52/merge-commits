import React from 'react';

import { Lesson, LessonProps } from '../Classroom/Classroom';

export const ImageWidget = (props: {
  source: string;
  altdesc?: string;
  title?: string;
  card?: boolean;
  classProp?: string;
}) => {
  const { source, altdesc, title, card, classProp } = props;
  return (
    <div className={`p-2`}>
      <div className={`${card ? 'bg-white border border-dark-gray border-opacity-10' : ''} rounded`}>
        {title && <p className={`text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>{title}:</p>}
        <div className={`bg-white rounded`}>
          <img src={source} className={classProp} alt={altdesc} />
        </div>
      </div>
    </div>
  );
};

export const DefaultTextWidget = (props: { title: string; content: string }) => {
  const { title, content } = props;
  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>{title}:</p>
        <div key={`teacher_side_note`} className={`p-2 border-b border-dark-gray  border-opacity-10`}>
          <p className={`text-xs text-dark-gray`} dangerouslySetInnerHTML={{__html: content}}/>
        </div>
      </div>
    </div>
  );
};

export const ButtonLinkWidget = (props: { title: string; href: string; buttonText: string }) => {
  const { title, href } = props;
  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <p className={`text-sm p-2 font-semibold border-b border-dark-gray border-opacity-10`}>{title}:</p>
        <a
          href={href}
          target={`_blank`}
        >
          {href}
        </a>
      </div>
    </div>
  );
};

// export const MediaRecommendation = () => {
//   return (
//     <div className={`p-2`}>
//       <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
//         <p className={`text-sm p-2 font-semibold border-b border-dark-gray  border-opacity-10`}>Recommended Book:</p>
//         <div key={`teacher_side_note`} className={`p-2 border-b border-dark-gray  border-opacity-10`}>
//           <p className={`text-sm font-medium text-dark-gray border-b pb-2`}>
//             Beyond Survival: Strategies and Stories from the Transformative Justice Movement
//           </p>
//           <p className={`text-xs text-dark-gray pt-2`}>
//             <a
//               href="https://www.amazon.com/Beyond-Survival-Strategies-Transformative-Movement/dp/184935362X"
//               target="_blank">
//               {' '}
//               <b>Click to purchase on Amazon</b>
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
