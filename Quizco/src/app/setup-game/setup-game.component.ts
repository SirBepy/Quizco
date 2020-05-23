import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setup-game',
  templateUrl: './setup-game.component.html',
  styleUrls: ['./setup-game.component.scss'],
})
export class SetupGameComponent implements OnInit {
  categiryId: number
  difficulty: String = "any"
  type: String = "any"
  amount: number = 10

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.categiryId = params.categoryId)
  }

  ngOnInit() { }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if(charCode > 36 && charCode < 41) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    
    if(charCode == 8 && (this.amount + "").length == 1) {
      console.log(charCode)
      this.amount = 1
      return false;
    }

    let amount = this.amount + event.key

    if(amount > 50) {
      this.amount = 50
      return false;
    } else if(amount < 1) {
      this.amount = 1
      return false;
    }
    return true
  }
}
