import { fetchData } from "./csrf"

const GOT_ALL_TASKS = "tasks/GOT_ALL_TASKS";
const GOT_USER_TASKS = "tasks/GOT_USER_TASKS";
const GOT_MY_TASKS = "tasks/GOT_MY_TASKS";
const GOT_TASK = "tasks/GOT_TASK";
const CREATED_TASK = "tasks/CREATED_TASK";
const UPDATED_TASK = "tasks/UPDATED_TASK";
const DELETED_TASK = "tasks/DELETED_TASK";


const gotAllTasks = tasks => ({
    type: GOT_ALL_TASKS,
    tasks
});

const gotUserTasks = tasks => ({
    type: GOT_USER_TASKS,
    tasks
  })

const gotUserWorkspaceTasks = tasks => ({
    type: GOT_MY_TASKS,
    tasks
  })


const gotTask = task => ({
    type: GOT_TASK,
    task
});

const createdTask = task => ({
    type: CREATED_TASK,
    task
});

const updatedTask = task => ({
    type: UPDATED_TASK,
    task
});

const deletedTask = id => ({
    type: DELETED_TASK,
    id
});

// THUNKS
export const thunkGetAllTasks = () => async dispatch => {
    const url = `/api/tasks`
    let answer = await fetchData(url)
    if (!answer.errors) {
        answer = answer.tasks
        dispatch(gotAllTasks(answer))
    } else console.error(answer.errors)
    return answer
}

export const thunkGetUserTasks = userId => async dispatch => {
  const url = `/api/users/${userId}/tasks`;
  let answer = await fetchData(url);
  if (!answer.errors) {
    answer = answer.tasks
    dispatch(gotUserTasks(answer));
  }
  return answer
}

export const thunkGetUserWorkspaceTasks = workspaceId => async dispatch => {
  const url = `/api/workspaces/${workspaceId}/myTasks`;
  let answer = await fetchData(url);
  if (!answer.errors) {
    answer = answer.tasks
    dispatch(gotUserWorkspaceTasks(answer));
  }
  return answer
}


export const thunkGetTask = id => async dispatch => {
    const url = `/api/tasks/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotTask(answer))
    return answer
}

export const thunkCreateTask = (id, task) => async dispatch => {
    const url = `/api/tasks/new`
    const answer = await fetchData(url, {
      method: 'POST',
      body: JSON.stringify(task),
    });
    if (!answer.errors) dispatch(createdTask(answer));
  return answer;
};

export const thunkUpdateTask = (id, data) => async dispatch => {
    const url = `/api/tasks/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedTask(answer))
    return answer
}

export const thunkDeleteTask = (id, staskIds) => async dispatch => {
    const url = `/api/tasks/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    if (!answer.errors) dispatch(deletedTask(id, staskIds))
    return answer
}


const initialState = {};
const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_TASKS: {
      const normalized = {};
      action.tasks.forEach(t => normalized[t.id] = t);
      return normalized;
    }
    case GOT_MY_TASKS: // eslint-disable-next-line no-fallthrough
    case GOT_USER_TASKS: {
      const normalized = {};
      action.tasks.forEach(t => normalized[t.id] = t);
      return { ...state, ...normalized };
    }
    case GOT_TASK: // eslint-disable-next-line no-fallthrough
    case CREATED_TASK: // eslint-disable-next-line no-fallthrough
    case UPDATED_TASK:
      return { ...state, [action.task.id]: action.task };
    case DELETED_TASK:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
     default:
      return state;
  }
};

export default taskReducer;
