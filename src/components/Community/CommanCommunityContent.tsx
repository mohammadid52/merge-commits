import ContentCard from '@atoms/ContentCard';
import Loader from '@components/Atoms/Loader';
import Card from '@components/Community/Card';
import useAuth from '@customHooks/useAuth';
import * as queries from '@graphql/queries';
import {ICommunityCard} from '@interfaces/Community.interfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import {API, graphqlOperation} from 'aws-amplify';
import orderBy from 'lodash/orderBy';
import React, {useEffect, useState} from 'react';

const CommanCommunityContent = ({
  contentOnlyForTeachers,
}: {
  contentOnlyForTeachers?: React.ReactNode;
}) => {
  const [list, setList] = useState<ICommunityCard[]>([]);

  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const {instId, isStudent} = useAuth();

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      let payload: any = {
        institutionID: instId,
        limit: 12,
      };
      const res: any = await API.graphql(
        graphqlOperation(queries.listCommunitys, payload)
      );
      const data = res.data.listCommunitys.items;
      if (data.length > 0) {
        const orderedList = orderBy(data, ['createdAt'], 'desc');
        setList([...orderedList]);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchCommunities();
    }
  }, [isFetched]);

  return (
    <ContentCard
      hasBackground={false}
      additionalClass="shadow bg-white space-y-12 p-6 rounded-b-lg">
      {!isStudent && contentOnlyForTeachers}

      {!Boolean(error) && isLoading && !isFetched && (
        <Loader withText="Loading cards..." className="w-auto text-gray-400" />
      )}

      {/* Error--1213 */}
      <AnimatedContainer show={Boolean(error)}>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </AnimatedContainer>

      {/* Other Cards here */}
      {!isLoading &&
        isFetched &&
        list &&
        list.length > 0 &&
        list.map((card, idx) => <Card key={idx} cardDetails={card} />)}
    </ContentCard>
  );
};

export default CommanCommunityContent;
