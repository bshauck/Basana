import { fetchData } from "./csrf"

const GOT_ALL_WORKSPACES = "workspaces/GOT_ALL_WORKSPACES";
const GOT_USER_WORKSPACES = "workspaces/GOT_USER_WORKSPACES";
const GOT_WORKSPACE = "workspaces/GOT_WORKSPACE";
const CREATED_WORKSPACE = "workspaces/CREATED_WORKSPACE";
const UPDATED_WORKSPACE = "workspaces/UPDATED_WORKSPACE";
const DELETED_WORKSPACE = "workspaces/DELETED_WORKSPACE";

export const gotAllWorkspaces = workspaces => ({
    type: GOT_ALL_WORKSPACES,
    workspaces
});


export const getUserWorkspaces = workspaces => ({
    type: GOT_USER_WORKSPACES,
    workspaces
  })


export const gotWorkspace = workspace => ({
    type: GOT_WORKSPACE,
    workspace
});

export const createdWorkspace = workspace => ({
    type: CREATED_WORKSPACE,
    workspace
});

export const updatedWorkspace = workspace => ({
    type: UPDATED_WORKSPACE,
    workspace
});

export const deletedWorkspace = id => ({
    type: DELETED_WORKSPACE,
    id
});

// THUNKS
export const thunkGetAllWorkspaces = () => async dispatch => {
    const url = `/api/workspaces/`
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
    dispatch(getUserWorkspaces(answer.workspaces));
  }
}

export const thunkGetWorkspace = id => async dispatch => {
    const url = `/api/workspaces/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotWorkspace(answer))
    return answer
}

export const thunkCreateWorkspace = (id, workspace) => async dispatch => {
    const url = `/api/workspaces/new`
    const answer = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(workspace),
    });
    if (!answer.errors) dispatch(createdWorkspace(answer));
  return answer;
};

export const thunkUpdateWorkspace = (data, id) => async dispatch => {
    const url = `/api/workspaces/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedWorkspace(answer))
    return answer
}

export const thunkDeleteWorkspace = (id, songIds) => async dispatch => {
    const url = `/api/workspaces/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    if (!answer.errors) dispatch(deletedWorkspace(id, songIds))
    return answer
}

const initialState = {};
const workspaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_WORKSPACES: {
      const normalized = {};
      action.workspaces.forEach(a => normalized[a.id] = a);
      return normalized;
    }
    case GOT_USER_WORKSPACES: {
      const normalized = {};
      action.workspaces.forEach(a => normalized[a.id] = a);
      return { ...state, ...normalized };
    }
    case GOT_WORKSPACE: // eslint-disable-next-line no-fallthrough
    case CREATED_WORKSPACE: // eslint-disable-next-line no-fallthrough
    case UPDATED_WORKSPACE:
      return { ...state, [action.workspace.id]: action.workspace };
    case DELETED_WORKSPACE:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
     default:
      return state;
  }
};

export default workspaceReducer;
