
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Z1 Backend Test</h3>
  <p align="center">
    Pequeño LMS implementado con GraphQL. Estructurado en niveles, lecciones, contenidos, preguntas y usuarios.
  </p>
</div>


## Acerca del proyecto

La implementación del proyecto se ha hecho tal y como se pedía. Decidí no usar una base de datos para reducir la complejidad del proyecto y mi escasa experiencia trabajando con MongoDB. Quise, en un principio, usar PostgreSQL pero para el test, me parecía matar moscas a cañonazos. No obstante si buscáis una implementación de una base de datos puedo rehacerlo sin problema.


### Construído con

* Express
* Apollo Server
* Typescript
* GraphQL


### Requisitos

Para el principio necesitaríamos tener instalado Node en nuestra máquina. Una vez instalada la última versión LTS, podemos ejecutar en la raíz del proyecto:

* npm
  ```sh
  npm install 
  ```

### Comandos para ejecutar

1. 
    * npm
    ```sh
    npm run dev-server 
    ```
    Ejecuta el proyecto en modo desarrollo
2. 1. 
    * npm
    ```sh
    npm run lint 
    ```
    Ejecuta el linter


## Explicación del proyecto

En principio necesitamos tener un usuario: no he querido quebrarme mucho la cabeza, así que para usar el servicio necesitaremos Postman y que en cada request, en los headers, haya un parámetro llamado "authtoken". El sistema reconoce los siguientes, teacher y student. Tener authtoken=teacher te permite acceder al contenido para profesores exclusivo, y tener el authtoken=student te permite acceder a la plataforma de cursos correctamente.

De no existir el parámetro anteriormente mencionado la API nos responderá un AuthorizationError y no podremos consumirla.

Hay varias peticiones que podremos realizar según el rol que proveamos y todas están contenidas en nuestros resolvers.ts

getAllLevels: Retorna todos los niveles del LMS existentes.

getStudents: Retorna los estudiantes de la plataforma.

isContentViewed: Para un usuario logueado, registra si el contenido provisto ha sido visitado.

canTheStudentGoForward: Para una pregunta objetivo, registramos si el usuario ha contestado correctamente a la pregunta. De no haberla contestado se responderá false y podremos evitar en el frontend su paso adelante.

getLessonsByLevel: Retorna todas las lecciones por nivel.

getContentByLesson: Retorna todos los contenidos de tipo texto (con posible imagen) para una lección dada.

getQuestionsForALesson: Para una lección dada retorna todas las preguntas disponibles.

getAnswersOfAStudent: Retorna todas las respuestas del estudiante objetivo.


## Contacto

Alfonso (Fon, para todo el mundo) - fonstarchild@gmail.com

<p align="right">(<a href="#readme-top">Volver arriba</a>)</p>


