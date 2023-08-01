# uniVerse

uniVerse is a powerful and scalable social media backend service designed to support various social networking features. It provides a robust API that allows developers to build applications with social media functionalities

* Live service available at : ```https://universe-e6hf.onrender.com```

<!--
![Er Diagram](https://raw.githubusercontent.com/SH7072/uniVerse/main/assets/Ers.png)
-->
## Schema Design
<p align="center"><img align='center' src='https://raw.githubusercontent.com/SH7072/uniVerse/main/assets/Ers.png' width='700'><p>


## Features

- Authenticate 
- Follow 
- Unfollow 
- Create post
- Delete post
- Add comment to a post
- Like a post
- Unlike a post

## Code Summary

The API is built using Node.js and Express.js, and connects to a MongoDB database for data storage.

The following endpoints are implemented:

    1. POST /api/authenticate: performs user authentication and returns a JWT token.

    2. POST /api/follow/{id}: follows a user with the given ID.

    3. POST /api/unfollow/{id}: unfollows a user with the given ID.

    4. GET /api/user: retrieves the authenticated user's profile.

    5. POST /api/posts/: creates a new post.

    6. DELETE /api/posts/{id}: deletes a post with the given ID.

    7. POST /api/like/{id}: likes a post with the given ID.

    8. POST /api/unlike/{id}: unlikes a liked post with the given ID.

    9. POST /api/comment/{id}: adds a comment to a post with the given ID.

    10. GET /api/posts/{id}: retrieves a single post with the given ID.

    11. GET /api/all_posts: retrieves all posts created by the authenticated user.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


```
`PORT` - 3232

`MONGO_URI`

`JWT_SECRET`

`JWT_EXPIRES_IN` - specify the time after which the token should expire

```

## To run on local system :

* GIT clone the repo from : ```https://github.com/SH7072/uniVerse/```

* To install the dependencies run : ```npm install```

* To start the server  : ```node app.js```

* Then the request can be sent to  : ```http://localhost:3232/```. 
