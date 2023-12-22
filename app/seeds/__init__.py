from .enums import seed_enums, undo_enums
from .users import seed_users, undo_users
from .workspace import seed_workspaces, undo_workspaces
from .project import seed_projects, undo_projects
from .internal_project import seed_internal_projects, undo_internal_projects
from .section import seed_sections, undo_sections
from .task import seed_tasks, undo_tasks


def setup_seed_commands(app):
    from flask.cli import AppGroup
    seed_commands = AppGroup('seed')

    @seed_commands.command('all')
    def seed():
        seed_enums()
        seed_users()
        seed_workspaces()
        seed_projects()
        seed_internal_projects()
        seed_sections()
        seed_tasks()


    @seed_commands.command('undo')
    def undo():
        undo_tasks()
        undo_sections()
        undo_internal_projects()
        undo_projects()
        undo_workspaces()
        undo_users()
        undo_enums()

    app.cli.add_command(seed_commands)
