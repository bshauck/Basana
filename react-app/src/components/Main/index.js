import { Route, Switch } from "react-router-dom";

// import Landing from "./Landing";


export default function Main() {
    return (
        <Switch>
            {/* <Route exact path="/">
                <Landing/>
            </Route> */}

            <Route>
                404 Page Not Found
            </Route>
        </Switch>
    )
}
