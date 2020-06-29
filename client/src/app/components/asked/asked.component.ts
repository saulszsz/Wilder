import { Globals } from './../../services/globals';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asked',
  templateUrl: './asked.component.html',
  styleUrls: ['./asked.component.css']
})
export class AskedComponent implements OnInit {
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

  startSpeak(id: string) {
    console.log(id);
    this.frase = document.getElementById(id).innerHTML;
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
