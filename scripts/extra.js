'use strict';
window.Extra = {
	'_handle_party/top/detail_weapon': function() {
		var a = window.location.hash.split('/');
		var id = a[a.length - 1];
		this.waitOnce('.txt-skill-level').then(function() {
			var t = $('.txt-skill-level').text();
			var level = t.split(' ')[1]
			window.localStorage.setItem(id, Number(level))
		}.bind(this))
	},
	'_handle_mypage': function() {
		console.log("111 = " + window.localStorage.getItem('seachEx-1'));
		var cc = setTimeout(function(){
			if (window.localStorage.getItem('coopraid') == 'true') {
				location.href = "http://"+window.location.host+"/#coopraid"
			}else if (window.localStorage.getItem('autoSeachEx') === 'true') {
				location.href = "http://"+window.location.host+"/#quest/assist"
			}
		},2000)


	},
	'_handle_result/empty': function() {
		var self = this;
		if (window.localStorage.getItem('raid-mode-watch-hell') == 'true') {
			location.href = "http://" + window.location.host + "/#" + "quest/extra/event";
		} else if(window.localStorage.getItem('star-watch-hell')=='true'){
			location.href = "http://"+window.location.host+"/#" + "quest/extra";
		} else if (window.localStorage.getItem('quest-id') != '') {
			location.href = "http://" + window.location.host + "/#" + window.localStorage.getItem('quest-id');
		}else if (window.localStorage.getItem('autoSeachEx') === 'true' ||window.localStorage.getItem("isParty")== 'true') {
			var bbc = setInterval(function() {
				if ($('.btn-control').length > 0) {
					self.click(".btn-control")
				} else if($('.btn-usual-close').length > 0){
					self.click(".btn-usual-close")
				}else if($('.btn-usual-ok').length > 0){
					self.click(".btn-usual-ok:eq(0)")
				}
				else
				{
					location.href = "http://"+window.location.host+"/#quest/assist";
					clearInterval(bbc)
				}
			}, 2000)
		} else if (window.localStorage.getItem('coopraid') == 'true') {
			var bbc = setInterval(function() {
				if ($('.btn-control').length > 0) {
					self.click(".btn-control")
				} else if($('.btn-usual-close').length > 0){
					self.click(".btn-usual-close")
				} else if($('.btn-usual-ok').length > 0){
					self.click(".btn-usual-ok:eq(0)")
				} else {
					location.href = "http://"+window.location.host+"/#coopraid";
					clearInterval(bbc)
				}
			}, 2000)
		}
	},
	'_handle_result_multi/empty': function() {
		var self = this;
		if (window.localStorage.getItem('autoSeachEx') === 'true') {
			var bbc = setInterval(function() {
				if ($('.btn-control').length > 0) {
					self.click(".btn-control")
				} else if($('.btn-usual-close').length > 0){
					self.click(".btn-usual-close")
				}else if($('.btn-usual-ok').length > 0){
					self.click(".btn-usual-ok:eq(0)")

				}
				else
				{
					location.href = "http://"+window.location.host+"/#quest/assist";
					clearInterval(bbc)
				}
			}, 2000)
		} else if (window.localStorage.getItem('coopraid') == 'true') {
			var bbc = setInterval(function() {
				if ($('.btn-control').length > 0) {
					self.click(".btn-control")
				} else if($('.btn-usual-close').length > 0){
					self.click(".btn-usual-close")
				} else if($('.btn-usual-ok').length > 0){
					self.click(".btn-usual-ok:eq(0)")

				} else {
					location.href = "http://"+window.location.host+"/#coopraid";
					clearInterval(bbc)
				}
			}, 2000)
		}
	},
	'_handle_quest': function() {
		var self = this;
		if (window.localStorage.getItem('coopraid') == 'true') {
			location.href = "http://"+window.location.host+"/#coopraid"
		}
		if (window.localStorage.getItem('autoSeachEx') === 'true') {
			var bbc = setInterval(function() {
				if ($('.btn-usual-ok').length > 0) {
					self.click(".btn-usual-ok:eq(0)")
				} else {
					location.href = "http://"+window.location.host+"/#quest/assist";
					clearInterval(bbc)
				}
			}, 2000)
		} else if (window.localStorage.getItem('quest-id') !== '' && window.localStorage.getItem('quest-id') !== null) {
			var bbc = setInterval(function() {
				if ($(".pop-show .prt-popup-header").length > 0) {
					self.click(".btn-usual-ok")
				}
			}, 1000)
		}
	},
	'_handle_quest/index': function() {
		var self = this;
		if (window.localStorage.getItem('coopraid') == 'true') {
			location.href = "http://"+window.location.host+"/#coopraid"
		} else if (window.localStorage.getItem('autoSeachEx') === 'true') {
			var bbc = setInterval(function() {
				if ($('.btn-usual-ok').length > 0) {
					self.click(".btn-usual-ok:eq(0)")
				} else {
					location.href = "http://"+window.location.host+"/#quest/assist";
					clearInterval(bbc)
				}
			}, 2000)
		}
	},
	'_handle_enhancement/weapon/material': function() {
		this.change(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.target !== document.querySelector('.skill1-level')) {
					return
				}
				var l = $('.btn-base-chenge')[0].dataset.locationHref;
				var a = l.split('/');
				var id = a[a.length - 1];
				window.localStorage.setItem(id, Number($('.skill1-level').text()))
			}, this)
		}.bind(this))
	},
	'_handle_enhancement/weapon/base': function() {
		this.parseSkillLevel()
	},
	'_handle_list': function() {
		this.parseSkillLevel()
	},
	parseSkillLevel: function() {
		this.change(function(mutations) {
			[].slice.call(document.querySelectorAll('.txt-status')).forEach(function(state) {
				var txt = state.textContent;
				if (txt.indexOf('SLv') >= 0) {
					txt = txt.replace('SLv', '')
				} else {
					return
				}
				window.localStorage.setItem(state.parentNode.parentNode.dataset.itemId, Number(txt))
			})
		}.bind(this))
	},
	'_handle_quest/assist/unclaimed': function() {
		if (window.localStorage.getItem('assistIsClick')) {
			window.localStorage.setItem('assistIsClick', 'true')
		}
		var self = this;
		var bbc = setInterval(function() {
			if ($('.btn-multi-raid ').length > 0) {
				self.click(".btn-multi-raid:eq(0)");
				clearInterval(bbc);
				if (window.localStorage.getItem('assistIsClick')) {
					window.localStorage.setItem('assistIsClick', 'false')
				}
			}
		}, 1000)
	},
	'_handle_quest/assist': function() {
		var self = this;
		var found = false;
		var isClick = false;
		var exLis = [];
		if (!window.localStorage.getItem('assistIsClick')) {
			window.localStorage.setItem('assistIsClick', 'false')
		}
		setTimeout(function() {
			window.localStorage.setItem('assistIsClick', 'false')
		}, 20000);
		if (window.localStorage.getItem('autoSeachEx') === 'true') {
			var bbe = setInterval(function() {
				if ($('.btn-post-key').length = 0) {
					self.click(".btn-tabs:eq(2)");
					clearInterval(bbe)
				}
			}, 1000);

			var searchName = window.localStorage.getItem('seachTwitter');
			var requesturl = "http://search.yahoo.co.jp/realtime/search?p=参加者募集+" + searchName + "&ei=UTF-8";
			var re = "";
			var bbdb = setInterval(function() {
				var htmlobj = $.ajax({
					url: requesturl,
					async: false
				});
				var str = htmlobj.responseText;
				//console.log("str========" + str)
				var getNext = str.indexOf(':参戦ID <em>') + 30;
				var NextStr = str.substring(getNext);
				var s = NextStr.indexOf(':参戦ID <em>') - 9;
				re = NextStr.substring(s,s+8);
				//var getNext = str.indexOf('ID：') + 30;
				//var NextStr = str.substring(getNext);
				//var s = NextStr.indexOf('ID：') + 3;

				//var e = NextStr.indexOf(' Lv');
				//re = NextStr.substring(s,s+10).replace('<em>','').replace('</em>','').split(' ').join('').replace('Lv100','').replace('Lv75','').replace('Lv120','');
				console.log("参战id=" + re)
				if (document.querySelector('.frm-battle-key')&&document.querySelector('.frm-battle-key').type == 'text') {
					document.querySelector('.frm-battle-key').value = re;
				}
				if ($('.btn-post-key').length > 0 && document.querySelector('.frm-battle-key').type == 'text') {
					self.click(".btn-post-key")
				}
			}, 2000);
			var bbb = setInterval(function() {
				console.log("isClick=" + window.localStorage.getItem('assistIsClick'));
				if ($('.btn-use-full').length > 0) {
					self.click(".btn-use-full:eq(1)")
				}
				if ($('.btn-usual-ok').length == 1) {
					self.click(".btn-usual-ok")
				}
			}, 1000);
			var bbf = setInterval(function() {
				if (document.querySelector('.frm-battle-key').type == 'password') {
					document.querySelector('.frm-battle-key').type = 'text';
					document.querySelector('.frm-battle-key').value = re;
					clearInterval(bbf)
				}
			}, 5000);
			var bbd = setTimeout(function() {
				if (window.localStorage.getItem('assistIsClick') == 'false') {
					window.location.reload()
				}
			}, 20000)
		}
	},
	'_handle_coopraid/room': function() {
		var self = this;
		var startRoom = setInterval(function(){
			if ($('.btn-use-full').length > 0) {
				var num = $('.use-item-num')[1].childElementCount;
				$('.btn-use-full')[1].setAttribute('data-use-num', num);
				$('.btn-use-full')[1].setAttribute('data-after-sp', '999');
				self.click(".btn-use-full:eq(1)")
			}
			if(!$(".btn-quest-start").length > 0){
				self.click(".btn-usual-ok")
			}
		},1000);

		if (window.localStorage.getItem('coopraid') == 'true') {
			var coopReloadTime = 10000;
			setTimeout(function() {
				window.location.reload()
			}, coopReloadTime)
		}

		var room = setInterval(function() {
			/*self.waitUntilVisible('.btn-make-ready-large.not-ready').then(function() {
				self.click('.btn-make-ready-large.not-ready')
			}.bind(self));*/
			self.waitUntilVisible('.btn-execute-ready.se-ok').then(function() {
				self.click('.btn-execute-ready.se-ok')
			}.bind(self));
			self.waitUntilVisible('.btn-quest-start.se-quest-start').then(function() {
				self.click('.btn-quest-start.se-quest-start')
			}.bind(self))
		}, 1000)
	}
}
