import { useSelector } from 'react-redux';
import { CartoLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';
import htmlForFeature from 'utils/htmlForFeature';

export const ROUTE_VIEW_LAYER_ID = 'routeViewLayer';

export default function RouteViewLayer() {
  const { routeViewLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, routeViewLayer?.source));
  const cartoLayerProps = useCartoLayerProps({ source });
  //console.log(source);
  if (routeViewLayer && source) {
    return new CartoLayer({
      ...cartoLayerProps,
      id: ROUTE_VIEW_LAYER_ID,
      getFillColor: [241, 109, 122],
      pointRadiusMinPixels: 2,
      //getLineColor: [255, 0, 0],
      getLineColor: (object) => {
        if (object.properties.RouteType == 'APPROVED ROUTE') {
          return [0, 0, 255];
        } else {
          return [255, 0, 0];
        }
      },
      lineWidthMinPixels: 2,
      pickable: true,
      onHover: (info) => {
        if (info?.object) {
          info.object = {
            html: htmlForFeature({ feature: info.object }),
            style: {},
          };
        }
      },
    });
  }
}
