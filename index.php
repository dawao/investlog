<!DOCTYPE html>
<html>
  <head>
    <title>鉴股</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <!-- Bootstrap //lib.sinaapp.com/-->
    <link href="//lib.sinaapp.com/js/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link rel="stylesheet" href="slickgrid/slick.grid.css" type="text/css"/>
    <style>
      body.modal-open, .modal-open .navbar-fixed-top, .modal-open .navbar-fixed-bottom {
      margin-right: 0px;//改成0弹出对话框body不向左动
      }
    </style>
    <script type="text/javascript">
<?php

	$mysql = new SaeMysql();

	$sql = "SELECT * FROM `plan` LIMIT 10";
	$data = $mysql->getData( $sql );
	echo "var firstplans = " . json_encode($data) . ";";
	// $name = strip_tags( $_REQUEST['name'] );
	// $age = intval( $_REQUEST['age'] );
	// $sql = "INSERT  INTO `user` ( `name` , `age` , `regtime` ) VALUES ( '"  . $mysql->escape( $name ) . "' , '" . intval( $age ) . "' , NOW() ) ";
	// $mysql->runSql( $sql );
	if( $mysql->errno() != 0 )
	{
	    die( "Error:" . $mysql->errmsg() );
	}

	$mysql->closeDb();

	?>
	</script>
  </head>
  <body>
    <nav  class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#plan">首页</a>
        </div>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
          <ul class="nav navbar-nav">
            <li><a href="#proc">策略</a></li>
            <li><a href="#item">条件选项</a></li>
            <li class="dropdown">
              <a data-target="#" href="#statistics" class="dropdown-toggle" data-toggle="dropdown">统计<b class="caret"></b></a>
              <ul class="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li class="divider"></li>
                <li class="dropdown-header">Nav header</li>
                <li><a href="#">Separated link</a></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
          </ul>
          <form class="navbar-form navbar-right">
            <div class="form-group">
              <input type="text" placeholder="股票" class="form-control">
            </div>
            <div class="form-group">
              <input type="text" placeholder="策略" class="form-control">
            </div>
            <button type="submit" class="btn btn-success">查询交易计划</button>
          </form>
        </div><!--/.navbar-collapse -->
      </div>
    </nav>

    <div class="jumbotron" style="padding-bottom: 0px;">
      <div class="container"><h2 class="text-primary">计划你的交易　交易你的计划</h2>
      <p class="text-muted">不同的人需要不同的方法，帮助爱学习爱折腾的股民，方便的创建交易计划，方便跟踪、改进、统计、定制交易计划，不断积累，提高水平。</p></div>
    </div>

    <div id="item" class="container mmcc" style="min-height: 300px;display:none;">

      <!-- Modal <a data-toggle="modal" href="itemform.html" data-target="#itemform" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-plus"></span></a>-->
      <div class="modal fade" id="itemform" tabindex="-1" role="dialog" aria-labelledby="itemformLabel" aria-hidden="true"></div><!-- /.modal -->
      <div id="itemgrid" class='grid' style="height: 310px;"></div>
 
    </div>
    <div id="proc" class="container mmcc" style="min-height: 300px;display:none;">
      <div id="procgrid" class='grid' style="height: 310px;"></div>
      <div class="modal fade" id="procform" tabindex="-2" role="dialog" aria-labelledby="procformLabel" aria-hidden="true"></div><!-- /.modal -->
    </div>
    <div id="plan" class="container mmcc" style="min-height: 300px;">
      <div id="plangrid" class='grid' style="height: 310px;"></div>
      <div class="modal fade" id="planform" tabindex="-3" role="dialog" aria-labelledby="planformLabel" aria-hidden="true"></div><!-- /.modal -->
    </div>
    <div id="statistics" class="container mmcc" style="min-height: 300px;display:none;">
        <script type="text/javascript" charset='GBK' src="http://finance.sina.com.cn/basejs/suggestServer.js"></script>
        <div style="position:relative;zoom:1;z-index:900;"><div style="display: none;"></div><div style="opacity: 0.95; position: absolute; width: 180px; z-index: 999; top: 6px; left: 0px; margin-top: 19px; display: none;"></div><input name="symbol" id="symbol" value="请输入股票代码" onblur="if(this.value == '') this.value='请输入股票代码';" onfocus="if(this.value == '请输入股票代码') this.value='';" class="reportinput" autocomplete="off"></div>
        <script type="text/javascript">(new SuggestServer()).bind({"input": "symbol", "value": "@3@", "type": "stock", "width": 180});</script>
        <div id="statisticsgrid" class='grid' style="height: 310px;"></div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <h3 class="text-info">兴趣</h3>
          <p class="text-muted">为自己做一款应用</p>
        </div>
        <div class="col-lg-4">
          <h3 class="text-info">分享</h3>
          <p class="text-muted">成就发微博与好友共同成长</p>
       </div>
        <div class="col-lg-4">
          <h3 class="text-info">技术</h3>
          <p class="text-muted">只支持现代浏览器</p>
        </div>
      </div>
      <footer>
        <p>&copy; Company 2013</p>
      </footer>
    </div> <!-- /container 
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script type="text/javascript" src="//lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js"></script>
    <script type="text/javascript" src="slickgrid/lib/jquery.event.drag-2.2.js"></script>
    <!-- Include all compiled plugins (below),  //lib.sinaapp.com/-->
    <script type="text/javascript" src="//lib.sinaapp.com/js/bootstrap/3.0.0/js/bootstrap.min.js"></script>
    <!-- slickgrid -->
    <script type="text/javascript" src="slickgrid/slick.core.js"></script>
    <script type="text/javascript" src="slickgrid/slick.grid.js"></script>
    <script type="text/javascript" src="slickgrid/plugins/slick.rowselectionmodel.js"></script>
    <script type="text/javascript" src="slickgrid/plugins/slick.checkboxselectcolumn.js"></script>
    <!-- bootstrap helper -->
    <script type="text/javascript" src="js/bootstrap-slickgrid.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
  </body>
</html>