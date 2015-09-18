function generateDashboard(data,geom){
    var map = new lg.map('#map').geojson(geom).joinAttr('id').zoom(4).center([10,35]);

    var grid = new lg.grid('#grid')
        .data(data)
        .width($('#grid').width())
        .nameAttr('NAME')
        .joinAttr('NAME')
        .valuesList(['VULNERABILITY','HAZARDS','COPINGCAPACITY','INFORM','REFUGEES','FUNDED','COMMITTED']);

    lg.init();
}

//load data

var dataCall = $.ajax({ 
    type: 'GET', 
    url: 'data/data.json', 
    dataType: 'json',
});

//load geometry

var geomCall = $.ajax({ 
    type: 'GET', 
    url: 'data/geom.geojson', 
    dataType: 'json',
});

//when both ready construct dashboard

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    geom = geomArgs[0];
    generateDashboard(dataArgs[0],geomArgs[0]);
});
