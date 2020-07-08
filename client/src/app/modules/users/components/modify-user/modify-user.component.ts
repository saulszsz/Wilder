import { FireService } from './../../../../services/fire.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {
  bandera: boolean;
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
    private spinnerService: NgxSpinnerService,
    private _snack: MatSnackBar,
    public dialog: MatDialog
  ) { }

  usuarios = [];

  ngOnInit() {
    this.bandera = true;
    //this.spinner();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    var that = this;
    this.user.subscribe(
      (user: any) => {
        this._fs.getUsuarios(user['trabajo']).subscribe(
          (result) => {
            if (result) {
              var array = [];
              for (let i in result) {
                result[i]['uid'] = i;
                array.push(result[i]);
              }
            }
            array.forEach((dato) => {
              this.usuarios.push(dato);
            });
            /*
            this.bandera = false;
            this.spinner();*/
          },
          (error) => {
            return [];
          }
        );
      },
      (error) => {
        this._snack.open("Error! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
        that.usuarios = [];
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  spinner(): void {
    if (this.bandera) {
      this.spinnerService.show();
    } else if (!this.bandera) {
      this.spinnerService.hide();
    }
  }

}
