import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const CURRENT_LOCATION_LAYER_ID = 'currentLocationLayer';

const COLORSRGB = [
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
  [255, 0, 255],
  [255, 255, 0],
];

export default function CurrentLocationLayer() {
  const { currentLocationLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, currentLocationLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });

  if (currentLocationLayer && source) {
    return new CartoLayer({
      ...cartoLayerProps,
      id: CURRENT_LOCATION_LAYER_ID,
      //getFillColor: [241, 109, 122],
      getFillColor: (object) => {
        if (object.properties.VehicleType !== 'Open Market Insurance' && object.properties.Manufacture == 'Toyota') {
          return COLORSRGB[0];
        } else if (object.properties.VehicleType !== 'Open Market Insurance' && object.properties.Manufacture == 'Nissan') {
          return COLORSRGB[1];
        } else if (object.properties.VehicleType !== 'Open Market Insurance' && object.properties.Manufacture == 'Mercedes') {
          return COLORSRGB[2];
        } else if (object.properties.VehicleType == 'Open Market Insurance') {
          return COLORSRGB[3];
        } else {
          return COLORSRGB[4];
        }
      },
      pointRadiusMinPixels: 3,
      getLineColor: [255, 0, 0],
      lineWidthMinPixels: 0,
      lineWidthMaxPixels: 0,
      pickable: true,
      onHover: (info) => {
        if (info?.object) {
          info.object = {
            html: htmlForFeature({ feature: info.object, includeColumns: ['Name', 'timestamp', 'MovingInd', 'DistanceToday', 'DistanceYesterday', 'Distance7Days', 'DistanceMTD', 'L3MDistance', 'AccountNumber', 'SATaxiCDState', 'SalesSourceName', 'RouteMap', 'GuardriskPolicyInd', 'RiskGrade', 'DealerName', 'Expsosure', 'ArrearsAmount', 'InstalmentsRemaining', 'VehicleDescription', 'StatusGrouping'] }),
            style: {},
          };
        }
      },
    });
  }
}
