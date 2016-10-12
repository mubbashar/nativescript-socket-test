import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";

import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";
//import {BackgroundFetch} from "nativescript-background-fetch";
//import geolocation = require("nativescript-geolocation");


@Component({
    selector: "list",
    templateUrl: "pages/list/list.html",
    styleUrls: ["pages/list/list-common.css", "pages/list/list.css"],
    providers: [GroceryListService]
})
export class ListComponent implements OnInit {
    groceryList:Array<Grocery> = [];
    //private _fetchManager:BackgroundFetch;


    constructor(private groceryListService:GroceryListService) {

        // this._fetchManager = new BackgroundFetch();
        // this._fetchManager.configure({
        //     stopOnTerminate: false
        // }, function () {
        //     console.log("[js] BackgroundFetch event received");
        //     //
        //     // Do stuff.  You have 30s of background-time.
        //     //
        //     // When your job is complete, you must signal completion or iOS can kill your app.
        //     this._fetchManager.finish();
        // }.bind(this), function (error) {
        //     console.log('BackgroundFetch not supported by your OS');
        // });
    }

    ngOnInit() {
        this.groceryListService.load()
            .subscribe(loadedGroceries => {
                loadedGroceries.forEach((groceryObject) => {
                    this.groceryList.unshift(groceryObject);
                });
            });
    }
}