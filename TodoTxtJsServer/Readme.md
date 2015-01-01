TodoTxtJs Server
================

Allows you to quickly run the TodoTxtJs site on your own computer requiring
only NodeJs.

Unlike the WebApp running in grunt (which is much easier and simpler) this
will give you a very simple, file-based, server-based, storage mechanism
for your TODO.txt.

This is intended as a demonstration project to show how storage providers
are used/created in a server-based environment, or for a very simple, private
server based solution.

**Nb.:** this is not multi-user, anyone that can successfully request a page
from the server will be able to access/modify that file.

Installing
----------

Unzip everything to a folder, ensure NodeJs is installed and in the path.
NPM is also required, and may need to be installed.

```
$ cd TodoTxtJsServer
$ npm install
$ npm run start
```

Go to http://localhost:3000/todotxt.html


