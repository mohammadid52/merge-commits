import React from 'react';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import BioBlock from './BioBlock';
import Banner from './Banner';

const Intro = () => {
    return (
        <div className="w-full h-160 flex flex-row justify-between items-center">
            <div className="w-5/10 h-152 flex flex-col justify-between items-center mr-4">
                <Banner />
                <PhotoBlock />
                <QuoteBlock />
            </div>
            <BioBlock />
        </div>
    )
}

export default Intro;

// const Intro = props => {
//     return (
//         <div className="w-full h-full flex flex-row items-center">
//             <div className="w-4/10 h-full flex flex-col justify-center items-center">
//                 <Banner />
//                 <PhotoBlock />
//                 <QuoteBlock />
//             </div>
//             <div className="w-6/10 h-full">
//                 <BioBlock />
//             </div>
//         </div>
//     )
// }