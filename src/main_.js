//main_()

//Objecte amb tota la configuració per defecte
//var servercatalog = new ServerCatalog();


function main_()
{

	//Inicialitzar el mapa:
	
	var center = [41.564786, 2.012173];
	var crs25831 = new L.Proj.CRS('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
				   {resolutions: [1100, 550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25]});

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
	
	var map = L.map('map', {
	      layers: [serveitopoGrisCache],
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
	
	var overlayMaps = {
					
	};
	L.control.scale({imperial: false}).addTo(map);
	L.control.layers(baseMaps, overlayMaps).addTo(map);

	var URL_query = 'http://dalmases.ddns.net:8983/solr/lidar/select?q=*:*&wt=json&json.wrf=?&fl=xy,z,class';
	query_server(URL_query).then(
			function(df)
			{
				console.log(df)
				return;
			});



}
