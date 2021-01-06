import React from 'react';

const SampleProfileQuestions = () => {
    return (
        <div className={`flex flex-col text-gray-200`}>
            <h4 className={`text-2xl font-open font-light mb-8`}>Answer these questions the best you can:</h4>
            <div className={`flex justify-center items-center divide-x-2 divide-dark divide-opacity-50`}>
                <div className={`w-1/2 h-full flex flex-col items-center p-6`}>
                    <p className="mb-4">
                        How well do you relate to your friends or classmates in school?
                    </p>
                    <div className={'w-8/10 flex flex-col items-center'}>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="perfectly" name="relate" value="perfectly" type="radio" />
                            <label htmlFor="perfectly">Relate perfectly</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="quiteWell" name="relate" value="quiteWell" type="radio" />
                            <label htmlFor="quiteWell">Relate quite well</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="somewhat" name="relate" value="somewhat" type="radio" />
                            <label htmlFor="somewhat">Somewhat relate</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="aLittle" name="relate" value="aLittle" type="radio" />
                            <label htmlFor="aLittle">Relate a little</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="notAtAll" name="relate" value="notAtAll" type="radio" />
                            <label htmlFor="notAtAll">Do not relate at all</label>
                        </div>
                    </div>
                </div>
                <div className={`w-1/2 h-full flex flex-col items-center p-6`}>
                    <p className="mb-4">
                        How connected do you feel to your cultural heritage?
                    </p>
                    <div className={'w-8/10 flex flex-col items-center'}>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="completely" name="connected" value="completely" type="radio" />
                            <label htmlFor="completely">Completely connected</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="quiteWell" name="connected" value="quiteWell" type="radio" />
                            <label htmlFor="quiteWell">Quite well connected</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="somewhat" name="connected" value="somewhat" type="radio" />
                            <label htmlFor="somewhat">Somewhat connected</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="aLittle" name="connected" value="aLittle" type="radio" />
                            <label htmlFor="aLittle">A little connected</label>
                        </div>
                        <div className={`flex items-center`}>
                            <input className="w-4 m-4" id="notAtAll" name="connected" value="notAtAll" type="radio" />
                            <label htmlFor="notAtAll">Not at all connected</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SampleProfileQuestions