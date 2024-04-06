---
title: "PubCouch: Create Your Own Custom PubChem Subset"
published: "2010-02-04T00:00:00.000Z"
---

If you've ever worked with the PubChem dataset, you may have found yourself wanting to create a custom subset that filters out certain records. This article, the fourth in a [continuing series](http://depth-first.com/articles/2010/01/20/pubcouch-a-couchdb-interface-to-pubchem), shows a very simple way to create a custom PubChem dataset using [PubCouch](http://github.com/metamolecular/pubcouch).

# The Problem

I really like PubChem. It's the world's largest collection of freely-downloadable chemical structures and an excellent use of taxpayer dollars.

But PubChem has faced some tough tradeoffs over the years., one of the foremost being how inclusive it should be. In other words, when to say 'no' to a substance depositor. I won't rehash the details here, but suffice it to say that the technologies on which PubChem is based are limited in important ways (for example: [organometallics](http://depth-first.com/articles/2006/12/12/the-problem-with-ferrocene)).

As part of ongoing work to expand [Chempedia](http://chempedia.com), the free chemical substance registry, I became interested in the possibility of building a subset of the PubChem Compound registry that only contained structures that could be safely encoded by the MDL Molfile specification. Call it "PubChem: The Good Parts."

This database was likely to be huge and pretty non-relational. It looked like a perfect job for PubCouch.

# A Solution

The software to solve this problem has been built into PubCouch. There are a couple of ways to run it, but I find one of the simplest is to use JRuby:

```bash
git clone git@github.com:metamolecular/pubcouch.git
cd pubcouch
ant jar
jruby -S rake compounds:snapshot
```

To get that last part working, you'll need to [install JRuby](http://jruby.org/getting-started). This is optional; you could also create an Ant task or use some other script. The point is that we're running a pre-packaged PubCouch task called "Compounds".

There's one more thing - you'll obviously need CouchDB installed, and you'll need an empty database called "compounds". The database name can be changed to fit your preferences.

Finally, the way this works is likely to change in the future. To be sure you'll be able to access the code describe here, please use [this commit](http://github.com/metamolecular/pubcouch/commit/8208a82f42815c15b8a5207db91725bb97e01242).

# Filtering

After running the snapshot task, you'll see some output indicating Compound IDs being checked and written.

Not every compound is being written. Only those passing a specific set of requirements will end up in CouchDB:

1.  No bond annotations other than 'aromatic'.
2.  No multicomponent (disconnected) Compounds.
3.  No undefined stereochemistry.
4.  No charged species.

These happen to be my requirements - yours will probably differ somewhat. To change the applied filter, simply change the method Compounds.StrictFilter.pass. It's that simple.

# Fine-Tuning

This is all pretty rough at this point. There are many opportunities to refine the code for flexibility and performance. For example, I initially experimented with CouchDB's [bulk update](http://wiki.apache.org/couchdb/HTTP_Bulk_Document_API) capability, which compresses multiple writes into a single HTTP request. But this actually resulted in more memory/processor usage. My guess is that this was probably less due to CouchDB than it was to the JSON overhead in the [JCouchDB](http://code.google.com/p/jcouchdb/) library I'm using to talk to CouchDB. Your results may vary.

# Conclusions

PubChem is an excellent free resource for raw chemical structures, if filtered correctly. This article showed how to create your own personal subset of PubChem using PubCouch.