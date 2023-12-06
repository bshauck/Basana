import { fetchData } from "./csrf"

import { CREATED_PROJECT, DELETED_PROJECT } from "./common";

const GOT_ALL_PROJECTS = "projects/GOT_ALL_PROJECTS";
const GOT_USER_PROJECTS = "projects/GOT_USER_PROJECTS";
const GOT_PROJECT = "projects/GOT_PROJECT";
const UPDATED_PROJECT = "projects/UPDATED_PROJECT";


const gotAllProjects = projects => ({
    type: GOT_ALL_PROJECTS,
    projects
});

const gotUserProjects = projects => ({
    type: GOT_USER_PROJECTS,
    projects
  })

const gotProject = project => ({
    type: GOT_PROJECT,
    project
});

const createdProject = project => ({
    type: CREATED_PROJECT,
    project
});

const updatedProject = project => ({
    type: UPDATED_PROJECT,
    project
});

const deletedProject = (id, userId) => ({
    type: DELETED_PROJECT,
    id,
    userId
});

// THUNKS
export const thunkGetAllProjects = () => async dispatch => {
    const url = `/api/projects`
    let answer = await fetchData(url)
    if (!answer.errors) {
        answer = answer.projects
        dispatch(gotAllProjects(answer))
    }
    return answer
}

export const thunkGetUserProjects = userId => async dispatch => {
  const url = `/api/users/${userId}/projects`;
  let answer = await fetchData(url);
  if (!answer.errors) {
    dispatch(gotUserProjects(answer.projects));
  }
}

export const thunkGetProject = id => async dispatch => {
    const url = `/api/projects/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotProject(answer))
    return answer
}

export const thunkCreateProject = (id, project) => async dispatch => {
    console.log("CREATING project; wsId/project", id, project)
    const url = `/api/workspaces/${id}/projects/new`
    const answer = await fetchData(url, {
      method: 'POST',
      body: JSON.stringify(project)
    });
    console.log("CREATING project; errprs?", answer.errors)
    if (!answer.errors) dispatch(createdProject(answer));
    console.log("CREATING project; answer", answer)
    return answer;
};

export const thunkUpdateProject = (id, data) => async dispatch => {
    const url = `/api/projects/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedProject(answer))
    return answer
}

export const thunkDeleteProject = id => async (dispatch, getState) => {
    console.log("DELETING project", id)
    const url = `/api/projects/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    console.log("AFTER DELETING project: errors?", answer.errors)
    if (!answer.errors) dispatch(deletedProject(id, getState().session.user.id))
    return answer
}


const initialState = {};
const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_PROJECTS: {
      const normalized = {};
      action.projects.forEach(a => normalized[a.id] = a);
      return normalized;
    }
    case GOT_USER_PROJECTS: {
      const normalized = {};
      action.projects.forEach(a => normalized[a.id] = {...a});
      return { ...state, ...normalized };
    }
    case GOT_PROJECT: // eslint-disable-next-line no-fallthrough
    case CREATED_PROJECT: // eslint-disable-next-line no-fallthrough
    case UPDATED_PROJECT:
      console.log("PR created PR: ws/userId", action.project, action.project.ownerId)
      return { ...state, [action.project.id]: {...action.project} };
    case DELETED_PROJECT:
      const newState = { ...state };
      delete newState[action.id];
      return newState;
     default:
      return state;
  }
};

export default projectReducer;
