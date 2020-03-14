var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template');
var path = require('path');

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(err, files){
          var title = 'Welcome';
          var desc = 'Hello, Node.js';
          var list = template.list(files);
          var html = template.html(title, list, `<h2>${title}</h2>${desc}`, 
          `<a href="/create">Create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      }
      else{
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', (err, desc) => {
          fs.readdir('./data', function(err, files){
            var title = queryData.id;
            var list = template.list(files);
            var html = template.html(title, list, `<h2>${title}</h2>${desc}`, 
            `<a href="/create">Create</a> 
            <a href="/update?id=${title}">Update</a> 
            <form action="delete_process" method="POST">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="Delete">
            </form>`);
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } 
    else if (pathname === '/create') {
      fs.readdir('./data', function(err, files){
        var title = 'Web - Create';
        var list = template.list(files);
        var html = template.html(title, list, `
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
        response.end(html);
      });
    } 
    else if(pathname === '/create_process') {
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
    } 
    else if(pathname ==='/update') {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', (err, desc) => {
        fs.readdir('./data', function(err, files){
          var title = queryData.id;
          var list = template.list(files);
          var html = template.html(title, list, 
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
          response.end(html);
        });
      });
    }
    else if(pathname ==='/update_process') {
      var body = '';
      request.on('data',function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var desc = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(err){
            fs.writeFile(`data/${title}`, desc, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end('success');
          });
        });

      });
    }
    else if(pathname ==='/delete_process') {
      var body = '';
      request.on('data',function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(err){
          response.writeHead(302, {Location: `/`});
          response.end('success');
        });
      });
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000); 