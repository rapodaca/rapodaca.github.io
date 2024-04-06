---
title: "PubCouch: Install CouchDB on Ubuntu Karmic From Source"
published: "2010-01-28T00:00:00.000Z"
---

Although I find CouchDB's slogan "Relax" comforting, after having worked with Couch both on OS X and Linux, I can say with confidence that the only time to relax is *after* CouchDB is installed and tested. The process of getting to that point is about as relaxing as root canal.

This article, the second in a series on [using CouchDB for PubChem data](http://depth-first.com/articles/2010/01/20/pubcouch-a-couchdb-interface-to-pubchem), describes in detail how to install CouchDB from source on a freshly-built Ubuntu Karmic server.

# The Problem

At [Metamolecular](http://metamolecular.com), we've installed the latest Ubuntu release - [Karmic Koala](https://wiki.ubuntu.com/KarmicKoala) on production and development boxes - getting CouchDB installed and running was the next task.

Unfortunately, the Karmic CouchDB binary distribution is [broken](https://bugs.launchpad.net/ubuntu/karmic/+source/couchdb/+bug/448682) - badly, and I can confirm all of the problems previously reported. It would appear that for now, CouchDB is one of those Ubuntu packages best compiled from source. There's another reason to install from source: CouchDB is still developing quite rapidly. Building from source increases the chances we'll be able to stay up-to-date at all times.

I was disappointed at the lack of documentation for installing CouchDB from source on Karmic, so I've decided to share what worked from me here. This procedure worked on a newly-built system with no previous CouchDB installation. If you've already installed the binary packages, or other versions of Erlang or SpiderMonkey, you may have more work to do. What follows is a little out of order, and I may clean up when time permits.

# Download, Compile, and Install CouchDB

```bash
sudo aptitude install build-essential erlang libicu-dev libmozjs-dev libcurl4-openssl-dev
mkdir src
cd src
wget http://apache.cs.utah.edu/couchdb/0.10.1/apache-couchdb-0.10.1.tar.gz
tar xvf apache-couchdb-0.10.1.tar.gz
cd apache-couchdb-0.10.1/
./configure
make
sudo make install
```

# Configure CouchDB

The [CouchDB Book](http://books.couchdb.org/relax/) indicates these permissions need to be set, so I used:

```bash
sudo chmod -R 0770 /usr/local/etc/couchdb
sudo chmod -R 0770 /usr/local/var/lib/couchdb
sudo chmod -R 0770 /usr/local/var/log/couchdb
sudo chmod -R 0770 /usr/local/var/run/couchdb

sudo chown -R couchdb:couchdb /usr/local/etc/couchdb
sudo chown -R couchdb:couchdb /usr/local/etc/couchdb
sudo chown -R couchdb:couchdb /usr/local/var/lib/couchdb
sudo chown -R couchdb:couchdb /usr/local/var/log/couchdb
sudo chown -R couchdb:couchdb /usr/local/var/run/couchdb
```

Unfortunately, CouchDB won't run at this point:

```bash
sudo -i -u couchdb couchdb -b
sudo: unable to change directory to /var/lib/couchdb: No such file or directory
Apache CouchDB needs write permission on the STDOUT file: couchdb.stdout
```

We need to create the missing directory and assign its permissions:

```bash
$ sudo mkdir /var/lib/couchdb
$ sudo chown -R couchdb:couchdb /var/lib/couchdb
```

I like to be able to run servers using init.d, so I used:

```bash
$ sudo cp -v /usr/local/etc/init.d/couchdb /etc/init.d/couchdb
```

Now we can start CouchDB and confirm it's working:

```bash
$ sudo /etc/init.d/couchdb start
$ netstat -an | grep 5984
tcp        0      0 127.0.0.1:5984          0.0.0.0:*               LISTEN
```

The problem with this configuration is we won't be able to use the [Futon](http://books.couchdb.org/relax/intro/getting-started) admin console from any location other than localhost. Because I'm setting up a server that will be compiling long running tasks, I want to know I can pop into Futon to check things out.

To do that, we'll need to make a slight change. In the file */usr/local/etc/couchdb/default.ini*, change the line that reads:

```bash
bind_address = 127.0.0.1
```

to:

```bash
bind_address = 0.0.0.0
```

# One Last Wrinkle

Although you'll be able to create and read documents with what we've done so far, a cryptic error is displayed when we try to compile views: "{exit_status,127}".

Starting with [this thread](http://osdir.com/ml/couchdb-user/2009-03/msg00415.html), I was able to piece together the answer. Running the following command shows us that Couch can't find one of the Spidermonkey libraries:

```bash
$ /usr/local/bin/couchjs /usr/local/share/couchdb/server/main.js
/usr/local/lib/couchdb/bin/couchjs: error while loading shared libraries: libmozjs.so.0d: cannot open shared object file: No such file or directory
```

We can find out which package might fit the bill with:

```bash
$ aptitude search libmozjs
p   libmozjs-dev                                                   - Development files for the Mozilla SpiderMonkey JavaScript library       
i   libmozjs0d                                                     - The Mozilla SpiderMonkey JavaScript library                             
p   libmozjs0d-dbg                                                 - Development files for the Mozilla SpiderMonkey JavaScript library
```

We installed the first of these libraries at the beginning of the process; it turns out we need to install the other one, too:

```bash
$ sudo aptitude install libmozjs0d
```

We can now restart CouchDB and bask in all of its Map/Reduce glory:

```bash
$ sudo /etc/init.d/couchdb stop
$ sudo /etc/init.d/couchdb start
```

# Conclusions

Installing CouchDB from source on the newest Ubuntu release is not hard with some basic documentation. We now have a completely up-to-date CouchDB system that we can (hopefully) upgrade as new releases are made. If you want to use CouchDB in production, there are a few more security-related steps you'll want to take, but as a development system, the setup described here should work nicely.

If the procedure outline here worked for you, or if you find problems with it, I'd really appreciate your comments.