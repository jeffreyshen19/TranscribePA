#---------------------------------------------------------------------------------#
# Feed images through Google Cloud Vision API to isolate handwriting versus text. #
# Jeffrey Shen                                                                    #
#---------------------------------------------------------------------------------#

import io
import os

from google.cloud import vision
from google.cloud.vision import types
from pprint import pprint

# Instantiates a client
client = vision.ImageAnnotatorClient()

# The name of the image file to annotate
file_name = os.path.join(
    os.path.dirname(__file__),
    '../data/scans/StearnsCorrFolder1956_001A.jpg')

# Loads the image into memory
with io.open(file_name, 'rb') as image_file:
    content = image_file.read()

image = types.Image(content=content)

# Performs label detection on the image file
response = client.label_detection(image=image)
# labels = response.label_annotations
#
# print('Labels:')
# for label in labels:
#     print(label.description)

# Performs document detection
response = client.document_text_detection(image=image)
# print(response.full_text_annotation.text)

breaks = vision.enums.TextAnnotation.DetectedBreak.BreakType
paragraphs = []
lines = []

annotation = response.full_text_annotation

for page in annotation.pages:
    for block in page.blocks:
        for paragraph in block.paragraphs:
            para = ""
            line = ""
            for word in paragraph.words:
                for symbol in word.symbols:
                    line += symbol.text
                    if symbol.property.detected_break.type == breaks.SPACE:
                        line += ' '
                    if symbol.property.detected_break.type == breaks.EOL_SURE_SPACE:
                        line += ' '
                        lines.append(line)
                        para += line
                        line = ''
                    # If the line is broken by either a hyphen or a line break, preserve the line break. This will improve readability for the user.
                    if symbol.property.detected_break.type == breaks.HYPHEN:
                        line += ' '
                        lines.append(line + "-")
                        para += line
                        line = ''
                    if symbol.property.detected_break.type == breaks.LINE_BREAK:
                        lines.append(line)
                        lines.append("")
                        para += line
                        line = ''
            paragraphs.append(para)

for line in lines:
    print(line)
