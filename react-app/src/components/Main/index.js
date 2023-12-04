import { Route, Switch } from "react-router-dom";

import Landing from "./Landing";
import ProjectDetails from "./ProjectDetails";
import WorkspaceDetails from "./WorkspaceDetails";


export default function Main() {
    return (
        <Switch>
            <Route exact path="/">
                <Landing/>
            </Route>
            <Route exact path="/projects/:projectId">
                <ProjectDetails />
            </Route>
            <Route exact path="/workspaces/:workspaceId">
                <WorkspaceDetails />
            </Route>

            <Route>
                404 Page Not Found
            </Route>
        </Switch>
    )
}
