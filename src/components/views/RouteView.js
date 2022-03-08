import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import SearchBar from './SearchBar';


const useStyles = makeStyles(() => ({
  routeView: {},
}));

export default function RouteView() {
  const classes = useStyles();
  const [accounts,setAccounts] = useState([]);
  useEffect(()=>{
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

  // [hygen] Add useEffect

  return (
    <Grid container direction='column' className={classes.routeView}> 
      <SearchBar placeholder="Search Account" data={accounts}/>
    </Grid>
  );
}
