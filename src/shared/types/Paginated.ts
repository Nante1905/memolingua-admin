export class Paginated<T> {
  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.totalItem = total;
    this.page = page;
    this.totalPage = Math.ceil(total / limit);
    this.itemPerPage = limit;
  }

  items: T[];
  totalItem: number;
  page: number;
  totalPage: number;
  itemPerPage: number;
}
