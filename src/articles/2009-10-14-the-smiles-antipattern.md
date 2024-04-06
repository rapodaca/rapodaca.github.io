---
title: "The SMILES Antipattern"
disqus: true
published: "2009-10-14T00:00:00.000Z"
---

In the last few days I've been part of some interesting discussions around the question of whether pasting SMILES (or InChI) strings into text fields the sign of bad interface design. Could it be that this practice actually rises to the level of an antipattern?

According to [Wikipedia](http://en.wikipedia.org/wiki/Anti-pattern):

>... there must be at least two key elements present to formally distinguish an actual anti-pattern from a simple bad habit, bad practice, or bad idea:
>- Some repeated pattern of action, process or structure that initially appears to be beneficial, but ultimately produces more bad consequences than beneficial results, and
>- A refactored solution exists that is clearly documented, proven in actual practice and repeatable.

In many situations, the pasting of SMILES strings into text fields does indeed fit with this definition in that the practice is: (a) integral to many chemistry user interfaces; and (b) easily avoidable.

Pasting SMILES strings wouldn't be a problem if chemists actually understood how to generate them and could do so with the same ease and accuracy as typing text into a Google search box, or if the extra work added tangible value. But this is not the case in the majority of situations. Few chemists really understand the SMILES syntax and fewer still can create SMILES de novo. Nor do they want to - and with good reason.

The preferred mode of entering chemical structure information into user interfaces is through a well-crafted and ergonmonic chemical structure editor.

The worst offenders are those applications that force a user to first draw a structure using an editor, then copy the corresponding SMILES string, then paste the result into a text box. Hard as it might be to believe, these interfaces do exists and are still being developed and sold.

Most instances of the SMILES antipatten involve applications that simply have no structure drawing tool and can only accept text input. Unfortunately, the end result is just as aggravating to the average chemist.

The main "bad consequence" of this approach to UI design is that a chemist's mental model of their query looks like a structure diagram - not a string of text. A close second is the time required to (a) learn how to complete the operation; and (b) to actually perform all the extra keystrokes, context changes, and windows management.

Don't get me wrong - there are situations in which a text box accepting SMILES strings is a valid approach to UI design. These are situations when the user base and the task at hand absolutely demand it. One example: an application aimed at power users who want to transfer large collections of structures by pasting a list of SMILES strings they copy as output from a developer tool. But these cases are the exception, not the rule.

Here's a simple guideline: if your users can construct valid SMILES strings for arbitrary structures by themselves, then pasting SMILES and InChI strings into UI elements is probably OK.

Everyone else expects a structure editor.