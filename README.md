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
- `API_KEY` (🔐 Secret)
- `PORT`

### URLs

- `ML_BASE_URL`

### Cloud Storage

- `USER_PHOTOS_BUCKET`

### Database

- `DB_HOST`
- `DB_USERNAME`
- `DB_PASSWORD` (🔐 Secret)
- `DB_NAME`
- `DB_DIALECT`

### JWT

- `ACCESS_TOKEN_PRIVATE_KEY` (🔐 Secret)
- `REFRESH_TOKEN_PRIVATE_KEY` (🔐 Secret)

### Email Transporter

- `EMAIL_TRANSPORTER_HOST` (🛠️ Development/Testing)
- `EMAIL_TRANSPORTER_PORT` (🛠️ Development/Testing)
- `EMAIL_TRANSPORTER_SERVICE` (🌏 Production)
- `EMAIL_TRANSPORTER_USERNAME`
- `EMAIL_TRANSPORTER_PASSWORD` (🔐 Secret)
- `EMAIL_TRANSPORTER_NAME`

### Typesense

- `TYPESENSE_HOST`
- `TYPESENSE_PORT`
- `TYPESENSE_PROTOCOL`
- `TYPESENSE_API_KEY` (🔐 Secret)

## 🔗 API Documentation

**Base URL:**

- 🛠️ Development: https://fitsync-main-api-k3bfbgtn5q-et.a.run.app
- 🌏 Production: https://prod-fitsync-main-api-k3bfbgtn5q-et.a.run.app

**Global Headers:**

- `Content-Type`: STRING - 🔸Required
  - ['application/json', 'application/x-www-form-urlencoded']
- `x-api-key`: STRING - 🔸Required
  - Value: [See API Key](https://console.cloud.google.com/security/secret-manager/secret/fitsync-main-api-API_KEY/versions?project=fitsync-406408)
- `x-smtp-host`: STRING (required for development)
  - Value: _Get at https://ethereal.email_
- `x-smtp-port`: INTEGER (required for development)
  - Value: _Get at https://ethereal.email_
- `x-smtp-username`: STRING (required for development)
  - Value: _Get at https://ethereal.email_
- `x-smtp-password`: STRING (required for development)
  - Value: _Get at https://ethereal.email_

**Responses Format:**

🟢 Success

```json
{
  "status": "success",
  "message": "<string>",
  "<data>": "<object>/<array>/<string>"
}
```

Data list:

- user
- bmis
- bmi
- workouts
- workout
- exercises
- exercise
- nutrition

🔴 Fail

```json
{
  "status": "fail",
  "message": "<string>",
  "<data>": "<object>/<array>/<string>"
}
```

Data list:

- error
- validationErrors

🔴 Error

```json
{
  "status": "error",
  "message": "<string>"
}
```

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

🔴 **401** Unauthorized

```json
{
  "status": "fail",
  "message": "API key is invalid."
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

**Endpoint:** `/auth/register`

**Body:**

- `email`: STRING - 🔸Required
  - Should be a valid format.
  - Shouldn't have been used and verified.
- `password`: STRING - 🔸Required
  - Min. length: 8.
- `passwordConfirmation`: STRING - 🔸Required
  - Should be matched `password`.
- `name`: STRING - 🔹Optional
- `gender`: STRING - 🔹Optional
  - ['male', 'female'] (case insensitive).
- `birthDate`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD (UTC+0).
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

#### 🟧 A.2 Register - OTP: `POST`- /auth/register/otp

**Endpoint:** `/auth/register/otp`

**Body:**

- `userId`: STRING - 🔸Required
  - User should exist.
- `code`: STRING - 🔸Required
  - Length: 4.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User successfully verified.",
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

**Endpoint:** `/auth/login`

**Body:**

- `email`: STRING - 🔸Required
  - Should be a valid format.
  - User should exist.
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

**Endpoint:** `/auth/logout`

**Headers:**

- `Authorization`: STRING - 🔸Required
  - Bearer + Access token.
  - "Bearer {accessToken}"

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

**Endpoint:** `/auth/refresh-token`

**Body:**

- `refreshToken`: STRING - 🔸Required
  - Should exist.

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

**Endpoint:** `/auth/forgot-password/request`

**Body:**

- `email`: STRING - 🔸Required
  - Should be a valid format.
  - User should exist.
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

**Endpoint:** `/auth/forgot-password/otp`

**Body:**

- `userId`: STRING - 🔸Required
  - User should exist.
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

**Endpoint:** `/auth/forgot-password/change`

**Body:**

- `userId`: STRING - 🔸Required
  - User should exist.
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
  "message": "User's password successfully changed.",
  "user": {
    "id": "<string>"
  }
}
```

---

#### 🟧 A.9 Refresh OTP: `POST` - /auth/otp/refresh

**Endpoint:** `/auth/otp/refresh`

**Body:**

- `userId`: STRING - 🔸Required
  - User should exist .

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

- `Authorization`: STRING - 🔸Required
  - Bearer + Access token.
  - "Bearer {accessToken}"

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

#### 📃 B.1 Personal Data

##### 🟩 B.1.1 Get Me: `GET` - /me

**Endpoint:** `/me`

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User successfully retrieved.",
  "user": {
    "id": "<string>",
    "email": "<string>",
    "isVerified": "<boolean>",
    "name": "<string>",
    "gender": "<string>",
    "birthDate": "<string>",
    "level": "<string>",
    "goalWeight": "<float>",
    "photoUrl": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>",
    "latestBMI": {
      "id": "<integer>",
      "height": "<float>",
      "weight": "<float>",
      "date": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  }
}
```

---

##### 🟪 B.1.2 Patch Me: `PATCH` - /me

**Endpoint:** `/me`

**Body:**

- `name`: STRING - 🔹Optional
- `gender`: STRING - 🔹Optional
  - ['male', 'female'] (case insensitive).
- `birthDate`: STRING - 🔹Optional
  - Format: YYYY-MM-DD or YYYY/MM/DD (UTC+0).
- `level`: STRING - 🔹Optional
  - ['beginner', 'intermediate', 'expert'] (case insensitive).
- `goalWeight`: FLOAT - 🔹Optional
- `height`: FLOAT - 🔹Optional
  - Should paired with `weight`.
- `weight`: FLOAT - 🔹Optional
  - Should paired with `height`.

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
    "goalWeight": "<float>",
    "photoUrl": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>",
    "latestBMI": {
      "id": "<integer>",
      "height": "<float>",
      "weight": "<float>",
      "date": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  }
}
```

---

##### 🟦 B.1.3 Update My Photo: `PUT` - /me/photo

> [!NOTE]
> The image will be converted & compressed into JPG format with a size of 256×256 pixels.

**Endpoint:** `/me/photo`

**Body:**

- `photo`: FILE - 🔸Required
  - MIME types: ['image/png', 'image/jpeg'].
  - Max. size: 2MB.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's photo successfully changed.",
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

#### 📈 B.2 BMIs

##### 🟩 B.2.1 Get All BMIs: `GET` - /me/bmis

**Endpoint:** `/me/bmis`

**Query Parameters:**

- `dateFrom`: STRING - 🔹Optional
  - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
- `dateTo`: STRING - 🔹Optional
  - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
- `orderType`: STRING - 🔹Optional
  - ['asc', 'desc'] (case insensitive).
  - Order by `date`.
- `limit`: INTEGER - 🔹Optional
  - Min. value: 0.
  - Default value: 10.
  - Set 0 to disable limit.
  - Set > 0 to enable limit.
- `offset`: INTEGER - 🔹Optional
  - Min. value: 1.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's BMIs successfully retrieved.",
  "bmis": [
    {
      "id": "<integer>",
      "height": "<float>",
      "weight": "<float>",
      "date": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

---

##### 🟩 B.2.2 Get One BMI: `GET` - /me/bmis/{id}

**Endpoint:** `/me/bmis/{id}`

**Path Parameters:**

- `id`: STRING/INTEGER - 🔸Required
  - BMI's id.
  - BMI should exist.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's BMI successfully retrieved.",
  "bmi": {
    "id": "<integer>",
    "height": "<float>",
    "weight": "<float>",
    "date": "<string>",
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

##### 🟦 B.2.3 Add/Update One BMI: `PUT` - /me/bmis

**Endpoint:** `/me/bmis`

**Body:**

- `height`: FLOAT - 🔸Required
- `weight`: FLOAT - 🔸Required
- `date`: STRING - 🔹Optional
  - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
  - Default value: current date & time.

**Possible Responses:**

🟢 **201** Created or **200** OK

```json
{
  "status": "success",
  "message": "User's BMI succesfully added/updated.",
  "bmi": {
    "id": "<integer>",
    "height": "<float>",
    "weight": "<float>",
    "date": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

---

##### 🟦 B.2.4 Add/Update Many BMIs: `PUT` - /me/bmis/many

**Endpoint:** `/me/bmis/many`

**Body:**

- `bmis`: ARRAY - 🔸Required
  - `height`: FLOAT - 🔸Required
  - `weight`: FLOAT - 🔸Required
  - `date`: STRING - 🔹Optional
    - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
    - Default value: current date & time.

**Raw Body:**

```json
{
  "bmis": [
    {
      "height": "<float>",
      "weight": "<float>",
      "date": "<string>"
    }
  ]
}
```

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's BMIs succesfully added.",
  "bmis": [
    {
      "id": "<integer>",
      "height": "<float>",
      "weight": "<float>",
      "date": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

---

#### 🤸 B.3 Workouts

##### 🟩 B.3.1 Get All Workouts: `GET` - /me/workouts

**Endpoint:** `/me/workouts`

**Query Parameters:**

- `detail`: BOOLEAN - 🔹Optional
  - [true, false, 0, 1].
- `dateFrom`: STRING - 🔹Optional
  - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
- `dateTo`: STRING - 🔹Optional
  - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
- `ratingFrom`: INTEGER - 🔹Optional
  - Range: 1-10.
  - Should be lesser than `ratingTo`.
- `ratingTo`: INTEGER - 🔹Optional
  - Range: 1-10.
  - Should be greater than `ratingFrom`.
- `orderType`: STRING - 🔹Optional
  - ['asc', 'desc'] (case insensitive).
  - Order by `date`.
- `limit`: INTEGER - 🔹Optional
  - Min. value: 0.
  - Default value: 10.
  - Set 0 to disable limit.
  - Set > 0 to enable limit.
- `offset`: INTEGER - 🔹Optional
  - Min. value: 1.

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's workouts successfully retrieved.",
  "workouts": [
    {
      "id": "<integer>",
      "exerciseId": "<string>",
      "rating": "<integer>",
      "date": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

🟢 **200** OK (Detail)

```json
{
  "status": "success",
  "message": "User's workouts successfully retrieved.",
  "workouts": [
    {
      "id": "<integer>",
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
      },
      "rating": "<integer>",
      "date": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

---

##### 🟩 B.3.2 Get One Workout: `GET` - /me/workouts/{id}

**Endpoint:** `/me/workouts/{id}`

**Path Parameters:**

- `id`: STRING/INTEGER - 🔸Required
  - Workout's id.
  - Workout should exist.

**Query Parameters:**

- `detail`: BOOLEAN - 🔹Optional
  - [true, false, 0, 1].

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's workout successfully retrieved.",
  "workout": {
    "id": "<integer>",
    "exerciseId": "<string>",
    "rating": "<integer>",
    "date": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

🟢 **200** OK (Detail)

```json
{
  "status": "success",
  "message": "User's workout successfully retrieved.",
  "workout": {
    "id": "<integer>",
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
    },
    "rating": "<integer>",
    "date": "<string>",
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

##### 🟧 B.3.3 Add One Workout: `POST` - /me/workouts

**Endpoint:** `/me/workouts`

**Body:**

- `exerciseId`: STRING - 🔸Required
  - Exercise should exist.
- `rating`: INTEGER - 🔹Optional
  - Range: 1-10.
- `date`: STRING - 🔹Optional
  - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
  - Default value: current date & time.

**Possible Responses:**

🟢 **201** Created

```json
{
  "status": "success",
  "message": "User's workout successfully added.",
  "workout": {
    "id": "<integer>",
    "exerciseId": "<string>",
    "rating": "<integer>",
    "date": "<string>",
    "createdAt": "<string>",
    "updatedAt": "<string>"
  }
}
```

---

##### 🟧 B.3.4 Add Many Workouts: `POST` - /me/workouts/many

**Endpoint:** `/me/workouts/many`

**Body:**

- `workouts`: ARRAY - 🔸Required
  - `exerciseId`: STRING - 🔸Required
    - Exercise should exist.
  - `rating`: INTEGER - 🔹Optional
    - Range: 1-10.
  - `date`: STRING - 🔹Optional
    - Format: ISO 8601, YYYY-MM-DDTHH:mm:ssZ (UTC+0).
    - Default value: current date & time.

**Raw Body:**

```json
{
  "workouts": [
    {
      "exerciseId": "<string>",
      "rating": "<integer>",
      "date": "<string>"
    }
  ]
}
```

**Possible Responses:**

🟢 **201** Created

```json
{
  "status": "success",
  "message": "User's workout successfully added.",
  "workouts": [
    {
      "id": "<integer>",
      "exerciseId": "<string>",
      "rating": "<integer>",
      "date": "<string>",
      "createdAt": "<string>",
      "updatedAt": "<string>"
    }
  ]
}
```

---

#### 🔮 B.4 Recommendation

##### 🟩 B.4.1 Get Exercises Recommendation: `GET` - /me/recommendation/exercises

**Endpoint:** `/me/recommendation/exercises`

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's exercises recommendation successfully retrieved.",
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

🔴 **503** Service Unavailable

```json
{
  "status": "error",
  "message": "Failed to get recommendation.",
  "error": "ML API Error: <string>"
}
```

---

##### 🟩 B.4.2 Get Nutrition Recommendation: `GET` - /me/recommendation/nutrition

**Endpoint:** `/me/recommendation/nutrition`

**Possible Responses:**

🟢 **200** OK

```json
{
  "status": "success",
  "message": "User's nutrition recommendation successfully retrieved.",
  "nutrition": {
    "estimatedCalories": "<float>",
    "estimatedCarbohydrates": "<float>",
    "estimatedFat": "<float>",
    "estimatedProteinMean": "<float>"
  }
}
```

🔴 **503** Service Unavailable

```json
{
  "status": "error",
  "message": "Failed to get recommendation.",
  "error": "ML API Error: <string>"
}
```

---

### 💪 C. Exercises

#### 🟩 C.1 Get All Exercises: `GET` - /exercises

**Endpoint:** `/exercises`

**Query Parameters:**

- `title`: STRING - 🔹Optional
- `type`: STRING - 🔹Optional
  - ['strength', 'stretching', 'aerobic'] (case insensitive).
- `level`: STRING - 🔹Optional
  - ['beginner', 'intermediate', 'expert'] (case insensitive).
- `gender`: STRING - 🔹Optional
  - ['male', 'female'] (case insensitive).
- `orderType`: STRING - 🔹Optional
  - ['asc', 'desc'] (case insensitive).
  - Order by `title`.
- `limit`: INTEGER - 🔹Optional
  - Min. value: 0.
  - Default value: 10.
  - Set 0 to disable limit.
  - Set > 0 to enable limit.
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

**Endpoint:** `/exercises/{id}`

**Path Parameters:**

- `id`: STRING - 🔸Required
  - Exercise's id.
  - Exercise should exist.

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
  "value": "<string>",
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
  "goalWeight": "<float>",
  "photoUrl": "<string>",
  "createdAt": "<string>",
  "updatedAt": "<string>",
  "latestBMI": {
    "id": "<integer>",
    "height": "<float>",
    "weight": "<float>",
    "date": "<string>",
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
  "height": "<float>",
  "weight": "<float>",
  "date": "<string>",
  "createdAt": "<string>",
  "updatedAt": "<string>"
}
```

#### workout

```json
{
  "id": "<integer>",
  "exerciseId": "<string>",
  "rating": "<integer>",
  "date": "<string>",
  "createdAt": "<string>",
  "updatedAt": "<string>"
}
```

#### exercise

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

#### nutrition

```json
{
  "estimatedCalories": "<float>",
  "estimatedCarbohydrates": "<float>",
  "estimatedFat": "<float>",
  "estimatedProteinMean": "<float>"
}
```

---

[🔗 Back to The Top of API Documentation](#-api-documentation)

[🔝 Back to Very Top](#%EF%B8%8F-ch2-ps020-cc)
