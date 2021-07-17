# NOTAS ACERCA DE CI

## Comentarios generales del

Solo se publica una nueva imagen si el pipeline se ejecuto satisfactoriamente.  
Para generar una imagen tagueada de docker es necesario que exista un tag con el mismo nombre de version en el repo, para esto se usa LATEST_TAG y se compara con la ref/tags del repo.  
Es importante que primero se pushee el tag del repo que luego se intentara publicar

## Procedimiento para una release como "VERSION RELEASE TAG"

Una vez realizados todos los cambios en el codigo que se quieren introducir en la version, se deben se seguir estos pasos

1. Se agrega el TAG que en la variable de entorno LATEST_TAG del archivo ci.snashot.yml por ejemplo
   LATEST_TAG: v1.0.0

2. Se agregan los archivos que aun queden por comitear, incluyendo el ci.snapshot.yml recien editado

`git add .`

3. Se comitean todos los archivos

`git commit -m "comment about commit"`

4. Se TAGea con el TAG de la release candidate

`git tag -a vX.Y.Z -m "release vX.Y.Z"`

5. Se pushea el TAG al repositorio remoto

`git push --tags`

## Procedimiento para una release como "snapshot"

1. Se agregan los archivos que aun queden por comitear

`git add .`

2. Se comitean todos los archivos

`git commit -m "comment about commit"`

3. Se pushean los cambios al repositorio remoto

`git push --tags`


## Eliminacion de TAGs

Si por alguna razon se genero mal la release, se debe eliminar el TAG y generar de nuevo la release.  

Para eliminar un Tag remoto, se debe ejecutar

`git push --delete origin v1.0.0`

Y luego para eliminar el TAG local, ejecutar por ejemplo

`git tag -d v1.0.0`

Debe existir una numeracion completa de TAGS v1.0.0 / v1.0.3 / v1.0.3 / etc.
