import { fetchData } from "./csrf"

import { CREATED_PROJECT, CREATED_WORKSPACE, DELETED_PROJECT, DELETED_WORKSPACE } from "./common";
const GOT_ALL_WORKSPACES = "workspaces/GOT_ALL_WORKSPACES";
const GOT_USER_WORKSPACES = "workspaces/GOT_USER_WORKSPACES";
const GOT_WORKSPACE = "workspaces/GOT_WORKSPACE";
const UPDATED_WORKSPACE = "workspaces/UPDATED_WORKSPACE";

const gotAllWorkspaces = workspaces => ({
    type: GOT_ALL_WORKSPACES,
    workspaces
});

const gotUserWorkspaces = workspaces => ({
    type: GOT_USER_WORKSPACES,
    workspaces
})

const gotWorkspace = workspace => ({
    type: GOT_WORKSPACE,
    workspace
});

const createdWorkspace = workspace => ({
    type: CREATED_WORKSPACE,
    workspace
});

const updatedWorkspace = workspace => ({
    type: UPDATED_WORKSPACE,
    workspace
});

const deletedWorkspace = (id, userId) => ({
    type: DELETED_WORKSPACE,
    id,
    userId
});


// SELECTORS
export const getWSInternalSections = team => state => {
  let iProjectId = team.internalProjects[0]
  let iSections = Object.values(state.sections).filter(s => !s.projectId)
  let sections = iSections.filter(s => s.internalProjectId === iProjectId)
  sections.sort((a,b) => b.id - a.id)
  return sections
}

export const getWSAssignedTasks = team => state => {
  let taskIds = team.tasks
  let wsTasks = taskIds.map(id => state.tasks[id])
  let tasks = wsTasks.filter(t => t.assignee === state.session.user.id)
  return tasks
}

// THUNKS
export const thunkGetAllWorkspaces = () => async dispatch => {
    const url = `/api/workspaces`
    let answer = await fetchData(url)
    if (!answer.errors) {
        answer = answer.workspaces
        dispatch(gotAllWorkspaces(answer))
    }
    return answer
}

export const thunkGetUserWorkspaces = userId => async dispatch => {
  const url = `/api/users/${userId}/workspaces`;
  let answer = await fetchData(url);
  if (!answer.errors) {
    dispatch(gotUserWorkspaces(answer.workspaces));
  }
}


export const thunkGetWorkspace = id => async dispatch => {
    const url = `/api/workspaces/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) {
      dispatch(gotWorkspace(answer))
    }
    return answer
}

export const thunkCreateWorkspace = workspace => async dispatch => {
    const url = `/api/workspaces/new`
    const answer = await fetchData(url, {
      method: 'POST',
      body: JSON.stringify(workspace),
    });

    if (!answer.errors) dispatch(createdWorkspace(answer));
  return answer;
};

export const thunkUpdateWorkspace = (id, data) => async dispatch => {
    const url = `/api/workspaces/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedWorkspace(answer))
    return answer
}

export const thunkDeleteWorkspace = id => async (dispatch,getState) => {
    const url = `/api/workspaces/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    if (!answer.errors) dispatch(deletedWorkspace(id, getState().workspaces[id].ownerId))
    return answer
}

const initialState = {};
const workspaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_WORKSPACES: {
      const normalized = {};
      action.workspaces.forEach(w => normalized[w.id] = {...w});
      return normalized;
    }
    case GOT_USER_WORKSPACES: {
      const normalized = {};
      action.workspaces.forEach(w => normalized[w.id] = {...w});
      return { ...state, ...normalized };
    }
    case GOT_WORKSPACE: // eslint-disable-next-line no-fallthrough
    case CREATED_WORKSPACE: // eslint-disable-next-line no-fallthrough
      if (state[action.workspace.id]) return state; // eslint-disable-next-line no-fallthrough
    case UPDATED_WORKSPACE:
      // console.log("WS updated WS: ws/userId", action.workspace, action.workspace.ownerId)
      return { ...state, [action.workspace.id]: {...action.workspace} };
    case DELETED_WORKSPACE:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    case CREATED_PROJECT:{
      const ws = state[action?.project?.workspaceId]
      if (!ws) return state
      return { ...state,
        [ws.id]: {...ws,
          projects: [...ws.projects, action.project.id]} }
    }
    case DELETED_PROJECT: {
      const ws = state[action?.workspaceId]
      if (!ws) return state
      return { ...state,
        [ws.id]: {...ws,
          projects: ws.projects.filter(pId => pId !== action.id)} }
    }
    default:
      return state;
  }
};

export default workspaceReducer;
