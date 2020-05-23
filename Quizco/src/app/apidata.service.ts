import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApidataService {

  constructor(private httpClient: HttpClient) { }

  public getCategories() {
    return this.httpClient.get("https://opentdb.com/api_category.php");
  }

  public getQuestions(amount: number, categoryId: number, difficulty: String, type: String) {
    let url = "https://opentdb.com/api.php?amount=" + amount
    // Checking if user set category
    url += categoryId != -1 ? "&category=" + categoryId : ""

    // Checking if user set difficulty
    url += difficulty != "any" ? "&difficulty=" + difficulty : ""

    // Checking if user set type
    url += type != "any" ? "&type=" + type : ""

    return this.httpClient.get(url);
  }

  public getImage() {
    return this.httpClient.get("https://random.dog/woof.json");
  }
}