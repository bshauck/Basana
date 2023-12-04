from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Workspace, db
from app.forms import WorkspaceForm, error_message, error_messages

workspace_routes = Blueprint('workspaces', __name__)

@workspace_routes.route('')
@login_required
def get_all_workspaces():
    """
    Query for all Workspaces and returns them in a list of dictionaries
    """
    print("DB: about to get all workspaces")
    workspaces = Workspace.query.all()
    print("DB: workspaces", workspaces)
    return {"workspaces": [workspace.to_dict() for workspace in workspaces]}


@workspace_routes.route('/<int:id>')
@login_required
def get_workspace(id):
    """
    Query for a workspace by id and returns that workspace in a dictionary
    """
    workspace = Workspace.query.get(id)
    return workspace.to_dict()


@workspace_routes.route('/new', methods=["POST"])
@login_required
def create_workspace():
    """
    Creates a new workspace and returns the new workspace in a dictionary
    """

    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_workspace = {
            "owner": current_user.id,
            "name": form.name.data,
        }

        workspace = workspace(**new_workspace)
        db.session.add(workspace)
        db.session.commit()
        return workspace.to_dict(), 201
    else: # form.errors
        return error_messages(form.errors), 400


@workspace_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_workspace(id):
    """
    Updates a workspace and rturns the updated workspace in a ictionary
    """

    workspace = Workspace.query.get(id)
    if current_user.id != workspace.ownerId:
        return {errors: {"user": ["Authorization Error"]}}, 403

    form = WorkspaceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        workspace.name = form.name.data
        db.session.add(workspace)
        db.session.commit()
        return workspace.to_dict(), 201
    else: # form.errors
        return error_messages(form.errors), 401


@workspace_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_workspace(id):
    """
    Deletes an workspace and returns a message if successfully deleted
    """
    workspace = Workspace.query.get(id)
    if workspace.ownerId != current_user.id:
        return {errors: {"user": ["Authorization Error"]}}, 403

    db.session.delete(workspace)
    db.session.commit()
    return {"message": "workspace successfully deleted"}
