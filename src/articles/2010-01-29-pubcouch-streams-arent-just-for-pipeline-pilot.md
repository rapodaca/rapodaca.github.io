---
title: PubCouch - Streams Aren't Just for Pipeline Pilot
published: "2010-01-29T00:00:00.000Z"
---

If you've been following along with the development of [PubCouch](http://github.com/metamolecular/pubcouch), the CouchDB interface for PubChem, you've probably noticed that only a fraction of the code relates to CouchDB itself. What's the rest of it doing?

This article, the the third in a series on [using CouchDB for PubChem data](/articles/2010/01/20/pubcouch-a-couchdb-interface-to-pubchem) describes how PubCouch transforms PubChem's collection of gzipped archive files into a stream of structure-data records that can be processed as if it were one big SD File.

# The Problem

If you want to work with the PubChem dataset, one of the first problems you'll face is how to import the data into your database management system (dbms). The PubChem FTP server contains a rather large collection of archive "bundles", which are simply [gzipped SD Files of records within a certain ID range](/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp).

In most cases, importing the PubChem database will consist of sequentially reading every Compound and Substance record, applying the appropriate intermediate processing, and storing the result.

So, we have a mismatch in the way PubChem stores its data (multiple gzipped archives) and the way we want to process it (as one big SD File). And by the way, how about not storing a bunch of temporary files, but rather transfer data directly from the archive to our database?

# A Solution

One of the reasons Java was chosen as PubCouch's development language is its built-in support for high-performance IO operations. [InputStream](http://java.sun.com/j2se/1.4.2/docs/api/java/io/InputStream.html), the foundation of this support, turns out to be a very versatile class enabling a variety of filtering and reprocessing operations on raw data streams.

Our [FTP Client](http://commons.apache.org/net/) can return at most one raw byte stream from each archive file. By applying a set of filters on this stream, we can get pretty close to where we need to be:

- wrap each InputStream in a [GZIPInputStream](http://commons.apache.org/net/)
- wrap the result in an [StreamReaderReader](http://java.sun.com/j2se/1.4.2/docs/api/java/io/InputStreamReader.html)
- wrap the result in a [BufferedReader](http://java.sun.com/j2se/1.4.2/docs/api/java/io/BufferedReader.html) to read line-by-line

These filters alone won't do the job - remember, we want to treat the entire FTP archive as one big SD File.

[SequenceInputStream](http://java.sun.com/j2se/1.4.2/docs/api/java/io/SequenceInputStream.html) is just what we need. This nifty little class can make a series of InputStreams (i.e., the individual PubChem files) appear as one big InputStream.

Putting this all together, we end up with a chained series of inputs:

```bash
[InputStream -&gt; GZIPInputStream] -&gt;
SequenceInputStream -&gt;
StreamReader -&gt;
BufferedReader
```

We now have a BufferedReader that will for all intents and purposes look like we've just opened a massive SD File. Handing this Reader to an SD File processor will let us capture all Substance or Compound records using a simple conceptual model.

# Conclusions

By using Java's support for stream chaining and transformation, PubCouch makes it possible to work with the PubChem FTP archive as if it were one big SD File. This turns out to be useful regardless of how you decide to ultimately represent and store the resulting records. There are still some rough edges in the implementation and possibilities for extending the concept (i.e., random-access), but the idea can be used on many other datasources, and in many other contexts.