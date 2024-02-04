from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Workspace, Project, db
from app.forms import WorkspaceForm, ProjectForm, error_message, error_messages

workspace_routes = Blueprint('workspaces', __name__)


@workspace_routes.route('')
@login_required
def get_all_workspaces():
    """
    Query for all workspaces and return them in a list of dictionaries
    """
    print("DB: about to get all workspaces")
    workspaces = Workspace.query.all()
    print("DB: workspaces", workspaces)
    return {"workspaces": [workspace.to_dict() for workspace in workspaces]}


@workspace_routes.route('/<int:id>')
@login_required
def get_workspace(id):
    """
    Query for a workspace by id and return that workspace in a dictionary
    """
    workspace = Workspace.query.get(id)
    return workspace.to_dict()


@workspace_routes.route('/new', methods=["POST"])
@login_required
def create_workspace():
    """
    Creates a new workspace and return the new workspace in a dictionary
    """

    print("DB: about to create a new workspace")

    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    print("DB: form", form)
    print("DB: formdata", form.data['name'])

    if form.validate_on_submit():
        new_workspace = {
            "owner": current_user,
            "name": form.data['name'],
        }

        print("DB: new_workspace", new_workspace)
        workspace = Workspace(**new_workspace)
        db.session.add(workspace)
        db.session.commit()
        return workspace.to_dict(), 201
    elif form.errors:
        print("DB: ws form errors", form.errors)
        return error_messages(form.errors), 400
    else:
        print("DB: form not validated")
        return error_message("form", "form not validated"), 500 # this should never happen



@workspace_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_workspace(id):
    """
    Updates a workspace and return the updated workspace in a dictionary
    """

    workspace = Workspace.query.get(id)
    if current_user.id != workspace.ownerId:
        return error_message("user", "Authorization Error"), 403

    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        workspace.name = form.name.data
        db.session.add(workspace)
        db.session.commit()
        return workspace.to_dict(), 201
    else: # form.errors
        return error_messages(form.errors), 400


@workspace_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_workspace(id):
    """
    Deletes a workspace and return a message if successfully deleted
    """
    print("DB: about to delete a workspace")
    workspace = Workspace.query.get(id)
    if workspace.ownerId != current_user.id:
        return error_message("user", "Authorization Error"), 403

    db.session.delete(workspace)
    db.session.commit()
    return {"message": "workspace successfully deleted"}


# Projects

@workspace_routes.route('/<int:id>/projects')
@login_required
def get_all_workspace_projects():
    """
    Query for all Projects in a Workspace and return them in a list of dictionaries
    """
    print("DB: about to get all projects")
    projects = Project.query.filter_by(Project.workspaceId == id).all()
    print("DB: projects", projects)
    return {"projects": [project.to_dict() for project in projects]}


@workspace_routes.route('/<int:id>/projects/new', methods=["POST"])
@login_required
def create_project_for_workspace(id):
    """
    Creates a new project and returns the new project in a dictionary
    """
    print("DB: about to create a new project for a workspace")

    form = ProjectForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    print("DB: form", form)

    if form.validate_on_submit():
        new_project = {
            "owner": current_user,
            "workspaceId": id,
            "name": form.name.data,
            'public': form.public.data,
        }
        print("DB: validated new_project", new_project)

        project = Project(**new_project)
        db.session.add(project)
        db.session.commit()
        print("DB: successful save of project")
        return project.to_dict(), 201
    elif form.errors:
        print("DB: project form errors", form.errors)
        return error_messages(form.errors), 400
    else:
        print("DB: project form not validated")
        return error_message("form", "form not validated"), 500 # this should never happen


# Tasks

@workspace_routes.route('/<int:workspaceId>/myTasks')
@login_required
def user_workspace_tasks(workspaceId):
    """
    Query for a user's tasks in a workspace and return a task collection
    """
    print ("DB: about to get user's tasks in a workspace")

    tasks = [task.to_dict() for task in current_user.tasks if task.workspaceId == workspaceId]
    print("DB: tasks", tasks)
    return { "tasks": tasks }


# Internal Projects

@workspace_routes.route('/<int:workspaceId>/myTasksProject')
@login_required
def user_workspace_my_tasks_project(workspaceId):
    """
    Query for the internal support for my tasks based on user
    and workspace.
    """
    print ("DB: about to get user's / workspaces, internal project tasks in a workspace")

    ips = [ip.to_dict() for ip in current_user.internalProjects if ip.workspaceId == workspaceId]
    print("DB: ips", ips)
    if len(ips) != 1:
        return error_message("user", "Internal Project Error"), 500
    return { "internalProjects": ips }
