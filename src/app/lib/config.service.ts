import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    config: any;
    request: Request; 
    constructor(private http: HttpClient) { }


    public load() {
        return new Promise((resolve, reject) => {

           const request = this.http.get('./assets/config.json');

            if (request) {
                request
                    .catch((error: any) => {
                        resolve(error);
                        return Observable.throw(error.json().error || 'Server error');
                    })
                    .subscribe((responseData) => {
                        this.config = responseData;
                        resolve(true);
                    });
            } else {
                console.error('Environment config file is not loadable');
                resolve(true);
            }
        });
    }

    loadConfigAlternate() {

        return this.http
            .get<any>('./assets/config.json')
            .toPromise()
            .then(config => {
                this.config = config;
            });
    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {
        return this.config[key];
    }

    /*
    * Get base api url
    */
    public apiBaseUrl() {

        if (!this.config) {
            this.error();
        }

        return this.config.apiBaseUrl;
    }

    /*
    * Get api client
    */
    public apiClientId() {

        if (!this.config) {
            this.error();
        }

        return this.config.apiClientId;
    }

    /*
    * Get api secret
    */
    public apiClientSecret() {

        if (!this.config) {
            this.error();
        }

        return this.config.apiClientSecret;
    }

    public demoActive(){

        if (!this.config) {
            this.error();
        }

        if(typeof this.config.demoActive === "string"){
            return (/true/i).test(this.config.demoActive);
        }

        return this.config.demoActive;
    }

    public isProd(){
        if (!this.config) {
            this.error();
        }

        if(typeof this.config.prod === "string"){
            return (/true/i).test(this.config.prod);
        }

        return this.config.prod;
    }

    error() {
        throw Error('Config file not loaded!');
    }
}