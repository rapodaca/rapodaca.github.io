---
title: A 2D Chemical Structure Editor for the Web - Embracing Constraints in Firefly
published: "2007-04-18T00:00:00.000Z"
---

A [previous article](/articles/2007/04/16/the-structure-editor-forgotten-link-between-chemistry-and-cheminformatics) outlined the major concepts behind Firefly, a new 2D structure editor for the Web. Structure editors are unique in that they require solutions to problems in so many different areas: graphical user interface design; [chemical structure aesthetics](/articles/2007/03/30/the-aesthetics-of-chemical-structure-diagrams); 2D graphics and geometry; molecular representation; and graph theory, to name a few.

These are important considerations, but they pale in comparison to the biggest design challenge: Firefly must be deployed and run in a heterogeneous network environment. This one constraint frames all of the basic design questions involving platform, programming language, footprint, and mode of deployment. And this is a [Good Thing](/articles/2007/02/15/woz-on-design-and-constraints).

# Platform, Programming Language, and Deployment

Considering the diverse array of hardware and operating systems on the Internet, it's amazing that anything works at all. Although standards save the day in most cases, there is no all-purpose solution when it comes to interactive Web technologies. Today, there are essentially three options for Firefly:

-  **Flash** To my knowledge, no 2D structure editor has ever been implemented in Flash. (This alone sounds like a good reason to try it sometime.) As a platform, Flash has a lot going for it, including a large installed base, and the abstraction layer [OpenLaszlo](http://www.openlaszlo.org/). On the down side, Flash support on platforms such as Linux has not been what it could be. As Flash continues to mature, this problem may become less important.
-  **Ajax** Essentially nothing more than HTML and JavaScript - and no plug-ins of any kind. At least two editors have been written in Ajax: [WebME](/articles/2006/11/09/look-ma-no-applets) and [PubChem's editor](http://pubchem.ncbi.nlm.nih.gov/search/). Ajax works in a lot of situations, but in my opinion it still isn't up to the job of creating a responsive, interactive structure editor.
-  **Java Applet** A massive installed base, support for just about every kind of hardware in use, a robust object-oriented language with a powerful 2D graphics and GUI libraries, and it's even [Open Source](https://openjdk.dev.java.net/). Although Flash and Ajax have their advantages, Java is the best option for the foreseeable future. There are several [Java structure editors](/articles/2006/08/21/four-free-2-d-structure-editors-for-web-applications) to choose from, and for good reason. (Future articles will discuss what makes Firefly different.)

What about a Java application? Unfortunately, not even a user's ability to install software on their own machines can be taken for granted in the context in which Firefly will be running. For example, many companies enforce prohibitions against employee-installation of non-approved software. Machines found in libraries or other public places may face similar limitations. Given these real possibilties, an applet is the only option that makes sense.

As to the version of Java that Firefly is built on, JDK 1.4.2 seems to have become the unwritten standard. It's mature enough the have most of what Java has today, but is old enough to be on most machines. Even with this compromise, Firefly will have an impressive array of functionality to work with: Java2D, Swing, and many performance optimizations relative to earlier Java versions.

# Footprint

High-speed Internet access is ubiquitous. Bandwidth is now a commodity. Memory is practically free and processors - don't get me started on processors these days. But developers who take massive bandwidth and staggering processor power for granted are setting themselves and their users up for many unpleasant interactions. Firefly must be lightweight, responsive, and fast to deploy under any network load and on 80% of the hardware on the Web. Limiting its footprint to 150K will increase the chances of success.

With such a small footprint, none of the currently-available open source Java cheminformatics libraries (e.g. [CDK](http://cdk.sf.net), [JOELib](http://joelib.sf.net), [Octet](/articles/tag/octet)) will be of much use. They are simply too big. Even the smallest of them (Octet) weighs in at about 300K. Of course, it's possible to strip out unnecessary features from these libraries. But even then, a great deal of unused functionality would remain. This is the unavoidable downside of general-purpose libraries. By developing a small cheminformatics library specifically designed to power a 2D structure editor, Firefly should be able to meet the 150K target.

Is 150K a realistic goal? My previous experience in developing [Structure and Structure-CDK](/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk) taught me that with [Java2D](http://java.sun.com/products/java-media/2D/), very lightweight structure-rendering code is well within reach. For example, the Structure-CDK jarfile is an unoptimized 39K. (But even Structure-CDK faces the same problem as other general-purpose libraries - it's much bigger than it needs to be. In other words, some Structure-CDK concepts may be applicable to Firefly, but the code itself must be completely re-written.)

When combined with the fact that a lot of cheminformatics functionality, such as structure clean-up, can be [offloaded to a server](/articles/2006/12/18/anatomy-of-a-cheminformatics-web-application-structure-cleanup-in-java-molecular-editor), 150K begins to look like a very reasonable target.

As a final encouragement, consider that everything [Java Molecular Editor](http://www.molinspiration.com/jme/) does, including SMILES canonicalization, is contained in a jarfile no larger than 40K.

# Wrap-Up

As you can see, even before a single line of code was written, Firefly's design was constrained in some very important ways. [Identifying and embracing these constraints](http://gettingreal.37signals.com/ch03_Embrace_Constraints.php) doesn't ensure success, but it greatly increases its chances. In articles to follow, I'll show how Firefly was designed to thrive within these constraints.