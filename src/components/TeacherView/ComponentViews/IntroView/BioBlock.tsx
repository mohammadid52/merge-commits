import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const BioBlock = (props: props) => {
    const { theme } = useContext(LessonControlContext);
    const {fullscreen} = props;

    const firstLetterFunction = (str: string) => {
        let arr = str.split('');
        arr.map((char, key) => {
            if (key === 0) {
                return <span>{char}</span>
            }
        })
    }


    return (

    <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col justify-center ${theme.block.text} text-base rounded-sm shadow-inner`}>
        <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} rounded-sm shadow-inner`}>
            <h1 className="font-extrabold mb-6">Biography of the artist:</h1>
            <div className={`${fullscreen ? 'text-base' : 'text-xs'} w-full h-full flex-grow overflow-scroll`}>
                Marlon “Marley” Lizama is a poet, writer, artist, author, and dancer who focuses on the cultural aspect of writing and the arts. He is the Co-founder of the Iconoclast Artists program that focuses on empowering youth in underserved schools and incarcerated youth through the arts. With the help of fellow educators, Marlon developed the “How to Teach High-Level Creative Writing to At-Risk Youth” curriculum, which aims to create creatives, writers, and young authors. Through Iconoclast, they are able to publish an anthology of poetry created by the students who have participated in this program. Marlon published his first book, Cue the Writer: Cheers to the Notion of Love, Hate, God, and Revolution, which is a collection of short stories and poetry from a young immigrant’s perspective, and launched his website MarlonLizamaPoetry.org. Marlon is the recipient of the 2015 John P. McGovern Award for distinguished activities in science, literature, arts and humanities. Through competitions, performances, poetry shows, and the U.S. Department of State, Marlon has traveled to more than 40 countries.  His work and ultimate mission is to use the arts as a tool to reach out and change perspective, environment, and lives.
            </div>
        </div>

    </div>
    )
}

export default BioBlock;