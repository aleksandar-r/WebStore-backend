import { Application } from "../app";
import { DbConnectionTest } from "../config/dbConnectionTest"


export const getTestInance = async () => {
    const dbTestConnect = new DbConnectionTest();
    const application = new Application(dbTestConnect);
    await application.initilize();
    await application.startListening();
    return application.app;
}