define(["app", "js/utilities/picker"], function(app, picker) {
	var $ = Framework7.$;
	
	function init(query) {
		var $input = $('#reminderTime');
		
		var timePicker = picker.createTimePicker('#reminderTime', '#reminderPicker', {
			minuteStep: 5
		});	
		
		$('.p_reminder_submit').on('click', function() {
			try{
				console.log($input.val());
				var data='utime='+$input.val()+'&urepeat='+$('#urepeat').val();
				var user=JSON.parse(localStorage.getItem('User'));
				if(user)data+='&iuser='+user.id;
				if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
					data+='&code='+pushNotificationGCMId;
					$.ajax({
						type: "POST",
						async: false,
						url: app.config.source+"/api/pullGCM/",
						data: data,
						success: function(msg){
							alert(msg);
						}
					});
				}else {
					$.ajax({
						type: "POST",
						async: false,
						url: app.config.source+"/api/pulliOS/",
						data: 'code='+pushNotificationGCMId+'&utime='+$input.val(),
						success: function(msg){
							alert(msg);
						}
					});
				}
			}catch(e){}
		});
	}
	
	return {
		init: init
	};
});