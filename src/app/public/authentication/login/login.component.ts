import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AppSharedService } from "../../../app.shared-service";
import { routerTransition } from "../../../_animations/transition";
import { UsersService } from "../../../private/users/users.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  animations: [routerTransition],
  host: { "[@routerTransition]": "" }
})
export class LoginComponent implements OnInit {
  public UX = {
    MOBILE: {
      isWritting: false
    }
  };

  public error = "0";
  private returnUrl: string;
  public credentials;
  public logo;

  constructor(
    private authService: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private sharedService: AppSharedService,
    private userService: UsersService
  ) {
    this.credentials = {};
  }

  ngOnInit() {
    let isLogged = this.authService.isLoggedIn();
    if (isLogged) {
      this.router.navigate(["/projects/choose"]);
    }

    //  Dinamically setting logo
    this.sharedService.currentLogo.subscribe(logo => (this.logo = logo));
    this.returnUrl =
      this.activeRoute.snapshot.queryParams["returnUrl"] || "/projects/choose";
  }

  public login() {

    this.authService.login(this.credentials).subscribe(
      res => {
        this.error = "0";
        this.router.navigate([this.returnUrl]);
      },
      err => {
        this.error = "1";
        console.log(err);
      }
    );
  }
}
