import * as iconoclastDict from '@dictionary/dictionary.iconoclast';
import * as curateDict from '@dictionary/dictionary.curate';
import * as demoDict from '@dictionary/dictionary.demo';
import {useGlobalContext} from 'contexts/GlobalContext';

function useDictionary(_clientKey?: 'iconoclast' | 'demo' | 'curate') {
  const {clientKey, userLanguage} = useGlobalContext();
  const key = _clientKey || clientKey;

  if (key === 'iconoclast') {
    return {...iconoclastDict, userLanguage};
  } else if (key === 'curate') {
    return {...curateDict, userLanguage};
  } else if (key === 'demo') {
    return {...demoDict, userLanguage};
  }
  return {...iconoclastDict, userLanguage};
}

export default useDictionary;
