import { fetchData } from "./csrf"

import { CREATED_PROJECT, DELETED_PROJECT, CREATED_WORKSPACE, DELETED_WORKSPACE, SET_USER } from "./common";

const REMOVE_USER = "session/REMOVE_USER"
const GOT_CURRENT_WORKSPACE = "session/GOT_CURRENT_WORKSPACE"
const REMOVE_CURRENT_WORKSPACE = "session/REMOVE_CURRENT_WORKSPACE"
const GOT_CURRENT_PROJECT = "session/GOT_CURRENT_PROJECT"
const REMOVE_CURRENT_PROJECT = "session/REMOVE_CURRENT_PROJECT"

export const gotWorkspace = workspace => ({
	type: GOT_CURRENT_WORKSPACE,
	workspace
})

export const removeWorkspace = () => ({
	type: REMOVE_CURRENT_WORKSPACE
})

export const gotProject = project => {
	let retVal = {
		type: GOT_CURRENT_PROJECT,
		project
	}
	return retVal
}

export const removeProject = () => ({
	type: REMOVE_CURRENT_PROJECT
})

const setUser = (user, workspace) => ({
	type: SET_USER,
	user,
	workspace
})

const removeUser = () => ({
	type: REMOVE_USER
})

export const authenticate = () => async (dispatch) => {
	const answer = await fetchData("/api/auth")
	if (!answer.errors) {
		dispatch(setUser(answer))
	}
	return answer
}

export const login = (email, password) => async (dispatch) => {


	const answer = await fetchData("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({email, password})})
	if (!answer.errors) {
		dispatch(setUser(answer))
	}
	return answer
}

export const logout = () => async dispatch => {
	const answer = await fetchData("/api/auth/logout")
	if (!answer.errors) dispatch(removeUser())
}

export const signUp = body => async dispatch => {
	// formData is FormData; pass along with no headers
	// formData = Object.fromEntries(formData.entries())
	// console.log("signup formData out of form", formData)
	// formData = JSON.stringify(formData)
	// console.log("signup formData json", formData)
	// console.log("signup TYPEOF formData", typeof formData)
	// else console.log("profile picture type", typeof formData.get("profilePicture"), formData.get("profilePicture"))
	body = JSON.stringify(body)
	const answer = await fetchData("/api/auth/signup", {
		method: "POST",
		body })

	if (!answer.errors) dispatch(setUser(answer))
	return answer
}

const initialState = { user: null, workspace: null, project: null}
export default function reducer(state = initialState, action) {
	switch (action.type) {
	case GOT_CURRENT_WORKSPACE:
		if (state.workspace && (!action.workspace || action.workspace.id === state.workspace.id)) return state
		return { ...state, workspace: action.workspace, project: null }
	case REMOVE_CURRENT_WORKSPACE:
		return { ...state, workspace: null, project: null }
	case GOT_CURRENT_PROJECT:
		if (state.project && (!action.project || action.project.id === state.project.id)) return state
		return { ...state, project: action.project }
	case REMOVE_CURRENT_PROJECT:
		return { ...state, project: null }
	case SET_USER: {
		if (!action.user) return initialState
		if (state.user?.id === action.user.id) return state
		const workspace = action.workspace || state.workspace
		return { ...state, user: action.user, workspace}
	}
	case REMOVE_USER:
		return initialState
	case CREATED_WORKSPACE:
		if (!state.user || state.user.id !== action.workspace.ownerId) return state
		return { ...state,
		  user: {...state.user,
				workspaces: [...state.user.workspaces, action.workspace.id]} }
	case DELETED_WORKSPACE: {
		const user = state.user
		if (!user || user.id !== action.userId ||
			!user.workspaces.includes(action.id)) return state
		return { ...state,
			user: {...state.user,
			workspaces: user.workspaces.filter(wId => wId !== action.id)} }
	}
	case CREATED_PROJECT:
		if (!state.user || !state.user?.id || state.user.id !== action.project.ownerId) return state
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
}
