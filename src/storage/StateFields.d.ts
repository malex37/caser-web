export declare const StorageStateFields: {
    readonly Tasks: "Tasks";
    readonly Boards: "Boards";
    readonly AssignedTasks: "AssignedTasks";
    readonly User: "User";
    readonly Team: "Team";
};
export type StorageStateField = keyof typeof StorageStateFields;
