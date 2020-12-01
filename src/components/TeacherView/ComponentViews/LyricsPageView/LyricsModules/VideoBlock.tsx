import React from 'react';

interface VideoBlockProps {
    link: string,
    fullscreenLyrics: boolean,
}

const VideoBlock = (props: VideoBlockProps) => {
    const { link, fullscreenLyrics } = props;


    return (
        <>
            { !fullscreenLyrics ? (
                <div className='w-128 rounded-xl'>
                    <iframe
                        className='rounded-xl'
                        height='320'
                        src={link}
                        frameBorder='0'
                        allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
                        allowFullScreen></iframe>
                </div>
            ) : null}
        </>
    )
}

export default VideoBlock;