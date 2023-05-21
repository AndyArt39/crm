import Client from "./Client.js";

const clientsList = [],
  $sectionApp = document.getElementById('app'),
  $filterInput = document.getElementById('header-input'),
  $clientsList = document.getElementById('clients-list'), // html элемент tbody
  $appThAll = document.querySelectorAll('.thead__cell-sort'),
  $clientsListTR = document.createElement('tr'), // html элемент tbody
  $btnAddClient = document.getElementById('btn-add-client'), // кнопка Добавить клиента
  $modalWrap = document.createElement('div'), // подложка модального окна
  $modalBox = document.createElement('div'), // модальное окно
  $modalBtnClose = document.createElement('button'), // кнопка 'Х' закрыть модальное окно
  $modalTitle = document.createElement('h2'),
  $modalId = document.createElement('span'),
  $modalDescr = document.createElement('p'),
  $modalForm = document.createElement('form'),
  $modalFormGroupSurname = document.createElement('div'),
  $modalInputSurname = document.createElement('input'),
  $modalLabelSurname = document.createElement('label'),
  $modalFormGroupName = document.createElement('div'),
  $modalInputName = document.createElement('input'),
  $modalLabelName = document.createElement('label'),
  $modalFormGroupLastName = document.createElement('div'),
  $modalInputLastName = document.createElement('input'),
  $modalLabelLastName = document.createElement('label'),
  $modalBlockContacts = document.createElement('div'),
  $modalBtnAddContact = document.createElement('button'), // кнопка добавить контакт
  $modalBtnSave = document.createElement('button'), // кнопка СОХРАНИТЬ
  $modalBtnDelete = document.createElement('button'), // кнопка УДАЛИТЬ
  $modalBtnCancel = document.createElement('button'), // кнопка Отмена/Удалить клиента
  $modalBtnDeleteBottom = document.createElement('button'), // кнопка Удалить клиента
  $contactWrap = document.createElement('div'), // обертка для поля ввода контакта
  $listError = document.createElement('ul'), // блок с ошибками валидации
  $invalidCharacters = document.createElement('li'),
  $writeName = document.createElement('li'),
  $writeSurname = document.createElement('li'),
  $requiredValue = document.createElement('li'),
  $errorItem = document.createElement('li');

let column = 'id',
  columnDir = true,
  hideTimeoutId = null;

$clientsListTR.classList.add('tbody__row-preloader');
$modalWrap.classList.add('app__modal-wrap', 'modal');
$modalBox.classList.add('modal__box');
$modalBtnClose.classList.add('modal__btn-close', 'btn-reset');
$modalTitle.classList.add('modal__title', 'modal__title--add');
$modalId.classList.add('modal__id');
$modalDescr.classList.add('modal__descr');
$modalForm.classList.add('modal__form');
$modalFormGroupSurname.classList.add('modal__form-group');
$modalFormGroupName.classList.add('modal__form-group');
$modalFormGroupLastName.classList.add('modal__form-group');
$modalInputSurname.classList.add('modal__input');
$modalLabelSurname.classList.add('modal__label', 'modal__label-star');
$modalInputName.classList.add('modal__input');
$modalLabelName.classList.add('modal__label', 'modal__label-star');
$modalInputLastName.classList.add('modal__input');
$modalLabelLastName.classList.add('modal__label');
$modalBlockContacts.classList.add('modal__contact', 'contact');
$modalBtnSave.classList.add('modal__btn-action', 'btn-reset');
$modalBtnDelete.classList.add('btn-reset', 'modal__btn-action');
$modalBtnCancel.classList.add('modal__btn-cancel', 'btn-reset');
$modalBtnDeleteBottom.classList.add('modal__btn-cancel', 'btn-reset');
$contactWrap.classList.add('contact__wrap');
$listError.classList.add('modal__list-error');
$errorItem.classList.add('modal__item-error');

$modalInputSurname.placeholder = 'Фамилия';
$modalInputName.placeholder = 'Имя';
$modalInputLastName.placeholder = 'Отчество';

$modalLabelSurname.textContent = 'Фамилия';
$modalLabelName.textContent = 'Имя';
$modalLabelLastName.textContent = 'Отчество';
$modalBtnAddContact.textContent = 'Добавить контакт';

$modalForm.setAttribute('novalidate', '');

$modalWrap.append($modalBox);
$modalFormGroupSurname.append($modalInputSurname);
$modalFormGroupSurname.append($modalLabelSurname);
$modalFormGroupName.append($modalInputName);
$modalFormGroupName.append($modalLabelName);
$modalFormGroupLastName.append($modalInputLastName);
$modalFormGroupLastName.append($modalLabelLastName);
$modalForm.append($modalFormGroupSurname);
$modalForm.append($modalFormGroupName);
$modalForm.append($modalFormGroupLastName);
$listError.append($errorItem);

// Функция для отправки и создания данных на сервер
async function createData() {
  try {
    const response = await fetch('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({
        surname: contentValidation($modalInputSurname.value),
        name: contentValidation($modalInputName.value),
        lastName: contentValidation($modalInputLastName.value),
        contacts: createdArrayContacts().contacts
      }),
      headers: {
        'Content-type': 'aplication/json',
      }
    });
    return await response.json();
  } catch (error) {
    console.log('Что-то пошло не так! Сервер отвалился =(');
  }
}

// Функция для изменения данных на сервере
async function editData(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        surname: contentValidation($modalInputSurname.value),
        name: contentValidation($modalInputName.value),
        lastName: contentValidation($modalInputLastName.value),
        contacts: createdArrayContacts().contacts
      }),
      headers: {
        'Content-type': 'aplication/json',
      }
    });
    return await response.json();
  } catch (error) {
    console.log('Что-то пошло не так! Сервер отвалился =(');
  }
}

// Функция для получения данных с сервера
async function getData() {
  try {
    const response = await fetch('http://localhost:3000/api/clients');
    return await response.json();
  } catch (error) {
    console.log('Что-то пошло не так! Сервер отвалился =(');
  }
}

// Функция для получения данных с сервера по id
async function getDataId(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`);
    return await response.json();
  } catch (error) {
    console.log('Что-то пошло не так! Сервер отвалился =(');
  }
}

// Функция для удаления данных с сервера
async function deleteClientServer(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.log('Что-то пошло не так! Сервер отвалился =(');
  }
}

// Прелоадер
function createPreloader() {
  const $preloader = document.createElement('div');

  $preloader.classList.add('preloader');

  $preloader.innerHTML = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 20C2 29.941 10.059 38 20 38C29.941 38 38 29.941 38 20C38 10.059 29.941 2 20 2C17.6755 2 15.454 2.4405 13.414 3.243" stroke="#9873FF" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
  </svg>
  `;

  $clientsListTR.append($preloader);

  return $clientsListTR;
}

// Функция наполнения массива через Класс с сервера
async function createClientsList() {
  const clientsListServer = await getData();
  clientsList.length = 0;
  for (const client of clientsListServer) {
    clientsList.push(new Client(
      client.surname,
      client.name,
      client.lastName,
      client.contacts,
      client.id,
      new Date(client.createdAt),
      new Date(client.updatedAt)
    ));
  };
  return clientsList;
}

// Создаём блок с контактами в модальном окне
function addContact() {

  const $contactContainer = document.createElement('div'), // обертка для поля ввода контакта
    $contactType = document.createElement('div'),
    $btnContactType = document.createElement('button'), // кнопка выподающего окна для выбора типа контакта
    $contactList = document.createElement('ul'),
    $contactPhone = document.createElement('li'),
    $contactEmail = document.createElement('li'),
    $contactVk = document.createElement('li'),
    $contactFb = document.createElement('li'),
    $contactOther = document.createElement('li'),
    $contactInput = document.createElement('input'), // поле для ввода контакта
    $btnContactDelete = document.createElement('button'),
    $contactDeleteTooltip = document.createElement('span');

  $contactContainer.classList.add('contact__container');
  $contactType.classList.add('contact__type');
  $btnContactType.classList.add('btn-reset', 'contact__btn-type');
  $contactList.classList.add('contact__list', 'list-reset');
  $contactPhone.classList.add('contact__item');
  $contactEmail.classList.add('contact__item');
  $contactVk.classList.add('contact__item');
  $contactFb.classList.add('contact__item');
  $contactOther.classList.add('contact__item');
  $contactInput.classList.add('contact__input');
  $btnContactDelete.classList.add('btn-reset', 'contact__btn-delete');
  $contactDeleteTooltip.classList.add('contact__tooltip');

  $btnContactType.textContent = 'Телефон';
  $contactPhone.textContent = 'Телефон';
  $contactEmail.textContent = 'Email';
  $contactVk.textContent = 'Vk';
  $contactFb.textContent = 'Facebook';
  $contactOther.textContent = 'Другое';
  $contactDeleteTooltip.textContent = 'Удалить контакт';
  $contactInput.placeholder = 'Введите данные клиента';
  $contactInput.type = 'text';
  $contactInput.setAttribute('required', '');
  $btnContactDelete.innerHTML = `<svg class="contact__btn-delete-icon" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"/>
  </svg>
  `;

  // функция смены типа кнопки
  function typeСhange(type) {
    type.onclick = function () {
      $btnContactType.textContent = type.textContent;
      $contactList.classList.remove('contact__list--active');
    }
  }

  // действие при клике на кнопку "Тип контакта"
  $btnContactType.addEventListener('click', function (event) {
    event.preventDefault();

    const contactItems = document.getElementsByClassName('contact__item');

    for (const item of contactItems) {
      item.classList.remove('contact__item--hidden');
    }

    $contactList.classList.toggle('contact__list--active');

    for (const item of contactItems) {
      if ($btnContactType.textContent == item.textContent) {
        item.classList.add('contact__item--hidden');
      }
    }

    for (const type of contactItems) {
      typeСhange(type);
    }
  });

  $contactType.addEventListener('mouseleave', function () {
    $contactList.classList.remove('contact__list--active');
  });

  // действие при клике на кнопку "Удалить контакт"
  $btnContactDelete.addEventListener('click', function (event) {
    event.preventDefault();
    $contactContainer.remove();
    $modalBtnAddContact.classList.add('contact__btn-add-contact--active');
    if (document.getElementsByClassName('contact__container').length < 1) {
      $contactWrap.remove();
      $modalBlockContacts.style.backgroundColor = 'var(--gray-suit-opacity03)';
      $modalBlockContacts.classList.remove('modal__contact--open');
      $modalBlockContacts.classList.add('modal__contact--closed');
    }
  })

  $contactList.append($contactPhone, $contactEmail, $contactVk, $contactFb, $contactOther);
  $contactType.append($contactList, $btnContactType);
  $btnContactDelete.append($contactDeleteTooltip);
  $contactContainer.append($contactType, $contactInput, $btnContactDelete);

  return {
    $contactContainer,
    $btnContactType,
    $contactList,
    $contactType,
    $contactInput,
    $btnContactDelete
  };
}

// Блокировка кнопок в таблице
function blockedBtnTrAll(boolean){
  const btnTrAll = document.querySelectorAll('tr .btn-reset');
  for (const btn of btnTrAll) {
    btn.disabled = boolean;
  }
}

// Очищаем содержимое при закрытии модального окна
function clearingAll() {
  $btnAddClient.disabled = false;
  blockedBtnTrAll(false);
  $modalInputSurname.value = '';
  $modalInputSurname.style.borderColor = 'var(--gray-suit-opacity05)';
  $modalInputName.value = '';
  $modalInputName.style.borderColor = 'var(--gray-suit-opacity05)';
  $modalInputLastName.value = '';
  $modalInputLastName.style.borderColor = 'var(--gray-suit-opacity05)';
  $contactWrap.innerHTML = '';
  $contactWrap.remove();
  $invalidCharacters.innerHTML = '';
  $writeName.innerHTML = '';
  $writeSurname.innerHTML = '';
  $requiredValue.innerHTML = '';
  $errorItem.innerHTML = '';
  $modalWrap.classList.remove('open');
  $modalBlockContacts.style.backgroundColor = 'var(--gray-suit-opacity03)';
  $modalBlockContacts.classList.remove('modal__contact--open');
  $modalBlockContacts.classList.add('modal__contact--closed');
  setTimeout(() => {
    $modalBox.style.alignItems = 'unset';
    $modalTitle.classList.remove('modal__title--delete');
    $modalTitle.classList.add('modal__title--add');
  }, 300);
}

// Функция открывания и закрывания модального окна + функционал для кнопок
function openModal(open) {

  $btnAddClient.disabled = true;
  blockedBtnTrAll(true);
  $modalBox.innerHTML = '';
  setTimeout(function () {
    $modalWrap.classList.add('open');
  }, 100);

  open($modalBox);

  $sectionApp.append($modalWrap);

  // при нажатии на крестик
  $modalBtnClose.addEventListener('click', function (event) {
    event.preventDefault();
    clearingAll();
  })

  // при нажатии на отменить
  $modalBtnCancel.addEventListener('click', function (event) {
    event.preventDefault();
    clearingAll();
  })

  // при клике вне модального окна
  $modalBox.addEventListener('click', function (event) {
    event._isClickWithInModal = true;
  })
  $modalWrap.addEventListener('click', function (event) {
    if (event._isClickWithInModal) return;
    clearingAll();
  })

  // при нажатии на 'Escape'
  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      clearingAll();
    };
  })
}

// Функция замены первой буквы на заглавную
function contentValidation(content) {
  let value = '';
  if (content !== '') {
    value = content[0].toUpperCase() + content.substring(1).toLowerCase();
  }
  return value;
}

// Массив контактов
function createdArrayContacts() {
  const contacts = [],
    contactType = document.getElementsByClassName('contact__btn-type'),
    contactValue = document.getElementsByClassName('contact__input'),
    verArr = [];
  let result = false;

  for (let i = 0; i < contactType.length; i++) {
    if (validationContacts(contactType[i], contactValue[i])) {
      contacts.push({
        type: contactType[i].innerHTML,
        value: contactValue[i].value
      });
      result = true;
      verArr.push(result);
    } else {
      result = false;
      verArr.push(result);
    }
  }

  return { contacts, result, verArr };
}

// Иконка контакта в таблице по типу контакта
let $contact = null;
function createNewContactIcon(contact) {

  $contact = document.createElement('div');

  $contact.classList.add('contacts__el');

  $contact.append(createTooltip(contact.type, contact.value));

  // проверяем тип у контакта
  if (contact.type === 'Email') {
    $contact.classList.add('contacts__el--mail');
  } if (contact.type === 'Facebook') {
    $contact.classList.add('contacts__el--fb');
  } if (contact.type === 'Vk') {
    $contact.classList.add('contacts__el--vk');
  } if (contact.type === 'Телефон') {
    $contact.classList.add('contacts__el--phone');
  } if (contact.type !== 'Email' && contact.type !== 'Facebook'
    && contact.type !== 'Vk' && contact.type !== 'Телефон') {
    $contact.classList.add('contacts__el--other');
  }

  return $contact;
}

// tooltip для иконки контакта в таблице
function createTooltip(type, value) {
  const $tooltip = document.createElement('div'),
    $tooltipType = document.createElement('span'),
    $tooltipValue = document.createElement('a');

  $tooltip.classList.add('contacts__tooltip');
  $tooltipType.classList.add('contacts__tooltip-type');
  $tooltipValue.classList.add('contacts__tooltip-value');

  $tooltipType.textContent = type + ':';
  $tooltipValue.textContent = value;

  // добавляем ссылки по типу контакта
  if (type === 'Телефон') {
    $tooltipValue.href = `tel:${value.trim()}`;
    $tooltipValue.style.color = 'var(--white)';
    $tooltipValue.style.textDecoration = 'none';
    $tooltip.append($tooltipValue);
  } else if (type === 'Email') {
    $tooltipValue.href = `mailto:${value.trim()}`;
    $tooltip.append($tooltipType);
    $tooltip.append($tooltipValue);
  } else {
    $tooltipValue.href = value.trim();
    $tooltip.append($tooltipType);
    $tooltip.append($tooltipValue);
  }

  return $tooltip;
}

// Функция наполнения модального окна "Удалить клиента"
function modalDeleteOpen(box) {
  box.innerHTML = '';
  box.style.alignItems = 'center';
  $modalTitle.classList.remove('modal__title--add');
  $modalTitle.classList.add('modal__title--delete');

  $modalTitle.textContent = 'Удалить клиента';
  $modalDescr.textContent = 'Вы действительно хотите удалить данного клиента?';
  $modalBtnDelete.textContent = 'Удалить';
  $modalBtnCancel.textContent = 'Отмена';

  box.append($modalBtnClose, $modalTitle, $modalDescr, $modalBtnDelete, $modalBtnCancel);
}

// Создание одного клиента в таблице
function createNewClientTr(client) {
  const $clientTr = document.createElement('tr'),
    $idTd = document.createElement('td'),
    $fullNameTd = document.createElement('td'),
    $createdAtTd = document.createElement('td'),
    $createdAtTdWrap = document.createElement('div'),
    $createdAtTdDate = document.createElement('span'),
    $createdAtTdTime = document.createElement('span'),
    $updatedAtTd = document.createElement('td'),
    $updatedAtTdWrap = document.createElement('div'),
    $updatedAtTdDate = document.createElement('span'),
    $updatedAtTdTime = document.createElement('span'),
    $contactsTd = document.createElement('td'),
    $contactsTdWrap = document.createElement('div'),
    $contactsBtnMore = document.createElement('button'),
    $actionsTd = document.createElement('td'),
    $actionsTdWrap = document.createElement('div'),
    $btnEdit = document.createElement('button'),
    $iconEdit = document.createElement('span'),
    $btnDelete = document.createElement('button'),
    $iconDelete = document.createElement('span'),
    $iconSvgSpinner = `<svg class="tbody__spinner-svg" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.00008 6.04008C1.00008 8.82356 3.2566 11.0801 6.04008 11.0801C8.82356 11.0801 11.0801 8.82356 11.0801 6.04008C11.0801 3.2566 8.82356 1.00008 6.04008 1.00008C5.38922 1.00008 4.7672 1.12342 4.196 1.34812" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
    </svg>`,
    $iconSvgEdit = `<svg class="tbody__edit-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329V4.69329Z"/>
    </svg>`,
    $iconSvgDelete = `<svg class="tbody__delete-svg" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z"/>
    </svg>`;

  $iconEdit.innerHTML = $iconSvgEdit;
  $iconDelete.innerHTML = $iconSvgDelete;

  $clientTr.classList.add('tbody__row');
  $idTd.classList.add('tbody__cell', 'tbody__cell-id');
  $fullNameTd.classList.add('tbody__cell');
  $createdAtTd.classList.add('tbody__cell');
  $createdAtTdWrap.classList.add('tbody__cell-wrap-date');
  $createdAtTdDate.classList.add('tbody__cell-date');
  $createdAtTdTime.classList.add('tbody__cell-time');
  $updatedAtTd.classList.add('tbody__cell');
  $updatedAtTdWrap.classList.add('tbody__cell-wrap-date');
  $updatedAtTdDate.classList.add('tbody__cell-date');
  $updatedAtTdTime.classList.add('tbody__cell-time');
  $contactsTd.classList.add('tbody__cell');
  $contactsTdWrap.classList.add('tbody__cell-wrap', 'contacts');
  $contactsBtnMore.classList.add('contacts__btn-more', 'btn-reset');
  $actionsTd.classList.add('tbody__cell');
  $actionsTdWrap.classList.add('tbody__cell-btn-wrap');
  $btnEdit.classList.add('tbody__btn-edit', 'btn-reset');
  $btnDelete.classList.add('tbody__btn-delete', 'btn-reset');
  $iconEdit.classList.add('tbody__icon-edit');
  $iconDelete.classList.add('tbody__icon-delete');

  $clientTr.id = client.id;

  $idTd.textContent = client.id.substr(7);
  $fullNameTd.textContent = client.fullName;
  $createdAtTdDate.textContent = client.getActionAtDate(client.createdAt);
  $createdAtTdTime.textContent = client.getActionAtTime(client.createdAt);
  $updatedAtTdDate.textContent = client.getActionAtDate(client.updatedAt);
  $updatedAtTdTime.textContent = client.getActionAtTime(client.updatedAt);
  $btnEdit.textContent = 'Изменить';
  $btnDelete.textContent = 'Удалить';

  $clientTr.append($idTd);
  $createdAtTdWrap.append($createdAtTdDate, $createdAtTdTime);
  $updatedAtTdWrap.append($updatedAtTdDate, $updatedAtTdTime);
  $createdAtTd.append($createdAtTdWrap);
  $updatedAtTd.append($updatedAtTdWrap);
  $contactsTd.append($contactsTdWrap);
  $btnEdit.prepend($iconEdit);
  $btnDelete.prepend($iconDelete);
  $actionsTdWrap.append($btnEdit);
  $actionsTdWrap.append($btnDelete);
  $actionsTd.append($actionsTdWrap);
  $clientTr.append($idTd, $fullNameTd, $createdAtTd, $updatedAtTd, $contactsTd, $actionsTd);

  // наполняем блок 'контакты' иконками, если иконок больше 4-х то
  // остальные скрываем и добавляем кнопку вызова остальных иконок
  for (const index in client.contacts) {
    const icon = createNewContactIcon(client.contacts[index])
    if (index < 4) {
      $contactsTdWrap.append(icon)
    } else {
      $contactsTdWrap.append(icon)
      $contact.classList.add('contacts__el-hidden')
      $contactsBtnMore.textContent = `+${index - 3}`
      $contactsTdWrap.append($contactsBtnMore)
    }
  }

  // вызываем скрытые иконки
  $contactsBtnMore.addEventListener('click', function () {
    $contactsBtnMore.classList.add('contacts__btn-more--delete')
    for (const item of $contactsTdWrap.childNodes) {
      item.classList.remove('contacts__el-hidden')
    }
  })

  // Функция действия при нажатии на кнопку "УДАЛИТЬ"
  async function deleteById() {
    $iconDelete.innerHTML = $iconSvgSpinner;
    $iconDelete.classList.add('tbody__spinner-svg--delete');

    if (await deleteClientServer(client.id)) {
      clearingAll();
      setTimeout(() => {
        document.getElementById(client.id).remove();
        let index = clientsList.findIndex(index => index.id == client.id);
        clientsList.splice(index, 1);
      }, 800);
    } else {
      clearingAll();
      return;
    }
  }

  // действие при нажатии на кнопку 'Удалить' из таблицы
  $btnDelete.addEventListener('click', function open() {
    openModal(function (box) {
      modalDeleteOpen(box);
    });
    $modalBtnDelete.onclick = deleteById;
  })

  // действие при нажатии на кнопку "Изменить" из таблицы
  $btnEdit.addEventListener('click', async function () {
    $iconEdit.innerHTML = $iconSvgSpinner;
    $iconEdit.classList.add('tbody__spinner-svg--edit');
    if (await getDataId(client.id)) {
      setTimeout(() => {
        openModal(async function (box) {
          $iconEdit.innerHTML = $iconSvgEdit;
          const сlientObject = await getDataId(client.id);
          box.innerHTML = '';
          $modalBtnAddContact.classList.add('contact__btn-add-contact', 'contact__btn-add-contact--active', 'btn-reset');

          $modalTitle.textContent = 'Изменить данные';
          $modalId.textContent = 'id: ' + сlientObject.id.substr(7);
          $modalBtnSave.textContent = 'Сохранить';
          $modalBtnDeleteBottom.textContent = 'Удалить';

          $modalInputSurname.value = сlientObject.surname;
          $modalInputName.value = сlientObject.name;
          $modalInputLastName.value = сlientObject.lastName;

          for (const contact of сlientObject.contacts) {
            const contactContainer = addContact();
            contactContainer.$btnContactType.textContent = contact.type;
            contactContainer.$contactInput.value = contact.value;

            contactContainer.$contactContainer.append(contactContainer.$contactType, contactContainer.$contactInput, contactContainer.$btnContactDelete);
            $contactWrap.append(contactContainer.$contactContainer);
            $modalBlockContacts.append($contactWrap);

            $modalBlockContacts.style.backgroundColor = 'var(--gray-suit-opacity02)';
            $modalBlockContacts.classList.remove('modal__contact--closed');
            $modalBlockContacts.classList.add('modal__contact--open');
          }

          if (client.contacts.length == 10) {
            $modalBtnAddContact.classList.remove('contact__btn-add-contact--active');
          }

          $modalTitle.append($modalId);
          box.append($modalBtnClose);
          box.append($modalTitle);
          $modalBlockContacts.append($modalBtnAddContact);
          $modalForm.append($modalBlockContacts, $listError, $modalBtnSave);
          box.append($modalForm);
          box.append($modalBtnDeleteBottom);

          // при нажатии на кнопку СОХРАНИТЬ
          $modalForm.addEventListener('submit', async function (event) {
            event.preventDefault();
          })

          $modalBtnSave.onclick = async function () {
            if (!validationName()) return;
            try {
              await editData(client.id);
            } catch (error) {
              console.log(error);
            }
            clearingAll();
            await startApp();
          }
        });
      }, 800);
    } else {
      return;
    }

    // действие при нажатии на кнопку "Удалить" из модального окна "Изменить данные"
    $modalBtnDeleteBottom.addEventListener('click', function open() {
      clearingAll();
      setTimeout(() => {
        openModal(function (box) {
          modalDeleteOpen(box)
        });
      }, 300);

      $modalBtnDelete.onclick = deleteById;
    })
  })
  return { $clientTr, $btnEdit, $btnDelete, $idTd }
}

// валидация ФИО
function validationName() {

  const invalidCharacters = /[^а-яА-ЯёЁ]+$/g;

  // при заполнении поля удаляем ошибки
  function onInputValue(input) {
    input.addEventListener('input', function () {
      input.style.borderColor = 'var(--gray-suit-opacity05)';
      input.style.color = 'var(--black)';
      $errorItem.textContent = '';
    })

    input.oncut = input.oncopy = input.onpaste = function () {
      input.style.borderColor = 'var(--gray-suit-opacity05)';
      input.style.color = 'var(--black)';
      $errorItem.textContent = '';
    }

    input.onchenge = function () {
      input.style.borderColor = 'var(--gray-suit-opacity05)';
      input.style.color = 'var(--black)';

      if ($modalInputSurname.value && $modalInputName.value && $modalInputLastName) {
        $errorItem.textContent = '';
      }
    }
  }

  onInputValue($modalInputSurname);
  onInputValue($modalInputName);
  onInputValue($modalInputLastName);

  // Выводим ошибку в блок ошибок
  function checkRequiredName(input, name) {
    if (!input.value) {
      input.style.borderColor = 'var(--red)';
      $errorItem.textContent = `Ошибка: введите ${name} клиента!`;
      return false;
    } else {
      $errorItem.textContent = '';
    }
    return true;
  }

  // Если в поле ФИО недопустимые символы, окрашиваем в красный
  function checkInvalidCharacters(input) {
    if (invalidCharacters.test(input.value)) {
      input.style.borderColor = 'var(--red)';
      input.style.color = 'var(--red)';
      $errorItem.textContent = 'Ошибка: недопустимые для ввода символы!';
      return false;
    }
    return true;
  }

  if (!checkRequiredName($modalInputSurname, 'фамилию')) return false;
  if (!checkRequiredName($modalInputName, 'имя')) return false;
  if (!checkInvalidCharacters($modalInputSurname)) return false;
  if (!checkInvalidCharacters($modalInputName)) return false;
  if (!checkInvalidCharacters($modalInputLastName)) return false;
  if (document.getElementsByClassName('contact__container').length === 0) {
    $errorItem.textContent = 'Ошибка: создайте хотя бы один контакт!';
    return false;
  }
  for (const result of createdArrayContacts().verArr) {
    if (result == false) {
      return false;
    }
  }
  return true;
}

// валидация контактов
function validationContacts(contactType, contactInput) {
  const onlyNumbers = /[^0-9]+$/g,
    onlyEmail = /[^a-zA-Z|0-9|@|.]+$/g;

  function onInputValue(input) {
    input.addEventListener('input', function () {
      input.style.color = 'var(--black)';
      $errorItem.textContent = '';
    })

    input.oncut = input.oncopy = input.onpaste = function () {
      input.style.color = 'var(--black)';
      $errorItem.textContent = '';
    }
  }

  function showErrorMessage(message, input) {
    $errorItem.textContent = message;
    input.style.color = 'var(--red)';
  }

  onInputValue(contactInput);

  if (!contactInput.value) {
    showErrorMessage('Ошибка: введите контакт клиента!', contactInput);
    return false;
  }

  switch (contactType.innerHTML) {
    case 'Телефон':
      if (onlyNumbers.test(contactInput.value)) {
        showErrorMessage('Ошибка: введите номер телефона используя цифры!', contactInput);
        return false;
      } if (contactInput.value.length !== 11) {
        showErrorMessage('Ошибка: введите номер телефона из 11-и цифр!', contactInput);
        return false;
      }
      return true;
    case 'Email':
      if (onlyEmail.test(contactInput.value)) {
        showErrorMessage('Ошибка: введён некорректный Email!', contactInput);
        return false;
      }
      return true;
    default:
      return true;
  }
}

// Функция сортировки клиентов
function sortClients(prop, dir) {
  const clientsListCopy = [...clientsList];
  return clientsListCopy.sort(function (clientA, clientB) {
    if ((!dir == false ? clientA[prop] < clientB[prop] : clientA[prop] > clientB[prop])) return -1;
  })
}

// Функция фильтрации клиентов
function filterClients(arr, prop, value) {
  return arr.filter(function (client) {
    if (String(client[prop]).includes(value[0].trim().toUpperCase() + value.trim().substring(1).toLowerCase()) ||
      String(client[prop]).includes(value.trim().toLowerCase()) ||
      String(client[prop]).includes(value.trim().toUpperCase())) return true;
  });
}

// Отрисовка всех клиентов в таблице
async function renderClientsList() {
  await createClientsList();

  $clientsList.innerHTML = '';
  let clientsListCopy = [...clientsList]; // копируем массив для работы

  // сортируем массив
  clientsListCopy = sortClients(column, columnDir);

  // фильтруем массив
  if ($filterInput.value !== '') {
    clientsListCopy = filterClients(clientsListCopy, 'fullName', $filterInput.value);
  };

  for (const client of clientsListCopy) {
    $clientsList.append(createNewClientTr(client).$clientTr);
  }
}

// Запуск прилоадера
async function startApp() {
  $clientsList.innerHTML = '';
  $clientsList.append(createPreloader());
  $btnAddClient.setAttribute('disabled', '');
  if (await getData()) {
    setTimeout(async () => {
      await renderClientsList();
      $btnAddClient.removeAttribute('disabled');
    }, 800);
  } else {
    return;
  }
}

await startApp();

// Действие при клике на кнопку "Добавить клиента"
$btnAddClient.addEventListener('click', function () {
  openModal(function (box) {
    box.innerHTML = '';
    $modalBtnAddContact.classList.add('contact__btn-add-contact', 'contact__btn-add-contact--active', 'btn-reset');

    $modalTitle.textContent = 'Новый клиент';
    $modalBtnSave.textContent = 'Сохранить';
    $modalBtnCancel.textContent = 'Отмена';

    box.append($modalBtnClose);
    box.append($modalTitle);
    $modalBlockContacts.append($modalBtnAddContact);
    $modalForm.append($modalBlockContacts, $listError, $modalBtnSave);
    box.append($modalForm);
    box.append($modalBtnCancel);

    // при нажатии на кнопку СОХРАНИТЬ
    $modalForm.addEventListener('submit', async function (event) {
      event.preventDefault();
    })

    $modalBtnSave.onclick = async function () {
      if (!validationName()) return;
      try {
        await createData();
      } catch (error) {
        console.log(error);
      }
      clearingAll();
      await startApp();
    }
  });
})

// Действие при клике на кнопку "Добавить контакт"
$modalBtnAddContact.addEventListener('click', function (event) {
  event.preventDefault();
  $errorItem.textContent = '';
  const contactsItems = document.getElementsByClassName('contact__container');
  const contactItem = addContact();
  $modalBlockContacts.prepend($contactWrap)

  setTimeout(function () {
    if (contactsItems.length < 9) {
      $contactWrap.append(contactItem.$contactContainer);
      $modalBlockContacts.style.backgroundColor = 'var(--gray-suit-opacity02)';
      $modalBlockContacts.classList.remove('modal__contact--closed');
      $modalBlockContacts.classList.add('modal__contact--open');
    } else {
      $contactWrap.append(contactItem.$contactContainer);
      $modalBtnAddContact.classList.remove('contact__btn-add-contact--active');
    }
  }, 20);
})

// Действие при сортировке
$appThAll.forEach(element => {
  element.addEventListener('click', async function () {
    for (const $thCell of $appThAll) {
      $thCell.classList.remove('thead__cell--color');
    }
    column = this.dataset.column;
    columnDir = !columnDir;
    const $spanArrow = element.getElementsByClassName('thead__cell-arrow');
    if (columnDir) {
      $spanArrow[0].classList.toggle('thead__cell-arrow--up');
      $spanArrow[0].classList.toggle('thead__cell-arrow--down');
      element.classList.add('thead__cell--color');
    } else {
      $spanArrow[0].classList.toggle('thead__cell-arrow--up');
      $spanArrow[0].classList.toggle('thead__cell-arrow--down');
      element.classList.add('thead__cell--color');
    }
    await renderClientsList();
  })
})

// Действие при фильтрации
$filterInput.addEventListener('input', function () {
  clearTimeout(hideTimeoutId);
  hideTimeoutId = setTimeout(startApp, 500);
})
document.getElementById('header-form').addEventListener('submit', function (event) {
  event.preventDefault();
})
