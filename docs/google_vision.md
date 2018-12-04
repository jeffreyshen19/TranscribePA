# Google Vision
Documentation for how I used the Google Vision API.

## Installing Client Library
A JSON file of service keys are generated when using the Google cloud. For obvious security reasons, these aren't shared, but they are essential to using this API.

```
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-keys.json
pip install --upgrade google-cloud-vision
```
