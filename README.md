# tp3 de computacion en la nube

Si no se tiene creada la red de docker, se debe crear con:

docker network create awslocal

luego levantamos un docker que pueda usar el puerto 8000:

docker run --rm -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

Comando para levantar la red de sam:

sam local start-api --docker-network awslocal 

Una vez levantado el docker, ingresar a localhost:8000/shell/ y pegar el contenido del archivo Tabla.
