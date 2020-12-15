import { useState, useEffect, useContext } from 'react';
import {LessonContext} from "../contexts/LessonContext";

const usePageLabel = () => {
    const {state} = useContext(LessonContext);
    const [pageLabel, setPageLabel] = useState<string>('');
    const [prevPageLabel, setPrevPageLabel] = useState<string>('');

    useEffect(() => {
        const labelSwitch = (input: string) => {
            if (RegExp('Breakdown', 'i').test(input)) {
                return 'Breakdown';
            } else {
                if (RegExp('intro', 'i').test(input)) return 'Intro';
                if (RegExp('Warmup', 'i').test(input)) return 'Warm Up';
                if (RegExp('Corelesson', 'i').test(input)) return 'Core Lesson';
                if (RegExp('Activity', 'i').test(input)) return 'Activity';
                if (RegExp('Checkpoint', 'i').test(input)) return 'Checkpoint';
                if (RegExp('Outro', 'i').test(input)) return 'Outro';
            }
        };

        setPageLabel(labelSwitch(state.pages[state.currentPage].stage));
        setPrevPageLabel(labelSwitch(state.pages[state.currentPage-1].stage));

        return () => console.log(' -> ', '');
    }, []);

    return { prev: prevPageLabel, current: pageLabel };
};

export default usePageLabel;
