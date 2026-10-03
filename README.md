# AFS Dashboard

Demo disponible aqui:
[Demo](https://afs-dashboard-nine.vercel.app/)

## Instalacion de dependencias para correr proyecto localmente

Instalar las dependencias con estos comandos

### Script de ingesta

- Crear entorno virtual de python

`python -m venv .venv`

- Activar entorno virtual

#### En windows

`.\.venv\Scripts\Activate.ps1`

#### en macOS / linux

`source .venv/bin/activate`

- Instalar las depedencias de python

`pip install -r .\pipeline\requirement.txt`

- Instalar las depedencias de frontend y backend

```
npm install
npm --prefix backend install
npm --prefix frontend install
```

## Ejecución del proyecto

### Ejecutar script de ingesta y crear base de datos

Ejecutar el script de ingesta

```
     python .\pipeline\data_ingestion.py
```

Ejecutar script para probar

```
     pytest pipeline/test_pipeline.py
```
