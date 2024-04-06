---
title: Hacking PubChem - Power User Gateway
published: "2007-06-04T00:00:00.000Z"
---

If you've been waiting for a simple way to programatically query PubChem without screen scraping, the wait is over. An (apparently) new service called the Power User Gateway (PUG) now offers a direct, XML-based PubChem data channel.

# See PUG

Previous articles have discussed various methods for hacking PubChem: screen scraping ([link](http://depth-first.com/articles/2006/08/30/hacking-pubchem-with-ruby), [link](http://depth-first.com/articles/2006/08/30/hacking-pubchem-with-ruby)); with the [Entrez Utilities](http://depth-first.com/articles/2006/09/23/hacking-pubchem-entrez-programming-utilities); and by simply [replicating the database](http://depth-first.com/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp). PUG is different in that it is both very simple and apparently quite powerful.

From the [PUG documentation](ftp://ftp.ncbi.nlm.nih.gov/pubchem/specifications/pubchem_pug.txt):

> ... There is a single CGI (pug.cgi, referred to hereafter as simply PUG) that is the central gateway to multiple PubChem functions. PUG takes no URL arguments; all communication with PUG is done by XML. To perform any request, you will formulate your input in XML and then HTTP POST it to PUG. The CGI interprets your incoming request, initiates the appropriate action, then returns results (also) in XML format. ...

# See PUG Run

Let's perform a simple query using PUG. As the documentation states, all communication with PUG is done through HTTP POST. In contrast to other approaches to interfacing with PubChem, parameters and results are encoded in raw XML, the schema for which is available [here](ftp://ftp.ncbi.nlm.nih.gov/pubchem/specifications/pug.xsd). To use PUG your first step is to locate software capable of encoding this form of HTTP request.

[cURL](http://curl.haxx.se/) is such a utility. Among many capabilities, cURL offers a quick and easy way to POST XML to a server and view the response. For example, to POST the file called **foo.xml** to PUG, the command would be: 

```bash
curl -d @foo.xml "http://pubchem.ncbi.nlm.nih.gov/pug/pug.cgi"
```

Our query will request PubChem's first fifty Compounds in [sdf.gz](http://depth-first.com/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp) format.

```xml
<PCT-Data>
  <PCT-Data_input>
    <PCT-InputData>
      <PCT-InputData_download>
        <PCT-Download>
          <PCT-Download_uids>
            <PCT-QueryUids>
              <PCT-QueryUids_ids>
                <PCT-ID-List>
                  <PCT-ID-List_db>pccompound</PCT-ID-List_db>
                  <PCT-ID-List_uids>
                    <PCT-ID-List_uids_E>1</PCT-ID-List_uids_E>
                    <PCT-ID-List_uids_E>50</PCT-ID-List_uids_E>
                  </PCT-ID-List_uids>
                </PCT-ID-List>
              </PCT-QueryUids_ids>
            </PCT-QueryUids>
          </PCT-Download_uids>
          <PCT-Download_format value="sdf"/>
          <PCT-Download_compression value="gzip"/>
        </PCT-Download>
      </PCT-InputData_download>
    </PCT-InputData>
  </PCT-Data_input>
</PCT-Data>
```

After saving this file as `pugtest.xml`, we can POST it to PUG using cURL:

```bash
curl -d @pugtest.xml "http://pubchem.ncbi.nlm.nih.gov/pug/pug.cgi"
```

# Run PUG, Run!

After POSTing our query, PUG gives one of two possible responses: we're informed of the status of our query, or we're given a URL to download our results.

Here's an example of a status result:

```xml
<?xml version="1.0"?>
<!DOCTYPE PCT-Data PUBLIC "-//NCBI//NCBI PCTools/EN" "http://pubchem.ncbi.nlm.nih.gov/pug/pug.dtd">
<PCT-Data>
  <PCT-Data_output>
    <PCT-OutputData>
      <PCT-OutputData_status>
        <PCT-Status-Message>
          <PCT-Status-Message_status>
            <PCT-Status value="success"/>
          </PCT-Status-Message_status>
        </PCT-Status-Message>
      </PCT-OutputData_status>
      <PCT-OutputData_output>
        <PCT-OutputData_output_waiting>
          <PCT-Waiting>
            <PCT-Waiting_reqid>638302818484957496</PCT-Waiting_reqid>
          </PCT-Waiting>
        </PCT-OutputData_output_waiting>
      </PCT-OutputData_output>
    </PCT-OutputData>
  </PCT-Data_output>
</PCT-Data>
```

The <code>PCT-Waiting\_reqid</code> informs us of our query's ID. We could then prepare and POST another query to monitor its status:

```xml
<PCT-Data>
  <PCT-Data_input>
    <PCT-InputData>
      <PCT-InputData_request>
        <PCT-Request>
          <PCT-Request_reqid>638302818484957496</PCT-Request_reqid>
          <PCT-Request_type value="status"/>
        </PCT-Request>
      </PCT-InputData_request>
    </PCT-InputData>
  </PCT-Data_input>
</PCT-Data>
```

Eventually, we'll get a response containing a <code>PCT-Download\_URL\_url</code> element. Inside this element is the URL through which we can download our results:

```xml
<?xml version="1.0"?>
<!DOCTYPE PCT-Data PUBLIC "-//NCBI//NCBI PCTools/EN" "http://pubchem.ncbi.nlm.nih.gov/pug/pug.dtd">
<PCT-Data>
  <PCT-Data_output>
    <PCT-OutputData>
      <PCT-OutputData_status>
        <PCT-Status-Message>
          <PCT-Status-Message_status>
            <PCT-Status value="success"/>
          </PCT-Status-Message_status>
        </PCT-Status-Message>
      </PCT-OutputData_status>
      <PCT-OutputData_output>
        <PCT-OutputData_output_download-url>
          <PCT-Download-URL>
            <PCT-Download-URL_url>ftp://ftp-private.ncbi.nlm.nih.gov/pubchem/.fetch/766964770894289974.sdf.gz</PCT-Download-URL_url>
          </PCT-Download-URL>
        </PCT-OutputData_output_download-url>
      </PCT-OutputData_output>
    </PCT-OutputData>
  </PCT-Data_output>
</PCT-Data>
```

# Conclusions

PUG offers the basic foundation for building a variety of innovative and useful cheminformatics Web services. But before that can happen, high-level APIs will be needed in languages like Ruby, Python, and Java. With these APIs in hand, what kinds of applications will result? Fortunately, imagination is now the only barrier.