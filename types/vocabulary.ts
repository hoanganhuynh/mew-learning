export interface SavedWord {
  id:             string;
  text:           string;           // English word / phrase
  vietnameseText: string;           // Vietnamese meaning
  phonetic?:      string;           // e.g. /həˈloʊ/
  partOfSpeech?:  string;           // noun, verb, adjective …
  englishDef?:    string;           // short English definition
  topicId:        string;
  topicTitle:     string;
  lineId:         string;
  lineContext:    string;           // full source sentence
  savedAt:        number;           // timestamp ms
}

/** Shape returned by /api/translate */
export interface TranslateResult {
  vietnamese:  string;
  phonetic:    string;
  partOfSpeech:string;
  englishDef:  string;
}
