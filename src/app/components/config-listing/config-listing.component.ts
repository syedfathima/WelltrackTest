import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'app/lib/api.service';
import { LogService } from 'app/lib/log.service';
import { CreateConfigComponent } from 'app/components/create-config/create-config.component';
import { ModalService } from 'app/lib/modal.service';
import { StorageService } from 'app/lib/storage.service';
import Debounce from 'debounce-decorator'

@Component({
  selector: 'app-config-listing',
  templateUrl: './config-listing.component.html',
  styleUrls: ['./config-listing.component.scss']
})
export class ConfigListingComponent implements OnInit {
  isLoaded:boolean = false;
  configListing:any;
  formattedConfigList:any = [];
  allSections:any = [];
  filters={
    Section:"",
    Setting:"",
    Key:"",
    Value:""
  }
  selectedLanguage:any;
  allLang= [
    'en',
    'fr'
  ]
  constructor(
		private api: ApiService,
		private translate: TranslateService,
    private log: LogService,
    private modalService: ModalService,
    public storage: StorageService) { 
      this.selectedLanguage = this.storage.get('lang');
      this.getAllMoodOptions();
      
  }

  ngOnInit(): void {
  }


  /**
   * Get All MoodOptions
   */
   getAllMoodOptions(){
    this.configListing = [];
     this.isLoaded = true;
     console.log('Inside API',this.isLoaded)
    this.api.get(`config/getalloptions/${this.selectedLanguage}`,this.filters).subscribe(
			(results: any) => {
      this.configListing = results;
      console.log('Inside DATA',this.configListing)
			this.isLoaded = false;
      if(this.configListing !== null) {
        this.configListing= this.formatConfigList();
      }
      console.log('Inside API sucess',this.isLoaded)
    
			},
			(error: any) => {

				this.log.error('Error loading. ' + error.message);
				this.isLoaded = false;
        console.log('Inside API failure' ,this.isLoaded)
    
			}
		);
   }


   /**
    * Format Config Listing
    */
   formatConfigList(){
     this.allSections = [];
     this.formattedConfigList = [];
    for (var key of Object.keys(this.configListing)) {
      this.allSections.push(key);
       for (var key2 of  Object.keys(this.configListing[key])) {
        this.configListing[key][key2].forEach(element => {
          this.formattedConfigList.push(element)
        });
       }   
     }
     return this.formattedConfigList;
   }


  /**
   * Create Config
   */
  createConfig(){
    const modal = this.modalService.showComponent(CreateConfigComponent,{
      sections: this.allSections,
      language:this.selectedLanguage
      
  });
  modal.beforeClosed().subscribe((responseData: any) => {
    if (responseData){
      this.configListing= {}
      this.getAllMoodOptions();  
    }  
  });
  }


  /**
   * Filter change
   */
   valueChange(){
    this.getAllMoodOptions();
   }


   /**
    * Seacrh text field chane
    */
    @Debounce(500)
    searchChange(){
      this.getAllMoodOptions();
    }


   /**
    * Edit config
    */
   editConfig(configData){
    const modal = this.modalService.showComponent(CreateConfigComponent,{
      sections: this.allSections,
      formData: configData
    });
    modal.beforeClosed().subscribe((responseData: any) => {
      if (responseData){
        this.allSections= [];   
        this.configListing= {}
        this.getAllMoodOptions();  
      }  
    });
   }

   /**
    * Delete config
    */
    deleteConfig(configData){
      this.modalService.showConfirmation("Delete", "Are you sure you want to delete this config?").afterClosed().subscribe(result => {
        if (result) {
          this.api.delete('config/' + configData.ID).subscribe(
            (result: any) => {
              this.configListing = {};
              this.modalService.showAlert('Success', 'Config has been deleted');
              this.getAllMoodOptions();
            },
            (error: any) => {
              this.modalService.showAlert('Error', 'Something went wrong. Please try again.');
            }
          );
        }
      });
    }

}
