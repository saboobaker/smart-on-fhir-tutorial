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
		$.when(pt,us).fail(onError);
		
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
		
         ret.resolve(p);
      } else {
        onError();
      }
    }

   FHIR.oauth2.ready(onReady,onError);
   // FHIR.oauth2.ready().then(onReady).catch(onError);;
    return ret.promise();

  };
  
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
	   alert(JSON.stringity(attachment));
    });
  };

})(window);
