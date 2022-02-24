import CurrentLocationLayer from './CurrentLocationLayer';
// [hygen] Import layers

export const getLayers = () => {
  return [
    CurrentLocationLayer(),
    // [hygen] Add layer
  ];
};
