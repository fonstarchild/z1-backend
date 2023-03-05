
<a name="readme-top"></a>

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
* MongoDB
* Jest (con ts-jest)
* Mucho power metal de fondo para centrarme


### Requisitos

Para el principio necesitaríamos tener instalado Node en nuestra máquina. Una vez instalada la última versión LTS, podemos ejecutar en la raíz del proyecto.

* npm
  ```sh
  npm install 
  ```

También necesitaremos tener instalado MongoDB. El proyecto se ha hecho en una máquina de Windows, con el mongodb expuesto como servicio en el puerto por defecto, 27017. Con instalarlo, tener una base de datos que se llame "z1backend" (sin guión, ojo), y no tener ninguna autenticación, debería funcionar.

No he añadido autenticación porque realmente para un test de éstos no era necesario, no obstante si es necesario crear un archivo .cfg con los datos pertinentes por favor, avisadme.

### Comandos para ejecutar

1. 
    * npm
    ```sh
    npm run dev-server 
    ```
    Ejecuta el proyecto en modo desarrollo
2. 
    * npm
    ```sh
    npm run lint 
    ```
    Ejecuta el linter
3. 
    * npm
    ```sh
    npm run test 
    ```
    Ejecutan los tests. 
4. 
    * npm
    ```sh
    npm run build 
    ```
    Ejecuta la compilación typescript en una carpeta dist


## Explicación del proyecto

En principio necesitamos tener un usuario. Hay una llamada para crear un administrador sin restricción llamada AddTestTeacher. El token de autorización es el que nosotros proveamos, por simplificar. Normalmente se generaría una UUIDv4 en backend pero por el test decidí mantenerlo de manera simple. Provees, por ejemplo "patata" y se creará un usuario con rol teacher. Es importante poner el header con el authtoken en cada llamada para poder verificar la autorización del usuario en Postman o en el CURL que hagamos.

El teacher tiene acceso a todo el entorno menos al sistema de preguntas que está diseñado para el estudiante. Aun así el teacher podrá acceder y ver todas las preguntas con sus respuestas. También diseñé una llamada para crear estudiantes Test, pudiendo especificar su username y su token, así se puede probar en todo momento.

El student podrá ver los niveles, sus lecciones, su contenido de texto y acceder a la función quiz.

De no existir el parámetro anteriormente mencionado la API nos responderá un AuthorizationError y no podremos consumirla.

El sistema de preguntas está diseñado como si fuera un examen. Tras consumir el contenido de la plataforma, el estudiante podrá realizar este examen a través de la llamada getQuestionForStudentInLesson. Ésta llamada responderá, por orden de jerarquía (la cual se asigna automáticamente), la pregunta, una por una, en orden. Una vez el estudiante responda correctamente, la misma llamada responderá la siguiente pregunta, así, hasta que no haya más, y retornará null, y habremos asumido que el alumno habrá completado el examen. De no acertar la pregunta, retornará la misma. Por supuesto las preguntas podrán ser de tipo simple, multiple, y free, según el guión de la prueba. De no haber preguntas para la lección dada y ser llamada, lanzará error.

Hay varias peticiones que podremos realizar según el rol que proveamos y todas están contenidas en nuestros resolvers.ts. Asi mismo, adjunto una colección Postman preparara para atacar la API, por simplicidad de uso.



## Contacto

Alfonso (Fon, para todo el mundo) - fonstarchild@gmail.com

<p align="right">(<a href="#readme-top">Volver arriba</a>)</p>


