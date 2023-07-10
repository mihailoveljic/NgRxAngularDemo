import { EntityState, createEntityAdapter } from "@ngrx/entity";
import { Post } from "../../models/posts.model";

// export interface PostsState {
//   posts: Post[];
// }
export interface PostsState extends EntityState<Post> {}
export const postsAdapter = createEntityAdapter<Post>();

export const initialState = postsAdapter.getInitialState();

export const postsSelectors = postsAdapter.getSelectors();
// export const initialState : PostsState  = {
//   posts: [],
// }
