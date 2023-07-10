import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthResponseData } from "../auth/models/AuthResponseData.model";
import { Observable } from "rxjs";
import { User } from "../auth/models/User.model";
import { autoLogout } from "../auth/state/auth.actions";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  timeoutInterval : any;
  constructor(private http: HttpClient, private store : Store){}

  login(email: string, password: string) : Observable<AuthResponseData>{
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIRBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );
  }

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIRBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );
  }
  formatUser(data: AuthResponseData){
    const expirationDate = new Date(new Date().getTime() + +data.expiresIn * 1000);
    const user = new User(data.email, data.idToken, data.localId, expirationDate);
    return user;
  }
  getErrorMessage(message: string) {
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        return 'Email Not Found';
      case 'INVALID_PASSWORD':
        return 'Invalid Password';
      case 'EMAIL_EXISTS':
        return 'Email already exists';
      default:
        return 'Unknown error occurred. Please try again';
    }
  }
  setUserInLocalStorage(user: User){
    localStorage.setItem('user', JSON.stringify(user));

    this.runTimeoutIntervale(user);
  }
  private runTimeoutIntervale(user: User) {
    const todaysDate = new Date().getTime();
    const expirationDate = user.getExpirationDate.getTime();
    const timeInterval = expirationDate - todaysDate;

    this.timeoutInterval = setTimeout(() => {
      this.store.dispatch(autoLogout());
    }, timeInterval);
  }

  getUserFromLocalStorage(){
    const userDataString = localStorage.getItem('user');
    if(userDataString) {
      const userData = JSON.parse(userDataString);
      const expirationDate = new Date(userData.expirationDate);
      const user = new User(userData.email, userData.idToken, userData.localId, expirationDate);
      this.runTimeoutIntervale(user);
      return user;
    }else {
      return null;
    }
  }
  logout() {
    localStorage.removeItem('user');
    if (this.timeoutInterval) {
      clearTimeout(this.timeoutInterval);
      this.timeoutInterval = null;
    }
  }
}
