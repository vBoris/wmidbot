var status_obj;
var status = 0;
var n = 0;
var interval;
var mans_invite = [];
var blist = [];
var online = [];
var stor = 1;

$('head').append('<style>#chat_act .message {height:11px!important;} #online-opponents { top:72px!important;} #snd_a_man { height:14px; position: absolute; left: 8px; top: 144px; z-index: 999; border: solid 1px #ccc; padding: 8px; background: #fff; width: 244px; overflow: hidden; bottom:auto; height:14px;} #snd_a_man a {font-family: tahoma; color: #5685d5;} #snd_a_man a:hove{ text-decoration: none;} #sending_list, #sending_list li { padding:0; margin:0; list-style: none;} #sending_list { border: solid 1px #ccc; overflow: auto; height:90%; } #sending_list li { padding: 2px 5px; border-bottom: solid 1px #ccc; color:#5685d5;cursor: pointer;} #sending_list li:hover { background:#5685d5;color:#fff;}</style>');
/*$('#translate').show();
$('#translate input[type="submit"]').css({ width: '112px', height: '27px', background: '#26ade4', textIndent: '0', lineHeight: 'auto', marginRight: '20px', fontWeight: 'bold', color: '#fff', borderRadius: '10px'}).val('WMID Translate');
$('#translate .popup').hide();*/
function translb(sel){
	$(sel).after('<a href="javascript:void(0)" id="wmid_trans" style="width:112px; height: 27px; background: #26ade4; textIndent: 0; lineHeight: auto; marginRight: 20px; fontWeight: bold; color: #fff; borderRadius: 10px">WMID Translate</a>')
}
$(function(){
	$('#wmid_trans').click(function(){
		$.getJSON('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20140925T082047Z.5055d7e52197b592.bda3ad29dbb6a6aa6d19098d6e9748aca550221e&text='+$('#message').val()+'?&lang=en',function(s){
			if(s.code==200) $('#message').val(s.text);
		});
	});
});
translb('#translate');

function strt(request){
			var postlist = [];
			var obj = status_obj = request.object[0];
			if(obj.speed==0){
				var speed = 3000;
			}else if(obj.speed==1){
				var speed = 1500;
			}else if(obj.speed==2){
				var speed = 500;
			}
			var online_l = JSON.parse(localStorage['online']);
			if(obj.list==0){
				postlist = online_l;
			}else if(obj.list==1){
				postlist = [];
				var postlist = JSON.parse(localStorage['contacts']);
			}else if(obj.list==2){
				postlist = [];
				var pisal_l = JSON.parse(localStorage['pisal_list'+$.cookie('user_id')]);
				$.each(pisal_l,function(i,v){
					$.each(online_l,function(index,val){
						if(v==val['id_pub']){
							postlist.push(val);
						}
					});
				});
			}
			var loc_b = localStorage['blist'+$.cookie('user_id')];
			var loc_blist = [];
			if(loc_b){ loc_blist = JSON.parse(loc_b);}
			console.log(obj);
			//$('#snd_a_man').css({'bottom':0,'height':'auto'});
			interval = setInterval(function(){
				if(postlist[n]){
					if(postlist[n].age>=(obj.age_from-0)&&postlist[n].age<=(obj.age_to-0)){
						console.log(postlist[n].country);
					//if((postlist[n].country==obj.country)||obj.country==0){
						var message = obj.message.split('{name}').join(postlist[n].name).split('{age}').join(postlist[n].age);
						
						var chat_act = localStorage['chat_act'];
						if(chat_act){ chat_act = JSON.parse(chat_act);}else{ chat_act = [];}
						if(postlist[n].id!=6){
						if(loc_blist.join().search(postlist[n].id_pub) == -1){
						if((obj.vip==1&&postlist[n].vip==true)||obj.vip==0){
						if((obj.fake==1&&postlist[n].photo==true)||obj.fake==0){
						if(chat_act.join().search(postlist[n].id) == -1){
						if(obj.message.split('@').length==1){
						if(obj.message.split('://').length==1&&obj.message.split('.com').length==1&&obj.message.split('.ua').length==1&&obj.message.split('.net').length==1&&obj.message.split('.ru').length==1){
							console.log(message);
							if(window.location.host.indexOf('m.svadba.com') > -1){
								$.post("http://m.svadba.com/chat-with/"+postlist[n].id+"/message",{message:message},function(d){});
							}else{
								$.post("http://www.svadba.com/chat/send-message/"+postlist[n].id,{tag:postlist[n].id,source:'lc',message:message},function(d){});
								$('#sending_list').prepend('<li onclick="javascript:window.location.href=\'http://www.svadba.com/chat/#/'+postlist[n].id+'\'">'+postlist[n].name+' (ID:'+postlist[n].id_pub+')</li>');
							}
						}else{ 
							clearInterval(interval);
							status = 0;
							n = 0;
							stor = 1;
							console.log('stop');
							alert('Вы хотите рассылать ссылку! Это запрещено!');
						}
						}else{ 
							clearInterval(interval);
							status = 0;
							n = 0;
							stor = 1;
							console.log('stop');
							alert('Вы хотите рассылать Email! Это запрещено!');
						}
						}
						}
						}
						}
						}
					}
					//}
					n +=1;
					status = 1;
					$('#count_send').text('Отослано: '+n+' из '+postlist.length+'');
				}else{
					clearInterval(interval);
					status = 0;
					n = 0;
					stor = 1;
					console.log('stop');
				}
			},speed);
}
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	switch(request.command){
		case 'get_invites':
			sendResponse({mans:mans_invite});
			mans_invite = [];
		break;
		case 'get_man':
			window.location.href = '#/'+request.object;
		break;
		case 'set_online':
			localStorage.setItem('online',request.object);
		break;
		case 'get_online':
			sendResponse({online:localStorage['online']});
		break;
		case 'set_contacts':
			localStorage.setItem('contacts',request.object);
		break;
		case 'get_contacts':
			sendResponse({contacts:localStorage['contacts']});
		break;
		case 'set_pisal':
			if(request.object){
				var pisal = request.object.split(',');
				var pi_arr = [];
				if(localStorage['pisal_list'+$.cookie('user_id')]){
					pi_arr = JSON.parse(localStorage['pisal_list'+$.cookie('user_id')]);
				}
				if(pisal.length>0){
					console.log(pi_arr);
					$.each(pisal,function(i,v){
						if(pi_arr.join().search($.trim(v)) == -1){
							pi_arr.push($.trim(v));
						}
					});
					localStorage.setItem('pisal_list'+$.cookie('user_id'),JSON.stringify(pi_arr));
				}
			}
		break;
		case 'get_pisal':
			sendResponse({pisal:localStorage['pisal_list'+$.cookie('user_id')]});
		break;
		case 'rem_pisal':
			var pisal = JSON.parse(request.object);
			if(localStorage['pisal_list'+$.cookie('user_id')]){
				var lac_pisal = JSON.parse(localStorage['pisal_list'+$.cookie('user_id')]);
				var pi_arr = [];
				$.each(lac_pisal,function(i,v){
					if(pisal.join().search($.trim(v)) == -1){
						pi_arr.push($.trim(v));
					}
				});
				localStorage.setItem('pisal_list'+$.cookie('user_id'),JSON.stringify(pi_arr));
			}
		break;
		case 'set_emul':
		console.log(request.object);
			if(request.object=='mobile'){
				window.location.href = 'http://m.svadba.com/';
			}else{
				window.location.href = 'http://www.svadba.com/chat/';
			}
		break;
		case 'get_user': 
			if(window.location.host=='m.svadba.com'){
				sendResponse({user: $.cookie('user_id')});  
			}else{
				$.cookie('user_id', $('#user-info p:eq(1)').text(), { domain: '.svadba.com', path: '/' });
				sendResponse({user: $('#user-info p:eq(1)').text()});
			}
			
			
		break;
		case 'start_send': 
			stor = 0;
			status = 1;
			strt(request);
		break;
		case 'end_send': 
			clearInterval(interval);
			status = 0;
			stor = 1;
			console.log('stop');
		break;
		case 'get_status':
			sendResponse({status: status,statusobj:status_obj});
		break; 
		case 'add_blist':
			if(request.object){
				var blist = request.object.split(',');
				var pi_arr = [];
				if(localStorage['blist'+$.cookie('user_id')]){
					pi_arr = JSON.parse(localStorage['blist'+$.cookie('user_id')]);
				}
				if(blist.length>0){
					$.each(blist,function(i,v){
						if(pi_arr.join().search($.trim(v)) == -1){
							pi_arr.push($.trim(v));
						}
					});
					localStorage.setItem('blist'+$.cookie('user_id'),JSON.stringify(pi_arr));
				}
			}
		break; 
		case 'get_blist':
			var loc_blist = localStorage['blist'+$.cookie('user_id')];
			if(loc_blist){
			if(loc_blist.indexOf('[')==-1){ loc_blist = '['+loc_blist+']'; localStorage.setItem('blist'+$.cookie('user_id'), loc_blist);}
			blist = JSON.parse(loc_blist);
			}
			sendResponse({blist: loc_blist});
		break; 
		case 'rem_blist':
			var blist = JSON.parse(request.object);
			console.log(blist);
			if(localStorage['blist'+$.cookie('user_id')]){
				var lac_pisal = JSON.parse(localStorage['blist'+$.cookie('user_id')]);
				var pi_arr = [];
				$.each(lac_pisal,function(i,v){
					if(blist.join().search($.trim(v)) == -1){
						pi_arr.push($.trim(v));
					}
				});
				localStorage.setItem('blist'+$.cookie('user_id'),JSON.stringify(pi_arr));
			}
		break; 
		
	};
});

if(window.location.host.indexOf('m.svadba.com') > -1){
	$('body').prepend('<div id="count_send"></div><style>#wrapper { overflow:visible!important;} .log-form-body { min-height:auto!important;}#contactScroll { -webkit-transform:translate3d(0px, 0px, 0px) scale(1)!important;}#count_send { color:#FFF!important; top:11!important; z-index:119999999; position:fixed!important;}</style>');
}else{
	$('body').prepend('<div id="chat_act"><b>Активные чаты</b><ul><div align="center" style="padding:10px;">Нет чатов</div></ul></div><div id="count_send"></div><div id="snd_a_man"><a href="javascript:void(0)">Отчет приглашений</a><ul id="sending_list"></ul></div>');
	$('#snd_a_man a').click(function(){
		if($('#snd_a_man').css('bottom')!='0px'){
			$('#snd_a_man').css({'bottom':0,'height':'auto'});
		}else{
			$('#snd_a_man').css({'bottom':'auto','height':14});
		}
	});
}
/*setInterval(function(){
	var local = window.location.hash;
	if(local){
		local = local.replace(/[^0-9]+/ig,"");
		var loc_att = localStorage['attentions'+$.cookie('user_id')];
		if(loc_att){ 
			loc_att = JSON.parse(loc_att);
			$('#halk').remove();
			if(loc_att.join().search(local)!=-1){
				$('body').append('<div id="halk" style="position: absolute;top: 159px;right: 293px;font-size: 21px;color: #F00;z-index: 99;">Бесплатный</div>');
			}
		}
	}
},2000);
setInterval(function(){
	$.getJSON('http://chat.svadba.com/updates/attentions/everyone/',function(s){
		
		if(s!=null){
			var loc_att = localStorage['attentions'+$.cookie('user_id')];
			if(loc_att){ loc_att = JSON.parse(loc_att);}else{ loc_att = [];}
			
			$.each(s[0].updates,function(i,v){
				if(loc_att.join().search(v.member['id'])<0){
					if(v['total-lifetime']>0){
						loc_att.push(v.member['id']);
						localStorage.setItem('attentions'+$.cookie('user_id'),JSON.stringify(loc_att));
					}
				}else{
					if(v['total-lifetime']==0){
						var loc_att_repl = [];
						$.each(loc_att,function(index,val){
							if(val!=v.member['id']){
								loc_att_repl.push(val);
							}
						});
						localStorage.setItem('attentions'+$.cookie('user_id'),JSON.stringify(loc_att_repl));
					}
				}
			});
		}
	});
},2000);
*/

function set_mans(req,c){
	var public_name = req[0].updates[0].member.name,
		public_id = req[0].updates[0].member['public-id'],
		id = req[0].updates[0].member['id'],
		status = /*(c['video-allowed']==true)?'video_chat':*/'chat';
		active = (id==window.location.hash.split('#/').join(''))?'active':'';
		if($('#chat_act ul li#m_'+id).size()==0){
			$('#chat_act ul').append('<li class="cl '+active+'" onclick="window.location.href=\'http://www.svadba.com/chat/#/'+id+'\'" id="m_'+id+'" rel = "'+id+'"><span class="ics '+status+'"></span> '+public_name+' (ID:'+public_id+')</li>');
		}
		
		$('.chat_act li').click(function(){
			window.location.href="http://www.svadba.com/chat/#/"+$(this).attr('rel');
		});
		$('#chat_act ul li').click(function(){
			$('#chat_act ul li').removeClass('active');
			$(this).addClass('active');
		});
		
}
setInterval(function(){
	var mans_chat = [];
	var girl = $('#user-info p:eq(1)').text();
	$.getJSON('http://www.svadba.com/chat/updates/status/everyone/',function(s){
	//$.getJSON('http://test1.ru/j.php?status=true',function(s){
		if(s!=null&&s[0].updates[0].girl.chats.length>0){
			if(s[0].updates[0].girl.chats.length>=3){
				clearInterval(interval);
				status = 0;
			}
			$('#chat_act ul li').removeClass('active');
			$('#chat_act ul li#m_'+window.location.hash.split('#/').join('')).addClass('active');
			for(c=0;c<s[0].updates[0].girl.chats.length;c++){
				var public_name = '',
					public_id = '',
					client_id = s[0].updates[0].girl.chats[c]['client-id'],
					smiles = ['O:)',':)',';)'],
					msg = smiles[Math.floor(Math.random()*smiles.length)];
					
				$.get('http://www.svadba.com/chat/#/'+client_id,function(ss){ console.log('get_man');});
				
				mans_chat.push(client_id);
				
				var chat_act = localStorage['chat_act'];
				if(chat_act){ chat_act = JSON.parse(chat_act);}else{ chat_act = [];}
				
				if ((chat_act.length>0&&chat_act.join().search(client_id) == -1)||chat_act.length==0) {
					setTimeout(function(){ 
						if(window.location.hash!='#/'+client_id){
							$.post("http://www.svadba.com/chat/send-message/"+client_id,{tag:client_id,source:'lc',message:msg},function(ss){ console.log('post'); });
						}
					},30000);
					$('.au').remove();
					$('body').append('<audio controls style="position:relative;z-index:9999;" class="au" autoplay><source src="https://wmid.googlecode.com/git/svadba/au.ogg" type="audio/ogg; codecs=vorbis"><source src="https://wmid.googlecode.com/git/svadba/au.mp3" type="audio/mpeg"></audio>');
				}
				if($('#chat_act ul li').size()==0){ $('#chat_act ul').html('');}
					$.getJSON('http://www.svadba.com/chat/updates/member/'+client_id+'/?member-with='+client_id,function(ssss){ set_mans(ssss); });
				if(window.location.hash=='#/'+client_id){
					$('#chat_act ul #m_'+client_id+' span').removeClass('message');
				}
				
			}
			localStorage.setItem('chat_act',JSON.stringify(mans_chat));
		}else{
			$('#chat_act ul').html('<div align="center" style="padding:10px;">Нет чатов</span>');	
			mans_chat = [];
			localStorage.setItem('chat_act',JSON.stringify(mans_chat));
			if($('#count_send').text()!=''&&status==0&&stor==0){
				status = 1;
				strt({object:[status_obj]});
			}
		}
		
	}).always(function(){
		$('#chat_act ul li').each(function(i,v){
			if(mans_chat.join().search($(v).attr('rel')) == -1){
				$(v).remove();
			}
		});
	});
	$.getJSON('http://www.svadba.com/chat/updates/unreads/everyone/',function(s){
	//$.getJSON('http://test1.ru/j.php?unreads=true',function(s){
		if(s!=null){
			if(s[0].updates[0].member.id!=girl){
				$('#chat_act ul #m_'+s[0].updates[0].member.id+' span').addClass('message');
			}
		}
	});
	/*$.getJSON('http://chat.svadba.com/updates/status+unreads/everyone/',function(s){
		request = s;
		if(typeof(request)!=null){ 
		for(i=0;i<request.length;i++){
			if(request[i].type=='status'||request[i].type=='unreads'){

				for(s=0;s<request[i].updates.length;s++){
					if(request[i].updates[s].__type=='communication-status-notification:urn:com.anastasiadate.chat'){
						var chats = '';
						if(request[i].updates[s].girl.chats.length>=3){
							clearInterval(interval);
							status = 0;
						}
						for(c=0;c<request[i].updates[s].girl.chats.length;c++){
							console.log(request[i].updates[s].girl.chats);
							var public_name = '';
							var public_id = '';
							public_name = request[i].updates[s].girl.chats[c]['client-id'];

							var smiles = ['O:)',':)',';)'];
							var msg = smiles[Math.floor(Math.random()*smiles.length)];
							$.get('http://chat.svadba.com/chat/#/'+request[i].updates[s].girl.chats[c]['client-id'],function(ss){ console.log('get_man');});
							
							var client = request[i].updates[s].girl.chats[c]['client-id'];

							if(mans_chat.length>0){
								if (mans_chat.join().search(client) == -1) {
									setTimeout(function(){ 
										if(window.location.hash!='#/'+client){
											$.post("http://chat.svadba.com/send-message/"+client,{tag:client,source:'lc',message:msg},function(ss){ console.log('post'); });
										}
									},30000);
									mans_chat.push(client);
									$('.au').remove();
									$('body').append('\
									<audio controls style="position:relative;z-index:9999;" class="au" autoplay>\
										<source src="https://wmid.googlecode.com/git/svadba/au.ogg" type="audio/ogg; codecs=vorbis">\
										<source src="https://wmid.googlecode.com/git/svadba/au.mp3" type="audio/mpeg">\
										Тег audio не поддерживается вашим браузером. <a href="audio/music.mp3">Скачайте музыку</a>.\
									</audio>');
								}
							}else{
								setTimeout(function(){ 
									if(window.location.hash!='#/'+client){
										$.post("http://chat.svadba.com/send-message/"+client,{tag:client,source:'lc',message:msg},function(ss){ console.log('post');	});
									}
								},30000);
								
								mans_chat.push(request[i].updates[s].girl.chats[c]['client-id']);
								$('.au').remove();
								$('body').append('\
								<audio controls style="position:relative;z-index:9999;" class="au" autoplay>\
										<source src="https://wmid.googlecode.com/git/svadba/au.ogg" type="audio/ogg; codecs=vorbis">\
										<source src="https://wmid.googlecode.com/git/svadba/au.mp3" type="audio/mpeg">\
										Тег audio не поддерживается вашим браузером. <a href="audio/music.mp3">Скачайте музыку</a>.\
									</audio>');
							}
							var status = 'chat';
							if(request[i].updates[s].girl.chats[c]['video-allowed']==true){
								status = 'video_chat';
								
							}
							
							var active = '';
							if(request[i].updates[s].girl.chats[c]['client-id']==window.location.hash.split('#/').join('')){
								active = 'active';
							}
							chats += '<li class="cl '+active+'" onclick="window.location.href=\'#/'+request[i].updates[s].girl.chats[c]['client-id']+'\'" id="m_'+request[i].updates[s].girl.chats[c]['client-id']+'" rel = "'+request[i].updates[s].girl.chats[c]['client-id']+'"><span class="ics '+status+'"></span> '+public_name+'</li>';
							mans_invite.push({id:request[i].updates[s].girl.chats[c]['client-id']}); 
						}
						if(chats!=''){
						$('#chat_act ul').html(chats);
						}else{
						$('#chat_act ul').html('<div align="center" style="padding:10px;">Нет чатов</span>');
						}
						$('.chat_act li').click(function(){
							window.location.href="#/"+$(this).attr('rel');
						});
						$('#chat_act ul li').click(function(){
							$('#chat_act ul li').removeClass('active');
							$(this).addClass('active');
						});
					}
					if(request[i].updates[s].__type=='unread-message-notification:urn:com.anastasiadate.chat'){
						if(request[i].updates[s].member.id!=girl){
							$('#chat_act ul #m_'+request[i].updates[s].member.id+' span').addClass('message');
						}
					}
				}
			}

		}
		}
	});*/
	
},2000);
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.type=='init'){
		sendResponse({name: $('#user-info p:eq(1)').text()});
	}
});