import { MAP_TYPES } from '@deck.gl/carto';

const CURRENT_LOCATION_SOURCE_ID = 'currentLocationSource';

const source = {
  id: CURRENT_LOCATION_SOURCE_ID,
  type: MAP_TYPES.QUERY,
  connection: 'sa_taxi_default',
  data: `select * from sa-taxi-edw.analytics.Vw_STACCCurrentLocation`,
};

export default source;
