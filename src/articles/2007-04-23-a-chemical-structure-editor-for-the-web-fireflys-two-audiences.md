---
title: A Chemical Structure Editor for the Web - Firefly's Two Audiences
published: "2007-04-23T00:00:00.000Z"
---

*Update: Firefly has since been completed and is now called [ChemWriter&trade;](http://chemwriter.com). ChemWriter can be [downloaded](http://chemwriter.com/evaluate) and [licensed](http://chemwriter.com/buy).*

The [previous article](http://depth-first.com/articles/2007/04/18/a-2d-chemical-structure-editor-for-the-web-embracing-constraints-in-firefly) in this series outlined the main technical constraints in the design of Firefly, a new chemical structure editor for the Web. Knowing the technical barriers you're up against is important in any software project, but understanding what the software needs to do is also important. This article offers a high-level approach to answering this important question.

# Why Use an Editor at All?

The purpose of Firefly will be to conveniently convert the language of chemistry (structure diagrams) into the language of cheminformatics ([line notations](http://depth-first.com/articles/2007/03/14/eleven-qualities-of-the-perfect-line-notation-for-the-web) and file formats). There are certainly alternatives to using a graphical editor. For example, SMILES strings could be directly entered. Molfiles could be pasted into a window. But as a real-world solution, a graphical editor embedded in the host application is the only approach that makes sense.

# Two Audiences

As [discussed previously](http://depth-first.com/articles/2007/04/16/the-structure-editor-forgotten-link-between-chemistry-and-cheminformatics), the structure editor plays the pivotal role of linking consumers of cheminformatics software (i.e., chemists) with producers of cheminformatics software. As a result, the structure editor is one of those few pieces of software that is simultaneously "seen" and "felt" by chemists, and used as a building block by cheminformatics developers. For an editor to be successful, the needs of *both* of these audiences must be satisfied.

# The Chemist Experience

To understand how to build a good structure editor, it's important to understand what's happening in the thirty seconds just before the editor is run. Typically, a chemist is in the middle of doing something important like answering a burning question, preparing a presentation, or setting up an experiment. Firing up a structure editor is actually a major distraction from that work-flow; it interrupts the scientific thought process with a mundane data-entry task far more complex than any text box.

Understandably, using a structure editor is not something that most chemists are enthusiastic about. And using a new structure editor, with its own quirky way of doing things, is potentially even worse. This makes it especially important that any new editor behave intuitively. But what exactly does "intuitive" mean?

ChemDraw and IsisDraw are the 500-pound gorillas of structure editors. They're everywhere - in universities (often bootlegged), at home, and in industry. Important portions of the ChemDraw/IsisDraw user interfaces make appearances in all major structure editors (e.g., ChemSketch). The two things that can be assumed about any prospective user of a new structure editor are that: (1) they have used ChemDraw/IsisDraw; and (2) their current editor is either ChemDraw/IsisDraw or something very similar.

For better or worse, ChemDraw/IsisDraw define the meaning of the word "intuitive" when it comes to 2D structure editors. When faced with any new editor, the first thing Joe the Chemist is likely to try is what works in ChemDraw/IsisDraw. Any attempt to innovate the user interface therefore needs to be very carefully considered. Developers who violate this ["principle of least surprise"](http://en.wikipedia.org/wiki/Principle_of_least_astonishment) are likely to meet with [well-founded resistance](http://www.joelonsoftware.com/uibook/fog0000000249.html).

To summarize: Firefly should minimize the number of "innovations" it introduces into the user interface.

# The Developer Experience

In contrast to chemists, developers are likely to be much more tolerant of innovations in Firefly. The reason is simple: there is no standard structure editor for Web applications. This leaves just a few basic requirements:

-  **Molfile input/output.** Many tools exist, such as [Ruby Open Babel](http://depth-first.com/articles/2007/04/09/painless-installation-of-ruby-open-babel), that can be deployed on a server and which will convert a Molfile into virtually any desired format. To fully satisfy developer expectations, it will be sufficient that Firefly can export and import Molfiles. Additional formats are unnecessary, at least for the 1.0 release.
-  **Designed with JavaScript in mind.** All applet settings will be addressable though get/set methods. Using Java primitives as arguments to these methods will maximize developer productivity in languages such as JavaScript.
-  **Extensibility.** A mechanism to [conveniently extend](http://depth-first.com/articles/2006/12/18/anatomy-of-a-cheminformatics-web-application-structure-cleanup-in-java-molecular-editor) the functionality of Firefly through JavaScript must exist.
-  **Adaptability.** It must be possible to use Firefly as a 2D [molecular rendering framework](http://depth-first.com/articles/2006/12/04/anatomy-of-a-cheminformatics-web-application-ajaxifying-depict), independent of its user interface.
-  **Comprehensible Design.** Firefly's design will be made more understandable through the use and documentation of Design Patterns. Monolithic classes and methods are to be avoided.

# Summary

To be successful, Firefly must satisfy two very different groups of users: chemists who will interact with its graphical interface; and developers who will plug it into other software frameworks. These two groups have very different expectations and needs. Understanding, and embracing, these expectations will go a long way toward making Firefly the best editor it can be.
