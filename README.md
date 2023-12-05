# ☁️ CH2-PS020-CC

Cloud Computing part of FitSync.

Team members:

| Name                            | ID          |
| ------------------------------- | ----------- |
| Alida Shidqiya Naifa Ulmulikhun | C248BSX4205 |
| Muhammad Alfayed Dennita        | C134BSY3479 |

## 🔑 Environment Variables

### General

- `ENVIRONMENT` [development, production]
- `IS_LOCAL` [true, false]
- `API_KEY`
- `PORT`

### Database

- `DB_HOST`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_DIALECT`

### JWT

- `ACCESS_TOKEN_PRIVATE_KEY`
- `REFRESH_TOKEN_PRIVATE_KEY`

### Email Transporter

- `EMAIL_TRANSPORTER_HOST` (Development/Testing)
- `EMAIL_TRANSPORTER_PORT` (Development/Testing)
- `EMAIL_TRANSPORTER_SERVICE` (Production)
- `EMAIL_TRANSPORTER_USERNAME`
- `EMAIL_TRANSPORTER_PASSWORD`
- `EMAIL_TRANSPORTER_NAME`

## 🔗 API Documentation

**Base URL:**

https://fitsync-main-api-k3bfbgtn5q-et.a.run.app/

**Global Headers:**

- `x-api-key`: STRING - 🔸Required
  - Value: b5242882-b5ab-43e3-a846-384bf7e0e22d
- `x-smtp-host`: STRING (required for development)
  - Value: _Get at https://ethereal.email_
- `x-smtp-port`: STRING (required for development)
  - Value: _Get at https://ethereal.email_
- `x-smtp-username`: STRING (required for development)
  - Value: _Get at https://ethereal.email_
- `x-smtp-password`: STRING (required for development)
  - Value: _Get at https://ethereal.email_

**Global Possible Responses:**

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Validation error.",
  "validationErrors": [
    {
      "type": "<string>",
      "msg": "<string>",
      "path": "<string>",
      "location": "<string>"
    }
  ]
}
```

🔴 **500** Internal Server Error

```json
{
  "status": "error",
  "message": "Internal server error."
}
```

---

### 🚪 A. Authentication & Authorization

#### 🟧 A.1 Register: `POST` - /auth/register

**Body:**

- `email`: STRING - 🔸Required
  - Should be a valid format.
  - Should be not already used and verified.
- `password`: STRING - 🔸Required
  - Min. length: 8.
- `passwordConfirmation`: STRING - 🔸Required
  - Should be matched `password`.
- `name`: STRING - 🔹Optional
- `gender`: STRING - 🔹Optional
  - ['male', 'female'] (case insensitive).
- `birthDate`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `level`: STRING - 🔹Optional
  - ['beginner', 'intermediate', 'expert'] (case insensitive).
- `goalWeight`: FLOAT - 🔹Optional
- `height`: FLOAT - 🔹Optional
  - Should paired with `weight`.
- `weight`: FLOAT - 🔹Optional
  - Should paired with `height`.

**Possible Responses:**

🟢 **201** Created or **200** OK

```json
{
  "status": "success",
  "message": "User registered successfully. OTP code sent.",
  "user": {
    "id": "<string>"
  }
}
```

---

#### 🟧 A.2 Register OTP: `POST`- /auth/register/otp

**Body:**

- `userId`: STRING - 🔸Required
  - User should be existed.
- `code`: STRING - 🔸Required
  - Length: 4.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User sucessfully verified.",
  "user": {
    "id": "<string>"
  }
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "User doesn't have an active OTP code."
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Session expired."
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "OTP code is incorrect."
}
```

---

#### 🟧 A.3 Login: `POST` - /auth/login

**Body:**

- `email`: STRING - 🔸Required
  - Should be a valid format.
  - User should be existed.
  - User should be verified.
- `password`: STRING - 🔸Required

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User successfully logged in. Access token and refresh token created.",
  "user": {
    "id": "<string>",
    "accessToken": "<string>",
    "refreshToken": "<string>"
  }
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Password is incorrect."
}
```

---

#### 🟧 A.4 Logout: `POST` - /auth/logout

**Headers:**

- `authorization`: STRING - 🔸Required
  - Access token.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User successfully logged out. Refresh token destroyed.",
  "user": {
    "id": "<string>"
  }
}
```

🔴 **401** Unauthorized

```json
{
  "status": "fail",
  "message": "Unauthorized. Need access token."
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "User already logged out."
}
```

---

#### 🟧 A.5 Refresh Token: `POST` - /auth/refresh-token

**Body:**

- `refreshToken`: STRING - 🔸Required
  - Should be existed.

**Possible Responses:**

🟢 **201** Created

```json
{
  "status": "success",
  "message": "Access token updated.",
  "user": {
    "id": "<string>",
    "accessToken": "<string>",
    "refreshToken": "<string>"
  }
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Can't create access token.",
  "error": "<string>"
}
```

---

#### 🟧 A.6 Forgot Password - Request: `POST` - /auth/forgot-password/request

**Body:**

- `email`: STRING - 🔸Required
  - Should be a valid format.
  - User should be existed.
  - User should be verified.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "OTP code successfully sent.",
  "user": {
    "id": "<string>"
  }
}
```

---

#### 🟧 A.7 Forgot Password - OTP: `POST` - /auth/forgot-password/otp

**Body:**

- `userId`: STRING - 🔸Required
  - User should be existed.
  - User should be verified.
- `code`: STRING - 🔸Required
  - Length: 4.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "Verification success. User ready to change their password.",
  "user": {
    "id": "<string>"
  }
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "User doesn't have an active OTP code."
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Session expired."
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "OTP code is incorrect."
}
```

---

#### 🟧 A.8 Forgot Password - Change: `POST` - /auth/forgot-password/change

**Body:**

- `userId`: STRING - 🔸Required
  - User should be existed.
  - User should be verified.
- `password`: STRING - 🔸Required
  - Min. length: 8.
- `passwordConfirmation`: STRING - 🔸Required
  - Should be matched `password`.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User password successfully changed.",
  "user": {
    "id": "<string>"
  }
}
```

---

#### 🟧 A.9 Refresh OTP: `POST` - /auth/otp/refresh

**Body:**

- `userId`: STRING - 🔸Required
  - User should be existed.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "OTP code successfully refreshed and sent.",
  "user": {
    "id": "<string>"
  }
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "User doesn't have an active OTP code."
}
```

---

### 🧑 B. Me

**Subglobal Headers:**

- `authorization`: STRING - 🔸Required
  - Access token.

**Subglobal Possible Responses:**

🔴 **401** Unauthorized

```json
{
  "status": "fail",
  "message": "Unauthorized. Need access token."
}
```

🔴 **401** Unauthorized

```json
{
  "status": "fail",
  "message": "Access token expired. Please refresh it.",
  "error": "jwt expired"
}
```

---

#### :page_with_curl: B.1 Personal Data

##### 🟩 B.1.1 Get Me: `GET` - /me

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User data found.",
  "user": {
    "id": "<string>",
    "email": "<string>",
    "isVerified": "<boolean>",
    "name": "<string>",
    "gender": "<string>",
    "birthDate": "<string>",
    "level": "<string>",
    "goalWeight": "<string>",
    "photoUrl": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>",
    "latestBMI": {
      "id": "<integer>",
      "height": "<integer>/<float>/<string>",
      "weight": "<integer>/<float>/<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  }
}
```

---

##### 🟪 B.1.2 Patch Me: `PATCH` - /me

**Body:**

- `name`: STRING - 🔹Optional
- `gender`: STRING - 🔹Optional
  - ['male', 'female'] (case insensitive).
- `birthDate`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `level`: STRING - 🔹Optional
  - ['beginner', 'intermediate', 'expert'] (case insensitive).
- `goalWeight`: FLOAT - 🔹Optional

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User successfully patched.",
  "user": {
    "id": "<string>",
    "email": "<string>",
    "isVerified": "<boolean>",
    "name": "<string>",
    "gender": "<string>",
    "birthDate": "<string>",
    "level": "<string>",
    "goalWeight": "<string>",
    "photoUrl": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

---

##### 🟦 B.1.3 Update My Photo: `PUT` - /me/photo

**Body:**

- `photo`: FILE - 🔸Required
  - MIME types: ['image/png', 'image/jpeg'].
  - Max. size: 2MB.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User photo successfully changed.",
  "user": {
    "id": "<string>",
    "photoUrl": "<string>"
  }
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Please upload the photo."
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Photo MIME type should be [image/png, image/jpeg]."
}
```

🔴 **400** Bad Request

```json
{
  "status": "fail",
  "message": "Photo size can't be larger than 2MB."
}
```

🔴 **500** Internal Server Error

```json
{
  "status": "error",
  "message": "<string>"
}
```

---

#### :chart_with_upwards_trend: B.2 BMIs

##### 🟩 B.2.1 Get All BMIs: `GET` - /me/bmis

**Query Parameters:**;

- `orderType`: STRING - 🔹Optional
  - ['asc', 'desc'] (case-insensitive).
- `from`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `to`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `limit`: INTEGER - 🔹Optional
- `offset`: INTEGER - 🔹Optional

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User BMIs successfully retrieved.",
  "bmis": [
    {
      "id": "<integer>",
      "height": "<integer>/<float>/<string>",
      "weight": "<integer>/<float>/<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

---

##### 🟩 B.2.2 Get One BMI: `GET` - /me/bmis/{id}

**Path Parameters:**

- `id`: STRING/INTEGER - 🔸Required
  - BMI's id.
  - BMI should be existed.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "BMI successfully retrieved.",
  "bmi": {
    "id": "<integer>",
    "height": "<integer>/<float>/<string>",
    "weight": "<integer>/<float>/<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

🔴 **403** Forbidden

```json
{
  "status": "fail",
  "message": "Forbidden."
}
```

---

##### 🟧 B.2.3 Add BMI: `POST` - /me/bmis

**Body:**

- `height`: FLOAT - 🔸Required
- `weight`: FLOAT - 🔸Required

**Possible Responses:**

🟢 **201** Created

```json
{
  "status": "success",
  "message": "BMI succesfully added.",
  "bmi": {
    "id": "<integer>",
    "height": "<integer>/<float>/<string>",
    "weight": "<integer>/<float>/<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

---

#### :cartwheeling: B.3 Workouts

##### 🟩 B.3.1 Get All Workouts: `GET` - /me/workouts

**Query Parameters:**;

- `orderType`: STRING - 🔹Optional
  - ['asc', 'desc'] (case-insensitive).
- `from`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `to`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `limit`: INTEGER - 🔹Optional
- `offset`: INTEGER - 🔹Optional

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User workouts successfully retrieved.",
  "workouts": [
    {
      "id": "<integer>",
      "exerciseId": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

---

##### 🟩 B.3.2 Get One Workout: `GET` - /me/workouts/{id}

**Path Parameters:**

- `id`: STRING/INTEGER - 🔸Required
  - Workout's id.
  - Workout should be existed.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "Workout successfully retrieved.",
  "workout": {
    "id": "<integer>",
    "exerciseId": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

🔴 **403** Forbidden

```json
{
  "status": "fail",
  "message": "Forbidden."
}
```

---

##### 🟧 B.3.3 Add Workout: `POST` - /me/workouts

**Body:**

- `exerciseId`: STRING/INTEGER - 🔸Required
  - Exercise should be existed.

**Possible Responses:**

🟢 **201** Created

```json
{
  "status": "success",
  "message": "Workout successfully added.",
  "workout": {
    "id": "<integer>",
    "exerciseId": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

---

### 💪 C. Exercises

#### 🟩 C.1 Get All Exercises: `GET` - /exercises

**Query Parameters:**

- `titleStartsWith`: STRING - 🔹Optional
- `type`: STRING - 🔹Optional
  - ['strength', 'stretching', 'aerobic'] (case insensitive).
- `level`: STRING - 🔹Optional
  - ['beginner', 'intermediate', 'expert'] (case insensitive).
- `gender`: STRING - 🔹Optional
  - ['male', 'female'] (case insensitive).
- `limit`: INTEGER - 🔹Optional
  - Min. value: 1.
- `offset`: INTEGER - 🔹Optional
  - Min. value: 1.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "Exercises successfully retrieved.",
  "exercises": [
    {
      "id": "<string>",
      "title": "<string>",
      "type": "<string>",
      "level": "<string>",
      "gender": "<string>",
      "bodyPart": "<string>",
      "desc": "<string>",
      "jpg": "<string>",
      "gif": "<string>",
      "duration": {
        "sec": "<string>",
        "rep": "<string>",
        "set": "<string>",
        "min": "<string>",
        "desc": "<string>"
      }
    }
  ]
}
```

---

#### 🟩 C.2 Get One Exercise: `GET` - /exercises/{id}

**Path Parameters:**

- `id`: STRING/INTEGER - 🔸Required
  - Exercise's id.
  - Exercise should be existed.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "Exercise successfully retrieved.",
  "exercise": {
    "id": "<string>",
    "title": "<string>",
    "type": "<string>",
    "level": "<string>",
    "gender": "<string>",
    "bodyPart": "<string>",
    "desc": "<string>",
    "jpg": "<string>",
    "gif": "<string>",
    "duration": {
      "sec": "<string>",
      "rep": "<string>",
      "set": "<string>",
      "min": "<string>",
      "desc": "<string>"
    }
  }
}
```

---

### Object Properties

#### validationError

```json
{
  "type": "<string>",
  "msg": "<string>",
  "path": "<string>",
  "location": "<string>"
}
```

#### user

```json
{
  "id": "<string>",
  "email": "<string>",
  "isVerified": "<boolean>",
  "name": "<string>",
  "gender": "<string>",
  "birthDate": "<string>",
  "level": "<string>",
  "goalWeight": "<string>",
  "photoUrl": "<string>",
  "createdAt": "<string>",
  "updatedAt": "<string>",
  "latestBMI": {
    "id": "<integer>",
    "height": "<integer>/<float>/<string>",
    "weight": "<integer>/<float>/<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  },
  "accessToken": "<string>",
  "refreshToken": "<string>"
}
```

#### bmi

```json
{
  "id": "<integer>",
  "height": "<integer>/<float>/<string>",
  "weight": "<integer>/<float>/<string>",
  "createdAt": "<string>",
  "updatedAt": "<string>"
}
```

#### workout

```json
{
  "id": "<integer>",
  "exerciseId": "<string>",
  "createdAt": "<string>",
  "updatedAt": "<string>"
}
```

#### exercises

```json
{
  "id": "<string>",
  "title": "<string>",
  "type": "<string>",
  "level": "<string>",
  "gender": "<string>",
  "bodyPart": "<string>",
  "desc": "<string>",
  "jpg": "<string>",
  "gif": "<string>",
  "duration": {
    "sec": "<string>",
    "rep": "<string>",
    "set": "<string>",
    "min": "<string>",
    "desc": "<string>"
  }
}
```

---

[🔗 Back to Top API Documentation](#-api-documentation)

[:top: Back to Very Top](#%EF%B8%8F-ch2-ps020-cc)
