import subprocess
# Lista de dependencias a instalar
dependencies = [
    "flask",
    "flask_jwt_extended",
    "flask_cors",
    "psycopg2-binary",
    "flask_migrate",
    "flask_swagger",
    "flask_admin"
]
# Instalar cada dependencia usando pip
for package in dependencies:
    subprocess.run(["pip", "install", package], check=True)