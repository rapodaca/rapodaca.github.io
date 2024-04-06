---
title: CouchDB for Chemistry
published: "2009-04-22T00:00:00.000Z"
---

Creating useful data-driven applications for chemists is not an easy job. Data heterogeneity represents one of the stumbling blocks. Chemists create and use so many different kinds of data, from spectra in XY format to raw FIDs to PDFs to chemical structures to in vivo biological results, that deciding the structure of a database up-front, as required by relational databases can be difficult at best. As a project grows, its data needs can change, putting further stress on the system.

# A Little About CouchDB

Every once in awhile a technology comes along that forces me to rethink my "standard" toolset. One that I've recently found is [CouchDB](http://couchdb.apache.org/), a [document-oriented database](http://www.ibm.com/developerworks/opensource/library/os-couchdb/index.html).

Rather than working with tables and rigid schema, CouchDB works with documents, just like the people using it. 

If that were all that was different about CouchDB, it would be worth giving it a spin. But there's much more to the story than that. Consider:

-  You communicate with CouchDB through RESTful HTTP.
-  Documents are added and returned in [JavaScript Object Notation](http://www.json.org/) (JSON).
-  Queries are written in JavaScript.
-  CouchDB was designed with high concurrency in mind.

# Installing

Following the tutorial posted by [Craig Webster](http://barkingiguana.com), I was able to easily [get CouchDB 0.8.0 installed and running on my Ubuntu Linux system](http://barkingiguana.com/2008/06/28/installing-couchdb-080-on-ubuntu-804). Instructions for installing on other systems are available [here](http://wiki.apache.org/couchdb/Installation).

# Browser-Based Admin

CouchDB comes with an excellent admin tool that works with a browser. Loading [http://localhost:5984/_utils/](http://localhost:5984/_utils/) serves the main admin page. From here, clicking on the "Create Database ..." link guides you through the process.

After creating a database called "chempedia," I added a document with "Create Document ...". Using "benzene" for the name, I then added a molfile field with "Add Field". Using JSON as the format, I entered the following:

```bash
{"string" : "[NO NAME]\n  CHEMWRIT          2D\nCreated with ChemWriter - http://metamolecular.com/chemwriter\n  6  6  0  0  0  0  0  0  0  0  0 V2000\n    4.3501   -4.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.2161   -5.2508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0821   -4.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0821   -3.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.2161   -3.2508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.3501   -3.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  2  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  2  0  0  0  0\n  6  1  1  0  0  0  0\nM  END"}
```

After saving the document with "Save Document", my database had one document called "benzene." Now it's time to read it.

# RESTful Reading

You can interface with CouchDB using many HTTP clients. For example, with cURL, the command to get a list of available databases might look like:

```bash
curl -X GET http://127.0.0.1:5984/_all_dbs
["chempedia"]
```

And the benzene document I previously stored can be read back with:

```bash
curl -X GET http://127.0.0.1:5984/chempedia/benzene
{"_id":"benzene","_rev":"2318173959","molfile":{"string":"[NO NAME]\n  CHEMWRIT          2D\nCreated with ChemWriter - http:\/\/metamolecular.com\/chemwriter\n  6  6  0  0  0  0  0  0  0  0  0 V2000\n    4.3501   -4.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.2161   -5.2508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0821   -4.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0821   -3.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.2161   -3.2508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.3501   -3.7508    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  2  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  2  0  0  0  0\n  6  1  1  0  0  0  0\nM  END"}}
```

Of course, this is just the beginning. But even from this simple example the intuitive way CouchDB works should be clear.

Using raw HTTP is certainly one way to use CouchDB, but fortunately, many libraries now exist for doing so with a native feel in your language of choice. 

# Where Now?

As a way to teach myself more about CouchDB, I'll be building something practical and chemically-oriented with it. As I do so, I'll post updates here and compare the process to the ways I've built database systems before. I'm kicking around some ideas, but if there's something you'd like to see, feel free to drop me a line.