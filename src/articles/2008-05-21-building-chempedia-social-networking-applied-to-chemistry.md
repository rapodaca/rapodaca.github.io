---
title: "Building Chempedia: Social Networking Applied to Chemistry"
published: "2008-05-21T00:00:00.000Z"
---

[Chempedia](http://chempedia.com) is a free online chemical encyclopedia; it's also a work in progress, the contents of which are being written by numerous volunteers worldwide. A previous article described initial work toward [connecting the people behind Chempedia's content with the compound monographs they're writing](/articles/2008/05/15/building-chempedia-the-human-element). This article will describe new features that take this idea much further.

# Contributors

Chempedia now uses the concept of a "Contributor" as part of its data model. Each Compound Monograph has one associated Contributor, the Wikipedia user who last edited it. In other words, a one-to-many relationship exists between a Contributor and a Monograph.

Of course, this model is simplistic; Compound Monographs are edited by multiple users over time, and so the relationship should be many-to-many. Nevertheless, for now a one-to-many relationship works well enough.

# Learning About Contributors

You can view a [complete list of contributors to Chempedia](http://chempedia.com/contributors). As you can see, over 1,000 Wikipedia users are currently listed. The number in parentheses appearing after each contributor's username is the number of Monographs for which Wikipedia lists them as the last editor.

Chempedia contains just over 6,400 Compound Monographs; the fact that 1,000 Wikipedia users contributed to making that happen is remarkable. That such a large number of users contribute relative to the number Monographs may be surprising given the rule of thumb that [only 2-10% of users are responsible for the majority of the work on community-driven projects](/articles/2007/10/05/what-makes-wikipedia-tick). While the majority of work may well be done by a relatively small group of Contributors, these numbers demonstrate a [widespread interest in creating and maintaining information about chemical compounds](/articles/2006/08/19/history-of-abstracting-at-chemical-abstracts-service).

Chempedia lets you learn more about what an individual Contributor has done. Clicking on a Contributor name takes us to a Contributor summary page showing all of the Monographs on which they are listed as Contributor, as well as their Wikipedia home and talk pages. The latter can be used to take part in discussions.

A particularly active contributor (one of several) goes by the name of [Edgar181](http://chempedia.com/contributors/1). As of this writing, s/he is listed as the Contributor on 458 Compound monographs, and the last one s/he edited was [Methylparaben](http://chempedia.com/monographs/methylparaben).

And 1,000 Contributors represents only a lower limit due the the large number of [anonymous contributions](http://chempedia.com/contributors/2), which on Chempedia are lumped together. As you can see, over 1,100 Compound Monographs were last edited by a Wikipedia user who didn't log in.

# Thank Goodness for Robots

Quite a few [Contributors](http://chempedia.com/contributors) have the letters 'Bot' in their names. A 'Bot is a script designed to do work on Wikipedia that would be tedious and/or error prone if done by humans.

One of my favorites is [ClueBot](http://chempedia.com/contributors/17). From the [ClueBot Wikipedia user page](http://en.wikipedia.org/wiki/User:ClueBot), this script's purpose in life is to revert Wikipedia vandalism, a job it does with breathtaking efficiency and accuracy.

For example, one of ClueBot's last pieces of work was to [revert an edit](http://en.wikipedia.org/w/index.php?title=Lysergic_acid_diethylamide&diff=213850493&oldid=213850472) made to [Lysergic Acid Diethylamide](http://chempedia.com/monographs/lysergic-acid-diethylamide) in which a user tried to include some enthusiastic, but subjective, comments about [Albert Hofmann's](http://en.wikipedia.org/wiki/Albert_Hofmann) discovery.

In less than one minute, ClueBot had not only identified the comment as vandalism (despite the fact that no 'offensive' language was used), but had removed it as well. Amazing.

# Connecting Contributors to Monographs

Chempedia is quickly forming a densely connected network of people and molecules. What can we do with this?

![Edit Status](/images/posts/20080521/edit_status.png "Edit Status")

A new edit status line has been added to Monographs summaries (above). With it, you can easily see the number of edits that have occurred, when the last one happened, and who did it. Links will take you directly to the Wikipedia edit history page and to the Chempedia Contributor page for the last editor.

For example, the entry for [Modafinil](http://chempedia.com/monographs/modafinil) currently lists [Paul gene](http://chempedia.com/contributors/314) as the last contributor. Bringing up his Chempedia contributor page, we can see that he's listed as the last Contributor on three other Monographs, all of which are organic compounds of pharmacological interest. Curious about whether this might be one of Paul gene's interests, we click on the [User Page](http://en.wikipedia.org/wiki/User:Paul%20gene) link at the top right of the contributor page and find out that this Wikipedia user received a Ph.D., works in academia, and has an interest in pharmacology, immunology, chemistry, kinase inhibitors, and antidepressants.

# Newly-Edited Monographs

It might be of interest to know when Compound Monographs are edited. This can be done from the [Browse](http://chempedia.com/monographs) link at the top-left main menu. On this page Monographs are sorted in descending order according to the last edit timestamp. The most recently-edited monographs appear on the first page, which is currently updated once every 30 minutes or so.

# Hot Monographs

We may also be interested in which Compound Monographs are receiving the most edit activity. We can do that by choosing the [Active](http://chempedia.com/monographs?sortby=activity) link at the top-right submenu. As of this writing, [Heroin](http://chempedia.com/monographs/heroin) is the most actively edited Monograph, with 10 edits since May 19<sup>th</sup>. Clicking on [the link](http://en.wikipedia.org/w/index.php?title=Heroin&action=history) in the edit status line, we can see what all the activity is about.

# Conclusions

None of the technology described here is especially new or innovative; social networking has been part of information systems for several years now and relational databases are designed to make discoveries possible by linking disparate pieces of information. What is new is Chempedia's application of social networking, facilitated by relational databases, to chemistry. I'm unaware of any other chemical information system that takes the possibilities of social networking as far as Chempedia has taken them.

There's quite a bit more that could be done to link people and molecules on Chempedia, but for now, it's time to move onto some related areas. It turns out that the use of CAS numbers, when used outside of the CAS database system itself, raises all kinds of difficult and interesting questions around trust and authority in which social networking ideas can be applied. But that's a story for another time.
