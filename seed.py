from app.app_factory import create_app
from flask.cli import FlaskGroup
from app.seeds.enums import seed_enums, undo_enums
from app.seeds.users import seed_users, undo_users
from app.seeds.workspace import seed_workspaces, undo_workspaces
from app.seeds.project import seed_projects, undo_projects
from app.seeds.internal_project import seed_internal_projects, undo_internal_projects
from app.seeds.section import seed_sections, undo_sections
from app.seeds.task import seed_tasks, undo_tasks

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command('all')
def seed():
    seed_enums()
    seed_users()
    seed_workspaces()
    seed_projects()
    seed_internal_projects()
    seed_sections()
    seed_tasks()


@cli.command('undo')
def undo_seed():
    undo_tasks()
    undo_sections()
    undo_internal_projects()
    undo_projects()
    undo_workspaces()
    undo_users()
    undo_enums()


if __name__ == '__main__':
    cli()
