---
title: "Install PyMOL on Mac OS X Snow Leopard"
published: "2011-11-02T00:00:00.000Z"
---

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/VabSHpBw5mc" allowfullscreen></iframe>
</div>

Installing free PyMOL on Mac isn't as easy as installing on Windows or Linux. For one thing, there is no precompiled binary (although you can [buy one from Schrodinger](http://pymol.org/dsc/)). [The tutorial](/pymol-tutorials/pymol-essentials-tutorial/install-pymol-on-mac-os-x-snow-leopard/) shows how to install the free version of PyMOL using MacPorts ([background](/articles/2011/10/21/easily-install-pymol-on-mac-osx/)).

Another problem is that compiling from source leads to compile errors, and these errors depend on the version of Python you're running. With Python 2.7 and PyMOL 1.4.1, this is what I saw:

```bash
pymol setup.py build
[snip]
layer0/ShaderMgr.c: In function ‘ShaderMgrConfig’:
layer0/ShaderMgr.c:173: error: ‘GLEW_OK’ undeclared (first use in this function)
layer0/ShaderMgr.c:173: error: (Each undeclared identifier is reported only once
layer0/ShaderMgr.c:173: error: for each function it appears in.)
layer0/ShaderMgr.c:174: error: ‘GLEW_VERSION_2_0’ undeclared (first use in this function)
layer0/ShaderMgr.c:185: warning: format ‘%s’ expects type ‘char *’, but argument 3 has type ‘int’
layer0/ShaderMgr.c: In function ‘ShaderMgrConfig’:
layer0/ShaderMgr.c:173: error: ‘GLEW_OK’ undeclared (first use in this function)
layer0/ShaderMgr.c:173: error: (Each undeclared identifier is reported only once
layer0/ShaderMgr.c:173: error: for each function it appears in.)
layer0/ShaderMgr.c:174: error: ‘GLEW_VERSION_2_0’ undeclared (first use in this function)
layer0/ShaderMgr.c:185: warning: format ‘%s’ expects type ‘char *’, but argument 3 has type ‘int’
lipo: can't figure out the architecture type of: /var/folders/9+/9+lCZbKTGeSvLa-KoByjCE+++TI/-Tmp-//cc6lq8a7.out
error: command 'gcc-4.2' failed with exit status 1
```

[Here's what I saw using Python 2.6](/articles/2011/10/21/easily-install-pymol-on-mac-osx/) (which comes with Snow Leopard).

I did manage to find a solution, but it's a bit ugly and I'd like to see what I get from the [PyMOL Users List](https://lists.sourceforge.net/lists/listinfo/pymol-users) before posting it.