import {isEscapeKey} from './util.js';

const $body = document.querySelector('body');
const $uploadFile = document.querySelector('#upload-file');
const $imgUploadOverlay = document.querySelector('.img-upload__overlay');
const $imgUploadCancel = document.querySelector('.img-upload__cancel');
const $imgUploadForm = document.querySelector('.img-upload__form');
const $userImage = document.querySelector('.img-upload__preview img');
const $scaleValue = document.querySelector('.scale__control--value');
let currentZoom = +$scaleValue.value.replace('%', '');
const maxZoom = 100;
const minZoom = 25;
const zoomStep = 25;
const $scaleUp = document.querySelector('.scale__control--bigger');
const $scaleDown = document.querySelector('.scale__control--smaller');
const filters = document.querySelectorAll('.effects__radio');
let currentFilter;

const applyZoom = (value) => {
  $userImage.style.transform = `scale(${value / 100})`;
  $scaleValue.value = value + '%';
  if (value === maxZoom) {
    $scaleUp.disabled = true;
    $scaleDown.disabled = false;
  } else if (value === minZoom) {
    $scaleDown.disabled = true;
    $scaleUp.disabled = false;
  } else {
    $scaleDown.disabled = false;
    $scaleUp.disabled = false;
  }
};

/* Вспомогательные функции для того чтобы можно было повесить обработчики, СОХРАНИТЬ, а потом снять их */
/* eslint-disable no-use-before-define */
const onImgUploadCrossClick = () => {
  closeImgUpload();
};

const onImgUploadOverlayClick = (event) => {
  if (!event.target.closest('.img-upload__inner-wrapper')) {
    closeImgUpload();
  }
};

const onDocumentKeydownToCloseImgUpload = (event) => {
  if (isEscapeKey(event)) {
    closeImgUpload();
  }
};

const onClickToScaleControlDown = () => {
  if (currentZoom > minZoom) {
    currentZoom = currentZoom - zoomStep;
    applyZoom(currentZoom);
  }
};

const onClickToScaleControlUp = () => {
  if (currentZoom < maxZoom) {
    currentZoom = currentZoom + zoomStep;
    applyZoom(currentZoom);
  }
};

const onFilterChange = () => {
  filters.forEach( (filter) => {
    if (filter.checked) {
      currentFilter = filter.value;
    }
  });

  /* Удаляем все классы начинающиеся с effects__preview-- */
  const classesToRemove = Array.from($userImage.classList).filter(className => className.startsWith("effects__preview--"));
  classesToRemove.forEach(className => {
    $userImage.classList.remove(className);
  });

  /* Добавляем выбранный */
  $userImage.classList.add(`effects__preview--${currentFilter}`);

}
/* eslint-enable */


/* Открытие модального окна */

const openImgUpload = () => {

  /* Непосредственно показ */
  $imgUploadOverlay.classList.remove('hidden');
  $body.classList.add('modal-open');


  /* Логика */
  applyZoom(currentZoom);
  $scaleDown.addEventListener('click', onClickToScaleControlDown);
  $scaleUp.addEventListener('click', onClickToScaleControlUp);

  filters.forEach((filter) => {
    filter.addEventListener('change', onFilterChange);
  });


  /* Обработчики закрытия: добавляем */
  $imgUploadCancel.addEventListener('click', onImgUploadCrossClick);
  $imgUploadOverlay.addEventListener('click', onImgUploadOverlayClick);
  document.addEventListener('keydown', onDocumentKeydownToCloseImgUpload);
};


/* Закрытие модального окна */

const closeImgUpload = () => {

  /* Непосредственно скрытие */
  $imgUploadOverlay.classList.add('hidden');
  $body.classList.remove('modal-open');


  /* Логика: резетим форму */
  $scaleDown.removeEventListener('click', onImgUploadCrossClick);
  $scaleUp.removeEventListener('click', onClickToScaleControlUp);

  filters.forEach((filter) => {
    filter.removeEventListener('change', onFilterChange);
  });

  /* Резетим форму при закрытии */
  $imgUploadForm.reset();
  $userImage.classList.remove(`effects__preview--${currentFilter}`);


  /* Обработчики закрытия: снимаем */
  $imgUploadCancel.removeEventListener('click', onImgUploadCrossClick);
  $imgUploadOverlay.removeEventListener('click', onImgUploadOverlayClick);
  document.removeEventListener('keydown', onDocumentKeydownToCloseImgUpload);
};


/* Инициализация загрузки изображения */
$uploadFile.addEventListener('change', openImgUpload);


/* Отмена Esc во время печати */

const $hashtags = document.querySelector('.text__hashtags');
const $description = document.querySelector('.text__description');

[$hashtags, $description].forEach((element) => {
  element.addEventListener('keydown', (event) => {
    if (isEscapeKey(event)) {
      event.stopPropagation();
    }
  });
});
