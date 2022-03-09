import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useState, useEffect } from 'react';
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
  const classes = useStyles();
  const [accounts,setAccounts] = useState([]);
  const [filteredAccount,setFilteredAccount] = useState("");
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
     console.log(Range);
     setFilteredAccount(account);

  }
  const handleDateSelect=(ranges)=>{
    console.log(ranges.selection);
    setDateRange([ranges.selection])
    
  }
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
      />
    </Grid>
  );
}
