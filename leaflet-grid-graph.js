var lg =  {

	mapRegister:'',
	_gridRegister:'',
	_colors:['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'],

	init: function(){
		this.mapRegister.init();
		this._gridRegister.init();
	},

	update: function(){
		console.log('update');
	},

	colors:function(val){
        if(typeof val === 'undefined'){
            return this._colors;
        } else {
            this._colors=val;
            return this;
        }        
    },

	map: function(id){

		this._id = id;
        this._geojson = "";
        this._center = [0,0];
        this._zoom = 1;
        this._joinAttr = "";
        this._map = '';

        lg.mapRegister = this;

        this.geojson = function(val){
            if(typeof val === 'undefined'){
                return this._geojson;
            } else {
                this._geojson=val;
                return this;
            }        
        };

		this.center = function(val){
            if(typeof val === 'undefined'){
                return this._center;
            } else {
                this._center=val;
                return this;
            }        
        };


		this.zoom = function(val){
            if(typeof val === 'undefined'){
                return this._zoom;
            } else {
                this._zoom=val;
                return this;
            }        
        };

        this.joinAttr = function(val){
            if(typeof val === 'undefined'){
                return this._joinAttr;
            } else {
                this._joinAttr=val;
                return this;
            }        
        };

        this._style = function(){
            return {
                weight: 1,
                opacity: 0.8,
                color:'#000000',
                fillOpacity: 0,
                className: 'dashgeom'
            };
        };        

        this.init = function(){
        	this._map = this._initMap(this._id,this._geojson,this._center,this._zoom,this._joinAttr);
        }  

        this._initMap = function(id,geojson, center, zoom, joinAttr){

			var baselayer = L.tileLayer('https://data.hdx.rwlabs.org/mapbox-base-tiles/{z}/{x}/{y}.png', {
            	
        	});

            var map = L.map('map', {
                center: center,
                zoom: zoom,
                layers: [baselayer]
            });

            var overlay = L.geoJson(geojson,{
                style: this._style()
            }).addTo(map);

			overlay.eachLayer(function (layer) {
                if(typeof layer._path != 'undefined'){
                    layer._path.id = 'dgmap'+layer.feature.properties[joinAttr];
                } else {
                    layer.eachLayer(function (layer2){
                        layer2._path.id = 'dgmap'+layer.feature.properties[joinAttr];
                    });
                }
            })

            return map;            
        }

        this.colorMap = function (data){

        	var _parent = this;

        	data.sort(function(a, b) {
    			return parseFloat(a.value) - parseFloat(b.value);
			});

        	data.forEach(function(d,i){
        		var c = Math.floor(i/data.length*5);
        		d3.selectAll('#dgmap'+d.key).attr('fill',lg._colors[c]).attr('fill-opacity',0.8);
        	});
        }
    },

    grid: function(id){

    	this._id = id;
    	this._width = 1000;
    	this._height = 500;
    	this._data = [];
    	this._nameAttr = '';
    	this._joinAttr = '';
    	this._valuesList = [];
    	this._properties = {};

    	lg._gridRegister = this;

    	this.width = function(val){
            if(typeof val === 'undefined'){
                return this._width;
            } else {
                this._width=val;
                return this;
            }        
        };

		this.height = function(val){
            if(typeof val === 'undefined'){
                return this._height;
            } else {
                this._height=val;
                return this;
            }        
        };

		this.data = function(val){
            if(typeof val === 'undefined'){
                return this._data;
            } else {
                this._data=val;
                return this;
            }        
        };

		this.nameAttr = function(val){
            if(typeof val === 'undefined'){
                return this._nameAttr;
            } else {
                this._nameAttr=val;
                return this;
            }        
        };       

		this.joinAttr = function(val){
            if(typeof val === 'undefined'){
                return this._joinAttr;
            } else {
                this._joinAttr=val;
                return this;
            }        
        };

		this.valuesList = function(val){
            if(typeof val === 'undefined'){
                return this._valuesList;
            } else {
                this._valuesList=val;
                return this;
            }        
        };

        this.init = function(){
        	this._render(this._id,this._data,this._nameAttr,this._joinAttr,this._valuesList,this._width,this._height);
        }

        this._render = function(id,data,nameAttr,joinAttr,valuesList,width,height){

        	var _parent = this;

			this._properties.margin = {top: 120, right: 50, bottom: 20, left: 120};
            this._properties.width = this._width - this._properties.margin.left - this._properties.margin.right;
            this._properties.height = this._height - this._properties.margin.top - this._properties.margin.bottom;

            var _boxWidth = this._properties.width/valuesList.length-1;
            var _boxHeight = this._properties.height/data.length-1;      
            this._properties.x = [];
            valuesList.forEach(function(v,i){
				_parent._properties.x[i] = d3.scale.linear().range([0, _boxWidth]).domain([0, d3.max(data,function(d){return d[v];})]);             	
            });



            var _grid = d3.select(id)
                .append('svg')
                .attr('class', 'dashgrid')
                .attr('width', width)
                .attr('height', height)
                .append("g")
                .attr("transform", "translate(" + this._properties.margin.left + "," + this._properties.margin.top + ")");

            valuesList.forEach(function(v,i){
            	var g = _grid.append("g");
            		
            	data.sort(function(a, b) {
    				return parseFloat(a[v]) - parseFloat(b[v]);
				});

	            data.forEach(function(d,i){
	            	d.pos = i;
	            });

            	data.sort(function(a, b) {
            		return a[_parent._nameAttr].localeCompare(b[_parent._nameAttr]);
				});

				console.log(data);

            	g.selectAll("rect")
	                .data(data)
	                .enter()
	                .append("rect")
	                .attr("x", function(d,i2){return _boxWidth*i+i})
	                .attr("y", function(d,i2){return _boxHeight*i2+i2})
	                .attr("width", function(d){
	                    return _parent._properties.x[i](d[v]);
	                })
	                .attr("height", _boxHeight)
	                .attr("fill",function(d,i2){
	                	var c = Math.floor(d.pos/data.length*5);
	                	return lg._colors[c];
	                });

	            var g = _grid.append("g");

            	g.selectAll("rect")
	                .data(data)
	                .enter()
	                .append("rect")
	                .attr("x", function(d,i2){return _boxWidth*i+i})
	                .attr("y", function(d,i2){return _boxHeight*i2+i2})
	                .attr("width", function(d){
	                    return _boxWidth;
	                })
	                .attr("height", _boxHeight)
	                .attr("opacity",0)
	                .on("mouseover",function(d){
	                	var dataSubset = [];
	                	data.forEach(function(d){
	                		dataSubset.push({'key':d[joinAttr],'value':d[v]});
	                	});
	                	lg.mapRegister.colorMap(dataSubset);
	                });	                

	            var _xTransform = _boxWidth*i+i;    

	            g.append("text")
		            .text(v)        
	                .attr("x",0)
	                .attr("y",0)               
	                .style("text-anchor", "front")
		            .attr("transform", "translate(" + _xTransform + "," + -10 + ") rotate(-65)" );     
            })

            _grid.append("g")
            	.selectAll("text")
            	.data(data)
            	.enter()
            	.append("text")
                .text(function(d){
                	return d[nameAttr];
                })        
                .attr("x", function(d) {
                    return 5-_parent._properties.margin.left;
                })
                .attr("y", function(d,i) {
                    return _boxHeight*(i+0.5)+i;
                });       	

            _grid.append("g")
            	.selectAll("text")
            	.data(valuesList)
            	.enter()
            	.append("text")
                    
        }        
    }	
}