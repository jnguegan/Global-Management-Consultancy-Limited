GSF Financial Insights implementation

Upload these files to the ROOT of globalmgm.co.uk:
- finance.html (replacement for current root finance.html)
- financial-insights.html
- financial-insight.html
- financial-insights.js
- financial-insights.css

Upload the folder assets/images/financial-insights/ into the existing /assets/images/ tree.

Architecture:
- /finance.html = GSF home, latest 3 real insights
- /financial-insights.html = complete library
- /financial-insight.html?id=... = one reusable reader for every publication
- /financial-insights.js = publication data. Add future publications here only; no new article HTML page is required.

The EN/FR/ES switch is implemented on both new pages and uses the existing gsf-language localStorage preference.
