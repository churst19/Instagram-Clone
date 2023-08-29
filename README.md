Link to site: https://instagram-clone3000.herokuapp.com/signin

From this I learned how to
authenticate users,
hash passwords,
use local storage,
create a backend to a website including the database and image server and API requests,
dynamically display posts based on content from the server,
became more familiar with react and javascript

Note to use this website, it does not vurrently require you to use a real email address or verify it,
so you can easily create a new user and look at the website.

More information on the site:
First a signup and signin routes were created. signup check wether a user exists in the MongoDB database already and if not, creates the user. It takes the user's password, hashes it with salt using bcrypt and passes the hashed result to the server. At login, bcrypt compares the password entered to the hashed password in the database and if it matches a JSON Web Token is provided and stored in localstorage.

User posts are created in the "Create Post" tab where the data from the form is saved to state and upon submission, the image is sent to cloudinary, returning a URL that is sent to the server with the form data.

An authenticator middleware was created on the server to check whether or not a user has access to view certain material by checking their JWT in local storage.

On pages where posts are displayed, authentication is checked, Posts are pulled from the server, saved to the data state, then mapped to cards to be displayed.

This project was a tutorial from Coders Never Quit on Youtube.
Source:https://www.youtube.com/playlist?list=PLB97yPrFwo5g0FQr4rqImKa55F_aPiQWk
