
window.addEventListener('load', function(){
    var INSTANCES = [
        "mstdn.guru",
    ];

    var MSTDN_PICKER = 'mstdn_picker';
    var LATEST_ID = 'latest';

    var INPUT = document.getElementById('input');
    var OUTPUT = document.getElementById('output');
    var INSTANCE = document.getElementById('instance');
    var MAX_ID = document.getElementById('max_id');
    var SINCE_ID = document.getElementById('since_id');
    var GET_STATUS = document.getElementById('get_status');

    var STATUS_HEADER = document.getElementById('status_header');
    var STATUS_LIST = document.getElementById('status_list');

    var new_avatar = function(data){
        var avatar = document.createElement('div');
        avatar.style.backgroundImage = 'url(' + data.account.avatar + ')';
        avatar.classList.add('status-avatar');
        return avatar;
    };

    var new_status = function(data){
        var status = document.createElement('div');
        var avatar = new_avatar(data);
        var text = document.createElement('div');
        text.innerHTML = ('<a target="_blank" href="' + data.url + '">' + (0 < data.account.display_name.length ? data.account.display_name : '@' + data.account.username) + '</a>');
        text.innerHTML += ' ';
        text.innerHTML += '<span class="desc">(' + (new Date(data.created_at)) + ')</span>';
        text.innerHTML += data.content;
        status.dataset.id = data.id;
        status.dataset.created_at = (new Date(data.created_at)).getTime();
        status.classList.add('status-content');
        status.appendChild(avatar);
        status.appendChild(text);
        return status;
    };

    var cleanup_storage = function(storage, instance, id){
        var CACHED_INSTANCE_COUNT = 3;

        // check keys
        var cnt = 0;
        var temp = {};
        for (var i in INSTANCES){
            temp[INSTANCES[i]] = storage[INSTANCES[i]];
            if ((typeof temp[INSTANCES[i]]) != (typeof {})){
                temp[INSTANCES[i]] = {};
            }
            if(0 < Object.keys(temp[INSTANCES[i]]).length){
                cnt++;
            }
            if(CACHED_INSTANCE_COUNT - 1 < cnt){
                temp[INSTANCES[i]] = {};
            }
        }
        storage = temp;

        // remove the others.
        storage[instance] = {};
        storage[instance][id] = OUTPUT.innerHTML;
        localStorage.setItem(MSTDN_PICKER, JSON.stringify(storage));
    };

    var get_status_sub = function(instance, id, max_id, since_id, reload, count){
        var url = 'https://' + instance + '/api/v1/timelines/public?local=true&max_id=' + max_id;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if (this.status == 200) {
                if (this.readyState == 4){
                    var flag = true;
                    var last_max_id = '';
                    for (var i in this.response){
                        count--;
                        last_max_id = this.response[i].id;
                        // prependChild
                        STATUS_LIST.insertBefore(new_status(this.response[i]), STATUS_LIST.firstChild);
                        if ((count <= 0) || (this.response[i].id == since_id)){
                            flag = false;
                            break;
                        }
                    }
                    if (flag){
                        get_status_sub(instance, id, last_max_id, since_id, reload, count);
                    }
                    else{
                        if ((0 < instance.length) && (LATEST_ID != id)){
                            if (localStorage != undefined){
                                var storage = localStorage.getItem(MSTDN_PICKER);
                                if (storage == null){
                                    storage = {};
                                }
                                else{
                                    storage = JSON.parse(storage);
                                }

                                cleanup_storage(storage, instance, id);

                                console.log('save to localStorage.' + MSTDN_PICKER + '.' + instance + '.' + id);
                            }
                        }
                    }
                }
            }
            else if(this.status == 0){
                // nop
            }
            else{
                var html = '<div class="error-message">';
                html += 'インスタンスの接続に失敗しました。';
                html += '</div>';
                html += '<div class="error-args">';
                html += 'version: "' + document.title + '"<br/>';
                html += 'url: "' + url + '"<br/>';
                html += 'instance: "' + instance + '"<br/>';
                html += 'id: "' + id + '"<br/>';
                html += 'max_id: "' + max_id + '"<br/>';
                html += 'since_id: "' + since_id + '"<br/>';
                html += 'reload: "' + reload + '"<br/>';
                html += 'count: "' + count + '"<br/>';
                html += 'status: "' + this.status + '"<br/>';
                html += '</div>';
                OUTPUT.innerHTML = html;
            }
        };
        xhr.responseType = 'json';
        xhr.open('GET', url, true);
        xhr.send();
    };

    var get_status = function(instance, id, max_id, since_id, reload){
        while (STATUS_LIST.firstChild){
            STATUS_LIST.removeChild(STATUS_LIST.firstChild);
        }
        if ((0 < instance.length) &&
            (since_id.length == 6) &&
            (max_id.length == 6) &&
            (parseInt(since_id) < parseInt(max_id))){

            INPUT.classList.add('hidden');
            OUTPUT.classList.remove('hidden');

            var cached_local = false;
            if (!reload){
                if ((0 < instance.length) && (LATEST_ID != id)){
                    if (localStorage != undefined){
                        var storage = localStorage.getItem(MSTDN_PICKER);
                        if (storage != null){
                            var storage = JSON.parse(storage);
                            if (storage[instance] != undefined){
                                if (storage[instance][id] != undefined){
                                    cached_local = true;
                                    OUTPUT.innerHTML = storage[instance][id];
                                    console.log('load from localStorage.' + MSTDN_PICKER + '.' + instance + '.' + id);

                                    cleanup_storage(storage, instance, id);
                                }
                            }
                        }
                    }
                }
            }
            if (!cached_local){
                get_status_sub(instance, id, max_id, since_id, reload, 1000);
            }

            return true;
        }
        else{
            return false;
        }
    };

    var init_instance = function(){
        while (INSTANCE.firstChild){
            INSTANCE.removeChild(INSTANCE.firstChild);
        }
        for(var i in INSTANCES){
            var op = document.createElement('option');
            op.value = INSTANCES[i];
            op.innerText = INSTANCES[i];
            INSTANCE.appendChild(op);
        }
    };

    (function(){
        var href = document.location.href;
        var anchor = href;
        var idx = href.indexOf('?');
        var id = LATEST_ID;
        var reload = false;
        var instance = INSTANCE.value;
        var since_id = SINCE_ID.value;
        var max_id = MAX_ID.value;

        if (-1 != idx){
            var args = href.substr(idx + 1).split('&');
            for (var i in args){
                var xs = args[i].split('=');
                if (2 == xs.length){
                    switch (xs[0]){
                        case 'instance':
                            if (-1 != INSTANCES.indexOf(xs[1])){
                                instance = xs[1];
                            }
                            break;
                        case 'since_id':
                            since_id = xs[1];
                            break;
                        case 'max_id':
                            max_id = xs[1];
                            break;
                        case 'id':
                            id = decodeURIComponent(xs[1]);
                            break;
                        case 'reload':
                            reload = (xs[1] == 'true');
                            break;
                    }
                }
            }
            anchor = href.substr(0, idx);
        }

        STATUS_HEADER.innerHTML = '<a href="' + anchor + '">&lt;&lt;</a> 過去ログ (' + id + ')';

        if(!get_status(instance, id, max_id, since_id, reload)){
            init_instance();
            INPUT.classList.remove('hidden');
            OUTPUT.classList.add('hidden');
            GET_STATUS.addEventListener('click', function(){
                if(!get_status(INSTANCE.value, id, MAX_ID.value, SINCE_ID.value, reload)){
                    alert('since_idとmax_idを入力してください。');
                }
            });
        }
    })();
});

