from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Project, db
from app.forms import ProjectForm, error_message, error_messages

project_routes = Blueprint('projects', __name__)

@project_routes.route('')
@login_required
def get_all_projects():
    """
    Query for all Projects and returns them in a list of dictionaries
    """
    print("DB: about to get all projects")
    projects = Project.query.all()
    print("DB: projects", projects)
    return {"projects": [project.to_dict() for project in projects]}


@project_routes.route('/<int:id>')
@login_required
def get_project(id):
    """
    Query for a project by id and returns that project in a dictionary
    """
    project = Project.query.get(id)
    return project.to_dict()


@project_routes.route('/new', methods=["POST"])
@login_required
def create_project():
    """
    Creates a new project and returns the new project in a dictionary
    """

    form = ProjectForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_project = {
            "owner": current_user.id,
            "name": form.name.data,
        }

        project = project(**new_project)
        db.session.add(project)
        db.session.commit()
        return project.to_dict(), 201
    elif form.errors:
        return error_messages(form.errors), 401
    else:
        return error_message("unknown", "An unknown Error has occurred"), 500

@project_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_project(id):
    """
    Updates a project and rturns the updated project in a ictionary
    """

    project = Project.query.get(id)
    if current_user.id != project.ownerId:
        return {errors: {"user": ["Authorization Error"]}}, 403

    form = ProjectForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        project.name = form.name.data
        db.session.add(project)
        db.session.commit()
        return project.to_dict(), 201
    elif form.errors:
        return error_messages(form.errors), 401


@project_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_project(id):
    """
    Deletes an project and returns a message if successfully deleted
    """
    project = Project.query.get(id)

    if project.owner != current_user.id:
        return error_message("user", "Authorization Error"), 403

    db.session.delete(project)
    db.session.commit()
    return {"message": "project successfully deleted"}
