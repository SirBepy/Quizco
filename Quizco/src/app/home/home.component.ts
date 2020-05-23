import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  username = ""

  constructor() { }

  ngOnInit() {
    if(!localStorage.getItem("username")) {
      localStorage.setItem("username", "User")
    }
    this.username = localStorage.getItem("username")
  }

}
