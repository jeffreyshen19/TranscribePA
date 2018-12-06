#---------------------------------------------------------------------------------#
# Feed images through Google Cloud Vision API to isolate handwriting versus text. #
# Jeffrey Shen                                                                    #
#---------------------------------------------------------------------------------#

import io
import os
import json

from google.cloud import vision
from google.cloud.vision import types

## Instantiates an image transcriber
class ImageOCR:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient()

    def annotate(self, path, outputPath, metadata):
        file_name = os.path.join(os.path.dirname(__file__), path)
        output_file_name = os.path.join(os.path.dirname(__file__), outputPath)

        with io.open(file_name, 'rb') as image_file: # Loads the image into memory
            content = image_file.read()

        image = types.Image(content=content)

        # Process the Images
        data = {}
        if self.isHandwritten(image):
            print("Transcribing", path, " (HANDWRITTEN)")
            data = self.handwrittenOCR(image)
        else:
            print("Transcribing", path, " (TYPED)")
            data = self.typedOCR(image)

        # Include the metadata
        data["metadata"] = metadata

        # Write to JSON
        with open(output_file_name, 'w+') as outfile:
            json.dump(data, outfile)

    def isHandwritten(self, image): #Returns whether the API says the image has handwriting in it
        response = self.client.label_detection(image=image)
        labels = response.label_annotations

        # If the labels include "handwriting", it's considered handwritten
        for label in labels:
            if label.description == "handwriting":
                return True

        return False

    def handwrittenOCR(self, image): # Transcribes content with some handwritten text
        return {
            lines: [],
            raw: ""
        }

    def typedOCR(self, image): # Transcribes content with all typed text with format preserved
        response = self.client.document_text_detection(image=image)

        annotation = response.full_text_annotation
        raw = annotation.text.replace('\n', ' ').replace("- ", "") #Replace new lines and hyphens
        breaks = vision.enums.TextAnnotation.DetectedBreak.BreakType
        lines = ""

        # Preserve Line Breaks
        for page in annotation.pages:
            for block in page.blocks:
                for paragraph in block.paragraphs:
                    line = ""
                    for word in paragraph.words:
                        for symbol in word.symbols:
                            line += symbol.text
                            if symbol.property.detected_break.type == breaks.SPACE:
                                line += ' '
                            if symbol.property.detected_break.type == breaks.EOL_SURE_SPACE:
                                line += ' '
                                lines += line + "\n"
                                line = ''
                            # If the line is broken by either a hyphen or a line break, preserve the line break. This will improve readability for the user.
                            if symbol.property.detected_break.type == breaks.HYPHEN:
                                line += ' '
                                lines += line + "-\n"
                                line = ''
                            if symbol.property.detected_break.type == breaks.LINE_BREAK:
                                lines += line + "\n"
                                lines += "\n"
                                line = ''

        return {
            "lines": lines,
            "raw": raw
        }
