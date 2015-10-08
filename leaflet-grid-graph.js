var lg =  {

	mapRegister:'',
	_gridRegister:'',
	_colors:['#edf8fb','#b2e2e2','#66c2a4','#2ca25f','#006d2c'],
    _selectedBar:-1,

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
            console.log(lg.mapRegister._joinAttr);
            console.log(feature.properties[lg.mapRegister._joinAttr]);
            return {
                weight: 1,
                opacity: 0.8,
                color:'#000000',
                fillOpacity: 0,
                className: 'dashgeom dashgeom'+feature.properties[lg.mapRegister._joinAttr]
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
        this._properties.margin = {top: 120, right: 50, bottom: 20, left: 120};
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

        this.margins = function(val){
            if(typeof val === 'undefined'){
                return this._properties.margin;
            } else {
                this._properties.margin=val;
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

			//this._properties.margin = {top: 120, right: 50, bottom: 20, left: 120};
            this._properties.width = this._width - this._properties.margin.left - this._properties.margin.right;
            this._properties.height = this._height - this._properties.margin.top - this._properties.margin.bottom;

            this._properties.boxWidth = this._properties.width/valuesList.length-this._hWhiteSpace;
            this._properties.boxHeight = this._properties.height/data.length-this._vWhiteSpace;      
            this._properties.x = [];
            valuesList.forEach(function(v,i){
				_parent._properties.x[i] = d3.scale.linear().range([0, _parent._properties.boxWidth]).domain([0, d3.max(data,function(d){return Number(d[v]);})]);             	
            });

            var _grid = d3.select(id)
                .append('svg')
                .attr('class', 'dashgrid')
                .attr('width', width)
                .attr('height', height)
                .append("g")
                .attr("transform", "translate(" + this._properties.margin.left + "," + this._properties.margin.top + ")");

            var tip = d3.tip().attr('class', 'd3-tip').html(function(d,i) {return d3.format('0,000')(d.value); });    

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

                var newData = [];

                data.forEach(function(d,i){
                    var nd = {};
                    nd.pos = d.pos;
                    nd.join = d[_parent._joinAttr];
                    nd.value = d[v];
                    newData.push(nd);
                });

            	g.selectAll("rect")
	                .data(newData)
	                .enter()
	                .append("rect")
	                .attr('class','bars'+i)
	                .attr("x", function(d,i2){return _parent._properties.boxWidth*i+i*_parent._hWhiteSpace})
	                .attr("y", function(d,i2){return _parent._properties.boxHeight*i2+i2*_parent._vWhiteSpace})
	                .attr("width", function(d){
	                    return _parent._properties.x[i](d.value);
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
		            .text(d3.format(".4s")(d3.max(data,function(d){return Number(d[v]);})))        
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

            	var selectBars = g.selectAll("rect")
	                .data(newData)
	                .enter()
	                .append("rect")
	                .attr('class','selectbars'+i)
	                .attr("x", function(d,i2){return _parent._properties.boxWidth*i+i*_parent._hWhiteSpace})
	                .attr("y", function(d,i2){return _parent._properties.boxHeight*i2+i2*_parent._vWhiteSpace})
	                .attr("width", function(d){
	                    return _parent._properties.boxWidth+_parent._hWhiteSpace;
	                })
	                .attr("height", _parent._properties.boxHeight+_parent._vWhiteSpace)
	                .attr("opacity",0)
	                
                d3.selectAll('.selectbars'+i).call(tip);

                selectBars.on("mouseover",function(d,i2){

                        var dataSubset = [];
                        newData.forEach(function(d){
                            dataSubset.push({'key':d.join,'value':d.value});
                        });

                        
                        d3.selectAll('.dashgeom'+d.join).attr("stroke-width",3);                        
                        d3.selectAll('.horLine'+i2).attr("opacity",1);

                        if(lg._selectedBar==-1){
                            d3.selectAll('.maxLabel'+i).attr("opacity",1);
                            lg.mapRegister.colorMap(dataSubset);
                        }

                    })
                    .on("mouseout",function(d,i2){


                        d3.selectAll('.horLine'+i2).attr("opacity",0);
                        d3.selectAll('.dashgeom'+d.join).attr("stroke-width",1);

                        if(lg._selectedBar==-1){
                            d3.selectAll('.maxLabel'+i).attr("opacity",0);
                        }                        
                    })
                    .on('click',function(d,i2){
                        if(lg._selectedBar ==i){
                            lg._selectedBar = -1;
                            console.log('reset');
                        } else {
                            d3.selectAll('.maxLabel'+lg._selectedBar).attr("opacity",0);                          
                            lg._selectedBar = i;
                            d3.selectAll('.maxLabel'+lg._selectedBar).attr("opacity",1);
                            console.log(i);
                        };
                    })

                d3.selectAll('.selectbars'+i).on('mouseover.something', tip.show).on('mouseout.something', tip.hide);         
   	                  	                               
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

                var newData = [];

                data.forEach(function(d,i){
                    var nd = {};
                    nd.pos = d.pos;
                    nd.join = d[_parent._joinAttr];
                    nd.value = d[v];
                    newData.push(nd);
                });

				d3.selectAll(".bars"+i)
                    .data(newData)					
					.transition()
					.duration(750)
					.attr("x", function(d,i2){return _parent._properties.boxWidth*i+i*_parent._hWhiteSpace})
		            .attr("y", function(d,i2){return _parent._properties.boxHeight*d.pos+d.pos*_parent._vWhiteSpace});

				d3.selectAll(".selectbars"+i)
                    .data(newData) 					
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

d3.tip=function(){function t(t){v=d(t),w=v.createSVGPoint(),document.body.appendChild(g)}function e(){return"n"}function n(){return[0,0]}function r(){return" "}function o(){var t=y();return{top:t.n.y-g.offsetHeight,left:t.n.x-g.offsetWidth/2}}function s(){var t=y();return{top:t.s.y,left:t.s.x-g.offsetWidth/2}}function u(){var t=y();return{top:t.e.y-g.offsetHeight/2,left:t.e.x}}function f(){var t=y();return{top:t.w.y-g.offsetHeight/2,left:t.w.x-g.offsetWidth}}function l(){var t=y();return{top:t.nw.y-g.offsetHeight,left:t.nw.x-g.offsetWidth}}function i(){var t=y();return{top:t.ne.y-g.offsetHeight,left:t.ne.x}}function a(){var t=y();return{top:t.sw.y,left:t.sw.x-g.offsetWidth}}function c(){var t=y();return{top:t.se.y,left:t.e.x}}function m(){var t=document.createElement("div");return t.style.position="absolute",t.style.display="none",t.style.boxSizing="border-box",t}function d(t){return t=t.node(),"svg"==t.tagName.toLowerCase()?t:t.ownerSVGElement}function y(){var t=d3.event.target,e={},n=t.getScreenCTM(),r=t.getBBox(),o=r.width,s=r.height,u=r.x,f=r.y,l=document.body.scrollTop,i=document.body.scrollLeft;return document.documentElement&&document.documentElement.scrollTop&&(l=document.documentElement.scrollTop,i=document.documentElement.scrollLeft),w.x=u+i,w.y=f+l,e.nw=w.matrixTransform(n),w.x+=o,e.ne=w.matrixTransform(n),w.y+=s,e.se=w.matrixTransform(n),w.x-=o,e.sw=w.matrixTransform(n),w.y-=s/2,e.w=w.matrixTransform(n),w.x+=o,e.e=w.matrixTransform(n),w.x-=o/2,w.y-=s/2,e.n=w.matrixTransform(n),w.y+=s,e.s=w.matrixTransform(n),e}var p=e,h=n,x=r,g=m(),v=null,w=null;t.show=function(){var e,n=x.apply(this,arguments),r=h.apply(this,arguments),o=p.apply(this,arguments),s=d3.select(g),u=0;for(s.html(n).style("display","block");u--;)s.classed(b[u],!1);return e=T.get(o).apply(this),s.classed(o,!0).style({top:e.top+r[0]+"px",left:e.left+r[1]+"px"}),t},t.hide=function(){return g.style.display="none",g.innerHTML="",t},t.attr=function(e,n){return arguments.length<2?d3.select(g).attr(e):(d3.select(g).attr(e,n),t)},t.style=function(e,n){return arguments.length<2?d3.select(g).style(e):(d3.select(g).style(e,n),t)},t.direction=function(e){return arguments.length?(p=null==e?e:d3.functor(e),t):p},t.offset=function(e){return arguments.length?(h=null==e?e:d3.functor(e),t):h},t.html=function(e){return arguments.length?(x=null==e?e:d3.functor(e),t):x};var T=d3.map({n:o,s:s,e:u,w:f,nw:l,ne:i,sw:a,se:c}),b=T.keys();return t};