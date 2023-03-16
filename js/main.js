//import {renderNewOffer} from './offers.js';
import {addDisabled, setOfferformSubmit} from './form.js';
import {initMap} from './map.js';
import {getData} from './api.js';
import {showAlert} from './util.js';
import {setOnFilterChange, activateFilter} from './filters.js';
import './photo-upload.js';
//renderNewOffer(createManyAds(ADS_NUMBERS));


addDisabled(false);
getData((newOffers) => {
  initMap(newOffers);
  activateFilter(newOffers);
  setOnFilterChange();
  setOfferformSubmit();
},
() => {
  showAlert('Ошибка. Обновите страницу');
});

setOfferformSubmit(addDisabled);

