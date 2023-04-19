import Loader from '@components/Atoms/Loader';
import Placeholder from '@components/Atoms/Placeholder';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listInstitutionsForGraphs} from '@customGraphql/customQueries';

import {useQuery} from '@tanstack/react-query';
import {fetchZipUrl, withZoiqFilter} from '@utilities/functions';
import {Card, Descriptions, Empty} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {Marker, Popup} from 'react-leaflet';
import GraphMap from '../map/GraphMap';

const CustomMarker = ({
  zipCode,
  institution
}: {
  zipCode: string;
  institution: {
    name: string;
    image: string;
    phone: string;
    website: string;
  };
}) => {
  const [coord, setCoord] = useState({
    lat: 0,
    lng: 0
  });

  const [address, setAddress] = useState('');

  // Make the request
  useEffect(() => {
    fetch(fetchZipUrl(zipCode))
      .then((response) => response.json())
      .then((data) => {
        // Get the latitude and longitude from the response
        const {lat, lng} = data?.results[0]?.geometry?.location;
        setCoord({
          lat,
          lng
        });
        setAddress(data?.results[0]?.formatted_address);
      })
      .catch((error) => {
        console.error('Error fetching coordinates:', error);
      });
  }, []);
  return (
    <Marker position={[coord.lat, coord.lng]}>
      <Popup>
        <Card.Meta
          title={institution.name}
          avatar={<Placeholder image={institution.image} />}
          description={address}
        />
        <Descriptions className="mt-2" column={1}>
          <Descriptions.Item label="Phone">
            <a href={`tel:${institution.phone}`}>{institution.phone}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Website">
            <a href={institution.website} target="_blank" rel="noreferrer">
              {institution.website}
            </a>
          </Descriptions.Item>
        </Descriptions>
      </Popup>
    </Marker>
  );
};

const InstitutionLocationGraph = () => {
  const {zoiqFilter} = useGlobalContext();

  const fetchInstitutionLocation = async () => {
    const res: any = await API.graphql(
      graphqlOperation(listInstitutionsForGraphs, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter({}, zoiqFilter)
      })
    );
    return res.data.listInstitutions.items;
  };

  const {
    data: insitutionList,
    isLoading,
    isFetched
  } = useQuery<any[]>({
    queryKey: ['institution-list-graph'],
    queryFn: fetchInstitutionLocation
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting institutions...." />
      </div>
    );
  }

  if (insitutionList && insitutionList?.length > 0) {
    //  map the institution list and get the zip code
    //  then make a request to google api to get the lat and long
    //  then pass the lat and long to the marker component
    //  then pass the marker component to the map component

    const markers = insitutionList.map((institution) => {
      return (
        <CustomMarker
          key={institution.zip}
          zipCode={institution.zip}
          institution={institution}
        />
      );
    });

    return (
      <div className="w-full overflow-hidden">
        <GraphMap markers={markers} />
      </div>
    );
  }
  return <Empty description="No Institutions" />;
};

export default InstitutionLocationGraph;
