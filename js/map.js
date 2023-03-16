import {addDisabled} from './form.js';
import {renderNewOffer} from './offers.js';

const ADS_NUMBERS = 10;

const MAP_COORDINATES = {
  lat: 35.6895,
  lng: 139.692,
};
const MAP_ZOOM = 10;
const MAIN_MARKER_COORDINATE = {
  lat: 35.6895,
  lng: 139.692,
};

const formContainer = document.querySelector('.ad-form');
const formAddress = formContainer.querySelector('#address');

let map = undefined;
const markersGroup = L.layerGroup();
const titleLayer = L.tileLayer (
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);

const mainMarkerIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  icorAnchor: [26, 52],
});

const mainMarker = L.marker(MAIN_MARKER_COORDINATE,
  {
    draggable: true,
    icon: mainMarkerIcon,
  },
);

const offersMarkerIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  icorAnchor: [20, 40],
});

const getMap = () => {
  if (!map) {
    map = L.map('map-canvas').setView(MAP_COORDINATES, MAP_ZOOM);
  }
  return map;
};

const setOffersMarker = (offers) => {
  const {location: {lat, lng}} = offers;
  const offersMarker = L.marker({
    lat,
    lng,
  },
  {icon: offersMarkerIcon,
  });
  offersMarker.addTo(markersGroup).bindPopup(() => renderNewOffer(offers));
};


const resetMap = (offers) => {
  formAddress.value = `${MAIN_MARKER_COORDINATE.lat}, ${MAIN_MARKER_COORDINATE.lng}`;
  getMap().setView(MAP_COORDINATES, MAP_ZOOM);
  mainMarker.setLatLng(MAIN_MARKER_COORDINATE);
  markersGroup.closePopup();
  markersGroup.clearLayers();
  offers = offers.slice(0, ADS_NUMBERS);
  offers.forEach((offer) => setOffersMarker(offer));
};

const initMap = (offers) => {
  getMap();
  addDisabled(true);
  offers = offers.slice(0, ADS_NUMBERS);
  resetMap(offers);
  mainMarker.on('moveend', (evt) => {
    formAddress.value = `${evt.target.getLatLng().lat.toFixed(5)}, ${evt.target.getLatLng().lng.toFixed(5)}`;
  });
  formContainer.addEventListener('reset', () => resetMap(offers));
  mainMarker.addTo(map);
  titleLayer.addTo(map);
  markersGroup.addTo(map);
};

formAddress.value = `${MAIN_MARKER_COORDINATE.lat}, ${MAIN_MARKER_COORDINATE.lng}`;

export {initMap, resetMap, setOffersMarker};
