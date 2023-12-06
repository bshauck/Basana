import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp, login } from "../../store/session";
import { convertErrorsToArray } from "../../utils/helpers";
import { useContentLoaded } from "../../context/ContentLoaded";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [profilePicture, setProfilePicture] = useState('');
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	// error format is {key1:[error1, error2], key2:[error1, error2]}}
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();
	const { setUserLoaded } = useContentLoaded();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password === confirmPassword) {
			const formData = new FormData();
			formData.append("email", email)
			formData.append("username", username)
			formData.append("profilePicture", profilePicture)
			formData.append("password", password)

			const data = await dispatch(signUp(formData))
			if (data.errors) setErrors(convertErrorsToArray(data.errors))
			else closeModal()
		} else setErrors(["Confirm Password field must be the same as the Password field" ])
	}

	const handleDemoLogin = async () => {
		setEmail('demo@aa.io')
		setPassword('password')
		const data = await dispatch(login('demo@aa.io', 'password'));
		if (data.errors) setErrors(convertErrorsToArray(data.errors));
		else {
			setUserLoaded(true);
			closeModal()
		}
	  }

	  const defaultJill = async () => {
		const formData = new FormData();
		setEmail('jill@aa.io')
		setUsername('jilljill')
		setPassword('jilljill')
		setConfirmPassword('jilljill')
		setProfilePicture('')
		formData.append("email", 'jill@aa.io')
		formData.append("username", 'jilljill')
		formData.append("profilePicture", '')
		formData.append("password", 'jilljill')

		const data = await dispatch(signUp(formData))
		if (data.errors) setErrors(convertErrorsToArray(data.errors))
		else closeModal()
	  }


	return (
		<>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<ul>
					{Object.keys(errors).map((error, idx) => (
						<li className="error" key={idx}>{error}</li>
					))}
				</ul>
				<button type="button" onClick={defaultJill}>Jilljill</button>
				<label>
					Email
					<input
						type="email"
						value={email}
						autoComplete="email"
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label>
					Username
					<input
						type="text"
						value={username}
						autoComplete="username"
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label>
					Profile Picture (Optional)
					<input
						type="file"
						accept="image/*"
						autoComplete="off"
						onChange={(e)=>setProfilePicture(e.target.files[0])}
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						autoComplete="new-password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label>
					Confirm Password
					<input
						type="password"
						value={confirmPassword}
						autoComplete="new-password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				<button type="submit">Sign Up</button>
        		<button type="button" onClick={handleDemoLogin}>Log in as Demo User</button>
			</form>
		</>
	);
}

export default SignupFormModal;
