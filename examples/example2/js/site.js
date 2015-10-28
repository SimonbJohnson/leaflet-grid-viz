function generateDashboard(data,geom){
    var map = new lg.map('#map').geojson(geom).joinAttr('Iso_Code').zoom(3).center([53.5,20]);
    var grid = new lg.grid('#grid')
        .data(data)
        .width($('#grid').width())
        .height(500)
        .nameAttr('Country')
        .joinAttr('ISO 3 code')
        .hWhiteSpace(10)
        .vWhiteSpace(5)
        .columns(['Total Migrants','Active Staff','Active Volunteers','Bilateral Volunteers','Surge Volunteers','Active Locations','Beneficiaries This Week','Total Beneficiary Contacts','Women and Children Benificiaries','Water Bottle Dist','Food Parcel Dist','Hygiene Kit Dist','Medical Interventions','RFL Initatiated 2015','RFL Completed 2015','Long-Term Shelter Support','Host communities supported'])
        .margins({top: 150, right: 105, bottom: 20, left: 140});

    lg.init();

    $("#map").width($("#map").width()); 
}

function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(headers==true && i==0){
            keys = e;
        } else if(headers==true && i>1) {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        } else if(headers!=true){
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);

        }
    });
    return output;
}


function generateStats(id,data){
	var formatComma = d3.format(",.0f");
	var formatPerc = d3.format(",.1%");
	totalMigrants = 0;
	totalBeneficiaries = 0;
	
	for(var i = 0; i < data.length; i++) {
		numMigrants = parseInt(data[i]["Total Migrants"]);
		numBeneficiaries = parseInt(data[i]["Total Beneficiary Contacts"]);
		if (!isNaN(numMigrants)) {
			totalMigrants += numMigrants;  
		};
		if (!isNaN(numBeneficiaries)) {
			totalBeneficiaries += numBeneficiaries;  
		};
	};
	
    var html = '';
    html = html + '<p  class="stat_title">Total Migrants in Europe</p><p class="stat">'+ formatComma(totalMigrants) + '</p>';
    html = html + '<p class="stat_title">Total Beneficiary Contacts</p><p class="stat">'+ formatComma(totalBeneficiaries) + '</p><p class="sub_stat">   (' + formatPerc(totalBeneficiaries/totalMigrants) + ')';   
    html = html + '</div>';
    $(id).html(html);
}

/*
function stickydiv(){
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top){
        $('#map-container').addClass('sticky');
    }
    else{
        $('#map-container').removeClass('sticky');
    }
};

$(window).scroll(function(){
    stickydiv();
}); 
*/

//load data

// WITH THE FORCE...
var dataCall = $.ajax({ 
    type: 'GET', 
    url: 'http://proxy.hxlstandard.org/data.json?filter01=replace-map&replace-map-url01=https%3A//docs.google.com/spreadsheets/d/12TdWAO9BmavBkGEM-7hPV7IMjN_EOJY_2iGnW_ezjuk/pub%3Fgid%3D493036357%26single%3Dtrue%26output%3Dcsv&filter02=merge&merge-url02=https%3A//docs.google.com/spreadsheets/d/12TdWAO9BmavBkGEM-7hPV7IMjN_EOJY_2iGnW_ezjuk/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv&merge-tags02=%23country%2Bcode&merge-keys02=%23country-code&force=on&url=https%3A//docs.google.com/spreadsheets/d/17UV2Zqkz6YDWIEgzT16_XCMLE7_VXjo7U-Wme01fnXQ/edit%3Fusp%3Ddrive_web',
    dataType: 'json',
});

// WITHOUT THE FORCE...
var dataCall = $.ajax({ 
    type: 'GET', 
    url: 'http://proxy.hxlstandard.org/data.json?filter01=replace-map&replace-map-url01=https%3A//docs.google.com/spreadsheets/d/12TdWAO9BmavBkGEM-7hPV7IMjN_EOJY_2iGnW_ezjuk/pub%3Fgid%3D493036357%26single%3Dtrue%26output%3Dcsv&filter02=merge&merge-url02=https%3A//docs.google.com/spreadsheets/d/12TdWAO9BmavBkGEM-7hPV7IMjN_EOJY_2iGnW_ezjuk/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv&merge-tags02=%23country%2Bcode&merge-keys02=%23country-code&url=https%3A//docs.google.com/spreadsheets/d/17UV2Zqkz6YDWIEgzT16_XCMLE7_VXjo7U-Wme01fnXQ/edit%3Fusp%3Ddrive_web',
    dataType: 'json',
});


//load geometry

var geomCall = $.ajax({ 
    type: 'GET', 
    url: 'data/geom.json', 
    dataType: 'json',
});

//when both ready construct dashboard

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var geom = topojson.feature(geomArgs[0],geomArgs[0].objects.geom);
    console.log(geom);
    var data = hxlProxyToJSON(dataArgs[0],true);
    console.log(data);
    generateDashboard(data,geom);
	generateStats("#key_stats",data);
});
