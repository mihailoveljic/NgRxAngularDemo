import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { Post } from '../../models/posts.model';
import { getPosts } from '../state/posts.selector';
import { deletePost, loadPosts } from '../state/posts.actions';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {

  posts$ : Observable<Post[]> = new Observable();
  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.posts$ = this.store.select(getPosts);
    this.store.dispatch(loadPosts());
  }
  onDeletePost(id: string){
    if (confirm('Are you sure you want to delete')) {
      this.store.dispatch(deletePost({ id }));
    }
  }
}
