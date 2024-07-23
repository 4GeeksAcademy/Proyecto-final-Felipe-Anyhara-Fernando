"""empty message

Revision ID: 6d0092929de1
Revises: 672dca2c3d9b
Create Date: 2024-07-20 00:28:59.623772

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6d0092929de1'
down_revision = '672dca2c3d9b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('apoderado',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('apellido', sa.String(length=120), nullable=False),
    sa.Column('correo_electronico', sa.String(length=120), nullable=False),
    sa.Column('contrasena', sa.String(length=80), nullable=False),
    sa.Column('esta_activo', sa.Boolean(), nullable=False),
    sa.Column('telefono', sa.String(length=20), nullable=True),
    sa.Column('direccion', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('correo_electronico')
    )
    op.create_table('profesor',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('apellido', sa.String(length=120), nullable=False),
    sa.Column('correo_electronico', sa.String(length=120), nullable=False),
    sa.Column('contrasena', sa.String(length=80), nullable=False),
    sa.Column('esta_activo', sa.Boolean(), nullable=False),
    sa.Column('titulo', sa.String(length=120), nullable=True),
    sa.Column('especializacion', sa.String(length=120), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('correo_electronico')
    )
    op.create_table('alumno',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('apellido', sa.String(length=120), nullable=False),
    sa.Column('id_apoderado', sa.Integer(), nullable=False),
    sa.Column('esta_activo', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['id_apoderado'], ['apoderado.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('asignatura',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=120), nullable=False),
    sa.Column('id_profesor', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['id_profesor'], ['profesor.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('alumno_asignatura',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('id_alumno', sa.Integer(), nullable=False),
    sa.Column('id_asignatura', sa.Integer(), nullable=False),
    sa.Column('calificacion', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['id_alumno'], ['alumno.id'], ),
    sa.ForeignKeyConstraint(['id_asignatura'], ['asignatura.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recomendacion',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('id_alumno', sa.Integer(), nullable=False),
    sa.Column('recomendacion', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['id_alumno'], ['alumno.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('user')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=False),
    sa.Column('password', sa.VARCHAR(length=80), autoincrement=False, nullable=False),
    sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='user_pkey'),
    sa.UniqueConstraint('email', name='user_email_key')
    )
    op.drop_table('recomendacion')
    op.drop_table('alumno_asignatura')
    op.drop_table('asignatura')
    op.drop_table('alumno')
    op.drop_table('profesor')
    op.drop_table('apoderado')
    # ### end Alembic commands ###