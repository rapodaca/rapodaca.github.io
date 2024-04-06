---
title: "Big Data in Chemistry: Incrementally Mirror PubChem the Easy Way"
published: "2010-03-01T00:00:00.000Z"
---

The previous article in this series described a simple way to [set up your own PubChem mirror](/articles/2010/02/09/big-data-in-chemistry-mirroring-pubchem-the-easy-way-part-2). By using some simple Unix command line tools, I showed one way to maintain a fully up-to-date snapshot of PubChem.

But how do you continue to maintain a dataset based on PubChem days, weeks, and months after you import the initial snapshot? The PubChem dataset will be simply too large to process every time you refresh your snapshot. You'll need something more incremental.

Fortunately, there's an answer. In addition to all of the other cool things wget can do with the PubChem FTP site, it can also be used to maintain a set of incremental updates.

This command does it:

```bash
wget --mirror --accept "*.sdf.gz,killed-SIDs,killed-CIDs" --wait 1 ftp://ftp.ncbi.nlm.nih.gov/pubchem/{Compound,Substance}/Daily/
```

We tell wget to mirror the daily Compound and Substance directories on the PubChem FTP server. In addition to sdfgz files, we include the files listing obsolete Compound and Structure records. Because we'll be making a lot of requests, we play nice by adding a one second delay between them.

Although the daily archives are rotated weekly, our local copy will contain *all* updates - as long as we don't delete them manually, and the script is run at least once per week.
