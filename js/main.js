$(function($) {
	var fillgrid = function(table){
		if(table == '#statistics') {return;}else{
			function DummyLinkFormatter(row, cell, value, columnDef, dataContext) {
				var sa = ['<span data-type="'+table.substr(1)+'" class="btn btn-default btn-xs glyphicon glyphicon-plus"></span>&nbsp;&nbsp;',
					"<span class='btn btn-default btn-xs glyphicon glyphicon-edit'></span>&nbsp;&nbsp;",
					"<span data-type='"+table.substr(1)+"' data-uid='"+dataContext[columnDef.field]+"' class='btn btn-default btn-xs glyphicon glyphicon-trash'></span>"
				];
			    return sa.join('');
			}
			function RowNumberFormatter(row, cell, value, columnDef, dataContext) {
			    return row + 1;
			}
		  var columnsBasic = [
		    {id: "number", name: "序号", field: "title", width: 100, formatter: RowNumberFormatter},
		    {id: "title", name: "名称", field: "name", width: 200},
		    {id: "owner", name: "创建人", field: "owner", width: 200},
		    {id: "start", name: "创建日期", field: "mdtime", width: 150},
		    {id: "actions", name: "操作", field: table.substr(1)+"id", width: 200, formatter: DummyLinkFormatter}
		  ];
		  	if(table =="#plan"){
		  		columnsBasic = [
				    {id: "number", name: "序号", field: "", width: 100, formatter: RowNumberFormatter},
				    {id: "title", name: "股票代码", field: "stockid", width: 200},
				    {id: "stock", name: "股票名称", field: "stockname", width: 200},
				    {id: "owner", name: "创建人", field: "owner", width: 200},
				    {id: "owner", name: "策略", field: "proid", width: 200},
				    {id: "start", name: "创建日期", field: "mdtime", width: 150},
				    {id: "actions", name: "操作", field: table.substr(1)+"id", width: 200, formatter: DummyLinkFormatter}
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
	$(window).resize(function(){
		$('div.grid:visible').trigger("resize.slickgrid");
	});
});
