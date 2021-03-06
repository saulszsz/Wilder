import { RegisterUserComponent } from './components/register-user/register-user.component';
import { MaterialModule } from './../material/material.module';
import { ModifyUserComponent } from './components/modify-user/modify-user.component';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { LogoutComponent } from './components/logout/logout.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';
import { DetailUserComponent } from './components/detail-user/detail-user.component';
import { ModificatemenuComponent } from './components/modificatemenu/modificatemenu.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  }, {
    path: "logout",
    component: LogoutComponent
  }, {
    path: "register",
    component: RegisterUserComponent
  }, {
    path: "detail",
    component: DetailUserComponent
  },
  {
    path: "create",
    component: CreateUserComponent
  },
  {
    path: "modify",
    component: ModifyUserComponent
  },
  {
    path: "delete",
    component: DeleteUserComponent
  },
  {
    path: "modificate/:uid",
    component: ModificatemenuComponent
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterUserComponent,
    CreateUserComponent,
    DeleteUserComponent,
    ModifyUserComponent,
    DetailUserComponent,
    ModificatemenuComponent
  ],
  imports: [
    RouterModule,
    RouterModule.forChild(routes),
    CommonModule,
    MaterialModule
  ]
})
export class UsersModule { }
