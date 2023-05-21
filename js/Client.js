export default class Client {
  constructor(surname, name, lastName, contacts = [], id, createdAt, updatedAt) {
    this.surname = surname
    this.name = name
    this.lastName = lastName
    this.contacts = contacts
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  get fullName() {
    return this.surname[0].toUpperCase() + this.surname.substring(1).toLowerCase() +
      ' ' + this.name[0].toUpperCase() + this.name.substring(1).toLowerCase() +
      ' ' + this.lastName
  }

  getActionAtDate(action) {
    const yyyy = action.getFullYear();
    let mm = action.getMonth() + 1,
    dd = action.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    return dd + '.' + mm + '.' + yyyy;
  }

  getActionAtTime(action) {
    let hours = action.getHours(),
      min = action.getMinutes();
    if (hours < 10) hours = '0' + hours;
    if (min < 10) min = '0' + min;
    return hours + ':' + min;
  }
}
