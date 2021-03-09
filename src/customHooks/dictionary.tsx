import * as iconoclastDict from '../dictionary/dictionary.iconoclast'
import * as curateDict from '../dictionary/dictionary.curate'
import * as demoDict from '../dictionary/dictionary.demo'

function useDictionary(clientKey: string) {
    if (clientKey === 'iconoclast') {
        return iconoclastDict
    } else if (clientKey === 'curate') {
        return curateDict
    } else if (clientKey === 'demo') {
        return demoDict
    }
}


export default useDictionary;