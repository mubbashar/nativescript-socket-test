import {Router} from "@angular/router";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {User} from "../../shared/user/user";
import {UserService} from "../../shared/user/user.service";
import {Page} from "ui/page";
import {Color} from "color";
import {View} from "ui/core/view";
import {setHintColor} from "../../utils/hint-util";
import {TextField} from "ui/text-field";
//import {SocketIO} from 'nativescript-socketio';
import {Config} from "../../shared/config";
import geolocation = require("nativescript-geolocation");


@Component({
    selector: "my-app",
    providers: [UserService],
    templateUrl: "pages/login/login.html",
    styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit {

    private user:User;
    private isLoggingIn:boolean = true;
    private isLoading:boolean = false;
    private watchId:any = {};
    private lastlocation:any = {};

    //server = 'http://localhost:3001'; //using genymotion
    //socketIO;

    @ViewChild("container") container:ElementRef;
    @ViewChild("email") email:ElementRef;
    @ViewChild("password") password:ElementRef;

    constructor(private router:Router, private userService:UserService, private page:Page) {
        this.user = new User();
        this.user.email = "user@nativescript.org";
        this.user.password = "password";
        this.isLoading = false;
        this.enableLocationTap()

        //this.login();

        //this.socketIO = new SocketIO(Config.socketUrl, {});
        //this.socketIO.on('login', function (data) {
        //    console.log("Login: ", data);
        //})
        //this.socketIO.connect();

    }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.page.backgroundImage = "res://bg_login";
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
        this.setTextFieldColors();

        let container = <View>this.container.nativeElement;
        container.animate({
            backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
            duration: 200
        });
    }

    setTextFieldColors() {
        let emailTextField = <TextField>this.email.nativeElement;
        let passwordTextField = <TextField>this.password.nativeElement;

        let mainTextColor = new Color(this.isLoggingIn ? "black" : "#C4AFB4");
        emailTextField.color = mainTextColor;
        passwordTextField.color = mainTextColor;

        let hintColor = new Color(this.isLoggingIn ? "#ACA6A7" : "#C4AFB4");
        setHintColor({view: emailTextField, color: hintColor});
        setHintColor({view: passwordTextField, color: hintColor});
    }

    login() {

        if (!this.user.isValidEmail()) {
            alert("Enter a valid email address.");
            return;
        }
        this.isLoading = true;
        this.userService.login(this.user)
            .subscribe(
                () => {
                    this.isLoading = false;
                    this.router.navigate(["/list"])
                },
                (error) => alert("Unfortunately we could not find your account.")
            );
    }

    submit() {
        this.userService.register(this.user)
            .subscribe(
                () => {
                    alert("Your account was successfully created.");
                    this.toggleDisplay();
                },
                () => alert("Unfortunately we were unable to create your account.")
            );
    }

    enableLocationTap() {
        if (!geolocation.isEnabled()) {
            geolocation.enableLocationRequest();
        } else {
            this.startGetLocation();
        }
    }

    startGetLocation() {
        this.watchId = geolocation.watchLocation(
            function (loc) {
                if (loc) {
                    console.log("Received location: " + loc);
                    if (this.lastlocation) {
                        console.log("Distance between loc1 and loc2 is: " + geolocation.distance(this.lastlocation, loc));
                    }
                    this.lastlocation = loc;
                }
            },
            function (e) {
                console.log("Error: " + e.message);
            },
            {desiredAccuracy: 3, updateDistance: 10, minimumUpdateTime: 1000 * 5}); // Should update every 20 seconds according to Googe documentation. Not verified.
    }

    getLocationDistance(loc1, loc2) {
        console.log("Distance between loc1 and loc2 is: " + geolocation.distance(loc1, loc2));
    }

    stopGettingLocation() {
        if (this.watchId) {
            geolocation.clearWatch(this.watchId);
        }
    }


}