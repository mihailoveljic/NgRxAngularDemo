import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from "src/app/services/auth.service";
import { autoLogin, autoLogout, loginStart, loginSuccess, signupStart, signupSuccess } from "./auth.actions";
import { catchError, exhaustMap, map, mergeMap, of, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { setErrorMessage, setLoadingSpinner } from "src/app/store/shared/shared.actions";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
     private authService: AuthService,
     private store : Store<AppState>,
     private router: Router) {}
  login$ = createEffect(()=> {
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password)
        .pipe(map((data) => {
          const user = this.authService.formatUser(data);
          this.store.dispatch(setLoadingSpinner({ status: false }));
          this.store.dispatch(setErrorMessage({ message: '' }));
          this.authService.setUserInLocalStorage(user);
          return loginSuccess({user, redirect: true});
        }),
        catchError((errResp)=>{
          const errorMessage = this.authService.getErrorMessage(errResp.error.error.message);
          this.store.dispatch(setLoadingSpinner({ status: false }));
          return of(setErrorMessage({message: errorMessage}))
        })
        )
      }))
  })
  loginRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[loginSuccess]),
        tap((action : any) => {
          this.store.dispatch(setErrorMessage({ message: '' }));
          if(action.redirect){
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );
  signup$ = createEffect(()=> {
    return this.actions$.pipe(
      ofType(signupStart),
      exhaustMap((action) => {
        return this.authService.signUp(action.email, action.password)
        .pipe(map((data) => {
          const user = this.authService.formatUser(data);
          this.store.dispatch(setLoadingSpinner({ status: false }));
          this.store.dispatch(setErrorMessage({ message: '' }));
          return signupSuccess({user});
        }),
        catchError((errResp)=>{
          const errorMessage = this.authService.getErrorMessage(errResp.error.error.message);
          this.store.dispatch(setLoadingSpinner({ status: false }));
          return of(setErrorMessage({message: errorMessage}))
        })
        )
      }))
  })
  signupRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[signupSuccess]),
        tap((action : any) => {
          this.store.dispatch(setErrorMessage({ message: '' }));
          this.router.navigate(['/auth']);
        })
      );
    },
    { dispatch: false }
  );

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autoLogin),
      mergeMap((action) => {
        const user = this.authService.getUserFromLocalStorage();
        console.log(user)
        //@ts-ignore
        return of(loginSuccess({user, redirect: false}));
      })
    );
  })
  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(autoLogout),
        map((action) => {
          this.authService.logout();
          this.router.navigate(['auth']);
        })
      );
    },
    { dispatch: false }
  );
}
