//main_()

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
	    maxZoom: crs25831.options.resolutions.length,
	    minZoom: 0,
	    attribution: 'Institut Cartogr&agrave;fic i Geol&oacute;gic de Catalunya -ICGC',
	});

	var serveiOrtoCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
		layers: 'orto',
		format: 'image/jpeg',
		crs: crs25831,
		continuousWorld: true,
		maxZoom: crs25831.options.resolutions.length,
		minZoom: 0,	
		attribution: 'Institut Cartogr&agrave;fic i Geol&oacute;gic de Catalunya -ICGC',
	});

	var serveitopoGrisCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
		layers: 'topogris',
		format: 'image/jpeg',
		crs: crs25831,
		continuousWorld: true,
		maxZoom: crs25831.options.resolutions.length,
		minZoom: 0,	
		attribution: 'Institut Cartogr&agrave;fic i Geol&oacute;gic de Catalunya -ICGC',
	});
	

	//Afegeixo les layers al map
	var map = L.map('map', {
	      layers: [serveitopoGrisCache],
	      crs: crs25831,
	      continuousWorld: true,
	      worldCopyJump: false,
	      center: center,
	      zoom: 7,
	});

	//Llegenda
	var baseMaps = 
	{
		"Topogr&agrave;fic": serveiTopoCache,
		"Topogr&agrave;fic gris": serveitopoGrisCache,
		"Ortofoto": serveiOrtoCache
	};
	
	//var overlayMaps = {"Punts LIDAR":geojsonLayer};
	
	//Escala
	L.control.scale({imperial: false}).addTo(map);
	
	//Control de capes
	//L.control.layers(baseMaps, overlayMaps).addTo(map);
	L.control.layers(baseMaps).addTo(map);

	//Consulta al SOLR
	var URL_query = 'http://dalmases.ddns.net:8983/solr/lidar/select?q=*:*&wt=json&json.wrf=?&fl=xy,z,class&sort=random_1234%20desc&rows=50000';
	
	query_server(URL_query).then
	(
			function(df)
			{
				//CANVAS
				/* http://bl.ocks.org/sumbera/11114288 */
				var puntsLIDAR = L.canvasOverlay()
						.params({data: df})
			            .drawing(drawingOnCanvas)
			            .addTo(map);
			    
				//Afegeixo la capa a la llegenda
				//TODO
			}
	);
	

	// **************************
	// drawingOnCanvas()
	// **************************
	function drawingOnCanvas(canvasOverlay, params) 
	{
		wkt = new Wkt.Wkt();
	    var ctx = params.canvas.getContext('2d');
	    ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
	    ctx.fillStyle = "rgba(255,0,0, 1)";
	    
	    //Defineixo la projecció ETRS89-UTM31N segons el ICC
	    proj4.defs('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
		
		$.each(params.options.data.response.docs, function(index, value)
		{
			wkt.read(value.xy);
			
			//Converteixo les coordenades a LAT/LONG
			latlong = proj4('EPSG:25831','WGS84',[wkt.components[0].x, wkt.components[0].y]);
			
			//Creo el punt amb coordenades de pantalla
			dot = canvasOverlay._map.latLngToContainerPoint([latlong[1], latlong[0]]);
			ctx.beginPath();
			//Dibuixo el punt
			ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
			//Omplo de color
			ctx.fill();
			ctx.closePath();			
		});		
	}; //Fi de drawingOnCanvas()

} // Fi de main_()
