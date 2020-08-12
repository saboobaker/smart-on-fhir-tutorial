(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
    // smart.user.read().then( user =>  {
    //            console.log(user);
    //  });
	  if (smart.hasOwnProperty('user')) {
		  var user = smart.user;
		  var us = user.read();
	  }		  
	  $when(us).done(function (user) {
		     console.log(user);
	  });
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
		console.log(smart);
		$.when(pt).fail(onError);

        $.when(pt).done(function(patient) {
         // var byCodes = smart.byCodes(obv, 'code');
          var id = patient.id;
		  console.log(patient);
		  var uId = smart.tokenResponse.user;
		  var uName = smart.tokenResponse.username;
		  
		  var edipiSysId = "urn:oid:2.16.840.1.113883.3.42.10001.100001.12";
		  var identifiers = patient.identifier;
		  var edipiList = identifiers.filter(function (el) {return el.system==edipiSysId});
		  console.log(edipiList);
		  var edipi = 'Not Defined';
		  if (edipiList.length>0) {
			   edipi = edipiList[0].value;
		  }
          var info = '';
          var p = defaultInfo();
		  var stationId='Pending';
	      var email = 'Pending';
          p.id = patient.id;
          p.info = patient.text.div;
		  p.uName = uName;
		  p.uId = uId;
		  
          p.encounterId= smart.tokenResponse.encounter;
		  p.edipi = edipi;
		  p.noteCode = 'Depending on consent type';
		  p.noteSystem = 'To Be Defined by Cerner';
		  p.stationId = stationId;
		  p.email = email;
          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
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
	$('#userEmail').html(p.email);
	$('#stationId').html(p.stationId);	
	$('#info').html(p.info);
	$('#userid').html(p.uId);
	$('#userName').html(p.uName);
	$('#encounterId').html(p.encounterId);
	$('#edipi').html(p.edipi);
	$('#noteCode').html(p.noteCode);
	$('#notesystem').html(p.noteSystem);
	
  };

})(window);
