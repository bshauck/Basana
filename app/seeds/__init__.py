from flask.cli import AppGroup
from app.models.db import db, environment, SCHEMA
from .enums import seed_enums, undo_enums
from .users import seed_users, undo_users


# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_enums()
    # Add other undo functions here

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        undo()
    seed_enums()
    seed_users()
    # Add other seed functions here
