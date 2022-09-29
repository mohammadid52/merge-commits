// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import * as iconoclastDict from '../../src/dictionary/dictionary.iconoclast';
import * as curateDict from '../../src/dictionary/dictionary.curate';
import * as demoDict from '../../src/dictionary/dictionary.demo';
import {getClientKey} from '../../src/utilities/strings';

// Alternatively you can use CommonJS syntax:
// require('./commands')

const getDictionary = (clientKey: string) => {
  if (clientKey === 'iconoclast') {
    return iconoclastDict;
  } else if (clientKey === 'curate') {
    return curateDict;
  } else if (clientKey === 'demo') {
    return demoDict;
  }
};

export {getClientKey, getDictionary};
