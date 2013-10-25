$(function($) {
	var fillgrid = function(table){
		if(table == '#statistics') {return;}else{

			function DummyLinkFormatter(row, cell, value, columnDef, dataContext) {
				var constr ='&nbsp;&nbsp;';
				if(table == '#proc' || table == '#item'){
					constr += '<span data-type="'+table.substr(1)+'" data-uid="'+dataContext[columnDef.field]+'" class="btn btn-default btn-xs glyphicon glyphicon-align-justify"></span>&nbsp;&nbsp;';
				}
				var sa = ['<span data-type="'+table.substr(1)+'" class="btn btn-default btn-xs glyphicon glyphicon-plus"></span>&nbsp;&nbsp;',
					"<span data-type='"+table.substr(1)+"' data-uid='"+dataContext[columnDef.field]+"' data-name='"+dataContext['name']+"' class='btn btn-default btn-xs glyphicon glyphicon-edit'></span>&nbsp;&nbsp;",
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
				    {id: "procid", name: "策略", field: "procid", width: 200},
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
		var tc = $(this).attr('href');
		$(tc).show();
		fillgrid(tc);
	});
	$("a.navbar-brand").click();
	$("ul.nav > li.dropdown >ul.dropdown-menu a").click(function () { 
		alert('#statistics');
	});
	var apdFun = function(){
    	var strarr = ['<label class="col-lg-2 control-label sr-only"></label>',
    	' <div class="col-lg-10"><input type="text" class="form-control itemcon" placeholder="条件"></div>'
    	];
		$("#addcongrp").append(strarr.join(''));
    };
    //对话框加事件
	$('#itemform').one('shown.bs.modal', function () {
	  
	  	$("#itemsavebtn").bind("click", function(){
	  		var cond = $("#addcongrp").find('.itemcon');
	  		console.log(cond);
	  		cond = $.map( cond, function(n){ return $(n).val(); });
			var dataParass={type:"item",name:$("#itemname").val(),owner:"public",cond:cond};
			var act = $('#itemform').data('act');
			if(act == 'edit')
				act += "&uid="+$('#itemform').data('uid');
	        $.ajax({
	            type:"POST",
	            //contentType:"application/json",
	            url:"data.php?act="+act,
	            data:dataParass,
	            //dataType:"json",
	            success: function(result){
	            	fillgrid("#item");
	                $('#itemform').modal('hide');
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
	            }
	        });

	    });

	    $("#addconbtn").bind("click", apdFun);
	});
	$('#itemform').on('shown.bs.modal', function () {
	  	var act = $('#itemform').data('act');
		if(act == 'edit'){
			$("#itemname").val($('#itemform').data('name'));
			$("#addcongrp>label:gt(0),#addcongrp>div:gt(0)").remove();
			$("#addcongrp :text:last").val('');
			$.getScript("data.php?act=kv&type=item&uid="+$('#itemform').data('uid'), function(){
				$.each( window['itemkv'], function(i, n){
					if(i != 0)	apdFun(); 
					$("#addcongrp :text:last").val(n);
				});
			});
		}
	});

	$('#procform').one('shown.bs.modal', function () {
	  
	  	$("#procsavebtn").bind("click", function(){
	  		var gridObj = $('#procitemGrid').data('slickgrid');
	  		var cond = gridObj.grid.getSelectedRows();//$("#addcongrpp").find('.proccon');
	  		console.log(cond);
	  		cond = $.map( cond, function(n){ return gridObj.wrapperOptions.data[n].itemid; });
			var dataParass={type:"proc",name:$("#procname").val(),owner:"public",cond:cond};
			var act = $('#procform').data('act');
			if(act == 'edit')
				act += "&uid="+$('#procform').data('uid');
	        $.ajax({
	            type:"POST",
	            //contentType:"application/json",
	            url:"data.php?act="+act,
	            data:dataParass,
	            //dataType:"json",
	            success: function(result){
	            	fillgrid("#proc");
	                $('#procform').modal('hide');
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
	            }
	        });

	    });
	});
	$('#procform').on('shown.bs.modal', function () {
		$("#procname").val($('#procform').data('name'));
		$.getScript("data.php?act=query&type=item", function () {
			var gridObj = $('#procitemGrid').data('slickgrid');
			if(gridObj){
				gridObj.wrapperOptions.data=window["itemrows"];
				gridObj.grid.setData(window["itemrows"]);
				gridObj.grid.render();
			}else{//创建表格显示所有的可选择项目
				var columns = [];
				var checkboxSelector = new Slick.CheckboxSelectColumn({});
				columns.push(checkboxSelector.getColumnDefinition());
			    columns.push({
				        id: 'piname',
				        name: 'pn',
				        field: 'name',
				        width: 100
				    });
				$('#procitemGrid').slickgrid({
				    columns: columns,
				    data: window["itemrows"],
				    slickGridOptions: {
						enableColumnReorder:false,
					    enableCellNavigation: true,
					    asyncEditorLoading: false,
					    forceFitColumns: true,
						rowHeight: 35,
					    autoEdit: false
				    }
				});
			    $("#procitemGrid>div.slick-header").height(0);
			    gridObj = $('#procitemGrid').data('slickgrid');
				gridObj.grid.resizeCanvas();
				gridObj.grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
				gridObj.grid.registerPlugin(checkboxSelector);
			}
			var act = $('#procform').data('act');
			if(act == 'edit'){
				//$("#addcongrpp>label:gt(0),#addcongrpp>div:gt(0)").remove();
				//$("#addcongrpp :text:last").val('');
				//勾选表格行
				$.getScript("data.php?act=kv&type=proc&uid="+$('#procform').data('uid'), function(){
					var cond = window['prockv'];
					if(cond){
						var arr = $.map( gridObj.wrapperOptions.data, function(n){ return n.itemid; });
			  			cond = $.map( cond, function(n){ return $.inArray(n,arr); });
					}else{
						cond =[];
					}
					gridObj = $('#procitemGrid').data('slickgrid');
					gridObj.grid.setSelectedRows(cond);
				});
			}
		});
	});

	$('#planform').one('shown.bs.modal', function () {
	  	$("#plansave").click(function(){
			var options = {
				url: "data.php?act=add",  // override for form's 'action' attribute 
				type: 'post', 
	            data: "type=plan&owner=public&"+$('#plansubmit').serialize(),
	            success: function(result){
	            	fillgrid("#plan");
	                $('#planform').modal('hide');
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
	            }	 
	        };
			$.ajax(options);
            return false;
	    });
	    var suggestServer = new SuggestServer();
	    suggestServer.bind({"input": "symbol", "value": "@3@", "type": "stock", "width": 180,"callback":
	 		function (code,arr) {
	 			var first = arr, sc = code ;
	 			if(arr.length == 0){
	 				var first = this._objectData['key_'+code].split(';').shift().split(',');
	 				sc =  first[3];
	 			}
	 			$("#stockcode,#symbol").val(sc);
	 			$("#stockname").val(first?first[4]:'');
	 		}
		});
		$.getScript("data.php?act=query&type=proc", function () {
			var data = window["procrows"];
			var select = $("#procid").hide();
			$.each( data, function(i, n){ 
				select.append('<option value="'+n.procid+'">'+n.name+'</option>'); 
			});
	        select.show().selectpicker();
		});
		$("#remark").selectpicker();
	});
	$('#procform').on('hidden.bs.modal', function () {
		$("#procname").val('');
	});	
	//添加操作
	$('body').delegate('span.glyphicon-plus','click', function() { 
		var table = $(this).data('type');
		$('#'+table+'form').data('act','add').data('name','');
		$('#'+table+'form').modal({ remote: table+"form.html"});
	});
	//编辑操作
	$('body').delegate('span.glyphicon-edit','click', function() {
		var table = $(this).data('type');
		$('#'+table+'form').data('act','edit').data('uid',$(this).data('uid')).data('name',$(this).data('name'));
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

	$.ajax({  
	    dataType:'script',  
	    url:"http://hq.sinajs.cn/list=sh601003,sh601001",  
	    cache: true,
	    scriptCharset: 'gbk',
	    success: function(msg){  
			$.each('sh601003,sh601001'.split(','),function(i, n){ 
				var sn = 'hq_str_'+n;
				if(sn in window) {
					var cc = window[sn].split(',');
					$('#statisticsgrid').append(cc[0]+'今开'+cc[1]+'昨收'+cc[2]+'最新'+cc[3]+'<br>');
				}
			});
	    }  
	}); 
});
