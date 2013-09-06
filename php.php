     <?php
       include("conn.php");
        // 执行 SQL 查询
        $query = 'SELECT * FROM item limit 8';
        $result = mysql_query($query) or die('Query failed: ' . mysql_error());
        // 以 HTML 打印查询结果
        echo "<table class='table table-bordered table-hover table-striped'>\n";
        while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
            echo "\t<tr>\n";
            foreach ($line as $col_value) {
                echo "\t\t<td>$col_value</td>\n";
            }
            echo "\t\t<td><span class='glyphicon glyphicon-edit'></span>&nbsp;&nbsp;<span data-type='item' data-uid='".$line['itemid']."' class='glyphicon glyphicon-trash'></span></td>\n";
            echo "\t</tr>\n";
        }
        echo "</table>\n";
        // 释放结果集
        mysql_free_result($result);

        $k=new SaeKV();
        $k->init();
        $k->set('a','aaa');//建立一条字符串数据
        $ret=$k->get('item5');//获得a的值
        var_dump($ret);
        $k->set('b',array('a','b','c'));//可存储数组或对象
        $ret=$k->get("b");//获得b的值
        var_dump($ret);
        $k->delete("a");//删除a
      
      ?>

      <?php
        
        // 执行 SQL 查询
        $query = 'SELECT * FROM proc limit 8';
        $result = mysql_query($query) or die('Query failed: ' . mysql_error());
        // 以 HTML 打印查询结果
        echo "<table class='table table-bordered table-hover table-striped'>\n";
        while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
            echo "\t<tr>\n";
            foreach ($line as $col_value) {
                echo "\t\t<td>$col_value</td>\n";
            }
            echo "\t</tr>\n";
        }
        echo "</table>\n";
        // 释放结果集
        mysql_free_result($result)
      ?>

      <?php
        
        // 执行 SQL 查询
        $query = 'SELECT * FROM plan limit 8';
        $result = mysql_query($query) or die('Query failed: ' . mysql_error());
        // 以 HTML 打印查询结果
        echo "<table class='table table-bordered table-hover table-striped'>\n";
        while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
            echo "\t<tr>\n";
            foreach ($line as $col_value) {
                echo "\t\t<td>$col_value</td>\n";
            }
            echo "\t</tr>\n";
        }
        echo "</table>\n";

        // 释放结果集
        mysql_free_result($result);

        // 关闭连接
        mysql_close($link);
      ?>
