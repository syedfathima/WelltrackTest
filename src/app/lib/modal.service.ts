import { Injectable, ViewEncapsulation, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { overlayConfigFactory, DialogRef } from 'ngx-modialog';
import {
	VEXBuiltInThemes,
	Modal,
	DialogPreset,
	DialogPresetBuilder
} from 'ngx-modialog/plugins/vex';
import { ConfirmPopup } from '../components/alerts/confirm-popup/confirm-popup';
import { ErrorPopup } from '../components/alerts/error-popup/error-popup';
import { ModalPopup } from '../components/alerts/modal-popup/modal-popup';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';


@Injectable()
export class ModalService {

	result: any;

	//This is used to set the class name of the modals
	//Could be set to a string for more css customization
	theme: VEXBuiltInThemes = <VEXBuiltInThemes>'default';
	//modalCommands: ModalCommandDescriptor[];

	//The message for custom modals
	message: string;

	//An array of buttons for custom modals
	//cssClass sets the class of the buttons, message is what the button says
	//with value being the value returned by the promise if it's clicked
	customButtonArray: { cssClass: string, message: string, value: any }[];

	//Whether a custom modal has a close button in the top right
	//Defaults to TRUE
	showCloseButton: boolean;

	closeOnClickAway: boolean;

	constructor(
		public modal: Modal,
		public dialog: MatDialog
	) {
		this.customButtonArray = [];
		this.message = '';
		this.showCloseButton = true;
		this.closeOnClickAway = true;
		//this.modalCommands = [];
	}

	setCloseonClick(close) {
		this.closeOnClickAway = close;
	}

	/*
	//Creates a Modal from a component
	//Takes in a component and sets the template vaule to be the body of the message
	showComponent(component: any, theme?: string, closeClassName?: string) {

		let customTheme: VEXBuiltInThemes = (theme) ? <VEXBuiltInThemes>theme : this.theme;
		return new DialogPresetBuilder<DialogPreset>(this.modal)
			.className(customTheme)
			.closeClassName(closeClassName)
			.content(component)
			.overlayClosesOnClick(this.closeOnClickAway)
			.open();
	}
	*/

	showComponent(Component: any, data?: any, classes: string = '', lockClose = false, width = '940px') {

		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = lockClose;
		dialogConfig.autoFocus = true;
		dialogConfig.width = width;

		dialogConfig.data = {'data': data};
		/*
		*Close all modals just in case
		*/
		//this.dialog.closeAll();
		const dialogRef = this.dialog.open(Component, dialogConfig);

		return dialogRef;
	}

	showGeneralComponent(data: any) {
		const dialogRef = this.dialog.open(ModalPopup, {
			//width: '250px',
			data: { data: data }
		});

		return dialogRef;
	}

	showAlert(title, message) {
		const dialogRef = this.dialog.open(ErrorPopup, {
			//width: '250px',
			data: { title: title, message: message }
		});

		return dialogRef;
	}

	showConfirmation(title, message, ok = 'Yes', cancel = 'Cancel') {
		const dialogRef = this.dialog.open(ConfirmPopup, {
			//width: '250px',
			data: { title: title, message: message, okTxt: ok, cancelTxt: cancel }
		});

		return dialogRef;
	}


	//Clears the custom button array
	setCloseOnClickAway(set: boolean) {
		this.closeOnClickAway = set;
	}

	//Resets the custom values of the service
	setToDefault() {
		this.customButtonArray = [];
		this.message = '';
		this.showCloseButton = true;
		this.closeOnClickAway = true;
	}

	//Changes the theme of the modals created by the service
	//Possible themes are 'default' | 'os' | 'plain' | 'wireframe' | 'flat-attack' | 'top' | 'bottom-right-corner'
	setTheme(theme: String) {
		this.theme = <VEXBuiltInThemes>theme;
	}

	processPromise(dialog: Promise<DialogRef<any>>) {
		dialog.then((resultPromise) => {
			return resultPromise.result.then((result) => {
				this.result = result;
			}, () => this.result = 'close');
		});
	}

	closeAll(){
		this.dialog.closeAll();
	}

}
