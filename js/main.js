$(function($) {
	var fillgrid = function(table){
		if(table == '#statistics') {return;}else{

			function DummyLinkFormatter(row, cell, value, columnDef, dataContext) {
				var constr ='&nbsp;&nbsp;';
				if(table == '#proc' || table == '#item'){
					constr += '<span data-type="'+table.substr(1)+'" data-uid="'+dataContext[columnDef.field]+'" class="btn btn-default btn-xs glyphicon glyphicon-align-justify"></span>&nbsp;&nbsp;';
				}
				var sa = ['<span data-type="'+table.substr(1)+'" class="btn btn-default btn-xs glyphicon glyphicon-plus"></span>&nbsp;&nbsp;',
					"<span class='btn btn-default btn-xs glyphicon glyphicon-edit'></span>&nbsp;&nbsp;",
					"<span data-type='"+table.substr(1)+"' data-uid='"+dataContext[columnDef.field]+"' class='btn btn-default btn-xs glyphicon glyphicon-trash'></span>",
					constr
				];
			    return sa.join('');
			}
			function RowNumberFormatter(row, cell, value, columnDef, dataContext) {
			    return row + 1;
			}
		  var columnsBasic = [
		    {id: "number", name: "序号", field: "title", width: 80, formatter: RowNumberFormatter},
		    {id: "title", name: "名称", field: "name", width: 200},
		    {id: "owner", name: "创建人", field: "owner", width: 100},
		    {id: "start", name: "创建日期", field: "mdtime", width: 100},
		    {id: "actions", name: "操作", field: table.substr(1)+"id", width: 300, formatter: DummyLinkFormatter}
		  ];
		  	if(table =="#plan"){
		  		columnsBasic = [
				    {id: "number", name: "序号", field: "", width: 80, formatter: RowNumberFormatter},
				    {id: "title", name: "股票代码", field: "stockid", width: 100},
				    {id: "stock", name: "股票名称", field: "stockname", width: 100},
				    {id: "owner", name: "创建人", field: "owner", width: 100},
				    {id: "owner", name: "策略", field: "proid", width: 200},
				    {id: "start", name: "创建日期", field: "mdtime", width: 100},
				    {id: "actions", name: "操作", field: table.substr(1)+"id", width: 300, formatter: DummyLinkFormatter}
				  ];
		  	}

		  	var columns = columnsBasic.slice();
			var gridFun = function(){
				var gridObj = $(table+'grid').data('slickgrid');
				if(gridObj){
					gridObj.wrapperOptions.data=window[table.substr(1)+"rows"];
					gridObj.grid.setData(window[table.substr(1)+"rows"]);
					gridObj.grid.render();
					//$(table+'grid').slickgrid("postInit");
				}else
					$(table+'grid').slickgrid({
					    columns: columns,
					    data: window["firstplans"]?window["firstplans"]:window[table.substr(1)+"rows"],
					    slickGridOptions: {
					      enableCellNavigation: true,
					      enableColumnReorder: false,
					      forceFitColumns: true,
					      rowHeight: 35
					    }
					});
			};
		  	if(window["firstplans"]){
		  		gridFun();
		  		firstplans = 0;
		  	}else
				$.getScript("data.php?act=query&type="+table.substr(1), gridFun);
		}
	};
	$("a.navbar-brand,ul.nav > li > a").click(function () { 
		$(".mmcc").hide();
		var table = $(this).attr('href');
		$(table).show();
		fillgrid(table);
	});
	$("a.navbar-brand").click();
	$("ul.nav > li.dropdown >ul.dropdown-menu a").click(function () { 
		alert('#statistics');
	});
	$('#itemform').one('shown.bs.modal', function () {
	  
	  	$("#itemsavebtn").bind("click", function(){
	  		var cond = $("#addcongrp").find('.itemcon');
	  		console.log(cond);
	  		cond = $.map( cond, function(n){ return $(n).val(); });
			var dataParass={type:"item",name:$("#itemname").val(),owner:"testowner",cond:cond};
	        $.ajax({
	            type:"POST",
	            //contentType:"application/json",
	            url:"data.php?act=add",
	            data:dataParass,
	            //dataType:"json",
	            success: function(result){
	            	fillgrid("#item");
	                //$.each($.parseJSON(result),function(key,value){    
	                //    alert("key:"+key+" value:"+value);
	                //});
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
	            }
	        });

	    });

	    $("#addconbtn").bind("click", function(){
	    	var strarr = ['<label class="col-lg-2 control-label sr-only"></label>',
	    	' <div class="col-lg-10"><input type="text" class="form-control itemcon" placeholder="条件"></div>'
	    	];
			$("#addcongrp").append(strarr.join(''));

	    });
	});
	//添加操作
	$('body').delegate('span.glyphicon-plus','click', function() { 
		//alert($(this).data('table')); 
		var table = $(this).data('type');
		$('#'+table+'form').modal({ remote: table+"form.html"});
	});
	//删除操作
	$('body').delegate('span.glyphicon-trash','click', function() { 
		//alert($(this).data('table')); 
		var table = $(this).data('type');
		$.ajax({ 
			url: "data.php?act=del&type="+table+"&uid="+$(this).data('uid'),
			success: function(html){ 
				fillgrid("#"+table);
			} 
		});
	});
	$('body').delegate('span.glyphicon-align-justify','hover', function() { 
		//alert($(this).data('table')); 

	});
	$('body').popover({ html:true,container: 'body',
		trigger:'hover',
        selector: 'span.glyphicon-align-justify',
        title:function(){
        	var that;
			var table = $(this).data('type');
			if(table == 'proc') that = '项';
			if(table == 'item') that = '条件';
			return '判断'+that;
		},
        content:function(){
        	var that = $(this);
			var table = that.data('type');
			var uid = that.data('uid');
			var popFun = function(){
				that.data('content',window[table+'kv']);
				var cdiv = $('body > div.popover > div.popover-content');
				$.each( that.data('content'), function(i, n){ 
					if(i==0) cdiv.html(n + '<br/>');
					else cdiv.append(n + '<br/>'); 
				});
			};
			$.getScript("data.php?act=kv&type="+table+"&uid="+uid, popFun);
        	return 'loading...';
        }
    });
	$(window).resize(function(){
		$('div.grid:visible').trigger("resize.slickgrid");
	});
});
