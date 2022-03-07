var fs = require("fs");
var path = require("path");
var Handlebars = require("handlebars");
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function render(resume) {
  var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
  var partialsDir = path.join(__dirname, "partials");
  var filenames = fs.readdirSync(partialsDir);

  filenames.forEach(function (filename) {
    var matches = /^([^.]+).hbs$/.exec(filename);
    if (!matches) {
      return;
    }
    var name = matches[1];
    var filepath = path.join(partialsDir, filename);
    var template = fs.readFileSync(filepath, "utf8");

    Handlebars.registerPartial(name, template);
  });
  return Handlebars.compile(tpl)({
    css: css,
    resume: resume,
  });
}

Handlebars.registerHelper("date", function (date) {
  var theDate = new Date(date);
  return months[theDate.getMonth()] + " " + theDate.getFullYear();
});

Handlebars.registerHelper("removeProtocol", function (url) {
  var regex = /^.+:\/\/(.*)/i; // ignore case
  var match = url.match(regex);
  if (match && match[1]) {
    return match[1].replace(/^[\/]+|[\/]+$/g, '');
  } else {
    return url;
  }
});

module.exports = {
  render: render,
};
