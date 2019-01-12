#---------------------------------------------------------------------------------#
# Feed images through Google Cloud Vision API to isolate handwriting versus text. #
# Jeffrey Shen                                                                    #
#---------------------------------------------------------------------------------#

import io
import os
import sys
import json
from spellCheck import SpellCheck

from google.cloud import vision_v1p3beta1 as vision

if len(sys.argv) < 3:
    sys.exit()

## Instantiates an image transcriber
class ImageOCR:
    def __init__(self, corpus=[]):
        self.client = vision.ImageAnnotatorClient()
        self.spellCheck = SpellCheck(corpus=corpus)

    def annotate(self, path, metadata):
        file_name = path

        with io.open(file_name, 'rb') as image_file: # Loads the image into memory
            content = image_file.read()

        image = vision.types.Image(content=content)

        # Process the Images
        data = {}
        if self.isHandwritten(image):
            data = self.handwrittenOCR(image)
            data["handwritten"] = True
        else:
            data = self.typedOCR(image)
            data["handwritten"] = False

        # Include the metadata
        data["metadata"] = metadata

        print(json.dumps(data))

    def isHandwritten(self, image): #Returns whether the API says the image has handwriting in it
        response = self.client.label_detection(image=image)
        labels = response.label_annotations

        # If the labels include "handwriting", it's considered handwritten
        for label in labels:
            if label.description == "handwriting":
                return True

        return False

    def handwrittenOCR(self, image): # Transcribes content with some handwritten text
        image_context = vision.types.ImageContext(language_hints=['en-t-i0-handwrit'])
        response = self.client.document_text_detection(image=image, image_context=image_context)
        return self.formatText(response.full_text_annotation, True)

    def typedOCR(self, image): # Transcribes content with all typed text with format preserved
        response = self.client.document_text_detection(image=image)
        return self.formatText(response.full_text_annotation, False)

    def formatText(self, annotation, handwritten): # Returns the transcription formatted with line breaks
        lines = ""
        breaks = vision.enums.TextAnnotation.DetectedBreak.BreakType
        languages = []

        # Preserve Line Breaks
        for page in annotation.pages:
            for block in page.blocks:
                for paragraph in block.paragraphs:
                    line = ""
                    for word in paragraph.words:
                        for symbol in word.symbols:

                            # Grab the language of the block
                            for language in symbol.property.detected_languages:
                                if language.language_code not in languages:
                                    languages.append(language.language_code)

                            # Format breaks
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

        if "zh" not in languages and not handwritten:
            lines = self.spellCheck.check(lines)

        return {
            "lines": lines,
            "raw": lines.replace('\n', ' ').replace(" - ", ""),
            "languages": languages
        }

path = sys.argv[1]
metadata = json.loads(sys.argv[2])

ocr = ImageOCR()
ocr.annotate(path, metadata)
