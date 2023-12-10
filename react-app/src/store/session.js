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

export const gotProject = project => ({
	type: GOT_CURRENT_PROJECT,
	project
})

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
	console.log("login", email, password)
	console.log("jsony: ", JSON.stringify({email, password}))

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

export const signUp = formData => async dispatch => {
	// formData is FormData; pass along with no headers
	// formData = Object.fromEntries(formData.entries())
	// console.log("signup formData out of form", formData)
	// formData = JSON.stringify(formData)
	// console.log("signup formData json", formData)
	// console.log("signup TYPEOF formData", typeof formData)
	// else console.log("profile picture type", typeof formData.get("profilePicture"), formData.get("profilePicture"))
	// const answer = await fetchData("/api/auth/signup", {
	// 	method: "POST",
	// 	isEvilFormData: true,
	// 	body: formData })
	// console.log("signup answer", answer)
	// console.log("signup answer.errors", answer.errors)
	// if (!answer.errors) dispatch(setUserWithWorkspace(answer))
	// return answer


	const headers = {};
	const body = formData;
	let res;
	// if (formData.profilePicture)
	// 	headers["Content-Type"] = "multipart/form-data"
	const bodyClasses = document.body.classList;
	bodyClasses.add("waiting");
	try {
	const res = await fetch("/api/auth/signup", {
		method: "POST",
		headers,
		body
	});

	if (res.ok) {
		const data = await res.json();
		dispatch(setUser(data));
		return data;
	} else if (res.status < 600) {
		const data = await res.json();
		if (data.errors) {
			return data;
		} else return {errors: {system: data}}
	}
} catch (error) {
    console.error(error);
    error.status = error.status || 500;
    if (error.errors) error.errors.fetch = "Failed to Fetch"
    else error.errors = {"fetch": "Failed to Fetch"}
    res = error;
  }
  finally {
    bodyClasses.remove("waiting");
  }
  return res;
}

const initialState = { user: null, workspace: null, project: null}
export default function reducer(state = initialState, action) {
	switch (action.type) {
	case GOT_CURRENT_WORKSPACE:
		console.log("SETTING got WS", action.workspace)
		if (!action.workspace || action.workspace === state.workspace) return state
		// if (!action.workspace || action.workspace?.id === state.workspace?.id) return state
		return { ...state, workspace: action.workspace, project: null }
	case REMOVE_CURRENT_WORKSPACE:
		return { ...state, workspace: null }
	case GOT_CURRENT_PROJECT:
		if (!action.project || action.project === state.project) return state
		return { ...state, project: action.project }
	case REMOVE_CURRENT_PROJECT:
		return { ...state, project: null }
	case SET_USER: {
		console.log("Session SET_USER user ws:", action.user, action.workspace	)
		if (!action.user) return initialState
		if (state.user?.id === action.user.id) return state
		const workspace = action.workspace || state.workspace
		return { ...state, user: action.user, workspace}
	}
	case REMOVE_USER:
		return initialState
	case CREATED_WORKSPACE:
		console.log("Session created WS ws/userId", action.workspace, action.workspace.ownerId)
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
			projects: user.projects.filter(wId => wId !== action.id)} }
	}
	default:
		return state
	}
}
