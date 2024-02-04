from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Task, db
from app.forms import TaskForm, error_message, error_messages

task_routes = Blueprint('tasks', __name__)

@task_routes.route('')
@login_required
def get_all_tasks():
    """
    Query for all Tasks and return them in a list of dictionaries
    """
    print("DB: about to get all tasks")
    tasks = Task.query.all()
    print("DB: tasks", tasks)
    return {"tasks": [task.to_dict() for task in tasks]}


@task_routes.route('/<int:id>')
@login_required
def get_task(id):
    """
    Query for a task by id and return that task in a dictionary
    """
    task = Task.query.get(id)
    return task.to_dict()


@task_routes.route('/new', methods=["POST"])
@login_required
def create_task():
    """
    Creates a new task and return the new task in a dictionary
    """

    form = TaskForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_task = {
            "ownerId": current_user.id,
            "title": form.data['title'],
            "description": form.data['description'],
            # "due": form.data['due'],
            "completed": form.data['completed'],
        }

        task = task(**new_task)
        db.session.add(task)
        db.session.commit()
        return task.to_dict(), 201
    else:  # form.errors
        return error_messages(form.errors), 400


@task_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_task(id):
    """
    Updates a task and return the updated task in a ictionary
    """

    task = Task.query.get(id)

    form = TaskForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        task.name = form.name.data
        db.session.add(task)
        db.session.commit()
        return task.to_dict(), 201
    else:  # form.errors
        return error_messages(form.errors), 400


@task_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_task(id):
    """
    Deletes an task and return a message if successfully deleted
    """
    task = Task.query.get(id)

    if task.owner != current_user.id:
        return error_message("user", "Authorization Error"), 403

    db.session.delete(task)
    db.session.commit()
    return {"message": "task successfully deleted"}
