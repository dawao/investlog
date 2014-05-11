var user = "public", 
	publicList="sz000538,sh600000",
	publicIdea=[{name:'业绩好'},{name:'题材好'},{name:'主力关注'},{name:'趋势向好'}],
	publicBuys=[{name:'突破'},{name:'消息'}],
	publicSell=[{name:'达标'},{name:'条件反转'}],
	publicRisk=[{name:'整体仓位'},{name:'趋势'}],
	publicTag=[{name:'成功'},{name:'失败'},{name:'待定'},{name:'研究'}];
function getud() {return $.parseJSON(localStorage.getItem(user));}
var userdata = getud();
function setud() {localStorage.setItem(user,JSON.stringify(userdata));};
if(!userdata){
	userdata = {
		stocklist:publicList,
		idea:publicIdea,
		buys:publicBuys,
		sell:publicSell,
		risk:publicRisk,
		com:[],
		tag:[]
	};
}
var stockList = {
	createGrid:function() {
		function RowFormatter(row, cell, value, columnDef, dataContext) {
				if(cell == 1) return '<span class="label label-info">'+(value||'')+'</span>';
			    return row + 1;
		}
		var columns = [
		    {id: "number", name: "序号", field: "code", width: 60, formatter: RowFormatter,headerCssClass:"alert alert-info"},
		    {id: "name", name: "名称", field: "name", width: 100, formatter: RowFormatter,headerCssClass:"alert alert-info"},
		    {id: "price", name: "最新价", field: "price", width: 80,headerCssClass:"alert alert-info"},
		    {id: "chengeper", name: "涨跌幅", field: "chengeper", width: 80,headerCssClass:"alert alert-info"},
		    {id: "chenge", name: "涨跌", field: "chenge", width: 80,headerCssClass:"alert alert-info"}
		];
		var data = [];
		$.each(userdata.stocklist.split(','),function(i, n){ 
			data.push({code:n});
		});
		$("#stocklist").height($(window).height()-105);
		$('#demostock').slickgrid({
		    columns: columns,
		    data: data,
		    slickGridOptions: {
		      enableCellNavigation: true,
		      enableColumnReorder: false,
		      forceFitColumns: true,
		      //headerRowHeight: 35,
		      rowHeight: 35
		    }
		});
		$(window).resize(function(){
			$("#stocklist").height($(window).height()-105);
			$('#demostock').trigger("resize.slickgrid");
		});
		var gridObj = $('#demostock').data('slickgrid');
		if(gridObj){
				console.log(gridObj.grid.getViewport());
				console.log(gridObj.grid.getRenderedRange());
		
			gridObj.grid.onClick.subscribe(function(e,obj){
				console.log(obj);
				
				if($(window).width()>=992){
					if(e.target.tagName == 'SPAN'){//click name display kline
						console.log('kline');
					}else{
						$('#alldetaildialog').modal('show')
						var rowobj = gridObj.wrapperOptions.data[obj.row];
						var headstring = "<span class='badge' data-toggle='modal' data-target='#editdialog'>备注和标签</span>";
						$('#myLargeModalLabel').html(rowobj.name+headstring).data('sid',rowobj.code);
					}
				}else{
					$("#stocklist").hide();
					$("#onedetail").show();
					detailList.createGrid();
					detailList.fillGrid();
				}			
			});
			gridObj.grid.onViewportChanged.subscribe(function(e,obj){

			});
		}
	},
	fillGrid:function() {
		var gridObj = $('#demostock').data('slickgrid');
		var data = gridObj.wrapperOptions.data ;
		var range = gridObj.grid.getViewport();
		var sids = $.map(data, function(n, i){
	      return n.code;
	    });
		sids = sids.slice(range.top,range.bottom);
		$.ajax({  
		    dataType:'script',  
		    url:"http://hq.sinajs.cn/list="+sids.join(','),  
		    cache: true,
		    scriptCharset: 'gbk',
		    success: function(msg){  
		    	$.each(sids,function(i, n){ 
		    		var row = data[range.top+i];
					var sn = 'hq_str_'+n;
					if(sn in window) {
						var cc = window[sn].split(',');
						console.log(cc);
						
						if(cc[1]==0)
							row.price=cc[2];
						else
							row.price=cc[3];
					
						if(cc[1]==0)
							row.chengeper="--";
						else
							row.chengeper=Math.round((cc[3]-cc[2])/cc[2]*10000)/100 +'%';
					
						if(cc[1]==0)
							row.chenge="--";
						else
							row.chenge=Math.round((cc[3]-cc[2])*100)/100;
				
				  		row.name = cc[0];
						
						//(cc[0]+'今开'+cc[1]+'昨收'+cc[2]+'最新'+cc[3]+'<br>');
						//data.push(row);
					}
				});
				
				if(gridObj){
					//gridObj.wrapperOptions.data=data;
					gridObj.grid.setData(data);
					gridObj.grid.render();
				}
		    }  
		});
	}
};
var detailList = {

	init:function() {
		$('#alldetaildialog').one('shown.bs.modal', detailList.createGrid);
		$('#alldetaildialog').on('shown.bs.modal', detailList.fillGrid);
	},
	createGrid:function() {
		var gridoptions = {
			  editable: false,
	    	  enableAddRow: true,
		      enableCellNavigation: true,
		      enableColumnReorder: false,
		      forceFitColumns: true,
		      //headerRowHeight: 35,
		      autoEdit: false,
		      rowHeight: 35
		    };

		var headstring = "<span class='badge' style='float:right;'>编辑</span>";
		var dgs = [ {id: "idea", name: "选股依据"+headstring},
					{id: "buys", name: "把握买点"+headstring},
					{id: "sell", name: "把握卖点"+headstring},
					{id: "risk", name: "风险控制"+headstring}];
		function makegrid(item) {
			var grid = $('#'+item.id+'grid').slickgrid({
			    columns: [$.extend({field: "name", editor: Slick.Editors.Text, width: 200,headerCssClass:"alert alert-info"},item)],
			    data: [],slickGridOptions: gridoptions
			}).data('slickgrid').grid;
			grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
		    var checkboxSelector = new Slick.CheckboxSelectColumn({
		      cssClass: "slick-cell-checkboxsel"
		    });
			grid.onHeaderClick.subscribe(function(e,obj){
				console.log(obj);
				var $elm = $(e.target);
			    var tgrid = obj.grid;
			    var cols = tgrid.getColumns();
				if ($elm.hasClass('badge')) {
					if ($elm.text() == "编辑") {
					    cols[0].name=cols[0].name.replace("编辑","保存");
						var sel = $.map( tgrid.getData(), function(val, i) {
						  return val.name;
						});
					    cols.unshift(checkboxSelector.getColumnDefinition());
					    //tgrid.getData();
					    tgrid.registerPlugin(checkboxSelector);
					    tgrid.setColumns(cols);
					    tgrid.setData(userdata[item.id]);					    
					    tgrid.render();					    
						tgrid.setOptions({autoEdit: true,editable:true});
						var all = $.map( userdata[item.id], function(val, i) {
						  return val.name;
						});

						var chk = $.map(sel, function(n, i){
						  return $.inArray(n,all);
						});
						tgrid.setSelectedRows(chk);
					}else {
						userdata[item.id] = tgrid.getData();
						setud();
						cols.shift();
						var sel = $.map( tgrid.getSelectedRows(), function(val, i) {
						  return userdata[item.id][val];
						});
						tgrid.unregisterPlugin(checkboxSelector);
						cols[0].name=cols[0].name.replace("保存","编辑");
					    tgrid.setColumns(cols);
					    tgrid.setData(sel);					    
					    tgrid.render();
						tgrid.setOptions({autoEdit: false,editable:false});
						var data = $.parseJSON(localStorage.getItem(user+$('#myLargeModalLabel').data('sid')))||{};
						data[item.id] = sel;
						localStorage.setItem(user+$('#myLargeModalLabel').data('sid'),JSON.stringify(data))
					}
				}
			});
			grid.onAddNewRow.subscribe(function (e, args) {
		      var item = args.item,grid = args.grid,data = grid.getData();
		      grid.invalidateRow(data.length);
		      data.push(item);
		      grid.updateRowCount();
		      grid.render();
		    });
		}
		$.each(dgs,function(i, n){
			makegrid(n);
		});
	},
	fillGrid:function() {
		$.each(["#idea","#buys","#sell","#risk"],function(i, n){
			var gridObj = $(n+'grid').data('slickgrid');
			var data = $.parseJSON(localStorage.getItem(user+$('#myLargeModalLabel').data('sid')))||{};
			if(gridObj && data){
				gridObj.wrapperOptions.data=data[n.substr(1)]||[];
				gridObj.grid.setData(data[n.substr(1)]||[]);
				gridObj.grid.render();
			}
		});
	}
};
var editDialog = {
	init:function() {
		$('#editdialog').one('shown.bs.modal', editDialog.createGrid);
		$('#editdialog').on('shown.bs.modal', editDialog.fillGrid);
	},
	createGrid:function() {
		var gridoptions = {
			  editable: false,
	    	  enableAddRow: true,
		      enableCellNavigation: true,
		      enableColumnReorder: false,
		      forceFitColumns: true,
		      headerRowHeight: 0,
		      autoEdit: false,
		      rowHeight: 35
		    };
		var checkboxSelector = new Slick.CheckboxSelectColumn({
		      cssClass: "slick-cell-checkboxsel"
		    });
		function RowFormatter(row, cell, value, columnDef, dataContext) {
			return  value + "<span class='badge' style='float:right;'>删除</span>";
		}
		// $('#itemgrid').slickgrid({
		//     columns: [checkboxSelector.getColumnDefinition(),
		//     	{id: "item", name: "", field: "name", width: 200, formatter: RowFormatter}],
		//     data: [{name:'good'}],slickGridOptions: gridoptions
		// }); 
		// $('#itemgrid>div.slick-header').hide();
		// $('#itemgrid').data('slickgrid').grid.registerPlugin(checkboxSelector);
		var grid = $('#comgrid').slickgrid({
		    columns: [{id: "com", name: "", field: "name", width: 200, formatter: RowFormatter, editor: Slick.Editors.Text}],
		    data: [],slickGridOptions: $.extend(gridoptions,{editable: true})
		}).data('slickgrid').grid;
		grid.onClick.subscribe(function(e,obj){
			console.log(obj);
			var $elm = $(e.target);
			if ($elm.hasClass('badge')) {

			}
		});
		grid.onAddNewRow.subscribe(function (e, args) {
		      var item = args.item,grid = args.grid,data = grid.getData();
		      grid.invalidateRow(data.length);
		      data.push(item);
		      grid.updateRowCount();
		      grid.render();
	    });
		$('#comgrid>div.slick-header').hide();
		$('#tagsgrid').slickgrid({
		    columns: [checkboxSelector.getColumnDefinition(),
		    	{id: "tags", name: "", field: "name", width: 200}],
		    data: publicTag,slickGridOptions: gridoptions
		});
		$('#tagsgrid>div.slick-header').hide();
		$('#tagsgrid').data('slickgrid').grid.registerPlugin(checkboxSelector);
	},
	fillGrid:function() {
		var gridObj = $('#comgrid').data('slickgrid');
		var data = userdata.com;
		if(gridObj){
			gridObj.wrapperOptions.data=data;
			gridObj.grid.setData(data);
			gridObj.grid.render();
		}
	}
};

$(function($) {


	$("#stocklist").on("click","div.row",function(e) {
		// var sid = $(this).data('sid');
		// if(sid){
		// 	if($(window).width()>=992){
		// 		if($(e.target).data('sid')){//click name display kline
		// 			alert('kline');
		// 		}else{
		// 			var alldetail = $("#alldetail");
		// 			if (alldetail.data('sid') == sid) {
		// 				alldetail.hide().data('sid',"");
		// 			}else{
		// 				$(this).after(alldetail);
		// 				alldetail.data('sid',sid).show();
		// 			};	
		// 		}
		// 	}else{
		// 		$("#stocklist").hide();
		// 		$("#onedetail").show();
		// 	}			
		// }
	});



	//自动补全股票，添加到列表
    var suggestServer = new SuggestServer();
    suggestServer.bind({"input": "symbol", "value": "@3@", "type": "stock", "width": 180,"callback":
 		function (code,arr) {
 			var first = arr, sc = code ;
 			if(arr.length == 0){
 				var first = this._objectData['key_'+code].split(';').shift().split(',');
 				sc =  first[3];
 			}
 			$("#symbol").val(first?first[4]:'');
 			//$("#stockname").val(first?first[4]:'');
 			//stockrow(sc);
 			var gridObj = $('#demostock').data('slickgrid');
 			gridObj.wrapperOptions.data.unshift({code:sc})
 			stockList.fillGrid();
 		}
	});
	//取数据，生成股票列表
	function stockrow(sids,$row) {
		// $.ajax({  
		//     dataType:'script',  
		//     url:"http://hq.sinajs.cn/list="+sids,  
		//     cache: true,
		//     scriptCharset: 'gbk',
		//     success: function(msg){  
		//     	$.each(sids.split(','),function(i, n){ 
		// 			var sn = 'hq_str_'+n;
		// 			if(sn in window) {
		// 				var cc = window[sn].split(',');
		// 				console.log(cc);
		// 				if(! $row)
		// 					$row = $('#demostock').clone().data('sid',n).appendTo("#stocklist");
		// 				$row.children().each(function( index ) {
		// 					if(index == 1){
		// 						if(cc[1]==0)
		// 							$(this).text(cc[2]);
		// 						else
		// 							$(this).text(cc[3]);
		// 					}else if(index == 2){
		// 						if(cc[1]==0)
		// 							$(this).text("--");
		// 						else
		// 							$(this).text(Math.round((cc[3]-cc[2])/cc[2]*10000)/100 +'%');
		// 					}else if(index == 3){
		// 						if(cc[1]==0)
		// 							$(this).text("--");
		// 						else
		// 							$(this).text(Math.round((cc[3]-cc[2])*100)/100);
		// 					}else
		// 				  		$(this).text(cc[index]).data('sid',n);
		// 				});
		// 				//(cc[0]+'今开'+cc[1]+'昨收'+cc[2]+'最新'+cc[3]+'<br>');
		// 			}
		// 		});
		//     }  
		// });
	}

	//stockrow($('#demostock').data('sid'),$('#demostock'));
	stockList.createGrid();
	stockList.fillGrid();
	detailList.init();
	editDialog.init();

	//for mobile
	$("#home").click(function() {
		$("#stocklist").show();
		$("#onedetail").hide();
		//$('#alldetail > div.row').append($("#ideagrid")).append($("#buysgrid")).append($("#sellgrid")).append($("#riskgrid"));
	});
	$('#onedetail a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  console.log(e.target ,e.relatedTarget);// activated tab
	  //e.relatedTarget // previous tab
	  var cur = $(e.target).attr('href');
	  $(cur).append($(cur+'grid').removeClass('col-xs-3'));
	  if(cur != "#stock")
	  	$(cur).append($('#btngroup'));
	  $(cur+'grid').trigger("resize.slickgrid");
	 //$(cur+'grid>div.slick-header').hide();
	});
	function initbtn(bid) {
		$(bid+'btn').click(function() {
			$('#editdialog').modal('show');
			$.each(["#con","#com","#tag"],function(i, n){
				if(bid == n)
					$(n+'list').show();
				else
					$(n+'list').hide();
			});
		});
	}
	$.each(["#con","#com","#tag"],function(i, n){ 
		initbtn(n);
	});
	//$('#editdialog').on('hidden.bs.modal', function (e) {
	  	//$("#conlist,#comlist,#taglist").show();
	//})
});
