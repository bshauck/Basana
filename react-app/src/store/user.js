import { fetchData } from "./csrf"

import { CREATED_PROJECT, DELETED_PROJECT, CREATED_WORKSPACE, DELETED_WORKSPACE, SET_USER } from "./common";

const GOT_ALL_USERS = "users/GOT_ALL_USERS"
const GOT_USER = "users/GOT_USER"
const CREATED_USER = "users/CREATED_USER"
const UPDATED_USER = "users/UPDATED_USER"
const DELETED_USER = "users/DELETED_USER"

export const gotAllUsers = users => ({
    type: GOT_ALL_USERS,
    users
})

export const gotUser = user => ({
    type: GOT_USER,
    user
})

export const createdUser = user => ({
    type: CREATED_USER,
    user
})

export const updatedUser = user => ({
    type: UPDATED_USER,
    user
})

export const deletedUser = id => ({
    type: DELETED_USER,
    id
})

// THUNKS
export const thunkGetAllUsers = () => async dispatch => {
    const url = `/api/users`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotAllUsers(answer.users))
    return answer
}

export const thunkGetUser = id => async dispatch => {
    const url = `/api/users/${id}`
    const answer = await fetchData(url)
    if (!answer.errors) dispatch(gotUser(answer))
    return answer
}

export const thunkCreateUser = (id, user) => async dispatch => {
    const url = `/api/users/new`
    const answer = await fetchData(url, {
      method: 'POST',
      body: JSON.stringify(user),
    })
    if (!answer.errors) dispatch(createdUser(answer))
  return answer
}

export const thunkUpdateUser = (id, data) => async dispatch => {
    const url = `/api/users/${id}`
    const answer = await fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
    if (!answer.errors) dispatch(updatedUser(answer))
    return answer
}

export const thunkDeleteUser = (id, songIds) => async dispatch => {
    const url = `/api/users/${id}`
    const answer = await fetchData(url, { method: 'DELETE' })
    if (!answer.errors) dispatch(deletedUser(id, songIds))
    return answer
}

const initialState = {};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_ALL_USERS: {
      const normalized = {}
      action.users.forEach(user => normalized[user.id] = user)
      return normalized
    }
    case GOT_USER: // eslint-disable-next-line no-fallthrough
    case CREATED_USER: // eslint-disable-next-line no-fallthrough
    case SET_USER: // eslint-disable-next-line no-fallthrough
      if (!action.user || action.user.id === state.user?.id) return state
    case UPDATED_USER:
      return { ...state, [action.user.id]: action.user }
    case DELETED_USER:
      const newState = { ...state }
      delete newState[action.id]
      return newState
    case CREATED_WORKSPACE:
      console.log("USER created WS ws/userId", action.workspace, action.workspace.ownerId)
      const user = state[action.workspace.ownerId]
      console.log("USER lookup gives: ", user)
      if (!user) return state
      return { ...state,
        [action.workspace.ownerId]:
          {...user,
            workspaces: [...user.workspaces, action.workspace.id]} }
    case DELETED_WORKSPACE: {
      const user = state[action.userId]
      if (!user || !user.workspaces?.includes(action.id)) return state
      return { ...state,
        [user.id]:
          {...user,
            workspaces: user.workspaces.filter(wId => wId !== action.id)} }
    }
    case CREATED_PROJECT:
      console.log("Session created PR: pr/userId", action.project, action.project.ownerId)
      if (!state.user || state.user.id !== action.project.ownerId) return state
      return { ...state,
        user: {...state.user,
          projects: [...state.user.projects, action.project.id]} }
    case DELETED_PROJECT: {
      const user = state.user
      if (!user || user.id !== action.userId ||
        !user.projects.includes(action.id)) return state
      return { ...state,
        user: {...state.user,
          projects: user.projects.filter(pId => pId !== action.id)} }
    }
    default:
      return state
  }
};

export default userReducer
