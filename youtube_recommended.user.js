// ==UserScript==
// @name        Youtube recommended
// @namespace   youtube, recommended
// @description Удаление из рекомендуемого в пару кликов
// @include     https://www.youtube.com/*
// @version     2.1
// @grant       none
// @author      BaNru
// @license     GNU GPL v3
// ==/UserScript==

/* "Удалить всё" недописана
function removeall(list){
	[].forEach.call(list, function(list_el) {
		//if(list_el.style.visibility == "visible"){
			//list_el.querySelector('.yt-ui-menu-item.yt-uix-menu-close-on-select.dismiss-menu-choice').click();
			//removthisevent(list_el);
		//}
		if (document.querySelector('ytd-popup-container iron-dropdown') && document.querySelector('ytd-popup-container iron-dropdown').style.display !== "none"){
			document.querySelector('ytd-popup-container iron-dropdown').style.display = "none";
		}
		console.log(list_el.querySelector('button#button'))
		list_el.querySelector('button#button').click();
		removthisevent(list_el);
	});
}
*/

/* Удаляем элемент */
function removethis(el){
	// Хак на скрытие попапа, если вдруг пользователь открыл его ранее
	if (document.querySelector('ytd-popup-container iron-dropdown') && document.querySelector('ytd-popup-container iron-dropdown').style.display !== "none"){
		document.querySelector('ytd-popup-container iron-dropdown').style.display = "none";
	}
	var thisli = this.closest('ytd-grid-video-renderer,ytd-compact-video-renderer');
	thisli.querySelector('button#button').click();
	removthisevent(thisli);
}
function removthisevent(thisli){
	// Проверяем открытый попап
	if (document.querySelector('ytd-popup-container iron-dropdown') && document.querySelector('ytd-popup-container iron-dropdown').style.display !== "none"){
			// Нажимаем "Скрыть"
			document.querySelector('ytd-popup-container ytd-menu-service-item-renderer').click();
			// Нажимаем "почему нам это не интересно"
			// Включаем "я не тормоз, подождите" для нового тормозного интерфейса
			setTimeout(function(){
				thisli.querySelector('#dismissed ytd-button-renderer:last-child #button').click();
				// Ожидаем очередной попап
				setTimeout(function(){
					var popup = document.querySelector('ytd-popup-container'),
						form = document.querySelector('#reasons'),
						inputs = form.querySelectorAll('ytd-dismissal-reason-text-renderer');
						// Чекаем нужные пункты
						// inputs[0].querySelector('paper-checkbox').click(); // Я смотрю его не первый раз.
						// inputs[1].querySelector('paper-checkbox').click(); // Мне оно не понравилось.
						inputs[2].querySelector('paper-checkbox').click(); // Мне не интересен канал...
						// Отправляем форму
						setTimeout(function(){
							popup.querySelector('#submit').click();
							thisli.remove();
						},200);
				},200);
			},500);
	}
	// Иначе перезапускаем функцию после паузы
	else {
		setTimeout(function(){
			removthisevent(thisli);
		},500); // Время задержки
	}
}

/* Добавляем кнопки удаления */
function addBTN(parentel,el){
  if(el){
		var list = el.closest('#dismissable').querySelectorAll('ytd-grid-video-renderer');
	}else{
	var list = parentel.querySelectorAll('ytd-compact-video-renderer');
  }
	/*
	delall.onclick = function(){
		removeall(list);
	};
	*/
	[].forEach.call(list, function(list_el) {
		if(!list_el.querySelector('.remthis')){
			var remthis = document.createElement('div');
			remthis.textContent = 'Удалить';
			remthis.onclick = removethis;
			remthis.className = "remthis";
			list_el.insertBefore(remthis, list_el.children[0]);
		}
	});
};

/* Стили */
document.querySelector('body').insertAdjacentHTML('beforeend', '<style>.delall,.remthis{background-color:#008bec;color:#fff;cursor:pointer;font-size:12px;padding:2px 7px;z-index:2000;}.delall{margin:1px;float:right;}.remthis{margin:5px;position:absolute;display:block;}.delall:hover,.remthis:hover{background-color:#cb4437}</style>');


// Запускаем скрипт на главной
if(document.location.pathname == "/"){
  var titlelist = document.querySelectorAll('h2 span.style-scope.ytd-shelf-renderer');
  [].forEach.call(titlelist, function(el) {
	var title = el.textContent.trim();
	// Ищем Рекомендованные на главной
	if(title == "Рекомендованные"){
	  var parentel = el.closest('div.style-scope.ytd-shelf-renderer');
	  /* "Удалить всё" недописана
	  if(!parentel.querySelector('.delall')){
		var delall = document.createElement('span');
		delall.textContent = 'Удалить всё';
		delall.className = 'delall';
		parentel.appendChild(delall)
	  }
	  */
	  // Повторный перебор при щелчке "ещё"
	  el.closest('#dismissable').querySelector('#toggle').addEventListener("click", function(){
		addBTN(parentel,el)
	  });
	  addBTN(parentel,el);
	}
  });
}

// Запускаем скрипт на странице с видео
if(document.location.pathname.match(/^\/watch/)){
	// Принудительно сбросим счётчик через 10 сек, чтобы не мучать браузер, если что-то пойдёт не так
	var waitRecomendI = 0;
	// Включаем "я не тормоз, подождите" для тормозного интерфейса Ютуба
	let waitRecomend = setInterval(function(){
	waitRecomendI++;
	console.log(waitRecomendI);
	if(waitRecomendI == 20){
		console.log('STOP Youtube recommended');
		clearInterval(waitRecomend);
	}
	var parentel = document.querySelector('#related #items');
	if(parentel){
		clearInterval(waitRecomend);
		// Включаем ещё раз "я не тормоз, подождите" для тормозного интерфейса Ютуба
		setTimeout(function(){
			addBTN(parentel);
		// Увеличить число в 2-5 раз, если комп или интернет слишком медленный и не у всех видео появляется кнопка "удалить". 1000 = 1 сек
		},1000)
	}
  }, 500);
}
