import { fetchData } from "./csrf"

const SET_USER = "session/SET_USER"
const REMOVE_USER = "session/REMOVE_USER"

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
	const headers = {}
	if (body.profilePicture) headers["Content-Type"] = "multipart/form-data"
	else body = JSON.stringify(body)
	const answer = await fetchData("/api/auth/signup", {
		method: "POST",
		headers,
		body })
	if (!answer.errors) dispatch(setUser(answer))
	return answer
}

const initialState = { user: null }
export default function reducer(state = initialState, action) {
	switch (action.type) {
	case SET_USER:
		return { user: action.user }
	case REMOVE_USER:
		return { user: null }
	default:
		return state
	}
}
