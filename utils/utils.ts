import type { EventHandlerRequest } from "h3";
import type { ListQuery } from "./types/ListQuery";
import type H3Event from 'h3'

export const pageSize = 10; //todo

export function createFilterList(query: ListQuery): (boolean | null)[] {
    const filterList = [];
    if (query?.liked as unknown === "true") filterList.push(true);
    if (query?.disliked as unknown === "true") filterList.push(false);
    if (query?.neutral as unknown === "true") filterList.push(null);
    return filterList;
}

export function pageSlice(pageSize: number, pageNum: number): number[] {
    return [
        pageSize * pageNum,
        pageSize * pageNum + pageSize
    ]
}

export function listVariables(event: H3Event.H3Event<EventHandlerRequest>): [number, (boolean|null)[]] {
    const query = getQuery(event) as unknown as ListQuery;
    const pageNum = parseInt(query?.page as unknown as string) || 0;
    const filterList = createFilterList(query);
    
    return [pageNum, filterList]
}

declare global {
  interface Array<T> {
    first(): T | undefined;
  }
}

Object.defineProperty(Array.prototype, 'first', {
  value: function (this: any[]) {
    return this[0];
  },
  enumerable: false,
  configurable: true,
  writable: true
});