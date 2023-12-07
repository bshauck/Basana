import { fetchData } from "./csrf"

const GOT_ALL_I_PROJECTS = "i_projects/GOT_ALL_I_PROJECTS";
const GOT_USER_I_PROJECTS = "i_projects/GOT_USER_I_PROJECTS";
const GOT_I_PROJECT = "i_projects/GOT_I_PROJECT";
const UPDATED_I_PROJECT = "i_projects/UPDATED_I_PROJECT";
const CREATED_I_PROJECT = "i_projects/CREATED_I_PROJECTS";
const DELETED_I_PROJECT = "i_projects/DELETED_I_PROJECTS";


const gotAllI_Projects = i_projects => ({
    type: GOT_ALL_I_PROJECTS,
    i_projects
});

const gotUserI_Projects = i_projects => ({
    type: GOT_USER_I_PROJECTS,
    i_projects
})

const gotI_Project = i_project => ({
    type: GOT_I_PROJECT,
    i_project
});

const createdI_Project = i_project => ({
    type: CREATED_I_PROJECT,
    i_project
});

const updatedI_Project = i_project => ({
    type: UPDATED_I_PROJECT,
    i_project
});

const deletedI_Project = (id, userId) => ({
    type: DELETED_I_PROJECT,
    id,
    userId
});

// THUNKS
export const thunkGetInternalInfo = (wsId, uId) => async (dispatch, getState) => {
    // not implemented; notion of getting info for My tasks
    // main window for the list of section-task tables

    // const url = `/api/workspaces/${wsId}/i_projects/${uId}`
    // const answer = await fetchData(url)
    // if (!answer.errors) dispatch(gotI_Project(answer))
    // return answer
    const state = getState()
    // if (state !== getState()) return state
}


export const thunkGetAllI_Projects = () => async dispatch => {
    const url = `/api/i_projects`
    let answer = await fetchData(url)
    if (!answer.errors) {
        answer = answer.i_projects
        dispatch(gotAllI_Projects(answer))
    }
    return answer
}

export const thunkGetUserI_Projects = userId => async dispatch => {
  const url = `/api/users/${userId}/i_projects`;
  let answer = await fetchData(url);
  if (!answer.errors) {
    dispatch(gotUserI_Projects(answer.i_projects));
  }
}

export const thunkGetI_Project = id => async dispatch => {
    const url = `/api/i_projects/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotI_Project(answer))
    return answer
}

export const thunkCreateI_Project = (id, i_project) => async dispatch => {
    const url = `/api/workspaces/${id}/i_projects/new`
    const answer = await fetchData(url, {
      method: 'POST',
      body: JSON.stringify(i_project)
    });
    if (!answer.errors) dispatch(createdI_Project(answer));
    return answer;
};

export const thunkUpdateI_Project = (id, data) => async dispatch => {
    const url = `/api/i_projects/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedI_Project(answer))
    return answer
}

export const thunkDeleteI_Project = id => async (dispatch, getState) => {
    const url = `/api/i_projects/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    if (!answer.errors) dispatch(deletedI_Project(id, getState().session.user.id))
    return answer
}


const initialState = {};
const i_projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_I_PROJECTS: {
      const normalized = {};
      action.i_projects.forEach(a => normalized[a.id] = a);
      return normalized;
    }
    case GOT_USER_I_PROJECTS: {
      const normalized = {};
      action.i_projects.forEach(a => normalized[a.id] = {...a});
      return { ...state, ...normalized };
    }
    case GOT_I_PROJECT: // eslint-disable-next-line no-fallthrough
    case CREATED_I_PROJECT: // eslint-disable-next-line no-fallthrough
    case UPDATED_I_PROJECT:
      return { ...state, [action.i_project.id]: {...action.i_project} };
    case DELETED_I_PROJECT:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
     default:
      return state;
  }
};

export default i_projectReducer;
