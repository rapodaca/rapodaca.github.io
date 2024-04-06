---
title: The RDKit/Postgres Ordered Substructure Search Problem
summary: Diagnosis and partial solution to a thorny performance issue affecting simple queries.
twitter: true
summary-image: images/posts/20210811/summary.png
published: "2021-08-11T15:00:00Z"
---

[The RDKit Postgres extension](/articles/2021/07/28/rdkit-postgres-cartridge/) ("the extension") enables fast chemical substructure queries in plain SQL. Convenience is the main selling point of this utility, which allows low-level data processing to stay within the database layer of an application. While evaluating RDKit for use in a revamped commercial product, I uncovered an easily-detected, show-stopping performance issue that to my knowledge has never been documented before. This article summarizes what I found, and presents a workaround that may or may not be suitable for production environments.

Before we begin, a disclaimer: I don't know what I don't know. It's quite possible that I'm missing something too obvious to document. Or that I'm misunderstanding the issues entirely. Keep these points (and [Cunningham's Law](https://en.wikipedia.org/wiki/Ward_Cunningham#%22Cunningham's_Law%22)) in mind when reading the following account.

# The Goal

The goal of this study was to use the extension to search a collection of 100,000 small molecules by substructure, ordering the results by increasing molecular weight. Such a query could be used with a large database backing an online structure search system in which some scalar, such as molecular weight, is associated with relevance. Sorting allows the most relevant hits to appear first, which can be crucial when techniques such as [keyset pagination](https://use-the-index-luke.com/no-offset) are used.

# The System

A table having 100,000 rows was prepared using a procedure similar to the one [previously reported](/articles/2021/07/28/rdkit-postgres-cartridge/) and described in detail at the end of this article. The specifications for the DBMS itself were:

- Postgres 12.3
- RDKit extension 0.74.0 compiled for Linux
- database run in Docker from [this image](https://hub.docker.com/r/mcs07/postgres-rdkit)
- stock install with no customizations

The table contained the following columns and indexes:

```sql
\d molecules
--                              Table "public.molecules"
--  Column |   Type    | Collation | Nullable |                Default                
-- --------+-----------+-----------+----------+---------------------------------------
--  id     | integer   |           | not null | nextval('molecules_id_seq'::regclass)
--  mol    | mol       |           | not null | 
--  mw     | numeric   |           | not null | 
--  fp     | bit(1024) |           |          | 
-- Indexes:
--     "molecules_pkey" PRIMARY KEY, btree (id)
--     "molecules_mol" gist (mol)
--     "molecules_mw" btree (mw)
```

Query timings were those reported Postgres:

```sql
\timing
-- Timing is on.
```

# Ordered and Unordered Substructure Search

Substructure-only queries were uniformly fast, typically executing within 10 ms regardless of the SMILES used. Benzene was tested as a particularly tough case in that [fingerprint prescreening](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases/) is likely to filter few candidates.

```sql
SELECT mol, mw FROM molecules WHERE mol@>'c1ccccc1' LIMIT 25;
--                            mol                            |   mw    
-- ----------------------------------------------------------+---------
--  CCNC(=O)C1(Cc2cccc(-c3ccccc3)c2)CCN(C(=O)CC)CC1          | 378.516
--  CCNC(=O)C1(Cc2cccc(-c3ccccc3)c2)CCN(C(=O)C(C)C)CC1       | 392.543
-- ...
-- Time: 8.541 ms
```

Surprisingly, the same query with an `ORDER BY` clause increased the time to completion by over 200-fold:

```sql
SELECT mol, mw FROM molecules WHERE mol@>'c1ccccc1' order by mw limit 25;
--            mol           |   mw    
-- -------------------------+---------
--  C=C=Cc1ccccc1           | 116.163
--  C=Cc1cccc(O)c1          | 120.151
-- ...
-- Time: 1975.443 ms (00:01.975)
```

In general, the more feature-rich the query SMILES, the faster the query. This didn't always correlate with molecular weight. For example, a search for acyl chlorides (`C(=O)Cl`) finished with comparable times in unordered and ordered form (5.96 ms and 6.30 ms, respectively).

The slow ordered query response for benzene and other simple substructures appears to scale linearly with the number of records. Given a table of 1M rows (10x larger), the ordered benzene query returned in 25 seconds (10x slower), whereas the unordered benzene query returned in fewer than 10 ms. Response times longer than one second represent the upper bound of acceptable performance for the system I'm looking at. Such poor performance for ordered substructure queries is unexpected in light of the fast responses seen across the board with unordered queries.

Something is causing Postgres to do the wrong thing, but what is it?

# Diagnosis Attempts

Postgres comes with a suite of tools for diagnosing performance issues. In particular, [`EXPLAIN ANALYZE`](https://www.postgresql.org/docs/12/sql-explain.html) can give insights into specific steps used to execute a query, including the indexes and algorithms used.

For example, running `EXPLAIN ANALYZE` on an unordered benzene substructure query revealed that Postgres used the RDKit index as expected:

```sql
EXPLAIN ANALYZE
SELECT mol, mw FROM molecules WHERE mol@>'c1ccccc1' LIMIT 25;
--                                                               QUERY PLAN                                                              
-- --------------------------------------------------------------------------------------------------------------------------------------
--  Limit  (cost=0.28..106.72 rows=25 width=403) (actual time=0.608..1.551 rows=25 loops=1)
--    ->  Index Scan using molecules_mol on molecules  (cost=0.28..426.03 rows=100 width=403) (actual time=0.607..1.544 rows=25 loops=1)
--          Index Cond: (mol @> 'c1ccccc1'::mol)
--  Planning Time: 0.081 ms
--  Execution Time: 1.698 ms
-- (5 rows)
```

The [Index Scan](https://www.postgresql.org/docs/9.3/index-scanning.html) node tells us that that `molecules_mol` index is being used, as expected.

A different kind of report resulted from running `EXPLAIN ANALYZE` on the same substructure query, but ordered by molecular weight:

```sql
EXPLAIN ANALYZE
SELECT mol, mw FROM molecules WHERE mol@>'c1ccccc1' order by mw limit 25;
--                                                                 QUERY PLAN                                                                 
-- -------------------------------------------------------------------------------------------------------------------------------------------
--  Limit  (cost=388.74..388.80 rows=25 width=403) (actual time=1925.578..1925.582 rows=25 loops=1)
--    ->  Sort  (cost=388.74..388.99 rows=100 width=403) (actual time=1925.576..1925.578 rows=25 loops=1)
--          Sort Key: mw
--          Sort Method: top-N heapsort  Memory: 41kB
--          ->  Bitmap Heap Scan on molecules  (cost=25.05..385.92 rows=100 width=403) (actual time=48.888..1879.645 rows=66316 loops=1)
--                Recheck Cond: (mol @> 'c1ccccc1'::mol)
--                Rows Removed by Index Recheck: 3752
--                Heap Blocks: exact=5366
--                ->  Bitmap Index Scan on molecules_mol  (cost=0.00..25.03 rows=100 width=0) (actual time=48.138..48.138 rows=70068 loops=1)
--                      Index Cond: (mol @> 'c1ccccc1'::mol)
--  Planning Time: 0.109 ms
--  Execution Time: 1925.723 ms
-- (12 rows)
```

Although both columns, `mol` and `mw` are indexed, Postgres only uses the one on `mol`. The index on `mw`, which otherwise would be used for sorting efficiently, is ignored. In its place, the query planner opts for a much less efficient "top-N heapsort". The use of heapsort instead of an index scan causes the slowdown, as we'll soon see.

Understanding complex query plans like this can take some practice. Fortunately, there are some good resources. One of them, an online course from the University of Tübingen, deals with understanding a query plan similar to what see above.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/UXKYAZOWDgk" allowfullscreen></iframe>
</div>

Important takeaways from the query plan:

- There are no "lossy" heap blocks, meaning that the bitmap created from the index scan fits entirely into working memory (`work_mem`). Fiddling with this parameter, as is often recommended, will not help.
- The Bitmap Index Scan has to deal with 70,068 rows, which is over half of them.
- The heapsort has to deal with 66,316 rows.

We gain additional insights from the query plan for the substructure search on acyl chlorides (`C(=O)Cl`).

```sql
EXPLAIN ANALYZE
SELECT mol, mw FROM molecules WHERE mol@>'C(=O)Cl' order by mw limit 25;
--                                                               QUERY PLAN                                                              
-- --------------------------------------------------------------------------------------------------------------------------------------
--  Limit  (cost=388.74..388.80 rows=25 width=403) (actual time=0.747..0.750 rows=17 loops=1)
--    ->  Sort  (cost=388.74..388.99 rows=100 width=403) (actual time=0.746..0.747 rows=17 loops=1)
--          Sort Key: mw
--          Sort Method: quicksort  Memory: 30kB
--          ->  Bitmap Heap Scan on molecules  (cost=25.05..385.92 rows=100 width=403) (actual time=0.261..0.722 rows=17 loops=1)
--                Recheck Cond: (mol @> 'O=CCl'::mol)
--                Heap Blocks: exact=14
--                ->  Bitmap Index Scan on molecules_mol  (cost=0.00..25.03 rows=100 width=0) (actual time=0.204..0.204 rows=17 loops=1)
--                      Index Cond: (mol @> 'O=CCl'::mol)
--  Planning Time: 0.096 ms
--  Execution Time: 0.841 ms
-- (11 rows)
```

Regardless of the substructure query, the planner has decided to favor an outer sort over an index scan to deliver the ordering required by substructure queries. Given a sufficiently precise query (and correspondingly dense fingerprint), that works out well. However, in the case of vague queries with sparse fingerprints, it does not.

Before explaining the workaround, a few words on things that didn't work are in order.

# Things that Didn't Work

Advice for optimizing Postgres queries often involves increasing memory. Two setting are usually involved:

- `work_mem`. As noted previously, one thing held in working memory is bitmaps. The query planner has already told us that there is plenty of this kind of memory. Unsurprisingly, adjusting `work_mem` upward had no effect.
- `shared_buffers`. As noted by [the Wiki](https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server), this setting "determines how much memory is dedicated to PostgreSQL to use for caching data."

To explore the possibility that increasing `shared_buffers` might persuade Postgres to start using the `mw` index, `shared_buffers` was adjusted upward from the default of 128 MB to 2048 MB. This had no effect on the query plan or execution time.

```sql
alter system set shared_buffers to '2048MB';
-- exit, then restart
```

Perhaps the query planner needs a two-column index on `mw` and `mol`. Although the documentation makes it clear that this should not be necessary, various sources suggest that it could be. Regardless, setting a two column index did not lead to faster queries. Doing this was a little tricky because `mw` requires a b-tree index whereas `mol` requires a GIST index. The two types can't ordinarily be mixed in a multicolumn index. However, this can be corrected by installing the [btree_gist extension](https://www.postgresql.org/docs/9.1/btree-gist.html).

# A Workaround

If the query planner insists of sorting, is there a way to disable it? It turns out that Postgres supports the boolean parameter `enable_sort`. According to the [documentation](https://www.postgresql.org/docs/9.5/runtime-config-query.html), `enable_sort`:

> Enables or disables the query planner's use of explicit sort steps. It is impossible to suppress explicit sorts entirely, but turning this variable off discourages the planner from using one if there are other methods available. The default is on.

This parameter defaults to "on". It can be turned off as follows:

```sql
-- https://stackoverflow.com/a/63796329/54426
set enable_sort=off;
```

The effect was dramatic, and similar response times were seen with or without the `ORDER BY` clause:

```sql
SELECT mol, mw FROM molecules WHERE mol@>'c1ccccc1' ORDER BY mw limit 25;
--            mol           |   mw    
-- -------------------------+---------
--  C=C=Cc1ccccc1           | 116.163
--  C=Cc1ccccc1O            | 120.151
--  ...
--  Time: 14.705 ms
```

Instead of a sort, the planner now uses both indexes as expected:

```sql
EXPLAIN ANALYZE
SELECT mol, mw FROM molecules WHERE mol@>'c1ccccc1' ORDER BY mw limit 25;
--                                                               QUERY PLAN                                                               
-- ---------------------------------------------------------------------------------------------------------------------------------------
--  Limit  (cost=0.42..6145.87 rows=25 width=403) (actual time=2.043..6.476 rows=25 loops=1)
--    ->  Index Scan using molecules_mw on molecules  (cost=0.42..24582.23 rows=100 width=403) (actual time=2.041..6.466 rows=25 loops=1)
--          Filter: (mol @> 'c1ccccc1'::mol)
--          Rows Removed by Filter: 355
--  Planning Time: 0.092 ms
--  Execution Time: 6.528 ms
-- (6 rows)
```

As an aside, the above query plan was also returned without adjusting `enable_sort` when the number of rows was 10,000 instead of the 100,000 used here. It's possible that adjusting some other, less-invasive Postgres operational parameter would address the ordered substructure query problem in a better way.

Globally setting `enable_sort` is probably not a good idea, but fortunately, it can be set on a per-transaction basis. After completion of the transaction, `enable_sort` is restored to its default setting of "off".

```sql
BEGIN;
SET LOCAL enable_sort = off;
SELECT mol, mw FROM molecules WHERE mol@>'c1ccccc1' ORDER BY mw limit 25;
COMMIT;
-- BEGIN
-- Time: 2.565 ms
-- SET
-- Time: 4.357 ms
--            mol           |   mw    
-- -------------------------+---------
--  C=C=Cc1ccccc1           | 116.163
--  C=Cc1ccccc1O            | 120.151
-- ...
-- Time: 11.117 ms
-- COMMIT
-- Time: 3.667 ms

show enable_sort;
--  enable_sort 
-- -------------
--  on
-- (1 row)
```

What about larger databases? The workaround does the trick there as well. In a similarly-constructed database of 1M eMolecules records, unsetting `enable_sort` results in queries on the order of 10-20 ms compared to queries in the 20-30 second range without the workaround.

It's possible that the problem lies with the RDKit extension itself. My reading of the documentation suggests that it is the duty of extensions to provide the planner with the information needed to estimate costs. This takes the form of a "Scan Provider." Perhaps the extension's Scan Provider is faulty, or not implemented. [The Wiki](https://wiki.postgresql.org/wiki/CustomScanInterface) has this to say on the topic:

> Prior to query execution, the PostgreSQL planner constructs a plan tree that usually consists of built-in plan nodes (IE: SeqScan, HashJoin, etc). The custom-scan interface allows extensions to create a custom-scan provider that implements its own logic, in addition to the built-in nodes, for scanning relations. If a custom-scan node is chosen by the planner, callback functions associated with this custom-scan node shall be invoked during query execution. The custom-scan provider is responsible for returning equivalent result set as built-in logic would, but it is free to scan the relation according to its own logic.
> 
> This chapter explains how to write a custom-scan provider.

# Other Work

Perhaps the most surprising thing about the ordered substructure query problem is that it has never been documented before, at least to my knowledge. I did find hints, but nothing like what's outlined here &mdash; not even a recognition of the problem.

- [Substructure fingerprints and the PostgreSQL cartridge](http://rdkit.blogspot.com/2013/11/substructure-fingerprints-and-cartridge.html). A blog post from 2013 discussing the performance gains from using fingerprint indexes. However, no discussion of sorting appears.
- [Substructure fingerprints and the PostgreSQL cartridge 2: Application to ChEMBL](http://rdkit.blogspot.com/2013/11/substructure-fingerprints-and-chembl.html). Follow up post that also never mentions sorting substructure queries.
- [[Rdkit-discuss] Need for speed -- postgresql / rdkit use of indices(/indexes)](https://sourceforge.net/p/rdkit/mailman/rdkit-discuss/thread/CAKwxoo6m9y2cb65qiotPFwMxCBTP5S%3D2BLQ08XPe-wAUbYNgyw%40mail.gmail.com/#msg32604355). An email thread from 2014 discussing slow queries with structures like benzene on unlimited, unordered, large databases. Discusses query plan, the abandonment of indexes, and moderately successful interventions.

# Resources

For understanding Postgres indexes, query plans, and performance, I can recommend these resources:

- [PostgreSQL Performance Essentials in 1 Hour](https://github.com/evgeniy-khist/postgresql-performance-essentials)
- [University of Tübingen DB 2 Course (Internals of Relational Database Systems)](https://www.youtube.com/watch?v=pq8KHeqS2NU)

# Building the Database

The database was built from a subset of the [eMolecules public download files](https://downloads.emolecules.com/free/). First, obtain the raw data:

```bash
wget https://downloads.emolecules.com/free/2021-07-01/version.smi.gz
```

With an unmodified instance of the extension running on Postgres in a Docker container, create the database, extension, and raw data table. Then populate this table with the first 100,000 entries from the eMolecules set.

```bash
createdb emolecules
psql -c 'create extension rdkit' emolecules
psql -c 'create table raw_data(id SERIAL, smiles text, version_id integer, parent_id integer);' emolecules
zcat < ./version.smi.gz | sed '1d; s/\\/\\\\/g' | head -n 1000000 | psql -c "copy raw_data (smiles,version_id,parent_id) from stdin with delimiter ' '" emolecules
```

Log into Postgres, then place the processed raw data into a new table, `molecules`.

```
psql emolecules
psql (13.3, server 12.3 (Debian 12.3-1.pgdg100+1))
Type "help" for help.

emolecules=# select count(*) from raw_data;
  count  
---------
 1000000
(1 row)
```

Now create the `molecules` table.

```sql
CREATE TABLE molecules (id SERIAL PRIMARY KEY,
                        mol mol NOT NULL,
                        mw NUMERIC NOT NULL,
                        fp bit(1024)
                       );
```

Populate the `molecules` table with source data from the `raw_data` table.

```sql
INSERT INTO molecules
SELECT nextval('molecules_id_seq'),
       mols.mol as mol,
       mol_amw(mols.mol) as mw,
       right(bfp_to_binary_text(rdkit_fp(mols.mol))::text, -1)::bit(1024) as fp
  FROM (SELECT mol_from_smiles(smiles::cstring) as mol
          FROM raw_data
         LIMIT 100000
       ) as mols
 WHERE mol IS NOT NULL;
```

This takes a few minutes. On completion, 100,000 records will be present in the `molecules` table.

```sql
select count(*) from molecules;
--  count  
-- --------
--  100000
-- (1 row)
```

Finally, create indexes on the `mol` (molecule) and `mw` (molecular weight) columns.

```sql
CREATE INDEX molecules_mol ON molecules USING gist(mol);
CREATE INDEX molecules_mw on molecules USING btree(mw);
```

The procedure can be repeated with a higher `LIMIT` to insert more rows into the `molecules` table.

# Conclusion

The RDKit Postgres extension can be an extremely useful tool for building data-centric applications. For simple unordered structure queries of the kind presented in tutorials, it performs uniformly well. However, in some situations, the interaction between the extension and the query planner can lead to surprisingly bad performance. This article highlighted one such case. The problem was diagnosed and resolved through a workaround. However, the generality of this solution remains to be seen. It's possible that a more robust solution will require changes to the extension itself, or a different approach altogether.