import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor() { }

  public errorHandling = (control: string, error: string, form) => {
    return form.controls[control].hasError(error);
  }
}
