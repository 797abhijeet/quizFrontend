import mongoose from "mongoose";
import Admin from "../model/Admin.js";
import Quiz from "../model/Quiz.js";
import User from "../model/User.js";
import Question from "../model/Question.js";
import { Types as mongooseTypes } from "mongoose";
import Result from "../model/Result.js";

const { ObjectId } = mongooseTypes;

export const addQuiz = async (req, res) => {
  try {
    // console.log(req.body);
    const {
      name,
      description,
      dateCreated,
      startTime,
      endTime,
      duration,
      createdBy,
      attemptedBy,
      questions,
    } = req.body;

    if (
      !name ||
      !dateCreated ||
      !startTime ||
      !endTime ||
      !duration ||
      !createdBy ||
      !questions
    ) {
      return res.json({ status: 422, message: "Something is missing" });
    }
    // console.log('created by...',createdBy)
    //  console.log('questions received...',questions);
    const questionIds = await Promise.all(
      questions.map(async (question, i) => {
        // console.log('question ',i+1, question);
        const newQuestion = new Question(question);
        // console.log('here is new question', newQuestion)
        const savedQuestion = await newQuestion.save();
        return savedQuestion._id;
      })
    );
    // console.log('questions ids ...',questionIds)

    const quiz = new Quiz({
      name,
      description,
      dateCreated,
      startTime,
      endTime,
      duration,
      createdBy,
      attemptedBy,
      questions: questionIds,
    });

    const savedQuiz = await quiz.save();

    if (savedQuiz) {
      const quizId = savedQuiz._id;

      const adminId = savedQuiz.createdBy;
      const admin = await Admin.findById(adminId);

      if (!admin) {
        return res.json({ status: 422, message: "Admin not found" });
      }

      // console.log(admin);

      admin.createdQuizes.push(quizId);
      // Save the updated admin document
      await admin.save();

      return res.status(201).json({
        quiz: savedQuiz,
        quizId: quizId,
        message: "Quiz created successfully",
      });
    }
    return res
      .status(422)
      .json({ message: "Some error occured during adding quiz" });
  } catch (error) {
    console.log(error);
    return res
      .status(422)
      .json({ message: "Some error occured during adding quizz" });
  }
};

export const getQuiz = async (req, res) => {
  // console.log('here i am');
  try {
    const quizId = req.body.quizId;
    // console.log(req.body,req.body.quizId)
    const isValidQuiz = await Quiz.findById(quizId);
    // console.log(isValidQuiz);
    if (!isValidQuiz) {
      console.log("here");
      return res.json({ status: 422, message: "Invalid QuizId" });
    }

    const quiz = await Quiz.findById(quizId)
      .populate("createdBy", "name")
      .populate("attemptedBy", "name")
      .populate("questions", "");

    if (!quiz) {
      return res.json({ status: 422, message: "Quiz Not Found" });
    }

    return res.status(201).json({ quiz });
  } catch (error) {
    return res.json({
      status: 422,
      message: "Some error occured while getting quiz",
    });
  }
};

export const getQuizzes = async (req, res) => {
  // console.log("inside function...")
  try {
    const { quizIds } = req.body;
    console.log(quizIds);
    if (!quizIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.json({ status: 422, message: "Invalid QuizId" });
    }

    const quizzes = await Quiz.find({ _id: { $in: quizIds } })
      .populate("createdBy", "name")
      .populate("attemptedBy", "name");

    if (!quizzes || quizzes.length === 0) {
      return res.json({ status: 422, message: "No quizzes found" });
    }

    return res.status(200).json({ quizzes });
  } catch (error) {
    console.log("Some error occured during getting quiz array", error);
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      return res.json({ status: 422, message: "QuizId is missing" });
    }

    // console.log(quizId)

    const quiz = await Quiz.findById(quizId);

    // console.log('finded quiz...',quiz.attemptedBy);
    if (!quiz) {
      return res.json({ status: 422, message: "Cannot find Quiz" });
    }
    const response = await Quiz.deleteOne({ _id: quizId });
    // console.log('response...',response)
    if (response.deletedCount === 0) {
      return res.json({ status: 422, message: "Cannot find Quiz" });
    }

    const questionIds = quiz.questions.map((question) => question._id);
    // console.log('questions',questionIds);
    await Question.deleteMany({ _id: { $in: questionIds } });

    const admin = await Admin.findOne({
      _id: quiz.createdBy,
    });
    // const users = await User.findOne({_id: quiz.attemptedBy[0]})
    // console.log("users...",users);
    await Admin.updateOne(
      { _id: admin._id },
      { $pull: { createdQuizes: { _id: new ObjectId(quizId) } } }
    );

    await User.updateMany(
      { "attemptedQuizes.quiz": quizId },
      { $pull: { attemptedQuizes: { quiz: quizId } } }
    );

    const result = await Result.deleteOne({quiz: quizId});
    if(result.deletedCount === 0){
      return res.json({status: 422, message: "Result cannot be deleted"});
    }

    return res.json({ status: 201, message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ status: 422, message: "Cannot delete Quiz" });
  }
};

export const calculateScores = async (req, res) => {
  try {
    const { quizId } = req.body;

    // Fetch quiz information with populated data
    const quiz = await Quiz.findById(quizId).populate({
      path: "attemptedBy",
      populate: {
        path: "attemptedQuizes.quiz",
        model: "Quiz",
        populate: {
          path: "questions",
          model: "Question",
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate scores for each user
    await Promise.all(
      quiz.attemptedBy.map(async (user) => {
        let score = 0;

        // Get the filtered questions for the specific quiz
        const filteredQuestions = user.attemptedQuizes
          .filter((attemptedQuiz) => attemptedQuiz.quiz._id.toString() === quizId)
          .map((attemptedQuiz) => attemptedQuiz.quiz.questions)
          .flat();

        // Get the marked options for the specific quiz
        const markedOptions = user.attemptedQuizes
          .filter((attemptedQuiz) => attemptedQuiz.quiz._id.toString() === quizId)
          .map((attemptedQuiz) => attemptedQuiz.markedOptions)
          .flat();

        // Iterate through the questions and calculate score
        filteredQuestions.forEach((question) => {
          const userSelectedOption = markedOptions.find(
            (option) => option.question.toString() === question._id.toString()
          );

          if (
            userSelectedOption &&
            userSelectedOption.selectedOption === question.correctAnswer
          ) {
            score += question.marks;
          }
        });

        // Update the user's score in the database
        const index = user.attemptedQuizes.findIndex(
          (attemptedQuiz) => attemptedQuiz.quiz._id.toString() === quizId
        );

        if (index !== -1) {
          user.attemptedQuizes[index].score = score;
          await user.save();
        }
      })
    );

    return res
      .json({ status: 201,message: "Scores calculated and updated successfully" });
  } catch (error) {
    console.error("Error calculating scores:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};