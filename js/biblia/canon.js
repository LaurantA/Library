// The Catholic canon in the order and chapter division of the Nova Vulgata (73 books).
// [id, Latin name, English name, chapters, section]
// Other editions number some chapters differently (Joel, Malachi, Baruch/Letter of Jeremiah, Esther's
// Greek additions, and the Psalms, where the Vulgate follows the Greek numbering); the tracker counts
// everything against the Vulgate.
window.B = window.B || {}; B.data = B.data || {};
B.data.canon = {
  sections: [
    ["pent", "Pentateuchus", "Pentateuch"], ["hist", "Libri historici", "Historical books"], ["sap", "Libri sapientiales", "Wisdom books"],
    ["proph", "Libri prophetici", "Prophets"], ["ev", "Evangelia et Actus", "Gospels and Acts"], ["paul", "Epistulae Pauli", "Letters of Paul"],
    ["cath", "Epistulae catholicae et Apocalypsis", "Catholic letters and Revelation"]
  ],
  books: [
    ["gen", "Genesis", "Genesis", 50, "pent"], ["ex", "Exodus", "Exodus", 40, "pent"], ["lev", "Leviticus", "Leviticus", 27, "pent"],
    ["num", "Numeri", "Numbers", 36, "pent"], ["dt", "Deuteronomium", "Deuteronomy", 34, "pent"],
    ["ios", "Iosue", "Joshua", 24, "hist"], ["idc", "Iudicum", "Judges", 21, "hist"], ["rt", "Ruth", "Ruth", 4, "hist"],
    ["1sam", "I Samuelis", "1 Samuel", 31, "hist"], ["2sam", "II Samuelis", "2 Samuel", 24, "hist"], ["1reg", "I Regum", "1 Kings", 22, "hist"],
    ["2reg", "II Regum", "2 Kings", 25, "hist"], ["1par", "I Paralipomenon", "1 Chronicles", 29, "hist"], ["2par", "II Paralipomenon", "2 Chronicles", 36, "hist"],
    ["esd", "Esdrae", "Ezra", 10, "hist"], ["neh", "Nehemiae", "Nehemiah", 13, "hist"], ["tob", "Thobis", "Tobit", 14, "hist"],
    ["idt", "Iudith", "Judith", 16, "hist"], ["est", "Esther", "Esther", 10, "hist"], ["1mac", "I Maccabaeorum", "1 Maccabees", 16, "hist"],
    ["2mac", "II Maccabaeorum", "2 Maccabees", 15, "hist"],
    ["iob", "Iob", "Job", 42, "sap"], ["ps", "Psalmi", "Psalms", 150, "sap"], ["prv", "Proverbia", "Proverbs", 31, "sap"],
    ["eccl", "Ecclesiastes", "Ecclesiastes", 12, "sap"], ["ct", "Canticum Canticorum", "Song of Songs", 8, "sap"], ["sap", "Sapientia", "Wisdom", 19, "sap"],
    ["sir", "Ecclesiasticus", "Sirach", 51, "sap"],
    ["is", "Isaias", "Isaiah", 66, "proph"], ["ier", "Ieremias", "Jeremiah", 52, "proph"], ["lam", "Lamentationes", "Lamentations", 5, "proph"],
    ["bar", "Baruch", "Baruch", 6, "proph"], ["ez", "Ezechiel", "Ezekiel", 48, "proph"], ["dn", "Daniel", "Daniel", 14, "proph"],
    ["os", "Osee", "Hosea", 14, "proph"], ["ioel", "Ioel", "Joel", 4, "proph"], ["am", "Amos", "Amos", 9, "proph"], ["abd", "Abdias", "Obadiah", 1, "proph"],
    ["ion", "Ionas", "Jonah", 4, "proph"], ["mi", "Michaeas", "Micah", 7, "proph"], ["na", "Nahum", "Nahum", 3, "proph"], ["hab", "Habacuc", "Habakkuk", 3, "proph"],
    ["so", "Sophonias", "Zephaniah", 3, "proph"], ["agg", "Aggaeus", "Haggai", 2, "proph"], ["za", "Zacharias", "Zechariah", 14, "proph"],
    ["mal", "Malachias", "Malachi", 3, "proph"],
    ["mt", "Matthaeus", "Matthew", 28, "ev"], ["mc", "Marcus", "Mark", 16, "ev"], ["lc", "Lucas", "Luke", 24, "ev"], ["io", "Ioannes", "John", 21, "ev"],
    ["act", "Actus Apostolorum", "Acts", 28, "ev"],
    ["rom", "Ad Romanos", "Romans", 16, "paul"], ["1cor", "I ad Corinthios", "1 Corinthians", 16, "paul"], ["2cor", "II ad Corinthios", "2 Corinthians", 13, "paul"],
    ["gal", "Ad Galatas", "Galatians", 6, "paul"], ["eph", "Ad Ephesios", "Ephesians", 6, "paul"], ["phil", "Ad Philippenses", "Philippians", 4, "paul"],
    ["col", "Ad Colossenses", "Colossians", 4, "paul"], ["1th", "I ad Thessalonicenses", "1 Thessalonians", 5, "paul"], ["2th", "II ad Thessalonicenses", "2 Thessalonians", 3, "paul"],
    ["1tim", "I ad Timotheum", "1 Timothy", 6, "paul"], ["2tim", "II ad Timotheum", "2 Timothy", 4, "paul"], ["tit", "Ad Titum", "Titus", 3, "paul"],
    ["phlm", "Ad Philemonem", "Philemon", 1, "paul"], ["hebr", "Ad Hebraeos", "Hebrews", 13, "paul"],
    ["iac", "Iacobi", "James", 5, "cath"], ["1pt", "I Petri", "1 Peter", 5, "cath"], ["2pt", "II Petri", "2 Peter", 3, "cath"],
    ["1io", "I Ioannis", "1 John", 5, "cath"], ["2io", "II Ioannis", "2 John", 1, "cath"], ["3io", "III Ioannis", "3 John", 1, "cath"],
    ["iud", "Iudae", "Jude", 1, "cath"], ["ap", "Apocalypsis", "Revelation", 22, "cath"]
  ]
};
