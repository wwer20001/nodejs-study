var template ={
    html:function (title, list, body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
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
    },
    list:function (files)
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
  }

  module.exports = template;