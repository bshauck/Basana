"""create_enums_and_users_table

Revision ID: ffdc0a98111c
Revises:
Create Date: 2020-11-20 15:06:02.230689

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = 'ffdc0a98111c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('color',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=15), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('project_icon',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('icon', sa.String(length=20), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('icon')
    )
    op.create_table('status',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('state', sa.String(length=17), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('state')
    )
    op.create_table('view_type',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=8), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('type')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashedPassword', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('workspace',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ownerId', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.ForeignKeyConstraint(['ownerId'], ['userb.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('user_member_workspace',
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('workspaceId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['userId'], ['userb.id'], ),
    sa.ForeignKeyConstraint(['workspaceId'], ['workspace.id'], ),
    sa.PrimaryKeyConstraint('userId', 'workspaceId')
    )
    op.create_table('project',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ownerId', sa.Integer(), nullable=False),
    sa.Column('workspaceId', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('color', sa.Integer(), nullable=True),
    sa.Column('status', sa.Integer(), nullable=True),
    sa.Column('icon', sa.Integer(), nullable=True),
    sa.Column('view', sa.Integer(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('public', sa.Boolean(), nullable=True),
    sa.Column('start', sa.String(length=24), nullable=True),
    sa.Column('due', sa.String(length=24), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['color'], ['color.id'], ),
    sa.ForeignKeyConstraint(['icon'], ['project_icon.id'], ),
    sa.ForeignKeyConstraint(['ownerId'], ['userb.id'], ),
    sa.ForeignKeyConstraint(['status'], ['status.id'], ),
    sa.ForeignKeyConstraint(['view'], ['view_type.id'], ),
    sa.ForeignKeyConstraint(['workspaceId'], ['workspace.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_member_project',
    sa.Column('userId', sa.Integer(), nullable=False),
    sa.Column('projectId', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['projectId'], ['project.id'], ),
    sa.ForeignKeyConstraint(['userId'], ['userb.id'], ),
    sa.PrimaryKeyConstraint('userId', 'projectId')
    )
    op.create_table('section',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('projectId', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('index', sa.Integer(), nullable=False),
    sa.Column('createdAt', sa.String(length=24), nullable=False),
    sa.ForeignKeyConstraint(['projectId'], ['project.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


    if environment == "production":
        op.execute(f"ALTER TABLE color SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE project_icon SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE status SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE view_type SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE user SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE workspace SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE user_member_workspace SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE project SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE user_member_project SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER TABLE section SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###qqqqqqqqq


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('section')
    op.drop_table('user_member_project')
    op.drop_table('project')
    op.drop_table('user_member_workspace')
    op.drop_table('workspace')
    op.drop_table('user')
    op.drop_table('view_type')
    op.drop_table('status')
    op.drop_table('project_icon')
    op.drop_table('color')
     # ### end Alembic commands ###
