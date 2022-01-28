import { D } from "@angular/cdk/keycodes";

const questions = [{
  question: 'Are you experiencing academic difficulties?',
  instruction: 'You may benefit from the following resources:',
  resourceNumber: 1
},
{
  question: 'Are you worried about your financial situation and/or have concerns about your basic needs (housing/food/transportation)?',
  instruction: 'You may benefit from the following resources:',
  resourceNumber: 2
},
{
  question: 'Have you experienced any unwanted sexual contact and want help or to talk to someone about it?',
  instruction: 'You may benefit from the following resources:',
  resourceNumber: 3
},
{
  question: 'Are you experiencing struggles with alcohol/drug overuse or addiction?',
  instruction: 'You may benefit from the following resources:',
  resourceNumber: 4
},
{
  question: 'Do you have health questions/concerns or required medical services?',
  instruction: 'You may benefit from the following resources:',
  resourceNumber: 5
},
{
  question: 'Have you experienced any safety or security threats to your physical well-being on campus?',
  instruction: 'You may benefit from the following resources:',
  resourceNumber: 6
}
];

export class Organization {

  id: number = null;
  name: string = '';
  subdomain: string = '';
  emergencyContact: string = '';
  address: string = '';
  phone: string = '';
  website: string = '';
  email: string = '';
  protocallRefId: string = '';
  resources: string = '';
  description: string = '';
  settings: Settings;
  active: boolean = true;
  demoStatus: boolean = false;
  enableSharing: boolean = false;
  enforceDomains: boolean = false;
  enableResources: boolean = false;
  enableDisasterCourse: boolean = false;
  parentOrgId: number = null;
  allowedDomains: string = '';
  logo: string = '';
  logoPath: string = '';
  logoUpload: any = '';
  authenticationType: string;
  clientID: string;
  redirectUrl: string;
  authorizeEndPointUrl: string;
  oauthEndPointUrl: string;
  parentOrganization: Organization;
  childOrganizations: Organization[];
  resourceSet: resourceSet[] = [];
  questionSet: questionSet[] = [];
  enableSso: boolean = false;
  sso: any;
  auth: OrgAuth;
  enableDemoOther: boolean;
  contactGroup: OrganizationContact;
  courses: OrganizationCourse[];
  language:string;

  constructor(data?: any, mode = 'summary') {
    if (data) {
      this.id = data.ID || data.id;
      this.name = data.Name || data.name;
      this.subdomain = data.Subdomain || data.subdomain;
      this.emergencyContact = data.EmergencyContact || data.emergencyContact;
      this.address = data.Address || data.address;
      this.phone = data.Phone || data.phone;
      this.website = data.Website || data.website;
      this.email = data.Email || data.email;
      this.protocallRefId = data.ProtocallRefID || data.protocallRefId;
      this.resources = data.Resources || data.resources;
      this.description = data.Description || data.description;
      this.settings = new Settings(data.Settings || data.settings);
      this.active = data.active || data.Active;
      this.demoStatus = data.demoStatus || data.DemoStatus;
      this.logo = data.logo || data.Logo;
      this.logoPath = data.logoPath || data.LogoPath;
      this.logoUpload = data.logoUpload || data.LogoUpload;
      this.authenticationType = data.authenticationType || data.AuthenticationType;
      this.clientID = data.ClientID || data.clientID;
      this.redirectUrl = data.RedirectUrl || data.redirectUrl;
      this.authorizeEndPointUrl = data.AuthorizeEndPointUrl || data.authorizeEndPointUrl;
      this.oauthEndPointUrl = data.OauthEndPointUrl || data.oauthEndPointUrl;
      this.parentOrgId = data.ParentOrgID || data.parentOrgId;
      this.allowedDomains = data.allowedDomains || data.AllowedDomains;
      this.enforceDomains = data.EnforceDomains || data.enforceDomains;
      this.enableResources = data.enableResources;
      this.enableSso = data.enableSso;
      this.sso = data.sso;
      this.enableDemoOther = data.enableDemoOther;
      this.contactGroup = new OrganizationContact(data.contactGroup);
      this.language = data.language

      if (mode === 'full') {
        this.initializeQuestionset(true, data.questionSet);
        this.initializeResourcesets(data.resourceSet);
        this.initializeCourses(data.Courses || data.courses);
      }
      else if (mode === 'view') {
        this.initializeQuestionset(false, data.questionSet);
        this.initializeResourcesets(data.resourceSet);
      }
      else {

      }

      if (data.auth) {
        this.auth = new OrgAuth(data.auth);
      }
      else {
        this.auth = new OrgAuth();
      }

      if (data.parentOrganization) {
        this.parentOrganization = new Organization(data.parentOrganization);
      }

      if (data.childOrganizations) {
        let childOrgs = [];
        data.childOrganizations.forEach(organization => {
          childOrgs.push(new Organization(organization));
        })
        this.childOrganizations = childOrgs;
      }
    }
    else {
      this.settings = new Settings();
      this.initializeCourses();
      if (mode === 'full') {
        this.initializeQuestionset();
        this.initializeResourcesets();
        this.contactGroup = new OrganizationContact();
        this.auth = new OrgAuth();
      }
    }

  }

  public static initializeArray(objects: any): Organization[] {

    let results: Organization[] = [];

    objects.forEach(organizationRow => {
      let obj = new Organization(organizationRow, 'full');
      results.push(obj);
    });

    return results;
  }

  public initializeResourcesets(resourceSets?: any) {
     if (resourceSets ) {
      resourceSets.forEach(row => {
        this.resourceSet.push(new resourceSet(row));
      });
    }
    else {
      for (let i = 0; i < 6; i++) {
        this.resourceSet.push(new resourceSet());
      }
    }
  }

  public initializeQuestionset(init: boolean = true, questionSets?: any) {

    if (questionSets) {
      questionSets.forEach(questionSetRow => {
        this.questionSet.push(new questionSet(questionSetRow));
      });
    }
    else {
      if (init) {
        for (let i = 0; i < 6; i++) {
          this.questionSet.push(new questionSet(questions[i]));
        }
      }
    }
  }

  public initializeCourses(Courses?: any) {

    this.courses = [];
    // if (!Courses || (Courses && Courses.length === 0)) {
    //   for (let i = 0; i < courses.length; i++) {
    //     this.courses.push(new OrganizationCourse(courses[i]));
    //   }
    // }
    if (Courses) {
      for (let i = 0; i < Courses.length; i++) {
        this.courses.push(new OrganizationCourse(Courses[i]));
      }

      //Add new courses if there's already entries.
      //Otherwise,  the courses will stay the same number

      // if ( Courses.length < courses.length){
      //   for (let i = Courses.length; i < courses.length; i++) {
      //     this.courses.push(new OrganizationCourse(courses[i]));
      //   }
      // }
    }
    else {
      this.courses = [];
    }
  }

  public addResourceset() {
    this.resourceSet.push(new resourceSet());
  }

  public addQuestionset() {
    this.questionSet.push(new questionSet());
  }

  public static forApi(organization: Organization) {
    return {
      ID: organization.id,
      Name: organization.name,
      Subdomain: organization.subdomain,
      EmergencyContact: organization.emergencyContact,
      Address: organization.address,
      Phone: organization.phone,
      Website: organization.website,
      ProtocallRefId: organization.protocallRefId,
      Resources: organization.resources,
      Settings: JSON.stringify(organization.settings),
      Active: organization.active,
      enableSharing: organization.enableSharing,
      DemoStatus: organization.demoStatus,
      allowedDomains: organization.allowedDomains,
      EnforceDomains: organization.enforceDomains,
      enableResources: organization.enableResources,
      enableSso: organization.enableSso,
      auth: organization.auth,
      Description: organization.description,
      ParentOrgID: organization.parentOrgId,
      ResourceSet: JSON.stringify(organization.resourceSet),
      QuestionSet: JSON.stringify(organization.questionSet),
      ContactGroup: JSON.stringify(organization.contactGroup),
      Courses: JSON.stringify(organization.courses),
      LogoUpload: organization.logoUpload,
      Logo: organization.logo,
      AuthenticationType: organization.authenticationType,
      ClientID: organization.clientID,
      RedirectUrl: organization.redirectUrl,
      AuthorizeEndPointUrl: organization.authorizeEndPointUrl,
      OauthEndPointUrl: organization.oauthEndPointUrl
    }
  }

}

export class Settings {
  assessment: string = 'das';
  hasCounselors: boolean = true;
  showAssessment: boolean = false;
  enableVideo: boolean = false;
  enableMessages: boolean = false;
  customConfirm: string = '';
  enableAlerts: boolean = true;
  enableBuddyScheduling: boolean = false;
  enableDisasterCourse: boolean = false;
  hideNotes: boolean = false;
  showOldDashboard: boolean = false;
  hasScheduledPushNotification: boolean = false;

  constructor(data?: any) {

    if (data) {
      if (data.hasOwnProperty('assessment')) {
        this.assessment = data.assessment;
      }

      if (data.hasOwnProperty('hasCounselors')) {
        this.hasCounselors = data.hasCounselors
      }

      if (data.hasOwnProperty('showAssessment')) {
        this.showAssessment = data.showAssessment
      }

      if (data.hasOwnProperty('enableVideo')) {
        this.enableVideo = data.enableVideo
      }

      if (data.hasOwnProperty('enableMessages')) {
        this.enableMessages = data.enableMessages
      }

      if (data.hasOwnProperty('customConfirm')) {
        this.customConfirm = data.customConfirm
      }

      if (data.hasOwnProperty('enableAlerts')) {
        this.enableAlerts = data.enableAlerts
      }

      if (data.hasOwnProperty('enableBuddyScheduling')) {
        this.enableBuddyScheduling = data.enableBuddyScheduling
      }

      if (data.hasOwnProperty('hideNotes')) {
        this.hideNotes = data.hideNotes
      }

      if (data.hasOwnProperty('enableDisasterCourse')) {
        this.enableDisasterCourse = data.enableDisasterCourse
      }

      if (data.hasOwnProperty('showOldDashboard')) {
        this.showOldDashboard = data.showOldDashboard;
      }

      if (data.hasOwnProperty('hasScheduledPushNotification')) {
        this.hasScheduledPushNotification = data.hasScheduledPushNotification;
      }
    }
  }

}

export class questionSet {

  id: number;
  question: string = '';
  instruction: string = '';
  resourceNumber: number;
  category: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id || data.ID;
      this.question = data.Question || data.question;
      this.instruction = data.Instruction || data.instruction;
      this.resourceNumber = data.ResourceNumber || data.resourceNumber;
      this.category = data.category || data.Category;
    }
  }

}

export class resourceSet {
  id: number;
  title: string = '';
  categories: string[];
  summary: string = '';
  number: number;
  resourcesetGroup: ResourceSetGroup[] = [];
  videos: Video[] = [];
  language:string;
  constructor(data?: any) {
    if (data) {
       this.id = data.ID || data.id;
      this.title = data.Title || data.title;
      this.categories = data.Categories || data.categories;
      this.summary = data.Summary || data.summary;
      this.number = data.Number || data.number;
      this.language = data.Language || data.language;
      this.initializeGroups(data.resourcesetGroup);
      this.initializeVideos(data.videos);
    }
    else {
      this.initializeGroups();
    }


  }

  public initializeVideos(videos?: any) {
    if (videos && videos.length > 0) {
      videos.forEach(video => {
        this.videos.push(new Video(video));
      });
		}
  }

  public initializeGroups(resourceSetGroups?: any) {

    if (resourceSetGroups) {
      resourceSetGroups.forEach(resourceSetGroup =>{
        this.resourcesetGroup.push(new ResourceSetGroup(resourceSetGroup));
      });
    }
    else {
      for (let i = 0; i < 1; i++) {
        this.resourcesetGroup.push(new ResourceSetGroup());
      }
    }
  }

  public addGroup() {
    this.resourcesetGroup.push(new ResourceSetGroup());
  }
}


export class Video {
	id: number;
	label: string;
	length: string;
	image: string;
	imageUpload: fileUpload;
	media: string;
	mediaUpload: fileUpload;
	captionFile: string;
	captionFileUpload: fileUpload;
	audioFile: string;
	audioFileUpload: fileUpload;
	forceVideo: number;
	isCompleted: boolean;
	description:string;
  language:string;
	constructor(data?: any) {
		if (data) {
      this.id = data.ID || data.id;
			this.label = data.Title || data.title;
			this.length = data.Length || data.length;
			this.image = data.Image || data.image;
			this.media = data.Media || data.media;
			this.captionFile = data.CaptionFile|| data.captionFile;
			this.description = data.description || data.Description;
			this.isCompleted = data.IsCompleted;
			this.imageUpload = new fileUpload({fileUpload: data.Image,fileFileName:''});
			this.mediaUpload = new fileUpload({fileUpload: data.Media,fileFileName:''});
			this.captionFileUpload = new fileUpload({fileUpload: data.CaptionFile,fileFileName:''});
      this.language = data.language;
		}
		else {
      this.imageUpload = new fileUpload({});
			this.mediaUpload = new fileUpload({});
			this.captionFileUpload = new fileUpload({});
		}
	}

	
}


export class ResourceSetGroup {
  id: number;
  title: string = '';
  contact: string = '';
  alternateContact: string = '';
  address: string = '';
  websiteTitle: string = '';
  website: string = '';
  description: string = '';
  internal: string = '';
  active: number;
  language:string
  constructor(data?: any) {

    if (data) {
      this.id = data.ID || data.id;
      this.title = data.Title || data.title;
      this.contact = data.Contact || data.contact;
      this.alternateContact = data.AlternateContact || data.alternateContact;
      this.websiteTitle = data.WebsiteTitle || data.websiteTitle;
      this.website = data.Website || data.website;
      this.address = data.Address || data.address;
      this.description = data.Description || data.description;
      this.internal = data.Internal || data.internal;
      this.active = data.Active !== '' ? data.Active :  data.active;
      this.language = data.Language || data.language
    }
  }
}

export class OrganizationContact {
  id: number;
  telephone: string;
  title: string;
  description: string;

  constructor(data?: any) {
    if (data) {
      this.telephone = data.Telephone || data.telephone;
      this.title = data.Title || data.title;
      this.description = data.Description || data.description;
    }
    else {
      this.telephone = '';
      this.title = '';
      this.description = '';
    }
  }
}

export class OrgAuth {
  url: string = '';
  xml: string = '';
  type: string;

  constructor(data?: any) {

    if (data) {
      this.url = data.Url_idp || data.url;
      this.xml = data.Xml_idp || data.xml;
      this.type = data.AuthType;
    }
  }
}

export class OrganizationCourse {
  id: number;
  courseId: number;
  name: string;
  enabled: boolean;
  constructor(data?: any) {

    if (data) {
      this.id = data.ID || data.id;
      this.courseId = data.CourseID || data.courseId;
      this.name = data.Name || data.name;
      this.enabled = data.Enabled || data.enabled;
    }
    else {
      this.id = null;
      this.name = ''
      this.enabled = true;
    }
  }
}

export class fileUpload{
	fileUpload: string;
	fileFilename: string;

	constructor(data: any) {
   	if(data) {
			this.fileUpload = data.FileUpload || data.fileUpload;
			this.fileFilename = data.fileFilename || data.fileFilename;
		}
	}
}





