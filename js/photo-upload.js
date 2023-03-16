const FILE_TYPES = ['gif', 'png', 'jpeg', 'jpg'];

const chooserAvatar = document.querySelector('.ad-form__field input[type=file]');
const previewAvatar = document.querySelector('.ad-form-header__preview img');
const choosePhotoHouse = document.querySelector('.ad-form__upload input[type=file]');
const previewPhotoHouse = document.querySelector('.ad-form__photo');

const preparationPhoto = (type, preview) => {
  const file = type.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    preview.src = URL.createObjectURL(file);
  }
};

const createImg = (container) => {
  const photoElement = document.createElement('img');
  photoElement.style.width = 40;
  photoElement.style.height = 40;
  container.append(photoElement);
  return photoElement;
};

chooserAvatar.addEventListener('change', () => preparationPhoto(chooserAvatar, previewAvatar));

choosePhotoHouse.addEventListener('change', () => preparationPhoto(choosePhotoHouse, createImg(previewPhotoHouse)));

const resetPhoto = () => {
  const photoImgElement = previewPhotoHouse.querySelector('img');
  chooserAvatar.value = '';
  choosePhotoHouse.value = '';
  previewAvatar.src = 'img/muffin-grey.svg';
  photoImgElement.src = '';
};

export {resetPhoto};
