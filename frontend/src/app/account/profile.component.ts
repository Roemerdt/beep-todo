import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AccountService, FileUploadService } from '@app/_services';

import { Image } from '@app/_models/image';

@Component({ templateUrl: 'profile.component.html' })
export class ProfileComponent implements OnInit {
    user!: User;
    image!: Image;
    has_image = false;
    selectedFile?: File;
    currentFile?: File;
    progress = 0;
    message = '';
    preview = '';


    constructor(
        private accountService: AccountService,
        private http: HttpClient,
        private uploadService: FileUploadService
    ) {}

    ngOnInit(): void {
        this.user = this.accountService.userValue!;
        this.image = new Image();
        this.image.image = "user.png";
        this.loadProfileImage();
    }

    selectFile(event: any): void {
        this.message = '';
        this.preview = '';
        this.progress = 0;
        this.selectedFile = event.target.files[0];
    
        if (this.selectedFile) {
            const file: File | null = this.selectedFile;
    
            if (file) {
                this.preview = '';
                this.currentFile = file;
        
                const reader = new FileReader();
        
                reader.onload = (e: any) => {
                    this.preview = e.target.result;
                };
        
                reader.readAsDataURL(this.currentFile);
            }
        }
    }

    upload(): void {
        this.progress = 0;
    
        if (this.selectedFile) {
          const file: File | null = this.selectedFile;
    
          if (file) {
            this.currentFile = file;
    
            this.uploadService.upload(this.currentFile).subscribe({
                next: (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round((100 * event.loaded) / event.total);
                    } else if (event instanceof HttpResponse) {
                        this.message = event.body.message;
                        this.preview = '';
                        // update displayed picture
                        this.image = event.body;
                        //   this.imageInfos = this.uploadService.getFiles();
                    }
                },
                    error: (err: any) => {
                    console.log(err);
                    this.progress = 0;
        
                    if (err.error && err.error.message) {
                        this.message = err.error.message;
                    } else {
                        this.message = 'Could not upload the image!';
                    }
        
                    this.currentFile = undefined;
                },
            });
          }
    
          this.selectedFile = undefined;
        }
    }

    loadProfileImage() {
        this.uploadService.getImage()
        .subscribe({
            next: (res) => {
                this.image = res;
                this.has_image = true;
            },
            error: (e) => {
                this.has_image = false;
            }
        });
    }
}