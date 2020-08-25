import React from 'react';

interface VideoBlockProps {
    link: string,
    fullscreen: boolean,
}

const VideoBlock = (props: VideoBlockProps) => {
    const { link, fullscreen } = props;


    return (
        <>
            { !fullscreen ? 
                <div className="md:h-6/10 bg-dark-blue w-full shadow-2 flex flex-col justify-center items-center text-gray-400 text-lg rounded-lg">
                    <iframe width="640" height="390" src={link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            :
                null
            }
        </>
    )
}

export default VideoBlock;