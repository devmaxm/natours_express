## Installation

```bash
$ yarn install
```

## Configure .env file

```bash
PORT=server_port

PORT=3000
# password should be between <>. Example: mongodb+srv://user:<password>...
DB=db_string
DB_PASSWORD=db_password

BCRYPT_SALT=bcrypt_salt

JWT_ACCESS_SECRET=jwt_access_sercret_key
JWT_EXPIRES_IN=jwt_access_expires
JWT_COOKIE_EXPIRES_IN=jwt_access_cookie_expires_in # value in hours 

STRIPE_PUBLISH_KEY=stripe_publish_key
STRIPE_SECRET_KEY=stripe_secret_key

# settings for mailing. https://mailtrap.io/
EMAIL_HOST=email_host
EMAIL_PORT=email_port
EMAIL_USER=email_user
EMAIL_PASS=email_pass

# key for map in front-end. https://www.mapbox.com/
MAP_ACCESS_KEY=map_access_key
```

## Auth
<sub>Auth by JWT Bearer. For some CRUD operations user must have the admin role</sub>

## AUTH Endpoints


`REGISTER` POST [/api/users/register](#/api/users/register) </br>

`body`

```
{
    "username": string,
    "password": string,
    "passwordConfirm": string,
}
``` 
<sub>Return user with token</sub></br>

</br>`LOGIN` POST [/api/users/login](#/api/users/login) </br>

`body`

```
{
    "username": string,
    "password": string
}
```
<sub>Return user with token</sub></br>

</br>`CURRENT USER` GET [/api/users/me](#/api/users/me) </br>
<sub>* Auth required. Return current user with token</sub></br>
`body`

``` 
{
    "username": string,
    "password": string
}
```
<sub>Return auth response</sub></br>

</br>`FORGOT PASSWORD` POST [/api/users/forgot-password](#/api/auth/forgot-password) </br>
<sub>Sends the user a password reset link</sub></br>
`body`

```
{
    "email": string,
}
```
<sub>Return user with token</sub></br></br>

</br>`RESET FORGOTEN PASSWORD` POST [/api/users/forgot-password/{token}](#/api/auth/forgot-password/{token}) </br>
<sub>Reset user password.</sub></br>
`body`

```
{
    "password": string,
    "passwordConfirm": string
}
```
<sub>Return user with token</sub></br></br>