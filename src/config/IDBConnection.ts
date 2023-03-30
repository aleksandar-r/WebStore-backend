
export interface IDBConnection {
    connect();
    closeDatabase();
    clearDatabase();

    startListening(app: string)
    seedDB();
}