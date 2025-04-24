# Imp Pact 5e Backend

En esta rama del proyecto se centra todo los documentos relacionados a la conexión con el backend y las configuraciones pertinentes relacionadas al backend y la creación de la Wiki.

## Requisitos Mínimos
Los requisitos necesarios para que puedas usar el proyecto es necesario lo siguiente:
- **Node.js** - Versión superior a la 22.0.0
- **Firebase** - Crear un proyecto firebase para usarlo de servidor

## Carpetas importantes
Las carpetas que nos interesan son las siguientes:

<img src="./docs/img/folders.png" width="300px" height="400px">

- **node_modules**: Esta carpeta contiene todos los modulos necesarios para que el proyecto funcione. Estos son manejados de manera automatica por el comando de *Node.js* `npm`
- **dist**: Esta carpeta contiene todo el proyecto preparado para lanzarlo a producción. Es generado de manera automática usando el comando `npm run build`.
- **src**: Esta carpeta almancena todo los componentes del desarrollo del proyecto y hay dos subcarpetas que tiene los siguientes contenido
    - **firebase**: Este carpeta tiene toda la configuración relacioanda con el servidor firebase y todas las funciones principales del servidor. Ademas contiene para la configuración de rutas que es necesaria la autenticación de un usuario para entrar
    - **componentes**: Contiene tres subcarpetas que nos interesa
        - **SRD**: Esta carpeta almacena todos los componentes relacionados a la creación y mantenimiento de la información de la wiki actualizado
        - **Users**: Tiene los componentes relacionados a la creación, inicio de sesión y log out de las cuentas de usuario. Ademas de la configuración de la persistencia de la sesión
        - **Extras**: En esta carpeta contiene componentes que son usados de manera puntual en la aplicación web para una mejor calidad de vida

