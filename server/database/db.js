import mongoose from "mongoose";
const Connection = async () => {
    const URL = `mongodb+srv://Abhijeet:gHWSfaX9HRWnIiCl@cluster0.0invvaw.mongodb.net/?appName=Cluster0/quest`;
    try{
        await mongoose.connect(URL);
        console.log('Database connected successfully');
    } catch(error){
        console.log('Error while connecting to the database', error);
    }
}

export default Connection;