import { createReducer, on } from "@ngrx/store";
import { initialState, postsAdapter } from "./posts.state";
import { addPostSuccess, deletePostSuccess, loadPostsSuccess, updatedPostSuccess } from "./posts.actions";

const _postsReducer = createReducer(initialState, on(addPostSuccess, (state, action)=>{
  return postsAdapter.addOne(action.post, state);
}), on(updatedPostSuccess, (state, action)=>{
  return postsAdapter.updateOne(action.post, state);
}), on(deletePostSuccess, (state, { id }) => {
  return postsAdapter.removeOne(id, state);
}), on(loadPostsSuccess, (state, action)=>{
  return postsAdapter.setAll(action.posts, state);
})
);
export function postsReducer(state:any, action:any) {
  return _postsReducer(state, action);
}
