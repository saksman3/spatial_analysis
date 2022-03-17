import { MAP_TYPES } from '@deck.gl/carto';

const query = `SELECT a.AccountNumber, a.RouteUID, a.RouteMap, ST_GeogFromText(b.route_polyline) as geom,'APRROVED ROUTE' as RouteType 
FROM sa-taxi-edw.analytics.account_summary_new a 
join sa-taxi-edw.geography.route_map b
on cast(a.RouteUID as INT64) = b.route_uid 
--WHERE ACCOUNTNUMBER 
UNION ALL SELECT a.AccountNumber, RouteUID, RouteMap, geom, 'ACTUAL ROUTE' as RouteType
FROM(SELECT dealnumber as AccountNumber
, ST_MakeLine(ARRAY_AGG(ST_GeogPoint(coordinate_longitude, coordinate_latitude)
ORDER BY timestamp)) as geom
FROM sa-taxi-edw.cartrack.current_location
WHERE  partition_date >= DATE_SUB(Current_Date, INTERVAL 7 DAY)
and timestamp >= DATE_SUB(Current_Date, INTERVAL 7 DAY)
--and 
group by 1
) a
join sa-taxi-edw.analytics.account_summary_new b
on a.AccountNumber = b.AccountNumber`;
const ROUTE_VIEW_SOURCE_ID = 'routeViewSource';

const source = {
  id: ROUTE_VIEW_SOURCE_ID,
  type: MAP_TYPES.QUERY,
  connection: 'sa_taxi_default',
  data: query 
};

export default source;
