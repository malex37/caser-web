type DbMap = {
  M: Record<string, DbMap | any>
}

export type FolderDbType = {
  allowed_users: {
    L: { S: string }[]
  },
  county: {
    S: string
  },
  caseType: {
    S: string
  },
  client: {
    S: string
  },
  judge: {
    S: string
  },
  tasks: {
    L: { S: string }[]
  },
  id: {
    S: string
  },
  name: {
    S: string
  },
  attachments: DbMap
}

export interface Folder {
  county: string;
  allowed_users: string[];
  name: string;
  id: string;
  tasks: any;
  judge: string;
  client: string;
  caseType: string;
  attachments: Record<string, any>,
}

function SLtoSA(L: { S: string }[]) {
  return L.map(element => element.S);
}

function DbMapToNormalMap(obj: DbMap) {
  let map: Record<any, any> = {};
  const mainObj = obj.M || {};
  Object.keys(mainObj).map(key => {
    if (mainObj[key].M) {
      map[key] = DbMapToNormalMap(obj.M[key]);
      return;
    }
    if (mainObj[key].S) {
      map[key] = mainObj[key].S;
      return;
    }
    map[key] = mainObj[key];
  });
  return map;
}

export function reshapeDbFolder(folder: FolderDbType): Folder {
  return {
    county: folder.county.S,
    allowed_users: SLtoSA(folder.allowed_users.L),
    name: folder.name.S,
    id: folder.id.S,
    tasks: folder.tasks.L,
    judge: folder.judge.S,
    client: folder.client.S,
    caseType: folder.caseType.S,
    attachments: DbMapToNormalMap(folder.attachments),
  }
}

export const FolderDbSchema = {
  id: 'id',
  name: 'name',
  client: 'client',
  judge: 'judge',
  county: 'county',
  caseType: 'caseType',
  allowed_users: 'allowed_users',
  tasks: 'tasks',
  attachments: 'attachments'
}

type StringItem = { // AttributeValue Union: only one key present
  S: string
}

type NumberItem = {
  N: string
}
type BufferItem = {
  B: Uint8Array // e.g. Buffer.from("") or new TextEncoder().encode("")
}

type StringList = {
  SS: string[]
}

type NumberList = {
  NS: string[],
}

type BinaryListItem = {
  BS: Uint8Array[],
}

type GeneralList = {
  L: StringItem[] | NumberItem[] | BufferItem[] | Uint8Array[]
}

type NullItem = {
  NULL: boolean,
}

type BooleanItem = {
  BOOL: boolean
}
interface ItemTypeMap {
  S: StringItem,
  N: NumberItem,
  B: BufferItem,
  SS: StringList,
  NS: NumberList,
  BS: BinaryListItem,
  L: GeneralList,
  NULL: NullItem,
  BOOL: BooleanItem
}

const ItemTypeKeys = {
  S: "S",
  N: "N",
  B: "B",
  SS: "SS",
  NS: "NS",
  BS: "BS",
  L: "L",
  NULL: "NULL",
  BOOL: "BOOL"
}
type MapItem = {
  [Key in keyof typeof ItemTypeKeys]: ItemTypeMap[Key];
}

const ItemTypeKeyString: { [K: string]: any } = {
  S: "StringItem",
  N: "NumberItem",
  B: "BufferItem",
  SS: "StringList",
  NS: "NumberList",
  BS: "BinaryListItem",
  L: "GeneralList",
  NULL: "NullItem",
  BOOL: "BooleanItem"
}

// export function flattenDbItem(item: any) {
//   // Find type of item to transform
//   Object.keys(item).map (key => {
//     // returned items should have only 1 key per item (talking about lowest value until list types)
//     const itemAtKeyRoot = Object.keys(item[key])[0];
//     // itemAtKeyRoot should be jeyof ItemTypeMap
//     const itemKeyStringRep = ItemTypeKeyString[itemAtKeyRoot];
//     if (!itemKeyStringRep) {
//       throw new Error('Unknown item  DB type');
//     }
//     const itemValue = item[key][itemAtKeyRoot];
//     if (!itemValue) {
//       throw new Error('Error in mapping item value');
//     }
//     // now we have the value of the Key for an item of a table
//     const castedKey = itemAtKeyRoot as keyof ItemTypeMap;
//     const castedValue = item[key][itemAtKeyRoot] as typeof ItemTypeMap[castedKey]
//   });
// }
