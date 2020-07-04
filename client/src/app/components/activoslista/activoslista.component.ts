import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FireService } from '../../services/fire.service';

import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-activoslista',
  templateUrl: './activoslista.component.html',
  styleUrls: ['./activoslista.component.css']
})
export class ActivoslistaComponent implements OnInit {
  bandera:boolean;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  uid = this._fs._afAuth.authState.pipe(
    map(authState => {
      if (!authState) {
        return '';
      } else {
        return authState.uid;
      }
    })
  );
  user: any = this.uid.pipe(
    switchMap(uid => {
      if (!uid) {
        this._router.navigate(['/']);
      } else {
        return this._fs._fireDb.object('users/' + uid).valueChanges();
      }
    }),
  );

  constructor(
    private _fs: FireService,
    private _router: Router,
    private spinnerService: NgxSpinnerService
  ) { }

  activos = [];

  ngOnInit() {
    this.bandera=true;
    this.spinner();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this._fs.getActivos().subscribe(
      (result) => {
        if (result) {
          var array = [];
          for (let i in result) {
            array.push(result[i]);
            array[array.length - 1]['id'] = i;
          }
        }
        array.forEach((dato) => {
          this.activos.push(dato);
          this.bandera=false;
        });
        this.spinner();
      },
      (error) => {
        return [];
      }
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  spinner(): void{
    if(this.bandera){
      this.spinnerService.show();
    }else if(!this.bandera){
      this.spinnerService.hide();
    }
  }

}