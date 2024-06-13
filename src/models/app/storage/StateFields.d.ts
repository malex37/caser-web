export declare const StorageStateFields: {
    readonly Tasks: "Tasks";
    readonly Boards: "Boards";
    readonly AssignedTasks: "AssignedTasks";
    readonly User: "User";
    readonly Team: "Team";
    readonly TaskMap: "TaskMap";
    readonly RelationshipMap: "RelationshipMap";
};
export type StorageStateField = keyof typeof StorageStateFields;
