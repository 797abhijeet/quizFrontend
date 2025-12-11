import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDash.css";
import BannerBackground from "./home-banner-background.png";
import LoginContext from "./CustomQuizz/context/LoginContext";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Login from "./LoginRegister/Login";
const AdminDash = () => {
  const [quizDetail, setQuizDetail] = useState([]);
  const navigate = useNavigate();

  const { loginId } = useContext(LoginContext);
  console.log('Login ID on page load:', loginId);

  useEffect(() => {

    

    if (loginId && loginId.quizIds) {
      getHistory();
      
    }
  }, [loginId]);

  const deleteQuiz = async (i) => {
    console.log(loginId.quizIds, loginId.quizIds[i]);
    const response = await axios.post("http://localhost:8000/delete-quiz", {
      quizId: loginId.quizIds[i],
    });

    if (response) {
      window.alert("Quiz Deleted successfully");
      getHistory();
    }
  };

  const getHistory = async () => {
    // console.log('here is login id',loginId.adminId)
    try {
      // console.log('here is quizids...',loginId.quizIds)
      const response = await axios.post("http://localhost:8000/get-quizzes", {
        quizIds: loginId.quizIds,
      });
      if (response) {
        setQuizDetail(response.data.quizzes);
        // console.log(quizDetail);
      }
    } catch (error) {
      console.log("Some Error Occured getting quiz history", error);
    }
  };

  const viewQuiz = async(i) => {
    console.log(quizDetail[i]._id)
    const response = await axios.post('http://localhost:8000/get-quiz',{
      quizId: quizDetail[i]._id
    })
    if(!response){
      window.alert('Some Error Occured');
      return ;
      // console.log(response);
    }
    const detail = {
      adminId: loginId.adminId,
      quiz: response.data.quiz,
    };
    navigate("/detail-quiz", { state: { detail } });
  };

  return (
      <div>
        {loginId?(<div className="admin-main">
          <Header />
           <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
          <div className="admin-info">
            <h1 className="user-head">Welcome to Dashboard</h1>   
            {/* add {loginId.adminName} after Welcome */}
          </div>
          
          <div className="admin-btn">
            {/* <h1 className="history-head">Custom/Random Quizes</h1> */}
          <div className="admin-btn-grp">
            <button type="button" className="btn btn-primary1" onClick={()=>navigate('/custom-quiz')}>
              Create New Quizz
            </button>
            <button type="button" className="btn btn-primary1" onClick={()=>navigate('/random-quiz')}>
              Create Random Quizz
            </button>
          </div>
          </div>
          {/* <hr /> */}
          <div className="admin-history">
            <h1 className="history-head">Your Previous Quizes :</h1>
            {quizDetail !== undefined?(
            <table
              className="table"
              id="table-history"
            >
              <thead>
                <tr>
                  <th scope="col">S. No.</th>
                  <th scope="col">Title</th>
                  <th scope="col">Date</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Attempted</th>
                  <th scope="col">Manage</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {
              quizDetail.map((quiz,i)=>(
                <tr key={i}>
                  <th scope="row">{i+1}</th>
                  <td>{quiz.name}</td>
                  <td>{quiz.dateCreated.split('T')[0]}</td>
                  <td>{quiz.duration} mins</td>
                  <td>{quiz.attemptedBy.length}</td>
                  <td>
                    <VisibilityIcon onClick={() => {
                            viewQuiz(i);
                          }}/>
                  </td>
                  <td>
                    <DeleteIcon onClick={()=>{deleteQuiz(i)}}/>
                  </td>
                </tr>
              ))
                }
                
                
              </tbody>
            </table>):(<div>No Quiz History</div>)}
            
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default AdminDash;
