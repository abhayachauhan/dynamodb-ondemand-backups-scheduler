var aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log('Received event', event);
    var tablesToBackup = event.tablesToBackup.split(",");
    var promises = tablesToBackup.map(backupTable);

    Promise.all(promises)
      .then(result => { console.log(result); callback(); })
      .catch(reason => { console.log(reason); callback(reason); });
};

function backupTable(tablename) {
  var timestamp = new Date().toISOString()
    .replace(/\..+/, '')
    .replace(/:/g, '')
    .replace(/-/g, '');

  var params = {
    TableName: tablename,
    BackupName: tablename + timestamp
  };
  console.log(params);
  return dynamodb.createBackup(params).promise();
}