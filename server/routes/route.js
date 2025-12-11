import express from 'express';
import { addUser, getResult, getUserHistory, saveUserResponse} from '../controller/userController.js';
import { addAdmin, adminUserHistory, checkResultPublished, getLeaderBoard, publishResult } from '../controller/adminController.js';
import { getUser } from '../controller/userController.js';
import { getAdmin } from '../controller/adminController.js';
import { addQuiz, calculateScores, deleteQuiz, getQuizzes } from '../controller/quizController.js';
import { getQuiz } from '../controller/quizController.js';
const router = express.Router();

router.get('/', (req,res) => {
    res.send("hello from route");
})

router.post('/register-user',addUser);
router.post('/register-admin',addAdmin);
router.post('/login-user', getUser);
router.post('/login-admin', getAdmin);
router.post('/add-quiz', addQuiz)
router.post('/get-quiz', getQuiz);
router.post('/get-quizzes',getQuizzes);
router.post('/delete-quiz', deleteQuiz);
router.post('/save-quiz', saveUserResponse);
router.post('C', calculateScores);
router.post('/publish-result', publishResult);
router.post('/admin-user-history', adminUserHistory);
router.post('/check-result-published', checkResultPublished);
router.post('/get-userHistory', getUserHistory);
router.post('/get-result', getResult);
router.post('/get-leaderboard', getLeaderBoard);

export default router;