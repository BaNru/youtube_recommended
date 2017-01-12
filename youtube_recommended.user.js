// ==UserScript==
// @name        Youtube recommended
// @namespace   youtube, recommended
// @description Удаление из рекомендуемого в пару кликов
// @include     https://www.youtube.com/
// @version     1
// @grant       none
// @author      BaNru
// @license     GNU GPL v3
// ==/UserScript==

function removeall(list){
	[].forEach.call(list, function(list_el) {
		if(list_el.style.visibility == "visible"){
			list_el.querySelector('.yt-ui-menu-item.yt-uix-menu-close-on-select.dismiss-menu-choice').click();
			removthisevent(list_el);
		}
	});
}

function removethis(el){
	var thisli = this.closest('.yt-shelf-grid-item');
	thisli.querySelector('.yt-ui-menu-item.yt-uix-menu-close-on-select.dismiss-menu-choice').click();
	removthisevent(thisli)
}

function removthisevent(thisli){
	setTimeout(function(){
		thisli.querySelector('.dismissal-follow-up-dialog-link').click();
		var joinkey = thisli.querySelector('.dismissal-follow-up-dialog-link').dataset.joinKey;
		thisli.querySelector('.dismissal-follow-up-dialog-link').click();
		
		var sendform = document.querySelector('button[data-join-key="'+joinkey+'"]');
		var form = sendform.closest('.yt-dialog-content');
		var inputs = form.querySelectorAll('input');
		
		//	inputs[0].checked = true; // Я смотрю его не первый раз.
		inputs[1].checked = true; // Мне оно не понравилось.
		inputs[2].checked = true; // Мне не интересен канал...
		
		sendform.disabled = false;
		sendform.click();
	},1000); // Время задержки
}

document.querySelector('body').insertAdjacentHTML('beforeend', '<style>.delall,.remthis{background-color:#008bec;color:#fff;cursor:pointer;font-size:12px;padding:2px 7px;z-index:999999999;}.delall{margin:1px;float:right;}.remthis{margin:5px;position:absolute;display:block;}.delall:hover,.remthis:hover{background-color:#cb4437}</style>');

var titlelist = document.querySelectorAll('.branded-page-module-title-text');
[].forEach.call(titlelist, function(el) {
	var title = el.textContent.trim();
	if(title == "Рекомендованные"){
		var parentel = el.closest('.shelf-title-row'),
			delall = document.createElement('span');
		delall.textContent = 'Удалить всё';
		delall.className = 'delall';
		parentel.appendChild(delall);
		var list = el.closest('.feed-item-dismissable').querySelectorAll('.yt-shelf-grid-item');

		delall.onclick = function(){
			removeall(list);
		};

		[].forEach.call(list, function(list_el) {
			var remthis = document.createElement('div');
			remthis.textContent = 'Удалить';
			remthis.onclick = removethis;
			remthis.className = "remthis";
			list_el.insertBefore(remthis, list_el.children[0]);
		});
	}
});