define(["app", "js/vc/start/startView", "js/m/user", "js/utilities/fb"], function(app, view, User, fb) {
	var user = new User();
	var $ = Framework7.$;

	var bindings = [
		{
			element: '.p_start_facebook-login',
			event: 'click',
			handler: loginFacebook
		},{
			element: '.p_start_vk-login',
			event: 'click',
			handler: loginVK
		},{
			element: '.app_exit',
			event: 'click',
			handler: exitToStart
		}
	];
	
	app.watchID = navigator.geolocation.watchPosition(function(position){
			console.log('geo success from start');
			try{
				app.latitude=position.coords.latitude;
				app.longitude=position.coords.longitude;
			}catch(e){}
		}, 
		function(){console.log('geo fail from start');}, 
		{timeout: 9000, enableHighAccuracy: true}
	);
	
	try{
		var PushNoti = PushNotification.init({
		    android: {
		        senderID: "55:EE:12:92:FC:9A:1D:EF:AE:FC:75:A7:18:71:EC:0A:B4:A0:2C:03"
		    },
		    ios: {
		        alert: "true",
		        badge: "true",
		        sound: "true"
		    }
		});
		PushNoti.on('registration', function(data) {
			console.log("registration event");
			console.log(JSON.stringify(data));
			localStorage.setItem('pushRegistrationId',data.registrationId);
		});
		PushNoti.on('notification', function(data) {
	    	console.log("notification event");
	        console.log(JSON.stringify(data));
	        var cards = document.getElementById("cards");
	        var card = '<div class="row">' +
		  		  '<div class="col s12 m6">' +
				  '  <div class="card darken-1">' +
				  '    <div class="card-content black-text">' +
				  '      <span class="card-title black-text">' + data.title + '</span>' +
				  '      <p>' + data.message + '</p>' +
				  '    </div>' +
				  '  </div>' +
				  ' </div>' +
				  '</div>';
	        cards.innerHTML += card;
	        
	        PushNoti.finish(function () {
	            console.log('finish successfully called');
	        });
	    });
		PushNoti.on('error', function(e) {
	        console.log("push error");
	        console.log(e);
	    });
	}catch(e){console.log("PushNotification error:");console.log(e);}	
	
	function init(){
		app.tryConnection(function(){
			app.GAPage('/start/');
			if(localStorage.getItem('lunchesArray')!==null){
				var lunchesArray=JSON.parse(localStorage.getItem('lunchesArray'));
				for(key in lunchesArray){
					localStorage.removeItem('lunch'+lunchesArray[key]);
				}
				localStorage.removeItem('lunchesArray');
			}
			$('.b_logo').transitionEnd( function(){
				app.mainView.loadPage('main.html');
			});
			var user=JSON.parse(localStorage.getItem('User'));
			if(user){}
			else{
				$('.app_exit span').text('Вход');
				$('.app_exit i').removeClass('icon-exit').addClass('icon-enter');
				$('.app_profile').hide();
			}
		});
		view.render({
			bindings: bindings
		});
	}
	
	function loginFacebook (){
		app.LoginFB.auth(false);
	}
	
	function loginVK (){
		app.LoginVK.auth(false);
	}
	
	function exitToStart(){
		var CurrentUser=JSON.parse(localStorage.getItem('User'));
		if(CurrentUser){
			localStorage.clear();
			document.location.href='index.html';
		}else{
			app.mainView.loadPage('authorization.html');
		}
	}
	
	return {
		init: init
	};
});