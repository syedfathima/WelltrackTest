
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { UtilityService } from './utility.service';
import { LogService } from './log.service';
import { Observable } from 'rxjs/Rx';
import { HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

function InvalidTokenError(message) {
    this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

export interface paramsLoginSso {
    client_id: string,
    code_challenge_method: string,
    response_type: string,
    redirect_uri: string,
    scope: string,
    code_challenge: string,
    response_mode: string,
}

@Injectable()
export class SsoService {
    constructor(
        private storage: StorageService,
        private api: ApiService,
        private log: LogService,
        private utilityService: UtilityService
    ) {

    }

    generateCodeVerifier() {
        const code_verifier = this.generateRandomString(128);
        this.storage.set('code_verifier', code_verifier);
        return code_verifier;
    }

    generateRandomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    generateCodeChallenge(code_verifier) {
        const code_challenge = this.base64URL(CryptoJS.SHA256(code_verifier));
        this.storage.set('code_challenge', code_challenge);
        return code_challenge;
    }

    generateSecureHash() {
        const code_secret = CryptoJS.SHA256(this.generateRandomString(128))
        this.storage.set('code_secret', code_secret);
        return code_secret;
    }

    base64URL(string) {
        return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    }

    getCodeChallenge() {
        return this.storage.get('code_challenge');
    }

    getCodeVerifier() {
        return this.storage.get('code_verifier');
    }

    b64DecodeUnicode(str) {
        return decodeURIComponent(
            atob(str).replace(/(.)/g, function (m, p) {
                var code = p.charCodeAt(0).toString(16).toUpperCase();
                if (code.length < 2) {
                    code = '0' + code;
                }
                return '%' + code;
            })
        );
    }

    base64UrlDecode(str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }

        try {
            return this.b64DecodeUnicode(output);
        } catch (err) {
            return atob(output);
        }
    }

    jwtDecode(token, options) {
        if (typeof token !== 'string') {
            throw new InvalidTokenError('Invalid token specified');
        }

        options = options || {};
        var pos = options.header === true ? 0 : 1;
        try {
            return JSON.parse(this.base64UrlDecode(token.split('.')[pos]));
        } catch (e) {
            throw new InvalidTokenError('Invalid token specified: ' + e.message);
        }
    }


    createLoginLink(url: string, params: any) {
        //add inteface. type issues when passing to http params

        const codeVerifier = this.generateCodeVerifier();
        const challenge = this.generateCodeChallenge(codeVerifier);
        params.code_verifier = codeVerifier;
        params.code_challenge = challenge;
        //params.redirect_uri = encodeURIComponent(params.redirect_uri);
        const queryParamsString = new HttpParams({ fromObject: params }).toString();
        return url + '?' + queryParamsString;
    }

    getAccessTokenWT(endpointUrl: string, redirectUrl: string, clientId: string, code: string): Observable<{}> {
        return this.api.authenticateOauth2AuthFlow(endpointUrl, clientId, code, redirectUrl, this.getCodeVerifier() as string);
    }

    getAccessToken(endpointUrl: string, redirect_uri: string, clientId: string, code: string): Observable<{}> {

        var formData = new FormData();
        formData.append('code', code);
        formData.append('redirect_uri', redirect_uri);
        formData.append('grant_type', 'authorization_code');
        formData.append('client_id', clientId);
        formData.append(
            'code_verifier',
            this.getCodeVerifier() as string
        )

        return Observable.create(observer => {
            fetch(endpointUrl, {
                method: 'POST',
                body: formData,
            }).then((res) => { return res.json() })
                .then(body => {
                    observer.next(body);
                    /*Complete the Observable as it won't produce any more event */
                    observer.complete();
                })
                //Handle error
                .catch(err => observer.error(err));
        });
    }




}





