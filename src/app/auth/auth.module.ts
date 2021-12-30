import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularMaterialModule } from "../angular-material-module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { FormsModule } from "@angular/forms";
import { AuthROutingModule } from "./auth-routing.module";

@NgModule({
    imports: [AngularMaterialModule,FormsModule,CommonModule,AuthROutingModule],
    declarations: [
        SignupComponent,
        LoginComponent,
        
    ]
})
export class AuthModule{

}