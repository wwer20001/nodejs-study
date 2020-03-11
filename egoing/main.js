var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function makeTemplateHTML(title, list, body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB2</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function makeTemplateList(files)
{
  var list = `<ul>`
  for (let i = 0; i < files.length; i++) {
    var filename = files[i];
    list += `
    <li><a href="/?id=${filename}">${filename}</a></li>`
  }
  list += `</ul>`
  return list;
}

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(err, files){
          var title = 'Welcome';
          var desc = 'Hello, Node.js';
          var list = makeTemplateList(files);
          var template = makeTemplateHTML(title, list, `<h2>${title}</h2>${desc}`, 
          `<a href="/create">Create</a>`);
          response.writeHead(200);
          response.end(template);
        });
      }else{
        fs.readFile(`data/${queryData.id}`, 'utf8', (err, desc) => {
          fs.readdir('./data', function(err, files){
            var title = queryData.id;
            var list = makeTemplateList(files);
            var template = makeTemplateHTML(title, list, `<h2>${title}</h2>${desc}`, 
            `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if (pathname === '/create') {
      fs.readdir('./data', function(err, files){
        var title = 'Web - Create';
        var list = makeTemplateList(files);
        var template = makeTemplateHTML(title, list, `
        <form action="/create_process" method="POST">
            <p>
                <input type="text" name="title" placeholder="Title">
            </p>
            <p>
                <textarea name="description" placeholder="Description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `, '');
        response.writeHead(200);
        response.end(template);
      });
    } else if(pathname === '/create_process') {
      var body = '';
      request.on('data',function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var desc = post.description;
        fs.writeFile(`data/${title}`, desc, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('success');
        });
      });
    } else if(pathname ==='/update') {
      fs.readFile(`data/${queryData.id}`, 'utf8', (err, desc) => {
        fs.readdir('./data', function(err, files){
          var title = queryData.id;
          var list = makeTemplateList(files);
          var template = makeTemplateHTML(title, list, 
            `
            <form action="/update_process" method="POST">
              <input type="hidden" name="id" value="${title}">
              <p>
                  <input type="text" name="title" placeholder="Title" value="${title}">
              </p>
              <p>
                  <textarea name="description" placeholder="Description">${desc}</textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
            </form>
            `, 
            `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000); 