Build
=====

I've greatly simplified the build system since the initial attempt. So this file is now a lot shorter :)

Getting Started
---------------

Get everything installed.

```
> npm install
```

Then build:

```
> npm run build
```

Look in the 'out' folder for a ready to run website.
 
 I recommend you install, as a minimum, jake globally:
 
 ```
 > npm install jake -g
 ```
 
 Then you can easily start a self-hosted website with:
 
 ```
 > jake server
 ```
 
 or if you don't want to, or cannot install globally then:
 
 ```
 > ./node_modules/.bin/jake server
 ```