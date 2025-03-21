## Register
### route: POST /auth/register
body payload: 
```
{
"fullname": "your-fullname",
"username": "your-username",
"email": "your-passoword"
"password": "your-password"
}
```

## Login
### route: POST /auth/login
body payload: 
```
{
"email": "your-passoword"
"password": "your-password"
}
```

## Logout
route: POST /auth/logout

## Get Courses
route: GET /courses/

## Filter Courses
route: POST /course/filter?value="filter value"

## Search Courses
route: POST /course/search?category="column value"&value="filter value"

## Sort Courses
route: POST /course/sort?category="column value"

## Upload image
route: POST /upload

body form-data

key: image
