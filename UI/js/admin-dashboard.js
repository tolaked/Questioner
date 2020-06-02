// check for logged in user and show specific dashboard
if (localStorage.getItem('user')) {
  const rawUserData = localStorage.getItem('user');
  const userData = JSON.parse(rawUserData);
  const userName = document.querySelector('.dashboard-username');
  // check if user have access to admin dashboard
  if (userData.access) {
    // set username
    userName.innerHTML = userData.username;
  } else {
    window.location.href = 'sign-in.html';
  }
} else {
  window.location.href = 'sign-in.html';
}

/**
 * Create Meetup modal
 */

// Get the button that opens the modal
const createMeetupButton = document.getElementById('create-meetup');

// When the user clicks on the button, open the modal
createMeetupButton.addEventListener('click', () => {
  // Get the  create-meetup-modal modal
  const createMeetupModal = document.getElementById('create-meetup-modal');

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];

  createMeetupModal.style.display = 'block';

  // When the user clicks on <span> (x), close the modal
  span.addEventListener('click', () => {
    createMeetupModal.style.display = 'none';
  });

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener('click', (event) => {
    if (event.target === createMeetupModal) {
      createMeetupModal.style.display = 'none';
    }
  });
});

// log a user out and redirect back to home page
const logout = () => {
  this.localStorage.setItem('user', '');
};

const logoutBtn = document.querySelector('.logout');

logoutBtn.addEventListener('click', logout);
