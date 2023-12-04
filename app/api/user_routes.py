from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User

user_routes = Blueprint('users', __name__)

@user_routes.route('')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>/projects')
@login_required
def user_projects(id):
    """
    Query for a user's projects and returns a project collection
    """
    print ("DB: about to get user's projects")
    if current_user.id != id:
        return error_message("user","Unauthorized"), 403
    projects = [project.to_dict() for project in current_user.ownedProjects]
    print("DB: projects", projects)
    return { "projects": projects }

@user_routes.route('/<int:id>/workspaces')
@login_required
def user_workspaces(id):
    """
    Query for a user's workspaces and returns a workspaces collection
    """
    print ("DB: about to get user's workspaces")
    if current_user.id != id:
        return error_message("user","Unauthorized"), 403
    workspaces = [workspace.to_dict() for workspace in current_user.workspaces]
    print("DB: workspaces", workspaces)
    return { "workspaces": workspaces }
