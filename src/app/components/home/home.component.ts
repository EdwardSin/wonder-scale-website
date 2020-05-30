import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  keyword: string = '';
  constructor(private router: Router) { 
    DocumentHelper.setWindowTitle('Wonder Scale');
  }

  ngOnInit(): void {
  }

  navigationSearch() {
    this.router.navigate(['search'], {queryParams: {keyword: this.keyword}});
  }

}
