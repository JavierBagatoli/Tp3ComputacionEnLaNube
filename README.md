# tp3 de computacion en la nube

Comando para levantar docker:

docker run --rm -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb

Comando para levantar la red de sam:

sam local start-api --docker-network awslocal 

Una vez levantado el docker, ingresar a localhost:8000 y pegar el contenido del archivo Tabla.