import { Component } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent {

    collapsed:boolean = true;

    constructor(
        private dataStorageService: DataStorageService
    ){}

    toggleNavbarCollapsed() {
        this.collapsed = !this.collapsed;
    }

    onSaveData(){
        this.dataStorageService.storeRecipes();
    }

}