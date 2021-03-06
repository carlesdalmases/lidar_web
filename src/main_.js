//main_()

//Objecte amb tota la configuració per defecte
//var servercatalog = new ServerCatalog();


function main_()
{

	//Inicialitzar el mapa:
	
	var center = [41.564786, 2.012173];

	// ***************************************************************
	var crs25831 = new L.Proj.CRS('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
				   {resolutions: [1100, 550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25]});
	// ***************************************************************

	var serveiTopoCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
	    layers: 'topo',
	    format: 'image/jpeg',
	    crs: crs25831,
	    continuousWorld: true,
	    attribution: 'Institut Cartogr&agrave;fic i Geol&oacute;gic de Catalunya -ICGC',
	});

	var serveiOrtoCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
	       layers: 'orto',
	       format: 'image/jpeg',
	       crs: crs25831,
	       continuousWorld: true,
	       attribution: 'Institut Cartogr&agrave;fic i Geol&oacute;gic de Catalunya -ICGC',
	});

	var serveitopoGrisCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
	      layers: 'topogris',
	      format: 'image/jpeg',
	      crs: crs25831,
	      continuousWorld: true,
	      attribution: 'Institut Cartogr&agrave;fic i Geol&oacute;gic de Catalunya -ICGC',
	});
	
	// ***************************************************************						
	// Objecte GeoJson amb les coordenades dels punts
	
	var geojson = {
					"type": "FeatureCollection",
    				"features": []
    			  };

	// ***************************************************************						

	// ***************************************************************
	//Creo la layer de punts i l'afegeixo al mapa


	var myIcon = L.divIcon({className: 'leaflet-div-icon3'});
	//var myIcon = L.divIcon({className: 'leaflet-div-icon'});



	var geojsonLayer = L.Proj.geoJson(geojson, {pointToLayer: function(type, latlng){return L.marker(latlng, {icon: myIcon});}});


	// ***************************************************************						

	//Afegeixo les layers al map
	var map = L.map('map', {
	      layers: [serveitopoGrisCache, geojsonLayer],
	      crs: crs25831,
	      continuousWorld: true,
	      worldCopyJump: false,
	      center: center,
	      zoom: 7,
	});

	var baseMaps = {
	             "Topogr&agrave;fic": serveiTopoCache,
	             "Topogr&agrave;fic gris": serveitopoGrisCache,
	             "Ortofoto": serveiOrtoCache
	};

	
	var overlayMaps = {"Punts LIDAR":geojsonLayer};
	
	//Escala
	L.control.scale({imperial: false}).addTo(map);
	
	//Control de capes
	L.control.layers(baseMaps, overlayMaps).addTo(map);
	


	var URL_query = 'http://dalmases.ddns.net:8983/solr/lidar/select?q=*:*&wt=json&json.wrf=?&fl=xy,z,class&rows=10000';
	
	query_server(URL_query).then
	(
			function(df)
			{
				wkt = new Wkt.Wkt();
								
				$.each(df.response.docs, function(index, value)
				{
					wkt.read(value.xy);
					geojson.features.push(
											{
				  								"type": "Feature",
												"properties": {"z": value.z, "class": value.class},
												"geometry": {
																"type": "Point", 
									       						"coordinates": [wkt.components[0].x, wkt.components[0].y]
									       					},
				  								"crs": {"type": "name","properties": {"name": "EPSG:25831"}}
	  			  							}
										 );
				});
				
				console.log("GeoJson preparat!");
				
				//Afegeixo tot el Json a la layer
				geojsonLayer.addData(geojson);
			}
	);
}

