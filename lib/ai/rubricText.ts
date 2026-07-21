// The official SEAB GP marking rubric, verbatim. This is the single
// source of truth for how the AI marks every essay — kept separate
// from the prompt-building logic so it's easy to find and update if
// SEAB ever revises the rubric, without touching any actual code.

export const RUBRIC_CONTENT_BANDS = `
Band Descriptors for the assessment of Content

Band 5 (25–30 marks)
- The terms and scope of the question are clearly understood and defined, with some subtlety.
- Engagement with the question at a conceptual level is clearly evident. Nuanced and measured observations of trends and/or relationships are made. Connections between issues and ideas are identified and explained.
- Fully appropriate and wide-ranging illustration is used and developed throughout to support the points made within the argument.
- Fully relevant, addressing the requirements of the question throughout.
- There is a well-balanced discussion and consideration of differing perspectives and contexts, demonstrating developed analysis and evaluation of the issues.
- The conclusion is measured and nuanced.
If examples are consistently evaluated, observations frequently nuanced and connections between issues identified and fully explained, award marks of 28 to 30. If examples are mostly evaluated, observations nuanced, and explanations of connections are made but not fully developed, award marks of 25 to 27.

Band 4 (19–24 marks)
- The terms and scope of the question are understood and defined.
- Some engagement with the question at a conceptual level, making some measured observations of trends and/or relationships. Connections between issues and ideas are identified.
- Appropriate and frequent illustration is used to support the points made within the argument.
- Relevant, with almost all content addressing the requirements of the question.
- There is a balanced discussion and consideration of differing perspectives, demonstrating analysis and evaluation of the issues.
- The conclusion is well supported.
If examples are wide in range and clear connections are made between issues, with frequent evaluation of arguments, award marks of 22 to 24. If some connections and evaluative comments are evident, award marks of 19 to 21.

Band 3 (13–18 marks)
- The terms and scope of the question are generally understood. This may not be explicitly defined but can be inferred from the response.
- Occasional demonstration of conceptual understanding. Observations of trends and/or relationships are generalised, assertive and/or descriptive. The connections made between issues and ideas are implicit.
- Appropriate illustration is used to support the points made within the argument, but this is narrow in range and/or underdeveloped.
- Mostly relevant, with content generally addressing the requirements of the question, but perhaps with some repetition or occasional discussion of the topic or theme more generally.
- There is an attempt at balance and reference to differing perspectives, demonstrating some analysis of the issues.
- The conclusion is likely to be assertive or a summary of the argument.
If there is evidence of analysis, as well as some evidence of implied connections between issues, award marks of 16 to 18. If there is a focus on the question, but observation and analysis are more generalised and underdeveloped, award marks of 13 to 15.

Band 2 (7–12 marks)
- The terms and scope of the question are partially understood. The response addresses the general topic rather than the specific question.
- Limited demonstration of conceptual understanding evident from the selection of ideas and examples used. Limited awareness of trends and/or relationships with few or no connections of ideas made or implied.
- Use of illustration is limited in range and undeveloped. Examples may not be consistently relevant to the argument.
- Some evidence of relevance which addresses a limited range of general points raised by the question topic or theme.
- There is limited attempt at balance and little reference to differing perspectives, with limited analysis of the issues.
- The conclusion is likely to be implicit and brief, with little support.
If an argument and some developed illustration are attempted, but cogency is uneven, award marks of 10 to 12. If a partial argument and/or undeveloped illustration is evident, award marks of 7 to 9.

Band 1 (1–6 marks)
- The terms and scope of the question are not understood.
- No demonstration of conceptual understanding. Ideas demonstrate little to no awareness of trends, relationships or connections.
- Little to no clear use of illustration. Ideas and examples are superficial and lack relevance.
- Little to no evidence of relevance. The response rarely addresses the demands of the question.
- There is little attempt at balance or reference to differing perspectives, with little analysis of the issues.
- The conclusion may be absent or simply asserting an opinion.
If occasional ideas and information are offered which relate to the wider topic, award marks of 4 to 6. If little relevant content is evident, award marks of 1 to 3.

A mark of 0 should be given only when nothing in the response meets any of the criteria.

Additional marking guidance:
'Your society' questions need to be rooted in a specific society, most likely Singapore, though candidates who are not established Singaporean nationals may discuss their own society instead, with contrasts to other societies also acceptable as long as the primary focus remains rooted in the specified society.

Conceptual understanding means: making observations of trends and relationships as well as connections across issues and ideas; applying or adapting ideas to other contexts (changes in time and/or place); analysing and evaluating issues of local, regional and global significance, and their implications on the individual and society.
`;

export const RUBRIC_LANGUAGE_BANDS = `
Band Descriptors for the assessment of Language

Band 5 (17–20 marks) — Excellent linguistic ability and organisation of ideas:
- very few errors of spelling, punctuation and grammar; meaning is not impeded
- varied and complex sentence structure
- choice of vocabulary is sophisticated and wide in range, with nuanced and convincing language
- paragraphing is coherent, making use of a range of linking devices and logical sequencing

Band 4 (13–16 marks) — Very good linguistic ability and organisation of ideas:
- few serious errors of spelling, punctuation and grammar; meaning is not impeded
- good variety of sentence structure
- choice of vocabulary is varied and consistently appropriate
- effective paragraphing and some variety of linking devices

Band 3 (9–12 marks) — Sound linguistic ability and organisation of ideas:
- errors of spelling, punctuation and grammar may be frequent, but meaning is not significantly impeded
- some attempt at variety of sentence structure; this may not always be successful
- choice of vocabulary is mostly appropriate
- paragraphing and linking devices are present but may be repetitive; there is some sequencing of ideas

Band 2 (5–8 marks) — Limited linguistic ability and organisation of ideas:
- frequent spelling, punctuation and grammar errors of various types; meaning is occasionally impeded
- limited variety of sentence structure; this may not always be successful
- vocabulary is limited in range or words may be occasionally used incorrectly / in the wrong context
- paragraphing and linking devices are basic; the sequencing of ideas may be difficult to follow

Band 1 (1–4 marks) — Weak linguistic ability and organisation of ideas:
- weak spelling, punctuation and grammar which regularly impede meaning
- few sentences showing control or accuracy
- vocabulary is basic and words are frequently used incorrectly / in the wrong context
- there is little attempt to organise or sequence ideas

A mark of 0 should be given only when nothing in the response meets any of the criteria.
`;
