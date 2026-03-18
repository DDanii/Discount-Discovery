import type { DatabaseDoc } from "./types/databaseTypes";
import type { Filter } from "./types/Filter";
import type { GenericPreference, Preference } from "./types/preference";

export const pageSize = 10; //todo

export function createFilterList(query: Filter): (boolean | null)[] {
  const filterList = [];
  if (query.liked) filterList.push(true);
  if (query.disliked) filterList.push(false);
  if (query.neutral) filterList.push(null);
  return filterList;
}

export function creataInvertedFilterList(query: Filter): (boolean | null)[] {
  const filterList = [];
  if (!query.liked) filterList.push(true);
  if (!query.disliked) filterList.push(false);
  if (!query.neutral) filterList.push(null);
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

export function prefMapper<T extends DatabaseDoc>(docs: T[], preferences: Preference[]): (T & GenericPreference)[] {
  const iterator = preferences[Symbol.iterator]()
  let current = iterator.next().value

  return docs.map(mapPref)
  
  function mapPref<T extends DatabaseDoc>(doc: T): T & GenericPreference {
    let result = { ...doc, preference: null } as T & GenericPreference
    if (!current || current._id > doc._id) return result;
    if (current._id == doc._id) {
      result.preference = current.value
      return result
    }

    current = iterator.next().value
    return mapPref(doc)
  }
}
