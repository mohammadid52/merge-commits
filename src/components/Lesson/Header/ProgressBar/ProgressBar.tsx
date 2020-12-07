import React, { useContext } from 'react';
import StageIcon from './StageIcon';
const ProgressBar = () => {
    const { state, theme } = useContext(LessonContext);

    /**
     *
     * filter multiple stages
     * map over multiple stages
     * use this map as stage name e.g. Breakdown 1, Breakdown 2, Breakdown 3...
     *
     * THIS CODE NEEDS TO BE REWRITTEN, SUPER UNCLEAR AT THE MOMENT
     *
     * Duplicated in:
     *
     * - ProgressBar.tsx
     * - LessonControlBar.tsx
     *
     */

    const mapStages = state.pages.map(
        (page: { stage: string; type: string; open: boolean; disabled: boolean }, stageNr: number) => ({
            ...page,
            stageNr: stageNr,
        })
    );

    const checkIfMultipleStages = (type: string) => {
        return (
            state.pages.filter(
                (page: { stage: string; type: string; open: boolean; disabled: boolean }) =>
                    page.type === type
            ).length > 1
        );
    };

    const mapMultipleStages = (type: string) => {
        const out = mapStages
            .filter(
                (page: {
                    stage: string;
                    type: string;
                    open: boolean;
                    disabled: boolean;
                    stageNr: number;
                }) => page.type === type
            )
            .map(
                (
                    page: { stage: string; type: string; open: boolean; disabled: boolean; stageNr: number },
                    i: number
                ) => ({
                    ...page,
                    multipleCounter: i+1,
                })
            );

        return out;
    };

    const getSpecificStage = (type: string, stageNr: number) => {
        const out = mapMultipleStages(type).filter(
            (page: {
                stage: string;
                type: string;
                open: boolean;
                disabled: boolean;
                stageNr: number;
                multipleCounter: number;
            }) => page.stageNr === stageNr
        );

        return out[0];
    };

    /**
     * Explanation
     *
     * state.currentPage = number of current page from 0 - total nr of pages
     * state.pages = array of available pages
     * state.pages[i].type = name of page type/story/breakdown
     */

    return (
        <>
            <div className='hidden max-w-256 md:flex flex-col flex-grow items-center justify-center content-center z-0'>
                <div className='w-full max-w-256 flex items-center justify-between'>
                    <div className='w-full flex flex-row items-center justify-between'>
                        {/* ICON */}
                        {state.pages.map(
                            (
                                page: { stage: string; type: string; open: boolean; disabled: boolean },
                                key: number
                            ) => (
                                <div
                                    className={`${
                                        key < state.pages.length - 1 ? 'w-full' : 'w-auto'
                                    } flex justify-center items-center`}>
                                    {/* {console.log('checkIfMultipleStages : ', checkIfMultipleStages(page.type))} */}

                                    <StageIcon
                                        iconID={key}
                                        key={key}
                                        stage={page.stage}
                                        type={page.type}
                                        active={state.pages[key].active}
                                        open={page.open}
                                        disabled={page.disabled}
                                        counter={
                                            checkIfMultipleStages(page.type)
                                                ? getSpecificStage(page.type, key).multipleCounter
                                                : null
                                        }
                                    />

                                    {/* PROGRESS BAR */}
                                    {key < state.pages.length - 1 && (
                                        <div
                                            key={key + 'bar'}
                                            className='relative h-2 w-full bg-dark-gray z-10 flex items-center justify-center transform scale-x-125 '>
                                            <div
                                                className={`h-2 w-full ${
                                                    state.pages[key + 1].active ? 'bg-blueberry' : 'bg-dark-gray'
                                                }`}/>
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

import { LessonContext } from '../../../../contexts/LessonContext';

export default ProgressBar;
