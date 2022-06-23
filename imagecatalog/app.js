// Create clients and set shared const values outside of the handler.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

// Create a DocumentClient that represents the query to add an item
const client = new DynamoDBClient();
const docClient = DynamoDBDocument.from(client);
const tableName = process.env.IMAGES_TABLE;

export const lambdaHandler = async (event) => {
    let response;
    try {
        // const ret = await axios(url);
        const { s3 } = event.Records[0];
        const info = `Bucket: ${s3.bucket.name}, Key: ${s3.object.key}`;
        console.log('TABLENAME: ', tableName);
        console.log('OBJECT INFO: ', info);
        var params = {
            TableName: tableName,
            Item: { id: s3.object.key, ts: (new Date()).toUTCString() }
        };
        const body = await docClient.put(params);
        response = {
            'statusCode': 200,
            body,
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
