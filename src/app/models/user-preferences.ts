/**
{
    UserID: 1481,
    NewsEmails: 1,
    ReminderEmails: 0,
    NotificationEmails: 1,
    "TipsEmails": 1,
    "Language": "en",
    "CreatedOnUtc": "2014-01-08 10:13:02",
    "UpdatedOnUtc": "2017-05-04 18:54:26",
    "MoodcheckScheduleEmails": 1,
    "Timezone": "America/Halifax",
    "ChallengeEmails": 0
}
 */

export class UserPreferences {

	notificationOn: boolean = true;
	language: string = 'en';
	createdOnUtc: Date;
	updatedOnUtc: Date;
	timezone: string;
	WellnessNotifications:boolean = false;
	WellnessTrackerNotification:boolean = false;
	//moodcheckScheduleEmails:boolean;
	//challengeEmails:boolean
	//newsEmails:boolean;
	//reminderEmails:boolean;
	//notificationEmails:boolean;
	//tipsEmails:boolean;


	constructor(data?: any) {
		if (data) {

			this.notificationOn = data.NotificationOn || data.notificationOn;
			this.language = data.Language || data.language || 'en';
			this.createdOnUtc = data.CreatedOnUtc || data.createdOnUtc;
			this.updatedOnUtc = data.UpdatedOnUtc || data.updatedOnUtc;
			this.timezone = data.Timezone || data.timezone;
			this.WellnessTrackerNotification = data.WellnessTrackerNotification || data.wellnessTrackerNotification;
			this.WellnessNotifications = data.WellnessNotifications || data.wellnessNotifications;
			//this.moodcheckScheduleEmails = data.MoodcheckScheduleEmails || data.moodcheckScheduleEmails;// will be renamed
			//this.newsEmails = data.NewsEmails || data.newsEmails;
			//this.reminderEmails = data.ReminderEmails || data.reminderEmails;
			//this.notificationEmails = data.NotificationEmails || data.notificationEmails;
			//this.challengeEmails = data.ChallengeEmails || data.challengeEmails;
		}
	}
}
