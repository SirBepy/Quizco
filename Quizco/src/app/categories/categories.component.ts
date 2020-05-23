import { Component, OnInit } from '@angular/core';
import { ApidataService } from '../apidata.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  loading: boolean = true
  categories = []

  constructor(private apidata: ApidataService, public loadingController: LoadingController) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading categories...',
    });
    loading.present();

    this.apidata.getCategories().subscribe((data) => {
      loading.dismiss();

      this.loading = false;
      this.categories = data["trivia_categories"]
      this.categories.unshift({ id: -1, name: "All categories" })
      console.log(this.categories[0].id);
    });
  }

}