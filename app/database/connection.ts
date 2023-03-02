import mongoose from "mongoose";

export const connectToDb = async () => {
    await mongoose.connect(
        'mongodb://127.0.0.1:27017/z1backend'
    )
    .then(() => console.log('Connected to database.'))
    .catch((err) => {
        console.error(err);
    });
}