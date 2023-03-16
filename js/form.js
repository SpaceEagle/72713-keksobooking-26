import {checkTiteLength, checkPrice, showAlert} from './util.js';
import{showSuccessMessage, showErrMessage} from './message.js';
import {sendData, getData} from './api.js';
import {resetMap} from './map.js';
import {resetFilters} from './filters.js';
import {resetPhoto} from './photo-upload.js';

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE = 100000;
const ROOM_OPTION = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

const TYPES = {
  bungalow: {
    min: 0,
    placeholder: 0,
  },
  flat: {
    min: 1000,
    placeholder: 1000,
  },
  hotel: {
    min: 3000,
    placeholder: 3000,
  },
  house: {
    min: 5000,
    placeholder: 5000,
  },
  palace: {
    min: 10000,
    placeholder: 10000,
  },
};

const formContainer = document.querySelector('.ad-form');
const filterContainer = document.querySelector('.map__filters');
const formElemets = document.querySelectorAll('fieldset', 'select', '.map__filters');
const formTitle = formContainer.querySelector('#title');
const formPrice = formContainer.querySelector('#price');
const roomNumber = formContainer.querySelector('#room_number');
const guestNumber = formContainer.querySelector('#capacity');
const priceSlider = formContainer.querySelector('.ad-form__slider');
const houseType = formContainer.querySelector('#type');
const timeIn = formContainer.querySelector('#timein');
const timeOut = formContainer.querySelector('#timeout');
const submitButton = formContainer.querySelector('.ad-form__submit');
const resetButton = formContainer.querySelector('.ad-form__reset');

const addDisabled = (status) => {
  if (!status) {
    formContainer.classList.add('ad-form--disabled');
    filterContainer.classList.add('map__filters--disabled');
    formElemets.forEach((element) => {
      element.disabled = true;
    });
  } else {
    formContainer.classList.remove('ad-form--disabled');
    filterContainer.classList.remove('map__filters--disabled');
    formElemets.forEach((element) => {
      element.disabled = false;
    });
  }
};

const pristine = new Pristine (formContainer, {
  classTo:'ad-form__element',
  errorClass: 'ad-form__element--error',
  successClass: 'ad-form__element--succes',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'div',
  errorTextClass: 'form__error',
});

const checkCapacity = () => ROOM_OPTION[roomNumber.value].includes(guestNumber.value);

const createErrorTextCapacity = () => {
  if (roomNumber.value === '1') {
    return '1 комната — для 1 гостя';
  } else if (roomNumber.value === '2') {
    return '2 комнаты - для 1 или 2 гостей';
  } else if (roomNumber.value === '3') {
    return '3 комнаты - для 1, 2 или 3 гостей';
  } else if (roomNumber.value === '100') {
    return '100 комнат не подходят для гостей';
  }
};

const checkPriceMin = () => formPrice.value >= TYPES[houseType.value].min;
const createMinPriceText = () => `Цена не менее ${TYPES[houseType.value].min}!`;

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

noUiSlider.create(priceSlider, {
  range: {
    min: 0,
    max: 100000
  },
  start: 0,
  step: 1000,
  connect: 'lower',
  format: {
    to: function (value) {
      return value.toFixed(0);
    },
    from: function (value) {
      return parseFloat(value);
    },
  }
});

priceSlider.noUiSlider.on('update', (values, handle) => {
  formPrice.value = values[handle];
});

formPrice.addEventListener('change', function () {
  priceSlider.noUiSlider.set(this.value);
});

houseType.addEventListener('change', () => {
  formPrice.min = TYPES[houseType.value].min;
  formPrice.placeholder = `от ${TYPES[houseType.value].placeholder} ₽`;
});

pristine.addValidator(formPrice, checkPriceMin, createMinPriceText);

pristine.addValidator(formTitle, (value) => checkTiteLength(value, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH),
  `Заголовок должен быть от ${MIN_TITLE_LENGTH} до ${MAX_TITLE_LENGTH} символов!`);

pristine.addValidator(formPrice, (value) => checkPrice(value, MAX_PRICE),
  `Цена не более ${MAX_PRICE}!`);

pristine.addValidator(roomNumber, checkCapacity, createErrorTextCapacity);
pristine.addValidator(guestNumber, checkCapacity, createErrorTextCapacity);

timeIn.addEventListener('change', () => {
  timeOut.value = timeIn.value;
});
timeOut.addEventListener('change', () => {
  timeIn.value = timeOut.value;
});

const resetSlider = () => {
  priceSlider.noUiSlider.updateOptions({
    range: {
      min: 0,
      max: 100000,
    },
    start: 0,
    step: 1000,
  });
};

const resetForm = (offer) => {
  formContainer.reset();
  resetSlider();
  resetPhoto();
  resetFilters();
  resetMap(offer);
};

const setOfferformSubmit = () => {
  formContainer.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(() => {
        unblockSubmitButton();
        showSuccessMessage();
        getData(resetForm, () => {showAlert('Ошибка.Обновите страницу!');});
      },
      () => {
        unblockSubmitButton();
        showErrMessage();
      },
      new FormData(formContainer),
      );
    }
  });
};

resetButton.addEventListener('click', resetForm);

export {addDisabled, setOfferformSubmit/*, resetForm*/};

