const {MongoClient} = require('mongodb');

getZones().catch(console.error);

async function getZones() {
    const uri = "mongodb+srv://m001-student:m001-mongodb-basics@cluster0.jbs6s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('AssetPlanogram');
        const zones = database.collection('AssetCollection');
        const query = { _id: 1 };
        const zone = await zones.findOne(query);
        console.log(zone);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

/*
main().catch(console.error);

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases: ");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function main() {
    const uri = "mongodb+srv://m001-student:m001-mongodb-basics@cluster0.jbs6s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    const client = new MongoClient(uri);

    try {
        await client.connect();
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}*/