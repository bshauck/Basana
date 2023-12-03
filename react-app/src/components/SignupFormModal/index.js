import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp, login } from "../../store/session";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [profilePicture, setProfilePicture] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password === confirmPassword) {
			const formData = new FormData();
			formData.append("email", email)
			formData.append("username", username)
			formData.append("profilePicture", profilePicture)
			formData.append("password", password)

			const data = await dispatch(signUp(formData))
			if (data.errors) setErrors(data.errors)
			else closeModal()
		} else setErrors([ "Confirm Password field must be the same as the Password field" ])
	}

	const handleDemoLogin = async () => {
		setEmail('demo@aa.io')
		setPassword('password')
		const data = await dispatch(login('demo@aa.io', 'password'));
		if (data.errors) setErrors(data.errors);
		else closeModal()
	  }


	return (
		<>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<ul>
					{errors.map((error, idx) => (
						<li className="error" key={idx}>{error}</li>
					))}
				</ul>
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
