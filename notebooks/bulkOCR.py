#------------------------------------------------------------#
# Will bulk transcribe a collection. Pass it a metadata.csv, #
# and it will return a folder of JSONs                       #
# Jeffrey Shen                                               #
#------------------------------------------------------------#

from ocr import ImageOCR # Custom code to read files
import csv
import os
import sys

def bulkTranscribe(inputPath, outputPath, metadataPath, corpus=[]):
    ocr = ImageOCR(corpus=corpus)
    for document in parseCSV(metadataPath):
        try:
            ocr.annotate(os.path.join(os.path.dirname(__file__), inputPath) + document["filename"] + ".jpg", os.path.join(os.path.dirname(__file__), outputPath) + document["filename"] + ".json", document["metadata"])
        except:
            print("ERROR TRANSCRIBING " + document["filename"])

    print("DONE TRANSCRIBING")

def parseCSV(metadataPath): #Returns an array of dicts representing each image to parse
    with open(metadataPath) as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=',')
        data = []
        for row in csv_reader:
            ## Don't parse anything unless there's a filename column
            if "filename" in row:
                files = []

                # Sometimes names will appear with || delimiting multiple files. For these, split by this, and output a seperate JSON for each of these files. THESE FILES ARE RELATED.
                if "||" in row["filename"]:
                    files = row["filename"].split("||")
                else:
                    files = [row["filename"]]

                # Delete filepath and filename from the metadata so it doesn't clutter the metadata
                row.pop('filename', None)
                row.pop('filepath', None)

                ## Go through the files, and push all its metadata to the data arr.
                for file in files:
                    data.append({
                        "filename": file,
                        "metadata": row
                    })

        return data

bulkTranscribe("../data/scans/", "../output/transcribed/", "../data/scans/metadata.csv")
