(function(global) {


    
    function getData() {

        var url = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=1da75a7af95ee9f123abf404263a4d30&format=json&limit=12';
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText).tracks.track;
            createDB(data);
          }
        };

        request.onerror = function() {
          console.log('failed to generate response');
        };      
        request.send();
    }
    

    function createDB(songs) {

        if('indexedDB' in window) {
            
            var open = window.indexedDB.open('music-catalog-DB', 1);
            // console.log(open.result);

            open.onupgradeneeded = function(event) {

                // console.log('works');

                var db = event.target.result;
                var objectStore = db.createObjectStore('catalog', { autoIncrement: true, keyPath: 'id' }); // create an object store with a key path and key generator


                objectStore.transaction.oncomplete = function(event) {

                    var transaction = db.transaction('catalog', 'readwrite');
                    var objectStore = transaction.objectStore('catalog');


                    songs.forEach(function(song) {

                        var model = {};
                        model.song = song.name;
                        model.images = song.image;
                        model.listeners = song.listeners;
                        model.playcount = song.playcount;
                        model.songUrl = song.url;
                        model.artist = song.artist.name;
                        model.artistUrl = song.artist.url;

                        objectStore.add(model);
                    });
                }
            }
        }

        retrieveSongs();
    }


    function retrieveSongs() {

        if('indexedDB' in window) {
                
            var open = window.indexedDB.open('music-catalog-DB', 1);
            
            open.onsuccess = function(event) {
                
                var db = event.target.result;
                var transaction = db.transaction('catalog', 'readwrite');
                var objectStore = transaction.objectStore('catalog');

                // console.log(objectStore.transaction.db.version);
                // console.log(objectStore);

                var getCatalog = objectStore.getAll();

                getCatalog.onsuccess = function(event) {

                    event.target.result.forEach(function(song) {

                        buildCatalogEntry(song);

                        // console.log(song);
                        // console.log('song:',song.song);
                        // console.log('images:',song.images[2]['#text']);
                        // console.log('listeners:', song.listeners);
                        // console.log('playcount:', song.playcount);
                        // console.log('link:', song.songUrl);
                        // console.log('artist:', song.artist);
                        // console.log('artist URL:', song.artistUrl);
                    })
                }
            }
        }
    }


    function buildCatalogEntry(song) {

        // console.log(song.song);
        var catalogContainer = document.getElementsByClassName('catalog-container')[0];

        var catalog = document.createElement('div');
        catalog.classList.add('catalog');
        catalogContainer.appendChild(catalog);
        var headerContent = document.createElement('div');
        headerContent.classList.add('header-content');
        catalog.appendChild(headerContent);
        var img = document.createElement('img');
        img.setAttribute('src', song.images[2]['#text']);
        headerContent.appendChild(img);
        var headerInfo = document.createElement('div');
        headerInfo.classList.add('header-info');
        headerContent.appendChild(headerInfo);
        var artist = document.createElement('h2');
        artist.classList.add('artist');
        var textNode = document.createTextNode(song.artist);
        artist.appendChild(textNode);
        headerInfo.appendChild(artist);
        var songTitle = document.createElement('h3');
        songTitle.classList.add('song');
        textNode = document.createTextNode(song.song);
        songTitle.appendChild(textNode);
        headerInfo.appendChild(songTitle);
        var songContent = document.createElement('div');
        songContent.classList.add('song-content');
        catalog.appendChild(songContent);
        var songContentInner = document.createElement('div');
        songContentInner.classList.add('song-content-inner');
        songContent.appendChild(songContentInner);
        var listener = document.createElement('p');
        textNode = document.createTextNode('Listeners');
        listener.appendChild(textNode);
        songContentInner.appendChild(listener);
        var listenerCount = document.createElement('p');
        textNode = document.createTextNode(song.listeners);
        listenerCount.appendChild(textNode);
        songContentInner.appendChild(listenerCount);
        var songContentInner2 = document.createElement('div');
        songContentInner2.classList.add('song-content-inner');
        songContent.appendChild(songContentInner2);
        var playCount = document.createElement('p');
        textNode = document.createTextNode('Playcount');
        playCount.appendChild(textNode);
        songContentInner2.appendChild(playCount);
        var playCountNum = document.createElement('p');
        textNode = document.createTextNode(song.playcount);
        playCountNum.appendChild(textNode);
        songContentInner2.appendChild(playCountNum);
        var footer = document.createElement('div');
        footer.classList.add('footer');
        catalog.appendChild(footer);
        var gotoArtist = document.createElement('p');
        textNode = document.createTextNode('Goto Artist');
        gotoArtist.appendChild(textNode);
        footer.appendChild(gotoArtist);
        var arrowContainer = document.createElement('p');
        footer.appendChild(arrowContainer);
        var link = document.createElement('a');
        link.setAttribute('href', song.artistUrl);
        arrowContainer.appendChild(link);
        var arrow = document.createElement('i');
        arrow.setAttribute('aria-hidden', true);
        arrow.classList.add('fa');
        arrow.classList.add('fa-play');
        link.appendChild(arrow);



        // buildCatalog('catalog', 'div', ['catalog'], '','catalog-container','');
        // buildCatalog('headerContent', 'div', ['header-content'], '','catalog','');
        // buildCatalog('img', 'img', [''], '',header,[{name:'src', value: song.images[2]['#text']}]);
        



    }


    // {name:'src', value:'link'}

    // function buildCatalog(eleName ,eleType, cls, text, parentEle, attributes) {


    //     console.log(arguments);
        
    //     // // create element
    //     // if(eleType) {
    //     //     eleName = document.createElement(eleType);
    //     // }

    //     // //add classes to element
    //     // if(cls) {
    //     //    cls.forEach(function(val) {

    //     //        eleName.classList.add(val);
    //     //    })
    //     // }

    //     // // set attributes (array with objects)
    //     // if(attributes) {

    //     //     for(var i=0; i < attributes.length;i++) {
    //     //         eleName.setAttribute(attributes[i].name, attributes[i].value);
    //     //     }
    //     // }

    //     // // create text node and append to the parent element
    //     // if(text) {
    //     //    parentEle.appendChild(document.createTextNode(text)); 
    //     // }

    //     //  append to parent element
    //     // if(parentEle) {
    //     //     parentEle.appendChild(eleName);
    //     // }


    // }







  


    getData();





   




})(window);