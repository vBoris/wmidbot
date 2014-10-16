(function($){
	MessHandle=function(obj,sender,CB)
	{
		switch(obj.type)
		{
			case "init": console.log(name);
				CB({
					name:name,
					runned:false,
					storage:{}
				});
			break;
			default:
				CB(false);
		}
	}
	
})(jQuery);