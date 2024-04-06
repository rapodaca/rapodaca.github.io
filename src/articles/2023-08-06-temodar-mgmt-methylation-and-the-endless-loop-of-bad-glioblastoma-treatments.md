---
id: df-0060
title: Temodar, MGMT Methylation, and the Endless Loop of Bad Glioblastoma Treatments
summary: "Understanding why half of patients will take a drug offering little to no benefit."
twitter: true
summary-image: images/posts/20230806/summary.png
published: "2023-08-06T20:20:00Z"
revised: "2023-08-16T20:20:00Z"
---

In the days following [brain surgery](/articles/2023/06/02/reflections-on-my-brain-surgery/) to remove a tennis ball-sized [glioblastoma](/articles/2023/05/27/the-scary-stuff/), one term I heard a lot was "next-generation sequencing" (NGS). The idea seemed straightforward enough. Drugs and radiation are blunt instruments, but each tumor is genetically unique. NGS would reveal my tumor's specific vulnerabilities, which would translate into more effective, targeted treatment. My medical team could kill more cancer with less collateral damage to healthy tissue &mdash; at least in principle.

But what happens when high-tech tests like NGS leave patients without good treatment options? I would soon find out.

# MGMT Methylation

I didn't know it at the time, but only one finding from NGS would have any bearing on my treatment post-diagnosis: MGMT methylation status. In a nutshell, glioblastoma cases can be divided into two groups: "methylated" and "unmethylated." The importance of this split comes into play during chemoradiation part of the [standard of care](/articles/2023/07/10/glioblastomas-dismal-standard-of-care-the-stupp-protocol/).

[O-6-methylguanine-DNA methyltransferase](https://en.wikipedia.org/wiki/O-6-methylguanine-DNA_methyltransferase) (MGMT) is a DNA repair enzyme. Its purpose is to undo chemical DNA damage caused by environmental agents. Maintaining undamaged DNA is crucial to cell survival, so MGMT is pretty important, cancer aside.

Like all enzymes, the amount of MGMT within a cell is regulated. One way cells do this involves the "promoter region," a stretch of DNA reserved for regulating transcription into protein. Increased "methylation" in the promoter region decreases MGMT production, leading to less cellular DNA repair. Decreased "methylation" in the promoter region increases MGMT production, leading to more cellular DNA repair. One result available from NGS, and indeed perhaps the most important result, is an estimate of the degree of MGMT promoter methylation.

NGS and treatment intersect in the following way. The front-line chemotherapeutic for glioblastoma, [temozolomide](https://en.wikipedia.org/wiki/Temozolomide) (aka "Temodar", "TMZ") slows cancer cell growth through chemical modification of DNA. Cancer cells replicate much faster than healthy cells, so TMZ disproportionally affects cancer cells. At least this is how it works in principle. In practice, TMZ inhibits the replication of many kinds of cells, including the intended target. This lack of selectivity accounts for at least some of the side-effects of TMZ, which will be briefly addressed below.

Patients with methylated MGMT promoters produce less MGMT and should therefore respond better to treatment. The idea was borne out clinically. According to [this study](https://doi.org/10.1056/nejmoa043331), patients with methylated tumors lived longer and enjoyed a longer interval between surgery and tumor progressions. Unfortunately, MGMT methylation is the exception rather than the rule. The same study found just 45% of patients to have the genetic marker in their tumors.

# Unmethylated

My highly-anticipated NGS sequencing results came back, and the pathology report minced no words:

> Low-level MGMT promoter methylation was detected.

The report went on to explain the meaning of "low-level":

> ... average percent methylation of 0 to less than 5 percent is reported as "Not detected," 5 to less than 25 percent as "Low level," and equal or more than 25 percent as "Detected."

I had an "unmethylated" tumor. This was clearly bad news, but how bad?

# Clinical Data

It was surprisingly difficult to track down clinical data on the survival benefit of TMZ in the standard of care for patients with MGMT unmethylated tumors. The best I could find was data contained in the paper [*Effects of radiotherapy with concomitant and adjuvant temozolomide versus radiotherapy alone on survival in glioblastoma in a randomised phase III study: 5-year analysis of the EORTC-NCIC trial*](https://doi.org/10.1016/S1470-2045(09)70025-7). Table 2 breaks out median survival along several axes. The second to the last comparison bears the heading "MGMT unmethylated." There I found the answer. The median survival times for the "Radiotherapy" group, which did not receive TMZ, compared to the median survival rate for "Combined" therapy group, which did receive TMZ, were 11.8 months vs. 12.6 months. In other words, patients whose tumors lacked MGMT methylation saw about two extra weeks of survival from the use of TMZ in the standard of care.

This study was conducted under the direction of [Roger Stupp](https://www.feinberg.northwestern.edu/faculty-profiles/az/profile.html?xid=37377), whose name is associated with the [current standard of care](/articles/2023/07/10/glioblastomas-dismal-standard-of-care-the-stupp-protocol/) (the "Stupp Protocol" or "Stupp Regimen").

Some might look at two weeks of survival as a cause for celebration. Not me. Two weeks, especially given that no error ranges are reported on these median survival times, is barely worth considering. It's a drop in the bucket compared to the risks.

Stupp would later go on to question the value of administering TMZ to MGMT unmethylated patients, at least in a clinical context, in the paper [*Withholding temozolomide in glioblastoma patients with unmethylated MGMT promoter—still a dilemma?*](https://doi.org/10.1093/neuonc/nov198):

> These 2 trials confirm the predictive value of the MGMT status. Together, the data allow the conclusion that alkylating agent chemotherapy [such as TMZ] is of marginal benefit, if any, for patients with MGMT unmethylated GBM.

In the next sentence, Stupp noted:

> By continuing to treat the majority of MGMT unmethylated patients with TMZ, we are missing an opportunity to do better. …

# What about the Standard of Care?

"Marginal benefit" is all that patients with MGMT unmethylated tumors should expect from TMZ, yet TMZ remains the standard of care for unmethylated and methylated patients across most of the US and the rest of the world. What happened to NGS as a driver of therapy?

I suspect several factors may be at work:

1. TMZ is "well-tolerated," at least as far as chemotherapeutics go. See below for more on this, though.
2. TMZ is inexpensive, given insurance coverage.
3. TMZ is convenient. It's taken orally at home, not intraveneously at an infusion center.
4. There isn't much else to choose from. Despite decades of research, more effective chemotherapeutics for glioblastoma have not been found.

In other words, TMZ may not do much for the majority of patients, but the drug is cheap and easy to administer. Call me a skeptic of this school of thought. If the data show a treatment barely works, you don't administer the treatment. Period. About the "well-tolerated" reputation that TMZ has, consider the side-effects. According to the [National Cancer Institute](https://ctep.cancer.gov/protocolDevelopment/docs/sideeffects/SideEffects-Temozolomide.docx) they include:

- headache, seizure
- memory loss
- insomnia
- muscle weakness
- dizziness
- fatigue
- hair loss

To deal with its problematic side effect profile, TMZ is often prescribed with other drugs. An anti-emetic to control nausea is pretty standard. And a prophylactic antibiotic is also common to prevent the less-common but dangerous side effect of infection caused by immune system compromise and damage to bone marrow. One does not simply take temozolomide. At least two, and possibly more drugs may be required to deal with the side effects of this systemic [alkylating agent](https://www.ncbi.nlm.nih.gov/books/NBK547849/#:~:text=Alkylating%20agents%20are%20a%20class,thereby%20stopping%20the%20protein%20synthesis.).

# Conclusion

Over half of glioblastoma patients will be prescribed a drug, TMZ, to treat their condition that will be "marginally" beneficial at best. They will take this drug despite significant health risks and the possibility for complication. Additional drugs may be be prescribed to control the side effects caused by TMZ, and each will carry its own risks as well.

Chasing marginal therapeutic benefit with drugs that have the kind of side effect profile of TMZ makes no scientific sense. The whole notion borders on faith-healing in my view. Glioblastoma patients deserve better. And if nothing better is available, patients deserve the respect of being told that what they're being given will more likely than not just just produce side effects with little treatment benefit.

Despite decades of research and a multitude of high-tech techniques like NGS, little has changed for glioblastoma patients. I can't help but think that doctors and healthcare systems trapped in an endless chorus of *But this is how we've always done it* could offer one explanation.

If NGS says a patient will respond poorly to TMZ, maybe it's a good idea to listen. And if medical professionals don't want to hear what NGS is saying, why bother asking in the first place?
