---
title: "Hacking PubChem: Entrez Programming Utilities"
published: "2006-09-23T00:00:00.000Z"
---

A <a href="http://depth-first.com/articles/2006/09/22/hacking-pubchem-why-the-open-access-fight-is-just-the-beginning">recent article</a> poses the question of how to balance the rights of owners of open chemical information resources against those of their users, while promoting an innovative environment for third-party developers. Although <a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a> was the focus, the discussion could apply to any other chemical information resource. A reasonable approach would be to provide two separate entry points: one for Web browsers and another for various types of semi-autonomous software used in hacking and mashups.

<a href="http://wwmm.ch.cam.ac.uk/blogs/corbett/">Peter Corbett</a> writes to point out that the <a href="http://eutils.ncbi.nlm.nih.gov/entrez/query/static/eutils_help.html">Entrez Programming Utilities</a> can be used to query PubChem and other databases under the NIH/NCI/NCBI umbrella. A separate developer server processes requests, and the terms of its use are fairly well stated. Future articles will explore the possibility of building some simple Ruby APIs for this developer PubChem entry point.