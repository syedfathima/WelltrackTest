import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginPage } from "./login/login";
import { SsoAuthorizationLoginComponent } from "./sso-authorization-login/sso-authorization-login.component";
import { RegisterPage } from "./register/register";
import { RegisterFormComponent } from "./register-form/register-form";
import { ForgotPasswordPage } from "./forgot-password/forgot-password";
import { PasswordChangePage } from "./password-change/password-change";
import { ConfirmPage } from "./confirm/confirm.component";
import { LoginAssertionPage } from "./login-assertion/login-assertion";
import { LoginSsoAuthPage } from "./login-sso-auth/login-sso-auth";

import { AuthModuleService } from "./lib/auth-module.service";
import { LoginAPIService } from "./lib/login-api.services";

@NgModule({
	declarations: [
		LoginPage,
		SsoAuthorizationLoginComponent,
		RegisterPage,
		RegisterFormComponent,
		ForgotPasswordPage,
		PasswordChangePage,
		ConfirmPage,
		LoginAssertionPage,
		LoginSsoAuthPage,
	],
	imports: [CommonModule, AuthRoutingModule, SharedModule],
	providers: [AuthModuleService, LoginAPIService],
})
export class AuthModule {}
