import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useContentLoaded } from "../../context/ContentLoaded";
import { simplify } from "../../utils/helpers";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const { setUserLoaded } = useContentLoaded();

  const handleSubmit = async e => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) setErrors(simplify(data));
    else {
      setUserLoaded(true);
      closeModal()
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@aa.io')
    setPassword('password')
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (data.errors) setErrors(simplify(data));
    else {
      setUserLoaded(true);
      closeModal()
    }
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul style={{minHeight:50,paddingTop:8}} >
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
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <button type="button" onClick={handleDemoLogin}>Log in as Demo User</button>
      </form>
    </>
  )
}

export default LoginFormModal
