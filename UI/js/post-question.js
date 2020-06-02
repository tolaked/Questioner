/**
 * Fetch all meetup record
 */
const getAllMeetup = () => {
  // meetup endpoint url
  const url = 'https://meet-up-questioner.herokuapp.com/api/v1/meetups/';

  // make a GET request to meetups
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((body) => {
      if (body.status === 200) {
        let output = '<option value="" selected>Choose</option>';
        body.data.forEach((meetup) => {
          output += `<option value="${meetup.id}">${meetup.topic}</option>`;
        });

        // get meetup container (select option)
        const meetupContainer = document.getElementById('meetup-q-topic');

        // Display all meetup record
        meetupContainer.innerHTML = output;
      }
    })
    .catch(err => err);
};
// fetch all meetup record
getAllMeetup();

const showOverlay = () => {
  document.querySelector('.overlay').style.display = 'block';
};

const hideOverlay = () => {
  document.querySelector('.overlay').style.display = 'none';
};

// Clear all errors from field
const resetFields = () => {
  const fields = document.querySelectorAll('.error');
  const fieldsArr = Array.prototype.slice.call(fields);
  fieldsArr.forEach((element) => {
    const currentField = element;
    currentField.innerHTML = '';
    currentField.previousElementSibling.style.border = '1px solid #f4f4f4';
  });
};

// check if token has expired
const checkExpiredToken = (responseBody) => {
  if (responseBody.error.expiredAt) {
    // Redirect user to home page
    setTimeout(() => {
      window.location.href = 'sign-in.html';
    }, 1000);
  }
};

/**
 * Display user feedback
 *
 * @param {object} responseData
 *
 * @returns {string} listItem
 */
const displayFeedback = (responseData) => {
  let listItem = '';

  if (responseData.status === 400 && typeof responseData.error !== 'string') {
    if (responseData.error.expiredAt) {
      listItem += '<li class=\'feedback-list-item\'>Session expired, Please Login.</li>';
    } else {
      listItem += '<li class=\'feedback-list-item\'>Please fill the required field below.</li>';
    }
  } else if (responseData.status === 200 || responseData.status === 201) {
    listItem += `<li class='feedback-list-item'>${responseData.message}</li>`;
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

const postQuestion = (e) => {
  e.preventDefault();
  resetFields();
  showOverlay();

  // get all user input values
  const meetupTopic = document.getElementById('meetup-q-topic').value;
  const questionTitle = document.getElementById('q-title').value;
  const questionBody = document.getElementById('post-q-body').value;
  const feedbackContainer = document.querySelector('.feedback-message');

  // sign up API-endpoint url
  const url = 'https://meet-up-questioner.herokuapp.com/api/v1/questions';

  // User input data object
  const formData = {
    meetup: parseInt(meetupTopic, 10),
    title: questionTitle,
    body: questionBody,
  };

  // get user object from
  let userToken = '';
  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const {
      token,
    } = userData;

    userToken = token;
  }


  // Make a post request to sign up endpoint
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();

      // check for success status
      if (body.status === 201) {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.remove('feedback-message-error');
        feedbackContainer.classList.add('feedback-message-success');
        window.scrollTo(0, 0);

        // Redirect user to home page
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.add('feedback-message-error');
        window.scrollTo(0, 0);

        // redirect to login if token has expired
        checkExpiredToken(body);

        // cycle over each element in the error array
        // cycle over each form field next sibling
        // check and display error if any
        body.error.forEach((element) => {
          Object.keys(formData).forEach((key) => {
            if (element.key === key) {
              document.querySelector(`.${element.key}`).style.border = '0.7px solid #dc3545';
              if (element.key === 'meetup') {
                document.querySelector(`.${element.key}`).nextElementSibling.innerHTML = 'Select meetup topic.';
              } else {
                document.querySelector(`.${element.key}`).nextElementSibling.innerHTML = element.Rule;
              }
            }
          });
        });
      }
    })
    .catch(err => err);
};

const postQuestionBtn = document.getElementById('post-q-btn');

postQuestionBtn.addEventListener('click', postQuestion);
