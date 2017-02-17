// 格式化api JSON数据为可用类型
function formatApiJsonString( data , prevData){
	if( isObject( data ) ){
		var json = new Object();
		var hash = 0;
		for( var key in data ){
			if( isNull( prevData ) ? true : !prevData.hasOwnProperty( key ) ){
				switch( true ){
					case isObject( data[key] ):
						json[key] = formatApiJsonString( data[key] );
						break;
					case isArray( data[key] ):
						json[key] = formatApiArrayString( data[key] );
						break;
					default :
						json[key] = data[key];
						break;
				}
			}
		}
		return json;
	}else{
		// alert( "formatApiJsonString不是JSON" );
		return data;
	}
}
// 格式化api Array数据为可用类型
function formatApiArrayString( data ){
	if( isArray( data ) ){
		var array = new Array();
		var prevKey;
		for( var key in data ){
			var json = formatApiJsonString( data[key], data[prevKey] );
			array = array.concat(json);
			prevKey = key;
		}
		return array;
	}else{
		alert( "formatApiArrayString不是Array");
		return false;
	}
}
// 格式化api JSON数据为可用类型
function formatApiJson( data , prevData, apiDescreaptValue){
	if( isObject( data ) ){
		var array = new Array();
		var hash = 0; 
		for( var key in data ){
			if( isNull( prevData ) ? true : !prevData.hasOwnProperty( key ) ){
				var json = new Object();
				json.key = key;
				json.hash = MD5( ++hash + key );
				json.apiDescreapt = isNull(apiDescreaptValue) ?
				"" : apiDescreaptValue.hasOwnProperty(json.hash) ?
				apiDescreaptValue[json.hash] : "";
				switch( true ){
					case isObject( data[key] ):
						json.value = formatApiJson( data[key] , null, apiDescreaptValue);
						break;
					case isArray( data[key] ):
						json.value = formatApiArray( data[key] , apiDescreaptValue);
						break;
					default :
						json.value = data[key];
						break;
				}
				array.push( json );
			}
		}
		return array;
	}else{
		return data;
		// alert( "formatApiJson不是JSON" );
		return false;
	}
}
// 格式化api Array数据为可用类型
function formatApiArray( data ,apiDescreaptValue){
	if( isArray( data ) ){
		var array = new Array();
		var prevKey;
		for( var key in data ){
			switch( true ){
				case isObject( data[key] ):
					var json = formatApiJson( data[key], data[prevKey] ,apiDescreaptValue);
					array = array.concat(json);
					prevKey = key;
					break;
				default :
				// console.log(data[key]);
					return data[key];
					break;
			}
		}
		return array;
	}else{
		alert( "formatApiArray不是Array");
		return false;
	}
}
// 格式化api JSON数据为可用类型
function formatApiDescreaptJson( data , apiDescreaptValue){
	if( isObject( data ) ){
		data.apiDescreapt = apiDescreaptValue[data.hash];
		if( isArray( data['value'] ))
			data.value = formatApiDescreaptArray( data.value , apiDescreaptValue);
		return data;
	}else{
		alert( "formatApiDescreaptJson不是JSON" );
		return false;
	}
}
// 格式化api Array数据为可用类型
function formatApiDescreaptArray( data ,apiDescreaptValue){
	if( isArray( data ) ){
		for( var key in data ){
			data[key] = formatApiDescreaptJson( data[key], apiDescreaptValue);
		}
		return data;
	}else{
		alert( "formatApiDescreaptArray不是Array");
		return false;
	}
}

// 格式化url的参数
function formatUrlParams( url ){
	var json = new Object();
	if( url.indexOf("?") < 0 ){
		return false;
	}
	var params = url.substring( url.indexOf("?")+1 ).split("&");
	for ( var key in params ) {
		var param = params[key].split("=");
		json[param[0]] = decodeURI( param[1] );
	}
	return json;
}
// 添加目录
function formatCatalog( jsonArray, json, position){
	if( isArray( jsonArray ) ){
		for( var index in jsonArray ){
			var boolean = jsonArray[index].hasOwnProperty("data");
			if( jsonArray[index]["name"] == position ){
				if( !boolean ){
					jsonArray[index]["data"] = new Array();
				}
				jsonArray[index]["data"].push(json);
				break;
			}
			if( boolean ){
				formatCatalog( jsonArray[index]["data"], json, position);
			}
		}
		return jsonArray;
	}else{
		alert("参数不是数组格式！");
		return false;
	}
}

// 判断是否存在该jsonArray
// 这里用来检测键值在jsonArray中的唯一性
function inJsonArray( jsonArray, key, value, data ){
	if( isArray( jsonArray ) ){
		for( var index in jsonArray ){
			if( jsonArray[index].hasOwnProperty(key) ){
				if( jsonArray[index][key] == value && key != "httpUrl"){
					return jsonArray[index];
				}else 
				if( key == "httpUrl" ){
					var boolean = jsonArray[index][key].substring(0, jsonArray[index][key].indexOf("?")) == value.substring(0, value.indexOf("?"));
					// console.log(boolean,data);
					if( boolean ){
						if( data ){
							jsonArray[index] = data;
							return jsonArray;
						}else{
							return jsonArray[index];
						}
					}
				}
			}
			if( jsonArray[index].hasOwnProperty("data") ){
				return inJsonArray( jsonArray[index]["data"], key, value, data);
			}
		}
		if( !boolean && data ){
			jsonArray.push(data);
			return jsonArray;
		}
	}else{
		alert("参数不是数组格式！");
		return false;
	}	
	return false;
}

// 类型判断
function dataType(value){
	switch( typeof(value) ){
		case "boolean":
			return "boolean";
			break;
		case "string":
			return "string";
			break;
		case "number":
			return "number";
			break;
		case "object":
			return isObject(value) ? "object" : isArray(value) ? "array" : "null";
			break;
		case "function":
			return "function";
			break;

	}
}
function isString( value ){
	if(!isNull(value))
	return value.constructor == String;
	return null;
}

function isNumber( value ){
	if(!isNull(value))
	return value.constructor == Number;
	return null;
}
function isObject( value ){
	if(!isNull(value))
	return value.constructor == Object;
	return null;
}
function isArray( value ){
	if(!isNull(value))
	return value.constructor == Array;
	return null;
}


function isNull( value ){
	return !value && value !== 0 && typeof value !== "boolean" ? true : false;
}