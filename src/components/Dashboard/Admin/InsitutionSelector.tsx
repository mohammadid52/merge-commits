import Selector from '@components/Atoms/Form/Selector';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@tanstack/react-query';
import {uniqBy} from 'lodash';
import React from 'react';
import {withZoiqFilter} from '@utilities/functions';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {listInstitutionOptions} from 'customGraphql/customQueries';
import useAuth from '@customHooks/useAuth';

interface InsitutionSelectorProps {
  selectedInstitution?: any;
  onChange: (value: string, option: any) => void;
}

const InsitutionSelector = ({selectedInstitution, onChange}: InsitutionSelectorProps) => {
  const {InstitueRomms, userLanguage} = useDictionary();

  const [institutionList, setInstitutionList] = React.useState<any[]>([]);

  const fetchInstitutions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(listInstitutionOptions, {
          filter: withZoiqFilter({})
        })
      );

      const institutions = list?.data?.listInstitutions?.items;

      return institutions;
    } catch (error) {
      console.error(error);
    }
  };

  const {isSuperAdmin, isAdmin, isBuilder} = useAuth();

  useQuery({
    queryKey: ['institutions'],
    queryFn: fetchInstitutions,
    onSuccess: (data) => {
      setInstitutionList(
        uniqBy(data, 'name').map((d: any) => ({
          id: d.id,
          label: d.name,
          value: d.name
        }))
      );
    },
    enabled: isSuperAdmin || isAdmin || isBuilder
  });

  return (
    <Selector
      width={300}
      size="middle"
      showSearch
      placeholder={InstitueRomms[userLanguage]['SELECT_INSTITUTION']}
      list={institutionList}
      selectedItem={selectedInstitution}
      onChange={onChange}
    />
  );
};

export default InsitutionSelector;
