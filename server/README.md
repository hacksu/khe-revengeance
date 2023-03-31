# Authentication

User clicks link and is sent to Discord/Github. They redirect the user back to us; we get their token, make an API request with their token and find out who they are, then make an API request through the Staff Auth App and find out what role to give them. Then we either find or make them user account form them and then add a session and then send them the token for the session. Wrap fetch in javascript to use token? Only API methods should need Auth.
