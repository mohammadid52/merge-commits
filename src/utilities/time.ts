interface PatternObject {
    [key: string]: string;
}
export const formatTime = (pattern: string, separator: string, inputPattern: string, outputPattern: string) => {
    const patternStringObject = pattern.split(separator);
    const originalTime = inputPattern.split(separator).reduce((acc:PatternObject, val:string, i:number)=>{
       return {...acc, [`${val}`]:patternStringObject[i]}
    },{})
    const outputTime = outputPattern.split(separator).map((val: string, i: number) => originalTime[val])

    // console.log('formatpattern', patternStringObject);
    // console.log('formatpattern', originalTime);
    // console.log('formatpattern', outputTime);

    // The final; string
    return outputTime.join(separator);
}