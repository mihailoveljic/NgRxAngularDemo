export class User {
  constructor(
    private email: string,
    private token: string,
    private localId: string,
    private expirationDate: Date
  ){}
  get getExpirationDate() {
    return this.expirationDate;
  }
  get getToken() {
    return this.token;
  }
}
