import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LogService } from '../lib/log.service';
import { StorageService } from '../lib/storage.service';
import { ModalService } from '../lib/modal.service';
import { UserService } from '../lib/user.service';
import { User } from '../models/user';
import { TranslateService } from '@ngx-translate/core';

const MINUTES_UNTIL_AUTO_LOGOUT = 15 // in mins
const CHECK_INTERVAL = 1000 * 60 // in ms
const STORE_KEY = 'lastAction';

@Injectable()
export class AutoLogoutService {
    strText: any;
    intervalId: any;
    user: User;

    constructor(
        private auth: AuthService,
        private router: Router,
        private log: LogService,
        private storage: StorageService,
        private modalService: ModalService,
        private userService: UserService,
        private translate: TranslateService
    ) {
        this.storage.set('modalOpen', false);
        this.user = this.userService.getUser();

        //listen for data changes
        this.userService.watcher.subscribe((user: User) => {
            this.user = user;
        });

    }

    initialize() {
        if (this.user && this.user.userType !== 'admin') {
            this.reset();
            this.initListener();
            this.initInterval();
            this.check();

            this.log.debug("Auto-logout.ts Initialized");
        }
    }

    action() {
        return <any>this.storage.get('lastAction');
    }

    initListener() {
        document.body.addEventListener('click', () => this.reset());
        document.body.addEventListener('mousemove', () => this.reset());
        document.body.addEventListener('mouseout', () => this.reset());
        document.body.addEventListener('mouseover', () => this.reset());
    }

    reset() {
        if (this.auth.isAuthenticated()) {
            this.storage.set(STORE_KEY, Date.now());
            this.storage.set('isAuthenticated', true, false, 10);
        }
        else {
            document.body.removeEventListener('click', () => this.reset());
            document.body.removeEventListener('mousemove', () => this.reset());
            document.body.removeEventListener('mouseout', () => this.reset());
            document.body.removeEventListener('mouseover', () => this.reset());
        }
    }

    initInterval() {
        this.intervalId = setInterval(() => {
            if (!this.auth.isAuthenticated()) {
                clearInterval(this.intervalId);
            }
            this.check();
        }, CHECK_INTERVAL);
    }

    check() {
        let now = Date.now();
        let timeAction = this.action();
        let timeleft = this.action() + MINUTES_UNTIL_AUTO_LOGOUT * 60 * 1000;

        let diff = timeleft - now;
        if (60 * 1000 >= diff && diff > 0) {
            let confirmResult;
            if (!this.storage.get('modalOpen') && this.auth.isAuthenticated()) {
                this.storage.set('modalOpen', true);
                this.translate.stream('idle').subscribe((res: any) => {
                    this.strText = res;
                    this.modalService.setCloseonClick(false);
                    this.modalService.showAlert(this.strText.message, this.strText.yes).afterClosed().subscribe(result => {
                        if (result) {
                            /*
                            * Time stands still when browser tab not active in some browsers. 
                            * need to check different between time now and last record time just in case time has 
                            * expired since posting modal
                            */
                            let now = Date.now();
                            let timeleft = this.action() + MINUTES_UNTIL_AUTO_LOGOUT * 60 * 1000;

                            if (confirmResult) {
                                if (diff < 0 && this.auth.isAuthenticated()) {
                                    this.log.debug('Auto logout logout called if');
                                    this.auth.logout();
                                    this.router.navigate(['/']);
                                    //window.location.reload(); 
                                }
                                else {
                                    this.reset()
                                    this.storage.set('modalOpen', false);
                                }

                            }
                        }
                    });

                });
            }
            else if (diff < 0 && this.auth.isAuthenticated()) {
                this.log.debug('Auto-logout');
                this.auth.logout();
                this.router.navigate(['/']);
            }
        }
    }
}