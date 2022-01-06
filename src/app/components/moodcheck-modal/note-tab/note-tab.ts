import { Component, OnInit } from '@angular/core';
import { MoodcheckService } from '../../../lib/moodcheck.service';
import { LogService } from '../../../lib/log.service';
import { UtilityService } from '../../../lib/utility.service';

@Component({
	selector: 'page-note-tab',
	templateUrl: 'note-tab.html',
	styleUrls: ['./note-tab.scss']
})
export class NoteTab implements OnInit {

	note: string;
	isDirty: boolean;
	demo: boolean; 

	constructor(
		private mcService: MoodcheckService, 
		private log: LogService,
		private utilityService: UtilityService, 
		) {
		this.isDirty = false;
		this.demo = this.utilityService.isDemoMode();
	}

	onChange() {
		this.mcService.setNote(this.note);

		if (!this.isDirty) {
			this.log.event('moodcheck_select_note');
		}

		this.isDirty = true;
	}

	ngOnInit() {
		this.log.event('moodcheck_enter_note_tab');
	}

}
