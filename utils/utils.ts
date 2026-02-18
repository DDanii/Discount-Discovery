import type { Filter } from "./types/Filter";

export const pageSize = 10; //todo

export function createFilterList(query: Filter): (boolean | null)[] {
  const filterList = [];
  if (query.liked) filterList.push(true);
  if (query.disliked) filterList.push(false);
  if (query.neutral) filterList.push(null);
  return filterList;
}

export function pageSlice(pageSize: number, pageNum: number): number[] {
  return [
    pageSize * pageNum,
    pageSize * pageNum + pageSize
  ]
}

export function deepCopy(data: any): any {
  return JSON.parse(JSON.stringify(data))
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