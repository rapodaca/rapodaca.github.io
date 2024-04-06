---
title: Running the RDKit Postgres Cartridge with Docker
summary: Build structure-searchable databases on a versatile foundation.
twitter: true
summary-image: images/posts/20210728/summary.png
published: "2021-07-28T14:50:00Z"
---

Chemical structure databases have the odd distinction of being both ubiquitous and often non-trivial to implement. The defining characteristic of these systems is that records can be fetched based on exact- or substructure queries. Structure-searchable databases pops up in all kinds of contexts ranging from individual research projects to on-off data processing tasks to drug discovery efforts to analytical labs to small chemical businesses. The need for a proper chemical database can sneak up on you rather quickly. This article addresses the problem by demonstrating a simple, fast method to get up and running with a structure-searchable database.

# Preview

By the end of this article, you'll be able to quickly query a database of over one million records using SMILES queries like this:

```sql
select id, molecule
  from molecules
 where molecule @> 'c1ccccc1';
```

# Database Cartridges

The single most popular tool for building a chemical structure database at scale is the *database cartridge*. A database cartridge (aka "extension") is a piece of software that operates within a general-purpose database system, orchestrating inputs and outputs relating to chemical information. Examples of general-purpose database systems include: [Postgres](https://www.postgresql.org); [MySQL](https://www.mysql.com); [MariaDB](https://mariadb.com); Oracle; and [MongoDB](https://www.mongodb.com). All except the last of these are considered [relational database management systems](https://en.wikipedia.org/wiki/Relational_database) (RDBMSs).

A cartridge extends a general-purpose database system in two main ways: (1) with new data types; and (2) with new functions operating over the new data types. The most important new datatype supported by a cartridge is likely to be a molecular representation. With it, a variety of new functions can be performed, including exact- and substructure comparisons. Supporting data types such as molecular fingerprints and functions for using them are also likely to be included.

Cartridges aren't the only game in town. For example, databases are rarely used in isolation. Typically they're controlled by other software such as an application layer. So one alternative to a cartridge would be to locate the chemistry-specific code within the application layer. Alternatively a dedicated chemical database system could be used, with the application layer orchestrating the interaction between it and a general-purpose database.

There are, however, a few reasons to favor a database cartridge over the alternatives. The main one is simplicity. With no chemistry-specific data manipulation to perform, the application layer can focus on business logic and user interface. This separation of concerns can lead to cleaner code and separation of concerns. The end result can be better long-term maintainability.

Typically, a cartridge pairs a cheminformatics toolkit with a database implementation. Examples include:

- [Sachem](http://bioinfo.uochb.cas.cz/sachem/). Postgres/CDK.
- [Bingo](https://lifescience.opensource.epam.com/bingo/index.html). Postgres and SQL Server/Indigo.
- [JChem Cartridge](https://docs.chemaxon.com/display/docs/jchem-cartridge.md). Oracle and Postgres/JChem.
- [Mychem](https://mychem.github.io) MariaDB/Open Babel.
- [OrChem](http://orchem.sourceforge.net). Oracle/CDK.
- [RDkit Postgres](https://www.rdkit.org/docs/Cartridge.html). Postgres/RDKit.

The last option, RDKit Postgres, is the topic of today's article. Most of the documentation, including [the homepage](https://www.rdkit.org/docs/Cartridge.html), assumes an installation. But what if you don't have one? Depending on your target operating system, compiling the RDKit Postgres cartridge from source and installing it is likely to pose challenges. This is especially true of your system holds configurations you'd rather not disturb.

Fortunately, there's a solution to this problem.

# Docker

[Docker](https://www.docker.com) is a deployment utility designed for complex, multi-component software projects. In other words, it can solve exactly the problem faced by those who want to install the RDKit Postgres cartridge. With Docker, the entire database system, including Postgres and RDKit, and all required dependencies, can be bundled into a single "container." What's more, that same container will run, unmodified, on any host operating system. You can use exactly the same version and configuration of RDKit/Postgres on a local development machine as you deploy to the cloud.

What's the tradeoff? Docker may be simple to use by following tutorials like this one, but it's not easy to understand. If you plan on using Docker for any production work, I recommend learning the theory behind Docker through a book or online course. Even if you're just experimenting, learning broadly about Docker can ultimately save you time and effort you'd otherwise spend reinventing the wheel. Using Docker effectively means knowing something about how it works, Linux system administration, and the many options that are available for automating deployment workflows. A free excerpt of a paid course I found especially helpful can be found on YouTube.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/pTFZFxd4hOI" allowfullscreen></iframe>
</div>

On the Docker website can be found a page explaining [how to install docker for your platform](https://docs.docker.com/get-docker/).

# The RDKit Postgres Docker Image

A [Docker image](https://hub.docker.com/r/mcs07/postgres-rdkit) including a complete RDKit Postgres installation has been built and distributed by [Matt Swain](https://matt-swain.com). Before using it, however, there's one more thing you'll need.

# Postgres Client

To interact with the RDKit/Postgres container, you'll need a [Postgres client](https://wiki.postgresql.org/wiki/PostgreSQL_Clients). You can check for its presence with the following command:

```bash
psql --help
```

If you receive version information, the client is already installed. Otherwise, you'll need to install one.

# Quickstart

The simplest way to start is to launch the RDKit cartridge container from the command line:

```bash
docker run --name mypostgres -p 5432:5432 -e POSTGRES_PASSWORD=mypassword -d mcs07/postgres-rdkit
```

The following options are used:

- `run`. Tells Docker to run the image.
- `--name`. Sets the name of the container that will be running to `mypostgres`.
- `-p`. Exposes port 5432 of the container as port 5432 on your local machine.
- `-e`. Allows the environment variable `POSTGRES_PASSWORD` to be set. This will become the password you'll need when using the Postgres client to connect to the database.
- `-d`. Return without blocking the terminal, allowing you to continue with the session.

After the container is running, open a new terminal and connect to the database with:

```bash
psql -h localhost -U postgres -p 5432
```

When prompted, use the same password used to run the container, "mypassword". You should see a Postgres prompt.

```
psql -h localhost -U postgres
Password for user postgres: 
psql (13.3, server 12.3 (Debian 12.3-1.pgdg100+1))
Type "help" for help.

postgres=#
```

The Postgres session can be exited by pressing `ctrl-d`.

The RDkit cartridge container can be run even if Postgres is currently installed. However, if a Postgres server is already running, you'll see an error message. There are two ways to proceed: (1) stop the Postgres server on your system; or (2) use a port other than the default Postgres port of 5432.

You can stop the Postgres cartridge Docker container at any time with the following:

```bash
docker container stop <id>
```

where `<id>` is the identifier of the running container. To get it, use `docker ps`. For example, here's the output on my system:

```bash
 docker ps
CONTAINER ID   IMAGE                  COMMAND                  CREATED          STATUS          PORTS                                       NAMES
fe320ea9182f   mcs07/postgres-rdkit   "docker-entrypoint.s…"   10 minutes ago   Up 10 minutes   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   mypostgres
```

To stop the container I started 10 minutes ago, I can use the value under `CONTAINER ID`, or the first few digits:

```bash
docker container stop fe3
```

Everything possible in Docker can be accomplished through the command line. However, things can get complicated very quickly, especially when multiple containers need to be managed and work together. Enter [Docker Compose](https://docs.docker.com/compose/), an orchestration utility that uses simple configuration files to "compose" containers. I point this out only because the RDKit Postgres container documentation mentions it. For now, Docker Compose is overkill so let's continue to use the command line.

# A Simplification

In the following section, we'll be issuing a number of commands to the Postgres server running on the container. The server will require the entry of a password for each one, which can get tiring very fast. Other information will need to be passed on the command line. We can avoid this inconvenience by setting the following environment variables:

```bash
export PGPASSWORD="mypassword"
export PGHOST="localhost"
export PGUSER="postgres"
```

Now we can connect to the server with the much simpler command:

```console
psql
psql (13.3, server 12.3 (Debian 12.3-1.pgdg100+1))
Type "help" for help.

postgres=#
```

In the next section we'll be working outside of Postgres. Exit your `psql` session with `ctrl-d`. 

# Searching a Million Molecules

As a test of Postgres and its cartridge, let's add a million molecules to a database and then perform a substructure search. The [RDKit Cartridge documentation](https://www.rdkit.org/docs/Cartridge.html) shows one way to do this that will be adapted here.

The process starts by creating a database using the `createdb` utility that comes with the Postgres client. Postgres won't install the cartridge on new databases by default, so we'll create one in a bash session.

```bash
createdb emolecules
psql -c 'create extension rdkit' emolecules
psql -c 'create table raw_data (id SERIAL, smiles text, version_id integer, parent_id integer)' emolecules
```

The `-c` option tells Postgres to issue the commands that follow in quotes. Alternatively, the commands could be issued from within a `psql` session. However, it's convenient work this way because of what comes next.

[eMolecules](https://www.emolecules.com) provides [downloads](https://downloads.emolecules.com/free/2021-07-01/) of its public database in several formats. For the purposes of this demonstration, the most convenient format is a SMILES file containing records whose fields include a SMILES structure and two corresponding identifiers ("VERSION\_ID" and "PARENT\_ID"). Download and expand as follows.

```bash
wget https://downloads.emolecules.com/free/2021-07-01/version.smi.gz
gunzip version.smi.gz
```

This generates the file `version.smi`, which contains many millions of records. We want only the first million, which can be done with:

```bash
head -n 1000001 version.smi >> emolecules-1m.smi
```

The resulting file, `emolecules-1m.smi` contains the first million records. We take the first 1,000,001 of them because the first row is a header. The new file can be imported into the `emolecules` Postgres database as follows.

```bash
cat < ./emolecules-1m.smi | sed '1d; s/\\/\\\\/g' | psql -c "copy raw_data (smiles,version_id,parent_id) from stdin with delimiter ' '" emolecules
```

Here we're reading the `emolecules-1m.smi`, replacing input inline, and piping the result into the Postgres `emolecules` database. The `sed` parameter `1d'` strips the first line of input, which is a header. The remaining `sed` input (`s/\\/\\\\/g`) replaces backslash characters in the SMILES strings with escaped backslash characters so that Postgres can process them. The command takes a few seconds to execute on my system.

Confirm that the `raw_data` table has been created with:

```console
psql emolecules
psql (13.3, server 12.3 (Debian 12.3-1.pgdg100+1))
Type "help" for help.

emolecules=# select count(*) from raw_data;
  count  
---------
 1000000
(1 row)
```

To keep things efficient, we're using a two-step strategy. The purpose of the first step is to replicate the data found in the `emolecules-1m.smi` file within the Postgres table `raw_data`. Having moved the data into Postgres, we then process it with the RDKit cartridge. We're going to be moving a lot of data around, so it helps to first move the raw data into Postgres, from where it can be dispatched efficiently. We can always drop the `raw_data` table later. The following query, executed within a Postgres session (`psql emolecules`) will create a new table `molecules` with searchable structures.

```sql
SELECT *
  INTO molecules
  FROM (SELECT id, mol_from_smiles(smiles::cstring) structure FROM raw_data) tmp
 WHERE structure IS NOT NULL;
```

This step, which creates RDKit binary molecular representations, will take several minutes. You should see some output similar to:

```console
WARNING:  could not create molecule from SMILES 'Br[Br]Br.c1ccncc1'
WARNING:  could not create molecule from SMILES 'Br[Br-]Br.C[N+](C)(C)c1ccccc1'
... and so on
```

Here the cartridge is informing us that RDKit was not able to read the indicated SMILES.

After the command returns, a new table, `molecules`, will have been created. It contains two columns (`id`, `structure`), which can be confirmed with:

```console
\d+ molecules;
                                   Table "public.molecules"
  Column   |  Type   | Collation | Nullable | Default | Storage  | Stats target | Description 
-----------+---------+-----------+----------+---------+----------+--------------+-------------
 id        | integer |           |          |         | plain    |              | 
 structure | mol     |           |          |         | extended |              | 
Access method: heap
```

Notice the type of the `structure` field: `mol`. This is a custom data type that the cartridge can read, write, and process.

Searching this table by structure is going to be slow (something that's worth confirming for yourself). To speed things up, we can create an index. This index is created with help from the cartridge, which knows about the `mol` data type and can use it in various ways.

```sql
CREATE INDEX molecules_structure ON molecules USING gist(structure);
```

This step again takes about ten minutes on my system. Finally, we can search by structure:

```sql
SELECT id, structure FROM molecules WHERE structure@>'c1cccnc1' LIMIT 100;
-- returns results like the following
--    id   |                           structure                            
-- --------+----------------------------------------------------------------
-- 312845 | Cc1nc(C)c(C(=O)N/N=C/c2cccnc2)cc1C(=O)N/N=C/c1cccnc1
-- 319086 | CCOC(=O)CCSc1nc(-c2ccc(C)cc2)cc(-c2ccc(OC)cc2)c1C#N
-- 319094 | COc1ccc(-c2cc(-c3ccc(C)cc3)nc(SCC(=O)Nc3ccc(C)cc3C)c2C#N)cc1OC
-- 319095 | COc1ccc(-c2cc(-c3ccc(C)cc3)nc(SCC(=O)Nc3c(C)cccc3C)c2C#N)cc1OC
-- and so on...
```

As you experiment with the `LIMIT` parameter and other SQL features, you may find yourself wanting to know how long various queries take. This can be accomplished by turning timings on:

```console
\timing
```

# Conclusion

Setting up a robust, substructure-searchable database can be a big technical challenge. In many situations, a database cartridge like RDKit Postgres offers an excellent option. This article describes a simple, unobtrusive method using Docker to run the RDKit cartridge on most systems.
