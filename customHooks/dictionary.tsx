import * as iconoclastDict from '../dictionary/dictionary.iconoclast'
import * as curateDict from '../dictionary/dictionary.curate'

function useDictionary(clientKey: string) {
    if (clientKey === 'iconoclast') {
        return iconoclastDict
    } else if (clientKey === 'curate') {
        return curateDict
    }
}

export default useDictionary;