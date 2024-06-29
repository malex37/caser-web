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
  }
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
}

function SLtoSA(L: { S: string }[]) {
  return L.map(element => element.S);
}

export function reshapeDbFolder(folder: FolderDbType): Folder {
  console.log(`Reshaping ${JSON.stringify(folder, null, 2)}`);
  return {
    county: folder.county.S,
    allowed_users: SLtoSA(folder.allowed_users.L),
    name: folder.name.S,
    id: folder.id.S,
    tasks: folder.tasks.L,
    judge: folder.judge.S,
    client: folder.client.S,
    caseType: folder.caseType.S,
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
}

