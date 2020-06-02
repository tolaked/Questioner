# meet-up-questioner

Crowd-source questions for a meetup. Questioner helps the meetup organizer prioritize questions to be answered. Other users can vote on asked questions and they bubble to the top or bottom of the log.

[![Build Status](https://travis-ci.org/abidex4yemi/meet-up-questioner.svg?branch=develop)](https://travis-ci.org/abidex4yemi/meet-up-questioner)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/codeclimate/codeclimate/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/abidex4yemi/meet-up-questioner/badge.svg?branch=develop)](https://coveralls.io/github/abidex4yemi/meet-up-questioner?branch=develop)

## Required Features

- User can sign up
- User can sign in
- Admin Users can **view all meetup record**
- Admin Users can **view meetup record by ID**
- Users can ask question
- Users can view all **upcoming meetups**
- user can **accept or decline scheduled meet up**
- Admin Users can **create a new meetup record**
- Admin Users can **edit a meet up record**
- Admin Users can **delete a meet up record**
- Admin Users can **delete a specific question record**
- Admin Users can **add images a meet up record**
- Admin Users can **add tags meet up record**
- Users can **Down vote a meet up question**
- Users can **Up vote a meet up question**
- Users can **Comment on a specific question**
- Users can **Ask question**

## Technologies

- Node JS
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis CI
- Code Climate & Coveralls

## Requirements and Installation

To install and run this project you would need to have listed stack installed:

- Node Js
- Git

To run:

```sh
git clone <https://github.com/abidex4yemi/meet-up-questioner.git>
cd meet-up-questioner
npm install
npm start
```

## Testing

```sh
npm test
```

## API-ENDPOINTS

`- POST /api/v1/meetups Create a meetup record.`
  
`- GET /api/v1/meetups Get all meetup records.`
  
`- GET /api/v1/meetups/<:meetup-id> Get a specific meetup record.`
  
`- GET /api/v1/meetups/upcoming/ Get all upcoming meetup records.`
  
`- POST /api/v1/questions Create a question record for a specific meetup.`
  
`- PATCH /api/v1/questions/<:question-id>/upvote Upvote a specific question by 1 (increase votes by 1).`

`- PATCH /api/v1/questions/<:question-id>/downvote Downvote a specific question by 1 (decrease votes by 1).`
  
`- POST POST /api/v1/auth/signup Create a user account.`
  
`- POST /api/v1/auth/login Log a user in to the app.`
  
`- POST /api/v1/comments/ Comment on a specific question.`
  
`- GET /api/v1/comments/<:question-id>/ Get a specific question comment record.`
  
`- DELETE /api/v1/meetups/<:meetup-id> Delete a specific meetup record`

## Pivotal Tracker stories

[https://www.pivotaltracker.com/n/projects/2232110](https://www.pivotaltracker.com/n/projects/2232110)

## Template UI

You can see a hosted version of the template at [https://abidex4yemi.github.io/meet-up-questioner/index.html](https://abidex4yemi.github.io/meet-up-questioner/)

## API

The API is currently in version 1 (v1) and is hosted at

[https://meet-up-questioner.herokuapp.com/](https://meet-up-questioner.herokuapp.com/)

## API Documentation
[https://meet-up-questioner.herokuapp.com/api-docs/](https://meet-up-questioner.herokuapp.com/api-docs/)

## Author

Sulaiman Hammed A. yemi
