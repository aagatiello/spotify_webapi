# Spotify Web API v2.0 <img src="https://www.nebrija.com/lp/2019/inc/common/assets/img/logo_nebrija.png" height="50px" align="right" />
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
 
Página que a través de la API de Spotify puedes buscar música nueva o conocida, ver tus estadísticas y encontrar recomendaciones según tu perfil.

## :bookmark_tabs: Tabla de contenidos 
1. Demo
2. Funcionalidades
3. Instalación
4. Problemas conocidos
5. Dependencias
6. Otra información
7. Licencia

## :computer: Demo
Visita mi proyecto haciendo click [aquí](https://aagatiello.github.io/).

## :gear: Funcionalidades
| VERSION | FUNCIONALIDADES |
|---|---|
| v0.1 | Inicio de sesión<br>Búsqueda de canción o artista por nombre |
| v1.0 | Reproducción de canción seleccionada<br>Agregar canción a playlist del usuario<br>Mejoras visuales de la interfaz |
| v1.1 | Cierre de sesión<br>Creación de playlists<br>Mejoras visuales de la interfaz |
| v2.0 | Estadísticas de canciones y artistas más escuchados en el tiempo|

## :hammer_and_wrench: Instalación
Las siguientes instrucciones te permitirán descargar el proyecto y ejecutarlo para que sea usado localmente. 

#### PASO 1: Descargar el código en ZIP o clonar el repositorio
#### PASO 2: Abrir el contenido y dentro del directorio instalar las dependencias
```
npm install
```
#### PASO 3: Configurar las variables de entorno
Copia el contenido de .env.sample a un .env y rellena los campos con las credenciales que obtendrás en tu [Dashboard de Spotify](https://developer.spotify.com/dashboard/login)

#### PASO 4: Ejecutar en local
Ejecuta la app en modo desarrollo. 
```
npm start
```
Para poder verlo en el navegador, abre [http://localhost:3000](http://localhost:3000).

## :triangular_flag_on_post: Problemas conocidos
* En Google Chrome puede dar error al iniciar sesión. El navegador recomendado para esta aplicación es **Firefox** o **Microsoft Edge**.

## :paperclips: Dependencias
Se encuentran en el archivo `package.json`.

El proyecto cuenta con las siguientes dependencias:

```json
"dependencies": {
    "@fullpage/react-fullpage": "^0.1.23",
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.1.1",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.27.2",
    "react": "^18.1.0",
    "react-dom": "^18.1.0",
    "react-modal": "^3.15.1",
    "react-scripts": "5.0.1",
    "react-spinners-kit": "^1.9.1",
    "react-spotify-player": "^1.0.4",
    "web-vitals": "^2.1.4"
}
```

## :link: Otra información
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To learn React, check out the [React documentation](https://reactjs.org/).


## :copyright: Licencia 
[MIT](https://choosealicense.com/licenses/mit/)
