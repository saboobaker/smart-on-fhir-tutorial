(function(window){
  window.extractData = function() {
    var ret = $.Deferred();
function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {

      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
		var practitionerID = smart.state.tokenResponse.user;
		// temporary hard code practitioner ID
		var practitionerCall = 'Practitioner/11817978';
	    var us = smart.request(practitionerCall);		//get({resource:"Practitioner", id:practitionerID});//user.read();
	//	var us = smart.request(`Practitioner/${smart.state.tokenResponse.user}`);
        var en = smart.request(`Encounter/${smart.state.tokenResponse.encounter}`);
        //var en = smart.encounter.read();//smart.get({resource:"Encounter",id:smart.state.tokenResponse.encounter}); 
		console.log(smart);
		
        var p = defaultInfo();
		
          p.encounterId= smart.state.tokenResponse.encounter;
		  p.noteCode = 'Depending on consent type';
		  p.noteSystem = 'https://fhir-ehr.sandboxcerner.com/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/codeset/72';
		  p.uName = smart.state.tokenResponse.username;
		  p.uId = smart.state.tokenResponse.user;
		
		pt.then((patient) => {
			
       // Patient Stuff
		  console.log(patient);
		  
		  var edipiSysId = "urn:oid:2.16.840.1.113883.3.42.10001.100001.12";
		  var edipi = 'Not Defined';
		  
		  
		  if (patient.hasOwnProperty('identifier')) {
		     var identifiers = patient.identifier;
		     var edipiList = identifiers.filter(function (el) {return el.system==edipiSysId});
		     console.log(edipiList);
		     if (edipiList.length>0) {
			    edipi = edipiList[0].value;
		     }
		  }
		  p.edipi = edipi;
		  if (patient.hasOwnProperty('text')){
             p.info = patient.text.div;
		  }
          p.id = patient.id;
  
         });

        us.then((user) => {
		 // User (Practitioner) Stuff
		  console.log(user);
		  var stationId='Undefined';
	      var email = 'Undefined';

          if (user.hasOwnProperty('telecom')) {
		     var emailList = user.telecom.filter(function (el) {return el.system=="email"});
             if (emailList.length>0) {
			    email = emailList[0].value;
		     }
		  }
		  // Need to get station Id here
		  if (user.hasOwnProperty('identifier')) {
		   var userIdentifiers = user.identifier.filter(function(el) {return el.type.text="OTHER"}) 
		   stationId = userIdentifiers[0].value;
		  }
		  p.stationId = stationId;
		  p.email = email;
			
		});
		
        en.then((encounter) => {		
		  // use encounter information here. 
		  console.log(encounter);
		})
		Promise.allSettled([us,pt,en]).then((results) => ret.resolve(p));

      } else {
        onError();
      }
    }

   FHIR.oauth2.ready(onReady,onError);
   // FHIR.oauth2.ready().then(onReady).catch(onError);;
    return ret.promise();

  };

  function getDocument(data) {
	  return{
		  resourceType: "DocumentReference",
		  subject: {
			  reference: `Patient/${data.id}`
		  },
		  attachment: {
		     contentType: 'application/xhtml+xml;charset=utf-8',
		     content:'PCFET0NUWVBFIGh0bWwgUFVCTElDICItLy9XM0MvL0RURCBYSFRNTCAxLjEvL0VOIg0KImh0dHA6Ly93d3cudzMub3JnL1RSL3hodG1sMTEvRFREL3hodG1sMTEuZHRkIj4NCjxodG1sIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIj4NCjxoZWFkPg0KICA8dGl0bGU+U0lDIERvY3VtZW50PC90aXRsZT4NCjwvaGVhZD4NCjxib2R5Pg0KVGhpcyBpcyBhIHRlc3RpbmcNCjwvYm9keT4NCjwvaHRtbD4='
		     }
		  }
	  };
/*
{
  "resourceType": "DocumentReference",
  "subject": {
    "reference": "Patient/53663272"
  },
  "type": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "34840-9"
      }
    ]
  },
  "author": [
    {
      "reference": "Practitioner/21500981"
    }
  ],
  "indexed": "2015-11-18T18:00:00Z",
  "status": "current",
  "docStatus": {
    "coding": [
      {
        "system": "http://hl7.org/fhir/composition-status",
        "code": "final"
      }
    ]
  },
  "description": "Rheumatology Note",
  "content": [
    {
      "attachment": {
        "contentType": "application/xhtml+xml;charset=utf-8",
        "data": "<snipped for brevity>"
      }
	  
    }
  ],
  "context": {
    "encounter": {
      "reference": "Encounter/4208059"
    },
    "period": {
      "end": "2015-08-20T09:10:14Z"
    }
  }
}
*/	  
  }
  function defaultInfo(){
    return {
      id: {value: ''},
	  stationId: {value: ''},
	  email: {value: ''},
	  info: {value: ''},
	  uId: {value:''},
	  uName: {value:''},
	  encounterId: {value:''},
	  edipi: {value: ''},
	  noteCode: {value: ''},
	  noteSystem: {value: ''}
    };
  }

function sendDocument(data) {
    var doc = getDocument(data);    
	console.log(JSON.stringify(doc));
}
  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
	$('#id').html(p.id);
	$('#edipi').html(p.edipi);
	$('#userEmail').html(p.email);
	$('#stationId').html(p.stationId);	
	$('#info').html(p.info);
	$('#userid').html(p.uId);
	$('#userName').html(p.uName);
	$('#encounterId').html(p.encounterId);
	$('#noteCode').html(p.noteCode);
	$('#notesystem').html(p.noteSystem);
    $("#calljs").click(function(e) {
       e.preventDefault(); 
	   sendDocument(p);
    });
  };

})(window);
