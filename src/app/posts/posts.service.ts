import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment"

const BACKEND_URL = environment.apiUrl + "/posts";

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient, private router: Router) { }

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], numPosts: number }>();

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    //return { ...this.posts.find((p) => p._id === id) };
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>
      (BACKEND_URL + '/' + id);
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http
      .get<{ message: string; posts: Post[], maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .subscribe((postsData) => {
        console.log(postsData)
        this.posts = postsData.posts;
        this.postsUpdated.next({ posts: [...this.posts], numPosts: postsData.maxPosts });
      });
  }

  addPost(title: string, content: string, image: File) {
    //const post: Post = { _id: 'null', title: title, content: content };
    const postData = new FormData()
    postData.append("title", title);
    postData.append("content", content)
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe((responseData) => {
        /*const post: Post = {_id: responseData.post._id, title: title, content: content, imagePath: responseData.post.imagePath}
        //console.log(responseData);
        post._id = responseData.post._id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);*/
        this.router.navigate(['/']);
      });


  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    var postData: FormData | Post;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("_id", id)
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title)

    } else {
      postData = {
        _id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: ""
      };
    }
    this.http
      .put<{ message: string }>(BACKEND_URL + '/' + id, postData)
      .subscribe((responseData) => {
        /*console.log(responseData);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p=>p._id===id);
        const post: Post = {
          _id: id,
          title: title,
          content: content,
          imagePath: ""
        }
        updatedPosts[oldPostIndex]=post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])*/
        this.router.navigate(['/']);

      });
  }


  deletePost(postId: string) {
    return this.http
      .delete<{ message: string }>(BACKEND_URL + '/' + postId)
    /*.subscribe((responseData) => {
      console.log(responseData);
      const updatedPosts = this.posts.filter((post) => post._id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });*/
  }
}
