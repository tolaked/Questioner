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
    listItem += '<li class=\'feedback-list-item\'>Please fill the required field below.</li>';
  } else if (responseData.status === 200) {
    listItem += `<li class='feedback-list-item'>${responseData.data[0].message}</li>`;
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

const signIn = (e) => {
  e.preventDefault();

  resetFields();

  showOverlay();

  // get form data
  const userEmail = document.getElementById('sign-in-email').value;
  const userPassword = document.getElementById('sign-in-password').value;
  const feedbackContainer = document.querySelector('.feedback-message');

  const url = 'https://meet-up-questioner.herokuapp.com/api/v1/auth/login';

  const formData = {
    email: userEmail,
    password: userPassword,
  };

  // make post request to sign in route
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();

      // check for success status
      if (body.status === 200) {
        // store user data in browser local storage
        const userData = JSON.stringify({
          username: body.data[0].user.lastname,
          token: body.data[0].token,
          access: body.data[0].user.access,
        });
        localStorage.setItem('user', userData);

        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.remove('feedback-message-error');
        feedbackContainer.classList.add('feedback-message-success');
        window.scrollTo(0, 0);

        // redirect user to dashboard after 2 seconds
        if (body.data[0].user.access) {
          setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
          }, 1000);
        } else {
          setTimeout(() => {
            window.location.href = 'user-dashboard.html';
          }, 1000);
        }
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.add('feedback-message-error');
        window.scrollTo(0, 0);
        // cycle over each element in the error array
        // cycle over each form field next sibling
        // check and display error if any
        body.error.forEach((element) => {
          Object.keys(formData).forEach((key) => {
            if (element.key === key) {
              document.querySelector(`.${element.key}`).style.border = '0.7px solid #dc3545';
              document.querySelector(`.${element.key}`).nextElementSibling.innerHTML = element.Rule;
            }
          });
        });
      }
    })
    .catch(err => err);
};

const signInBtn = document.getElementById('sign-in-btn');

// bind click event to sign in button
signInBtn.addEventListener('click', signIn);
