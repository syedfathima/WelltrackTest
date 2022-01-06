import { NgModule } from '@angular/core';
import { AuthService } from '../../lib/auth.service';
import { StorageService } from '../../lib/storage.service';
import { MoodTab } from './mood-tab/mood-tab';
import { ActivityTab } from './activity-tab/activity-tab';
import { PlaceTab } from './place-tab/place-tab';
import { PeopleTab } from './people-tab/people-tab';
import { NoteTab } from './note-tab/note-tab';
import { MoodcheckOptionsService } from '../../lib/moodcheck-options.service';
import { MoodcheckOptionsPage } from './moodcheck-options/moodcheck-options';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MoodcheckService } from '../../lib/moodcheck.service';
import { TruncatePipe } from '../../pipes/truncate/truncate';
import { MoodcheckModalComponent } from './moodcheck-modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}


@NgModule({
	declarations: [
		MoodcheckModalComponent,
		MoodTab,
		ActivityTab,
		PlaceTab,
		PeopleTab,
		NoteTab,
		MoodcheckOptionsPage,
		TruncatePipe
	],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
	],
	exports: [
		MoodcheckModalComponent,
		TruncatePipe
	],
	entryComponents: [
		MoodcheckModalComponent,
		MoodTab,
		ActivityTab,
		PlaceTab,
		PeopleTab,
		NoteTab,
		MoodcheckOptionsPage
	],
	providers: [
		AuthService,
		StorageService,
		MoodcheckOptionsService,
		MoodcheckService
	]
})
export class MoodcheckModule { }
