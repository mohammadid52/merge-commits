import {useEffect, useRef, useState} from 'react';

export const useOutsideAlerter = (initialValue: boolean) => {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(initialValue)

    // console.log(visible, 'outsideAlerter')

    const handleClickOutside = (event: any) => {
        // console.log(ref.current)
        if (ref.current && !ref.current.contains(event.target)) setVisible(false)
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true)
        return () => {
            document.removeEventListener("click", handleClickOutside, true)
        }
    }, [ref]);

    

    return { visible, setVisible, ref }
}