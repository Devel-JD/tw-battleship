import * as Mongoose from 'mongoose';

let db = null;

const getDB = () => {
    if( !db ){
        Mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
        db = Mongoose.connection;
        return db;
    }
}

export default getDB;