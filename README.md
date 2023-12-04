# :cloud: CH2-PS020-CC

Cloud Computing part of FitSync.

Team members:

| Name                            | ID          |
| ------------------------------- | ----------- |
| Alida Shidqiya Naifa Ulmulikhun | C248BSX4205 |
| Muhammad Alfayed Dennita        | C134BSY3479 |

## :key: Environment Variables

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

## :link: API Documentation

**Base URL**:

https://fitsync-main-api-k3bfbgtn5q-et.a.run.app/

**Global Headers**:

- `x-api-key`: STRING (:small_orange_diamond:Required)
  - **Value**: b5242882-b5ab-43e3-a846-384bf7e0e22d
- `x-smtp-host`: STRING (required for development)
  - **Value**: _Get on https://ethereal.email_
- `x-smtp-port`: STRING (required for development)
  - **Value**: _Get on https://ethereal.email_
- `x-smtp-username`: STRING (required for development)
  - **Value**: _Get on https://ethereal.email_
- `x-smtp-password`: STRING (required for development)
  - **Value**: _Get on https://ethereal.email_

**Global Possible Responses:**

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Validation error.",
  "errors": "Array<Error>"
}
```

:red_circle: **500** Internal Server Error

```json
{
  "status": "error",
  "message": "Internal server error."
}
```

---

### :door: A. Authentication & Authorization

#### :orange_square: A.1 Register: `POST` - /auth/register

**Body:**

- `email`: STRING (:small_orange_diamond:Required)
  - Should be a valid format.
  - Should be not already used and verified.
- `password`: STRING (:small_orange_diamond:Required)
  - Min. length: 8.
- `passwordConfirmation`: STRING (:small_orange_diamond:Required)
  - Should be matched `password`.
- `name`: STRING (:small_blue_diamond:Optional)
- `gender`: STRING (:small_blue_diamond:Optional)
  - ['male', 'female'] (case insensitive).
- `birthDate`: STRING (:small_blue_diamond:Optional)
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `level`: STRING (:small_blue_diamond:Optional)
  - ['beginner', 'intermediate', 'expert'] (case insensitive).
- `goalWeight`: FLOAT (:small_blue_diamond:Optional)
- `height`: FLOAT (:small_blue_diamond:Optional)
  - Should paired with `weight`.
- `weight`: FLOAT (:small_blue_diamond:Optional)
  - Should paired with `height`.

**Possible Responses:**

:green_circle: **201** Created or **200** OK

```json
{
  "status": "success",
  "message": "User registered successfully. OTP code sent.",
  "data": {
    "user": {
      "id": "<UserId>"
    }
  }
}
```

---

#### :orange_square: A.2 Register OTP: `POST`- /auth/register/otp

**Body:**

- `userId`: STRING (:small_orange_diamond:Required)
  - User should be existed.
- `code`: STRING (:small_orange_diamond:Required)
  - Length: 4.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User sucessfully verified.",
  "data": {
    "user": {
      "id": "<UserId>"
    }
  }
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "User doesn't have an active OTP code."
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Session expired."
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "OTP code is incorrect.",
};
```

---

#### :orange_square: A.3 Login: `POST` - /auth/login

**Body:**

- `email`: STRING (:small_orange_diamond:Required)
  - Should be a valid format.
  - User should be existed.
  - User should be verified.
- `password`: STRING (:small_orange_diamond:Required)

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User successfully logged in. Access token and refresh token created.",
  "data": {
    "user": {
      "id": "<UserId>"
    },
    "accessToken": "<AccessToken>",
    "refreshToken": "<RefreshToken>"
  }
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Password is incorrect."
}
```

---

#### :orange_square: A.4 Logout: `POST` - /auth/logout

**Headers:**

- `authorization`: STRING (:small_orange_diamond:Required)
  - Access token.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User successfully logged out. Refresh token destroyed.",
  "data": {
    "user": {
      "id": "<UserId>"
    }
  }
}
```

:red_circle: **401** Unauthorized

```json
{
  "status": "fail",
  "message": "Unauthorized. Need access token."
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "User already logged out."
}
```

---

#### :orange_square: A.5 Refresh Token: `POST` - /auth/refresh-token

**Body:**

- `refreshToken`: STRING (:small_orange_diamond:Required)
  - Should be existed.

**Possible Responses:**

:green_circle: **201** Created

```json
{
  "status": "success",
  "message": "Access token updated.",
  "data": {
    "user": {
      "id": "<UserId>"
    },
    "accessToken": "<AccessToken>",
    "refreshToken": "<RefreshToken>"
  }
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Can't create access token.",
  "error": "<Error>"
}
```

---

#### :orange_square: A.6 Forgot Password - Request: `POST` - /auth/forgot-password/request

**Body:**

- `email`: STRING (:small_orange_diamond:Required)
  - Should be a valid format.
  - User should be existed.
  - User should be verified.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "OTP code successfully sent.",
  "data": {
    "user": {
      "id": "<UserId>"
    }
  }
}
```

---

#### :orange_square: A.7 Forgot Password - OTP: `POST` - /auth/forgot-password/otp

**Body:**

- `userId`: STRING (:small_orange_diamond:Required)
  - User should be existed.
  - User should be verified.
- `code`: STRING (:small_orange_diamond:Required)
  - Length: 4.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "Verification success. User ready to change their password.",
  "data": {
    "user": {
      "id": "<UserId>"
    }
  }
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "User doesn't have an active OTP code."
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Session expired."
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "OTP code is incorrect.",
};
```

---

#### :orange_square: A.8 Forgot Password - Change: `POST` - /auth/forgot-password/change

**Body:**

- `userId`: STRING (:small_orange_diamond:Required)
  - User should be existed.
  - User should be verified.
- `password`: STRING (:small_orange_diamond:Required)
  - Min. length: 8.
- `passwordConfirmation`: STRING (:small_orange_diamond:Required)
  - Should be matched `password`.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User password successfully changed.",
  "data": {
    "user": {
      "id": "<UserId>"
    }
  }
}
```

---

#### :orange_square: A.9 Refresh OTP: `POST` - /auth/otp/refresh

**Body:**

- `userId`: STRING (:small_orange_diamond:Required)
  - User should be existed.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "OTP code successfully refreshed and sent.",
  "data": {
    "user": {
      "id": "<UserId>"
    }
  }
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "User doesn't have an active OTP code."
}
```

---

### :adult: B. Me

**Subglobal Headers:**

- `authorization`: STRING (:small_orange_diamond:Required)
  - Access token.

**Subglobal Possible Responses:**

:red_circle: **401** Unauthorized

```json
{
  "status": "fail",
  "message": "Unauthorized. Need access token."
}
```

---

#### :page_with_curl: B.1 Personal Data

##### :green_square: B.1.1 Get Me: `GET` - /me

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User data found.",
  "data": {
    "user": {
      "id": "<UserId>",
      "email": "<UserEmail>",
      "isVerified": "<UserIsVerified>",
      "name": "<UserName>",
      "gender": "<UserGender>",
      "birthDate": "<UserBirthDate>",
      "level": "<UserLevel>",
      "goalWeight": "<UserGoalWeight>",
      "photoUrl": "<UserPhotoURL>",
      "createdAt": "<UserCreatedAt>",
      "updatedAt": "<UserUpdatedAt>",
      "latestBMI": {
        "id": "<BMIId>",
        "height": "<BMIHeight>",
        "weight": "<BMIWeight>",
        "createdAt": "<BMICreatedAt>",
        "updatedAt": "<BMIUpdatedAt>"
      }
    }
  }
}
```

---

##### :purple_square: B.1.2 Patch Me: `PATCH` - /me

**Body:**

- `name`: STRING (:small_blue_diamond:Optional)
- `gender`: STRING (:small_blue_diamond:Optional)
  - ['male', 'female'] (case insensitive).
- `birthDate`: STRING (:small_blue_diamond:Optional)
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `level`: STRING (:small_blue_diamond:Optional)
  - ['beginner', 'intermediate', 'expert'] (case insensitive).
- `goalWeight`: FLOAT (:small_blue_diamond:Optional)

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User successfully patched.",
  "data": {
    "user": {
      "id": "<UserId>",
      "email": "<UserEmail>",
      "isVerified": "<UserIsVerified>",
      "name": "<UserName>",
      "gender": "<UserGender>",
      "birthDate": "<UserBirthDate>",
      "level": "<UserLevel>",
      "goalWeight": "<UserGoalWeight>",
      "photoUrl": "<UserPhotoURL>",
      "createdAt": "<UserCreatedAt>",
      "updatedAt": "<UserUpdatedAt>",
      "latestBMI": {
        "id": "<BMIId>",
        "height": "<BMIHeight>",
        "weight": "<BMIWeight>",
        "createdAt": "<BMICreatedAt>",
        "updatedAt": "<BMIUpdatedAt>"
      }
    }
  }
}
```

---

##### :blue_square: B.1.3 Update My Photo: `PUT` - /me/photo

**Body:**

- `photo`: FILE (:small_orange_diamond:Required)
  - Max. size: 2MB.
  - MIME types: ['image/png', 'image/jpeg'].

**Body Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User photo successfully changed.",
  "data": {
    "user": {
      "id": "<UserId>",
      "photoUrl": "<UserPhotoURL>"
    }
  }
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Please upload the photo."
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Photo MIME type should be [image/png, image/jpeg]."
}
```

:red_circle: **400** Bad Request

```json
{
  "status": "fail",
  "message": "Photo size can't be larger than 2MB."
}
```

:red_circle: **500** Internal Server Error

```json
{
  "status": "error",
  "message": "<ErrorMessage>"
}
```

---

#### :chart_with_upwards_trend: B.2 BMIs

##### :green_square: B.2.1 Get All BMIs: `GET` - /me/bmis

**Query Parameters:**;

- `order`: STRING (:small_blue_diamond:Optional)
  - ['asc', 'desc'] (case-insensitive).
- `from`: STRING (:small_blue_diamond:Optional)
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `to`: STRING (:small_blue_diamond:Optional)
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `limit`: INTEGER (:small_blue_diamond:Optional)
- `offset`: INTEGER (:small_blue_diamond:Optional)

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User BMIs successfully retrieved.",
  "data": {
    "user": {
      "id": "<UserID>",
      "bmis": "Array<BMI>"
    }
  }
}
```

---

##### :green_square: B.2.2 Get One BMI: `GET` - /me/bmis/:id

**Path Parameters:**

- `:id`: STRING/INTEGER (:small_orange_diamond:Required)
  - BMI's id.
  - BMI should be existed.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "BMI successfully retrieved.",
  "data": {
    "user": {
      "id": "<UserId>"
    },
    "bmi": {
      "id": "<BMIId>",
      "height": "<BMIHeight>",
      "weight": "<BMIWeight>",
      "createdAt": "<BMICreatedAt>",
      "updatedAt": "<BMIUpdatedAt>"
    }
  }
}
```

:red_circle: **403** Forbidden

```json
{
  "status": "fail",
  "message": "Forbidden."
}
```

---

##### :orange_square: B.2.3 Add BMI: `POST` - /me/bmis

**Body:**

- `height`: FLOAT (:small_orange_diamond:Required)
- `weight`: FLOAT (:small_orange_diamond:Required)

**Possible Responses:**

:green_circle: **201** CREATED

```json
{
  "status": "success",
  "message": "BMI succesfully added.",
  "data": {
    "user": {
      "id": "<UserId>"
    },
    "bmi": {
      "id": "<BMIId>",
      "height": "<BMIHeight>",
      "weight": "<BMIWeight>",
      "createdAt": "<BMICreatedAt>",
      "updatedAt": "<BMIUpdatedAt>"
    }
  }
}
```

---

#### :cartwheeling: B.3 Workouts

##### :green_square: B.3.1 Get All Workouts: `GET` - /me/workouts

**Query Parameters:**;

- `order`: STRING (:small_blue_diamond:Optional)
  - ['asc', 'desc'] (case-insensitive).
- `from`: STRING (:small_blue_diamond:Optional)
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `to`: STRING (:small_blue_diamond:Optional)
  - Format: YYYY-MM-DD or YYYY/MM/DD.
- `limit`: INTEGER (:small_blue_diamond:Optional)
- `offset`: INTEGER (:small_blue_diamond:Optional)

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "User workouts successfully retrieved.",
  "data": {
    "user": {
      "id": "<UserId>",
      "workouts": "Array<Workout>"
    }
  }
}
```

---

##### :green_square: B.3.2 Get One Workout: `GET` - /me/workouts/:id

**Path Parameters:**

- `:id`: STRING/INTEGER (:small_orange_diamond:Required)
  - Workout's id.
  - Workout should be existed.

**Possible Responses:**

:green_circle: **200** OK

```json
{
  "status": "success",
  "message": "Workout successfully retrieved.",
  "data": {
    "user": {
      "id": "<UserId>"
    },
    "workout": {
      "id": "<WorkoutId>",
      "exerciseId": "<WorkoutExerciseId>",
      "createdAt": "<WorkoutCreatedAt>",
      "updatedAt": "<WorkoutUpdatedAt>"
    }
  }
}
```

:red_circle: **403** Forbidden

```json
{
  "status": "fail",
  "message": "Forbidden."
}
```

---

##### :orange_square: B.3.3 Add Workout: `POST` - /me/workouts

**Body:**

- `exerciseId`: STRING (:small_orange_diamond:Required)
  - Exercise should be existed.

**Possible Responses:**

:green_circle: **201** CREATED

```json
{
  "status": "success",
  "message": "Workout successfully added.",
  "data": {
    "user": {
      "id": "<UserId>"
    },
    "workout": {
      "id": "<WorkoutId>",
      "exerciseId": "<WorkoutExerciseId>",
      "createdAt": "<WorkoutCreatedAt>",
      "updatedAt": "<WorkoutUpdatedAt>"
    }
  }
}
```

---

[:link: Back to Top API Documentation](#api-documentation)

[:top: Back to Very Top](#ch2-ps020-cc)
