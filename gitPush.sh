#!/bin/sh

if [ -z "$*" ]; then
  echo "Error: No commit message provided."
  exit 1
fi

git add *
git commit -m "$*"

# Preguntar al usuario si desea hacer un push
read -p "¿Deseas hacer un push al repositorio remoto? (s/n): " respuesta

case $respuesta in
  [sS]|[yY])
    git push origin main
    ;;
  *)
    echo "Operación de push cancelada."
    ;;
esac