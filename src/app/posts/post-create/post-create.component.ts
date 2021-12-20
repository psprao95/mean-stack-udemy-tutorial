import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit{
  newPost = 'NO CONTENT';
  enteredValue = 'Placeholder';
  enteredTitle = '';
  private mode: string = 'create';
  private postId:any;
   post: any;
   isLoading = false;
   form: FormGroup;
   imagePreview: any;
   //image: File;
  //@Output() postCreated = new EventEmitter<Post>();


  /*onClick(postInput: HTMLTextAreaElement){
    console.log(postInput)
    this.newPost=postInput.value;
    //this.newPost='this user\'s post'
    //alert('Post added');
    //console.log('Thank you');
  }*/

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap)=>{
      this.form=new FormGroup({
'title': new FormControl(null,{validators: [Validators.required,Validators.minLength(3)]}),
'content': new FormControl(null, {validators: [Validators.required]}),
'image': new FormControl(null, {validators: [Validators.required]})
      });
        if(paramMap.has('postId')){
          this.mode = 'edit'
          this.postId=paramMap.get('postId');
          //this.post = this.postsService.getPost(this.postId);
          this.isLoading=true;
          this.post = this.postsService.getPost(this.postId).subscribe(postData=>{
            this.isLoading=false;
            this.post = {
              _id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath : postData.imagePath
            }
            this.form.setValue({'title': this.post.title,
          'content': this.post.content, 'image': this.post.imagePath});
          });
        }else{
          this.mode= 'create';
          this.postId=null;
        }
    });
  }

  onClick() {
    this.newPost = this.enteredValue;
  }

  onSavePost() {
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    /*const post: Post = {
      _id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content
      ima
      //title: this.enteredTitle,
      //content: this.enteredValue,
    };*/
    //this.postCreated.emit(post);
    if(this.mode === 'create'){
      console.log(' adding post '+this.form.value.title+" "+ this.form.value.content)
      this.postsService.addPost(this.form.value.title, this.form.value.content,this.form.value.image)
    }else{
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content,this.form.value.image);
    }
    this.form.reset();
  }

  //constructor(public posdtService: PostsService){}
  constructor(public postsService: PostsService, public activatedRoute: ActivatedRoute) {
  }


  onImagePick(event: Event){
    //const file: File = new File({});
    const file =(event.target as HTMLInputElement).files?.[0] as File;
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    console.log(file);
    console.log(this.form)
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview=reader.result;
    }
    reader.readAsDataURL(file);
  }


}
