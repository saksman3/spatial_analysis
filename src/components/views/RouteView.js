import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useState, useEffect } from 'react';
import routeViewSource from 'data/sources/routeViewSource';
import { ROUTE_VIEW_LAYER_ID } from 'components/layers/RouteViewLayer';
import { useDispatch } from 'react-redux';
import {
  addLayer,
  removeLayer,
  addSource,
  removeSource,
} from '@carto/react-redux';

import Cookies from "js-cookie";
import {DateRange} from 'react-date-range';
import {format} from 'date-fns'
import SearchBar from './SearchBar';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const useStyles = makeStyles(() => ({
  routeView: {},
}));

export default function RouteView() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [accounts,setAccounts] = useState([]);
  const [filteredAccount,setFilteredAccount] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  //use react state to set start and end date default should be 7 days ago from now.
  const [Range,setDateRange] = useState([{
    
      "endDate": new Date(),
      "startDate": new Date(new Date().setDate(new Date().getDate() - 7)),
      "key":"selection",
  }]);
  useEffect(()=>{
    // get account data on page load
    const token = Cookies.get('access_token');
    fetch('https://gcp-europe-west1.api.carto.com/v3/sql/sa_taxi_default/query',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body:JSON.stringify({
        "q":"select AccountNumber from sa-taxi-edw.analytics.account_summary"
      })
    }).then(response=>response.json()).then(data=>{
       setAccounts(data.rows)
    })
  })

  const RetrieveData = (account)=>{
    // this method will fetch data when user clicked on search button.
     setFilteredAccount(account);
     const formattedEndDate = format(Range[0].endDate,"yyyy-MM-dd");
     const formattedStartDate = format(Range[0].startDate,"yyyy-MM-dd")
     setSelectedStartDate(formattedStartDate);
     setSelectedEndDate(formattedEndDate);
     const query = `SELECT a.AccountNumber, a.RouteUID, a.RouteMap, ST_GeogFromText(b.route_polyline) as geom,'APRROVED ROUTE' as RouteType 
FROM sa-taxi-edw.analytics.account_summary_new a 
join sa-taxi-edw.geography.route_map b
on cast(a.RouteUID as INT64) = b.route_uid 
WHERE ACCOUNTNUMBER = '${account}' UNION ALL SELECT a.AccountNumber, RouteUID, RouteMap, geom, 'ACTUAL ROUTE' as RouteType
FROM(SELECT dealnumber as AccountNumber
, ST_MakeLine(ARRAY_AGG(ST_GeogPoint(coordinate_longitude, coordinate_latitude)
ORDER BY timestamp)) as geom
FROM sa-taxi-edw.cartrack.current_location
WHERE partition_date >= DATE_SUB(Current_Date, INTERVAL 7 DAY)
and timestamp >= DATE_SUB(Current_Date, INTERVAL 7 DAY)
and dealnumber = '${account}'
group by 1
) a
join sa-taxi-edw.analytics.account_summary_new b
on a.AccountNumber = b.AccountNumber`;
     routeViewSource.data = query
     dispatch(addSource(routeViewSource))
     dispatch(
      addLayer({
        id: ROUTE_VIEW_LAYER_ID,
        source: routeViewSource.id,
      }),
    )

  }
  const handleDateSelect=(ranges)=>{
    console.log(ranges.selection);
    setDateRange([ranges.selection])
    
  }
  useEffect(() => {
    dispatch(addSource(routeViewSource));
    console.log(routeViewSource.data);
    dispatch(
      addLayer({
        id: ROUTE_VIEW_LAYER_ID,
        source: routeViewSource.id,
      }),
    );

    return () => {
      dispatch(removeLayer(ROUTE_VIEW_LAYER_ID));
      dispatch(removeSource(routeViewSource.id));
    };
  }, [dispatch]);

  // [hygen] Add useEffect

  return (
    <Grid container direction='column' className={classes.routeView}> 
      <SearchBar 
      placeholder="Search Account" 
      data={accounts}
      RetrieveData={RetrieveData}
      />
      
      <DateRange
         editableDateInputs={true}
         moveRangeOnFirstSelection={false}
         ranges={Range}
         onChange={handleDateSelect}
         dayDisplayFormat="dd"
         monthDisplayFormat="MM"
      />
    </Grid>
  );
}
