import React from 'react';

const labelDictionary = {
    lessonDict: {
        'EN': {
            continue: 'Continue',
            back: 'Back',
            instructions: 'Instructions',
            aboutTheArtist: 'About the Artist',
            story: 'Story',
            lyrics: 'Lyrics',
            poem: 'Poem',
            title: 'Title',
            chooseATitle: 'Choose a title',
            focusQuestions: 'Focus Questions',
            writeYourStoryHere: 'Write your story here!',
            reflectionQuestions: 'Reflection Questions',
            toolbox: 'Toolbox',
            highlighters: 'Highlighters',
            myWordBank: 'My Word Bank',
            search: 'Search',
            linePrompts: 'Line Prompts',
            submit: 'Submit',
            finalEdits: 'Final Edits',
            outroDummyText: 'Congrats! You\'ve completed 1 story and 1 poem!',
        },
        'ES': {
            continue: 'Continuar',
            back: 'Volver',
            instructions: 'Instrucciones',
            aboutTheArtist: 'Sobre el artista',
            story: 'Cuento',
            lyrics: 'Letra',
            poem: 'Poema',
            title: 'Título',
            chooseATitle: 'Escoja un título',
            focusQuestions: 'Focus Questions',
            writeYourStoryHere: 'Escriba tu cuesto aquí!',
            reflectionQuestions: 'Reflection Questions',
            toolbox: 'Toolbox',
            highlighters: 'Marcadores',
            myWordBank: 'My Word Bank',
            search: 'Buscar',
            linePrompts: 'Line Prompts',
            submit: 'Submit',
            finalEdits: 'Final Edits',
            outroDummyText: 'Congrats! You\'ve completed 1 story and 1 poem!',
        }
    }
}

function useDictionary(language: string) {
    async function lookUp(word: string) {
        const appId = 'c4ad157e';
        const appKey = 'cc99a6410f78f4d8da7b70e0fcea3254';
        const endpoint = "entries";
        const languageCode = "en-us";
        const wordId = word.toLowerCase()

        const url = "https://od-api.oxforddictionaries.com/api/v2/" + endpoint + "/" + languageCode + "/" + wordId

        const res = await fetch(url, {
            headers: {
                'app_id': appId,
                'app_key': appKey,
            },
        })
        const data = await res.json();
        console.log('dict_res', data)

    }

    return {
        lookUp,
    }
}

export default useDictionary;