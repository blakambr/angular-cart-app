import { Component, OnInit } from '@angular/core'

import { DataService } from '../core/services/data.service'
import { IItem, IPagedResults } from '../shared/interfaces'
import { FilterService } from '../core/services/filter.service'

@Component({
  moduleId: module.id,
  selector: 'cm-items',
  templateUrl: 'items.component.html'
})
export class ItemsComponent implements OnInit {

  title: string
  filterText: string
  items: IItem[] = []
  filteredItems: IItem[] = []
  displayMode: DisplayModeEnum
  displayModeEnum = DisplayModeEnum
  totalRecords: number = 0
  pageSize: number = 10

  constructor(private dataService: DataService, private filterService: FilterService) { }

  ngOnInit() {
    this.title = 'Items'
    this.filterText = 'Filter Items:'
    this.displayMode = DisplayModeEnum.Card

    this.getItemsPage(1)
  }

  changeDisplayMode(mode: DisplayModeEnum) {
      this.displayMode = mode
  }

  pageChanged(page: number) {
    this.getItemsPage(page)
  }

  getItemsPage(page: number) {
    this.dataService.getItemsPage((page - 1) * this.pageSize, this.pageSize)
        .subscribe((response: IPagedResults<IItem[]>) => {
          this.items = this.filteredItems = response.results
          this.totalRecords = response.totalRecords
        },
        (err: any) => console.log(err),
        () => console.log('getItemsPage() retrieved items for page: ' + page))
  }

  filterChanged(data: string) {
    if (data && this.items) {
        data = data.toUpperCase()
        const props = ['name', 'description', 'stock', 'price']
        this.filteredItems = this.filterService.filter<IItem>(this.items, data, props)
    } else {
      this.filteredItems = this.items
    }
  }
}

enum DisplayModeEnum {
  Card = 0
}
