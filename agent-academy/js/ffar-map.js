const FFAR_ARTICLE_PAGES = {
  "Article 1": 7,
  "Article 2": 8,
  "Article 3": 9,
  "Article 4": 10,
  "Article 5": 12,
  "Article 6": 13,
  "Article 7": 15,
  "Article 8": 17,
  "Article 9": 19,
  "Article 10": 21,
  "Article 11": 23,
  "Article 12": 24,
  "Article 13": 26,
  "Article 14": 27,
  "Article 15": 28,
  "Article 16": 30,
  "Article 17": 32,
  "Article 18": 34,
  "Article 19": 36,
  "Article 20": 38
};

function getFFARArticleLink(article) {

  const page = FFAR_ARTICLE_PAGES[article];

  if (!page) return null;

  return `/agent-academy/regulation-viewer.html?doc=ffar-2025.pdf&page=${page}`;
}
