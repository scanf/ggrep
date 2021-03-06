const colors = require("./colors");

var format_header = () => {
  const index = colors.IndexColor.underline("Index");
  const file = colors.FileColor.underline("File");
  const line = colors.LineColor.underline("Line");
  const content = colors.ContentColor.underline("Content");
  const location = `${file}${colors.ContentColor.underline(":")}${line}`;

  return { index: index, location: location, content: content };
};

var format_entry = function(index, term, data) {
  const eIndex =
    index % 2 ? colors.SecondaryIndexColor(index) : colors.IndexColor(index);
  const file = colors.FileColor(data.file);
  const line = colors.LineColor(data.line);

  var text = data.text;
  if (text.length > 80) {
    text = data.text.substring(0, 76);
    text += "[...]";
  }
  const eterm = text.replace(
    new RegExp(term, "g"),
    colors.HighlightColor(term)
  );

  return { index: eIndex, location: `${file}:${line}`, content: eterm };
};

var format_error = function(msg) {
  const prefix = colors.HighlightColor("Error");
  return `${prefix}: ${msg}`;
};

module.exports = {
  format_header,
  format_entry,
  format_error
};
