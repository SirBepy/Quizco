import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApidataService } from '../apidata.service';
import { LoadingController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  // Variables to print out
  questions: Array<Question> = new Array<Question>()
  index: number = 1
  score: number = 0
  msg: String = ""
  username: String

  // Variables to be used as parameters for getting data from api
  categoryId: number
  difficulty: String
  type: String
  amount: number

  // Variables to manipulate the DOM
  selectedBtn
  lockedIn: boolean = false
  imgURL: String

  constructor(private route: ActivatedRoute, private apidata: ApidataService, public loadingController: LoadingController, private nativeAudio: NativeAudio) {
    this.route.params.subscribe(params => {
      this.categoryId = params.categoryId ? params.categoryId : -1
      this.difficulty = params.difficulty ? params.difficulty : "any"
      if (this.difficulty != "any" && this.difficulty != "easy" && this.difficulty != "medium" && this.difficulty != "hard")
        this.difficulty = "any"
      this.type = params.type ? params.type : "any"
      if (this.type != "any" && this.type != "multiple" && this.type != "boolean")
        this.type = "any"
      this.amount = params.amount ? params.amount : 10
      if (!(this.amount >= 1 && this.amount <= 50))
        this.amount = 10

    })
    this.nativeAudio.preloadSimple('success', 'assets/win.mp3').then(() => console.log("Success"), (elem) => console.log("Fail...", elem));
    this.nativeAudio.preloadSimple('fail', 'https://www.myinstants.com/media/sounds/roblox-death-sound_1.mp3').then(() => console.log("Success"), (elem) => console.log("Fail...", elem));
  }


  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading questions...',
    });
    loading.present();

    this.apidata.getQuestions(this.amount, this.categoryId, this.difficulty, this.type).subscribe((data) => {
      let id = 0
      data["results"].forEach(obj => {
        let choices = obj.incorrect_answers
        choices.push(obj.correct_answer)
        this.questions.push(new Question(obj.category, obj.difficulty, this.convert(obj.question), this.convert(obj.correct_answer), this.shuffle(this.convertArr(choices)), ++id))
      });
      loading.dismiss();
      if (this.questions.length == 0) {
        alert("There were no questions with your parameters.")
      }
    });
    this.getNewImgURL()
    this.username = localStorage.getItem("username")
  }

  getNewImgURL() {
    this.apidata.getImage().subscribe((data) => {
      this.imgURL = data["url"]
      if (this.imgURL.slice(-3) != "jpg") {
        this.getNewImgURL()
      }
    })
  }


  // Not taking credit for this, i know its easy but i just wanted an easy array shuffler
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  choiceSelected(elem) {
    if (this.lockedIn)
      return
    if (this.selectedBtn)
      this.selectedBtn.color = "primary"
    this.selectedBtn = elem.target
    this.selectedBtn.color = "warning"
    document.getElementById("lockinbtn").style.display = "inline-block"
  }

  convertArr(arr: Array<String>) {
    let toReturn = []
    arr.forEach(element => {
      toReturn.push(this.convert(element))
    });
    return toReturn
  }

  // In JSON I get encoded characters, i want to decode those, so im using this method for that
  convert(str: String) {
    str = str.replace(/&Ouml;/g, "Ö");
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/&#039;/g, "\'");
    str = str.replace(/&deg;/g, "°");
    str = str.replace(/&sup2;/g, "²");
    str = str.replace(/&sup3;/g, "³");
    str = str.replace(/&lrm;/g, ""); // Not sure what &lrm is
    return str;
  }

  lockIn() {
    this.lockedIn = true
    if (this.selectedBtn.innerText.toLowerCase() == this.questions[this.index - 1].correctAnswer.toLowerCase()) {
      this.score++
      this.selectedBtn.color = "success"
      this.nativeAudio.play('success').then(() => console.log("Success"), (elem) => console.log("Fail...", elem));
    } else {
      document.getElementById("correct" + this.index).parentElement.setAttribute("color", "success")
      this.selectedBtn.color = "danger"
      this.nativeAudio.play('fail').then(() => console.log("Success"), (elem) => console.log("Fail...", elem));
    }
    document.getElementById("lockinbtn").style.display = "none"
    document.getElementById("nextbtn").style.display = "inline-block"
  }

  nextQuestion() {
    this.lockedIn = false
    document.getElementById("nextbtn").style.display = "none"

    this.index++
    this.selectedBtn = null
    if (this.index > this.questions.length) {
      let percent = this.score * 100 / this.questions.length
      this.msg = percent == 100 ? "Wow youre a natural " + this.username + "! That was amazing!" : percent >= 90 ? "Wow, almost perfect " + this.username + "!" : percent >= 80 ? "Pretty good " + this.username + "!" : percent >= 70 ? "That was okay " + this.username + "..." : percent >= 50 ? "Oh... " + this.username + "... Kind of okay I guess?" : percent >= 40 ? "Oh " + this.username + " no... no... don't cry..." : percent >= 20 ? "Hmmm... okay " + this.username + " lets see how much you can get by trying." : percent == 0 ? "Wow, you made it " + this.username + ", you actaully got 0" : "Eh..."
    }
  }
}

// Simple dataclass
export class Question {
  id: number
  question: String
  category: String
  difficulty: String
  correctAnswer: String
  choices: [String]

  constructor(category: String, difficulty: String, question: String, correctAnswer: String, choices: [String], id: number) {
    this.id = id
    this.category = category
    this.difficulty = difficulty
    this.question = question
    this.correctAnswer = correctAnswer
    this.choices = choices
  }
}