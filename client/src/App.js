import './App.css';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.css';
import AdminDash from './components/AdminDash';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RandomHome from './components/Random/RandomHome';
import CustomHome from './components/CustomQuizz/CustomHome';
import Login from './components/LoginRegister/Login';
import Register from './components/LoginRegister/Register';
import Quizcode from './components/userlogin/Quizcode';
import QuizContextProvider from './components/CustomQuizz/context/QuizContextProvider';
import LoginContextProvider from './components/CustomQuizz/context/LoginContextProvider';
import AdminQuizDetail from './components/AdminQuizDetail';
import HomeNew from './components/HomePage/HomeNew';
import Instruction from './components/userlogin/Instruction';
import UserQuiz from './components/UserQuiz/User_Quiz';

import About from './components/HomePage/About';
import Contact from './components/HomePage/Contact';
import UserQuizContextProvider from './components/CustomQuizz/context/UserQuizContextProvider';
import Submitted from './components/UserQuiz/Submitted';
import Result from './components/Results/Result';
import Leaderboard from './components/Results/LeaderBoard';

function App() {
  // const [currentForm,serCurrentForm]=useState('login');
  console.log("Hello World")
  return (
    // <AdminDash />
   
    <LoginContextProvider>
    <Router>
      <Routes>
        <Route index path='/' element={<HomeNew />} ></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin' element={<AdminDash />}></Route>
        <Route path='/random-quiz' element={<RandomHome />}></Route>
        <Route path='/custom-quiz' element={<QuizContextProvider><CustomHome /></QuizContextProvider>}></Route>
        <Route path='/user' element={<Quizcode />}></Route>
        <Route path='/detail-quiz' element={<AdminQuizDetail />}></Route>
        <Route path='/instruction' element={<Instruction />}></Route>
        <Route path='/quiz' element={ <UserQuiz />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/submitted' element={<Submitted />}></Route>
        <Route path='/result' element={<Result />}></Route>
        <Route path='/leaderboard' element={<Leaderboard />}></Route>
      </Routes>
    </Router>
    </LoginContextProvider>
  );
}

export default App;
