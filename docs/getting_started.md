# Getting Started

This document will guide you through installing TranscribePA, running it on your device, and deploying it to a server.

## Setup

### Creating the Database

### Google Cloud Vision

[STILL INCOMPLETE]
A JSON file of service keys are generated when using the Google cloud. For obvious security reasons, these aren't shared, but they are essential to using this API.

```
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-keys.json
pip install --upgrade google-cloud-vision
```

### Admin accounts

To upload collections and review documents, you must create an admin account. For security reasons, this is done using a command line tool:

```
npm run admin
```

You will be prompted to enter a username, a name, and a password. Once successfully creating an admin account, you can log in to TranscribePA at /admin. There, you can upload collections, review transcriptions, and create or delete admin accounts using the web interface.

## Deploying

## Customization
