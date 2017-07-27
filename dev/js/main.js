
window.addEventListener('load', function(){
    var INSTANCES = [
        "mstdn.guru",
        "mstdn.jp",
        "pawoo.net",
    ];

    var MSTDN_PICKER = 'mstdn_picker';
    var DUMMY_ID = 'dummy';

    var INSTANCE = document.getElementById('instance');
    var MAX_ID = document.getElementById('max_id');
    var SINCE_ID = document.getElementById('since_id');
    var GET_STATUS = document.getElementById('get_status');
    var STATUS_LIST = document.getElementById('status_list');
    var FILTER = document.getElementById('filter');

    var send_request = function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(this.readyState == 4){
                if(this.status == 200){
                    callback(this.response);
                }
            }
        };
        xhr.responseType = 'json';
        xhr.open('GET', url, true);
        xhr.send(null);
    };

    var try_getting_one_status = function(instance, id, callback){
        send_request(('https://' + instance + '/api/v1/statuses/' + id), callback);
    };

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
        var content = document.createElement('div');
        content.innerHTML = data.content;
        text.innerHTML = ('<a target="_blank" href="' + data.url + '">' + (0 < data.account.display_name.length ? data.account.display_name : '@' + data.account.username) + '</a>');
        text.innerHTML += ' ';
        text.innerHTML += '<span class="desc">(' + (new Date(data.created_at)) + ')</span>';
        text.innerHTML += data.content;
        status.dataset.id = data.id;
        status.dataset.content = content.innerText;
        status.dataset.display_name = data.account.display_name;
        status.dataset.username = data.account.username;
        status.dataset.created_at = (new Date(data.created_at)).getTime();
        status.classList.add('status-content');
        status.appendChild(avatar);
        status.appendChild(text);
        return status;
    };

    var get_status_sub = function(instance, id, max_id, since_id, reload, count){
        var url = 'https://' + instance + '/api/v1/timelines/public?local=true&max_id=' + max_id;
        send_request(url, function(response){
            var flag = true;
            var last_max_id = '';
            for (var i in response){
                count--;
                last_max_id = response[i].id;
                // prependChild
                STATUS_LIST.insertBefore(new_status(response[i]), STATUS_LIST.firstChild);
                if ((count <= 0) || (response[i].id == since_id)){
                    flag = false;
                    break;
                }
            }
            if (flag){
                get_status_sub(instance, id, last_max_id, since_id, reload, count);
            }
        });
    };

    var get_status = function(instance, id, max_id, since_id, reload){
        while (STATUS_LIST.firstChild){
            STATUS_LIST.removeChild(STATUS_LIST.firstChild);
        }
        if ((0 < instance.length) && (parseInt(since_id) < parseInt(max_id))){
            get_status_sub(instance, id, max_id, since_id, reload, 1000);
            return true;
        }
        else{
            return false;
        }
    };

    // initialize instance
    (function(){
        while (INSTANCE.firstChild){
            INSTANCE.removeChild(INSTANCE.firstChild);
        }
        for(var i in INSTANCES){
            var op = document.createElement('option');
            op.value = INSTANCES[i];
            op.innerText = INSTANCES[i];
            INSTANCE.appendChild(op);
        }
        INSTANCE.selectedIndex = 0;
    })();


    var href = document.location.href;
    var idx = href.indexOf('?');
    var id = DUMMY_ID;
    var reload = false;
    var instance = INSTANCE.options[INSTANCE.selectedIndex].value;
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
        get_status(instance, id, max_id, since_id, reload);
    }

    GET_STATUS.addEventListener('click', function(){
        if(!get_status(INSTANCE.options[INSTANCE.selectedIndex].value, id, MAX_ID.value, SINCE_ID.value, reload)){
            alert('Please input valid instance, since_id and max_id.');
        }
    });

    FILTER.addEventListener('keyup', function(){
        var es = STATUS_LIST.querySelectorAll('.status-content');
        for(var i in es){
            if(es[i].dataset != undefined){
                if((-1 != es[i].dataset.content.indexOf(FILTER.value))
                || (-1 != es[i].dataset.display_name.indexOf(FILTER.value))
                || (-1 != es[i].dataset.username.indexOf(FILTER.value))
                ){
                    es[i].classList.remove('status-hidden');
                }
                else{
                    es[i].classList.add('status-hidden');
                }
            }
        }
    });

    // add dummy status for test.
    for (var i = 0; i < 0; i++){
        STATUS_LIST.insertBefore(new_status({
            'url' : '',
            'account' : { 'display_name' : 'display_name.' + i, 'username' : 'username.' + i, },
            'created_at' : '',
            'content' : '<br/>content',
        }), STATUS_LIST.firstChild);
    }
});

