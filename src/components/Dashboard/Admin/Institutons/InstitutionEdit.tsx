import React, { useContext, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as customMutations from '../../../../customGraphql/customMutations';
import { useHistory } from 'react-router-dom';
import InstitutionInfoIntf from './Institution';

/**
 * InstitutionEdit
 * Component responsible for the edit form of institutions
 * Will update the database with new info about the institution
 */
const InstitutionEdit: React.FC = () => {
  return <h1>Hello</h1>;
};

export default InstitutionEdit;
