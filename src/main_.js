//main_()

//Objecte amb tota la configuració per defecte
//var servercatalog = new ServerCatalog();


function main_()
{

	//Inicialitzar el mapa:
	
	var center = [41.82045, 1.54907];
	var crs25831 = new L.Proj.CRS('EPSG:25831','+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
				   {resolutions: [1100, 550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25]});

	var serveiTopoCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
	    layers: 'topo',
	    format: 'image/jpeg',
	    crs: crs25831,
	    continuousWorld: true,
	    attribution: 'Institut Cartogràfic i Geològic de Catalunya -ICGC',
	});

                 var serveiOrtoCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
                        layers: 'orto',
                        format: 'image/jpeg',
                        crs: crs25831,
                        continuousWorld: true,
                        attribution: 'Institut Cartogràfic i Geològic de Catalunya -ICGC',
                  });

                  var serveitopoGrisCache = L.tileLayer.wms("http://mapcache.icc.cat/map/bases/service?", {
                        layers: 'topogris',
                        format: 'image/jpeg',
                        crs: crs25831,
                        continuousWorld: true,
                        attribution: 'Institut Cartogràfic i Geològic de Catalunya -ICGC',
                  });

                  var wmsComarques = L.tileLayer.wms("http://geoserveis.icc.cat/icc_limadmin/wms/service?", {
                        layers: '5,1',
                        format: 'image/png',
                        crs: crs25831,
                        transparent: true,
                        continuousWorld: true,
                        attribution: 'Base Comarcal 1:50.000 -ICGC',
                  });

                  var map = L.map('map', {
                        layers: [serveiTopoCache,wmsComarques],
                        crs: crs25831,
                        continuousWorld: true,
                        worldCopyJump: false,
                        center: center,
                        zoom: 2,
                        });

                        var baseMaps = {
                                     "Topogràfic": serveiTopoCache,
                                     "Topogràfic gris": serveitopoGrisCache,
                                     "Ortofoto": serveiOrtoCache
                        };
                        var overlayMaps = {
                                     "Comarques": wmsComarques
                        };

                       L.control.layers(baseMaps, overlayMaps).addTo(map);
}
