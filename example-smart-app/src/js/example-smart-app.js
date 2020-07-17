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

        $.when(pt).done(function(patient,us) {
         // var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;
          var id = patient.id;
		  console.log(patient);
		  //console.log(us);
          var info = '';
          var p = defaultPatient();
          p.id = patient.id;
          p.info = patient.text.div;

          ret.resolve(p);
        });
      } else {
        onError();
      }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      id: {value: ''},
	  info: {value: ''},
    };
  }


  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
	$('#id').html(p.id);
	$('#info').html(p.info);
  };

})(window);
