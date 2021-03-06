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
import { DateRange } from 'react-date-range';
import { format } from 'date-fns'
import SearchBar from './SearchBar';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Divider } from '@material-ui/core';
import '../css/sidebardiv.css';

const useStyles = makeStyles(() => ({
  routeView: {},
}));

export default function RouteView() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccount, setFilteredAccount] = useState("");
  const [GautengPointCount, setGP] = useState(0);
  const [KZNPointCount, setKZN] = useState("");
  const [MPPointCount, setMP] = useState("");
  const [LPPointCount, setLP] = useState("");
  const [NWPointCount, setNW] = useState("");
  const [FSPointCount, setFS] = useState("");
  const [NCPointCount, setNC] = useState("");
  const [WCPointCount, setWC] = useState("");
  const [ECPointCount, setEC] = useState("");
  const [ApprovedRoute, setApprovedRoute] = useState("");
  const [ActualRouteDistanceKM, setActualRouteDistanceKM] = useState(0);
  const [OffRouteDistanceKM, setOffRouteDistanceKM] = useState(0);
  //use react state to set start and end date default should be 7 days ago from now.
  const [Range, setDateRange] = useState([{

    "endDate": new Date(),
    "startDate": new Date(new Date().setDate(new Date().getDate() - 7)),
    "key": "selection",
  }]);
  useEffect(() => {
    const getData = async () => {
      // get account data on page load
      console.log("getting accounts")
      const token = Cookies.get('access_token');
      console.log(token)
      await fetch('https://gcp-europe-west1.api.carto.com/v3/sql/sa_taxi_default/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          "q": "select AccountNumber from sa-taxi-edw.analytics.account_summary"
        })
      }).then(response => response.json()).then(data => {
        setAccounts(data.rows)
      })
    }
    getData();
  }, [])

  const RetrieveData = (account) => {
    const token = Cookies.get('access_token');
    console.log(token);
    // this method will fetch data when user clicked on search button. an argument of account is expected to be passed into it 
    const formattedEndDate = format(Range[0].endDate, "yyyy-MM-dd");
    const formattedStartDate = format(Range[0].startDate, "yyyy-MM-dd")
    const query = `SELECT a.AccountNumber, a.RouteUID, a.RouteMap, ST_GeogFromText(b.route_polyline) as geom,'APPROVED ROUTE' as RouteType 
                    FROM sa-taxi-edw.analytics.account_summary_new a 
                    join sa-taxi-edw.geography.route_map b
                    on cast(a.RouteUID as INT64) = b.route_uid 
                    WHERE ACCOUNTNUMBER = '${account}' UNION ALL SELECT a.AccountNumber, RouteUID, RouteMap, geom, 'ACTUAL ROUTE' as RouteType
                    FROM(SELECT dealnumber as AccountNumber
                    , ST_MakeLine(ARRAY_AGG(ST_GeogPoint(coordinate_longitude, coordinate_latitude)
                    ORDER BY timestamp)) as geom
                    FROM sa-taxi-edw.cartrack.current_location
                    WHERE partition_date >= '${formattedStartDate}' and partition_date <= '${formattedEndDate}'
                    and timestamp >= '${formattedStartDate}' and date(timestamp) <= '${formattedEndDate}'
                    and dealnumber = '${account}'
                    group by 1
                    ) a
                    join sa-taxi-edw.analytics.account_summary_new b
                    on a.AccountNumber = b.AccountNumber`;
    const provinceQuery = `SELECT
                            G.vehicleid,
                            G.dealnumber,
                            R.route_uid,
                            R.route_map,
                            DayOfmonth,
                            GPPointCount,
                            KZNPointCount,
                            MPPointCount,
                            LPPointCount,
                            NWPointCount,
                            FSPointCount,
                            NCPointCount,
                            WCPointCount,
                            ECPointCount,
                            (GPPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as GPPointPercentage,
                            (KZNPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as KZNPointPercentage,
                            (MPPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as MPPointPercentage,
                            (LPPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as LPPointPercentage,
                            (FSPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as FSPointPercentage,
                            (NWPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as NWPointPercentage,
                            (ECPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as ECPointPercentage,
                            (NCPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as NCPointPercentage,
                            (WCPointCount/(GPPointCount + KZNPointCount + MPPointCount + LPPointCount + FSPointCount + NWPointCount + ECPointCount + NCPointCount + WCPointCount)) * 100 as WCPointPercentage,
                            ST_LENGTH(WKT_Actual)/1000 AS ActualDistance_km,
                            (ST_LENGTH(ST_DIFFERENCE(WKT_Actual,
                            ST_Buffer(ST_GeogFromText(route_polyline),
                            100,
                            8.0,
                            endcap=>'flat'))))/1000 AS OffRouteDistance_km
                            FROM (
                            SELECT
                            vehicleid,
                            dealnumber,
                            DATE(timestamp) AS DayOfMonth,
                            ST_MakeLine(ARRAY_AGG(ST_GeogPoint(coordinate_longitude,
                            coordinate_latitude)
                            ORDER BY
                            timestamp)) AS WKT_Actual,
                            SUM(
                            IF
                            (PR_NAME = 'Gauteng',
                            1,
                            0)) AS GPPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'KwaZulu-Natal',
                            1,
                            0)) AS KZNPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'Mpumalanga',
                            1,
                            0)) AS MPPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'Limpopo',
                            1,
                            0)) AS LPPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'North West',
                            1,
                            0)) AS NWPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'Free State',
                            1,
                            0)) AS FSPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'Northern Cape',
                            1,
                            0)) AS NCPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'Western Cape',
                            1,
                            0)) AS WCPointCount,
                            SUM(
                            IF
                            (PR_NAME = 'Eastern Cape',
                            1,
                            0)) AS ECPointCount
                            FROM
                            sa-taxi-edw.cartrack.current_location C
                            WHERE
                            dealnumber = '${account}'
                            AND partition_date >= '${formattedStartDate}' and partition_date <= '${formattedEndDate}'
                            AND timestamp >= '${formattedStartDate}' and date(timestamp) <= '${formattedEndDate}'
                            GROUP BY
                            1,
                            2,3 ) G
                            LEFT JOIN
                            sa-taxi-edw.analytics.account_summary_new a
                            ON
                            a.VehicleID = g.VehicleID
                            LEFT JOIN
                            sa-taxi-edw.geography.route_map R
                            ON
                            CAST(R.route_uid AS string) = a.RouteUID`;
    fetch('https://gcp-europe-west1.api.carto.com/v3/sql/sa_taxi_default/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "q": provinceQuery
      })
    })
      .then(response => response.json())
      .then(json_data => {
        //console.log(json_data.rows[0].RouteMap)
        let num_of_days = json_data.rows.length
        const data = json_data.rows
        console.log(json_data.rows)
        setApprovedRoute(data[0].route_map)
        //get gp average
        let GPreducer = (acc, currVal) => {

          return acc + currVal.GPPointPercentage
        }
        setGP((data.reduce(GPreducer, 0) / num_of_days).toFixed(2))
        //get KZN average
        let KZNreducer = (acc, currVal) => {

          return acc + currVal.KZNPointPercentage
        }
        setKZN((data.reduce(KZNreducer, 0) / num_of_days).toFixed(2))

        //get Mp average
        let MPreducer = (acc, currVal) => {

          return acc + currVal.MPPointPercentage
        }
        setMP((data.reduce(MPreducer, 0) / num_of_days).toFixed(2))
        // get LP average
        let LPreducer = (acc, currVal) => {

          return acc + currVal.LPPointPercentage
        }
        setLP((data.reduce(LPreducer, 0) / num_of_days).toFixed(2))
        // get NW average

        let NWreducer = (acc, currVal) => {

          return acc + currVal.NWPointPercentage
        }
        setNW((data.reduce(NWreducer, 0) / num_of_days).toFixed(2))


        // get FS Average
        let FSreducer = (acc, currVal) => {

          return acc + currVal.FSPointPercentage
        }
        setFS((data.reduce(FSreducer, 0) / num_of_days).toFixed(2))


        // get NC average
        let NCreducer = (acc, currVal) => {

          return acc + currVal.NCPointPercentage
        }
        setNC(data.reduce(NCreducer, 0) / num_of_days)


        // WC average
        let WCreducer = (acc, currVal) => {

          return acc + currVal.WCPointPercentage
        }
        setWC(data.reduce(WCreducer, 0) / num_of_days)

        // get EC average
        let ECreducer = (acc, currVal) => {

          return acc + currVal.ECPointPercentage
        }
        setEC(data.reduce(ECreducer, 0) / num_of_days)

        //get actual distance sum
        let actual_distance_reducer = (accumulator, currentValue) => accumulator + currentValue.ActualDistance_km
        setActualRouteDistanceKM((data.reduce(actual_distance_reducer, 0).toFixed(2)));
        // get off route total
        let off_route_distance_reducer = (accumulator, currentValue) => accumulator + currentValue.OffRouteDistance_km
        setOffRouteDistanceKM((data.reduce(off_route_distance_reducer, 0).toFixed(2)))
      })
      .catch(err => console.log(err))
    //console.log(query);
    //console.log(provinceQuery);
    routeViewSource.data = query // update the query to be executed.
    // re-render the map with the new source filters.
    dispatch(addSource(routeViewSource))
    dispatch(
      addLayer({
        id: ROUTE_VIEW_LAYER_ID,
        source: routeViewSource.id,
      }),
    )

  }
  const handleDateSelect = (ranges) => {
    setDateRange([ranges.selection])
  }
  /*   useEffect(() => {
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
    }, [dispatch]); */

  // [hygen] Add useEffect

  return (
    <Grid container direction='column' className={classes.routeView}>
      { /* include the search bar component, 
      it expects data which is the list of objects, Retrieve data which is the function that fetches data from source when you click on search */}

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

      <Divider />

      <h6 className="MuiTypography-root MuiTypography-subtitle1 MuiTypography-colorTextPrimary">
        <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Approved Route</h6>
      <br />
      <div className="approvedroute MuiBox-root MuiBox-root-47 makeStyles-root-44">
        {ApprovedRoute}
        <br />
      </div>

      <Divider />

      <h6 className="MuiTypography-root MuiTypography-subtitle1 MuiTypography-colorTextPrimary">
        <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Actual Route Distance KM</h6>
      <div className="approvedroute">
        <span className="MuiBox-root MuiBox-root-47 makeStyles-root-44">{ActualRouteDistanceKM}</span>
      </div>
      <h6 className="MuiTypography-root MuiTypography-subtitle1 MuiTypography-colorTextPrimary">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Off Route Distance KM</h6>
      <div className="approvedroute">
        <span className="MuiBox-root MuiBox-root-47 makeStyles-root-44">{OffRouteDistanceKM}</span>
      </div>

      <Divider />

      <h6 className="MuiTypography-root MuiTypography-subtitle1 MuiTypography-colorTextPrimary">
        <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;% Per Province</h6>
      <br />
      <div className="provincecontainer MuiBox-root MuiBox-root-47 makeStyles-root-44">
        <div classname="provinceitem"><b>Gauteng</b></div>
        <div classname="provinceitem">{GautengPointCount}</div>
        <div classname="provinceitem"><b>Mpumalanga</b></div>
        <div classname="provinceitem">{MPPointCount}</div>
        <div classname="provinceitem"><b>Limpopo</b></div>
        <div classname="provinceitem">{LPPointCount}</div>
        <div classname="provinceitem"><b>North West</b></div>
        <div classname="provinceitem">{NWPointCount}</div>
        <div classname="provinceitem"><b>Eastern Cape</b></div>
        <div classname="provinceitem">{ECPointCount}</div>
        <div classname="provinceitem"><b>Kwazulu Natal</b></div>
        <div classname="provinceitem">{KZNPointCount}</div>
        <div classname="provinceitem"><b>Western Cape</b></div>
        <div classname="provinceitem">{WCPointCount}</div>
        <div classname="provinceitem"><b>Northern Cape</b></div>
        <div classname="provinceitem">{NCPointCount}</div>
        <div classname="provinceitem"><b>Free State</b></div>
        <div classname="provinceitem">{FSPointCount}</div>
      </div>
    </Grid>
  );
}
