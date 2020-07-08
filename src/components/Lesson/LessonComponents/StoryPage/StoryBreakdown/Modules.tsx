import React from 'react';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

const keywordParser = (str: string) => {
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


const Modules = (props: any) => {
    const { additional } = props;

    if (!additional) {
        return null;
    }
    
    console.log(additional)

    return (
        <div className="w-2/10 flex flex-col text-gray-200 ml-4">
            {
                additional.map((item: any, key: number) => {
                    let wordArray = keywordParser(item.input)
                    return (
                    <div key={key} className={`bg-dark-blue font-open font-bold h-32 shadow-2 rounded px-4 py-2 ${key === additional.length - 1 ? '' : 'mb-2'}`}>
                        <h3>{keywordCapitilizer(item.name)}:</h3>
                        <div className="w-full px-2 overflow-scroll">
                            {   item.input ? wordArray.map((word: string, key: number) => (
                                    <p key={key} className="text-xl">
                                        { word }
                                    </p>
                                ))
                                :
                                null
                            }
                        </div>
                    </div>
                )})
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