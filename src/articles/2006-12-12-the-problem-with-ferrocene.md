---
title: "The Problem with Ferrocene"
disqus: true
published: "2006-12-12T00:00:00.000Z"
---

[![407133](/images/posts/20061212/ferrocene_407133.png "407133")](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=407133)

[![504306](/images/posts/20061212/ferrocene_504306.png "504306")](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=504306)

[![517796](/images/posts/20061212/ferrocene_517796.png "517796")](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=517796)

[![7611](/images/posts/20061212/ferrocene_7611.png "7611")](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=7611)

Four different Compound Identifiers. Three different canonical SMILES. Three different InChIs. This is how Ferrocene is represented in <a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a>. Even more strangely, none of bonding arrangements accurately reflect the ways most chemists would think about it.

It's not a Good Thing to list the same compound under four different entries in the same molecular database. In the best case it's inconvenient. In the worst case it can cause information that does exist to act as if it does not. I'm guessing, but I would suspect that behind the scenes at PubChem one or more chemical informatics tools are being pushed beyond their area of expertise.

SMILES, InChI, Molfile, and CML are molecular languages that were designed primarily with organic compounds in mind. In this world, bonds occur in neat two-atom units with an even (integer) number of shared electrons. This system falls apart in the world of organometallic chemistry, where multi-atom bonding is commonplace. The same problem also crops up when describing de-localized organic ions and radicals. Multi-atom bonding even rears its head in something as prosaic as the aromaticity of naphthalene and benzene. (To be fair, InChI has less of a problem here than most other molecular languages because of its focus on atoms rather than bonds.)

Is the problem serious enough to do something about it? Forty years ago, metallocenes were a novelty - today they're ubiquitous. They're key components of new materials, catalysts, and perhaps eventually even drugs. They're abundant in every major chemical supplier's catalog. Every respectable journal runs at least one article per issue in which metallocenes play an important role. It seems unlikely that the problem with Ferrocene and its multi-atom bonding cousins can continue to be swept under the rug much longer.

Maybe the problem lies with the deficiencies of the molecular languages currently in use. After all, it seems unlikely that any system can ever become <a href="http://depth-first.com/articles/2006/11/08/debabelization">the "universal" language of chemical informatics</a>. On the other hand, the problem may instead arise from these languages, and their limitations, figuring too prominently in the design of the underlying software.