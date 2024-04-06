---
title: "Standardization in Lab Automation: The SiLA Consortium"
published: "2011-02-07T00:00:00.000Z"
---

The growing trend toward chemical and biological laboratory automation has great potential to accelerate scientific discovery. But with this trend comes the need for better coordination among devices built by an increasingly large number of players and based on a bewildering array of specifications. Throw in the explosion of LIMS and ELN software designed to make good use of the resulting increase in data, and the problem becomes crystal clear - the field is ripe for standardization.

Enter the [Standardization in Lab Automation (SiLA)](http://www.sila.coop/) consortium. I recently spoke with some consortium members at the recent [Lab Automation 2011 Converence](http://www.slas.org/la11/index.cfm). From the SiLA website:

>The SiLA consortium for Standardisation in Lab Automation, develops and introduces new device and data interface standards allowing rapid integration of lab automation and data management systems. Leading system manufacturers, software suppliers, system integrators and pharma/biotec corpo ra tions form the SiLA consortium and contribute in different technical work groups with their highly skilled experts.

SiLA's [Device Interface Standard](http://www.sila.coop/661/dcdis/) specifies a communication protocol between SiLA-compliant devices and software. One aspect of this protocol is a uniform command set. Although apparently not available online, my copy of the printed SiLA Command Dictionary Overview v0.9 lists a hundred or so commands including: "Abort"; "Reset"; "GetInventory"; "Seal"; "TransferLiquid"; and "WriteRFID". Clearly some of these commands will be applicable universally, but others will only be used by specific devices. The Dictionary defines a few dozen device classes that implement a common set of commands. These device classes include "Stacker"; "Centrifuge"; "RFID Reader/Writer"; and "Pump".

SiLA compatible devices use an XML-based protocol (specifically, SOAP) to communicate with other SiLA-enabled devices. This design supports network communication by default, a very useful feature in today's increasingly decentralized laboratories.

Standardization efforts can fail due to lack of buy-in from device manufacturers. Fortunately, SiLA seems to have some momentum in this respect. Again, the online documentation is sparse in this regard, but my printed documentation lists these companies among others as members as of October 2009:

-  Agilent Technologies
-  Hamilton Bonaduz
-  Thermo Fisher Scientific
-  Perkin Elmer
-  Mettler-Toledo

Despite its potential, SiLA faces some headwinds. Notably, I was not able to find a single LIMS/ELN or hardware vendor (other than consortium members) at Lab Automation 2011 who had even heard of SiLA. Furthermore, the consortium's website does a poor job of fully explaining SiLA's mission, current scope and limitations, and potential. For example, it does not seem offer any of the draft standards documents for free download and review (a document does appear to be [available for 490 euros](http://www.sila.coop/shop/?page=details&prod=2&cat=5)). And it does not appear to list any of the SiLA consortium's current members. Both are critical to SiLA gaining credibility as a viable alternative to the current system of multiple vendor-specific standards. Fortunately, there is a [SiLA blog](http://www.sila.coop/blog/), which is a useful resource for keeping up-to-date.

Standardization efforts can benefit from the support of small, emerging players with no vested interest in the status quo. The availability of low-cost developer tools reduces barriers to entry and encourages initiation of new projects to test the waters. Although I'm aware of one toolkit ([available from InfoTeam](http://www.infoteam.de/shop-103-infoteam-library-sila.html)) that implements the SiLA standard, the price of 15,000 euros will be out of the question for many, particularly software startups. This situation may not be an issue for established manufacturers and software vendors, but for new entrants the cost will simply be too high to bother.

SiLA may offer a solution to the an unfolding logjam in laboratory automation, but it must counter the strongest of the headwinds it faces first.