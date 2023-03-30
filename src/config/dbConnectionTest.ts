import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { IDBConnection } from "./IDBConnection";


export class DbConnectionTest implements IDBConnection {
    mongod: MongoMemoryServer;

    constructor() {

    }

    async connect() {
        this.mongod = await MongoMemoryServer.create();
        const uri = await this.mongod.getUri();
        const options = {
            autoIndex: false, // Don't build indexes
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            // reconnectInterval: 1000,
            // reconnectTries: Number.MAX_VALUE,
            // useNewUrlParser: true,
            // autoReconnect: true,
        };
        await mongoose.connect(uri, options);
    }
    async closeDatabase() {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongod.stop();
    }
    async clearDatabase() {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
    startListening(app: string) {
        throw new Error("Method not implemented.");
    }
    seedDB() {
        throw new Error("Method not implemented.");
    }

}