---
title: If You Want to Change the World, Build the Tool First - Part 2
disqus: true
published: "2007-12-20T00:00:00.000Z"
---

Let's face it - real change is painful for most people. Think back, for example, to your last big change at work, and chances are pretty good that the experience was not entirely enjoyable - especially if the change was imposed on you.

As designers of tools, it's easy to forget just how unpleasant change is for your users. Being closely involved and invested in the development of your tool only makes it harder to empathize with the people whose routines you'll be interrupting.

When innovations fail to catch on, it may be tempting to explain the situation in terms of users not "getting it," or through the intervention of outside forces with their own agenda. But more often than not, the real problem results from the innovation failing to offer a reasonable promise of compensation for the inconvenience that change brings.

[The previous article in this series](/articles/2007/12/18/if-you-want-to-change-the-world-build-the-tool-first-part-1), suggested that the same dynamic applied to the compilation, management, and sharing of spectral data by chemists. More to the point:

> ... cheminformatics has failed to deliver an inexpensive, robust, and truly usable solution to the problem of compiling, managing, and sharing spectral data for scientists of average computer skills. ...

To be sure, there are tools that address parts of the problem. But no solution addresses them all and that's why scientists and publishers resort to using obviously inferior solutions like PDFs. Let's take each of the requirements one at a time:

-  **Inexpensive.** One of the chronic problems in vertical markets like chemistry software is the lack of ubiquitous tools. Lack of ubiquity is a recipe for balkanization. Because chemistry software tends to be highly specialized and expensive to develop, suppliers must and do pass these costs onto customers. Change linked to money is especially hard to accept. The key, therefore, to developing the ideal tool is to relentlessly focus on keeping development cost low so as to deliver a low-cost (or free) tool. It's all but guaranteed that the ideal tool will take advantage of multiple pieces of Open Source software.
-  **Robust.** Few things are more difficult than trying to convince a skeptic to try a new, unreliable technology. Getting the last 20% in reliability is [orders of magnitude more difficult than getting the first 80%](/articles/2007/06/29/starting-quitting-and-finishing). Part-way simply won't cut it.
-  **Usable.** A steep learning curve is a surefire deterrent to adoption. Chemistry has a long history of software with poor usability. Who could blame jaded users for turning away from "yet another piece of software." Make it [obvious](/articles/2007/09/28/designing-the-obvious) or don't make it at all. Tying the tool to a specific operating system or browser is an [especially bad idea](/articles/2007/11/16/why-web-development-is-hard); "usable" means usable by everyone.

The ideal solution must also address the three key needs chemists have with respect to using their spectra:

-  **Compile Spectra** Contrary to an apparently popular belief among non-experimental chemists, most experimental chemists create their own spectra. There may be a "spectroscopist" who handles unusual cases, but the vast majority of spectra are created and interpreted by the chemist. They need a tool that requires no thought or planning to get a spectrum from the instrument into a database and ultimately onto their desktop.
- **Manage Spectra** During any given year, an organic chemist of average productivity can generate hundreds of spectra. It's a safe assumption today that these will be in digital format. The volume of data creates its own set of problems: where to store the spectra, how to store them, how to find them again, and how to manipulate them once they are found. Tagging the spectra in such a way that the sample history can be reconstructed is critical.
-  **Share Spectra** One of the primary channels for sharing spectral data is through scientific publication. The tool must offer an obvious solution for scientists to compile their data into packages that publishers can work with and readers can do something with.

The analogy that springs to mind is blogging. As early as 1994, blogging was technically possible - all the pieces were in place and the demand for online content was mushrooming. But why didn't it happen? There was no tool that actually made it *cheap* and *easy* to blog. Staring in 2000-2001, those tools started to appear. Today, we take it for granted that anyone who wants to publish their own writing can do so almost immediately.

The availability of the tool did what years of discussion failed to do; it changed behavior. It succeeded by offering a reward that more than compensated for the pain of change.

The development of a ubiquitous tool for spectral data compilation, management, and sharing is an opportunity with a potentially big reward for the group that gets it right. It's one of those uninteresting, widespread problems that creates a [natural scarcity of good solutions and people willing to develop them](/articles/2007/10/03/designing-the-obvious-permalinks-and-paradigms). Most players in the field have concluded (prematurely) that the solution(s) already exists, and so are reluctant to get involved.

What more could you ask for as a developer?
