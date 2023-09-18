FT.manifest({
  "filename": "index.html",
  "width": <%= width %>,
  "height": <%= height %>,
  "clickTagCount": 1,
  "hideBrowsers": ["ie8"],
  "instantAds":[
    {"name":"title", "type":"text", "default":"Welcome to this Banner!"},
    {"name":"logo", "type":"image", "default":"logo.svg"},
    {"name":"cta", "type":"text", "default":"CLICK HERE"}
  ]
});
