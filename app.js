const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home', {
    postsContent: posts
  });
});

app.get('/about', (req, res) => {
  res.render('about', {});
});

app.get('/contact', (req, res) => {
  res.render('contact', {});
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  const Compose = {
    title: req.body.title,
    content: req.body.body
  };

  // Replace newline characters with <br> tags in the content
  Compose.content = Compose.content.replace(/\n/g, '<br>');

  posts.push(Compose);
  res.redirect('/');
});

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

app.get('/posts/:title', (req, res) => {
  var urlTitle = _.lowerCase(req.params.title);

  posts.forEach(x => {
    if (_.lowerCase(x.title) === urlTitle) {
      res.render('post.ejs', {
        postTitle: x.title,
        postBody: DOMPurify.sanitize(x.content)
      });
    }
  });
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
  console.log(`Ctrl Click: http://127.0.0.1:3000/`);
});
