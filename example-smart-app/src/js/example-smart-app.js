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
		console.log(smart);
		var user = smart.user;
		// var us = user.read(user.userId);
		console.log(user);
		/*
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4']
                      }
                    }
                  });

        */
		$.when(pt).fail(onError);

        $.when(pt).done(function(patient) {
         // var byCodes = smart.byCodes(obv, 'code');
          var id = patient.id;
		  console.log(patient);
		  var uId = smart.tokenResponse.user;
		  var uName = smart.tokenResponse.username;
		  //console.log(us);
          var info = '';
          var p = defaultInfo();
          p.id = patient.id;
          p.info = patient.text.div;
		  p.uName = uName;
		  p.uId = uId;
          p.encounterId= smart.tokenResponse.encounter;
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
	  info: {value: ''},
	  uId: {value:''},
	  uName: {value:''},
	  encounterId: {value:''}
    };
  }


  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
	$('#id').html(p.id);
	$('#info').html(p.info);
	$('#userid').html(p.uId);
	$('#userName').html(p.uName);
	$('#encounterId').html(p.encounterId);
  };

})(window);
