import React from 'react';

import { Lesson, LessonProps } from '../Classroom/Classroom';
import { Link } from '../../../interfaces/ClassroomComponentsInterfaces';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { IoCallOutline } from 'react-icons/all';

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
          <p className={`text-xs text-dark-gray`} dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

export const CallLinkWidget = (props: { title: string; links: Link }) => {
  const { title, links } = props;

  return (
    <div className={`p-2`}>
      <div className={`bg-white border border-dark-gray border-opacity-10 rounded`}>
        <div className={`flex flex-row p-2 text-sm font-semibold border-b border-dark-gray border-opacity-10`}>
          <span>{title}</span>:
          <span>
            <IconContext.Provider value={{ className: 'w-auto ' }}>
              <IoCallOutline size={18} />
            </IconContext.Provider>
          </span>
        </div>
        {links &&
          links.length > 0 &&
          links.map((link: Link, idx: number) => (
            <div
              key={`links_${links.id}_idx`}
              className={`p-2 break-all ${
                idx < links.length - 1 ? 'border-b border-dark-gray border-opacity-10' : ''
              }`}>
              <p className={`text-sm font-semibold`}>{link.text}:</p>
              <a
                id={`links_${links.id}_idx`}
                className={`text-xs font-semibold text-blueberry hover:underline`}
                href={link.url}
                target={`_blank`}>
                {link.url}
              </a>
            </div>
          ))}
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
