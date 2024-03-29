from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Project, db, Task
from app.forms import ProjectForm, error_message, error_messages

project_routes = Blueprint('projects', __name__)

@project_routes.route('')
@login_required
def get_all_projects():
    """
    Query for all Projects and return them in a list of dictionaries
    """
    print("DB: about to get all projects")
    projects = Project.query.all()
    print("DB: projects", projects)
    return {"projects": [project.to_dict() for project in projects]}


@project_routes.route('/<int:id>')
@login_required
def get_project(id):
    """
    Query for a project by id and return that project in a dictionary
    """
    project = Project.query.get(id)
    return project.to_dict()


@project_routes.route('/new', methods=["POST"])
@login_required
def create_project():
    """
    Creates a new project and return the new project in a dictionary
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
    else:  # form.errors
        return error_messages(form.errors), 400


@project_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_project(id):
    """
    Update a project and return the updated project in a ictionary
    """

    project = Project.query.get(id)
    if current_user.id != project.ownerId:
        return error_message("user", "Authorization Error"), 403

    form = ProjectForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        project.name = form.name.data
        # project.due = form.due.data
        project.description = form.description.data
        project.public = form.public.data
        db.session.add(project)
        db.session.commit()
        return project.to_dict(), 201
    else:  # form.errors
        return error_messages(form.errors), 400


@project_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_project(id):
    """
    Delete a project and return a message if successfully deleted
    """
    print("DB: about to delete a project")
    project = Project.query.get(id)

    if project.ownerId != current_user.id:
        return error_message("user", "Authorization Error"), 403

    db.session.delete(project)
    db.session.commit()
    return {"message": "project successfully deleted"}



@project_routes.route('/<int:id>/tasks')
@login_required
def get_all_project_tasks(id):
    """
    Query for all Tasks within the given Project and return them in a list of dictionaries
    """
    print("DB: about to get all project tasks")
    tasks = Task.query.filter_by(Task.projectId == id).all()
    print("DB: tasks", tasks)
    return {"tasks": [task.to_dict() for task in tasks]}
