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
  } else if (responseData.status === 201 || responseData.status === 200) {
    listItem += `<li class='feedback-list-item'>${responseData.message}</li>`;
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

/**
 * Create new user account
 * @param {*} e
 */
const createMeetup = async (e) => {
  e.preventDefault();
  resetFields();
  showOverlay();

  // get all user input values
  const meetupLocation = document.getElementById('meetup-location').value;
  const meetupTags = document.getElementById('meetup-tags').value;
  const meetupTopic = document.getElementById('meetup-topic').value;
  const meetupDate = document.getElementById('meetup-date').value;
  const file = document.getElementById('meetup-images').files[0];
  const feedbackContainer = document.querySelector('.feedback-message');

  // upload image to cloudinary server
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/din5avzpb/image/upload';
  const cloudinaryUploadPreset = 'yhi2c0zc';

  // instantiate fordData object
  const imageFile = new FormData();
  imageFile.append('file', file);
  imageFile.append('upload_preset', cloudinaryUploadPreset);

  // make a post request to the server
  const result = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: imageFile,
  })
    .then(res => res.json())
    .then(data => data.secure_url)
    .catch(err => err);

  // convert user input (string) to Array
  const meetupTagsArray = meetupTags.split();
  let imageArray = [];
  if (result) {
    imageArray = result.split();
  }

  // sign up API-endpoint url
  const url = 'https://meet-up-questioner.herokuapp.com/api/v1/meetups/';

  // User input data object
  const formData = {
    location: meetupLocation,
    tags: meetupTagsArray,
    images: imageArray,
    topic: meetupTopic,
    happeningOn: meetupDate,
  };

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

        setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
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
              if (element.key === 'tags') {
                document.querySelector(`.${element.key}`).nextElementSibling.innerHTML = 'Tags is required (e.g) tag1, tag2, tag3';
              } else {
                document.querySelector(`.${element.key}`).nextElementSibling.innerHTML = element.Rule;
              }
            }
          });
        });
      }
    })
    .catch((err) => {
      if (err) {
        window.location.href = 'admin-dashboard.html';
      }
    });
};

// Get sign up button
const createMeetupBtn = document.getElementById('create-meetup-btn');

// bind click event to sign up button
createMeetupBtn.addEventListener('click', createMeetup);


/**
 * Fetch and populate admin table with all meetup record
 */
const getAllMeetup = () => {
  showOverlay();
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
      hideOverlay();
      if (body.status === 200) {
        let output = '';
        body.data.forEach((meetup) => {
          const formatedDate = moment(meetup.happeningon).format('dddd, MMMM Do YYYY, h:mm:ss a');
          output += `<tr>
                        <td>${meetup.topic}</td>
                        <td>${meetup.location}</td>
                        <td>${formatedDate}</td>
                        <td></td>
                        <td class="edit-btn" data-meetup-id="${meetup.id}"><a href="#" class="table-action-link">Edit</a></td>
                        <td class="delete-btn" data-meetup-id="${meetup.id}"><a href="#" class="table-action-link">Delete</a></td>
                      </tr>`;
        });

        // get meetup container (select option)
        const tableBody = document.querySelector('.table-body');

        // Display all meetup record
        tableBody.innerHTML = output;
      }
    })
    .catch(err => err);
};
getAllMeetup();

/* delete meetup button parent container */
const tableContainer = document.querySelector('.table-container');
let meetupId;

/**
 * bind click event to table container
 */
tableContainer.addEventListener('click', (e) => {
  e.preventDefault();
  // check if event target is a delete button
  if (e.target.parentNode.className === 'delete-btn') {
    // get a meetup id
    meetupId = e.target.parentNode.getAttribute('data-meetup-id');

    // Get the  delete-meetup-modal modal
    const deleteMeetupModal = document.getElementById('delete-meetup-modal');

    // Get the <span> element that closes the modal
    const deleteSpan = document.getElementsByClassName('close')[1];

    // show delete confirmation modal
    deleteMeetupModal.style.display = 'block';

    // When the user clicks on <span> (x), close the modal
    deleteSpan.addEventListener('click', () => {
      deleteMeetupModal.style.display = 'none';
    });

    // When the user clicks anywhere outside of the modal, close modal
    window.addEventListener('click', (event) => {
      if (event.target === deleteMeetupModal) {
        deleteMeetupModal.style.display = 'none';
      }
    });
  }
});

/**
 * Delete a specific meetup record
 *
 * @param {*} e event object
 */
const deleteMeetup = (e) => {
  e.preventDefault();
  showOverlay();
  // check if button click is a delete button
  if (e.target.className === 'confirm-delete-btn confirm-btn') {
    // delete meetup endpoint url
    const url = `https://meet-up-questioner.herokuapp.com/api/v1/meetups/${meetupId}`;

    // make a GET request to meetups
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: userToken,
      },
    })
      .then(res => res.json())
      .then((body) => {
        hideOverlay();
        const feedbackContainer = document.querySelector('.feedback-message-delete');
        // check for success status
        if (body.status === 200) {
          feedbackContainer.innerHTML = displayFeedback(body);
          feedbackContainer.classList.remove('feedback-message-error');
          feedbackContainer.classList.add('feedback-message-success');

          setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
          }, 1000);
        } else {
          feedbackContainer.innerHTML = displayFeedback(body);
          feedbackContainer.classList.add('feedback-message-error');

          setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
          }, 1000);

          // redirect to login if token has expired
          checkExpiredToken(body);
        }
      })
      .catch(err => err);
  } else if (e.target.className === 'confirm-cancel-btn confirm-btn') {
    const deleteMeetupModal = document.getElementById('delete-meetup-modal');
    // When the user clicks on <span> (x), close the modal
    e.target.addEventListener('click', () => {
      deleteMeetupModal.style.display = 'none';
    });
  }
};

const confirmDeleteBtn = document.querySelector('.modal-footer');

confirmDeleteBtn.addEventListener('click', deleteMeetup);
