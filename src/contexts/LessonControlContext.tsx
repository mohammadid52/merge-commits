import React, { useState, useReducer, useEffect } from 'react';
import { lessonControlState } from '../state/LessonControlState';
import { lessonControlReducer } from '../reducers/LessonControlReducer';

const students = [
    {
        status: 'ONLINE',
        progress: 'intro',
        data: {
            dofirst: 'I am from Texas, and I love it here...'
        },
        info: {
            "id": "142892e8-c5c2-4636-97c7-a22cc8f1dd35",
            "authId": "0a79c33f-83e8-4db9-9b46-c818ce5f8ade",
            "email": "marlon.lizama@iconoclastartists.org",
            "firstName": "Marlon",
            "language": "EN",
            "lastName": "Lizama",
            "phone": "1234567890",
            "role": "ADM",
            "status": "ACTIVE",
        },
    },
    {
        status: 'ONLINE',
        progress: 'warmup',
        data: {
            dofirst: 'I am from Houston. Houston is the most populous city in Texas and the fourth largest in the U.S. Comprising a total area of 637.4 square miles (1,651 km2), Houston is the eighth most expansive city in the United States'
        },
        info: {
            "id": "0b8a03d6-8b79-4eb1-b967-47b36fcd58bb",
            "authId": "8c3be880-15e8-42b9-90b4-71d6cb27cc53",
            "email": "claudia.crane@iconoclastartists.org",
            "firstName": "Claudia",
            "language": "EN",
            "lastName": "Crane",
            "phone": "1234567890",
            "role": "ADM",
            "status": "ACTIVE",
        },
    },
    {
        status: 'IDLE',
        progress: 'intro',
        data: {
            dofirst: 'I\'m from Texas. It is the best state in the country. We have all the best things, like barbecue and steak',
        },
        info: {
            "id": "e437b65f-9f67-4e7f-bbf4-747c11a07165",
            "authId": "4030cc63-cb29-442c-ba44-b8cb62e37916",
            "email": "michael.russell@zoiq.io",
            "firstName": "Michael",
            "language": "EN",
            "lastName": "Russell",
            "phone": "+420770642500",
            "role": "ADM",
            "status": "ACTIVE",
        },
    },
    {
        status: 'OFFLINE',
        progress: '',
        data: {
            dofirst: ''
        },
        info: {
            "id": "e56d032c-5e8b-4327-9008-0a98bb738e95",
            "authId": "c8e25b37-103a-41e5-998b-56145bbd94c9",
            "email": "and.d.markham@gmail.com",
            "firstName": "Andrew",
            "language": "EN",
            "lastName": "Markham",
            "phone": "1234567890",
            "preferredName": "Andy",
            "role": "ADM",
            "status": "ACTIVE",
        },
    },
    {
        status: 'OFFLINE',
        progress: '',
        data: {

        },
        info: {
            "id": "0ab04955-105e-4425-86d7-f0762d0b72a8",
            "authId": "9178ab95-33cb-403f-8a65-c8269a25bed5",
            "birthdate": "2010-01-25",
            "email": "jayne.phillips61@gmail.com",
            "firstName": "Jayne",
            "language": "ES",
            "lastName": "Phillips",
            "phone": "000555",
            "preferredName": "Jayney",
            "role": "BLD",
            "status": "ACTIVE",
        },
    },
]

const tempPagesArray = [
    {
      "type": "intro",
      "stage": "",
      "open": true,
      "disabled": false,
      "active": true,
    },
    {
      "type": "profile",
      "stage": "checkpoint",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "story",
      "stage": "warmup",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "breakdown",
      "stage": "warmup/breakdown",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "lyrics",
      "stage": "corelesson",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "breakdown",
      "stage": "corelesson/breakdown",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "poem",
      "stage": "activity",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "breakdown",
      "stage": "activity/breakdown",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "sel",
      "stage": "checkpoint",
      "open": false,
      "disabled": false,
      "active": false
    },
    {
      "type": "outro",
      "stage": "outro",
      "open": false,
      "disabled": false,
      "active": false
    }
  ]

interface LessonControlProps {
    children: React.ReactNode;
}

export const LessonControlContext = React.createContext(null);

export const LessonControlContextProvider = ({ children }: LessonControlProps) => {
    const [ state, dispatch ] = useReducer(lessonControlReducer, lessonControlState);
    // const [ lightOn, setLightOn ] = useState(true);

    // const lightSwitch = () => {
    //     setLightOn(prev => {
    //         return !prev
    //     })
    // }

    // const forceTheme = (bool: boolean) => {
    //     setLightOn(bool)
    // }

    // const theme = lightOn ? pageThemes.light : pageThemes.dark;

    useEffect(() => {
        let timer = setTimeout(() => {
            dispatch({type: 'SET_STUDENTS', payload: students})
            dispatch({type: 'SET_PAGES', payload: tempPagesArray})
            clearTimeout(timer)
        }, 3000)
    }, [])


    return (
        <LessonControlContext.Provider value={{ state }}>
            { children }
        </LessonControlContext.Provider>
    )
}

