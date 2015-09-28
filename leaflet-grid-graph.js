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

        this._style = function(feature){
            return {
                weight: 1,
                opacity: 0.8,
                color:'#000000',
                fillOpacity: 0,
                className: 'dashgeom dashgeom'+feature[lg.mapRegister._joinAttr]
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
                style: this._style
            }).addTo(map);

            return map;            
        }

        this.colorMap = function (data){

        	var _parent = this;

        	data.sort(function(a, b) {
    			return parseFloat(a.value) - parseFloat(b.value);
			});

        	data.forEach(function(d,i){
        		var c = Math.floor(i/data.length*5);
        		d3.selectAll('.dashgeom'+d.key).attr('fill',lg._colors[c]).attr('fill-opacity',0.8);
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
    	this._vWhiteSpace = 1;
    	this._hWhiteSpace = 1;

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

        this.vWhiteSpace = function(val){
            if(typeof val === 'undefined'){
                return this._vWhiteSpace;
            } else {
                this._vWhiteSpace=val;
                return this;
            }        
        };

        this.hWhiteSpace = function(val){
            if(typeof val === 'undefined'){
                return this._hWhiteSpace;
            } else {
                this._hWhiteSpace=val;
                return this;
            }        
        };        

        this.init = function(){
        	this.render(this._id,this._data,this._nameAttr,this._joinAttr,this._valuesList,this._width,this._height);
        }

        this.render = function(){
        	this._render(this._id,this._data,this._nameAttr,this._joinAttr,this._valuesList,this._width,this._height);
        }

        this._render = function(id,data,nameAttr,joinAttr,valuesList,width,height){

        	var _parent = this;

			this._properties.margin = {top: 120, right: 50, bottom: 20, left: 120};
            this._properties.width = this._width - this._properties.margin.left - this._properties.margin.right;
            this._properties.height = this._height - this._properties.margin.top - this._properties.margin.bottom;

            this._properties.boxWidth = this._properties.width/valuesList.length-this._hWhiteSpace;
            this._properties.boxHeight = this._properties.height/data.length-this._vWhiteSpace;      
            this._properties.x = [];
            valuesList.forEach(function(v,i){
				_parent._properties.x[i] = d3.scale.linear().range([0, _parent._properties.boxWidth]).domain([0, d3.max(data,function(d){return d[v];})]);             	
            });

            var _grid = d3.select(id)
                .append('svg')
                .attr('class', 'dashgrid')
                .attr('width', width)
                .attr('height', height)
                .append("g")
                .attr("transform", "translate(" + this._properties.margin.left + "," + this._properties.margin.top + ")");

            valuesList.forEach(function(v,i){
            	var g = _grid.append("g").attr('class','bars');
            		
            	data.sort(function(a, b) {
    				return parseFloat(a[v]) - parseFloat(b[v]);
				});

	            data.forEach(function(d,i){
	            	d.pos = i;
	            });

            	data.sort(function(a, b) {
            		return a[_parent._nameAttr].localeCompare(b[_parent._nameAttr]);
				});

            	g.selectAll("rect")
	                .data(data)
	                .enter()
	                .append("rect")
	                .attr('class','bars'+v)
	                .attr("x", function(d,i2){return _parent._properties.boxWidth*i+i*_parent._hWhiteSpace})
	                .attr("y", function(d,i2){return _parent._properties.boxHeight*i2+i2*_parent._vWhiteSpace})
	                .attr("width", function(d){
	                    return _parent._properties.x[i](d[v]);
	                })
	                .attr("height", _parent._properties.boxHeight)
	                .attr("fill",function(d,i2){
	                	var c = Math.floor(d.pos/data.length*5);
	                	return lg._colors[c];
	                });	                

	            var _xTransform = _parent._properties.boxWidth*i+i*_parent._hWhiteSpace;    

	            var g = _grid.append("g");

	            g.append("text")
		            .text(v)        
	                .attr("x",0)
	                .attr("y",0)               
	                .style("text-anchor", "front")
		            .attr("transform", "translate(" + (_xTransform+ _parent._properties.boxWidth/2-10) + "," + -10 + ") rotate(-65)" )
		            .attr("class","sortLabel")
		            .on("click",function(){
		            	_parent._update(data,valuesList,d3.select(this).text(),nameAttr);
		            });

		        g.append("text")
		            .text(d3.format(".4s")(d3.max(data,function(d){return d[v];})))        
	                .attr("x",_parent._properties.boxWidth-5)
	                .attr("y",_parent._properties.height+_parent._vWhiteSpace)               
	                .style("text-anchor", "front")
		            .attr("transform", "translate(" + _xTransform + "," + 0 + ")" )
		            .attr("opacity",0)
		            .attr("class",function(d){return "maxLabel"+i});

		        g.append("line")
					.attr("x1", _parent._properties.boxWidth*(i+1)+(i)*_parent._hWhiteSpace)
					.attr("y1", -_parent._hWhiteSpace/2)
					.attr("x2", _parent._properties.boxWidth*(i+1)+(i)*_parent._hWhiteSpace)
					.attr("y2", _parent._properties.height-_parent._vWhiteSpace/2)
		            .attr("opacity",0)
		            .attr("class",function(d){return "maxLabel"+i})
		            .attr("stroke-width", 1)
	                .attr("stroke", "#ddd");

		        g.append("text")
		            .text("0")        
	                .attr("x",-5)
	                .attr("y",_parent._properties.height+_parent._vWhiteSpace)               
	                .style("text-anchor", "front")
		            .attr("transform", "translate(" + _xTransform + "," + 0 + ")" )
		            .attr("opacity",0)
		            .attr("class",function(d){return "maxLabel"+i});	                

		        g.append("line")
					.attr("x1", _parent._properties.boxWidth*(i)+(i)*_parent._hWhiteSpace)
					.attr("y1", -_parent._hWhiteSpace/2)
					.attr("x2", _parent._properties.boxWidth*(i)+(i)*_parent._hWhiteSpace)
					.attr("y2", _parent._properties.height-_parent._vWhiteSpace/2)
		            .attr("opacity",0)
		            .attr("class",function(d){return "maxLabel"+i})
		            .attr("stroke-width", 1)
	                .attr("stroke", "#ddd");

				var g = _grid.append("g");

            	g.selectAll("rect")
	                .data(data)
	                .enter()
	                .append("rect")
	                .attr('class','selectbars'+v)
	                .attr("x", function(d,i2){return _parent._properties.boxWidth*i+i*_parent._hWhiteSpace})
	                .attr("y", function(d,i2){return _parent._properties.boxHeight*i2+i2*_parent._vWhiteSpace})
	                .attr("width", function(d){
	                    return _parent._properties.boxWidth+_parent._hWhiteSpace;
	                })
	                .attr("height", _parent._properties.boxHeight+_parent._vWhiteSpace)
	                .attr("opacity",0)
	                .on("mouseover",function(d,i2){
	                	var dataSubset = [];
	                	data.forEach(function(d){
	                		dataSubset.push({'key':d[joinAttr],'value':d[v]});
	                	});

	                	lg.mapRegister.colorMap(dataSubset);
	                	d3.selectAll('.dashgeom'+d[joinAttr]).attr("stroke-width",3);
	                	d3.selectAll('.maxLabel'+i).attr("opacity",1);
	                	d3.selectAll('.horLine'+i2).attr("opacity",1);
	                })
	                .on("mouseout",function(d,i2){
	                	d3.selectAll('.maxLabel'+i).attr("opacity",0);
	                	d3.selectAll('.horLine'+i2).attr("opacity",0);
	                	d3.selectAll('.dashgeom'+d[joinAttr]).attr("stroke-width",1);	                	
	                });	                  	                               
            })
			
			var g = _grid.append("g");
		
			g.selectAll("line")
				.data(data)
	            .enter()
	            .append("line")
				.attr("x1", -_parent._properties.margin.left)
				.attr("y1",function(d,i){return _parent._properties.boxHeight*(i)+(i-0.5)*_parent._vWhiteSpace})
				.attr("x2", _parent._properties.width-_parent._hWhiteSpace)
				.attr("y2", function(d,i){return _parent._properties.boxHeight*(i)+(i-0.5)*_parent._vWhiteSpace})
		        .attr("opacity",0)
		        .attr("class",function(d,i){return "horLine"+i+" horLineTop"})
		        .attr("stroke-width", 1)
	            .attr("stroke", "#ddd");

	        var g = _grid.append("g");

			g.selectAll("line")
				.data(data)
	            .enter()
	            .append("line")
				.attr("x1", -_parent._properties.margin.left)
				.attr("y1", function(d,i){return _parent._properties.boxHeight*(i+1)+(i+0.5)*_parent._vWhiteSpace})
				.attr("x2", _parent._properties.width-_parent._hWhiteSpace)
				.attr("y2", function(d,i){return _parent._properties.boxHeight*(i+1)+(i+0.5)*_parent._vWhiteSpace})
	            .attr("opacity",0)
		        .attr("class",function(d,i){return "horLine"+i+" horLineBot"})
		        .attr("stroke-width", 1)
	            .attr("stroke", "#ddd");

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
                    return _parent._properties.boxHeight*(i+0.5)+i*_parent._vWhiteSpace;
                })
                .attr('class','nameLabels');       	
                    
        }

        this._update = function(data,valuesList,sortBy,nameAttr){

        	var _parent = this;

        	data.sort(function(a, b) {
    			return parseFloat(b[sortBy]) - parseFloat(a[sortBy]);
			});

	        data.forEach(function(d,i){
	          	d.pos = i;
	        });

            data.sort(function(a, b) {
            	return a[_parent._nameAttr].localeCompare(b[_parent._nameAttr]);
			});

			valuesList.forEach(function(v,i){
				d3.selectAll(".bars"+v)					
					.transition()
					.duration(750)
					.attr("x", function(d,i2){return _parent._properties.boxWidth*i+i*_parent._hWhiteSpace})
		            .attr("y", function(d,i2){return _parent._properties.boxHeight*d.pos+d.pos*_parent._vWhiteSpace});

				d3.selectAll(".selectbars"+v)					
					.transition()
					.duration(750)
					.attr("x", function(d,i2){return _parent._properties.boxWidth*i+i*_parent._hWhiteSpace})
		            .attr("y", function(d,i2){return _parent._properties.boxHeight*d.pos+d.pos*_parent._vWhiteSpace});		            

		    });

		    d3.selectAll(".horLineTop")
		    	.attr("y1",function(d,i){return _parent._properties.boxHeight*(d.pos)+(d.pos-0.5)*_parent._vWhiteSpace})
		    	.attr("y2",function(d,i){return _parent._properties.boxHeight*(d.pos)+(d.pos-0.5)*_parent._vWhiteSpace});

		    d3.selectAll(".horLineBot")
		    	.attr("y1",function(d,i){return _parent._properties.boxHeight*(d.pos+1)+(d.pos+0.5)*_parent._vWhiteSpace})
		    	.attr("y2",function(d,i){return _parent._properties.boxHeight*(d.pos+1)+(d.pos+0.5)*_parent._vWhiteSpace});		    	


		    d3.selectAll(".nameLabels")		    	
		    	.transition()
		    	.duration(750)
		    	.attr("y",function(d){
		    		return _parent._properties.boxHeight*(d.pos+0.5)+d.pos*_parent._vWhiteSpace;
		    	});
        }        
    }	
}