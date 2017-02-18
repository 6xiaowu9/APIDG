var random = Math.random();
var app = angular.module("API8192",[]);
	app.directive('onFinishRender', function ($timeout) {
	    return {
	        restrict: 'A',
	        link: function (scope, element, attr) {
	            if (scope.$last === true) {
	                $timeout(function () {
	                    scope.$emit('ngRepeatFinished');
	                });
	            }
	        }
	    }
	});
	app.controller("apiContent",function( $scope, $http, $location ){
		// console.log($http);
  		$http.get("./json/catalog.json?name="+random).success(function(response) {
		    $scope.catalogs = response;
			var url = $location.absUrl();
			if( url.indexOf("?") > 0 ){
				var params = formatUrlParams( url );
				$scope.apiTitle = inJsonArray( $scope.catalogs, 'name' ,params['name'] );
		  		$http.get("./json/api/"+MD5( params['name'] )+".json?name="+random).success(function(response) {
				    $scope.apis = response;
				    for (var key in $scope.apis ) {
				    	$scope.apis[key].responseString = formatJson( $scope.apis[key].responseString );
				    }
				    $scope.show = true;
			  	});
		  	}else{
		  		var json = new Object();
		  		json.title = "应用程序接口文档生成程序";
		  		$scope.apiTitle = json;
		  		$scope.show = false;
		  	}
	  	});
		$scope.deleteApi = function( httpUrl ){
			if( !confirm("是否确定删除该api文档") ){
				return false;
			}
	  		$http.get("./json/api/"+MD5( $scope.apiTitle.name )+".json?name="+random).success(function(response) {
		  		for(var key in response){
		  			if( response[key].httpUrl == httpUrl){
		  				response.pop( key );
		  			}
		  		}
		  		$scope.apis = response;
		  		for (var key in $scope.apis ) {
			    	$scope.apis[key].responseString = formatJson( $scope.apis[key].responseString );
			    }
		  		$http.post("./save.php",{json:formatJson( response ), type:"api", name:$scope.apiTitle.name}).success(function(response) {
					if(response){
						alert("操作成功！");
						window.location = "./index.html";
					}
				}).error(function(data){
					alert("保存失败！");
				});
	  		});
	  	}
		$scope.deleteCatalog = function( name ){
			if( !confirm("是否确定删除该目录以及目录下的api文档") ){
				return false;
			}
	  		$http.get("./json/catalog.json?name="+random).success(function(response) {
		  		var catalogs = deleteCatalog( response, name );
		  		// console.log( catalogs );
		  		if( !catalogs ){
		  			return false;
		  		}
		  		$scope.catalogs = catalogs;
		  		$http.post("./save.php",{json:formatJson( catalogs ), type:"deleteCatalog", name:name}).success(function(response) {
					if(response){
						alert("操作成功！");
						window.location = "./index.html";
					}
				}).error(function(data){
					alert("保存失败！");
				});
	  		});
	  	}
	  	$scope.isArray = function( value ){
	  		return isArray( value );
	  	}
	  	$scope.dataType = function( value ){
	  		return dataType(value);
	  	}
	})
	.controller("addCatalog",function( $scope, $http, $location ){
		var params;
  		$http.get("./json/catalog.json?name="+random).success(function(response) {
		    $scope.catalogs = response;

			var url = $location.absUrl();
			if( url.indexOf("?") > 0 ){
				params = formatUrlParams( url );
				params = inJsonArray( $scope.catalogs, 'name' ,params['name'] );
				$scope.name = params.name;
				$scope.title = params.title;
				$scope.new = false;
			}else{
				$scope.name = "目录名称";
				$scope.title = "这里是很长的一个大标题";
				$scope.new = true;
			}
	  	});
	  	$scope.addCatalog = function(){
	  		var newCatalog = new Object();
	  		newCatalog.name = $scope.name;
	  		newCatalog.title = $scope.title;
	  		$http.get("./json/catalog.json?name="+random).success(function(response) {
				var catalogs = response;
				if( !isArray( catalogs ) ){
					catalogs = new Array();
				}
				if( inJsonArray( catalogs, "name", $scope.name ) ){
	  				alert("未更改或该名称已经存在...");
		  			return false;
		  		}
		  		if( !$scope.new ){
					var json = inJsonArray( catalogs, "name", params.name, newCatalog );
					$http.post("./save.php",{json:formatJson(json), type:'catalog', name:params.name, newName:newCatalog.name}).success(function(response){
						if(response){
							alert("操作成功！");
							window.location = "./index.html";
						}

					});
					return false;
		  		}
		  		return false;
	  			var position = $(".ng-scope select:last option:selected").text();
	  			if( position.indexOf(">") < 0 ){
	  				position = $(".ng-scope select:eq(-2) option:selected").text();
	  				if( position.indexOf(">") > 0 ){
	  					catalogs = formatCatalog( catalogs, newCatalog, position.substring(0, position.indexOf(">")-1));
	  				}else{
	  					catalogs.push( newCatalog );
	  				}
	  			}else{
					catalogs = formatCatalog( catalogs, newCatalog, position.substring(0, position.indexOf(">")-1));
	  			}
  				$http.post("./save.php",{json:formatJson(catalogs), type:'catalog', name:newCatalog.name}).success(function(response){
					if(response){
						alert("操作成功！");
						window.location = "./index.html";
					}

				})
	  		});
	  		
	  	}
	})
	.controller("addApi",function( $scope, $http, $location){
		var oldJsonArray = new Array();
  		$http.get("./json/catalog.json?name="+random).success(function(response){
		    var url = $location.absUrl();
			var params = formatUrlParams( url );
			$scope.apiTtile = inJsonArray( response, 'name' ,params['name'] );
	  		$http.get("./json/api/"+MD5( $scope.apiTtile.name )+".json?name="+random).success(function(response) {
	  			oldJsonArray = response;
				if( params['httpUrl'] ){
						$scope.api = inJsonArray( oldJsonArray, 'httpUrl' ,params['httpUrl'] );
				    	$scope.responseString = $scope.api.responseString;
				    	$scope.api.responseString = formatJson( $scope.api.responseString );
						$scope.httpUrl = $scope.api.httpUrl;
						$scope.httpMethod = $scope.api.httpMethod;
						$scope.apiName = $scope.api.apiName;
		  				$scope.apiDescreapt = $scope.api.apiDescreapt;
				}else{
					$scope.httpUrl = url.substring(0,  url.indexOf("?"));
					$scope.httpMethod  = "GET, POST or JSONP";
					$scope.apiName = "名称";
					$scope.apiDescreapt = "描述";
				}
			});
	  		$http.get("./json/method.json").success(function(response) {
			    $scope.methods = response;
		  	});
	  	});
	  	$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {
	  		$scope.api ?  
	  		$("input:radio[value='"+$scope.httpMethod+"']").attr("checked",'checked') : 
	  		$("input:radio[value='GET']").attr("checked",'checked');
	  	})
	  	$scope.addApi = function(){
  			$scope.httpMethod = $("input:radio:checked").val();
  			var json = new Object();
	  		$scope.api = null;
			var params = formatUrlParams( $scope.httpUrl );
			if( params ){
		    	json.request = formatApiJson( params );	
			}
			switch( $scope.httpMethod ){
		  			case "GET" :
				  		$http.get($scope.httpUrl).success(function(response) {
						    json.response = formatApiJson( response );
						    json.responseString = formatJson( formatApiJsonString( response ) );
				  			$scope.api = json;
				  			$scope.responseString = formatApiJsonString( response );
		  				}).error( function( data ){
		  					alert("不支持GET");
						});
		  				break;
		  			case "POST" :
		  				$http.post($scope.httpUrl,{json:formatJson( formatUrlParams( $scope.httpUrl ) ), type:"api"}).success(function(response) {
		  				    json.response = formatApiJson( response );
						    json.responseString = formatJson( formatApiJsonString( response ) );
				  			$scope.api = json;
				  			$scope.responseString = formatApiJsonString( response );
					  	}).error( function( data ){
		  					alert("不支持JSONP");
					  	});
		  				break;
		  			case "JSONP" :
		  				var url = ($scope.httpUrl.indexOf("?") > 0 ? "&" : "?" )+ "callback=JSON_CALLBACK";
				  		$http.jsonp($scope.httpUrl + url).success(function(response) {
						    json.response = formatApiJson( response );
						    json.responseString = formatJson( formatApiJsonString( response ) );
				  			$scope.api = json;
				  			$scope.responseString = formatApiJsonString( response );
				  			// console.log(json);
					  	}).error( function( data ){
		  					alert("不支持JSONP");
					  	});
		  				break;
		  			default:
		  				alert("非法错误！");
		  				return false;
		  				break;

		  		}
	  	}
	  	$scope.saveApi = function(){
	  		var apiDescreaptValue = new Array();
	  		$(".api-content input[type='text']").each(function(){
	  			apiDescreaptValue[ $(this).attr("name") ] = $(this).val();
	  		});
  			var json = new Array();
  			isNull( oldJsonArray ) ? true : json = oldJsonArray; 
	  		var data = new Object();
	  		data.apiName = $scope.apiName;
	  		data.apiDescreapt = $scope.apiDescreapt;
	  		data.httpUrl = $scope.httpUrl;
	  		data.httpMethod = $scope.httpMethod;
	  		data.request = isNull($scope.api.request) ? "" : formatApiDescreaptArray($scope.api.request, apiDescreaptValue) ;
	  		data.response = isNull($scope.api.response) ? "" : formatApiDescreaptArray($scope.api.response, apiDescreaptValue) ;
	  		data.responseString = $scope.responseString;
  			if( json.length > 0 ){
	  			json = inJsonArray(json, "httpUrl", $scope.httpUrl, data);
  			}else{
	  			json.push(data);
  			}
			$http.post("./save.php",{json:formatJson( json ), type:"api", name:$scope.apiTtile.name}).success(function(response) {
				if(response){
					alert("操作成功！");
					window.location = "./index.html?name="+$scope.apiTtile.name;
				}
			}).error(function(data){
				alert("保存失败！");
			});
	  	}

	  	$scope.isArray = function( value ){
	  		return isArray( value );
	  	}
	  	$scope.dataType = function( value ){
	  		return dataType(value);
	  	}
	})