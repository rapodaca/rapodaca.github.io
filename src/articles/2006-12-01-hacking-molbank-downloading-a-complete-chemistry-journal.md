---
title: "Hacking Molbank: Downloading a Complete Chemistry Journal"
published: "2006-12-01T00:00:00.000Z"
---

The previous article in this series highlighted Molbank as a tool for studying the <a href="http://depth-first.com/articles/2006/11/30/molbank-and-the-convergence-of-open-access-open-data-and-open-source-in-chemistry">convergence of Open Access, Open Data, and Open Source in chemistry</a>. This article will outline some of the technical and legal aspects of downloading and using Molbank content.

# Mirror, Mirror

MDPI themselves <a href="http://mdpi.net/MIRRORING/mirroring.html">actively encourage</a> the copying of their journal content by a process known as mirroring:


> We encourage two types of mirroring :
>  
> - Institutional Mirroring : Institutions may help not only their own members, but neighbouring scientists, to have a faster and reliable access to MDPI journals. For institutions, this is a tradeoff : they save bandwidth on outgoing traffic, while having more inbound traffic. One positive aspect is that sites supporting mirrors become more visited and better known. We are going to maintain a list of supporting institutional mirror sites which is going to be presented in an extremely visible fashion, on the welcome pages of each journal, so that all MDPI readers can access the nearest site.
> - Personnal Mirroring : With hard disks becoming larger and cheaper, it becomes not unreasonnable to set up his/her own personnal mirror, with all the information at your fingertips !. An automated procedure, running at night, keeps your personnal mirror always updated. This is extremely convenient. You may keep this mirror to yourself, or openned to your colleagues, you may do what you wish !

The text then goes on to give explicit instructions on how to create a mirror of the entire MDPI site and all of its journal content using Linux. So not only does MDPI explicitly allow the non-commercial copying of their content, but that copy can then be hosted on the Web, transmitted through other media, or simply used locally. It's the latter of these uses that this article will address.

# Create a Molbank Archive

The Unix command `wget` can be used to copy the content of any website. Before using `wget`, or any similar tool, you should <a href="http://depth-first.com/articles/2006/09/22/hacking-pubchem-why-the-open-access-fight-is-just-the-beginning">check the `robots.txt` file</a> for the site of interest. I have so far been unable to find a `robots.txt` file on the MDPI site, so I assume there is no problem with running either `wget` or other robotic agents. But for the purposes of this tutorial, it is more convenient to create a local copy.

To create a local copy of all 2005 articles in Molbank, for example, use `wget` with the appropriate arguments:

```bash
wget -r -l2 http://www.mdpi.net/molbank/molbank2005.htm
```

The `-r` flag turns on recursive directory retrieval, and the `-l2` flag sets the retrieval depth to two.

When the process is complete, you should have a directory called `www.mdpi.net` in your working directory. This directory will contain a subdirectory called `molbank` which in turn contains two directories: `2005` and `2006`. Under the `2005` directory, you'll find all of Molbank's articles in HTML format, all images, and all molfiles. It's not clear to me yet why the `2006` directory is created and why it only contains one article.

# Checking the Archive

A large number of Molbank's molfiles appear to be corrupted. This isn't related to `wget`, because these files are also corrupted when viewed through a browser directly from <a href="http://www.mdpi.org">http://www.mdpi.org</a>. For example, the molfile for Molbank article #393 appears corrupted (as do all of the other molfiles for July 2005):

<a href="http://www.mdpi.org/molbank/molbank2005/m393.mol">http://www.mdpi.org/molbank/molbank2005/m393.mol</a>

You'll also find several instances of bogus molfiles containing only one or two atoms, such as for Molbank article #431:

<a href="http://www.mdpi.org/molbank/molbank2005/m431.mol">http://www.mdpi.org/molbank/molbank2005/m431.mol</a>

Some molfiles are missing altogether, such as the one for Molbank article #405:

<a href="http://www.mdpi.org/molbank/molbank2005/m405.mol">http://www.mdpi.org/molbank/molbank2005/m405.mol</a>

Clearly, the integrity of Molbank's molfiles can not be assumed. Software designed to work with this dataset will therefore need to be capable of gracefully handling corrupted, nonexistent, and bogus molfiles.

# Conclusions

Molbank permits the non-profit copying of its entire article collection. With some simple command-line tools, it's possible to quickly and easily create your own personal Molbank mirror. A cursory examination of the molfiles contained in Molbank showed several problems that need to be taken into consideration. The remaining articles in this series will describe some ways that Molbank's content can be put to use with Open Source software, and mashed up with Open Data.