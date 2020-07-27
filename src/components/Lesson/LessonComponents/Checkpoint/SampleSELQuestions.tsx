import React, { useState } from 'react';

const SampleSELQuestions = () => {
    const [ selected, setSelected ] = useState<Array<string>>([])

    const handleSelect = (e: any) => {
        const { id } = e.target
        setSelected(prev => {
            if ( selected.indexOf(id) >= 0 ) {
                let newArray = selected.filter(item => {
                   return item !== id
                })
                console.log(newArray)
                return newArray;
            } 

            return [
                ...prev,
                id
            ]
        })
    }

    return (
        <div className={`h-full flex flex-col text-gray-200`}>
            <h4 className={`text-2xl font-open font-bold mb-4`}>Answer these questions the best you can:</h4>
            <div className={`h-full flex justify-center items-center divide-x-2 divide-dark divide-opacity-50`}>
                <div className={`w-1/2 h-full flex flex-col justify-around items-center p-6`}>
                    <div className={'w-full flex flex-col items-center mb-4'}>
                        <label className="mb-2" htmlFor="traditions">What is one family, regional, or personal tradition that you would like to pass on?</label>
                        <input className="py-2 px-4 rounded-lg" type="text" id="traditions" name="traditions" />
                    </div>
                    <div className={'w-full flex flex-col items-center mb-4'}>
                        <p className="mb-2"> Do you think it's important to learn about other cultures?</p>
                        <div className={`flex justify-around`}>
                            <div className={`flex justify-center items-center`}>
                                <input className="w-4 mx-4" type="radio" id="no" name="cultures" />
                                <label htmlFor="no">Yes</label>
                            </div>
                            <div className={`flex justify-center items-center`}>
                                <input className="w-4 mx-4" type="radio" id="no" name="cultures" />
                                <label htmlFor="no">No</label>
                            </div>
                        </div>
                    </div>
                    <div className={'w-full flex flex-col items-center mb-4'}>
                        <label className="mb-2" htmlFor="culture">In one sentence or less, say why or why not:</label>
                        <input className="py-2 px-4 rounded-lg" type="text" id="culture" name="culture" />
                    </div>
                </div>
                <div className={`w-1/2 h-full flex flex-col justify-start p-6`}>
                    <p className="mb-4">
                        What did today's lesson cause you to reflect on? Select all that apply:
                    </p>
                    <div className={'w-8/10 flex flex-col items-center'}>
                        <div className={`w-3/4 flex items-center mb-4`}>
                            <div id="culture" className={`${ selected.indexOf('culture') >= 0 ? 'bg-dark-red' : 'bg-gray-400 shadow-2'} w-12 h-12 p-2 text-3xl rounded  flex justify-center items-center`} onClick={handleSelect}>
                                ❤️
                            </div>
                            <div className="mx-4">
                                My culture
                            </div>
                        </div>
                        <div className={`w-3/4 flex items-center mb-4`}>
                            <div id="traditions" className={`${ selected.indexOf('traditions') >= 0 ? 'bg-gold' : 'bg-gray-400 shadow-2'} w-12 h-12 p-2 text-3xl rounded  flex justify-center items-center`} onClick={handleSelect}>
                                ⚜️
                            </div>
                            <div className="mx-4">
                                My traditions
                            </div>
                        </div>
                        <div className={`w-3/4 flex items-center mb-4`}>
                            <div id="family" className={`${ selected.indexOf('family') >= 0 ? 'bg-blueberry' : 'bg-gray-400 shadow-2'} w-12 h-12 p-2 text-3xl rounded  flex justify-center items-center`} onClick={handleSelect}>
                                👨‍👩‍👧‍👦
                            </div>
                            <div className="mx-4">
                                My family
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SampleSELQuestions;