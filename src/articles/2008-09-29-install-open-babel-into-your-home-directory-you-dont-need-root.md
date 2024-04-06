---
title: Install Open Babel Into Your Home Directory - You Don't Need Root
disqus: true
published: "2008-09-29T00:00:00.000Z"
---

Occasionally you may want to install [Open Babel](http://openbabel.org) into your home directory, or some other non-root directory. This problem most commonly crops up when using a server on which you don't have root privileges. Another reason could be that you're practicing or experimenting, and just want to keep the mess out of your system directories. The following tip shows how to install Open Babel to an arbitrary directory on your filesystem.

Let's say you've created a directory under your home directory called "local" to host your personal binaries and libraries. Let's also say that this directory contains a subdirectory called, surprisingly enough, "openbabel."

This series of commands will install Open Babel to "$HOME/local/openbabel":

```bash
./configure --prefix=$HOME/local/openbabel --exec-prefix=$HOME/local/openbabel
[lots of output]
$ make
[even more output]
$ make install
[look ma, no sudo]
```

Aside: if you're new to compiling C++ code and are running Ubuntu, this command will install everything you'll need to build Open Babel:

```bash
sudo aptitude install build-essential
```

We can then run Open Babel:

```bash
$HOME/local/openbabel/bin/babel -ismi -oinchi
c1ccccc1
InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H
1 molecule converted
6 audit log messages
```

If you want to do further development work or scripting, the above may not be ideal. But to get Open Babel running in situations in which you can't or prefer not to use root, this approach does the trick.