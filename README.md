# Imp Pact 5e (Backend)

En esta rama del proyecto **Imp Pact 5e** se ha desarrollado todo el backend del proyecto. Como la integración de una api para mantener la información del [SRD](https://www.dnd5eapi.co/api/2014/) del juego de rol ***Dungeons & Dragons 5e*** actualizada.

## Tecnologías utilizadas

Las tecnologías terminadas para el backend como se ha comentado en la rama main del proyecto son las siguientes:

- **Firebase**: Como servidor principal del proyecto que tiene las siguientes funcionalidades preparadas:
    - **FireStore Cloud**: Es la Base de Datos encargada de almacenar toda la información tanto contenido oficial del juego de rol como la información que genera los jugadores
    - **Authentication**: Es el encargado de gestionar la creación, eliminación y modificación de cuentas de usuarios registradas en nuestro proyecto.
    - **Hosting**: Es el que gestiona mostrar el front de nuestra aplicación y que los usuarios puedan disfrutar de la aplicación web sin problemas
- **React**: un framework de JavaScript que nos sirve para conectar el front con el backend

## Documentación

### Archivos de configuración

Los archivos de configuración más importantes son:
- [config.jsx](https://github.com/ivanBasCub/Imp_Pact_5e/blob/Ivan/src/firebase/config.jsx): En este archivo tienes que indicar los metadatos de tu proyecto de firebase.
- [firebase.rules](): Este archivo es donde puedes configurar las reglas de **FireStore Cloud**.
- [firebase.json](): Este archivo es donde tiene la configuración de las rutas de los archivos de configuración de todas las funcionalidades activas del servidor.
- [main.jsx](https://github.com/ivanBasCub/Imp_Pact_5e/blob/Ivan/src/main.jsx): Archivo de configuración de todas la rutas de la página web. Ademas de la configuración de que apartados es necesario estar registrado

### Distribución de carpetas

Las carpetas más importantes en este proyecto son las siguientes:

- [src](https://github.com/ivanBasCub/Imp_Pact_5e/tree/Ivan/src): Esta carpeta contiene todos los componentes React. Dentro tenemos las siguientes subcarpetas:
    - [firebase](https://github.com/ivanBasCub/Imp_Pact_5e/tree/Ivan/src/firebase): Esta carpeta almacena la configuración del sevidor firebase y la protección de rutas que requieren el uso de una cuenta de usuario
    - [componentes/Users](https://github.com/ivanBasCub/Imp_Pact_5e/tree/Ivan/src/componentes/Users): Esta carpeta almacena todos los componentes relacionado con las cuentas de usuarios tanto el front como el back
    - [componentes/SRD](): Esta carpeta almacena todo los componentes relacionados con la implementación de la API y la vista front de la wiki

