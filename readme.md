# CRUD_TEST

Este proyecto es un sistema CRUD (Crear, Leer, Actualizar, Eliminar) para gestionar productos. La aplicación está dividida en dos partes: un **frontend** desarrollado en **React** y un **backend** basado en **Flask**.

## Estructura del Proyecto

El proyecto está organizado en dos carpetas principales:

- **Client**: Contiene el código del frontend basado en React.
- **Server**: Contiene el código del backend basado en Flask.

### Frontend (Client)

El frontend es una aplicación en **React** que interactúa con el backend para realizar operaciones CRUD sobre los productos. El frontend consume las rutas API proporcionadas por el backend.

### Backend (Server)

El backend está desarrollado con **Flask** y gestiona las operaciones CRUD, la sincronización con una API externa, y la validación de los productos.

## Requisitos

Para ejecutar este proyecto, necesitarás:

- **Node.js**
- **Python 3.x** 
- **PIP** 
- **Git**

## Instalación

### 1. Clonar el repositorio

Primero, clonar el repositorio en la máquina local:

git clone https://github.com/Ruhlian/CRUD_TEST.git
cd CRUD_TEST

enrutamiento para inicializar el proyecto:

### frontend

- abrir una terminal
- cd frontend
- npm install para descargar todas las dependencias el cual se encuentran en el package.JSON
- npm start 


### backend

- abrir una terminal nuevamente
- cd backend
- pip install -r requirements.txt (instalara lo necesario por el momento)
- py run.py