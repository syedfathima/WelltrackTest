import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { LoginPage } from "./login/login";
import { RegisterPage } from "./register/register";
import { ForgotPasswordPage } from "./forgot-password/forgot-password";
import { PasswordChangePage } from "./password-change/password-change";
import { ConfirmPage } from "./confirm/confirm.component";
import { LoginAssertionPage } from "./login-assertion/login-assertion";
import { LoginSsoAuthPage } from "./login-sso-auth/login-sso-auth";

const authRoutes = [
	{
		path: "",
		component: LoginPage,
		data: { title: "login" },
	},
	{
		path: "signup",
		component: RegisterPage,
		pathMatch: "full",
		data: { title: "create" },
	},
	{
		path: "register",
		redirectTo: "/",
		pathMatch: "full",
	},
	{
		path: "forgot-password",
		component: ForgotPasswordPage,
		data: { title: "resendpassword" },
	},
	{
		path: "change-password/:guid/:application",
		component: PasswordChangePage,
		data: { title: "passwordchange" },
	},
	{
		path: "confirm/:segment/:guid/:application",
		component: ConfirmPage,
		data: { title: "confirm" },
	},
	{
		path: "authassertion/:id",
		component: LoginAssertionPage,
		data: { title: "loginassertion" },
	},
	{
		path: "sso/:segment",
		component: LoginSsoAuthPage,
		data: { title: "loginssoauth" },
	},
];

@NgModule({
	imports: [RouterModule.forChild(authRoutes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
