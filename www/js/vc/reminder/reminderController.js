define(["app", "js/utilities/picker","js/utilities/forms"], function(app, picker, forms) {
	var $ = Framework7.$;
	var weekdays={mon:'monday',tue:'tuesday',wed:'wednesday',thu:'thursday',fri:'friday',sat:'saturday',sun:'sunday'};
	function init(query) {
		var $input = $('#reminderTime');
		var initTime=false;
		var $form = $('#reminderForm');
		var data=JSON.parse(localStorage.getItem('reminderForm'));
		if ($.isArray(data)==false){
			$.each(data, function(key, value){
				if($.isArray(value)){
					$form.find('input[name="'+key+'"]').each(function(){
						for(var i in value){	
							if($(this).val()==value[i]){
								$(this).prop('checked',true);
								$('.b_reminder_checkbox[data-val="'+value[i]+'"]').addClass('active');
							}
						}
					});
				}else{
					$form.find('input[name="'+key+'"]').val(value);
					initTime=value;
				}
			});
		}
		var timePicker = picker.createTimePicker('#reminderTime', '#reminderPicker', {
			minuteStep: 5,
			initTime: initTime
		});
		$('.p_reminder_submit').on('click', function(){
			var form = document.getElementById('reminderForm');
			var data=forms.serialize(form);
			var dataArr=forms.serialize(form,'array');			
			localStorage.setItem('reminderForm',JSON.stringify(dataArr));
			
			var user=JSON.parse(localStorage.getItem('User'));
			if(user)data+='&iuser='+user.id;			
			var pushRegistrationId=localStorage.getItem('pushRegistrationId');	
			
			console.log(dataArr);
			
			var every=0;
			if($.isArray(dataArr.weekly)) every='week';
			var firstAt=[];
			if($.isArray(dataArr['days[]'])){
				console.log(firstAt);   
				for(var i in dataArr['days[]']){
					firstAt.push(weekdays[dataArr['days[]'][i]]);
				}
			}
			firstAt.push(dataArr.time);
			console.log(firstAt);
			firstAt=firstAt.join('_');
			console.log(firstAt);
			
			try{
				cordova.plugins.notification.local.schedule({
				    //id: 1,
				    title: "GetLunch",
				    text: "Пора есть!",
				    at: firstAt,
				    every: every,
				    //sound: "file://sounds/reminder.mp3",
				    //icon: "http://icons.com/?cal_id=1",
				    //data: { meetingId:"123#fg8" }
				});
				forms.showMessage('Напоминание установлено!', 'success');
			}catch(e){		
				console.log(e);
				//console.log(data);
			}
		});
		$('.b_reminder_checkbox').on('click', function(){
			var $obj=$('#b_reminder_checkbox_'+$(this).data('val'));
			if($obj.prop('checked')==true){
				$obj.prop('checked',false);
				$(this).removeClass('active');
			}else{
				$obj.prop('checked',true);
				$(this).addClass('active');
			}
		});
	}
	return {
		init: init
	};
});