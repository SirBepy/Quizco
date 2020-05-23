import { Component, OnInit, Input } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  @Input() dark
  @Input() username = ""
  show = false;

  constructor(public toastController: ToastController) { }

  ngOnInit() {
    this.username = localStorage.getItem("username")
    if (localStorage.getItem("theme")) {
      this.dark = localStorage.getItem("theme") == "dark";
    } else {
      this.dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }

  toggleTheme() {
    document.body.classList.toggle('darktheme', this.dark);
    localStorage.setItem("theme", this.dark ? "dark" : "light")
  }

  async updateUsername() {
    localStorage.setItem("username", this.username)
    const toast = await this.toastController.create({
      message: 'Username sucsessfully updated!',
      position: 'top',
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
    this.show = false;
  }

  checkUsername() {
    if (localStorage.getItem("username") == this.username) {
      this.show = false;
    } else {
      this.show = true;
    }
  }
}