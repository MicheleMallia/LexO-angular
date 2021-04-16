export interface LexicalEntryRequest {
  text: string,
  searchMode: searchModeEnum,
  type: typeEnum,
  pos: string,
  formType: formTypeEnum | string,
  author: string,
  lang: string,
  status: string,
  offset: number,
  limit: number
}

export enum searchModeEnum {
  equals = "equals",
  startWith = "startWith",
  contains = "contains",
  endsWith = "endsWith"
}

export enum typeEnum {
  word = "word",
  multi = "multi-word expression",
  affix = "affix"
}

export enum formTypeEnum {
  flexed = "flexed",
  entry = "entry"
}