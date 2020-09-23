import React from 'react';

interface VideoBlockProps {
    link: string,
    fullscreenOutro: boolean,
}

const VideoBlock = (props: VideoBlockProps) => {
    const { link, fullscreenOutro } = props;


    return (
        <>
            { !fullscreenOutro ? 
                <div className="md:h-full bg-dark-blue w-full shadow-2 flex flex-col justify-center items-center text-gray-400 text-lg rounded-lg">
                    <iframe width="640" height="390" src={link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            :
                null
            }
        </>
    )
}

export default VideoBlock;