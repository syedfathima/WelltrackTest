import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[autoFocus]'
})
export class AutofocusDirective implements AfterContentInit {

    @Input() public autoFocus: boolean;
    @Input('autoFocus') options: any;

    public constructor(
        private el: ElementRef
    ) {

    }

    public ngAfterContentInit() {
        /*
        * directive should still be applied without arguments provided
        * this provides the opportunity for the developer to make it conditional
        */

        if (this.options.apply === true ||!this.options) {
            setTimeout(() => {
                this.el.nativeElement.focus();
            }, 500);
        }

    }
}