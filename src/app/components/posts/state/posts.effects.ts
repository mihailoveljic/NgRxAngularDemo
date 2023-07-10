import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PostsService } from "src/app/services/posts.service";
import { addPost, addPostSuccess, deletePost, deletePostSuccess, dummyAction, loadPosts, loadPostsSuccess, updatePost, updatedPostSuccess } from "./posts.actions";
import { filter, map, mergeMap, of, switchMap, tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/store/app.state";
import { setErrorMessage } from "src/app/store/shared/shared.actions";
import { Router } from "@angular/router";
import { ROUTER_NAVIGATION, RouterNavigatedAction } from "@ngrx/router-store";
import { Post } from "../../models/posts.model";
import { Update } from "@ngrx/entity";
import { getPosts } from "./posts.selector";

@Injectable()
export class PostsEffects {
  constructor(private actions$: Actions
    , private postsService: PostsService,
     private store : Store<AppState>
     , private router : Router){}

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadPosts),
      mergeMap((action) => {
        return this.postsService.getPosts().pipe(
          map((posts) => {
            return loadPostsSuccess({posts})
          })
        );
      })
    );
  });

  addPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addPost),
      mergeMap((action) => {
        return this.postsService.addPost(action.post).pipe(
          map((data) => {
            const post = {...action.post, id: data.name};
            return addPostSuccess({post});
          })
        );
      })
    );
  })
  updatePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updatePost),
      switchMap((action) => {
        const updatedPost : Update<Post> = {
          id: action.post.id!,
          changes:{
            ...action.post
          }
        }
        return this.postsService.updatePost(action.post).pipe(
          map((data) => {
            return updatedPostSuccess({post: updatedPost});
          })
        );
      })
    );
  })
  deletePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deletePost),
      switchMap((action) => {
        return this.postsService.deletePost(action.id).pipe(
          map((data) => {
            return deletePostSuccess({ id: action.id });
          })
        );
      })
    );
  });
  postsRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(addPostSuccess, updatedPostSuccess),
        tap((action : any) => {
          this.store.dispatch(setErrorMessage({ message: '' }));
          this.router.navigate(['/posts']);
        })
      );
    },
    { dispatch: false }
  );

  getSinglePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigatedAction) => {
        return r.payload.routerState.url.startsWith('/posts/edit');
      }),
      map((r: RouterNavigatedAction) => {
        //@ts-ignore
        return r.payload.routerState['params']['id'];
      }),
      withLatestFrom(this.store.select(getPosts)),
      switchMap(([id, posts]) => {
        if(!posts.length){
          return this.postsService.getPostById(id).pipe(
            map((post) => {
              const postData = [{ ...post, id }];
              return loadPostsSuccess({ posts: postData });
            })
          );
        }
        return of(dummyAction);
      })
    );
  });
}
