export interface TodoItem {
    _id: string,
    todo_item_name: string,
    todo_item_index: number,
    todo_item_description: string,
    todo_item_status: boolean,
    todo_item_status_string: TodoItemStatusString,
    todo_item_user_id: string,
}

export enum TodoItemStatusString {
    Todo = 'Todo',
    Inprogress = 'Inprogress',
    Done = 'Done'
}