const feedbackContainer = document.querySelector('.feedback-message');

const showOverlay = () => {
  document.querySelector('.overlay').style.display = 'block';
};

const hideOverlay = () => {
  document.querySelector('.overlay').style.display = 'none';
};

const displayFeedback = (responseData) => {
  feedbackContainer.innerHTML = `<li class='feedback-list-item'>${responseData.error}</li>`;
  feedbackContainer.classList.add('feedback-message-error');
  window.scrollTo(0, 0);
};

/**
 * Fetch all meetup record
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
        feedbackContainer.classList.remove('feedback-message-error');
        let output = '';
        body.data.forEach((meetup) => {
          const formatedDate = moment(meetup.happeningon).format('dddd, MMMM Do YYYY, h:mm:ss a');
          output += `<div class="upcoming__meetup__container">
                  <a href="view-meetup-details.html?id=${meetup.id}" class="upcoming__meetup br" data-meetup="${meetup.id}">
                    <figure class="upcoming__media">
                      <img src="./img/question_img/thumbnail_meetup.jpg" alt="" // class="upcoming__img">
                    </figure>

                    <header class="upcoming__header">
                      <h3 class="upcoming__meetup__topic" > Topic: <small class= "upcoming__meetup__topic-content">${meetup.topic}</small></h3>
                      <h4 class = "upcoming__category"> Location: <small class = "upcoming__meetup__topic-content">${meetup.location}</small></h4>
                      <h4 class= "upcoming__category">Date: <small class="upcoming__meetup__topic-content">${formatedDate}</small></h4>
                    </header>

                    <div class="upcoming__body">
                      <span class="accept__btn">View details</span>
                    </div>
                  </a>
                </div>`;
        });

        // get meetup container (select option)
        const meetupContainer = document.getElementById('all-meetup-container');

        // Display all meetup record
        meetupContainer.innerHTML = output;
      } else {
        displayFeedback(body);
      }
    })
    .catch(err => err);
};

// fetch all meetup record
getAllMeetup();
