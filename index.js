var AWS = require('aws-sdk');

const {
	v1: uuidv1,
	v4: uuidv4
	} = require('uuid')

var lambdaHandler = async (event, context, callback) => {
	var dynamodb = new AWS.DynamoDB({
		apiVersion: '2012-08-10',
		endpoint: 'http://dynamodb:8000',
		region: 'us-west-2',
		credentials: {
			accessKeyId: '2345',
			secretAccessKey: '2345'
		}
	});
var docClient = new AWS.DynamoDB.DocumentClient({
	apiVersion: '2012-08-10',
	service: dynamodb
});
  switch(event.httpMethod) {
   case "GET":
    if (event.path == '/envios/pendientes') {
	let params = {
	    TableName: 'Envio',
	    IndexName: 'EnviosPendientes'
	};

	let response
	await docClient.scan(params, function(err, data) {
		if (err) {
			response = { body: 'Error al buscar envios pendientes', statusCode: 400}	
		}else{
			if (data.Items.length > 0) {
				response = {body: data.Items, statusCode: 200}			
			}else{
				response = {body: 'No hay envios pendientes', statusCode: 200}				
			}		
		}
	
	}).promise();
	
     return response;
    }
    break;
   case "POST":
     if (event.path === '/envios') {
	if (event.body == null) {
		return {body: 'Envio debe contener contener destino, email y pendiente', statusCode: 400}
	}
	let body = JSON.parse(event.body)
	if (body.destino == null) {
		return{body: 'Envio debe contener contener destino', statusCode: 400}
	}
	if (body.email == null) {
		return {body: 'Envio debe contener contener el email', statusCode: 400}
	}
	let params = {
	    TableName: 'Envio',
	    Item: {
		id: uuidv4(),
		fechaAlta: new Date().toISOString(),
		destino: body.destino,
		email: body.email,
		pendiente: 's'
    		}
	};

	let response
	await docClient.put(params, function(err, data) {
		if (err) {
			response = { body: 'Error al crear envio', statusCode: 400}	
		}else{
			response = { body: JSON.stringify(params.Item), statusCode: 201}
		}
	}).promise();
     	return response;
    }
     break;
    case "PUT":
	if (event.path === `/envios/${event.pathParameters.idEnvio}/entregado`) {
        let params = {
            TableName : "Envio",
            Key : {
                'id': event.pathParameters.idEnvio    
            },
            UpdateExpression : "REMOVE pendiente",
            ReturnValues : "ALL_NEW"        
        };

        let response
        await docClient.update(params, function(err, data) {
            if (err) {
                response = {body: 'No se pudo actualizar el elemento', statusCode:400}
            } else {
                if (Object.keys(data.Attributes).length === 1) {
                    response = {body: `Objeto con id ${event.pathParameters.idEnvio} no encontrado`, statusCode:404}
                }
                else {
                    response = {body: JSON.stringify(data.Attributes), statusCode:200}
                }
            }
        }).promise();
        return response
	}
	break;
    default:
	return { body: "Metodo no soportado", statusCode: 405}
  }

};
exports.lambdaHandler = lambdaHandler;