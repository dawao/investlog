var user = "public", 
	publicList="sz000538,sh600000",
	publicIdea=[{name:'业绩最近季度显著增长'},{name:'业绩连年稳定增长'},{name:'题材好且有板块效应'},{name:'有主力资金参与'},{name:'处于板块龙头地位'},{name:'有优质机构最近季度增仓'}],
	publicBuys=[{name:'带量突破盘整区'},{name:'股价创新高'},{name:'形态无缺陷'},{name:'价量关系合理'}],
	publicSell=[{name:'涨25%考虑止赢'},{name:'跌5%减半仓'},{name:'跌8%考虑止损'},{name:'跌破最近大阳线考虑卖出'}],
	publicRisk=[{name:'趋势为王-不在弱市买入'},{name:'平盘震荡方向不明不加仓'},{name:'非明确上升趋势下仓位不超50%'},{name:'持仓不超过五只股'},{name:'方向不明可放飞利润'}],
	publicTag=[{name:'成功'},{name:'失败'},{name:'待定'},{name:'经典'}];
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
		ver:1
	};
}
var stockList = {
	createGrid:function() {
		function RowFormatter(row, cell, value, columnDef, dataContext) {
				if(columnDef.field == "name") 
					return '<span class="label label-default">'+(value||'')+'</span>';
				if(columnDef.id == "op") 
					return '<span class="label alert-info">走势</span>&nbsp;'+
							'<span class="label alert-warning">分享</span>&nbsp;'+
							'<span class="label alert-danger">删除</span>';
				if(columnDef.field.indexOf("chenge") != -1 )
					return '<span class="alert-'+
							(((value+'').indexOf("-") == -1 )?'danger':'success')+
							'">'+(value||'')+'</span>';
			    return (columnDef.id == "number")?(row + 1):value;
		}
		var columns = [
		    {id: "number", name: "序号", field: "code", width: 60, formatter: RowFormatter,headerCssClass:"alert alert-info"},
		    {id: "name", name: "名称", field: "name", width: 100, formatter: RowFormatter,headerCssClass:"alert alert-info"},
		    {id: "price", name: "最新价", field: "price", width: 80,headerCssClass:"alert alert-info"},
		    {id: "chengeper", name: "涨跌幅", field: "chengeper", width: 80, formatter: RowFormatter,headerCssClass:"alert alert-info"},
		    {id: "chenge", name: "涨跌", field: "chenge", width: 80, formatter: RowFormatter,headerCssClass:"alert alert-info"},
		    {id: "op", name: "操作", field: "code", width: 150, formatter: RowFormatter,headerCssClass:"alert alert-info"}
		];
		var data = [];
		$.each(userdata.stocklist.split(','),function(i, n){ 
			data.push({code:n});
		});
		$("#stocklist").height($(window).height()-105);
		$('#demostock').slickgrid({
		    columns: ($('#demostock').width() > 768)?columns:columns.slice(1, 5),
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
				//console.log(gridObj.grid.getViewport());
				//console.log(gridObj.grid.getRenderedRange());
			gridObj.grid.onClick.subscribe(function(e,obj){
				console.log(obj);
				var rowobj = obj.grid.getData()[obj.row];
				$('#myLargeModalLabel').html(rowobj.name).data('sid',rowobj.code);
				if($(window).width()>=992){
					if(obj.cell == 5 && e.target.tagName == 'SPAN'){//click name display kline
						console.log('kline');
						alert("coming soon!!")
					}else{
						$('#alldetaildialog').modal('show')
					}
				}else{
					$("#stocklist").hide();
					$("#onedetail").show();
					if (!$('#ideagrid').data('slickgrid'))
						detailList.createGrid();
					detailList.fillGrid();
				}			
			});
			// gridObj.grid.onViewportChanged.subscribe(function(e,obj){

			// });
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
		$('#setv').click(function() {
			if ($(this).text().indexOf("编辑") != -1) {
				$(this).text($(this).text().replace("编辑","保存"));//.replace("保存","编辑");
				$.each(["#idea","#buys","#sell","#risk"],function(i, n){
					var gridObj = $(n+'grid').data('slickgrid');
					if(gridObj){
						gridObj.grid.setOptions({autoEdit: true,editable:true});
					}
				});
			}else{
				$(this).text($(this).text().replace("保存","编辑"));
				var temp = {ver:userdata.ver},change=false;
				$.each(["#idea","#buys","#sell","#risk"],function(i, n){
					var gridObj = $(n+'grid').data('slickgrid');
					if(gridObj){
						//gridObj.grid.getEditorLock().commitCurrentEdit();
						gridObj.grid.setOptions({autoEdit: false,editable:false});
						temp[n.substr(1)] = gridObj.grid.getData();
						if( JSON.stringify(userdata[n.substr(1)]) !=  JSON.stringify(temp[n.substr(1)]))
							change = true;
					}
				});
				if(change){
					var old  = $.extend({},userdata);
					delete(old.stocklist);
					localStorage.setItem(user+temp.ver,JSON.stringify(old));
					temp.ver = userdata.ver + 1;
					$.extend(userdata,temp);
					setud();
				}

			}

		});
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
		var dgs = [ {id: "idea", name: "选股依据"},
					{id: "buys", name: "把握买点"},
					{id: "sell", name: "把握卖点"},
					{id: "risk", name: "风险控制"}];
		function makegrid(item) {
		    var checkboxSelector = new Slick.CheckboxSelectColumn({
		      cssClass: "slick-cell-checkboxsel"
		    });
			var grid = $('#'+item.id+'grid').slickgrid({
			    columns: [checkboxSelector.getColumnDefinition(),
			    	$.extend({field: "name", editor: Slick.Editors.Text, width: 200,headerCssClass:"alert alert-info"},item)],
			    data: [],slickGridOptions: gridoptions,	selhand:new Slick.EventHandler()
			}).data('slickgrid').grid;
			grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
			grid.registerPlugin(checkboxSelector);

/**			grid.onHeaderClick.subscribe(function(e,obj){
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
*/			grid.onAddNewRow.subscribe(function (e, args) {
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
			var pn = n.substr(1);
			if(gridObj ){
				var grid = gridObj.grid;
				var data = $.parseJSON(localStorage.getItem(user+$('#myLargeModalLabel').data('sid')))||{};
				if(!data.ver || data.ver == userdata.ver){
					gridObj.wrapperOptions.data=userdata[pn].slice(0);
					grid.setData(userdata[pn].slice(0));		
				}else{
					var vdata = $.parseJSON(localStorage.getItem(user+data.ver))||{};
					gridObj.wrapperOptions.data=vdata[pn]||[];
					grid.setData(vdata[pn]||[]);
				}
				grid.render();
				var _handler = gridObj.wrapperOptions.selhand;
				_handler.unsubscribeAll();		
				var chk = data[pn]||[];
				grid.setSelectedRows(chk);
				_handler.subscribe(grid.onSelectedRowsChanged,
          			function(e,obj){
						var data = $.parseJSON(localStorage.getItem(user+$('#myLargeModalLabel').data('sid')))||{};
						data[pn] = obj.rows;
						data.ver = userdata.ver;
						localStorage.setItem(user+$('#myLargeModalLabel').data('sid'),JSON.stringify(data));
					});
			}
		});
	}
};
var editDialog = {
	init:function() {
		$('#editdialog').one('shown.bs.modal', editDialog.createGrid);
		$('#editdialog').on('shown.bs.modal', editDialog.fillGrid);
		$('#editdialog').on('hide.bs.modal', function() {
			var data = $.parseJSON(localStorage.getItem(user+$('#myLargeModalLabel').data('sid')))||{};
			data.com = $('#comgrid').data('slickgrid').grid.getData();
			data.tag = $('#tagsgrid').data('slickgrid').grid.getSelectedRows();
			localStorage.setItem(user+$('#myLargeModalLabel').data('sid'),JSON.stringify(data));
			//TODO 再存一个tag的stocklist
		});
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
		grid.onClick.subscribe(function(e,args){
			var $elm = $(e.target);
			if ($elm.hasClass('badge')) {
				var grid = args.grid,data = grid.getData();
		    	grid.invalidateRow(data.length);
		    	data.splice(args.row,1);
		    	grid.updateRowCount();
		     	grid.render();
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
		grid = $('#tagsgrid').slickgrid({
		    columns: [checkboxSelector.getColumnDefinition(),
		    	{id: "tags", name: "", field: "name", width: 200}],
		    data: publicTag,slickGridOptions: gridoptions
		}).data('slickgrid').grid;
		$('#tagsgrid>div.slick-header').hide();
		grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
		grid.registerPlugin(checkboxSelector);
	},
	fillGrid:function() {
		var gridObj = $('#comgrid').trigger("resize.slickgrid").data('slickgrid');
		var data = $.parseJSON(localStorage.getItem(user+$('#myLargeModalLabel').data('sid')))||{};
		var com = data.com||[];
		if(gridObj && data){
			gridObj.wrapperOptions.data=com;
			gridObj.grid.setData(com);
			gridObj.grid.render();
			gridObj.grid.setActiveCell(com.length,0);
			gridObj.grid.editActiveCell();
			$('#tagsgrid').trigger("resize.slickgrid").data('slickgrid').grid.setSelectedRows(data.tag||[]);
		}
	}
};

$(function($) {


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
 			userdata.stocklist = sc+','+userdata.stocklist;
 			setud();
 		}
	});

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
			$.each(["#com","#tag"],function(i, n){
				if(bid == n)
					$(n+'list').show();
				else
					$(n+'list').hide();
			});
		});
	}
	$.each(["#com","#tag"],function(i, n){ 
		initbtn(n);
	});
	//$('#editdialog').on('hidden.bs.modal', function (e) {
	  	//$("#conlist,#comlist,#taglist").show();
	//})
});
