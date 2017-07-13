
window.addEventListener('load', function(){
    var INPUT = document.getElementById('input');
    var OUTPUT = document.getElementById('output');
    var MAX_ID = document.getElementById('max_id');
    var SINCE_ID = document.getElementById('since_id');
    var GET_TOOTS = document.getElementById('get_toots');
    var TOOTS = document.getElementById('toots');

    var new_toot = function(data){
        var toot = document.createElement('tr');
        var img_td = document.createElement('td');
        var img = document.createElement('img');
        var text_td = document.createElement('td');
        var text = document.createElement('span');
        img.src = data.account.avatar;
        img.width = "80";
        img.height = "80";
        text.innerHTML = ('<a target="_blank" href="' + data.url + '">' + (0 < data.account.display_name.length ? data.account.display_name : '@' + data.account.username) + '</a>');
        text.innerHTML += ' ';
        text.innerHTML += '<span class="desc">(' + (new Date(data.created_at)) + ')</span>';
        text.innerHTML += '<br/>';
        text.innerHTML += data.content + '<br/>';
        img_td.appendChild(img);
        text_td.appendChild(text);
        toot.dataset.id = data.id;
        toot.dataset.created_at = (new Date(data.created_at)).getTime();
        toot.appendChild(img_td);
        toot.appendChild(text_td);
        return toot;
    };

    var get_toots_sub = function(max_id, since_id, count){
        if (0 < count){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    var flag = true;
                    var last_max_id = '';
                    for (var i in this.response){
                        count--;
                        last_max_id = this.response[i].id;
                        // prependChild
                        TOOTS.insertBefore(new_toot(this.response[i]), TOOTS.firstChild);
                        if (this.response[i].id == since_id){
                            flag = false;
                            break;
                        }
                    }
                    if (flag){
                        get_toots_sub(last_max_id, since_id, count);
                    }
                }
            };
            xhr.responseType = 'json';
            xhr.open('GET', 'https://mstdn.guru/api/v1/timelines/public?local=true&max_id=' + max_id, true);
            xhr.send();
        }
    };

    var get_toots = function(max_id, since_id){
        while (TOOTS.firstChild){
            TOOTS.removeChild(TOOTS.firstChild);
        }
        if ((SINCE_ID.value.length == 6) &&
            (MAX_ID.value.length == 6) &&
            (parseInt(SINCE_ID.value) < parseInt(MAX_ID.value))){

            INPUT.classList.add('hidden');
            OUTPUT.classList.remove('hidden');

            get_toots_sub(MAX_ID.value, SINCE_ID.value, 1000);

            return true;
        }
        else{
            return false;
        }
    };

    (function(){
        var href = document.location.href;
        var idx = href.indexOf('?');
        if (-1 != idx){
            var args = href.substr(idx + 1).split('&');
            for (var i in args){
                var xs = args[i].split('=');
                if (2 == xs.length){
                    switch (xs[0]){
                        case 'since_id':
                            SINCE_ID.value = xs[1];
                            break;
                        case 'max_id':
                            MAX_ID.value = xs[1];
                            break;
                    }
                }
            }
        }

        if(!get_toots(MAX_ID.value, SINCE_ID.value)){
            INPUT.classList.remove('hidden');
            OUTPUT.classList.add('hidden');
            GET_TOOTS.addEventListener('click', function(){
                if(!get_toots(MAX_ID.value, SINCE_ID.value)){
                    alert('since_idとmax_idを入力してください。');
                }
            });
        }
    })();
});

