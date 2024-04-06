---
title: "Big Data in Chemistry: Mirroring PubChem the Easy Way Part 2"
disqus: true
published: "2010-02-09T00:00:00.000Z"
---

One of the useful (and unnerving) things about running a blog is that you're forced to face what you don't know (usually very publicly). I've been looking for the simplest way to maintain an up-to-date local copy of PubChem. I previously posted an article describing one way to [mirror PubChem](http://depth-first.com/articles/2010/02/08/big-data-in-chemistry-mirroring-pubchem-the-easy-way) through the use of rsync and curlftpfs.

Although this method works, it turns out that there's an even simpler way to do this with wget. For Compounds:

```bash
wget --mirror --accept "*.sdf.gz" ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/
```

For Substances:

```bash
wget --mirror --accept "*.sdf.gz" ftp://ftp.ncbi.nlm.nih.gov/pubchem/Substance/CURRENT-Full/SDF/
```

The --mirror option bundles several options together relating to <a href="http://sunsite.ualberta.ca/Documentation/Gnu/wget-1.7/html_chapter/wget_5.html">timestamping</a>. This is how wget will be able to download only the updates to the PubChem archives directory, rather than downloading the entire PubChem archive every time.

Without any options, the default behavior of wget is to not preserve timestamps and to force a complete download of all files every time.

The `--accept` option says we only want to download gzipped SDF files (leaving out, for example, text files).

Whenever you're ready to update your local PubChem archive, simple run the two commands above and you're done. You'll have a copy of the PubChem dataset that matches - to within one day - the dataset being used by NCBI itself.

Pretty simple, huh?

Now if I could just figure out how to use a single wget command to mirror both the Compound and Substance directories...