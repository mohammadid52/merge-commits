import {fetchZipUrl} from '@utilities/functions';
import {checkIfId} from '@utilities/strings';
import {QuestionResponse} from 'API';
import {useEffect, useState} from 'react';
import {Marker} from 'react-leaflet';
import {
  ChildrenDemographicGraphProps,
  getQuestionIndex
} from '../students/StudentsByDemographicsGraph';
import GraphMap from './GraphMap';

const CustomMarker = ({zipCode}: {zipCode: string}) => {
  const [coord, setCoord] = useState({
    lat: 0,
    lng: 0
  });

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
      })
      .catch((error) => {
        console.error('Error fetching coordinates:', error);
      });
  }, []);
  return <Marker position={[coord.lat, coord.lng]} />;
};

const ZipGraph = ({data, id}: ChildrenDemographicGraphProps) => {
  const zipData = data
    .map(
      (item: {responseObject: QuestionResponse[] | {response: any[]}[]; authID: any}) => {
        // @ts-ignore
        const questionIndex = getQuestionIndex(id, item.responseObject);

        const value = item.responseObject?.[questionIndex]?.response?.[0] || '';
        const isId = checkIfId(value);

        if (isId || value === '') return null;

        return {
          authID: item.authID,
          value: value
        };
      }
    )
    .filter(Boolean);

  const markers = zipData.map((item: {authID: any; value: any}) => {
    return <CustomMarker key={item.authID} zipCode={item.value} />;
  });

  return <GraphMap markers={markers} />;
};

export default ZipGraph;
