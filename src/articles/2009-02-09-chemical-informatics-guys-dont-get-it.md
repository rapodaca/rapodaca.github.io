---
title: "Chemical Informatics Guys Don't Get It"
published: "2009-02-09T00:00:00.000Z"
---

During my time as a synthetic organic chemist and later, a medicinal chemist, there were many times when I wondered why certain chemical information tools were built, why they were built the way they were - especially when they hindered my ability to use them, and why others seemed to go unbuilt despite obvious need for them. So when a chemist brings thoughtful criticism to the field of chemical informatics, I pay attention and want to know more.

Recently, [Mitch Garcia](http://www.chemistry-blog.com/) had this to say in the context of post on [creating a new service modeled after Wikipedia, Organic Chemistry Portal, and SciFinder ](http://therealmoforganicsynthesis.blogspot.com/2009/02/throwing-down-gauntlet-for-my-fellow.html)

> Reading through all the comments I can't help but feel the chemical informatics guys don't get it. The critical error seems to derive from making tools that can do cool things but not having a critical mass of users to make it relevant. I've always approached problems from the critical mass side, and let others worry about indexing, tagging, and developing tools in the future.
>
> What J \[the author of the post\] and I are planning is truly awesome, but it is not going to fall within the realm of the type of collaborative work that the chemical informatics people know so well. J will announce the project in the next couple of days. I think you will find it completely awesome, or simply not get it. It could go either way from reading through the comments.

The 'critical mass' problem is very real in a niche market like chemistry. For example, the market for photo-sharing sites is so massive that it easily supports [Flickr](http://flickr.com), [Photobucket](http://photobucket.com), and a host of lesser players. Critical mass may be a problem for a new photo sharing service, but getting to critical mass for the early players was [hardly a problem at all](http://www.netmag.co.uk/zine/discover-interview/caterina-fake) once the idea was properly tweaked.

The market for NMR databases is so small, in contrast, that most chemists have never even heard of services like [NMRShiftDB](http://nmrshiftdb.ice.mpg.de/) and the [Spectral Database of Organic Compounds](http://riodb01.ibase.aist.go.jp/sdbs/cgi-bin/cre_index.cgi?lang=eng) that have been in operation for a few years now. Similarly, although the chemical informatics guys are [all over PubChem](/articles/tag/pubchem), the largest fully-downloadable database of small molecules in the world, the average chemist has either never heard of it or has little use for it.

The vast breadth of chemistry itself doesn't help much either. Way back in 1908, the American Chemical Society recognized the increasing dissatisfaction of chemists with the over-generality of the society [by creating a host of new divisions](/articles/2008/05/07/1908-and-all-that-the-long-tail-and-chemistry) - a practice that continues to this day.

Taking a niche market (chemistry) and subdividing it into yet smaller niches (organic chemistry, medicinal chemistry, chemical physics, materials science, etc.) makes it very difficult to build anything that most chemists will use even on a weekly basis.

There's a case to be made that existing NMR-sharing services suffer from 'inside-the-box' thinking not unlike that prevalent in the early photo sharing sites. All that's needed is to tweak the idea in the right way to create a tool with broad appeal, so the thinking goes.

For example, if I were to take a stab at building an NMR-spectrum sharing site that all synthetic organic chemists at least knew about and some of which used a lot, my mission would be clear: optimize the site for sharing spectra. This would probably leave other potential users, such as spectroscopists, out in the cold. Adding advanced features to please them would likely alienate the site's target users - synthetic organic chemists.

Still, we can try to build a broadly-usable chemical information tool. One approach that met with some success was to take a resource that many chemists use (for example, the Merck Index), and try to re-create it in the image of the Web. The result was [Chempedia](http://chempedia.com), a combination of [PubChem](http://pubchem.ncbi.nlm.nih.gov/) and [Wikipedia](http://wikipedia.org). For what it's worth, the most common use of Chempedia to date appears to be [looking up CAS numbers](/articles/2008/05/26/simple-cas-number-lookup-and-more-with-chempedia), and an article I wrote on the subject is one of Depth-First's most popular items. If I were to try to improve the service (and this is the plan), I'd focus on *stripping* features from Chempedia until only the most popular one is left, and then optimizing that one feature to perfection. More on this later, though.

The point is that CAS number/chemical structure interconversion is something that a large percentage of chemists need to do. It shouldn't be surprising that a new service that, among its other features, has the ability to de-reference CAS numbers would be used that way. Additional features simply obscure the true purpose of the service.

For these reasons, I don't have much faith in chemistry Web services that try to be all things to all chemists. To the extent that public-facing chemistry Web applications have any possibility of attracting significant repeat traffic (and creating a sustainable business model), they will probably try to be all things to a small number of chemists. Or the alternative - one small thing to most chemists.

Fortunately, the availability of agile Web frameworks like [Rails](http://rubyonrails.org) makes it economically viable to custom-build focussed Web applications for a limited number of users. Or to build a suite of single-feature Web applications for a larger audience. Bringing either possibility into being is, in fact, [my company's](http://metamolecular.com) business model in a nutshell.

Given all of this, I'm quite curious about what J and Mitch will be unveiling. What problem will the service/software solve, who will be the audience, and how will the critical mass problem be addressed? Given their proximity to the the problem they'll be solving, whatever it is should be very interesting indeed.