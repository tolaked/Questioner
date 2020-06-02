// check if user data exist
if (localStorage.getItem('user')) {
  const rawUserData = localStorage.getItem('user');
  const userData = JSON.parse(rawUserData);
  const userName = document.querySelector('.dashboard-username');
  if (!userData.access) {
    // set username
    userName.innerHTML = userData.username;
  } else {
    window.location.href = 'sign-in.html';
  }
} else {
  window.location.href = 'sign-in.html';
}

// get user token
let userToken = '';
if (localStorage.getItem('user')) {
  const userData = JSON.parse(localStorage.getItem('user'));
  const {
    token,
  } = userData;

  userToken = token;
}

const showOverlay = () => {
  document.querySelector('.overlay').style.display = 'block';
};

const hideOverlay = () => {
  document.querySelector('.overlay').style.display = 'none';
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
  } else if (responseData.status === 200) {
    listItem += '<li class=\'feedback-list-item\'>upcoming meetup scheduled found</li>';
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

/**
 * Get total number of posted questions by user
 */
const getTotalPostedQuestions = () => {
  // questions/user endpoint url
  const url = 'https://meet-up-questioner.herokuapp.com/api/v1/questions/user';

  // make a GET request to questions/user
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      if (body.status === 200) {
        // get sidebar element container (span.total-questions)
        const totalQuestionsContainer = document.querySelector('.total-questions');

        // Display total number of posted questions
        totalQuestionsContainer.innerHTML = body.data[0].count;
      }
    })
    .catch(err => err);
};

/**
 * Get total number of posted questions by user
 */
const getTotalCommentedQuestions = () => {
  // comments/user endpoint url
  const url = 'https://meet-up-questioner.herokuapp.com/api/v1/comments/user';

  // make a GET request to comments/user
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      if (body.status === 200) {
        // get sidebar element container (span.total-comments)
        const totalCommentsContainer = document.querySelector('.total-comments');

        // Display total number of commented question
        totalCommentsContainer.innerHTML = body.data[0].count;
      }
    })
    .catch(err => err);
};

/**
 * Fetch and populate user table with scheduled upcoming meetup details
 */
const getAllRsvps = () => {
  showOverlay();
  getTotalPostedQuestions();
  getTotalCommentedQuestions();
  // meetup rsvp endpoint url
  const url = 'https://meet-up-questioner.herokuapp.com/api/v1/meetups/rsvps';

  // make a GET request to meetups/rsvps
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();
      const feedbackContainer = document.querySelector('.feedback-message');

      if (body.status === 200) {
        let output = '';
        body.data.forEach((meetup) => {
          const formatedDate = moment(meetup.happeningon).format('dddd, MMMM Do YYYY, h:mm:ss a');
          output += `<tr>
                        <td>${meetup.topic}</td>
                        <td>${meetup.location}</td>
                        <td>${formatedDate}</td>
                      </tr>`;
        });

        // remove error if any
        feedbackContainer.classList.remove('feedback-message-error');

        // get meetup rsvps table body
        const tableBody = document.querySelector('.table-body');

        // Display all meetup rsvps record
        tableBody.innerHTML = output;
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.add('feedback-message-error');

        // redirect to login if token has expired
        checkExpiredToken(body);
      }
    })
    .catch((err) => {
      if (err) {
        window.location.href = 'user-dashboard.html';
      }
    });
};
getAllRsvps();
