const baseUrl = 'https://meet-up-questioner.herokuapp.com/api/v1';
// feedback container
const feedbackContainer = document.querySelector('.feedback-message');
// get meetup container
const meetupContainer = document.getElementById('meetup-details-container');

/**
 * get meetup id from url parameter
 *
 * @param {void}
 *
 * @returns {number} meetupId
 */
const getId = () => {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const meetupId = url.searchParams.get('id');

  return meetupId;
};

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
 *
 * @param {object} responseData
 *
 * @returns void
 */
const displayFeedback = (responseData) => {
  let listItem = '';

  if (responseData.status === 200 || responseData.status === 201) {
    listItem += `<li class='feedback-list-item'>${responseData.message}</li>`;
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

/**
 * Fetch all meetup record
 */
const getMeetupDetails = () => {
  // store meetup id
  const meetupId = getId();

  showOverlay();
  // meetup endpoint url
  const url = `${baseUrl}/meetups/${meetupId}`;

  // make a GET request to meetups
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();

      // check success response
      if (body.status === 200) {
        feedbackContainer.classList.remove('feedback-message-error');

        // format date to a readable format
        const formatedDate = moment(body.data[0].happeningon).format('dddd, MMMM Do YYYY, h:mm:ss a');

        // meetup details markup
        const output = `<div class="meetup-single-img">
            <img src="./img/meetup_img/meetup_question_2.jpeg" alt="" class="meetup-img-1">
          </div>

          <div class="meetup-single-details">
            <h4 class="meetup-d-heading">Topic: <span>${body.data[0].topic}</span></h4>
            <h4 class="meetup-d-heading meetup-venue">Venue: <span>${body.data[0].location}</span></h4>
            <h4 class="meetup-d-heading meetup-time">Date: ${formatedDate}</h4>
            <h4 class="meetup-d-heading meetup-speaker-title">Speaker:</h4>
            <ul class="meetup-speaker">
              <li class="speaker-list">Ibrahim Olowo</li>
              <li class="speaker-list">James Grin</li>
              <li class="speaker-list">Cameron Lisa</li>
            </ul>

            <h4 class="meetup-d-heading meetup-feedback">Are you going?</h4>
            <ul class="meetup-action">
              <li class="meetup-action-list">
                <button class="meetup-action-button yes" data-meetup-id="${body.data[0].id}">YES</button>
              </li>
              <li class="meetup-action-list">
                <button class="meetup-action-button no" data-meetup-id="${body.data[0].id}">NO</button>
              </li>
              <li class="meetup-action-list">
                <button class="meetup-action-button maybe" data-meetup-id="${body.data[0].id}">MAYBE</button>
              </li>
            </ul>
          </div>`;

        // Display all meetup record
        meetupContainer.innerHTML = output;
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.add('feedback-message-error');
      }
    })
    .catch(err => err);
};

// fetch all meetup record
getMeetupDetails();

/**
 *
 *
 * @param {*} e
 * @param {*} meetupId
 * @param {*} meetupData
 */
const userResponse = (e, meetupId, meetupData) => {
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

  // meetup rsvps endpoint url
  const url = `${baseUrl}/meetups/${meetupId}/rsvps`;

  // make a POST request to meetups/:meetupId/rsvps endpoint
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify(meetupData),
  })
    .then(res => res.json())
    .then((body) => {
      // check for success status
      if (body.status === 201) {
        // get all response button
        const allButtons = document.querySelectorAll('.meetup-action-button');

        // cycle over all buttons and enable them
        const allButtonsArray = Array.prototype.slice.call(allButtons);
        allButtonsArray.forEach((element) => {
          const currentButton = element;
          currentButton.disabled = false;
          currentButton.classList.remove('disabled');
        });

        // disable current button that is being click
        e.target.disabled = true;

        // add disable class to current button
        e.target.classList.add('disabled');

        // display success message
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.remove('feedback-message-error');
        feedbackContainer.classList.add('feedback-message-success');
        window.scrollTo(0, 0);
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.add('feedback-message-error');

        // redirect to login if token has expired
        checkExpiredToken(body);
      }
    })
    .catch(err => err);
};

const meetupResponse = (e) => {
  // check for yes button
  if (e.target.classList.contains('yes')) {
    // get meetup id
    const meetupId = parseInt(e.target.getAttribute('data-meetup-id'), 10);

    // user response
    const meetupStatus = 'yes';

    const data = {
      response: meetupStatus,
    };
    userResponse(e, meetupId, data);
  }

  // check for no button
  if (e.target.classList.contains('no')) {
    // get meetup id
    const meetupId = parseInt(e.target.getAttribute('data-meetup-id'), 10);

    // user response
    const meetupStatus = 'no';

    const data = {
      response: meetupStatus,
    };
    userResponse(e, meetupId, data);
  }

  // check for maybe button
  if (e.target.classList.contains('maybe')) {
    // get meetup id
    const meetupId = parseInt(e.target.getAttribute('data-meetup-id'), 10);

    // user response
    const meetupStatus = 'maybe';

    const data = {
      response: meetupStatus,
    };
    userResponse(e, meetupId, data);
  }
};

meetupContainer.addEventListener('click', meetupResponse);
