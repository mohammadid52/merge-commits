interface PatternObject {
    [key: string]: string;
}

/**
 * Quick function to flip around time/date formatting based on input & output pattern
 * Also works with other strings
 * @param pattern
 * @param separator
 * @param inputPattern
 * @param outputPattern
 */
export const formatTime = (pattern: string, separator: string, inputPattern: string, outputPattern: string) => {
    const patternStringObject = pattern.split(separator);
    const originalTime = inputPattern.split(separator).reduce((acc:PatternObject, val:string, i:number)=>{
       return {...acc, [`${val}`]:patternStringObject[i]}
    },{})
    const outputTime = outputPattern.split(separator).map((val: string, i: number) => originalTime[val])

    return outputTime.join(separator);
}