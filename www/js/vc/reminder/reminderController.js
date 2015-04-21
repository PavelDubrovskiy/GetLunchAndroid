define(["app", "moment"], function(app, moment) {
	var $ = Framework7.$;
	
	function init(query) {
		var $input = $('#reminderTime'),
			$prompt = $('.b_reminder_prompt');
		//var time = moment().format('HH:mm:ss'); 
		//console.log(time);
		if( !$input.val() ){
			//$input.val(time);
			$input.focus();
			$prompt.show();
		}else{
			$prompt.remove();
		}
		
		$prompt.on('click', function() {
			$input.focus();
			$prompt.hide().remove();
		});
		$input.on('change', function() {
			if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
				$.ajax({
					type: "POST",
					async: false,
					url: app.config.source+"/api/pullGCM/",
					data: 'code='+pushNotificationGCMId+'&utime='+$input.val(),
					success: function(msg){
						alert(msg);
					}
				});
			}else {
				//ios api here
			}
		});
	}
	
	return {
		init: init
	};
});