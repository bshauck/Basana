import { fetchData } from "./csrf"

const GOT_ALL_PROJECTS = "projects/GOT_ALL_PROJECTS";
const GOT_USER_PROJECTS = "projects/GOT_USER_PROJECTS";
const GOT_PROJECT = "projects/GOT_PROJECT";
const CREATED_PROJECT = "projects/CREATED_PROJECT";
const UPDATED_PROJECT = "projects/UPDATED_PROJECT";
const DELETED_PROJECT = "projects/DELETED_PROJECT";

export const gotAllProjects = projects => ({
    type: GOT_ALL_PROJECTS,
    projects
});


export const getUserProjects = projects => ({
    type: GOT_USER_PROJECTS,
    projects
  })


export const gotProject = project => ({
    type: GOT_PROJECT,
    project
});

export const createdProject = project => ({
    type: CREATED_PROJECT,
    project
});

export const updatedProject = project => ({
    type: UPDATED_PROJECT,
    project
});

export const deletedProject = id => ({
    type: DELETED_PROJECT,
    id
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
    dispatch(getUserProjects(answer.projects));
  }
}

export const thunkGetProject = id => async dispatch => {
    const url = `/api/projects/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotProject(answer))
    return answer
}

export const thunkCreateProject = (id, project) => async dispatch => {
    const url = `/api/workspace/${id}/projects/new`
    const answer = await fetchData(url, {
      method: 'POST',
      body: JSON.stringify(project),
    });
    if (!answer.errors) dispatch(createdProject(answer));
  return answer;
};

export const thunkUpdateProject = (id, data) => async dispatch => {

    const url = `/api/projects/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedProject(answer))
    return answer
}

export const thunkDeleteProject = (id, songIds) => async dispatch => {
    console.log("DELETING project", id)
    const url = `/api/projects/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    console.log("AFTER DELETING project: errors?", answer.errors)
    if (!answer.errors) dispatch(deletedProject(id, songIds))
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
