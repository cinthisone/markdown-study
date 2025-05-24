import { get, set } from "idb-keyval";

const TASK_STATE_KEY = "task-state";

interface TaskState {
  [taskId: string]: boolean;
}

export const getTaskState = async (): Promise<TaskState> => {
  const state = await get<TaskState>(TASK_STATE_KEY);
  return state || {};
};

export const updateTaskState = async (taskId: string, checked: boolean): Promise<void> => {
  const state = await getTaskState();
  state[taskId] = checked;
  await set(TASK_STATE_KEY, state);
}; 