#!/bin/bash

# Salir del script si algún comando falla
set -e

# Ejecutar el script de instalación de dependencias dentro del entorno virtual
pipenv run python install_dependencies.py

# Ejecutar el comando de inicio
pipenv run start