import { Application } from "./app";
import { DBConnection } from "./config/dbConnect";


const dbConnection = new DBConnection();

const app = new Application(dbConnection);
app.initilize();
app.startListening();