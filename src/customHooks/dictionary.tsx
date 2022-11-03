import * as iconoclastDict from '@dictionary/dictionary.iconoclast';
import * as curateDict from '@dictionary/dictionary.curate';
import * as demoDict from '@dictionary/dictionary.demo';
import {useGlobalContext} from 'contexts/GlobalContext';

function useDictionary(_clientKey?: string) {
  const {clientKey} = useGlobalContext();
  const key = _clientKey || clientKey;

  if (key === 'iconoclast') {
    ``;
    return iconoclastDict;
  } else if (key === 'curate') {
    return curateDict;
  } else if (key === 'demo') {
    return demoDict;
  }
}

export default useDictionary;
