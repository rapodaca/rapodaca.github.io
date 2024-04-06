---
title: "Hacking PubChem: Why The Open Access Fight is Just the Beginning"
published: "2006-09-22T00:00:00.000Z"
---

Like no other medium, the Internet tests our basic beliefs about the rights of resource owners and resource users. As the Internet increasingly becomes home to scientific publication mechanisms that have no counterpart in the physical world, a larger question looms: what separates fair use of these services from abuse?

Depth-First hosts a series of articles, with possibly many more to follow, on programatically accessing open chemical information databases:

- <a href="/articles/2006/09/21/hacking-pubchem-query-by-smiles">Hacking PubChem: Query by SMILES</a>
- <a href="/articles/2006/08/30/hacking-pubchem-with-ruby">Hacking PubChem with Ruby</a>
- <a href="/articles/2006/09/04/hacking-nmrshiftdb">Hacking NMRShiftDB</a>

The availability of open chemical information resources like <a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a> and <a href="http://nmrshiftdb.org/">NMRShiftDB</a> is a very recent phenomenon, and desperately overdue. One premise of this blog is that chemical informatics is at the start of a renaissance; the chemical information revolution that started in the 1950's is now set to continue after a long period of stagnation. Large, open data sources, and open software that mines it, will fuel this transformation, just as they have in bioinformatics.

The interaction of non-browser software with public databases, although rich in potential payoffs, can also lead to a great deal of damage. PubChem contains millions of structure-searchable compounds. Setting the wrong kinds of programs loose on this site could cause service interruptions ranging from the annoying to the severe.

There is no standard mechanism for website owners to spell out acceptable use policies to non-browser software. The closest thing we have to a standard is the <a href="http://www.robotstxt.org/wc/exclusion.html">Robots Exclusion Protocol</a>. This protocol defines acceptable behaviors for a robot, which according to <a href="http://www.robotstxt.org/wc/faq.html#what">one definition</a> consist of: "... a program that automatically traverses the Web's hypertext structure by retrieving a document, and recursively retrieving all documents that are referenced." Other definitions are in use. The one thing these definitions seem to have in common is the concept of scale: the more comprehensive and indiscriminate the program is in its interactions with a website, the more like a robot, and less like a browser, it becomes.

Site owners specify their robots policy in a file called <strong>robots.txt</strong> hosted on their servers. The <a href="http://pubchem.ncbi.nlm.nih.gov/robots.txt">PubChem robots.txt file</a> currently includes the following policies:

```http
User-agent: *
Disallow: /substance/PcsSrv.cgi
Disallow: /summary/summary.cgi
Disallow: /assay/assay.cgi
Disallow: /image/imgsrv.fcgi
Disallow: /image/smi2gif.fcgi
Disallow: /image/smi2gif.cgi
Disallow: /image/structurefly.cgi
Disallow: /search/NbrQsrv.cgi
Disallow: /search/PreQSrv.cgi
```

Here, <code>User-agent</code> refers to the name of the robot, which is set as a wildcard, meaning any robot. The <code>Disallow</code> lines refer to resources off-limits to robots.

One of these disallowed resources, <code>/search/PreQSrv.cgi</code> is explicitly used in the <a href="http://depth-first.com/articles/2006/09/21/hacking-pubchem-query-by-smiles">PubChem SMILES query article</a>.

Is a person who runs software of the type I describe in these articles violating PubChem's use policy? The best answer I can give is, "it depends." I think it would be hard for reasonable people to suggest that using the software as described in the tutorials, with their deliberately limited scope, for research purposes, and with no intent to do damage, represents abuse.

On the other hand, I can see how reasonable people could argue that a website operating as a comprehensive front-end to PubChem using the techniques described in these articles could be considered abuse. I know I might consider it abuse if I ran PubChem, depending on why I was running the service.

If I wanted to stimulate innovation in the area of open database mining, I might actually encourage front ends and similar third-party PubChem services. I might set aside servers specifically dedicated to this kind of activity. I might even develop an Open Source PubChem Web-API to help developers get started. Unfortunately, NIH's intentions are not exactly clear on this point.

Looking at the <a href="http://www.ncbi.nlm.nih.gov/About/disclaimer.html">NCBI's Copyright and Disclaimers page</a>, the only document that to my knowledge states any kind of use policy, is not especially illuminating:

> *Conditions of Use*
>
> This site is maintained by the U.S. Government and is protected by various provisions of Title 18 of the U.S. Code. Violations of Title 18 are subject to criminal prosecution in a federal court. For site security purposes, as well as to ensure that this service remains available to all users, we use software programs to monitor traffic and to identify unauthorized attempts to upload or change information or otherwise cause damage. In the event of authorized law enforcement investigations and pursuant to any required legal process, information from these sources may be used to help identify an individual.

We are left with the critical, but unanswered question: "What represents an unauthorized use of PubChem?"

The document cited above also raises the truly bizarre possibility of PubChem not actually being capable of granting rights to redistribute what is contained on its servers:

>This site also contains resources such as PubMed Central, Bookshelf, OMIM, and PubChem which incorporate material contributed or licensed by individuals, companies, or organizations that may be protected by U.S. and foreign copyright laws. ...

But this is a subject for another day.

Getting back to accessing PubChem data, one very far-sighted thing the NIH has done is to make the entire dataset <a href="ftp://ftp.ncbi.nlm.nih.gov/pubchem/">freely downloadable</a> in three different file formats. Rather than mine the PubChem website itself, you could download the data to your machine, letting the software you write access it locally. The sheer size of this dataset creates problems of its own. Future articles will describe some approaches to solving them.

Regardless of your views on the use and abuse of chemical information resources like PubChem, it's clear that getting open resources on the Web is only the first in a long series of controversial steps that will ultimately transform both the practice and culture of research.