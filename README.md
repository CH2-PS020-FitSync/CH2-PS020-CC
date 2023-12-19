# ☁️ CH2-PS020-CC &nbsp;<img src="assets/fitsync-logo.svg" alt="FitSync" height="30" />

**Cloud Computing part of FitSync**

![Development Version](https://img.shields.io/github/v/tag/CH2-PS020-FitSync/CH2-PS020-CC?filter=*-dev&style=flat-square&label=Development%20Version&color=3498db) ![Production Version](https://img.shields.io/github/v/tag/CH2-PS020-FitSync/CH2-PS020-CC?filter=!*-dev&style=flat-square&label=Production%20Version&color=2ecc71)

![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white) ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

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

- `STATIC_ASSETS_BUCKET`
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

## 📝 Steps to Replicate This Project

This project is used as a back-end app for the FitSync Android app.

**Requirements:**

- Code Editor (Recommendation: Visual Studio Code)
- Node.js v20.10.0 & NPM
- Postman
- Google Cloud Project

**Environments:**

- Development environment on the local machine.
- Development environment on the cloud machine (Cloud Run).
- Production environment on the cloud machine (Cloud Run).

### A. Create a Google Cloud project

Create a Google Cloud project on the [Google Cloud Platform (GCP)](https://console.cloud.google.com/).

### B. Create a Firestore Database

Create a Firestore database on the [Firestore](https://console.cloud.google.com/firestore/databases) page. Make sure the mode should be **Native**.

### C. Set Up a Typesense Server

1. Create a VM instance on the [Compute Engine](https://console.cloud.google.com/compute/instances) page. If the Compute Engine API is not yet enabled, please enable it first. The VM will be used for the Typesense server. This project uses Typesense to easily index data on the Firestore. Follow the required options below.
   - **Boot disk -> Image:** Debian GNU/Linux 11 (bullseye)
   - **Firewall:**
     - Allow HTTP traffic
     - Allow HTTPS traffic
   - **Advanced Options -> Networking -> Network interfaces -> Edit default network -> External IPv4 address -> RESERVE STATIC EXTERNAL IP ADDRESS**. After that, please note/save the static external IP address.
   - **Advanced Options -> Management -> Metadata:**
     - enable-config = TRUE
     - enable-guest-attributes = TRUE
2. Open the VM's terminal via SSH. Run this command to install the Typesense server.
   ```sh
   curl -O https://dl.typesense.org/releases/0.25.1/typesense-server-0.25.1-amd64.deb
   sudo apt install ./typesense-server-0.25.1-amd64.deb
   ```
3. Open the Typesense config by running this command.
   ```sh
   sudo nano /etc/typesense/typesense-server.ini
   ```
4. Change the `api-port` to `443` and note/save the `api-key` value.
5. Restart the Typesense service by running this command.
   ```sh
   sudo systemctl restart typesense-server.service
   ```
6. Check the server status by running this command.
   ```sh
   curl http://localhost:443/health
   ```
7. Make sure the response is like this to show the server is running well.
   ```json
   { "ok": true }
   ```
8. Set up the `exercises` Typesense collection schema. To define the collection schema, you can make this request using Postman.
   - **Method:** POST
   - **URL:** http://**[YOUR_TYPESENSE_IP_ADDRESS]**:443/collections
   - **Headers:**
     - `x-typesense-api-key`: **[YOUR_TYPESENSE_API_KEY]**
   - **Body (JSON):**
     ```json
     {
       "name": "exercises",
       "enable_nested_fields": true,
       "fields": [
         {
           "name": "title",
           "type": "string",
           "sort": true
         },
         {
           "name": "type",
           "type": "string"
         },
         {
           "name": "level",
           "type": "string"
         },
         {
           "name": "gender",
           "type": "string"
         },
         {
           "name": "bodyPart",
           "type": "string"
         },
         {
           "name": "desc",
           "type": "string"
         },
         {
           "name": "jpg",
           "type": "string"
         },
         {
           "name": "gif",
           "type": "string"
         },
         {
           "name": "duration.sec",
           "type": "string",
           "optional": true
         },
         {
           "name": "duration.rep",
           "type": "string",
           "optional": true
         },
         {
           "name": "duration.set",
           "type": "string",
           "optional": true
         },
         {
           "name": "duration.min",
           "type": "string",
           "optional": true
         },
         {
           "name": "duration.desc",
           "type": "string",
           "optional": true
         }
       ]
     }
     ```
9. The next step is integrating the Typesense with the Firestore database. Open the [Firebase](https://console.firebase.google.com) site and add the GCP project as a Firebase project.
10. Add the Firestore/Firebase Typesense Search Extension by opening this [link](https://console.firebase.google.com/project/_/extensions/install?ref=typesense/firestore-typesense-search). After that, choose the project. Then, follow all the installation instructions until the extension is installed successfully. For the extension configuration, you can follow these options:
    - **Firestore Collection Path:** exercises
    - **Typesense Hosts:** **[YOUR_TYPESENSE_IP_ADDRESS]**
    - **Typesense API Key:** **[YOUR_TYPESENSE_API_KEY]** (Then, click the `CREATE SECRET` button)
    - **Typesense Collection Name:** exercises
    - **Flatten Nested Documents:** No
    - **Cloud Functions Location:** Jakarta (asia-southeast2)
11. Open the [Cloud Functions](https://console.cloud.google.com/functions/list) page. Click the `ext-firestore-typesense-search-backfillToTypesenseFromFirestore` function. After that, click the `EDIT` button. Add this new environment variable and deploy the new version:
    - TYPESENSE_PROTOCOL = http
12. Do the same for the `ext-firestore-typesense-search-indexToTypesenseOnFirestoreWrite` function.

### D. Set Up a MySQL Database

**Local Machine**

You can create a MySQL database on the local machine using any stacks, such as XAMPP, LAMP, Laragon, etc. Create a database with the name `main_api` or anything.

**Cloud Machine**

You can create a MySQL database on GCP using [Cloud SQL](https://console.cloud.google.com/sql).

1. Open the [Cloud SQL](https://console.cloud.google.com/sql) page.
2. Click the `CREATE INSTANCE` button.
3. Choose MySQL.
4. Set up the database configuration as you need. Make sure to note/save the `root`'s password.
5. After finishing the installation, you can note/save the instance's **Connection name**.
6. Finally, you need to create a database on that instance. Open the **Databases** tab and click the `CREATE DATABASE` button. Create a database with the name `main_api` or anything.

### E. Set Up Cloud Storage Buckets

1. Open the [Cloud Storage](https://console.cloud.google.com/storage/browser) page.
2. Create two buckets with these required options:
   - First bucket (for storing static assets)
     - **Name:** **[Fill in the unique global name]**
     - **Class:** Standard
     - **(Uncheck) Enforce public access prevention on this bucket**
     - **Access Control:** Fine-grained
   - Second bucket (for storing user photos)
     - **Name:** **[Fill in the unique global name]**
     - **Class:** Standard
     - **(Uncheck) Enforce public access prevention on this bucket**
     - **Access Control:** Uniform
3. Please note/save all the buckets' name.
4. Upload this [file](assets/fitsync-logo.png) on the first bucket. Make the file accessible to the public by adding `allUsers` as a `Reader` on the access.
5. Make the second bucket accessible to the public by adding `allUsers` as a new principal with the `Storage Object Viewer` role.

### F. Deploy & Run The Project

#### F.1 Prepare The Environment Variables

**Local Machine**

> [!IMPORTANT]
> Before you follow the next steps, you need to clone this repository first. Run the command below on your local machine to clone this project repository.

```sh
git clone https://github.com/CH2-PS020-FitSync/CH2-PS020-CC.git
```

You can define the environment variables by creating the `.env` file on the project root directory. The list of the variables can be found in this [section](#-environment-variables). For reference, you can follow this example.

```
# General
ENVIRONMENT='development'
IS_LOCAL='true'
API_KEY='[CREATE_YOUR_CUSTOM_API_KEY]'
PORT='8080'

# URLs
ML_BASE_URL='[SEE_ML_TEAM_API_DOCUMENTATION]'

# Cloud Storage
STATIC_ASSETS_BUCKET='[FIRST_BUCKET_NAME]'
USER_PHOTOS_BUCKET='[SECOND_BUCKET_NAME]'

# Database
DB_HOST='localhost'
DB_USERNAME='root'
DB_PASSWORD=''
DB_NAME='main_api'
DB_DIALECT='mysql'

# JWT
ACCESS_TOKEN_PRIVATE_KEY='[CREATE_YOUR_CUSTOM_PRIVATE_KEY]'
REFRESH_TOKEN_PRIVATE_KEY='[CREATE_YOUR_CUSTOM_PRIVATE_KEY]'

# Email Transporter
EMAIL_TRANSPORTER_HOST='smtp.ethereal.email'
EMAIL_TRANSPORTER_PORT='587'
EMAIL_TRANSPORTER_USERNAME='someone@ethereal.email'
EMAIL_TRANSPORTER_PASSWORD='strongest_password'
EMAIL_TRANSPORTER_NAME='FitSync'

# Typesense
TYPESENSE_HOST='[PUT_YOUR_TYPESENSE_EXTERNAL_IP_ADDRESS]'
TYPESENSE_PORT='443'
TYPESENSE_PROTOCOL='http'
TYPESENSE_API_KEY='[PUT_YOUR_TYPESENSE_API_KEY]'
```

You can get the `ML_BASE_URL` value by visiting the [Machine Learning team repository](https://github.com/CH2-PS020-FitSync/CH2-PS020-ML).

**Cloud Machine**

Basically, setting up the environment variables on the cloud machine is the same as on the local machine. However, for the secret variables, you need to store them first in the [Secret Manager](https://console.cloud.google.com/security/secret-manager). You are free to define the secret variables' name. But, if you want to keep everything by default as stated in the [cloudbuild.dev.yaml](cloudbuild.dev.yaml) or [cloudbuild.prod.yaml](cloudbuild.prod.yaml) files, you can follow these variables' name.

```
# Development
API_KEY=fitsync-main-api-API_KEY
DB_PASSWORD=fitsync-main-api-DB_PASSWORD
ACCESS_TOKEN_PRIVATE_KEY=fitsync-main-api-ACCESS_TOKEN_PRIVATE_KEY
REFRESH_TOKEN_PRIVATE_KEY=fitsync-main-api-REFRESH_TOKEN_PRIVATE_KEY
EMAIL_TRANSPORTER_PASSWORD=fitsync-main-api-EMAIL_TRANSPORTER_PASSWORD
TYPESENSE_API_KEY=firestore-typesense-search-TYPESENSE_API_KEY

# Production
API_KEY=fitsync-main-api-API_KEY
DB_PASSWORD=fitsync-main-api-PROD_DB_PASSWORD
ACCESS_TOKEN_PRIVATE_KEY=fitsync-main-api-ACCESS_TOKEN_PRIVATE_KEY
REFRESH_TOKEN_PRIVATE_KEY=fitsync-main-api-REFRESH_TOKEN_PRIVATE_KEY
EMAIL_TRANSPORTER_PASSWORD=fitsync-main-api-PROD_EMAIL_TRANSPORTER_PASSWORD
TYPESENSE_API_KEY=firestore-typesense-search-TYPESENSE_API_KEY
```

For the non-secret variables, you can store them on the [env.dev.yaml](env.dev.yaml) for the development environment and [env.prod.yaml](env.prod.yaml) for the production environment.

#### F.2 Prepare The Service Account

Before you run the application in the development or production environment, you must create the service account first. To create the service account, you can follow these steps.

1. Open the [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) page, then click the `CREATE SERVICE ACCOUNT` button.
2. Fill in the service account name and ID, then click the `CREATE AND CONTINUE` button.
3. Add these roles to the service account.
   - Cloud SQL Client
   - Firebase Admin SDK Administrator Service Agent
   - Secret Manager Secret Accessor
   - Storage Object Admin
4. After that, please note/save the service account email.

**Local Machine**

To use the service account, you need to download the key first.

1. Open the [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) page, then find the service account email.
2. Click the three-dots action button on the right of the service account, then click the `Manage keys` button.
3. After that, you can click the `ADD KEY` button, then click the `Create new key` button to download the key. Choose the JSON key type.
4. After downloading the service account key, you can rename the file to `main-api-cloud-run.json`, and then place it in the `keys` folder on the project root directory. The key location should be `keys/main-api-cloud-run.json`.

**Cloud Machine**

You can use the service account by updating the `--service-account` argument value in the [cloudbuild.dev.yaml](cloudbuild.dev.yaml) or [cloudbuild.prod.yaml](cloudbuild.prod.yaml) files.

#### F.3 Run the App

**Local Machine**

Run this command in the project root directory to run the app.

```sh
npm run start
```

If you're actively developing the app and need a hot reload, you can run this command.

```sh
npm run start-dev
```

Since this project uses Sequelize as an ORM, we provide the model synchronization options.

1. **Default:** Creates the table if it doesn't exist (and does nothing if it already exists).
   ```sh
   npm run start-dev
   ```
2. **Force the database:** Creates the table, dropping it first if it already existed.
   ```sh
   npm run start-dev-force
   ```
3. **Alter the database:** Checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
   ```sh
   npm run start-dev-alter
   ```

**Cloud Machine**

You can host this project app on the Cloud Run because you only pay when the app serves requests. To easily deploy and run the app, you can set up a continuous deployment flow first.

Before creating a continuous deployment flow, you need to duplicate this repository to your repository. For the simple, you can fork this repository.

1. Enable the [Cloud Run API](https://console.cloud.google.com/apis/library/run.googleapis.com) and [Cloud SQL Admin API](https://console.cloud.google.com/apis/library/sqladmin.googleapis.com).
2. Open the [Cloud Build Service Account Settings](https://console.cloud.google.com/cloud-build/settings/service-account), then enable these GCP services:
   - Cloud Run
   - Service Accounts
3. Please note/save the Cloud Build service account email that is stated on the Service Account Settings page.
4. Move to the [Cloud Build](https://console.cloud.google.com/cloud-build/dashboard) dashboard page. Then, click the `SET UP BUILD TRIGGERS` button.
5. You can specify how the Cloud Build will be triggered. For reference, you can follow these options:
   - **Name:** **[Fill in a unique name]**
   - **Region:** global (Global)
   - **Event:** Push new tag
   - **Source -> Repository:** **[Connect it to your repository]**
   - **Source -> Tag:** **[Define your RegEx rule]**
   - **Configuration -> Type:** Cloud Build configuration file (yaml or json)
   - **Configuration -> Location:** Repository
   - **Configuration -> Cloud build configuration file location:** `cloudbuild.dev.yaml` or `cloudbuild.prod.yaml`
   - **Build logs:** (Check) Send build logs to GitHub
   - **Service account -> Service account email**: **[Put the Cloud Build service account email]**
6. Now, you can push a new tag on your repository to trigger the build process.
7. Once the build process is complete, you can open the [Cloud Run](https://console.cloud.google.com/run) page to see the deployed service.
8. Click on the service. Now, you can see the service is running. You can use the app with the service URL.

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
