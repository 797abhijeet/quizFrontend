// ===============================
// VALIDATE QUIZ FORM
// ===============================
export const validateQuizForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) {
    errors.name = "Quiz name is required";
  }

  if (!formData.startTime) {
    errors.startTime = "Start time is required";
  }

  if (!formData.endTime) {
    errors.endTime = "End time is required";
  }

  if (formData.startTime && formData.endTime) {
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end <= start) {
      errors.endTime = "End time must be after start time";
    }
  }

  if (!formData.duration || formData.duration <= 0) {
    errors.duration = "Duration must be greater than 0";
  }

  if (!formData.questions || formData.questions.length === 0) {
    errors.questions = "At least one question is required";
  } else {
    formData.questions.forEach((question, index) => {
      if (!question.questionText?.trim()) {
        errors[`question_${index}`] = `Question ${index + 1} text is required`;
      }

      if (question.points == null || question.points < 0) {
        errors[`points_${index}`] =
          `Question ${index + 1} points must be non-negative`;
      }

      if (question.questionType !== "short-answer") {
        if (!question.answerKey && question.answer !== false) {
          errors[`answer_${index}`] =
            `Question ${index + 1} requires a correct answer`;
        }
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ===============================
// VALIDATE LOGIN FORM
// ===============================
export const validateLoginForm = (email, password, role) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!role) {
    errors.role = "Role is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ===============================
// VALIDATE REGISTER FORM
// ===============================
export const validateRegisterForm = (
  name,
  email,
  password,
  confirmPassword,
  role
) => {
  const errors = {};

  // Name validation
  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Email, password & role → reuse login validator
  const loginCheck = validateLoginForm(email, password, role);
  Object.assign(errors, loginCheck.errors);

  // Confirm password
  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ===============================
// VALIDATE QUIZ CODE
// ===============================
export const validateQuizCode = (code) => {
  if (!code.trim()) {
    return "Quiz code is required";
  }

  if (code.length < 8) {
    return "Quiz code must be at least 8 characters";
  }

  return "";
};
