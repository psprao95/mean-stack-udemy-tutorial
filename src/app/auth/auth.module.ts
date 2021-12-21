import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "../angular-material-module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [AngularMaterialModule,FormsModule,CommonModule],
    declarations: [
        SignupComponent,
        LoginComponent,
        
    ]
})
export class AuthModule{

}