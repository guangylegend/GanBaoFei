'use strict';
/*
setInterval(function() {
	var fuckps = window.localStorage.getItem('speed');
	sendDirectScript("createjs.Ticker.setFPS(" + fuckps + ")");
}, 1000);
function sendDirectScript(scriptStr) {
	if ($("#tempSpeedScript").size() == 0) {
		$("<script>")
			.attr("id","tempSpeedScript")
			.appendTo("body");
	}
	$("#tempSpeedScript").html(scriptStr);
	$("#tempSpeedScript").remove();
}
*/

var Client = {
	raid: [],
	observers: [],
	start: function() {
		if (this._started) {
			return;
		}
		this.handleGeneral();
		console.log('client starting');
		this._started = true;
		window.addEventListener('hashchange', this);
		this.handleEvent();
		this.sendCommand({
			type: 'started'
		});
		window.addEventListener('_debug', function(evt) {
			console.log(evt.detail);
		});
	},

	handleEvent: function() {
		var hash = window.location.hash.replace('#', '');
		var a = hash.split('/');
		var id = '';
		if (Number(a[a.length - 1]) >= 0) {
			id = Number(a.pop());
			hash = a.join('/');
		}
		console.log(hash, id);
		if (a.length >= 3 && this['_handle_' + a[0] + '/' + a[1] + '/' + a[2]]) {
			this['_handle_' + a[0] + '/' + a[1] + '/' + a[2]](id);
		} else if (a.length >= 2 && this['_handle_' + a[0] + '/' + a[1]]) {
			this['_handle_' + a[0] + '/' + a[1]](id);
		} else if (this['_handle_' + a[0]]) {
			this['_handle_' + a[0]](id);
		} else {
			this['_handle_' + hash] && this['_handle_' + hash](id);
		}
		this.sendCommand({
			type: 'hashchange',
			data: a[0]
		})
	},
	handleGeneral: function() {
		window.addEventListener('DOMContentLoaded', function() {
			console.log(document.body.innerHTML);
		});
		document.addEventListener('click', function(evt) {
			var target, thumb = '';
			if (evt.target.dataset.questId) {
				target = evt.target;
				var img = target.querySelector('.img-quest');
				if (img) {
					thumb = img.src;
				}
			} else {
				target = $(evt.target).parents('[data-quest-id]');
				if (!target.length) {
					return;
				}
				target = target[0];
				var img = target.querySelector('.img-quest');
				if (img) {
					thumb = img.src;
				}
			}
			if (!target) {
				return;
			}
			var quest = target.dataset;
			var currentDatabase = window.localStorage.getItem('quest-database');
			if (!currentDatabase) {
				currentDatabase = {};
			} else {
				currentDatabase = JSON.parse(currentDatabase);
			}
			currentDatabase[quest.questId] = currentDatabase[quest.questId] || {};
			if (target.classList.contains('se-quest-start')) {
				currentDatabase[quest.questId].hash = window.location.hash.replace('#', '');
			} else {
				for (var key in quest) {
					if (quest[key]) {
						currentDatabase[quest.questId][key] = quest[key];
					}
				}
			}
			if (thumb) {
				currentDatabase[quest.questId].thumb = thumb;
			}
			window.localStorage.setItem('quest-database', JSON.stringify(currentDatabase));
			this.sendCommand({
				type: 'localStorage',
				data: window.localStorage
			})
		}.bind(this), true);
	},
	'_handle_item': function() {
		var self = this;

		if (window.localStorage.getItem('restore-action-point') !== 'true') {
			return;
		}
		window.localStorage.setItem('restore-action-point', 'false');
		this.waitUntilVisible('.lis-item').then(function() {
			return this.sleep(3);
		}.bind(this)).then(function() {
			this.click('.btn-item-tabs.items');
			return this.waitUntilVisible('.lis-item.btn-evolution-weapon');
		}.bind(this)).then(function() {
			console.log($('.lis-item.se'));
			this.click('.lis-item.se[data-index=1]');
			return this.waitUntilVisible('.btn-usual-use');
		}.bind(this)).then(function() {
			if(window.localStorage.getItem('use-full-red')){
				$('.use-item-num')[0].value = $('.use-item-num')[0].childElementCount;
				this.click('.btn-usual-use');
				this.sleep(2).then(function() {
					if (window.localStorage.getItem('raid-mode-watch-hell')=='true') {
						this.load('quest/extra/event');
					}
					else if(window.localStorage.getItem('star-watch-hell')=='true'){
						this.load('quest/extra');
					}
					else{
						this.load(window.localStorage.getItem('quest-id'));
					}
				}.bind(this));
			}
			else if(window.localStorage.getItem('use-red')){
				this.click('.btn-usual-use');
				this.sleep(3).then(function() {
					if (window.localStorage.getItem('raid-mode-watch-hell')=='true') {
						this.load('quest/extra/event');
					}
					else if(window.localStorage.getItem('star-watch-hell')=='true'){
						this.load('quest/extra');
					}
					else{
						this.load(window.localStorage.getItem('quest-id'));
					}
				}.bind(this));
			}
			else return;
		}.bind(this));


	},

	'_handle_quest/supporter/farm': function() {
		if (!this.isFarmingQuest()) {
			return;
		}
		this['_handle_quest/supporter']();
	},
	click: function(selector) {
		console.log('clicking ' + selector);
		this.sleep(1 + Math.random()).then(function() {
			window.localStorage.setItem('button-selector', selector);
			this.inject('inject/click_.js')
		}.bind(this));
	},
	load: function(hash) {
		console.log('loading ' + hash);
		this.sleep(Math.random()).then(function() {
			window.localStorage.setItem('_hash', hash);
			this.inject('inject/load_.js')
		}.bind(this));
	},
	'_handle_quest/extra/event': function () {
		//check if hell quest exists
		this.waitOnce('.btn-stage-detail').then(function () {
			if ($('.btn-stage-detail.ex-hell').length > 0) {
				console.log('hell quest found');
				window.localStorage.setItem('hell-quest-encountered', true);
				var hellQuestId = window.localStorage.getItem('hell-quest-id');
				if (hellQuestId !== null && hellQuestId !== '') {
					this.load(hellQuestId);
				}
			}
			else if(window.localStorage.getItem('quest-id') !== "") {
				window.localStorage.setItem('hell-quest-encountered', false);
				this.load(window.localStorage.getItem('quest-id'));
			}
		}.bind(this));
	},
	'_handle_quest/extra': function() {
        //check if hell quest exists
        this.waitOnce('.btn-stage-detail').then(function(){
            if ($('.ico-difficulty-8').length>0) {
                console.log('hell quest found');
								window.localStorage.setItem('star-hell-quest-encountered', true);
						}
						else if(window.localStorage.getItem('quest-id') !== "") {
                window.localStorage.setItem('star-hell-quest-encountered', false);
                this.load(window.localStorage.getItem('quest-id'));
            }
        }.bind(this));
    },

    // Auto skip farm battle - get item
    // Assume farm battle skip is ON

	'_handle_quest/stage': function() {
		this.waitUntilVisible('.btn-usual-ok').then(function() {
			this.click('.btn-usual-ok:eq(1)');
		}.bind(this));

		// old UI version

		/*
		this.waitOnce('.btn-command-forward').then(function() {
			this.click('.btn-command-forward');
			this.sleep(1).then(function() {
				if (window.location.hash.indexOf('stage') >= 0) {
					this['_handle_quest/stage']();
				}
			}.bind(this));
		}.bind(this));
		*/
	},


	'_handle_event': function() {
		if (this.isFarmingQuest() && window.location.hash !== '#' + window.localStorage.getItem('quest-id')) {
			this.load(window.localStorage.getItem('quest-id'));
		} else if (window.location.hash === '#' + window.localStorage.getItem('quest-id')) {
			this['_handle_quest/supporter']();
		} else if (window.localStorage.getItem('auto-medal') === 'true') {
			this.waitUntilVisible('.btn-medal.multi').then(function() {
				this.click('.btn-medal.multi');
			}.bind(this));
		}
	},

	getPreference: function(key) {
		return window.localStorage.getItem(key);
	},

	// Auto choose supporter by preference
	// three options: matrix. zeus, attribute

	chooseSupporterByPref: function() {
		if (window.localStorage.getItem('assistIsClick')) {
			window.localStorage.setItem('assistIsClick', 'true');
		}
		var prefs = [];
		var set_attribute = [];
		var matrix_summon = ['カグヤ','コロッサス・マグナ','リヴァイアサン・マグナ','ユグドラシル・マグナ','ティアマト・マグナ','シュヴァリエ・マグナ','セレスト・マグナ'];
		var zeus_summon = ['カグヤ','アグニス','ヴァルナ','ティターン','ゼピュロス','ゼウス','ハデス'];
		var attribute_summon = ['カグヤ','シヴァ','エウロペ','ゴッドガード・ブローディア','グリームニル','ルシフェル','バハムート'];
		set_attribute = window.localStorage.getItem('ptZokusei');

		if (this.getPreference('select') === 'true') {
			var select = window.localStorage.getItem('select-id');
			prefs.push(select);
		}

		var url = window.localStorage.getItem('quest-id');
		var bbc = setTimeout("remainTime()", 100 * 1000);


		if (this.getPreference('matrix') === 'true') {
			prefs.push(matrix_summon[set_attribute]);
		}
		else if (this.getPreference('zeus') === 'true') {
			prefs.push(zeus_summon[set_attribute]);
		}
		else if (this.getPreference('elementary') === 'true') {
			prefs.push(attribute_summon[set_attribute]);
		}

		if(set_attribute === '0'){
			prefs.push('ホワイトラビット');
			prefs.push('ブラックラビット');
		}


		// fixed issues with random select and suboptimal select
		// add sorting and optimize searching

		var button = '';
		var expected = prefs.some(function(summon) {
			var supporters = $('div.prt-supporter-summon:contains("' + summon + '")');

			if (supporters.length) {
				var candidates = [];
				supporters.each(function() {
					var str = this.parentNode.innerHTML;
					var findex = str.indexOf('が') + 1;
					var lindex = str.indexOf('UP') - 1;
					var s = str.substring(findex,lindex);
					candidates.push({
						id: this.parentNode.parentNode.parentNode.dataset.supporterUserId,
						attribute: this.parentNode.parentNode.parentNode.dataset.attribute,
						effectAmount: Number(s)
					});
				});
				candidates = candidates.sort(function(a, b) {
					return a.effectAmount < b.effectAmount;
				});


				var userID = candidates[0].id;
				var effectAmount = candidates[0].effectAmount;
				var attribute = candidates[0].attribute;
				// console.log('userID = ' + userID);
				// console.log(summon + ' ' + effectAmount);
				button = '[data-supporter-user-id="' + userID + '"][data-attribute="' + attribute + '"]';
				if (window.localStorage.getItem('assistIsClick')) {
					window.localStorage.setItem('assistIsClick', 'false');
				}
				return true;
			}
		}, this);

		if (!expected) {
			var candidates = [];

			var $summonSkills = $('.prt-summon-skill:visible');
			if (!$summonSkills.length) {
				$summonSkills = $('.btn-supporter .prt-summon-skill:visible');
			}
			$summonSkills.each(function() {
				console.log($(this));
				var match = $(this).text().match(/[\d]+/);
				if (match && match.length) {
					candidates.push({
						id: $(this).parents('.btn-supporter')[0].dataset.supporterUserId,
						attribute: $(this).parents('.btn-supporter')[0].dataset.attribute,
						effectAmount: Number(match[0])
					});
				}
			});
			candidates = candidates.sort(function(a, b) {
				return a.effectAmount < b.effectAmount;
			});
			button = '[data-supporter-user-id="' + candidates[0].id + '"][data-attribute="' + set_attribute + '"]';
			if (window.localStorage.getItem('assistIsClick')) {
				window.localStorage.setItem('assistIsClick', 'false');
			}
		}

		// click OK or solve AP scarce
		return this.sleep(2).then(function() {
			this.click(button);
			return this.waitOnce('.btn-usual-ok');
		}.bind(this)).then(function() {
			if (Number($('.txt-stamina-after').text()) < 0) {
				if (this.isFarmingQuest()) {
					window.localStorage.setItem('restore-action-point', true);
					this.load('item');
				}
				return Promise.resolve();
			}
			else{
				this.click('.btn-usual-ok');
				return this.waitUntilVisible('.btn-usual-ok').then(function() {
						this.click('.btn-usual-ok');
				}.bind(this));
			}
		}.bind(this));

	},

	'_handle_quest/supporter_raid': function() {
		var self = this;
		if (window.localStorage.getItem('autoSeachEx') === 'true') {
			var bbb = setInterval(function() {
				if ($('.btn-usual-ok').length == 1) {
					self.click(".btn-usual-ok");
				}
			}, 1000);
		}

		this['_handle_quest/supporter']();
	},
	'_handle_quest/supporter': function() {
		window.localStorage.setItem('oneSkill','true');
		if (window.localStorage.getItem('auto-choose-supporter') === 'false') {
			return;
		}
		 if (window.localStorage.getItem('raid-mode-watch-hell')==='true' && this.checkHellNoAuto()) {
            console.log('no auto hell choose supporter');
            return;
        }
		var self = this;
		if(window.localStorage.getItem('setTime') == 'true'){

			var bba = setInterval(function() {
				var timeStart = window.localStorage.getItem('timeStart');
				var timeEnd = window.localStorage.getItem('timeEnd');
				//escape null pointer
				if(timeStart == null){
					timeStart = '0000';
				}
				if(timeEnd == null){
					timeEnd = '0000';
				}
				var startHappyHourD = new Date();
				startHappyHourD.setHours(timeStart.substring(0, 2),timeStart.substring(2, 4),0);
				var endHappyHourD = new Date();
				endHappyHourD.setHours(timeEnd.substring(0, 2),timeEnd.substring(2, 4),0);
				//jump out once it is false
				if(window.localStorage.getItem('setTime') == 'false'){
					console.log('setTime ' + window.localStorage.getItem('setTime'));
					if (window.localStorage.getItem('assistIsClick')) {
						window.localStorage.setItem('assistIsClick', 'true');
					}
					self.waitUntilVisible('.btn-supporter').then(function() {
						self.chooseSupporterByPref();
					}.bind(self));
					clearInterval(bba);
				}
				var currentD = new Date();
				console.log('timeStart ' + timeStart.substring(0, 2) + ':' + timeStart.substring(2, 4));
				console.log('timeEnd ' + timeEnd.substring(0, 2) + ':' + timeEnd.substring(2, 4));
				console.log('currentD ' + currentD);
				if(currentD >= startHappyHourD && currentD < endHappyHourD ){
					console.log("yes! let's party");
					if (window.localStorage.getItem('assistIsClick')) {
						window.localStorage.setItem('assistIsClick', 'true');
					}
					self.waitUntilVisible('.btn-supporter').then(function() {
						self.chooseSupporterByPref();
					}.bind(self));
					clearInterval(bba);
				}else{
					console.log("no, sorry! please wait");
				}
			}, 5000);
		}else{
			if (window.localStorage.getItem('assistIsClick')) {
				window.localStorage.setItem('assistIsClick', 'true');
			}
			this.waitUntilVisible('.btn-supporter').then(function() {
				this.chooseSupporterByPref();
			}.bind(this));
		}
	},
	'_handle_raid': function() {
		Promise.race([this.waitUntilVisible('.prt-start-direction'), this.sleep(3)]).then(function() {

			console.log('ready to inject');
			this.inject('inject/engine.js');
		}.bind(this));
		this.waitOnce('[ability-name]').then(function() {
			var abilities = [];
			$('[ability-name]').each(function() {
				var a = $(this).attr('class').split(' ');
				var iconCls = a[0].replace('ico-ability', '');
				var posCls = a[1].replace('ability-character-num-', '');
				abilities.push({
					name: $(this).attr('ability-name'),
					position: posCls.split('-'),
					icon: iconCls,
					text: $(this).attr('text-data')
				})
			});
			this.sendCommand({
				type: 'abilities',
				data: abilities
			});
		}.bind(this));
	},
	'_handle_raid_multi': function() {
		this._handle_raid();
	},
	'_handle_quest/scene': function() {
		this.waitUntilVisible('.btn-skip').then(function() {
			this.click('.btn-skip');
			return this.waitUntilVisible('.btn-usual-ok');
		}.bind(this)).then(function() {
			this.click('.btn-usual-ok');
		}.bind(this));
	},
	'_handle_result_multi': function() {
		var self = this;
	    if (window.localStorage.getItem('coopraid') == 'true') {
			var bbc = setInterval(function() {
				if ($('.btn-control').length > 0) {
					self.click(".btn-control")
				} else if($('.btn-usual-close').length > 0){
					self.click(".btn-usual-close")
				}else if($('.btn-usual-ok').length > 0){
					self.click(".btn-usual-ok:eq(0)")

				}	 else {
					location.href = "http://"+window.location.host+"/#coopraid";
					clearInterval(bbc)
				}
			}, 2000)
		}
		if (window.localStorage.getItem('autoSeachEx') === 'true') {
			var bbc = setTimeout(function() {
				location.reload();
			}, 10000);
		}
		this._handle_result();
	},
	'_handle_result': function() {
		if (this.isFarmingQuest()) {
			console.log('farming quest result');
			var bbc = setInterval(function () {
				if ($('.btn-usual-ok').length > 0) {
					this.click(".btn-usual-ok");
				}
				else if (window.localStorage.getItem('raid-mode-watch-hell')==='true') {
          this.load('quest/extra/event');
					clearInterval(bbc);
        }
				else if (window.localStorage.getItem('star-watch-hell')==='true'){
					this.load('quest/extra');
					clearInterval(bbc);
				}
				else {
          this.load(window.localStorage.getItem('quest-id'));
					clearInterval(bbc);
				}
			}.bind(this), 2000)
			return;
		}
		this.change(function(mutations) {
			mutations.forEach(function(mutation) {
				if ($('div.prt-popup-header:contains("時限クエスト出現"):visible').length) {
					this.click('.btn-usual-close');
				}
				if (mutation.attributeName === 'class' && mutation.target === document.querySelector('.pop-usual')) {
					if ($('.btn-usual-ok').is(':visible')) {
						this.click('.btn-usual-ok');
					}
				}
				if (mutation.type === 'childList' && mutation.removedNodes.length && mutation.target === document.querySelector('#pop')) {
					if ($('.btn-control').is(':visible')) {
						this.click('.btn-control');
					}
				}
				if (mutation.attributeName === 'style' && mutation.target === document.querySelector('.btn-control')) {
					if ($('.btn-control').is(':visible') && !$('.btn-usual-ok').length) {
						this.click('.btn-control');
					}
				}
			}, this);
		}.bind(this));
	},
	waitUntilInvisible: function(selector) {
		return new Promise(function(resolve) {
			if (!$(selector).is(":visible")) {
				resolve();
				return;
			}
			this.invisibleObserver && this.invisibleObserver.disconnect();
			var self = this;
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (!$(selector).is(":visible")) {
						this.invisibleObserver && this.invisibleObserver.disconnect();
						resolve();
					}
				}, this);
			}.bind(this));

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: false
			});
			this.invisibleObserver = observer;
		}.bind(this));
	},
	waitUntilVisible: function(selector) {
		return new Promise(function(resolve) {
			if ($(selector).is(":visible")) {
				resolve();
				return;
			}
			this.visibleObserver && this.visibleObserver.disconnect();
			var self = this;
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if ($(selector).is(":visible")) {
						this.visibleObserver && this.visibleObserver.disconnect();
						resolve();
					}
				}, this);
			}.bind(this));

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: false
			});
			this.visibleObserver = observer;
		}.bind(this));
	},
	waitOnce: function(selector) {
		return new Promise(function(resolve) {
			if ($(selector).length) {
				console.log('found existing ' + selector);
				resolve();
				return;
			}
			this.onceObserver && this.onceObserver.disconnect();
			var self = this;
			var observer = new MutationObserver(function(mutations) {
				if ($(selector).length) {
					console.log('found ' + selector);
					this.onceObserver && this.onceObserver.disconnect();
					resolve();
				}
			}.bind(this));

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: false
			});
			this.onceObserver = observer;
		}.bind(this));
	},
	change: function(callback) {
		var self = this;
		var observer = new MutationObserver(function(mutations) {
			callback(mutations);
		}.bind(this));

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: false
		});
		this.observers.push(observer);
		return observer;
	},
	stop: function() {
		if (!this._started) {
			return;
		}
		console.log('client stopping');
		this._started = false;
		this.observer && this.observer.disconnect();
		this.observers && this.observers.forEach(function(o) {
			o.disconnect()
		});
		window.removeEventListener('hashchange', this);
		this.sendCommand({
			type: 'stopped'
		});
	},
	inject: function(file) {
		var s = document.createElement('script');
		s.src = chrome.extension.getURL(file);
		s.onload = function() {
			this.parentNode.removeChild(this);
		};
		(document.head || document.documentElement).appendChild(s);
	},
	sendCommand: function(command, callback) {
		chrome.extension.sendRequest(command, callback ||
		function() {});
	},
	sleep: function(sec) {
		return new Promise(function(resolve) {
			setTimeout(function() {
				resolve();
			}, sec * 1000)
		}.bind(this));
	},
	startFarmQuest: function() {
		var quest = window.localStorage.getItem('quest-id');
		this['_handle_' + quest] = this['_handle_quest/supporter/farm']
		this.load(quest);
	},
	stopFarmQuest: function() {},
	isFarmingQuest: function() {
		return window.localStorage.getItem('quest-id') !== '' && window.localStorage.getItem('quest-id') !== null;
	},
	checkHellNoAuto: function() {
        return window.localStorage.getItem('hell-quest-encountered')==='true' &&
            (window.localStorage.getItem('hell-quest-id')==='' || window.localStorage.getItem('hell-quest-id')===null);
    }
};


 window.alert = function(str){
	console.log("alert disable!")
  return ;
}



function remainTime() {
	console.log("3000 pass remainTime");
	var url = window.localStorage.getItem('quest-id');
	$('#stop').click;
	$('#quest-id').value = url;
	$('#start').click;
}


if (window.Extra) {
	for (var k in window.Extra) {
		Client[k] = Extra[k];
	}
}

var PrefObserver = {
	start: function() {
		var self = this;
		var port = chrome.runtime.connect({
			name: "sync"
		});
		self.port = port;
		port.onMessage.addListener(function(msg) {
			var storage = msg;
			console.log(msg);
			for (var key in msg) {
				if (window.localStorage.getItem(key) !== msg[key]) {
					window.localStorage.setItem(key, msg[key]);
					console.log('pref sync:', key, msg[key]);
					self['_observe_' + key] && self['_observe_' + key](msg[key]);
				}
			}
			self.toggleClient();
		});
	},
	postMessage: function(msg) {
		this.port && this.port.postMessage(msg);
	},
	'_observe_quest-id': function() {
		console.log('1');
		if (window.localStorage.getItem('quest-id')) {
			Client.startFarmQuest();
		} else {
			Client.stopFarmQuest();
		}
	},
	toggleClient: function() {
		if (window.localStorage.getItem('enabled') !== 'false') {
			Client.start();
		} else {
			Client.stop();
		}
	}
};

PrefObserver.start();
