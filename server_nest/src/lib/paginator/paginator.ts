import { Injectable } from '@nestjs/common';
import { PageData } from './dto/page-data.dto';

@Injectable()
export class Paginator {
  private pageSize: number;

  constructor(pageSize: number) {
    this.pageSize = pageSize;
  }

  paginate<T>(items: T[], offset: number, endpoint: string) {
    const pageData = new PageData();
    const itemCount = items.length;
    pageData.count = items.length;
    pageData.next = this.getNextUrl(offset, itemCount, endpoint);
    pageData.previous = this.getPreviousUrl(offset, endpoint);
    pageData.first = this.getFirstUrl(endpoint);
    pageData.last = this.getLastUrl(itemCount, endpoint);
    pageData.results = this.getResults(items, offset);
    pageData.pages = Math.ceil(itemCount / this.pageSize);
    return pageData;
  }

  private getResults<T>(items: T[], offset: number) {
    const results = items.slice(offset, offset + this.pageSize);
    return results;
  }

  private getFirstUrl(endpoint: string) {
    return `${endpoint}?offset=0`;
  }

  private getLastUrl(itemCount: number, endpoint: string) {
    const lastOffset = Math.floor(itemCount / this.pageSize) * this.pageSize;
    return `${endpoint}?offset=${lastOffset}`;
  }

  private getPreviousUrl(offset: number, endpoint: string) {
    return offset - this.pageSize >= 0
      ? `${endpoint}?offset=${offset - this.pageSize}`
      : null;
  }
  private getNextUrl(offset: number, itemCount: number, endpoint: string) {
    const nextOffset = offset + this.pageSize;
    return nextOffset < itemCount ? `${endpoint}?offset=${nextOffset}` : null;
  }
}
