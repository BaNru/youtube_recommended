// ==UserScript==
// @name        Youtube recommended
// @namespace   youtube, recommended
// @description Удаление из рекомендуемого в пару кликов
// @include     https://www.youtube.com/*
// @version     3.1
// @grant       none
// @author      BaNru
// @license     GNU GPL v3
// ==/UserScript==

/* "Удалить всё" недописана
function removeall(list){
	[].forEach.call(list, function(list_el) {
		//if(list_el.style.visibility == "visible"){
			//list_el.querySelector('.yt-ui-menu-item.yt-uix-menu-close-on-select.dismiss-menu-choice').click();
			//removethisevent(list_el);
		//}
		if (document.querySelector('ytd-popup-container iron-dropdown') && document.querySelector('ytd-popup-container iron-dropdown').style.display !== "none"){
			document.querySelector('ytd-popup-container iron-dropdown').style.display = "none";
		}
		console.log(list_el.querySelector('button#button'))
		list_el.querySelector('button#button').click();
		removethisevent(list_el);
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
	removethisevent(thisli);
}
/* Удалить */
function removethisevent(thisli){
	// Проверяем открытый попап
	if (document.querySelector('ytd-popup-container iron-dropdown') && document.querySelector('ytd-popup-container iron-dropdown').style.display !== "none"){
			// Нажимаем "Скрыть"
			document.querySelectorAll('ytd-popup-container ytd-menu-service-item-renderer')[3].click();
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
						inputs[1].querySelector('paper-checkbox').click(); // Мне оно не понравилось.
						// inputs[2].querySelector('paper-checkbox').click(); // Мне не интересен канал...
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
			removethisevent(thisli);
		},500); // Время задержки
	}
}
/* Удаляем элемент */
function spamthis(el){
  console.log(el);
	// Хак на скрытие попапа, если вдруг пользователь открыл его ранее
	if (document.querySelector('ytd-popup-container iron-dropdown') && document.querySelector('ytd-popup-container iron-dropdown').style.display !== "none"){
		document.querySelector('ytd-popup-container iron-dropdown').style.display = "none";
	}
	var thisli = this.closest('ytd-grid-video-renderer,ytd-compact-video-renderer');
	thisli.querySelector('button#button').click();
	spamthisevent(thisli);
}
/* В спам */
function spamthisevent(thisli){
	// Проверяем открытый попап
	if (document.querySelector('ytd-popup-container iron-dropdown') && document.querySelector('ytd-popup-container iron-dropdown').style.display !== "none"){
			// Нажимаем "Пожаловаться"
			document.querySelectorAll('ytd-popup-container ytd-menu-service-item-renderer')[4].click();
			// Нажимаем почему дерьмо надо заблокировать
			// Включаем "я не тормоз, подождите" для нового тормозного интерфейса
			setTimeout(function(){
				// Ожидаем попап
				setTimeout(function(){
					var popup = document.querySelector('yt-report-form-modal-renderer'),
						inputs = popup.querySelectorAll('paper-radio-button');
						// Чекаем нужный пункт (только один пункт!)
            // inputs[0].querySelector('paper-checkbox').click(); // Материалы сексуального характера
            // inputs[1].querySelector('paper-checkbox').click(); // Жестокие или отталкивающие сцены
            // inputs[2].querySelector('paper-checkbox').click(); // Оскорбления или проявления нетерпимости
            // inputs[3].querySelector('paper-checkbox').click(); // Вредные или опасные действия
            inputs[4].click(); // Спам или введение в заблуждение
						// Отправляем форму
						setTimeout(function(){
							popup.querySelector('#submit-button').click();
							thisli.remove();
						},200);
				},200);
			},500);
	}
  // Иначе перезапускаем функцию после паузы
	else {
		setTimeout(function(){
			spamthisevent(thisli);
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
    if(!list_el.querySelector('.spamthis')){
      var spamthisBTN = document.createElement('div');
			spamthisBTN.textContent = 'Спам';
			spamthisBTN.onclick = spamthis;
			spamthisBTN.className = "spamthis";
			list_el.insertBefore(spamthisBTN, list_el.children[0]);
    }
	});
};

/* Стили */
document.querySelector('body').insertAdjacentHTML('beforeend', `<style>
	.delall,.remthis,.spamthis{background-color:#008bec;color:#fff;cursor:pointer;font-size:12px;padding:2px 7px;z-index:2000;}
	.delall{margin:1px;float:right;}
	.remthis,.spamthis{margin:5px;position:absolute;display:block;}
	.delall:hover,.remthis:hover{background-color:#cb4437}
	.spamthis{left:65px;background-color:#cb4437;}
	.spamthis:hover{background-color:#262626;}
	.reloadYR{opacity:0.2;position:fixed;right:0;bottom:0;width:16px;height:16px;background-color:#cb4437;z-index:10;
		font-size:12px;text-align:center;line-height:14px;color:#fff;border-radius:12px 0 0 0;padding:2px 0 0 6px;cursor:pointer;}
	.reloadYR:hover{opacity:1;}
</style>`);


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

  var reloadBTN = document.createElement('span');
  reloadBTN.textContent = '⟳';
  reloadBTN.onclick = function(){
  	document.querySelector('ytd-popup-container').style.visibility = 'hidden';
    addBTN(document.querySelector('#related #items'));
  };
  reloadBTN.className = "reloadYR";
  var head = document.body;
  head.insertBefore(reloadBTN, head.children[1]);
}
