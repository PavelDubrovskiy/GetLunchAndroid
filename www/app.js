/*require.config({
paths: {
		handlebars: "lib/handlebars",
		text: "lib/text",
		hbs: "lib/hbs"
	},
	shim: {
		handlebars: {
			exports: "Handlebars"
		}
	}
});*/

define('app', ['js/router', 'js/m/user'], function(Router, User) {
	Router.init();
	var $ = Framework7.$;
	var user = new User();
	var f7 = new Framework7({
		modalTitle: ' ',
		swipeBackPage: false,
		panelsCloseByOutside: true,
		swipePanel: "left",
		
		pushState: true,
		swipeout: false,
		sortable: false,
		swipeBackPageBoxShadow: false,
		smartSelectBackTemplate: '<div class="left sliding"><a href="#" class="link icon-only back p_addreview_back"><i class="icon icon-arrow-back"></i><span></span></a></div>',
		smartSelectBackOnSelect: true
	});
	
	f7.allowPanelOpen = false;
	
	var mainView = f7.addView('.view-main', {
		dynamicNavbar: true
	});
	var config={
		source:'http://getlunch.ru'
	};
	var LoginFB = function(){
		try{
			facebookConnectPlugin.login(["email","user_friends"], 
				function (tmp) {
					console.log(tmp);					
					var data={token:tmp.authResponse.accessToken,provider:'fb',fb_exp:tmp.authResponse.expiresIn,user_id:tmp.authResponse.userID};
					console.log(data);
		            $.ajax({
						type: "POST",
						async: false,
						url: config.source+"/api/fbauth/",
						data: data,
						success: function(msg){
							if(msg!='error'){
								console.log(msg);
								LoginUser();
								user.setValues(JSON.parse(msg));
								ymaps.ready(function () {
									//mainView.loadPage('main.html');
									$('.back').click();
								});
							}else{
								forms.showMessage('Ошибка аутентификации', "error");
							}
						}
					});
				}, function(e){console.log(e);}
			);
		}catch(e){console.log(e);}
	}
	var LogoutFB = function(){
		$.ajax({
			type: "POST",
			async: false,
			url: config.source+"/api/socnetLogout/",
			data: {provider:'fb',code:user.code},
			success: function(msg){
				user.setValues(JSON.parse(msg));
			}
		});
	};
	var LoginVK = {
	    wwwref: false,
	    plugin_perms: "friends,wall,photos,offline,notes,email",
	    auth: function (force) {
	        if (!window.localStorage.getItem("plugin_vk_token") || force || window.localStorage.getItem("plugin_vk_perms")!=plugin_vk.plugin_perms) {
	            var authURL="https://oauth.vk.com/authorize?client_id=4532400&scope="+this.plugin_perms+"&redirect_uri=http://oauth.vk.com/blank.html&display=touch&response_type=token&v=5.25";
	            //var authURL="https://oauth.vk.com/authorize?client_id=4613296&scope="+this.plugin_perms+"&redirect_uri=http://oauth.vk.com/blank.html&display=touch&response_type=token&v=5.25";
	            this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
	            this.wwwref.addEventListener('loadstop', this.auth_event_url);
	        }
	    },
	    auth_event_url: function (event) {
	        var tmp=(event.url).split("#");
	        if (tmp[0]=='https://oauth.vk.com/blank.html' || tmp[0]=='http://oauth.vk.com/blank.html') {
	            LoginVK.wwwref.close();
	            var tmp=url_parser.get_args(tmp[1]);
	            var data={token:tmp['access_token'],provider:'vk',vk_exp:tmp['expires_in'],user_id:tmp['user_id'],email:tmp['email']};
	            if(user.code!='')data.code=user.code;
	            console.log(data);
	            $.ajax({
					type: "POST",
					async: false,
					url: config.source+"/api/fbauth/",
					data: data,
					success: function(msg){
						console.log(msg);
						if(msg!='"error"'){
							LoginUser();
							user.setValues(JSON.parse(msg));
							ymaps.ready(function () {
								//mainView.loadPage('main.html');
								$('.back').click();
							});
						}else{
							forms.showMessage('Ошибка аутентификации', "error");
						}
					}
				});
	        }
	    }
	};
	var LogoutVK = function(){
		$.ajax({
			type: "POST",
			async: false,
			url: config.source+"/api/socnetLogout/",
			data: {provider:'vk',code:user.code},
			success: function(msg){
				user.setValues(JSON.parse(msg));
			}
		});
	};
	var tryConnection = function(run) {
		var run=run || function(){};
		$.ajax({
			type: "POST",
			async: false,
			url: config.source+"/api/tryConnection/",
			success: function(msg){
				run();
			},
			error: function(error){
				app.f7.alert('Нет подключения к&nbsp;интернету или&nbsp;сервер не&nbsp;отвечает', "Ошибка!");
			}
		});
	}
	var GAPage = function(page) {
		var page=page || 'unknown';
		//console.log(page);
		try{
			gaPlugin.trackPage( function(){}, function(){}, page);
		}catch(e){}
	}
	var GAEvent = function(page,action,event) {
		var page=page || 'unknown page';
		var action=action || 'unknown action';
		var event=event || 'unknown event';
		//console.log(page+', '+action+', '+event);
		try{
			gaPlugin.trackEvent( function(){}, function(){}, page, action, event, 1);
		}catch(e){}
	}
	var LoginUser = function() {
		try{
			$('.app_exit span').text('Выход');
			$('.app_exit i').removeClass('icon-enter').addClass('icon-exit');
			$('.app_profile').show();
			$('.addreviewBtn').attr('href','addreview.html');
			$('.checkinBtn').attr('href','checkin.html');
		}catch(e){}
	}
	return {
		f7: f7,
		mainView: mainView,
		router: Router,
		config:config,
		latitude:0,
		longitude:0,
		interval:0,
		intervalCompass:0,
		firstEnter:true,
		firstMainLoad:true,
		firstMainTimeout:0,
		cardMultiRoute:'',
		enablePanel: function() {
			f7.allowPanelOpen = true;
		},
		disablePanel: function() {
			f7.allowPanelOpen = false;
		},		
		LoginFB:LoginFB,
		LogoutFB:LogoutFB,
		LoginVK:LoginVK,
		LogoutVK:LogoutVK,
		tryConnection:tryConnection,
		GAPage:GAPage,
		GAEvent:GAEvent,
		LoginUser:LoginUser
	};
});

var url_parser={
	get_args: function (s) {
	    var tmp=new Array();
	    s=(s.toString()).split('&');
	    for (var i in s) {
	        i=s[i].split("=");
	        tmp[(i[0])]=i[1];
	    }
	    return tmp;
	},
	get_args_cookie: function (s) {
	    var tmp=new Array();
	    s=(s.toString()).split('; ');
	    for (var i in s) {
	        i=s[i].split("=");
	        tmp[(i[0])]=i[1];
	    }
	    return tmp;
	}
};

// Расширение прототипа Function для упрощения передачи контекста в события	
Function.prototype.bind = function (scope) {
	var fn = this;
	return function () {
		return fn.apply(scope, arguments);
	};
};