---
title: Fingerprints and Atom-By-Atom Searches in Highly-Represented Substructure Queries
disqus: true
published: "2008-10-17T00:00:00.000Z"
---

Wiraj Bibile recently [posed](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql#comment-832) a question on the use of [fingerprints to pre-screen candidate structures](/articles/2008/10/03/fast-substructure-search-using-open-source-tools-part-2-fingerprint-screen-with-sql) in database substructure searches:

>Hi I am currently working \[on\] a substructure search algorithm using finger prints (I am using the CDK package). My algorithm uses precomputed finger prints placed in a database, which is matched against a query finger print. If the fingerprint query succeeds then a more complete test is done to make sure that the query chemical is a substructure of the matched chemical (from the database). this second test is low in performance \[and the\] reason why a finger print test is done initially.
>
>However when using common chemicals in my query the finger print match succeeds more often and fails at the second stage. Therefore taking longer time to run the query, do you know of any way I can improve fingerprint matching for common structures?

Let's say our database consists of 50,000 compounds screened in a central nervous system (CNS) program. One of the most common substructure features in CNS medicinal chemistry is the benzene ring. Not surprisingly, about 75% of the structures in our database contain a benzene ring.

Our search strategy is simple. We've fingerprinted each compound in the database. When a user submits a substructure query, we compute a fingerprint from the query and create a list of all stored fingerprints that match. Based on this list, we create another list of all compounds that could be matches. For each compound in this list, we perform an atom-by-atom search (ABAS) to determine if the query is indeed a substructure of the compound.

Let's now say a user performs a substructure search for benzene. Even if our fingerprints screen out all non-benzene-containing structures, we're still faced with performing an ABAS on 37,500 structures. The substructure search will take a *very* long time.

If I understand Wiraj correctly, the scenario posed here is the crux of his question.

Rather than trying to provide my own answers to this question (which I will try do in a later installment of the [Fast Substructure Search series](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases)), I thought I'd open the floor to anyone with experience in this area. If you've got a clever trick or even a completely different way of setting up your database to avoid this problem, feel free to leave a comment.

Given a substructure search system based on fingerprint pre-screening, how can you avoid the need to do ABAS on highly-represented substructure queries?
