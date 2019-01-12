#------------------------------------------------------------#
# Corrects transcription using a probabilistic spell check,  #
# including custom "context" words users can define based on #
# their collection                                           #
# Some code taken from http://norvig.com/spell-correct.html  #
# Jeffrey Shen                                               #
#------------------------------------------------------------#

import json
import os
import re
from collections import Counter

class SpellCheck:
    def __init__(self, corpus=[]):
        self.WORDS = Counter(SpellCheck.words(open('./data/corpus.txt').read().lower())) # Get the occurences of a large corpus of English texts
        self.N = sum(self.WORDS.values()) # total number of words
        self.custom_corpus = corpus

    def check(self, str):
        tokens = re.split(r'([^\w]+)', str) # Get all tokens, split into an array
        output = ""
        for token in tokens:
            if re.match(r"[a-z]{3,}", token): # If it's a lowercase word (solely alphabetic) with more than 3 characters, continue
                output += self.correction(token)
            else: # Otherwise, just append it to the output
                output += token

        return output

    def P(self, word):
        "Probability of `word`."
        if word in self.custom_corpus:
            return 1
        return self.WORDS[word] / self.N

    def correction(self, word):
        "Most probable spelling correction for word."
        return max(self.candidates(word), key=self.P)

    def candidates(self, word):
        "Generate possible spelling corrections for word."
        return (self.known([word]) or self.known(self.edits1(word)) or self.known(self.edits2(word)) or [word])

    def known(self, words):
        "The subset of `words` that appear in the dictionary of WORDS."
        return set(w for w in words if (w in self.WORDS or w in self.custom_corpus))

    def edits1(self, word):
        "All edits that are one edit away from `word`."
        letters    = 'abcdefghijklmnopqrstuvwxyz'
        splits     = [(word[:i], word[i:])    for i in range(len(word) + 1)]
        deletes    = [L + R[1:]               for L, R in splits if (R and len(L + R[1:]) >= 3)]
        transposes = [L + R[1] + R[0] + R[2:] for L, R in splits if len(R)>1]
        replaces   = [L + c + R[1:]           for L, R in splits if R for c in letters]
        inserts    = [L + c + R               for L, R in splits for c in letters]
        return set(deletes + transposes + replaces + inserts)

    def edits2(self, word):
        "All edits that are two edits away from `word`."
        return (e2 for e1 in self.edits1(word) for e2 in self.edits1(e1))

    '''Helper Functions'''

    def valid_languages(languages):
        '''Check if the document is in a language spellchecker works on'''
        excluded_languages = ["zh"] # Languages NOT to run spell checker on TODO: make this configurable

        for language in languages:
            if language in excluded_languages: return False
        return True

    def words(text):
        '''Gets all the words within a string'''
        return re.findall(r'\w+', text)
