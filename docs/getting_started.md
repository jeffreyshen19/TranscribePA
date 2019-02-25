# Getting Started

This document will guide you through installing TranscribePA and running it locally.

## Prerequisites

To setup TranscribePA, you will need to have Node.js and MongoDB installed. You can install Node.js [here](https://nodejs.org/en/download/) and MongoDB [here](https://docs.mongodb.com/manual/installation/).

## Installation

In the directory you'd like to install TranscribePA:
```
git clone https://github.com/jeffreyshen19/TranscribePA
cd TranscribePA
npm run setup
```
Now, all dependencies have been installed. However, in order to access all features, further setup is required.

### Google Cloud Vision

Google Cloud Vision integration is necessary for the automatic transcription functionality to work. To do this:

1. [Create a new project on the Google Cloud](https://console.cloud.google.com/cloud-resource-manager)
2. [Enable billing for that project](https://cloud.google.com/billing/docs/how-to/modify-project). **Be aware that Google Cloud Vision DOES cost money**.
3. [Enable the Cloud Vision API for that project](https://console.cloud.google.com/flows/enableapi?apiid=vision.googleapis.com).
4. [Create a service account](https://console.cloud.google.com/iam-admin/serviceaccounts).
5. [Create a service key](https://console.cloud.google.com/apis/credentials). On this page, click "Create Credentials", and from the dropdown select "Service account key". Then, select the correct service account and click "JSON" as the output format. Save the file as "service-keys.json" and store it in the root directory of this project. **TranscribePA will not work without this**.

## Running the Server

First, you need to start a mongoDB server.  
On OSX:

```
cd <mongodb-install-directory>/bin
./mongod
```
On Windows:
1. Create the folder `C:\data\db`
2. cd to `C:\Program Files\MongoDB\Server\[version]\bin`
3. Run `./mongod`

Then, in another shell, cd to the directory of TranscribePA and run `npm run start`. You can then visit the website at localhost:3000.

## Creating admin accounts

For security reasons, the first admin account must be created using the command line. To do this, start up the database and run the following command:

```
npm run admin
```

You will be prompted to enter a username, a name, and a password. Once successfully creating an admin account, you can log in to TranscribePA at /admin. There, you can upload collections, review transcriptions, and create or delete admin accounts using the web interface.

Once one admin account is created, other accounts can be created at /admin/settings.

## Configuration

* Customize various attributes (i.e. name of the website, contact information, and more) in config.json. See below for a breakdown of all fields in config.json:
  * **title**: The name of the website (default: TranscribePA).
  * **description**: A short website description (one sentence).
  * **author**: The name of the website administrator.
  * **email**: The email address users should contact.
  * **social**: A list of social networks for the institution. "name" should be facebook, snapchat, instagram, or twitter (lowercase) and "url" should be the link to that social profile.
  * **favicon**: The url of the website's favicon. Place image in /graphics and reference the path **excluding** /graphics from the path.
  * **institution**: The name of the institution.
  * **institution_url**: The main website of the institution.
  * **db_url**: The url of the database. This shouldn't have to be changed, except for production.
  * **cover_img_url**: The url of the home page's image. Place image in /graphics and reference the path **excluding** /graphics from the path.
* All files in /markdown can be edited. These files (i.e. privacy policy, about page, etc.) are all written in markdown and will automatically be converted into HTML.
* All styles can be edited. All styles are contained in /public/src/SCSS. In particular, to easily change colors and fonts, edit the definitions in `_theme.scss`. On changing styles, just run `gulp` in the root directory of TranscribePA.
