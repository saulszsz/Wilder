import { Component, OnInit } from '@angular/core';
import { Globals } from './../../services/globals';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  speakValidation: Globals;
  audio: any;
  iteracion: any;
  frase: any;
  constructor(globals: Globals) { 
    if ('speechSynthesis' in window) {
      this.audio = window.speechSynthesis;
      this.iteracion = new SpeechSynthesisUtterance('NewUtterance');
    } else {
      console.log('Tu lector no soporta lector de voz');
    }
    this.speakValidation = globals;
    console.log(this.speakValidation);
  }

  ngOnInit(): void {
  }

  startSpeak2(id:string, id1: string, id2: string, id3: string, id4: string) {
  

    this.frase = document.getElementById(id).innerHTML +". " + document.getElementById(id1).innerHTML +". " + document.getElementById(id2).innerHTML +". " + document.getElementById(id3).innerHTML +". " + document.getElementById(id4).innerHTML;
    this.iteracion.text = this.frase;
    if (this.audio.paused) {
      this.audio.resume();
    } else {
      this.audio.cancel();
      this.audio.speak(this.iteracion);
    }
  }

  pauseSpeak() {
    this.audio.pause();
  }

}
