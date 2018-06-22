const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

const tableName = process.env.gamesTableName

function create(evt, ctx, cb) {
  const item = JSON.parse(evt.body)

  dynamo.query({
    TableName: tableName,
    ProjectionExpression: 'id',
    KeyConditionExpression: "#sp = :zsp",
    ExpressionAttributeNames:{
        "#sp": "Sport"
    },
    ExpressionAttributeValues: {
        ":zsp": "Baseball"
    },
    ScanIndexForward:false,
    Limit: 1,
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const maxId = data.Items[0].id
      item.id = maxId + 1;

      dynamo.put({
        Item: item,
        TableName: tableName
      }, (err, resp) => {
        if (err) {
          cb(err)
        } else {
          cb(null, {
            statusCode: 201,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(resp)
          })
        }
      })
    }
  })


  
}


function get(evt, ctx, cb) {
  const vId = parseInt(evt.pathParameters.id, 10)
  dynamo.get({
    Key: {
      id: vId
    },
    TableName: tableName
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const game = data.Item
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(game)
      })
    }
  })
}

function list(evt, ctx, cb) {
  dynamo.scan({
    TableName: tableName
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const games = data.Items
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(games)
      })
    }
  })
}


function getMaxId(evt, ctx, cb) {
 
  dynamo.query({
    TableName: tableName,
    ProjectionExpression: 'id',
    KeyConditionExpression: "#sp = :zsp",
    ExpressionAttributeNames:{
        "#sp": "Sport"
    },
    ExpressionAttributeValues: {
        ":zsp": "Baseball"
    },
    ScanIndexForward:false,
    Limit: 1,
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const maxId = data.Items[0].id
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(maxId)
      })
    }
  })
}

module.exports = {
  create,
  get,
  list,
  getMaxId
}
