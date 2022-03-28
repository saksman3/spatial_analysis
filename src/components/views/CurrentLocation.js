import { useEffect } from 'react';
import currentLocationSource from 'data/sources/currentLocationSource';
import { CURRENT_LOCATION_LAYER_ID } from 'components/layers/CurrentLocationLayer';
import { useDispatch } from 'react-redux';
import {
  addLayer,
  removeLayer,
  addSource,
  removeSource,
} from '@carto/react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

//Custom Imports
import { Divider } from '@material-ui/core';
import { AggregationTypes, GroupDateTypes } from '@carto/react-core';
import { TimeSeriesWidget, FormulaWidget, PieWidget } from '@carto/react-widgets';

//Global Variables
const customFormatter = (value) => `${value}`.substring(0, `${value}`.indexOf(`.`)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + ` km`;
const customCount = (value) => `${value}`.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
const COLORSHEX = [
  '#000000',
  '#4E4E4E',
  '#6F6F6F',
  '#858585',
  '#979797',
  '#A7A7A7',
  '#B5B5B5',
  '#D5D5D5'
];

const useStyles = makeStyles(() => ({
  currentLocation: {},
}));

export default function CurrentLocation() {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(addSource(currentLocationSource));

    dispatch(
      addLayer({
        id: CURRENT_LOCATION_LAYER_ID,
        source: currentLocationSource.id,
      }),
    );

    return () => {
      dispatch(removeLayer(CURRENT_LOCATION_LAYER_ID));
      dispatch(removeSource(currentLocationSource.id));
    };
  }, [dispatch]);

  // [hygen] Add useEffect

  return (
    <Grid container direction='column' className={classes.currentLocation}>
      <Grid item>
        <div>
          <FormulaWidget
            id='numVehicles'
            title='Number of Vehicles'
            dataSource={currentLocationSource.id}
            column='vehicleid'
            operation={(AggregationTypes.COUNT)}
            formatter={customCount}
          />

          <Divider />

          <h6 className="MuiTypography-root MuiTypography-subtitle1 MuiTypography-colorTextPrimary"><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mileage (All vehicles)</h6>

          <FormulaWidget
            id='30DayAverage'
            title='Last 30 Day Average'
            dataSource={currentLocationSource.id}
            column='DistanceMTD'
            operation={(AggregationTypes.AVG)}
            formatter={customFormatter}
          />

          <Divider />

          <FormulaWidget
            id='7DayAverage'
            title='Last 7 Day Average'
            dataSource={currentLocationSource.id}
            column='Distance7Days'
            operation={(AggregationTypes.AVG)}
            formatter={customFormatter}
          />

          <Divider />

          <FormulaWidget
            id='mileageYesterday'
            title='Yesterday'
            dataSource={currentLocationSource.id}
            column='DistanceYesterday'
            operation={(AggregationTypes.SUM)}
            formatter={customFormatter}
          />

          <Divider />

          <FormulaWidget
            id='mileageToday'
            title='Today'
            dataSource={currentLocationSource.id}
            column='DistanceToday'
            operation={(AggregationTypes.SUM)}
            formatter={customFormatter}
          />

          <Divider />

          <PieWidget
            id='vehicleManufacturer'
            title='Vehicle Manufacturer'
            dataSource={currentLocationSource.id}
            column='Manufacture'
            operationColumn='vehicleid'
            operation={AggregationTypes.COUNT}
            colors={[COLORSHEX[0], COLORSHEX[1], COLORSHEX[2], COLORSHEX[3], COLORSHEX[4], COLORSHEX[5]]}
          />
          
          <Divider />

          <PieWidget
            id='vehicleType'
            title='Vehicle Type'
            dataSource={currentLocationSource.id}
            column='VehicleType'
            operationColumn='vehicleid'
            operation={AggregationTypes.COUNT}
            colors={[COLORSHEX[0], COLORSHEX[5]]}
          />
        </div>
      </Grid>
    </Grid>
  );
}
