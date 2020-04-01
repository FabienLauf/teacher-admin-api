![node version](https://img.shields.io/badge/node-v12.16.1-blue.svg)
![npm version](https://img.shields.io/badge/npm-6.13.4-blue.svg)

# Teacher Admin API - GovTech NodeJS Assessment - Fabien Lauf

Repository of GovTech's NodeJS assessment for candidate Fabien Lauf.

## Enpoints

### Register one or more students to a specified teacher
POST http://localhost:7000/api/register

Request
```json
{
  "teacher": "teacherken@gmail.com",
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```
Response
HTTP 204 No Content

### Retrieve a list of students common to a given list of teachers
#### One teacher:
GET http://localhost:7000/api/commonstudents?teacher=teacherken%40gmail.com

Response
```json
{
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```
HTTP 200

#### Two teachers:
GET http://localhost:7000/api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com

Response
```json
{
    "students": [
        "commonstudent1@gmail.com",
        "commonstudent2@gmail.com"
    ]
}
```
HTTP 200

### Suspend a specified student
POST http://localhost:7000/api/suspend

Request
```json
{
  "student" : "studentjon@gmail.com"
}
```
Response
HTTP 204 No Content

### Retrieve a list of students who can receive a given notification
POST http://localhost:7000/api/retrievefornotifications

Request
```json
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```
Response
```json
{
    "recipients": [
        "studentjon@gmail.com",
        "studenthon@gmail.com",
        "studentagnes@gmail.com",
        "studentmiche@gmail.com"
    ]
}
```
HTTP 200

### List all the Teachers
GET http://localhost:7000/api/teachers/

### List all the Students
GET http://localhost:7000/api/students/

## Run locally
### Requirements

- NodeJS >= 12.16.1
- Npm >= 6.13.4

### Install dependencies

```shell script
npm install
```

### Install dependencies

```shell script
npm run build
```

### Run

```shell script
npm start
```

### Test

```shell script
npm test
```

### Watch

```shell script
npm run watch
```

### Enpoints

Same as above. Replace the domain by http://localhost:7000/