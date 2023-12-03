import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Route, Switch } from "react-router-dom"

import Logo from "./logo"
import Navigation from '../Navigation'
import SignupFormPage from "../SignupFormPage"
import LoginFormPage from "../LoginFormPage"
import { authenticate } from "../../store/session"
import { useContentLoaded } from '../../context/ContentLoaded'

export default function Header() {
  const {setUserLoaded} = useContentLoaded()
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => {
      setIsLoaded(true);
      setUserLoaded(true);
    });
  }, [dispatch, setUserLoaded]);

  return (
    <div className='HeaderStyle'>
      <Logo/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
        </Switch>
      )}
    </div>
  )
}
