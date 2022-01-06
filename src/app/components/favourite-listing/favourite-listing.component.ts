import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/lib/api.service';
import { LogService } from 'app/lib/log.service';
import { ModalService } from 'app/lib/modal.service';

@Component({
  selector: 'app-favourite-listing',
  templateUrl: './favourite-listing.component.html',
  styleUrls: ['./favourite-listing.component.scss']
})
export class FavouriteListingComponent implements OnInit {
  isloaded = false;
  favouriteList :any = [];
  constructor(private api: ApiService,
    private log: LogService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.getMyFavourites();
    
  }

  /**
   * Get my favourite list
   */
  getMyFavourites(){
    this.isloaded = true;
    this.api.get('myfavorites').subscribe(
      (result: any) => {
        this.isloaded = false;
        this.favouriteList = result;
     },
      (error: any) => {
        this.isloaded = false;
        this.log.error('Error getting favourite List. ' + error.message);
      },
      () => {
        this.isloaded = false;
    });
   }


   /**
	 * Set Favourite
	 */
	 setFavourite(favourite){
    this.modalService.showConfirmation("Delete", "Are you sure you want to delete this favourite item?").afterClosed().subscribe(result => {
			if (result) {
        this.api.post('favorite/' + favourite.ContentID,{type: 'course',status : 0}).subscribe(
          (result: any) => {
            this.getMyFavourites();
          },
          (error: any) => {
            this.log.error('Error getting favourite List. ' + error.message);
          }
        );
			}
		});
	 }

}
