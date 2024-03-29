import { fetchData } from "./csrf"

import { CREATED_PROJECT, DELETED_PROJECT } from "./common";

const GOT_ALL_PROJECTS = "projects/GOT_ALL_PROJECTS";
const GOT_USER_PROJECTS = "projects/GOT_USER_PROJECTS";
const GOT_WORKSPACE_PROJECTS = "workspaces/GOT_WORKSPACE_PROJECTS";
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


const gotWorkspaceProjects = projects => ({
  type: GOT_WORKSPACE_PROJECTS,
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



// SELECTORS
export const getProjectSectionTasks = project => state => {
  let sectionIds = project.sections
  let sections = sectionIds.map(id => state.sections[id])
  sections.sort((a,b) => b.index - a.index)
  // for (const section of sections)
  //   section.tasks = section.tasks.map(tId => state.tasks[tId])
  return sections
}


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

export const thunkGetWorkspaceProjects = id => async dispatch => {
  const url = `/api/workspaces/${id}/projects`
  const answer = await fetchData(url)
  if (!answer.errors) dispatch(gotWorkspaceProjects(answer))
  return answer
}

export const thunkGetProject = id => async dispatch => {
    const url = `/api/projects/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotProject(answer))
    return answer
}

export const thunkCreateProject = (id, project) => async dispatch => {
    const url = `/api/workspaces/${id}/projects/new`
    const answer = await fetchData(url, {
      method: 'POST',
      body: JSON.stringify(project)
    });
    if (!answer.errors) dispatch(createdProject(answer));
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
    const url = `/api/projects/${id}`
    const answer = await fetchData(url, { method: 'DELETE' });
    if (!answer.errors) {
      const delProj=getState().projects[id]
      dispatch(deletedProject(id, delProj.ownerId, delProj.workspaceId))
    }
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
    case GOT_USER_PROJECTS: // eslint-disable-next-line
    case GOT_WORKSPACE_PROJECTS: {
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
