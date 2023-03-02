
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

La implementación del proyecto se ha hecho tal y como se pedía. Al principio, decidí no usar una base de datos para reducir la complejidad del proyecto y, sinceramente, por mi escasa experiencia trabajando con MongoDB. Al final, me he tirado a la piscina (de perdidos al río, y ...!aprender cosas nunca está mal!) y he añadido MongoDB mediante comunicación mongoose. 


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

El sistema de preguntas, he decidido implementarlo mediante una jerarquía para cada alumno. Cuando un alumno se somete a las preguntas, se llama a la API, para obtener la primera pregunta para la lección dada. Mediante la jerarquía (un número, ascendente del 0 a n, donde N sea el número de preguntas, ordenadas) podemos controlar el avance del alumno. Si por ejemplo estamos en la question de jerarquía 1, y el alumno no ha contestado bien, no podremos movernos a la jerarquía 2. Detectamos que es la última jerarquía cuando la llamada incremental de jerarquía retorne null / not found y asumimos que el alumno ha completado el curso.

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


