import API, { graphqlOperation } from '@aws-amplify/api';
import * as customQueries from '../customGraphql/customQueries';

let designers: any = [];

export const fetchDesigners = async () => {
  if (!designers.length) {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.listPersons, {
        filter: { or: [{ role: { eq: 'TR' } }, { role: { eq: 'BLD' } }] },
      })
    );
    const savedData = result.data.listPersons;
    designers = savedData?.items.map(
      (item: { id: string; firstName: string; lastName: string }) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item.lastName || ''}`,
        value: `${item?.firstName || ''} ${item.lastName || ''}`,
      })
    );
  }
  return designers;
};