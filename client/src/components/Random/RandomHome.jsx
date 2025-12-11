import React, { useContext, useState } from "react";
import Header from "../Header";
import axios from "axios";
import "./RandomHome.css";
import BannerBackground from "./home-banner-background.png";
import LoginContext from "../CustomQuizz/context/LoginContext";
import Login from "../LoginRegister/Login";
const RandomHome = () => {
  const [data, setData] = useState([]);
  const [saveActive, setsaveActive] = useState(true);
  const [code, setCode] = useState("");
  const [isClicked, setisClicked] = useState(false);
  const [noq, setNoq] = useState(1);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [duration, setDuration] = useState(0);

  const { loginId } = useContext(LoginContext);
  const adminId = loginId !== null ? loginId.adminId : '';


  const Difficulty = [
    { value: "", label: "Any Difficulty" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const Category = [
    { value: "", label: "Any Category" },
    { value: "9", label: "General Knowledge" },
    { value: "10", label: "Entertainment: Books" },
    { value: "11", label: "Entertainment: Films" },
    { value: "12", label: "Entertainment: Music" },
    { value: "13", label: "Entertainment: Musical & Theatre" },
    { value: "14", label: "Entertainment: Television" },
    { value: "15", label: "Entertainment: Video Games" },
    { value: "16", label: "Entertainment: Board Games" },
    { value: "17", label: "Science & Nature" },
    { value: "18", label: "Science: Computers" },
    { value: "19", label: "Science: Mathematics" },
    { value: "20", label: "Mythology" },
    { value: "21", label: "Sports" },
    { value: "22", label: "Geopgraphy" },
    { value: "23", label: "History" },
    { value: "24", label: "Politics" },
    { value: "25", label: "Arts" },
    { value: "26", label: "Celebrities" },
    { value: "27", label: "Animal" },
  ];

  const Type = [
    { value: "", label: "Any Type" },
    { value: "multiple", label: "Multiple Choice" },
    { value: "boolean", label: "True/False" },
  ];

  const getquest = async () => {
    const URL = `https://opentdb.com/api.php?amount=${noq}&category=${category}&difficulty=${difficulty}&type=${type}`;
    try {
      const response = await fetch(URL);
      const data = await response.json();
      await setData(data);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const saveQuiz = async () => {
    if (!name || !startTime || !endTime || !duration) {
      window.alert("Some fields are missing");
      return;
    }
    const suffleOptions = (array) => {
      for (let i = array.length - 1; i >= 0; i--) {
        array[i] = decodeHTMLEntities(array[i]);
      }
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    try {
      const response = await axios.post("http://localhost:8000/add-quiz", {
        name: name,
        description: desc,
        dateCreated: new Date(),
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        createdBy: adminId,
        attemptedBy: [],
        questions: data.results.map((ques) => ({
          questionText: decodeHTMLEntities(ques.question),
          questionType:
            ques.type === "multiple"
              ? "multiple-choice"
              : ques.type === "boolean"
              ? "true-false"
              : "short-answer",
          options: suffleOptions(
            ques.incorrect_answers.concat(ques.correct_answer)
          ),
          correctAnswer:
            ques.type === "multiple" || ques.type === "boolean"
              ? decodeHTMLEntities(ques.correct_answer)
              : "",
          marks: 1,
        })),
      });

      if (response) {
        setsaveActive(false);
        setCode(response.data.quizId);
        window.alert('Quiz saved successfully');
      }
    } catch (error) {
      console.log("Some error occured during saving the quiz", error);
    }
  };

  const createCode = () => {
    setisClicked(true);
  };
  function decodeHTMLEntities(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  return (
    <div>
        <Header />
      {adminId !== '' ? (<div>
    
      <div className="home1-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
      <div className="head">Create Random Quizz</div>
    
      <div className="body1">
        <div className="auth-form-container1">
          <hr />
          <div className="forms1">
            <form className="register-forms1">
              <label>Name of the Quizz</label>
              <input
                type="text"
                className="form-control"
                id="inputEmail4"
                required
                onChange={(event) => setName(event.target.value)}
              />
              <div className="input-field1">
                <label>Description of Quiz</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputEmail4"
                  onChange={(event) => setDesc(event.target.value)}
                />
              </div>
              <div className="input-field1">
                <label>Start Time of Quiz</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="inputEmail4"
                  required
                  onChange={(event) => setstartTime(event.target.value)}
                />
              </div>
              <div className="input-field1">
                <label>End Time of Quiz</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="inputEmail4"
                  required
                  onChange={(event) => setendTime(event.target.value)}
                />
              </div>
              <div className="input-field1">
                <label>Duration (in minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  id="inputEmail4"
                  min={1}
                  required
                  onChange={(event) => setDuration(event.target.value)}
                />
              </div>
              <div className="input-field1">
                <label>Number of Questions</label>
                <input
                  type="number"
                  className="form-control"
                  min={1}
                  max={50}
                  id="inputEmail4"
                  placeholder="Number of questions"
                  onChange={(event) => setNoq(event.target.value)}
                />
              </div>
              <div>
                <label>Choose a Category</label>

                <select
                  className="drop"
                  name="category"
                  id="category"
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {Category.map((option, index) => (
                    <option value={option.value} key={index}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Choose a Difficulty</label>

                <select
                  className="drop"
                  name="difficulty"
                  id="difficulty"
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {Difficulty.map((option, index) => (
                    <option value={option.value} key={index}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Choose a Type</label>
                <select
                  className="drop"
                  name="type"
                  id="type"
                  onChange={(event) => setType(event.target.value)}
                >
                  {Type.map((option, index) => (
                    <option value={option.value} key={index}>{option.label}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          <div className="sec3">
            <button
              style={{ marginTop: "30px" }}
              className="button-31"
              onClick={getquest}
            >
              Create Quiz
            </button>

            
            {saveActive ? (
              <button
              style={{ marginTop: "30px" }}
              className="button-31"
              onClick={saveQuiz}
            >
              Save Quiz
            </button>
            ) : (
              <button
                style={{ marginTop: "30px" }}
                className="button-31"
                onClick={createCode}
              >
                Create Quiz Code
              </button>
            )}
            {isClicked ? <div>{code}</div> : ""}
          </div>
          {/* <hr /> */}
          <div className="show-quest">
            {data.length === 0
              ? " "
              : data.results.map((Questions, index) => {
                  return (
                    <div className="question-sec" key={index}>
                      Ques {index + 1}. {decodeHTMLEntities(Questions.question)}
                      {Questions.type === "multiple" ? (
                        <div className="options-multiple">
                          <input
                            type="radio"
                            disabled
                          /> {decodeHTMLEntities(Questions.correct_answer)}
                          <br />
                          <input
                            type="radio"
                            disabled
                          />{" "}
                          {decodeHTMLEntities(Questions.incorrect_answers[0])}
                          <br />
                          <input
                            type="radio"
                            disabled
                          />{" "}
                          {decodeHTMLEntities(Questions.incorrect_answers[1])}
                          <br />
                          <input
                            type="radio"
                            disabled
                          />{" "}
                          {decodeHTMLEntities(Questions.incorrect_answers[2])}
                          <br />
                          <br />
                        </div>
                      ) : (
                        <div className="options-tf">
                          <input
                            type="radio"
                            disabled
                          />
                            <label>{Questions.correct_answer}</label>
                          <br />
                          <input
                            type="radio"
                            disabled/>
                           {" "}
                          <label>{Questions.incorrect_answers}</label>
                          <br />
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>) : (<Login />)}
    
    </div>
  );
};

export default RandomHome;
