import { Component, OnInit, ChangeDetectorRef, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() pageSize = 30;
  @Input() pageNo = 1;
  @Input() scrollto = '#paginated';
  @Input() totalNo: number;
  @Output() getPageNumber = new EventEmitter();
  pager: any = {};

  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private ref: ChangeDetectorRef) { }
  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['totalNo'] && !!this.totalNo) {
      this.setPage(this.pageNo);
      this.pager.currentPage = this.pageNo;
    }
  }
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 20) {
    // calculate total pages

    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  setPage(page: number) {
    // if (page < 1 || page > this.pager.totalPages) {
    //   return;
    // }
    // get pager object from service
    this.pager = this.getPager(this.totalNo, page, this.pageSize);

    // get current page of items
    //this.displayItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.getPageNumber.emit(page);
  }
}
