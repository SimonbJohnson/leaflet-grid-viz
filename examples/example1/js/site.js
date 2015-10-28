function generateDashboard(data,geom){
    var map = new lg.map('#map').geojson(geom).joinAttr('id').zoom(4).center([10,35]);

    var coping = new lg.column('COPINGCAPACITY').label('Lack of Coping').domain([0,10]);

    var grid = new lg.grid('#grid')
        .data(data)
        .width($('#grid').width())
        .height(500)
        .nameAttr('NAME')
        .joinAttr('ID')
        .hWhiteSpace(5)
        .vWhiteSpace(10)
        .columns(['VULNERABILITY','HAZARDS',coping,'INFORM','REFUGEES','FUNDED','COMMITTED']);

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
