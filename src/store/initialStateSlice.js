import { VOYAGER } from '@carto/react-basemaps';
import { API_VERSIONS } from '@deck.gl/carto';
import Cookies from 'js-cookie';

export const initialState = {
  viewState: {
    latitude: -25.970323,
    longitude: 28.131103,
    zoom: 16,
    pitch: 0,
    bearing: 0,
    dragRotate: false,
  },
  basemap: VOYAGER,
  credentials: {
    apiVersion: API_VERSIONS.V3,
    apiBaseUrl: 'https://gcp-europe-west1.api.carto.com',
    accessToken: Cookies.get('access_token'),
  },
  googleApiKey: '', // only required when using a Google Basemap
  googleMapId: '', // only required when using a Google Custom Basemap
  /*oauth: {
    domain: 'auth.carto.com',
    // Type here your application client id
    clientId: '92PMKHAC9yqsxIzjviEc17zI6j4G6WoZ',
    scopes: [
      'read:current_user',
      'update:current_user',
      'read:connections',
      'write:connections',
      'read:maps',
      'write:maps',
      'read:account',
      'admin:account',
    ],
    audience: 'carto-cloud-native-api',
    authorizeEndPoint: 'https://carto.com/oauth2/authorize', // only valid if keeping https://localhost:3000/oauthCallback
  },*/
};
