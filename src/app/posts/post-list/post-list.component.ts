import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postsService: PostsService, private authService: AuthService) {}
  
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  isLoading = false;
  currentPage: any;
  authStatusSub: Subscription;
  userAuthenticated: boolean = false;
  userId: string


  //@Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription = new Subscription();

  ngOnInit() {
    this.isLoading = true;
    //this.posts = this.postsService.getPosts();
    this.userId = this.authService.getUserId()
    this.currentPage = 1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userAuthenticated = this.authService.isAuth();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postsData: { posts: Post[]; numPosts: number }) => {
        this.isLoading = false;
        this.posts = postsData.posts;
        this.totalPosts = postsData.numPosts;
      });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId()
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChange(event: PageEvent) {
    this.isLoading = true;
    console.log(event);
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    //this.postsService.getPosts(this.postsPerPage,2);
  }
}
