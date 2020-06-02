const feedbackContainer = document.querySelector('.feedback-message');
const baseUrl = 'https://meet-up-questioner.herokuapp.com/api/v1';

const showOverlay = () => {
  document.querySelector('.overlay').style.display = 'block';
};

const hideOverlay = () => {
  document.querySelector('.overlay').style.display = 'none';
};

const displayFeedback = (responseData) => {
  let listItem = '';

  if (responseData.status === 200) {
    listItem += `<li class='feedback-list-item'>${responseData.message}</li>`;
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
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
 * Fetch all question record
 */
const getAllQuestion = () => {
  showOverlay();
  // question endpoint url
  const url = `${baseUrl}/questions`;

  // make a GET request to questions endpoint
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();
      if (body.status === 200) {
        feedbackContainer.classList.remove('feedback-message-error');
        let output = '';
        body.data.forEach((question) => {
          const formatedDate = moment(question.cretedon).format('dddd, MMMM Do YYYY, h:mm:ss a');
          output += `<div class="single__question">
            <div class="single__question__info">
              <h2 class="question-meetup-topic">
                Meetup-topic: <span class="question-meetup-topic-title">${question.meetuptopic}</span>
              </h2>

              <div class="question__header">
                <span class="media__img">
                  <i class="fas fa-user-circle"></i>
                </span>
                <h3 class="single__question__topic">
                  ${question.title}
                </h3>
              </div>

              <div class="question__body">
                <div class="user-comment">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex, ratione.
                </div>
                <p class="posted_by"><span>Asked</span> <span>${formatedDate}</span> By <span>John Doe</span></p>
                <div class="msg_container">
                  <textarea class="msg_input" placeholder="leave your comment..." cols="80" rows="2"></textarea>
                  <a href="#" class="nav__link btn btn__primary--color btn__primary--color--outline comment-btn" data-question-id="${question.questionid}">Send</a>
                  <a href="#" class="nav__link btn btn__primary--color view-comment-btn" data-question-id="${question.questionid}">view comment</a>
                </div>
              </div>
            </div>

            <div class="single__question__vote" id="question-0">
              <div class="votes__container">
                <a href="#" class="vote-up tooltip"><i class="fas fa-angle-up" data-question-id="${question.questionid}"></i><span class="tooltiptext">Up Vote</span></a>
                <span class="vote-count">${question.votes}</span>
                <a href="#" class="vote-down tooltip"><i class="fas fa-angle-down" data-question-id="${question.questionid}"></i><span class="tooltiptext">Down
                    Vote</span></a>
              </div>
            </div>
          </div>`;
        });

        // get question container
        const questionFeedsContainer = document.querySelector('.question-feeds__container');

        // Display all question record
        questionFeedsContainer.innerHTML = output;
      } else {
        displayFeedback(body);
      }
    })
    .catch(err => err);
};

/**
 * Display total question vote
 *
 * @param {*} questionID
 * @param {*} e
 */
const displayTotalVote = (questionID, e) => {
  // get all question url
  const allQuestionUrl = `${baseUrl}/questions`;

  // make a GET request to questions endpoint
  fetch(allQuestionUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((body) => {
      if (body.status === 200) {
        body.data.forEach((question) => {
          if (question.questionid === Number(questionID)) {
            if (e.target.classList.contains('fa-angle-up')) {
              e.target.parentNode.nextElementSibling.innerHTML = question.votes;
            } else {
              e.target.parentNode.previousElementSibling.innerHTML = question.votes;
            }
          }
        });
      }
    }).catch(err => err);
};

/**
 * Upvote a specific meetup question
 *
 * @param {*} questionId
 */
const upvote = (questionId, e) => {
  let userToken = '';

  // check if user is logged in
  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const {
      token,
    } = userData;

    userToken = token;
  } else {
    window.location.href = 'sign-in.html';
  }

  // upvote question endpoint url
  const url = `${baseUrl}/questions/${questionId}/upvote`;

  // make a PATCH request to question/:questionId/upvote endpoint
  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      // check for success status
      if (body.status === 200) {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.remove('feedback-message-error');
        feedbackContainer.classList.add('feedback-message-success');

        // display total question votes count
        displayTotalVote(questionId, e);
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.add('feedback-message-error');
        window.scrollTo(0, 0);

        // redirect to login if token has expired
        checkExpiredToken(body);
      }
    })
    .catch(err => err);
};

/**
 * Down vote a specific meetup question
 *
 * @param {*} questionId
 */
const downvote = (questionId, e) => {
  let userToken = '';

  // check if user is logged in
  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const {
      token,
    } = userData;

    userToken = token;
  } else {
    window.location.href = 'sign-in.html';
  }

  // upvote question endpoint url
  const url = `${baseUrl}/questions/${questionId}/downvote`;

  // make a PATCH request to question/:questionId/upvote endpoint
  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      // check for success status
      if (body.status === 200) {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.remove('feedback-message-error');
        feedbackContainer.classList.add('feedback-message-success');

        // display total question votes count
        displayTotalVote(questionId, e);
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.add('feedback-message-error');
        window.scrollTo(0, 0);

        // redirect to login if token has expired
        checkExpiredToken(body);
      }
    })
    .catch(err => err);
};

// fetch all question record
getAllQuestion();

/**
 * Down vote or Up vote a specific question record
 *
 * @param {*} e
 */
const questionAction = (e) => {
  e.preventDefault();

  // check if button is up vote
  if (e.target.classList.contains('fa-angle-up')) {
    const questionId = e.target.getAttribute('data-question-id');
    upvote(questionId, e);
  }

  // check if button is down vote
  if (e.target.classList.contains('fa-angle-down')) {
    const questionId = e.target.getAttribute('data-question-id');
    downvote(questionId, e);
  }

  // check if button is send comment
  if (e.target.classList.contains('comment-btn')) {
    const questionId = e.target.getAttribute('data-question-id');
    console.log(questionId);
  }

  // check if button is view comment
  if (e.target.classList.contains('view-comment-btn')) {
    const questionId = e.target.getAttribute('data-question-id');
    console.log(questionId);
  }
};

// get question container
const questionFeedsContainer = document.querySelector('.question-feeds__container');

questionFeedsContainer.addEventListener('click', questionAction);
