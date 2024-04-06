---
title: Hacking PubChem - Learning to Speak PUG
published: "2007-06-11T00:00:00.000Z"
---

A previous article introduced PubChem's [Power User Gateway](/articles/2007/06/04/hacking-pubchem-power-user-gateway) (PUG), an XML-based communication channel. Although NIH kindly supplies a [commented schema](ftp://ftp.ncbi.nlm.nih.gov/pubchem/specifications/pug.xsd) for PUG queries and responses, there's nothing like seeing real examples when learning a new language. This article will describe one method for conveniently generating PUG XML queries.

# Let PubChem Build Your Query

One of the options on the [PubChem search page](http://pubchem.ncbi.nlm.nih.gov/search/search.cgi) is "Save Query." As it turns out, PubChem saves queries in PUG XML (I'll just call it PUGML). In other words, preparing a query using the PubChem search page and saving it gives a simple method for creating PUGML queries. Let's try it.

![Screenshot](/images/posts/20070611/screenshot.png "Screenshot")

Using the "Sketch" button, draw the structure of benzimidazole. Under "Search Type", select "Substructure." Now click "Save Query", and you'll download a substructure query for benzimidazole in PUGML:

```xml
<?xml version="1.0"?&gt;
<!DOCTYPE PCT-Data PUBLIC "-//NCBI//NCBI PCTools/EN" "http://pubchem.ncbi.nlm.nih.gov/pug/pug.dtd">
<PCT-Data>
  <PCT-Data_input>
    <PCT-InputData>
      <PCT-InputData_query>
        <PCT-Query>
          <PCT-Query_type>
            <PCT-QueryType>
              <PCT-QueryType_css>
                <PCT-QueryCompoundCS>
                  <PCT-QueryCompoundCS_query>
                    <PCT-QueryCompoundCS_query_data>C1=CC=CC2=C1N=C[N]2</PCT-QueryCompoundCS_query_data>
                  </PCT-QueryCompoundCS_query>
                  <PCT-QueryCompoundCS_type>
                    <PCT-QueryCompoundCS_type_subss>
                      <PCT-CSStructure>
                        <PCT-CSStructure_bonds value="true"/>
                      </PCT-CSStructure>
                    </PCT-QueryCompoundCS_type_subss>
                  </PCT-QueryCompoundCS_type>
                  <PCT-QueryCompoundCS_results>2000000</PCT-QueryCompoundCS_results>
                </PCT-QueryCompoundCS>
              </PCT-QueryType_css>
            </PCT-QueryType>
          </PCT-Query_type>
        </PCT-Query>
      </PCT-InputData_query>
    </PCT-InputData>
  </PCT-Data_input>
</PCT-Data>
```

The <code>PCT-QueryCompoundCS_type_subss</code> element will tell PUG to look for substructures.

# Using the Saved Query with PUG

Saving this file as <strong>benzimidazole_sss.xml</strong>, lets us feed it to PUG:

```bash
curl -d @benzimidazole_sss.xml "http://pubchem.ncbi.nlm.nih.gov/pug/pug.cgi"
```

and get the following PUGML response:

```xml
<?xml version="1.0"?>
<!DOCTYPE PCT-Data PUBLIC "-//NCBI//NCBI PCTools/EN" "http://pubchem.ncbi.nlm.nih.gov/pug/pug.dtd">
<PCT-Data>
  <PCT-Data_output>
    <PCT-OutputData>
      <PCT-OutputData_status>
        <PCT-Status-Message>
          <PCT-Status-Message_status>
            <PCT-Status value="queued"/>
          </PCT-Status-Message_status>
        </PCT-Status-Message>
      </PCT-OutputData_status>
      <PCT-OutputData_output>
        <PCT-OutputData_output_waiting>
          <PCT-Waiting>
            <PCT-Waiting_reqid>62668946396085905</PCT-Waiting_reqid>
            <PCT-Waiting_message>Structure search job was submitted</PCT-Waiting_message>
          </PCT-Waiting>
        </PCT-OutputData_output_waiting>
      </PCT-OutputData_output>
    </PCT-OutputData>
  </PCT-Data_output>
</PCT-Data>
```

We can then check on the status of our query by saving the following as <strong>status.xml</strong>:

<pre class="prettyprint">
<PCT-Data>
  <PCT-Data_input>
    <PCT-InputData>
      <PCT-InputData_request>
        <PCT-Request>
          <PCT-Request_reqid>62668946396085905</PCT-Request_reqid>
          <PCT-Request_type value="status"/>
        </PCT-Request>
      </PCT-InputData_request>
    </PCT-InputData>
  </PCT-Data_input>
</PCT-Data>
</pre>

POSTing this to PUG:

```bash
curl -d @status.xml "http://pubchem.ncbi.nlm.nih.gov/pug/pug.cgi"
```

gives us the following PUGML:

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
          <PCT-Status-Message_message>Your search has already been completed successfully!.</PCT-Status-Message_message>
        </PCT-Status-Message>
      </PCT-OutputData_status>
      <PCT-OutputData_output>
        <PCT-OutputData_output_entrez>
          <PCT-Entrez>
            <PCT-Entrez_db>pccompound</PCT-Entrez_db>
            <PCT-Entrez_query-key>1</PCT-Entrez_query-key>
            <PCT-Entrez_webenv>0CPrI_peUmUtWDooyjxpJ1XAXPcOl-ESZZxj8sJV9ZDR8musMjh1oBTib@1EDD43FA66AE1BE0_0001SID</PCT-Entrez_webenv>
          </PCT-Entrez>
        </PCT-OutputData_output_entrez>
      </PCT-OutputData_output>
    </PCT-OutputData>
  </PCT-Data_output>
</PCT-Data>

[Last time](/articles/2007/06/04/hacking-pubchem-power-user-gateway), we got a URL to download a gzipped SD File. This time, our query specified results to be returned as an Entrez Key through the <code>PCT-Entrez_webenv</code> element. We can construct a URL that will let us view these results:

```bash
http://www.ncbi.nlm.nih.gov/sites/entrez?cmd=HistorySearch&WebEnvRq=1&db=pccompound&query_key=1&WebEnv=0CPrI_peUmUtWDooyjxpJ1XAXPcOl-ESZZxj8sJV9ZDR8musMjh1oBTib%401EDD43FA66AE1BE0_0001SID
```

# Where to Next?

If we wanted to get a gzipped SD File instead, we'd need to edit our original query. But manually editing XML is a lot like mowing a lawn with scissors. What we'd really like is a simple API in a language like Ruby that will let us build sophisticated PUG queries, process the results, and pipe them into other queries with little effort. But that's a story for another time.
