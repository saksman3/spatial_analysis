import CurrentLocationLayer from './CurrentLocationLayer';
import RouteViewLayer from './RouteViewLayer';
// [hygen] Import layers

export const getLayers = () => {
  return [
    CurrentLocationLayer(),
    RouteViewLayer(),
    // [hygen] Add layer
  ];
};
