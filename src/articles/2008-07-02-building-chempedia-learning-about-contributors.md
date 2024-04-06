---
title: "Building Chempedia: Learning About Contributors"
published: "2008-07-02T00:00:00.000Z"
---

[Chempedia](http://chempedia.com/) is a free online chemical encyclopedia similar in concept to the Merck Index, but [radically different](/articles/2008/04/28/building-chempedia-indexing-wikipedias-6-411-compound-monographs) in implementation. One key difference: the Merck Index is compiled by a small number of paid professionals while Chempedia is compiled by thousands of unpaid volunteers. Although this distinction raises a host of intriguing questions, one of the most basic revolves around what can be said about these volunteers in the aggregate. This article, the first in a series, explores this issue with some statistics compiled from Chempedia.

# Learning About Contributors

Chempedia works in part by aggregating content from Wikipedia dealing with single molecular entities, or "Compound Monographs." This content is created by the now [famous process](http://en.wikipedia.org/wiki/Wikipedia:Introduction) of individuals taking upon themselves the responsibility of fixing what's broken in Wikipedia. (Some take it upon themselves to [break what's working](http://en.wikipedia.org/wiki/Wikipedia:Vandalism), but that's another topic.)

Chempedia associates each of its Compound Monographs with the last Wikipedia user to edit it. The current interface to these relationships is available on the [Chempedia contributors page](http://chempedia.com/contributors).

The interface to this page is currently limited. The analyses reported here were made for the most part by querying the Chempedia database directly.

Each contributor is linked to a contributor summary page containing links to that user's Wikipedia homepage and talk page, as well as a complete listing of all active contributions. For example, you can view the contributor page for one of Chempedia's most active contributors, [Arcadian](http://chempedia.com/contributors/40).

The data model is also limited. Because Chempedia only records the last Contributor to edit a Monograph, when another Contributor edits a Monograph, the link between the previous Contributor is lost. As a result, many Contributors have no associated Monographs.

# How Many Monographs?

Chempedia currently hosts 6,308 Compound Monographs.

# How Many Contributors?

Chempedia currently lists [2,516 Contributors](http://chempedia.com/contributors). Of these, 1,046, or 42% are associated with one or more Monographs, meaning that they were the last to edit. The remainder are associated with no Monographs for which they were the last to edit.

Here is a list of the top 20 Contributors and the number of Monographs they were the last to edit:

<table>
<tr><td><a href="http://chempedia.com/contributors/2">anonymous</a></td><td>1022</td></tr>
<tr><td><a href="http://chempedia.com/contributors/2">DOI bot</a></td><td>904</td></tr>
<tr><td><a href="http://chempedia.com/contributors/1">Edgar181</a></td><td>378</td></tr>
<tr><td><a href="http://chempedia.com/contributors/66">Fvasconcellos</a></td><td>170</td></tr>
<tr><td><a href="http://chempedia.com/contributors/31">Meodipt</a></td><td>151</td></tr>
<tr><td><a href="http://chempedia.com/contributors/40">Arcadian</a></td><td>144</td></tr>
<tr><td><a href="http://chempedia.com/contributors/59">Chem-awb</a></td><td>133</td></tr>
<tr><td><a href="http://chempedia.com/contributors/22">Chowbok</a></td><td>122</td></tr>
<tr><td><a href="http://chempedia.com/contributors/2">Rifleman 82</a></td><td>114</td></tr>
<tr><td><a href="http://chempedia.com/contributors/10">SmackBot</a></td><td>105</td></tr>
<tr><td><a href="http://chempedia.com/contributors/19">Thijs!bot</a></td><td>99</td></tr>
<tr><td><a href="http://chempedia.com/contributors/1236">ChemNerd</a></td><td>85</td></tr>
<tr><td><a href="http://chempedia.com/contributors/127">Puppy8800</a></td><td>80</td></tr>
<tr><td><a href="http://chempedia.com/contributors/48">DumZiBoT</a></td><td>78</td></tr>
<tr><td><a href="http://chempedia.com/contributors/182">Axiosaurus</a></td><td>63</td></tr>
<tr><td><a href="http://chempedia.com/contributors/6">Chempedia</a></td><td>63</td></tr>
<tr><td><a href="http://chempedia.com/contributors/174">Carlo Banez</a></td><td>55</td></tr>
<tr><td><a href="http://chempedia.com/contributors/13">Benjah-bmm27</a></td><td>52</td></tr>
<tr><td><a href="http://chempedia.com/contributors/93">OKBot</a></td><td>51</td></tr>
<tr><td><a href="http://chempedia.com/contributors/45">Cacycle</a></td><td>50</td></tr>
</table>

These Contributors represent 1.9% of all active Contributors and collectively are responsible for being the last to edit 62% of all Monographs. Although not performed here, a histogram plotting number of contributions would be expected to follow a [power law](http://en.wikipedia.org/wiki/Power_law).

'Anonymous' is an aggregation of all users who edited a Monograph without a Wikipedia account. 16% of all Monographs were last edited by an anonymous user. Leaving out the aggregated 'anonymous' users indicates that roughly half of all Monographs were last edited by the top 19 Contributors.

# What is a Contributor?

Although it's difficult to say a lot about individual Contributors, most appear to have some training in science, although that training may not have involved chemistry or biology. Still others (for example, [SJP](http://chempedia.com/contributors/2404)) appear to have been drawn to contribute to a Monograph based on their nonscientific experience with the title compound or in an effort to fight vandalism or otherwise improve the nonscientific content of the Monograph. The ability of services like Wikipedia (and by extension Chempedia) to provide a platform for those without formal training in a particular area to make useful contributions is without question one of its most useful (and controversial) features.

Some Contributors are not even human, but rather robots designed to improve the quality of Wikipedia articles in general. For example, [SmackBot](http://chempedia.com/contributors/10) performs an array of tedious quality control jobs such as fixing bad checksum ISBNs ([CAS Numbers, anyone?](http://www.cas.org/expertise/cascontent/registry/checkdig.html)) and capitalization errors.

# Conclusions

Wikipedia's collaboration model has made the creation of a free and continuously-updated chemical encyclopedia feasible. Applying chemistry-specific user interfaces and data models exposes this hidden treasure. Although it's tempting to think of this process as mainly being the work of a handful of trained scientists, the numbers suggest a much broader base of contributors. Future articles will explore this idea.

Related Article: [*Building Chempedia: Social Networking Applied to Chemistry*](/articles/2008/05/21/building-chempedia-social-networking-applied-to-chemistry).