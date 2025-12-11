import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    users: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            score: {
                type: Number,
                default: 0
            },
            timeTaken: {
                type: Number,
                default: 0
            }
        }
    ]
})

const Result = mongoose.model('Result',resultSchema);
export default Result;