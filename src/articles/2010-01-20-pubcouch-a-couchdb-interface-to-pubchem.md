---
title: "PubCouch: A CouchDB Interface to PubChem"
published: "2010-01-20T00:00:00.000Z"
---

The choice of a database can have far-reaching consequences on an application's design and capabilities. I've recently become interested in [CouchDB](http://couchdb.apache.org/) and other so-called [NoSQL](http://en.wikipedia.org/wiki/NoSQL) databases as an alternative to traditional approaches.

This article, the first in a series, explores how CouchDB can be applied to real-world cheminformatics problems using [the PubChem dataset](/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp).

# Get Involved

An open source project called [PubCouch](http://github.com/metamolecular/pubcouch) has been set up on GitHub. PubCouch will be written in native CouchDB JavaScript (with an import utility written in a language TBA). I have no idea how this will turn out and no preconceptions about what it needs to be. If you like what you see, I encourage you to create a fork and start hacking.

# A Solution in Search of a Problem

For my money, the best way to learn a new technology is to apply it to a simple, but real problem that seems to be a good match. Until now, [that problem was lacking](/articles/2009/04/22/couchdb-for-chemistry). Thanks to one of my clients, who would like some information that may be extractable from PubChem, I may have just the excuse (er... problem) I needed.

If you've ever [used the PubChem dataset](/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp), you've probably noticed it's not the easiest thing to work with. For one thing - it's BIG. For another, it's not relational; instead, the PubChem dataset consists of a collection of individual documents assembled into files.

Awhile back, I wrote about one approach to working with PubChem in which [each Structure and Substance was broken down into tables with relationships](/articles/2008/05/26/simple-cas-number-lookup-and-more-with-chempedia). In this, case, the document-oriented nature of the PubChem dataset was converted into a relational system that could be easily used from an RDBMS.

But document-oriented databases like CouchDB offer an intriguing alternative. Instead of overlaying a preconceived database schema on the PubChem dataset, we can dynamically generate these relationships on a case-by-case basis using [MapReduce](http://wiki.apache.org/couchdb/Introduction_to_CouchDB_views).

<center><embed src="http://blip.tv/play/AcrAPwI" type="application/x-shockwave-flash" width="480" height="300" allowscriptaccess="always" allowfullscreen="true"></embed></center>

# A General Plan

PubCouch will start off with some basic tools for converting raw PubChem FTP downloads into CouchDB documents. It'll then move on to creating some simple MapReduce functions to answer basic questions. If the project is still alive at this point, it may then be dedicated to creating a range of MapReduce functions for performing a variety of sophisticated queries against the entire PubChem dataset, possibly taking advantage of CouchDB's [highly-touted replication capabilities](http://books.couchdb.org/relax/reference/replication).

*Credit: [Rajarshi Guha](http://blog.rguha.net/) got the wheels turning with his [series on Hadoop](http://blog.rguha.net/?p=289).*