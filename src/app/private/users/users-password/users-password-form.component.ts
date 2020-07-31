import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-password',
  templateUrl: './users-password-form.component.html',
  styleUrls: ['./users-password-form.component.css']
})
export class UsersPasswordComponent implements OnInit {
  constructor(private userService: UsersService) {}

  ngOnInit() {

  }
}