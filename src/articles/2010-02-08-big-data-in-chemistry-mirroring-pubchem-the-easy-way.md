---
title: "Big Data in Chemistry: Mirroring PubChem the Easy Way"
disqus: true
published: "2010-02-08T00:00:00.000Z"
---

PubChem's massive size presents special challenges when working with this chemical dataset. Synchronization in particular requires special care. Although it's very easy to use a tool such as [wget](http://www.gnu.org/software/wget/) to perform a complete, one-time download PubChem's archive files, this approach scales poorly if our goal is to maintain a copy that's always up-to-date. The PubChem dataset's substantial size makes it impractical to download frequently, and especially problematic when an up-to-date local copy is needed quickly.

This article describes a simple way to create a low-maintenance, low-bandwidth, up-to-date local mirror of PubChem using two Unix tools.

# What It Does

The method described here will create two directories on your filesystem that will exactly mirror the contents of the PubChem Compound and Substance archives, respectively. A simple command, which can either be run as a nightly cron job or on demand, will efficiently bring these local files up-to-date with PubChem whenever it's run.

#Step 1. Create A Workspace and Mount PubChem FTP Site

We're going to need a workspace. In this workspace, we'll first create a mountpoint for the PubChem FTP site archives, then we'll mount the archives:

```bash
mkdir workspace
cd workspace
mkdir -p ftp.ncbi.nlm.nih.gov/pubchem
curlftpfs ftp.ncbi.nlm.nih.gov/pubchem/ ftp.ncbi.nlm.nih.gov/pubchem/
```

My Linux distribution (Ubuntu Karmic) gives me the error message:

```bash
fusermount: failed to open /etc/fuse.conf: Permission denied
```

which doesn't seem to matter. The FTP site is mounted, as I can see by listing the top-level entries:

```bash
ls ftp.ncbi.nlm.nih.gov/pubchem
Bioassay  Compound     data_spec     README	     Substance
CACTVS	  Compound_3D  publications  specifications
```

We can unmount the PubChemFTP site with fusermount:

```bash
fusermount -u ftp.ncbi.nlm.nih.gov/pubchem/
```

# Step 2. Create Synchronization Directories and Transfer Files

Next, let's create two directories to hold the PubChem files - one for Compounds and one for Substances:

```bash
mkdir substances
mkdir compounds
```

Now comes the magic. We'll use [rsync](http://samba.anu.edu.au/rsync/) to copy the contents of the mounted FTP archive into each of our local directories. First, we synchronize the Compounds:

```bash
rsync -r -t -v --progress --bwlimit=500  --include='*/' --include='*.sdf.gz' --exclude='*' ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/ compounds
```

This is going to take nearly 24 hours.

The option *--bwlimit* sets the maximum bandwidth (in Mb/S). The *--include* and *--exclude* options say that we're only interested in gzipped sd files.

We synchronize Substance records analogously:

```bash
rsync -r -t -v --progress --bwlimit=500  --include='*/' --include='*.sdf.gz' --exclude='*' ftp.ncbi.nlm.nih.gov/pubchem/Substance/CURRENT-Full/SDF/ substances
```

This command will take even longer to run.

# Step 3. There Is No Step 3

That's really all there is to it. Every time we run the rsync command, we'll synchronize our local copy of the PubChem archive with the one on the PubChem FTP server. PubChem ensures that these archives are always current, so every time we synchronize, we'll have up-to-date files.

# Why RSync?

RSync ensures that our synchronizations will be as efficient as possible by only downloading the archive files that change. From time to time, old records are updated in PubChem, and these changes appear as a new archive file that replaces an old archive file. The new file gets an updated timestamp. If you check out the [Compounds FTP directory](ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/) you'll notice several different timestamps reflecting the various updates of existing records. New records appear as new archive files.

The genius of RSync is that it performs an incremental backup; files that haven't changed since our last update are never downloaded.

We can even take this incremental backup idea one step further. Although I don't yet know if PubChem supports it, it's possible to [create GZip archives optimized for rsync](http://beeznest.wordpress.com/2005/02/03/rsyncable-gzip/). This uses a variant of the GZip compression algorithm that makes it possible to transmit only the section of a gzip file that's actually changed, keeping network traffic to an absolute minimum.

This rsyncable archive capability is built into most gzip binary distributions.

# Conclusions

Creating and maintaining your own up-to-date, verbatim copy of PubChem is both simple and inexpensive. The trick is to first mount the FTP archive using curlftpfs and then use rsync to perform an incremental backup of the mounted archive. The method described here works equally well as a cron job or an ad hoc command.

*Credits: [Mirror an FTP Directory with RSync and Curlftps](http://www.wikihow.com/Mirror-an-FTP-Directory-With-Rsync-and-Curlftpfs); [Rsyncable gzip](http://beeznest.wordpress.com/2005/02/03/rsyncable-gzip/)*