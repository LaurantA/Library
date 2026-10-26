// The curriculum — the agreed proposal "Studia Humanitatis — Curriculum Proposal" (26 Oct 2026).
// Static data: edit here to change the plan. Progress lives in B.store "studia", keyed by item id,
// so ids must stay stable once used.
//
// Item fields:
//   id        stable key
//   work      what to read or do (may contain *italics* written as plain text)
//   lang      LA / GR / HE / SQ / IT …
//   warrant   the treatise and passage that prescribes it
//   addition  true = Laurant's own addition, no humanist warrant
//   decision  note when the item rests on one of the six decisions
//   shelf     how to find it on the Library shelves: [authorPattern, titlePattern?] pairs (case-insensitive)
window.B = window.B || {};
B.studiaCurriculum = {
  version: "2026-10-26",
  stages: [
    {
      id: "grammatica", name: "Grammatica", sub: "The three grammar classes",
      aim: "A complete command of grammar and prosody, gained from easy authors rather than drilled rules. Erasmus: rules “quam paucissima, modo sint optima”, then straight into an author (DRS 1520 pp. 9, 21).",
      exercise: "A daily theme from German into Latin, set and corrected (Ratio, Common Rules ¶4, ¶6–7).",
      items: [
        { id: "g-orberg", work: "Ørberg, Lingua Latina per se Illustrata I–II, as the grammar course", lang: "LA", warrant: "In place of the Ratio's Alvarez; in Erasmus's spirit of usage over rules (DRS p. 9)", addition: true, shelf: [["ørberg|orberg"]] },
        { id: "g-cic-ep", work: "Cicero, the easiest letters → Ad familiares → Ad Atticum, Ad Quintum fratrem", lang: "LA", warrant: "Ratio, Lowest ¶35, Middle ¶30, Highest Grammar ¶26", shelf: [["cicero", "letter|epist|famil|attic"]] },
        { id: "g-cic-sen", work: "Cicero, De amicitia, De senectute, Paradoxa", lang: "LA", warrant: "Ratio, Highest Grammar ¶26", shelf: [["cicero", "amicit|senect|paradox|friendship|old age"]] },
        { id: "g-ovid", work: "Ovid, the simplest poems, then selected elegies and epistles", lang: "LA", warrant: "Ratio, Middle ¶30, Highest ¶26", shelf: [["ovid"]] },
        { id: "g-virgil", work: "Virgil, Eclogues, Georgics IV, Aeneid V and VII — partly by heart", lang: "LA", warrant: "Ratio, Highest ¶26; Guarino §2 (“learnt by heart”)", shelf: [["virgil|vergil"]] },
        { id: "g-elegists", work: "Catullus, Tibullus, Propertius, in selection", lang: "LA", warrant: "Ratio, Highest ¶26", shelf: [["catullus|tibullus|propertius"]] },
        { id: "g-terence", work: "Terence, Andria and Adelphi", lang: "LA", warrant: "Erasmus, DRS pp. 9–10 (first Latin author), 40–41; Guarino §4", decision: "Decision 2: read on Erasmus's warrant; the Ratio bars Terence (Provincial rule 11)", shelf: [["terence|terenz"]] },
        { id: "g-greek", work: "Greek grammar (Gaza, or a modern course), then Aesop and Chrysostom", lang: "GR", warrant: "Erasmus, DRS p. 9; Ratio, Highest ¶26", decision: "Decision 1: Greek in, a stage behind the Latin", shelf: [["aesop|äsop"]] }
      ]
    },
    {
      id: "humanitas", name: "Humanitas", sub: "Language, erudition, the first rhetoric",
      aim: "“Knowledge of the language, a certain amount of erudition” and the basics of rhetoric (Ratio, Humanities ¶20). History is ranked high by every source: “in primis … omnis tenenda est historia” (Erasmus, DRS p. 19).",
      exercise: "Letters in the manner of Cicero and Pliny, imitating the author being read (Ratio, Humanities ¶23).",
      items: [
        { id: "h-cic-mor", work: "Cicero, moral works, then Pro Archia, Pro lege Manilia, Pro Marcello", lang: "LA", warrant: "Ratio, Humanities ¶20–21", shelf: [["cicero", "archia|manilia|marcell|re publica|republic"]] },
        { id: "h-letters", work: "Cicero and Pliny the Younger, letters as models for your own", lang: "LA", warrant: "Ratio, Humanities ¶23; Erasmus, DRS p. 27", shelf: [["pliny the younger|plinius der jüngere"]] },
        { id: "h-caesar", work: "Caesar, Commentarii", lang: "LA", warrant: "Ratio ¶20; Bruni p. 128; Erasmus, DRS p. 10", shelf: [["^caesar$|^c\\. julius caesar|^gaius julius caesar"]] },
        { id: "h-historians", work: "Sallust, Livy, Curtius", lang: "LA", warrant: "Ratio ¶20; Bruni pp. 127–128; Piccolomini §6", shelf: [["sallust|livy|livius|curtius"]] },
        { id: "h-survey", work: "Justin and Valerius Maximus, as a first survey of history", lang: "LA", warrant: "Guarino §4; Piccolomini §6", shelf: [["justin|valerius maximus"]] },
        { id: "h-aeneid", work: "Virgil, Aeneid entire", lang: "LA", warrant: "Ratio ¶20; Piccolomini §6 (“the first place belongs of perpetual right to Vergil”)", decision: "Decision 3: read whole, in Erasmus's manner", shelf: [["virgil|vergil", "aeneid|äneis"]] },
        { id: "h-horace", work: "Horace, odes in selection", lang: "LA", warrant: "Ratio ¶20; Erasmus, DRS p. 10", shelf: [["horace|horaz"]] },
        { id: "h-basil", work: "Basil, Ad adulescentes — how a Christian reads the pagans", lang: "GR", warrant: "Piccolomini §3, §6; Ratio ¶24", shelf: [["basil"]] },
        { id: "h-greekprose", work: "Lucian, Herodotus, Isocrates, Plutarch, letters of Plato", lang: "GR", warrant: "Erasmus, DRS p. 9; Ratio ¶24", shelf: [["lucian|herodot|isocrat|plutarch"]] },
        { id: "h-soarez", work: "Soarez, De arte rhetorica — the first rules of rhetoric (a modern handbook may stand in)", lang: "LA", warrant: "Ratio ¶21–22", shelf: [["soarez|lausberg"]] },
        { id: "h-barleti", work: "Marin Barleti, Historia de vita et gestis Scanderbegi", lang: "LA", warrant: "Humanist Latin history by a priest of Shkodër, on the Livian model", addition: true, shelf: [["barleti"]] }
      ]
    },
    {
      id: "rhetorica", name: "Rhetorica", sub: "Eloquence: Cicero as the one model",
      aim: "“Cicero is to be the one model of style, though the best historians and poets are to be sampled” (Ratio, Rhetoric ¶12). The Greek Fathers stand beside Demosthenes and Homer “in their own right” (¶17).",
      exercise: "A monthly declamation in one of the three genres — praise Socrates, blame Caesar, whether to marry or to travel (Erasmus, DRS p. 29; Ratio, Rhetoric ¶18).",
      items: [
        { id: "r-cicero", work: "Cicero, speeches and the oratorical works", lang: "LA", warrant: "Ratio, Rhetoric ¶12, ¶15; Bruni p. 124", shelf: [["cicero", "orat|brutus|speech|rede"]] },
        { id: "r-arist", work: "Aristotle, Rhetoric and Poetics", lang: "GR", warrant: "Ratio ¶12, ¶15", shelf: [["aristotle|aristoteles", "rhetor|poetic|poetik"]] },
        { id: "r-quint", work: "Quintilian, Institutio oratoria", lang: "LA", warrant: "Guarino §4; Erasmus, DRS pp. 15, 30", shelf: [["quintilian"]] },
        { id: "r-greekprose", work: "Demosthenes, Thucydides, Plato", lang: "GR", warrant: "Ratio ¶17; Erasmus, DRS p. 9", shelf: [["demosthen|thucydid|thukydid"], ["plato|platon"]] },
        { id: "r-greekpoets", work: "Homer, Hesiod, Pindar", lang: "GR", warrant: "Ratio ¶17; Erasmus, DRS p. 9", shelf: [["homer|hesiod|pindar"]] },
        { id: "r-drama", work: "Aristophanes, Euripides", lang: "GR", warrant: "Erasmus, DRS p. 9 (first and third of the Greek poets); not in the Ratio", shelf: [["aristophan|euripid"]] },
        { id: "r-fathers", work: "Gregory Nazianzen, Basil, Chrysostom", lang: "GR", warrant: "Ratio ¶17", shelf: [["nazianz|chrysostom|basil"]] },
        { id: "r-latinpoets", work: "Seneca's tragedies; Lucan; Statius", lang: "LA", warrant: "Guarino §4; Piccolomini §6; Bruni p. 132", shelf: [["seneca|lucan|statius"]] },
        { id: "r-aphth", work: "Aphthonius, Progymnasmata — the graded exercises", lang: "GR", warrant: "Erasmus, DRS p. 26", shelf: [["aphthon"]] },
        { id: "r-bardhi-apol", work: "Frang Bardhi, Apologia Scanderbegi (1636) — humanist controversy", lang: "LA", warrant: "A Latin polemic on Skanderbeg's origin", addition: true, shelf: [["bardhi"]] }
      ]
    },
    {
      id: "philosophia", name: "Philosophia", sub: "Three Aristotelian years and the moral tradition",
      aim: "The Ratio's three years — logic, natural philosophy with Euclid, metaphysics — and the Ethics (Higher Faculties ¶19–25). Knowledge of things is sought from the Greeks, “ab ipsis fontibus” (Erasmus, DRS pp. 10, 16).",
      exercise: "A weekly disputation with yourself: a thesis, objections, replies — written in Latin (Ratio, Higher Faculties ¶3–4).",
      items: [
        { id: "p-logic", work: "Aristotle, logic: a digest of the Topics and Sophistical Refutations; the Prior Analytics cursorily", lang: "GR", warrant: "Ratio ¶20; Erasmus, DRS p. 12 (dialectic from Aristotle, not the sophists)", shelf: [["aristotle|aristoteles", "topic|organon|analytic|categor|logic"]] },
        { id: "p-physics", work: "Aristotle, Physics, On the Heavens, On Generation", lang: "GR", warrant: "Ratio ¶21", shelf: [["aristotle|aristoteles", "physic|heaven|himmel|generation"]] },
        { id: "p-euclid", work: "Euclid, Elements; then some geography and astronomy", lang: "GR", warrant: "Ratio ¶25", shelf: [["euclid|euklid"]] },
        { id: "p-meta", work: "Aristotle, On the Soul; Metaphysics (preface, books VII and XII)", lang: "GR", warrant: "Ratio ¶21", shelf: [["aristotle|aristoteles", "metaphys|soul|seele|anima"]] },
        { id: "p-ethics", work: "Aristotle, Nicomachean Ethics, ten books", lang: "GR", warrant: "Ratio ¶24; Guarino §4", shelf: [["aristotle|aristoteles", "ethic|ethik"]] },
        { id: "p-plato", work: "Plato; Theophrastus; Plotinus", lang: "GR", warrant: "Erasmus, DRS p. 16", shelf: [["plato|platon|theophrast|plotin"]] },
        { id: "p-officiis", work: "Cicero, De officiis and the Tusculans", lang: "LA", warrant: "Guarino §4; Piccolomini §6 (De officiis “absolutely necessary”)", shelf: [["cicero", "offic|pflicht|tuscul"]] },
        { id: "p-seneca", work: "Seneca, Letters; Boethius, Consolation of Philosophy", lang: "LA", warrant: "Piccolomini §9", shelf: [["seneca|boethius"]] },
        { id: "p-politics", work: "Aristotle, Politics", lang: "GR", warrant: "Not named by the sources read", addition: true, shelf: [["aristotle|aristoteles", "politic|politik"]] }
      ]
    },
    {
      id: "theologia", name: "Theologia", sub: "Scripture through the Fathers, then the Summa",
      aim: "The Ratio's Scripture professor is to “reverently follow in the footsteps of the Fathers of the Church” (Higher Faculties ¶7); Erasmus: learn the sense of Scripture “ex priscis illis interpretibus” (Ratio verae theologiae p. 165).",
      exercise: "Read a Father on the passage before any later commentary; note where he reads allegorically (Erasmus, Ratio verae theologiae p. 40).",
      items: [
        { id: "t-scripture", work: "Scripture — Old and New Testament in alternate years; the Vulgate", lang: "LA/GR", warrant: "Ratio ¶6–9", shelf: [["", "bible|bibel|bibla|testament|vulgat"]] },
        { id: "t-greekfathers", work: "Origen (allegory), Chrysostom (commonplaces), Basil", lang: "GR", warrant: "Erasmus, DRS p. 16; Ratio verae theologiae p. 40", shelf: [["origen|chrysostom|basil"]] },
        { id: "t-latinfathers", work: "Ambrose, Jerome, Augustine", lang: "LA", warrant: "Erasmus, DRS p. 16; Enchiridion ch. 2 (secondary)", shelf: [["ambrose|ambrosius|jerome|hieronymus|augustine|augustinus"]] },
        { id: "t-doctrina", work: "Augustine, De doctrina christiana; De civitate Dei", lang: "LA", warrant: "Ratio verae theologiae pp. 19, 23; Guarino §5", shelf: [["augustine|augustinus", "doctrin|city of god|civitate|gottesstaat"]] },
        { id: "t-lactantius", work: "Lactantius, for style", lang: "LA", warrant: "Bruni p. 124 (first among Christian writers); Piccolomini §6", shelf: [["lactan"]] },
        { id: "t-erasmus", work: "Erasmus, Enchiridion and Ratio verae theologiae", lang: "LA", warrant: "The proposal's own pillar", shelf: [["erasmus"]] },
        { id: "t-summa", work: "Thomas Aquinas, Summa theologiae — Prima, Prima Secundae, Secunda Secundae, Tertia", lang: "LA", warrant: "Ratio ¶11–13", decision: "Decision 4: after the Fathers", shelf: [["aquinas|thomas von aquin"]] },
        { id: "t-trent", work: "The decrees of the Council of Trent", lang: "LA", warrant: "Ratio, Prefect ¶25", shelf: [["", "trent|trient|tridentin"]] },
        { id: "t-hebrew", work: "Hebrew rudiments, then an easy book of Scripture (optional)", lang: "HE", warrant: "Ratio ¶10; Ratio verae theologiae p. 19", shelf: [["", "hebrew|hebräisch"]] },
        { id: "t-bogdani", work: "Pjetër Bogdani, Cuneus prophetarum (Padua, 1685)", lang: "SQ/IT", warrant: "Catholic theology in Albanian and Italian", addition: true, shelf: [["bogdani"]] }
      ]
    },
    {
      id: "orbis", name: "Orbis doctrinae", sub: "Alongside every stage", strand: true,
      aim: "Erasmus asks of the educated reader “orbem illum doctrinae”, through “omne scriptorum genus” (DRS p. 15): “nulla disciplina est, nec militiae, nec rei rusticae, nec musices, nec architecturae, quae non usui sit” to one who would explain the ancients (p. 19). The Ratio's “certain amount of erudition” (Humanities ¶20).",
      exercise: "Keep a running index of names, places and things met in reading — the teacher's encyclopaedia (Erasmus, DRS pp. 15–19).",
      items: [
        { id: "o-history", work: "History, throughout — Justin and Valerius Maximus first", lang: "LA", warrant: "Erasmus, DRS p. 19; Vergerio p. 106; Guarino §4", note: "The Library's period shelves.", shelf: [] },
        { id: "o-myth", work: "Mythology: Ovid, Metamorphoses and Fasti; Hesiod, Theogony; Boccaccio, Genealogia deorum", lang: "LA/GR", warrant: "Erasmus, DRS pp. 17–18; Guarino §4", shelf: [["ovid", "metamorph|fasti|werke"], ["hesiod|boccaccio"]] },
        { id: "o-geo", work: "Geography and cosmography: Pomponius Mela, Strabo, Ptolemy, Pliny", lang: "LA/GR", warrant: "Erasmus, DRS p. 17; Guarino §4", note: "The two atlases.", shelf: [["mela|strabo|ptolem"]] },
        { id: "o-nathist", work: "Natural history: Pliny the Elder, Naturalis historia", lang: "LA", warrant: "Erasmus, DRS p. 16; Guarino §5", shelf: [["pliny the elder|plinius der ältere"]] },
        { id: "o-antiq", work: "Antiquities — “from ancient coins, inscriptions and stones”; Gellius, Macrobius, Athenaeus", lang: "LA/GR", warrant: "Erasmus, DRS pp. 16, 18; Guarino §5", note: "The Cabinet and the Rome atlas.", shelf: [["gellius|macrobius|athenaeus"]] },
        { id: "o-arch", work: "Architecture: Vitruvius, De architectura", lang: "LA", warrant: "Erasmus, DRS pp. 17, 19 (architecture named); Vitruvius by name only in Vives's letter to Mountjoy (secondary)", note: "The Vicenza shelf.", shelf: [["vitruv"]] },
        { id: "o-alberti", work: "Leon Battista Alberti, De re aedificatoria", lang: "LA", warrant: "The humanist answer to Vitruvius", addition: true, shelf: [["alberti"]] },
        { id: "o-palladio", work: "Andrea Palladio, I quattro libri dell'architettura", lang: "IT", warrant: "The book behind the Vicenza shelf", addition: true, shelf: [["palladio"]] },
        { id: "o-law", work: "Roman law, its principles", lang: "LA", warrant: "Guarino §4; Vergerio warns that law as practised “becomes a mere trade” (p. 108)", shelf: [["", "roman law|römisches recht|institutiones|digest"]] },
        { id: "o-bardhi", work: "Frang Bardhi, Dictionarium latino-epiroticum (1635) — a working tool for Latin and Albanian", lang: "LA/SQ", warrant: "The first Latin–Albanian dictionary", addition: true, shelf: [["bardhi"]] }
      ]
    }
  ],
  method: [
    { name: "Prelection", what: "Read the passage whole, give its gist, go sentence by sentence, then make observations — genre, figures, borrowings, and finally “ad philosophiam”, the moral.", warrant: "Ratio, Common ¶5–6; Erasmus, DRS pp. 33–34", kind: "prelection" },
    { name: "Commonplace book", what: "Mark striking words, adages, examples and sententiae, filed under headings.", warrant: "Erasmus, DRS pp. 12, 16 (De copia II); Guarino §5; Vives (Watson p. 108)", where: "Library → Quotes, with themes as the headings" },
    { name: "Translation", what: "From Greek into Latin — “plurimum autem fructus est in graecis vertendis”; German themes into Latin; double translation.", warrant: "Erasmus, DRS p. 27; Ratio, Common ¶6–7; Vives (Watson pp. 113–114)", kind: "translation" },
    { name: "Composition", what: "Letters by type in imitation of Cicero and Pliny; the progymnasmata; a monthly original essay.", warrant: "Erasmus, DRS pp. 26–28; Ratio, Humanities ¶23, Highest Grammar ¶29", kind: "composition" },
    { name: "Memory", what: "A passage by heart daily; on Saturday, review the week.", warrant: "Piccolomini §4; Ratio, Common ¶5; Erasmus, DRS pp. 12–14", kind: "memory" },
    { name: "Teaching others", what: "Explain aloud what you have read — “nusquam enim melius deprehenderis quid intelligas, quid non”.", warrant: "Erasmus, DRS p. 14" },
    { name: "Only the best, in order", what: "No dipping “here the beginning, here the end”; only authors “of the first rank”.", warrant: "Vergerio pp. 110–111; Bruni p. 124", where: "The curriculum itself" }
  ],
  exerciseKinds: [
    { id: "translation", name: "Translation" },
    { id: "composition", name: "Composition" },
    { id: "prelection", name: "Prelection" },
    { id: "memory", name: "Memory" },
    { id: "declamation", name: "Declamation" },
    { id: "note", name: "Note" }
  ]
};
