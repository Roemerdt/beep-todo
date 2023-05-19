import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './home-routing.module';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule
    ],
    declarations: [
        LayoutComponent,
        AddEditComponent
    ]
})
export class HomeModule { }