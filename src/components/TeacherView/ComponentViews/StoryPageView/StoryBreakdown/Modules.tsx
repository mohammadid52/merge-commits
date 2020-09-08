import React from 'react';

interface props {
    fullscreen: boolean,
    dataProps?: {
        title?: string,
        story?: string,
        additional?: [{
            name: string,
            input: string,
        }]
    }
}

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

const keywordParser = (str: string) => {
    if (typeof str !== 'string') { return null }
    let tempWord = '';
    let initialArray = Array.from(str);
    let finalArray = [];
    initialArray.forEach(letter => {
        if (letter !== ',') {
            tempWord = tempWord + letter;
        } else {
            finalArray.push(tempWord);
            tempWord = '';
        }
    })
    
    finalArray.push(tempWord);

    return finalArray;
}


const Modules = (props: props) => {
    const { fullscreen, dataProps } = props;

    if (!dataProps || !dataProps.additional) {
        return null;
    }

    return (
        <div className={`flex flex-col md:w-2/10 h-full justify-between text-sm md:text-base text-gray-200 mb-4 md:mb-0`} >
            {   dataProps && dataProps.additional ?
                dataProps.additional.map((item: any, key: number) => {
                    let wordArray = keywordParser(item.input)
                    return (
                    <div key={key} className={`md:h-3.2/10 bg-dark-blue font-open font-bold h-16 shadow-2 rounded-lg px-4 py-2 ${key === dataProps.additional.length - 1 ? '' : ''}`}>
                        <h3>{keywordCapitilizer(item.name)}:</h3>
                        <div className="w-full px-2 overflow-scroll">
                            {   item.input ? wordArray.map((word: string, key: number) => (
                                    <p key={key} className={`${fullscreen ? 'text-sm md:text-xl' : 'text-base'} `}>
                                        { word }
                                    </p>
                                ))
                                :
                                null
                            }
                        </div>
                    </div>
                )})
                : null
            }
            {/* <div className="bg-dark-blue font-open font-bold h-32 shadow-2 rounded px-4 py-2 mb-2">
                <h3>Culture:</h3>
                <p className="text-2xl">{displayProps.culture}</p>
            </div>
            <div className="bg-dark-blue font-open font-bold h-32 shadow-2 rounded px-4 py-2 mb-2">
                <h3>My Storyteller:</h3>
                <p className="text-2xl">{displayProps.storyteller}</p>
            </div>
            <div className="bg-dark-blue font-open font-bold h-32 shadow-2 rounded px-4 py-2 mb-2">
                <h3>Morals:</h3>
                <div className="h-24 flex flex-col overflow-scroll">
                    {keywordParser(displayProps.lessons).map((term, key) => (
                        <p className="text-2xl" key={key}>
                            {term}
                        </p>
                    ))
                    }
                </div>
            </div> */}
        </div>
    )
}

export default Modules;