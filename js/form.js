import {checkTiteLength, checkPrice} from './util.js';

const formContainer = document.querySelector('.ad-form');
const formElemets = document.querySelectorAll('fieldset', 'select', '.map__filters');
const formTitle = formContainer.querySelector('#title');
const formPrice = formContainer.querySelector('#price');
const roomNumber = formContainer.querySelector('#room_number');
const guestNumber = formContainer.querySelector('#capacity');
const priceSlider = formContainer.querySelector('.ad-form__slider');
const houseType = formContainer.querySelector('#type');
const timeIn = formContainer.querySelector('#timein');
const timeOut = formContainer.querySelector('#timeout');
const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE = 100000;
let currentType = houseType.value;
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

const addDisabled = (status) => {
  if (status === false) {
    formContainer.classList.add('ad-form--disabled');
    formElemets.forEach((element) => {
      element.disabled = true;
    });
  } else {
    formContainer.classList.remove('ad-form--disabled');
    formElemets.forEach((element) => {
      element.disabled = false;
    });
  }
};

timeIn.addEventListener('change', () => {
  timeOut.value = timeIn.value;
});
timeOut.addEventListener('change', () => {
  timeIn.value = timeOut.value;
});

const pristine = new Pristine (formContainer, {
  classTo:'ad-form__element',
  errorClass: 'ad-form__element--error',
  successClass: 'ad-form__element--succes',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'div',
  errorTextClass: 'form__error',
});

const checkCapacity = () => ROOM_OPTION[roomNumber.value].includes(guestNumber.value);

const errorTextCapacity = () => {
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

houseType.addEventListener('change', (evt) => {
  currentType = evt.target.value;
  formPrice.min = TYPES[currentType].min;
  formPrice.placeholder = `от ${TYPES[currentType].placeholder} ₽`;
});

//Не получается заставить при проверке в сообщении выводить корректную минимальную цену
pristine.addValidator(formPrice, (value) => checkPriceMin(value, currentType),
  `Цена не менее ${TYPES[houseType.value].min}!`);

pristine.addValidator(formTitle, (value) => checkTiteLength(value, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH),
  `Заголовок должен быть от ${MIN_TITLE_LENGTH} до ${MAX_TITLE_LENGTH} символов!`);

pristine.addValidator(formPrice, (value) => checkPrice(value, MAX_PRICE),
  `Цена не более ${MAX_PRICE}!`);

pristine.addValidator(roomNumber, checkCapacity, errorTextCapacity);
pristine.addValidator(guestNumber, checkCapacity, errorTextCapacity);

formContainer.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});

export {addDisabled};

