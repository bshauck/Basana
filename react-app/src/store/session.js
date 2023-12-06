import { fetchData } from "./csrf"

import { CREATED_WORKSPACE, DELETED_WORKSPACE } from "./common";
const SET_USER = "session/SET_USER"
const REMOVE_USER = "session/REMOVE_USER"
const GOT_CURRENT_WORKSPACE = "session/GOT_CURRENT_WORKSPACE"
const REMOVE_CURRENT_WORKSPACE = "session/REMOVE_CURRENT_WORKSPACE"

export const gotWorkspace = workspace => ({
	type: GOT_CURRENT_WORKSPACE,
	workspace
})

export const removeWorkspace = () => ({
	type: REMOVE_CURRENT_WORKSPACE
})

const setUser = user => ({
	type: SET_USER,
	user
})

const removeUser = () => ({
	type: REMOVE_USER
})

export const authenticate = () => async dispatch => {
	const answer = await fetchData("/api/auth")
	if (!answer.errors) dispatch(setUser(answer))
	return answer
}

export const login = (email, password) => async dispatch => {
	console.log("login", email, password)
	console.log("jsony: ", JSON.stringify({email, password}))

	const answer = await fetchData("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({email, password})})
	if (!answer.errors) dispatch(setUser(answer))
	return answer
}

export const logout = () => async dispatch => {
	const answer = await fetchData("/api/auth/logout")
	if (!answer.errors) dispatch(removeUser())
}

export const signUp = body => async dispatch => {
	// body is FormData; pass along with no headers
	console.log("signup", body)
	if (!body.get("profilePicture")) {
		console.log("no pic: JSON the body")
		body = Object.fromEntries(body.entries())
		console.log("signup body out of form", body)
		body = JSON.stringify(body)
		console.log("signup body json", body)
		console.log("signup TYPEOF body", typeof body)
	} else console.log("profile picture type", typeof body.get("profilePicture"), body.get("profilePicture"))
	const answer = await fetchData("/api/auth/signup", {
		method: "POST",
		body })
	console.log("signup answer", answer)
	console.log("signup answer.errors", answer.errors)
	if (!answer.errors) dispatch(setUser(answer))
	return answer
}

const initialState = { user: null, workspace: null }
export default function reducer(state = initialState, action) {
	switch (action.type) {
	case GOT_CURRENT_WORKSPACE:
		if (!action.workspace || action.workspace === state.workspace) return state
		return { ...state, workspace: action.workspace }
	case REMOVE_CURRENT_WORKSPACE:
		return { ...state, workspace: null }
	case SET_USER:
		return { ...state, user: action.user }
	case REMOVE_USER:
		return { ...state, user: null }
	case CREATED_WORKSPACE:
		console.log("WS created workspace", action.workspace.ownerId)
		if (!state.user || state.user.id !== action.workspace.ownerId) return state
		return { ...state,
		  user: {...state.user,
				workspaces: [...state.user.workspaces, action.id]} }
	case DELETED_WORKSPACE: {
		const user = state.user
		if (!user || user.id !== action.userId ||
			!user.workspaces.includes(action.id)) return state
		return { ...state,
			user: {...state.user,
			workspaces: user.workspaces.filter(wId => wId !== action.id)} }
	}
	default:
		return state
	}
}
