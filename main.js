
window.addEventListener('load', function(){
    var TABLE = document.createElement('table');

    var TARGET = document.getElementById('target');
    var STATUS = document.getElementById('status');
    var OUTPUT = document.getElementById('output');
    var SELECTED_EP = document.getElementById('selected_ep');
    var ADD_NEW_TRACK = document.getElementById('add_new_track');
    var TITLE = document.getElementById('title');
    var TRACK = document.getElementById('track');
    var MAX_ID = document.getElementById('max_id');
    var SINCE_ID = document.getElementById('since_id');
    var DERAY_SEC = document.getElementById('deray_sec');

    var milkcocoa = MilkCocoa.connectWithApiKey('eggiylg1g4w.mlkcca.com', 'KOLKOKOOLLBOFOMA', 'XScHNHKCZIbLRImaInMaFenLlPLhnLIfhChABSWR');
    var ds = milkcocoa.dataStore('backspace.mstdn.guru');

    while (SELECTED_EP.firstChild){
        SELECTED_EP.removeChild(SELECTED_EP.firstChild);
    }

    ADD_NEW_TRACK.addEventListener('click', function(){
        ds.set(TITLE.value, {
            track: TRACK.value,
            max_id : MAX_ID.value,
            since_id : SINCE_ID.value,
            deray_sec : DERAY_SEC.value,
        }, function(){}, function(){});
    });

    ds.stream().next(function(err, xs){
        for (var i in xs){
            var op = document.createElement('option');
            op.innerText = xs[i].id;
            op.dataset.track = xs[i].value.track;
            op.dataset.max_id = xs[i].value.max_id;
            op.dataset.since_id = xs[i].value.since_id;
            op.dataset.deray_sec = xs[i].value.deray_sec;
            SELECTED_EP.appendChild(op);
        }
        OUTPUT.appendChild(TABLE);
        SELECTED_EP.selectedIndex = 0;
        SELECTED_EP.addEventListener('change', action_please_wait);
        action_please_wait();
    });

    var callback = function(duration, position){
        var first_toot = document.querySelector('.first_toot');
        var toots = document.querySelectorAll('.toot');
        for (var i in toots){
            if (toots[i].nodeName == 'TR'){
                var a = parseInt(first_toot.dataset.created_at);
                var b = parseInt(toots[i].dataset.created_at);
                var deray_sec = parseInt(toots[i].dataset.deray_sec);
                if ((b - a + deray_sec * 1000) < position){
                    toots[i].classList.remove('hidden');
                }
                else{
                    toots[i].classList.add('hidden');
                }
            }
        }
    };

    var action_please_wait = function(){
        var track = SELECTED_EP.options[SELECTED_EP.selectedIndex].dataset.track;
        var max_id = SELECTED_EP.options[SELECTED_EP.selectedIndex].dataset.max_id;
        var since_id = SELECTED_EP.options[SELECTED_EP.selectedIndex].dataset.since_id;
        var deray_sec = SELECTED_EP.options[SELECTED_EP.selectedIndex].dataset.deray_sec;

        STATUS.innerHTML = 'Please wait for getting the local timeline...';
        TARGET.src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + track + '&amp;color=ff5500';
        while (TABLE.firstChild){
            TABLE.removeChild(TABLE.firstChild);
        }
        f(max_id, since_id, 1000, deray_sec);
    };

    var action_ready = function(){
        var widget = SC.Widget(TARGET);
        widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(){
            widget.getDuration(function(duration){
                widget.getPosition(function(position){
                    callback(duration, position);
                });
            });
        });
        STATUS.innerHTML = 'OK';
    };

    var new_toot = function(data, isfirst, deray_sec){
        var toot = document.createElement('tr');
        var img_td = document.createElement('td');
        var img = document.createElement('img');
        var text_td = document.createElement('td');
        var text = document.createElement('span');
        img.src = data.account.avatar;
        img.width = "80";
        img.height = "80";
        text.innerHTML = '<a target="_blank" href="' + data.url + '">' + data.account.display_name + ' @' + data.account.username + '</a><br/>';
        text.innerHTML += (new Date(data.created_at)) + '<br/>';
        text.innerHTML += data.content + '<br/>';
        img_td.appendChild(img);
        text_td.appendChild(text);
        toot.dataset.id = data.id;
        toot.dataset.deray_sec = deray_sec;
        toot.dataset.created_at = (new Date(data.created_at)).getTime();
        toot.classList.add('toot');
        if (isfirst){
            toot.classList.add('first_toot');
        }
        toot.classList.add('hidden');
        toot.appendChild(img_td);
        toot.appendChild(text_td);
        return toot;
    };

    var f = function(max_id, since_id, count, deray_sec){
        if (0 < count){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    var flag = true;
                    var last_max_id = '';
                    for (var i in this.response){
                        var isfirst = (this.response[i].id == since_id);
                        count--;
                        last_max_id = this.response[i].id;
                        TABLE.appendChild(new_toot(this.response[i], isfirst, deray_sec));
                        if (isfirst){
                            flag = false;
                            break;
                        }
                    }
                    if (flag){
                        f(last_max_id, since_id, count, deray_sec);
                    }
                    else{
                        action_ready();
                    }
                }
            };
            xhr.responseType = 'json';
            xhr.open('GET', 'https://mstdn.guru/api/v1/timelines/public?local=true&max_id=' + max_id, true);
            xhr.send();
        }
    };
});

