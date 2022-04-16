import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[app-Placeholder]'
})
export class PlaceholderDirective {

    constructor(
        public viewContainerRef: ViewContainerRef
    ) {}

}