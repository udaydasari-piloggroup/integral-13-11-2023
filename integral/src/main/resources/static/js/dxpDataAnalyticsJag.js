var HtmlEntities = {
	" ": "&nbsp;"
};

var unHtmlEntities = {
	"&nbsp;": " "
};

function showIntelliSenseSuggestions() {
	$(".leftFileUploads").hide();
	$(".visualizationMainDivwrapper").hide();
	$("#visualizeChartAndDataArea").css("width", "99%", "!important");
	switchSmartBiDesignTabs("li_autoSuggestionsView", "visionChartAutoSuggestionsViewId");
	showIntellisenseAutoSuggestions();
}
function showIntellisenseAutoSuggestions() {
	var labelObject = {};
	try {
		labelObject = JSON.parse($("#labelObjectHidden").val());
	} catch (e) {
	}
	var response = "<div id='visionChartsAutoSuggestionsOptionsId' class='visionChartsAutoSuggestionsOptionsClass'>"
		+ "<button type='button' value='Create Chart' class='autoSuggestionclass btn ' onclick=\"createAutoSuggestedChart()\">Create Chart</button>"
		+ "<button type='button' value='View Data' class='autoSuggestionclass btn ' onclick=\"showViewData()\">View Data</button>"
		+ "<button type='button' value='Show DashBoard' class='autoSuggestionclass btn ' onclick=\"ShowDashBoard()\">Show DashBoard</button>"
		+ "</div>";
	$("#dialog").html(response);
	$("#dialog").dialog({
		title: (labelObject["Auto Suggestions"] != null ? labelObject["Auto Suggestions"] : "Auto Suggestions"),
		modal: true,
		width: 400,
		height: 250,
		fluid: true,
		buttons: [{
			/*text: (labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok'),
			click: function() {
				$("#dialog").html("");
				$("#dialog").dialog("close");
				$("#dialog").dialog("destroy");
			}*/

		}],
		open: function() {
			$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
			$(".visionHeaderMain").css("z-index", "999");
			$(".visionFooterMain").css("z-index", "999");
			$(".ui-dialog").addClass("bicolumnPopUp");

		},
		beforeClose: function(event, ui) {
			$(".visionHeaderMain").css("z-index", "99999");
			$(".visionFooterMain").css("z-index", "99999");
		}
	});
}
function createAutoSuggestedChart() {
	$("#dialog").html("");
	$("#dialog").dialog("close");
	$("#dialog").dialog("destroy");
	$.ajax({
		type: "POST",
		url: "getAutoSuggestedChartTypes",
		cache: false,
		dataType: 'html',
		async: false,
		success: function(response) {
			if (response != null && response != '' && response != undefined) {
				response = JSON.parse(response);
				var result = response['result'];
				if (result != null && result != '' && result != undefined) {
					$("#visionChartsAutoSuggestionUserId").append(result);
				}
			}
		},
		error: function(e) {
			console.log(e);
			sessionTimeout(e);
			stopLoader();
		}
	});
}
function ShowDashBoard() {
	$.ajax({
		type: "POST",
		url: "getColumnformStr",
		cache: false,
		dataType: 'html',
		async: false,
		success: function(response) {
			if (response != null && !jQuery.isEmptyObject(response)) {

			}
		},
		error: function(e) {
			console.log(e);
			sessionTimeout(e);
			stopLoader();
		}
	});
}
function executeBIEditorScripts(tabId) {
	var script = "";
	var divId = "";
	var tabIndex = $("#" + tabId).jqxTabs("val");
	var content = $("#" + tabId).jqxTabs('getContentAt', parseInt(tabIndex));
	if (content != null) {
		var spliterIdDiv = content['0'];
		if (spliterIdDiv != null) {
			var spliterId = spliterIdDiv.id;
			console.log(spliterId);
			if (spliterId != null && spliterId != '') {
				divId = spliterId.replace("_splitter", "");
			}
		} else {
			var spliterId = content.id;
			console.log(spliterId);
			if (spliterId != null && spliterId != '') {
				divId = spliterId.replace("_splitter", "");
			}

		}

	}

	var sqlMainEditor = sqlMainEditor = ace.edit(divId);
	var script = sqlMainEditor.getSelectedText();
	if (script == "") {
		script = String(sqlMainEditor.getSession().getValue());
	}

	console.log("data:::" + script);
	if (script != null
		&& $.trim(script) != null
		&& $.trim(script) != ''
		&& $.trim(script) != 'null'
		&& $.trim(script.replace(/[\t\n]+/g, ' ')) != null
		&& $.trim(script.replace(/[\t\n]+/g, ' ')) != ''
		&& $.trim(script.replace(/[\t\n]+/g, ' ')) != 'null'
	) {
		var connectionName = $("#" + divId).attr("data-connction-name");
		$.ajax({
			type: "post",
			traditional: true,
			dataType: 'json',
			url: "executeBISQLQuery",
			cache: false,
			data: {
				script: script,
				connectionName: connectionName
			},
			success: function(response, status, xhr) {
				stopLoader();
				if (response != null && !jQuery.isEmptyObject(response)) {
					if (response['selectFlag']) {
						showBIExecutionResults(script, connectionName, response, divId);
					} else {
						$("#dialog").html(response['message']);
						$("#dialog").dialog({
							title: (labelObject['Message'] != null ? labelObject['Message'] : 'Message'),
							modal: true,
							height: 'auto',
							minWidth: 300,
							maxWidth: 'auto',
							fluid: true,
							buttons: [{
								text: (labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok'),
								click: function() {
									$(this).html("");
									//$(this).dialog("close");
									$(this).dialog("destroy");
								}
							}],
							open: function() {
								$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
								$(".visionHeaderMain").css("z-index", "999");
								$(".visionFooterMain").css("z-index", "999");
							},
							beforeClose: function(event, ui) {
								$(".visionHeaderMain").css("z-index", "99999");
								$(".visionFooterMain").css("z-index", "99999");
							}
						});
					}

				}
			},
			error: function(e) {
				console.log(e);
				sessionTimeout(e);
				stopLoader();
			}
		});
	} else {
		showMesg("No scripts/query to be run");
	}
}
function showBIExecutionResults(script, connectionName, response, divId) {
	if (response != null && !jQuery.isEmptyObject(response)) {
		var result = response['gridObject'];
		var dataFieldsArray = result['datafields'];
		var columnsArray = result['columns'];
		var columnsList = result['columnList'];
		var tableName = response['tableName'];
		var joinQueryFlag = response['joinQueryFlag'];
		var dataTypeCountObj = response['dataTypeCount'];
		var sqlScript;
		/*var regexTableName;*/
		for (var entitykey in HtmlEntities) {
			var entity = HtmlEntities[entitykey];
			var regex = new RegExp(entitykey, 'g');
			sqlScript = script.replace(regex, entity);
			/*regexTableName = tableName.replace(regex, entity);*/
		}
		var resultQuery;
		if (sqlScript.includes('\n')) {
			var sqlScriptArr = sqlScript.split('\n');
			var sqlScriptStr = "";
			for (var i = 0; i < sqlScriptArr.length; i++) {
				sqlScriptStr += sqlScriptArr[i];
			}
			if (sqlScriptStr.includes("'")) {
				sqlScriptStr = sqlScriptStr.replace(/'/g, "\\'");
			}
			if (sqlScriptStr.includes("\r")) {
				var stringToRemove = "\r";
				var sqlScriptStr = sqlScriptStr.replace(new RegExp(stringToRemove, 'g'), "&nbsp;");
			}
			resultQuery = sqlScriptStr;
		} else {
			resultQuery = sqlScript;
		}

		tableName = tableName.replace(/ /gi, ":");
		/*var divStr = "<div class='imgList'>";
		divStr += "<img src='images/Data-Analytics-icon.svg' style='width:28px;cursor:pointer;padding-left:3px;margin-right:5px;' onclick=showQueryCharts('" + resultQuery  + "','" + JSON.stringify(columnsList) + "','"+tableName+"','"+joinQueryFlag+"') title='ShowCharts'>"
		divStr += "</div>";*///commented by sai uday
		/* code by sai uday*/
		for (var i = 0; i < columnsList.length; i++) {
  			columnsList[i] = columnsList[i].trim();	
			}
			
		var columnsLis= JSON.stringify(columnsList);
		columnsLis=columnsLis.replace(/"/g, "'");
		columnsLis = columnsLis.replace(/\\/g, '"');
		columnsLis=columnsLis.toUpperCase(); 
		
		var dataTypeCountObj =  JSON.stringify(dataTypeCountObj);
		dataTypeCountObj = dataTypeCountObj.replaceAll('"', '#');
				
		var divStr = "<div class='imgList'>";
		divStr += "<img src='images/Data-Analytics-icon.svg' style='width:28px;cursor:pointer;padding-left:3px;margin-right:5px;' onclick=\"showQueryCharts('" 
			+ resultQuery + "'," +columnsLis+ ",'" + tableName + "','" + joinQueryFlag + "','Y','"+dataTypeCountObj+"')\" title='ShowCharts'>";
		divStr += "</div>";
		
		/* code by sai uday*/
		$("#visionVisualizeQueryGridButtonsId").html(divStr);
		$("#visionVisualizeQueryGridDataBodyId").html("<div id = 'chartGridDataDiv' class = 'chartGridDataClass'></div>");
		var dataArray = response['dataArray'];
		var data = {
			dataFieldsArray: dataFieldsArray,
			columnsArray: columnsArray,
			query: script
		}

		var totalCount = response['totalCount'];

		var headerTooltipRenderer = function(element) {
			$(element).parent().jqxTooltip({
				position: 'mouse', theme: 'energyblue',
				position: 'bottom-right',
				showArrow: false, content: $(element).text()
			});
		}
		var source =
		{
			type: 'POST',
			datatype: "json",
			datafields: dataFieldsArray,
			data: data,
			url: 'getChartObjectData',
			cache: false,
			root: 'Rows',
			processdata: function(data) {
				showLoader();
				data['getOnlyDataArray'] = 'Y';
			},
			beforeSend: function() {
				//showLoader();

			}, loadError: function(xhr, status, error) {
			}, loadComplete: function(data) {
				//                               
				stopLoader();
			},
			beforeprocessing: function(data) {

				source.totalrecords = data[data.length - 1];
			},

		};
		//                        $("#chartGridDataDiv").jqxGrid({columns: columnsArray});
		/*window.allGridColumns["chartGridDataDiv"] = columnsList;*/
		var dataAdapter = new $.jqx.dataAdapter(source);
		$("#chartGridDataDiv").jqxGrid(
			{
				width: "99%",
				height: '427px',
				source: dataAdapter,
				theme: 'energyblue',
				pagesize: 50,
				sortable: true,
				pageable: true,
				autoheight: true,
				autoloadstate: false,
				autosavestate: false,
				columnsresize: true,
				columnsreorder: true,
				showfilterrow: true,
				filterable: true,
				selectionmode: 'checkbox',
				pagesizeoptions: [10, 50, 100, 1000],
				rendergridrows: function(params) {
					return params.data;
				},
				columnsresize: true,
				columns: columnsArray
			});


		$("#chartGridDataDiv").on('cellbeginedit', function(event) {

			var args = event.args;
			// column data field.
			var dataField = event.args.datafield;
			// row's bound index.
			var rowBoundIndex = event.args.rowindex;
			// cell value
			var value = args.value;
			// cell old value.
			var oldvalue = args.oldvalue;
			$('#' + gridId).jqxGrid('selectrow', rowBoundIndex);
			$("#last-edit-datafield").val(dataField);
			$("#last-edit-row").val(rowBoundIndex);
		});
		$("#chartGridDataDiv").on('cellendedit', function(event) {

			// event arguments.
			var args = event.args;
			// column data field.
			var dataField = event.args.datafield;
			// row's bound index.
			var rowBoundIndex = event.args.rowindex;
			// cell value
			var value = args.value;
			// cell old value.
			var oldvalue = args.oldvalue;
			// row's data.
			var rowData = args.row;



		});
		$("#chartGridDataDiv").on('cellvaluechanged', function(event) {
			var args = event.args;
			var dataField = args.datafield;
			var dataField1 = args.text;
			var rowIndex = args.rowindex;
			var cellValue = args.value;
			var column = $("#chartGridDataDiv").jqxGrid('getcolumn', event.args.datafield).text;
		});
		$("#chartGridDataDiv").on('celldoubleclick', function(event) {
			var args = event.args;
			var dataField = args.datafield;
			var dataField1 = args.text;
			var rowIndex = args.rowindex;
			var cellValue = args.value;
			var column = $("#chartGridDataDiv").jqxGrid('getcolumn', event.args.datafield).text;
			popupedit(column, cellValue);
		});



	}


}

function showQueryCharts(script, columnsList,tableName,joinQueryFlag,prependFlag,dataTypeCountObj,methodName) {
	
	/*for (var entitykey in unHtmlEntities) {
			var entity = unHtmlEntities[entitykey];
			var regex = new RegExp(entitykey, 'g');
			tableName = tableName.replace(regex, entity);
		}*/
		
   var columnsList = JSON.stringify(columnsList);
   var colLength;
	if (columnsList != null && columnsList != '' && columnsList != undefined) {
		columnsList = JSON.parse(columnsList);
	}
	if (columnsList != null && !jQuery.isEmptyObject(columnsList)) {
		colLength = columnsList.length;
	}
	dataTypeCountObj =dataTypeCountObj.replaceAll('#','"');
	if (colLength != null && colLength != '' && colLength != undefined) {
		$.ajax({
			type: "post",
			traditional: true,
			dataType: 'json',
			url: "getSuggestedChartTypesBasedonColumns",
			cache: false,
			data: {
				script: script,
				colLength: colLength,
				columnsList: JSON.stringify(columnsList),   
				tableName:tableName,
				joinQueryFlag:joinQueryFlag,
				prependFlag:prependFlag,
				dataTypeCountObj: dataTypeCountObj,
				methodName:methodName
			},
			success: function(response, status, xhr) {
				stopLoader();
				if (response != null && !jQuery.isEmptyObject(response)) {

					$("#dialog").html(response['result']);
					$("#dialog").dialog({
						title: (labelObject['Message'] != null ? labelObject['Message'] : 'Message'),
						modal: true,
						height: 250,
						width: 200,
						maxHeight: 'auto',
						fluid: true,
						buttons: [{
							/*text: (labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok'),
							click: function() {
								$(this).html("");
								//$(this).dialog("close");
								$(this).dialog("destroy");
							}*/
						}],
						open: function() {
							$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
							$(".visionHeaderMain").css("z-index", "999");
							$(".visionFooterMain").css("z-index", "999");
						},
						beforeClose: function(event, ui) {
							$(".visionHeaderMain").css("z-index", "99999");
							$(".visionFooterMain").css("z-index", "99999");
						}
					});


				}
			},
			error: function(e) {
				console.log(e);
				sessionTimeout(e);
				stopLoader();
			}
		});

	}

}

function getSuggestedChartBasedonCols(columnsList, chartType,tableName,joinQueryFlag,script,prependFlag) {
	tableName= tableName.replaceAll(':', ' ');
	columnsList= columnsList.replaceAll(':', ' ');
	var createcount = 0;
	var axisColumns;
	if (columnsList != null && columnsList != '' && columnsList != undefined) {
		columnsList = JSON.parse(columnsList);
	}
	if (columnsList != null && !jQuery.isEmptyObject(columnsList)) {
		var divStr = "<div id='modalFileCharts' class='modalFileChartsClass row'></div>";
		if($('#modalFileCharts').length){}
		else{
			$("#visionVisualizationDataModalChartViewId").append(divStr);
		}
		var tablesObj = [];
		var axisColumns = [];
		var valueColumn = [];
		var comboColumn = [];
		var columnName = columnsList[0];
		var columnObj = {};
		columnObj['tableName'] = tableName;
		if(!(joinQueryFlag !=null && joinQueryFlag !='' && joinQueryFlag !=undefined && joinQueryFlag !="undefined")){
		columnObj['columnName'] = tableName + "." + columnName;
		}else{
			columnObj['columnName'] =  columnName;
		}
		axisColumns.push(columnObj);
		if (!(tablesObj.indexOf(tableName) > -1)) {
			tablesObj.push(tableName);
		}
		for (var i = 1; i < columnsList.length; i++) {
			//var valueColumn = [];
			var numVal = columnsList[i];
			if (numVal != null && numVal != '' && numVal != undefined) {
				var columnName = numVal;
				if(columnName .indexOf("AS")>-1)
				{
					columnName = columnName.split("AS")[0];
					columnName = columnName.trim();
				}
				if (columnName.indexOf("(") >-1 && columnName.indexOf(")") >-1) {
					var aggColumnName = columnName.substr(0, columnName.indexOf("("));
					var colName = columnName.substr(columnName.indexOf("(") + 1, columnName.length);
					if (colName != null && colName != '' && colName !== undefined ) {
						colName = colName.substr(0, colName.length-1);
						if(!(colName.indexOf(".") > -1)){
							if (!(joinQueryFlag != null && joinQueryFlag != '' && joinQueryFlag != undefined && joinQueryFlag !="undefined")) {
								columnName = aggColumnName + "(" + tableName + "." + colName + ")";
							} else {
								columnName = aggColumnName + "(" + colName + ")";
							}
							
						}
					}
					var valueColumnObj = {};
					var comboColumnObj = {};
					var axixColumnObj ={};
					if(chartType == "BarAndLine"){
						if(i>1){
							comboColumnObj['tableName'] = tableName;
						comboColumnObj['columnName'] =  columnName;
						comboColumnObj['aggColumnName'] = aggColumnName;
						comboColumnObj['columnLabel'] = colName;
						} else{
							valueColumnObj['tableName'] = tableName;
						valueColumnObj['columnName'] =  columnName;
						valueColumnObj['aggColumnName'] = aggColumnName;
						valueColumnObj['columnLabel'] = colName;
						}
						
					} else{
						valueColumnObj['tableName'] = tableName;
						valueColumnObj['columnName'] =  columnName;
						valueColumnObj['aggColumnName'] = aggColumnName;
						valueColumnObj['columnLabel'] = colName;
					}
					
					
				} else {
					var valueColumnObj = {};
					var comboColumnObj = {};
					var axixColumnObj ={};
					valueColumnObj['tableName'] = tableName;
					if(!(columnName.indexOf(".")>-1))
					{
						if (!(joinQueryFlag != null && joinQueryFlag != '' && joinQueryFlag != undefined && joinQueryFlag !="undefined")) {
								columnName = tableName +"."+ columnName;
							} else {
								columnName =  columnName;
							}
					
						
					}
					
					if(chartType == "BarAndLine"){
						if(i>1){
							comboColumnObj['tableName'] = tableName;
						comboColumnObj['columnName'] =  columnName;
						comboColumnObj['aggColumnName'] = "";
						comboColumnObj['columnLabel'] = columnName.split(".")[1];
						} else{
						
						valueColumnObj['columnName'] =  columnName;
						valueColumnObj['aggColumnName'] = "";
						valueColumnObj['columnLabel'] = columnName.split(".")[1];
						}
						
					} else if(chartType == "heatMap" || chartType == "treemap" || chartType == "sunburst"){
						
						valueColumnObj['columnName'] =  columnName;
						valueColumnObj['aggColumnName'] = "";
						valueColumnObj['columnLabel'] = columnName.split(".")[1];
					}  else if(chartType ==  'sankey'){
						if(i<2){
						axixColumnObj['tableName'] = tableName;
						axixColumnObj['columnName'] =  columnName;
						}else{
							valueColumnObj['columnName'] =  columnName;
						valueColumnObj['aggColumnName'] = "";
						valueColumnObj['columnLabel'] = columnName.split(".")[1];
							
						}
						
					} else{
						valueColumnObj['columnName'] = "SUM(" + columnName + ")";
						valueColumnObj['aggColumnName'] = "SUM";
					}
					
				}
				if(Object.keys(axixColumnObj).length > 1){
                                        axisColumns.push(axixColumnObj);
                                }
				if(Object.keys(comboColumnObj).length > 1){
					comboColumn.push(comboColumnObj);
				}
				if(Object.keys(valueColumnObj).length > 1){
					valueColumn.push(valueColumnObj);
				}
			}
		}//FOR LOOP CLOSING STMT
		var dataObj = {};
		dataObj['axisColumns'] = JSON.stringify(axisColumns);
		dataObj['valuesColumns'] = JSON.stringify(valueColumn);
		dataObj['comboColumns'] = JSON.stringify(comboColumn);
		dataObj['tablesObj'] = JSON.stringify(tablesObj);
		dataObj['chartType'] = chartType;
		dataObj['axisColumnName'] = columnsList[0].split(".")[1];

		var number = (Math.random() + ' ').substring(2, 10) + (Math.random() + ' ').substring(2, 10);
		if(prependFlag !=null && prependFlag !='' && prependFlag !=undefined){
		$("#modalFileCharts").prepend("<div id='visionVisualizeSuggestedQueryChart" + number + "' class='col-md-6 col-sm-6 col-lg-4 visionVisualizeSuggestedQueryChartClass visionVisualizeModalChartClass'><div id='visionVisualizeSuggestedQueryInnerChart" + number + "' class='visionVisualizeSuggestedQueryChartInnerClass'></div><div id='visionVisualizeSuggestedQueryInnerChart" + number + "config' class='visionVisualizeSuggestedQueryChartConfigClass' style='display:none'></div></div>");
		}else{
		$("#modalFileCharts").append("<div id='visionVisualizeSuggestedQueryChart" + number + "' class='col-md-6 col-sm-6 col-lg-4 visionVisualizeSuggestedQueryChartClass visionVisualizeModalChartClass'><div id='visionVisualizeSuggestedQueryInnerChart" + number + "' class='visionVisualizeSuggestedQueryChartInnerClass'></div><div id='visionVisualizeSuggestedQueryInnerChart" + number + "config' class='visionVisualizeSuggestedQueryChartConfigClass' style='display:none'></div></div>");
		}
		var chartId = "visionVisualizeSuggestedQueryInnerChart" + number;
		dataObj['chartId'] = chartId;
		var configObj = chartFilterConfigObj[chartType];
		$("#" + chartId + "config").html(configObj);
		var chartOptAllObj = {};
		var chartConfigToggleStatus = {};
		var chartConfigPositionKeyObj = {};
		var errorMessageStr = "";
		var errorCount = 0;
		$("#" + chartId + "config ul li").each(function(i, ele) {
			var optColName = $(this).attr("data-column-name");
			var optKeyType = $(this).attr("data-key-type");
			if (optKeyType != null && optKeyType != '' && optKeyType != undefined) {
				chartConfigPositionKeyObj[optColName] = optKeyType;
			}
			var optName = $("#" + optColName).attr("data-opt-name");
			var optMan = $("#" + optColName).attr("data-man");
			var inputType = $("#" + optColName).attr("type");
			var optValue = $("#" + optColName).val();
			if (inputType == 'checkbox') {
				if ($("#" + optColName).is(':checked')) {
					optValue = true;
				} else {
					optValue = false;
				}
			}
			var isChartHoverActive = $("#toggleButtonForchartHover" + chartType.toUpperCase()).hasClass('active');
			if (!isChartHoverActive && optColName.includes('HOVERLABELDATA')) {
				optValue = 'none';
			}
			if (inputType == 'number') { //nested
				if (optValue != null && optValue != '' && optValue >= 1) {
					optValue = parseInt(optValue);
				}
			}
			var toggleBtnClasses = $(this).find('.toggle-btn').attr('class');
			if (toggleBtnClasses !== null && toggleBtnClasses !== '' && toggleBtnClasses !== undefined) {
				if (toggleBtnClasses.includes('active')) {
					chartConfigToggleStatus[optColName] = true;
				} else {
					chartConfigToggleStatus[optColName] = false;
				}
			}
			var isToggleActive = $(this).hasClass('active-filter');
			if (optValue != null && optValue != '' && isToggleActive) {
				chartOptAllObj[optColName] = optValue;
			} else if (optMan == 'M') {
				errorCount++;
				errorMessageStr += "<tr><td>  " + '<p class="visionGenericTabStatusDialog">' + " " + '<span style="color:blue;">' + " " + optName + "</span><b>:</b> Should not be null.</tr></td><br>";
			} else if (optColName.includes('SHOWLEGEND') && !isToggleActive) {
				chartOptAllObj[optColName] = false;
			}

		});

		var filteredchartOptAllObj = {};
		$.each(chartConfigPositionKeyObj, function(key, value) {  
			var newKey = key.replace(/[0-9]/g, '');
			filteredchartOptAllObj[newKey] = value;
		});
		dataObj["chartPropObj"] = JSON.stringify(chartOptAllObj);
		dataObj["chartConfigPositionKeyStr"] = JSON.stringify(filteredchartOptAllObj);
		dataObj["chartConfigToggleStatus"] = JSON.stringify(chartConfigToggleStatus);
		
		dataObj["columnsKeys"] = JSON.stringify(columnsList);
		var sqlScript;
		for (var entitykey in HtmlEntities) {
			var entity = HtmlEntities[entitykey];
			var regex = new RegExp(entitykey, 'g');
			sqlScript = script.replace(regex, entity);
			/*regexTableName = tableName.replace(regex, entity);*/
		}
		sqlScript = sqlScript.replace(/\xA0/g,' ');
		dataObj["script"] = sqlScript;
		
		$("#" + chartId).attr("dataObj",JSON.stringify(dataObj));
		getModalChartSuggestions(chartId, dataObj, valueColumn, axisColumns, tablesObj, createcount,
			columnsList[0].split(".")[1], chartType, chartOptAllObj, filteredchartOptAllObj, chartConfigToggleStatus); 
		createcount++;
		autoSuggestedChartCount++;
		$("span.visionAutoSuggestionChartCountSpan").text(autoSuggestedChartCount);
		$("#dialog").html("");
		$("#dialog").dialog("close");
		$("#dialog").dialog("destroy");
		switchSmartBiDesignTabs('li_designView', 'visualizeArea');

	}

}

function executePythonBIEditorScripts(tabId) {
	var script = "";
	var divId = "";
	var tabIndex = $("#" + tabId).jqxTabs("val");
	var content = $("#" + tabId).jqxTabs('getContentAt', parseInt(tabIndex));
	if (content != null) {
		var spliterIdDiv = content['0'];
		if (spliterIdDiv != null) {
			var spliterId = spliterIdDiv.id;
			console.log(spliterId);
			if (spliterId != null && spliterId != '') {
				divId = spliterId.replace("_splitter", "");
			}
		} else {
			var spliterId = content.id;
			console.log(spliterId);
			if (spliterId != null && spliterId != '') {
				divId = spliterId.replace("_splitter", "");
			}

		}

	}

	var sqlMainEditor = sqlMainEditor = ace.edit(divId);
	var script = sqlMainEditor.getSelectedText();
	if (script == "") {
		script = String(sqlMainEditor.getSession().getValue());
	}

	console.log("data:::" + script);
	if (script != null
		&& $.trim(script) != null
		&& $.trim(script) != ''
		&& $.trim(script) != 'null'
		&& $.trim(script.replace(/[\t\n]+/g, ' ')) != null
		&& $.trim(script.replace(/[\t\n]+/g, ' ')) != ''
		&& $.trim(script.replace(/[\t\n]+/g, ' ')) != 'null'
	) {
		var connectionName = $("#" + divId).attr("data-connction-name");
		$.ajax({
			type: "post",
			traditional: true,
			dataType: 'json',
			url: "executeBIPythonQuery",
			cache: false,
			data: {
				script: script,
				connectionName: connectionName
			},
			success: function(response, status, xhr) {
				stopLoader();
				if (response != null && !jQuery.isEmptyObject(response)) {
					if (response['selectFlag']) {
						showPythonBIExecutionResults(script, connectionName, response, divId);
					} else {
						$("#dialog").html(response['message']);
						$("#dialog").dialog({
							title: (labelObject['Message'] != null ? labelObject['Message'] : 'Message'),
							modal: true,
							height: 'auto',
							minWidth: 300,
							maxWidth: 'auto',
							fluid: true,
							buttons: [{
								text: (labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok'),
								click: function() {
									$(this).html("");
									//$(this).dialog("close");
									$(this).dialog("destroy");
								}
							}],
							open: function() {
								$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
								$(".visionHeaderMain").css("z-index", "999");
								$(".visionFooterMain").css("z-index", "999");
							},
							beforeClose: function(event, ui) {
								$(".visionHeaderMain").css("z-index", "99999");
								$(".visionFooterMain").css("z-index", "99999");
							}
						});
					}

				}
			},
			error: function(e) {
				console.log(e);
				sessionTimeout(e);
				stopLoader();
			}
		});
	} else {
		showMesg("No scripts/query to be run");
	}
}
function showPythonBIExecutionResults(script, connectionName, response, divId) {
	if (response != null && !jQuery.isEmptyObject(response)) {
		var result = response['gridObject'];
		var dataFieldsArray = result['datafields'];
		var columnsArray = result['columns'];
		var columnsList = result['columnList'];
		var sqlScript;
		for (var entitykey in HtmlEntities) {
			var entity = HtmlEntities[entitykey];
			var regex = new RegExp(entitykey, 'g');
			sqlScript = script.replace(regex, entity);
		}
		var divStr = "<div class='imgList'>";
		divStr += "<img src='images/Data-Analytics-icon.svg' style='width:28px;cursor:pointer;padding-left:3px;margin-right:5px;' onclick=showQueryCharts('" + sqlScript + "','" + JSON.stringify(columnsList) + "') title='ShowCharts'>"
		divStr += "</div>";
		$("#visionVisualizeQueryGridButtonsId").html(divStr);
		$("#visionVisualizeQueryGridDataBodyId").html("<div id = 'chartGridDataDiv' class = 'chartGridDataClass'></div>");
		var dataArray = response['dataArray'];
		var data = {
			dataFieldsArray: dataFieldsArray,
			columnsArray: columnsArray,
			query: script
		}

		var totalCount = response['totalCount'];

		var headerTooltipRenderer = function(element) {
			$(element).parent().jqxTooltip({
				position: 'mouse', theme: 'energyblue',
				position: 'bottom-right',
				showArrow: false, content: $(element).text()
			});
		}
		var source =
		{
			type: 'POST',
			datatype: "json",
			datafields: dataFieldsArray,
			data: data,
			url: 'getPythonChartObjectData',
			cache: false,
			root: 'Rows',
			processdata: function(data) {
				showLoader();
				data['getOnlyDataArray'] = 'Y';
			},
			beforeSend: function() {
				//showLoader();

			}, loadError: function(xhr, status, error) {
			}, loadComplete: function(data) {
				//                               
				stopLoader();
			},
			beforeprocessing: function(data) {

				source.totalrecords = data[data.length - 1];
			},

		};
		//                        $("#chartGridDataDiv").jqxGrid({columns: columnsArray});
		/*window.allGridColumns["chartGridDataDiv"] = columnsList;*/
		var dataAdapter = new $.jqx.dataAdapter(source);
		$("#chartGridDataDiv").jqxGrid(
			{
				width: "99%",
				height: '427px',
				source: dataAdapter,
				theme: 'energyblue',
				pagesize: 50,
				sortable: true,
				pageable: true,
				autoheight: true,
				autoloadstate: false,
				autosavestate: false,
				columnsresize: true,
				columnsreorder: true,
				showfilterrow: true,
				filterable: true,
				selectionmode: 'checkbox',
				pagesizeoptions: [10, 50, 100, 1000],
				rendergridrows: function(params) {
					return params.data;
				},
				columnsresize: true,
				columns: columnsArray
			});


		$("#chartGridDataDiv").on('cellbeginedit', function(event) {

			var args = event.args;
			// column data field.
			var dataField = event.args.datafield;
			// row's bound index.
			var rowBoundIndex = event.args.rowindex;
			// cell value
			var value = args.value;
			// cell old value.
			var oldvalue = args.oldvalue;
			$('#' + gridId).jqxGrid('selectrow', rowBoundIndex);
			$("#last-edit-datafield").val(dataField);
			$("#last-edit-row").val(rowBoundIndex);
		});
		$("#chartGridDataDiv").on('cellendedit', function(event) {

			// event arguments.
			var args = event.args;
			// column data field.
			var dataField = event.args.datafield;
			// row's bound index.
			var rowBoundIndex = event.args.rowindex;
			// cell value
			var value = args.value;
			// cell old value.
			var oldvalue = args.oldvalue;
			// row's data.
			var rowData = args.row;



		});
		$("#chartGridDataDiv").on('cellvaluechanged', function(event) {
			var args = event.args;
			var dataField = args.datafield;
			var dataField1 = args.text;
			var rowIndex = args.rowindex;
			var cellValue = args.value;
			var column = $("#chartGridDataDiv").jqxGrid('getcolumn', event.args.datafield).text;
		});
		$("#chartGridDataDiv").on('celldoubleclick', function(event) {
			var args = event.args;
			var dataField = args.datafield;
			var dataField1 = args.text;
			var rowIndex = args.rowindex;
			var cellValue = args.value;
			var column = $("#chartGridDataDiv").jqxGrid('getcolumn', event.args.datafield).text;
			popupedit(column, cellValue);
		});



	}


}


function getVoiceRply() {
	$('#voiceTextPopover').remove();
	$(".voiceIcon").append("<div id='voiceTextPopover'></div>")
	$("#voiceTextPopover").html("<div class='homeSearchIcon'><textarea id='voiceTextBox'></textarea><img src='images/search_blue1.png' style='width:25px' onclick='showingChartOnVoiceResponse()'/></div>");
	$("#voiceTextPopover").jqxPopover({
					width: 300,
					height:80,
					showArrow: true,
					position: 'bottom',
					selector: $(".voiceIcon")
					
				});
	$(".voiceIcon").find("img").attr("src", "images/voiceLoader.gif");
	$("#voiceTextPopover").jqxPopover('open');
	if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.start();
		recognition.lang = 'en-US';
		$("#voicLoader").show();
		
		recognition.onresult = function(event) {
			const transcript = event.results[0][0].transcript;
			$("#voiceTextBox").val(transcript);
			$(".voiceIcon").find("img").attr("src", "images/Mike-OutLine-Icon-01.png");
			$("#voicLoader").hide();
		};

		recognition.onerror = function(event) {
			console.error('Speech recognition error:', event.error);
		};
	} else {
		alert('Speech recognition is not supported in your browser.');
	}
}
function showingChartOnVoiceResponse() {
	showLoader();
	var inputText = $("#voiceTextBox").val();

	$.ajax({
		type: "POST",
		dataType: 'json',
		traditional: true,
		url: 'getVoiceResponse',
		cache: false,
		data: {
			'inputText': inputText,

		},
		success: function(response) {
			stopLoader();
			if (response != null && response != undefined && response != '' && !jQuery.isEmptyObject(response)) {
				closeDialogBox("#dialog");
				getQueryForVoiceSearch(response["result"]);


			}
			else {
				showMesgModelPopup("<b>Please Try Again...</b>")

			}

		}
	});

}


function getQueryForVoiceSearch(response)
{
	if(response !=null && !jQuery.isEmptyObject(response))
	{
	var query =  response["query"]; 
	if(query !=null && query !='' && query !=undefined ){
		var connectionName = "Current_V10";
	$.ajax({
		type: "POST",
		url: "executeBISQLQuery",
		cache: false,
		dataType: 'json',
		async: false,
		data: {
			script: query,
		    connectionName: connectionName
		},
		success: function(response) {
			if (response != null && !jQuery.isEmptyObject(response)) {
				if (response['selectFlag']) {
					var result = response['gridObject'];
					var columnsList = result['columnList'];
					var tableName = response['tableName'];
					var joinQueryFlag = response['joinQueryFlag'];
					var dataTypeCountObj = response['dataTypeCount'];
					tableName = tableName.replace(/ /gi, ":");
					var sqlScript;
					/*var regexTableName;*/
					for (var entitykey in HtmlEntities) {
						var entity = HtmlEntities[entitykey];
						var regex = new RegExp(entitykey, 'g');
						sqlScript = query.replace(regex, entity);
						/*regexTableName = tableName.replace(regex, entity);*/
					}
					var resultQuery;
					if (sqlScript.includes('\n')) {
						var sqlScriptArr = sqlScript.split('\n');
						var sqlScriptStr = "";
						for (var i = 0; i < sqlScriptArr.length; i++) {
							sqlScriptStr += sqlScriptArr[i];
						}
						if (sqlScriptStr.includes("'")) {
							sqlScriptStr = sqlScriptStr.replace(/'/g, "\\'");
						}
						if (sqlScriptStr.includes("\r")) {
							var stringToRemove = "\r";
							var sqlScriptStr = sqlScriptStr.replace(new RegExp(stringToRemove, 'g'), "&nbsp;");
						}
						resultQuery = sqlScriptStr;
					} else {
						resultQuery = sqlScript;
					}
					for (var i = 0; i < columnsList.length; i++) {
						columnsList[i] = columnsList[i].trim();
					}

					/*var columnsLis = JSON.stringify(columnsList);
					columnsLis = columnsLis.replace(/"/g, "'");
					columnsLis = columnsLis.replace(/\\/g, '"');
					columnsLis = columnsLis.toUpperCase();*/
					var dataTypeCountObj = JSON.stringify(dataTypeCountObj);
					dataTypeCountObj = dataTypeCountObj.replaceAll('"', '#');
					showQueryCharts(resultQuery,columnsList, tableName, joinQueryFlag,"Y",dataTypeCountObj,"getVoiceSuggestedChartBasedonCols");

				} else {
						$("#dialog").html(response['message']);
						$("#dialog").dialog({
							title: (labelObject['Message'] != null ? labelObject['Message'] : 'Message'),
							modal: true,
							height: 'auto',
							minWidth: 300,
							maxWidth: 'auto',
							fluid: true,
							buttons: [{
								text: (labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok'),
								click: function() {
									$(this).html("");
									//$(this).dialog("close");
									$(this).dialog("destroy");
								}
							}],
							open: function() {
								$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
								$(".visionHeaderMain").css("z-index", "999");
								$(".visionFooterMain").css("z-index", "999");
							},
							beforeClose: function(event, ui) {
								$(".visionHeaderMain").css("z-index", "99999");
								$(".visionFooterMain").css("z-index", "99999");
							}
						});
					}

				}
		},
		error: function(e) {
			console.log(e);
			sessionTimeout(e);
			stopLoader();
		}
	});
	}
	}
}

function displayChart(data) {

	var chartData = data['result'];
	var dataTypeCountObj = chartData['dataypes'];
	var axisColName = chartData['axisColName'];
	delete chartData['dataypes'];
	delete chartData['axisColName'];
    var title = $("#voiceTextBox").val();
	var colLength = Object.keys(chartData).length;

	if (colLength != null && colLength != '' && colLength != undefined) {
		$.ajax({
			type: "post",
			traditional: true,
			dataType: 'json',
			url: "getVoiceSuggestedChartsBasedonColumns",
			cache: false,
			data: {
				colLength: colLength,
				columnsList: JSON.stringify(chartData),
				dataTypeCountObj: JSON.stringify(dataTypeCountObj),
				axisColName :axisColName,
				title:title

			},
			success: function(response, status, xhr) {
				stopLoader();
				if (response != null && !jQuery.isEmptyObject(response)) {

					$("#dialog").html(response['result']);
					$("#dialog").dialog({
						title: (labelObject['Message'] != null ? labelObject['Message'] : 'Message'),
						modal: true,
						height: 250,
						width: 200,
						maxHeight: 'auto',
						fluid: true,
						buttons: [{
						}],
						open: function() {
							$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
							$(".visionHeaderMain").css("z-index", "999");
							$(".visionFooterMain").css("z-index", "999");
						},
						beforeClose: function(event, ui) {
							$(".visionHeaderMain").css("z-index", "99999");
							$(".visionFooterMain").css("z-index", "99999");
						}
					});


				}
			},
			error: function(e) {
				console.log(e);
				sessionTimeout(e);
				stopLoader();
			}
		});

	}

}



function viewChartBasedOnType(dataObj, chartType, axisColumnName, title) {
	closeDialogBox("#dialog1");
	if(dataObj !=null && dataObj !='' && dataObj !=undefined)
	{
		dataObj = dataObj.replaceAll("#"," ");
	}
	if(title !=null && title !='' && title !=undefined)
	{
		title = title.replaceAll("#"," ");
	}
	var chartId = 'voiceChartId';
    var htmlStr = "<div id='voiceChartId' class='voiceChartClass'></div>"
    $("#dialog1").html(htmlStr);
	$("#dialog1").dialog({
		title: (labelObject['Message'] != null ? labelObject['Message'] : 'Message'),
		modal: true,
		height: 450,
		width: 500,
		maxHeight: 'auto',
		fluid: true,
		buttons: [{
		}],
		open: function() {
			$("#Loader").css("display", "none");
			$("body").css("pointer-events", "auto");
			if (dataObj != null && dataObj !='' && dataObj !=undefined) {
				dataObj = JSON.parse(dataObj);
				var chartDataObj = dataObj;
				var data = [];
				var layout = {};
				if (chartType !== null && chartType !== '' && chartType !== undefined && chartType === 'pie') {
						$.each(chartDataObj, function(key) {

							var traceObj = {};
							var colorObj = {};
							if (key !== axisColumnName) {
								traceObj['labels'] = chartDataObj[axisColumnName];
								traceObj['values'] = chartDataObj[key];
								traceObj['type'] = chartType;
								traceObj['name'] = 'value';
								traceObj['marker'] = colorObj;
								
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'donut') {
						$.each(chartDataObj, function(key) {

							var traceObj = {};
							var colorObj = {};
							if (key !== axisColumnName) {
								traceObj['labels'] = chartDataObj[axisColumnName];
								traceObj['values'] = chartDataObj[key];
								traceObj['hole'] = 0.4;
								traceObj['type'] = 'pie';
								traceObj['name'] = 'value';
								traceObj['marker'] = colorObj;
								
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && ( chartType == 'bar' 
					 || chartType == 'waterfall' || chartType == 'histogram')) {
						$.each(chartDataObj, function(keyName) {

							var traceObj = {};
							if (keyName !== axisColumnName) {
								if(chartType == 'waterfall'){
									traceObj['x'] = chartDataObj[axisColumnName];
									traceObj['y'] = chartDataObj[keyName];
									traceObj['orientation'] = 'v';
								} else if(chartType == 'histogram'){
									//traceObj['y'] = chartDataObj[axisColumnName];
									traceObj['x'] = chartDataObj[keyName];
								} else{
									traceObj['x'] = chartDataObj[axisColumnName];
									traceObj['y'] = chartDataObj[keyName];
								}
								traceObj['type'] = chartType;
								
						  }
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'column') {
						$.each(chartDataObj, function(keyName) {
							var traceObj = {};
							if (keyName !== axisColumnName) {
								traceObj['x'] = chartDataObj[axisColumnName];
								traceObj['y'] = chartDataObj[keyName];
								traceObj['type'] = "bar";
								
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'lines') {
						$.each(chartDataObj, function(keyName, val) {
							var traceObj = {};
							if (keyName !== axisColumnName) {
								traceObj['x'] = chartDataObj[axisColumnName];
								traceObj['y'] = chartDataObj[keyName];
								traceObj['type'] = chartType;
								
							}

							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'scatter') {
						$.each(chartDataObj, function(keyName, val) {

							var traceObj = {};
							var colorObj = {};
							if (keyName !== axisColumnName) {
								traceObj['x'] = chartDataObj[axisColumnName];
								traceObj['y'] = chartDataObj[keyName];
								traceObj['type'] = chartType;
								traceObj['mode'] = 'markers';
								traceObj['marker'] = colorObj;
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					}else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'indicator') {
						var traceObj = {};
						var domainObj = {};
						var domainArr = [];
						domainArr.push(0);
						domainArr.push(1);
						domainObj["x"] = domainArr;
						domainObj["y"] = domainArr;
						traceObj['domain'] = domainObj;
						traceObj['value'] = chartDataObj[0];
						traceObj['type'] = chartType;
						traceObj['mode'] = "gauge+number";
						if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
							data.push(traceObj);
						}
					}
					 else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'funnel') {
						$.each(chartDataObj, function(key) {
							var traceObj = {};
							if (key !== axisColumnName) {
								traceObj['y'] = chartDataObj[axisColumnName];
								traceObj['x'] = chartDataObj[key];
								traceObj['type'] = chartType;
								//                                traceObj['orientation'] = 'h';
								traceObj['name'] = 'value';
								
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'scatterpolar') {
						$.each(chartDataObj, function(keyName) {
							var traceObj = {};
							if (keyName !== axisColumnName) {
								traceObj['r'] = chartDataObj[keyName];
								traceObj['theta'] = chartDataObj[axisColumnName];
								traceObj['type'] = chartType;
								traceObj['fill'] = 'toself';
								
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'BarAndLine') {
						$(".fileChartsBorder").css("max-width", "100%", "!important");
						getBarAndLineChart(chartId, chartDataObj, 0, chartType);
						return;
					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'treemap') {
						getTreeMapChart(chartId, chartDataObj, 0, chartType);
						return;



					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'sunburst') {
						getSunburstChart(chartId, chartDataObj, 0, chartType);
						return;

					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'heatMap') {
						$(".fileChartsBorder").css("max-width", "100%");
						getEchartHeatMap(chartId, chartDataObj, 0);
						return;
					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'candlestick') {


						$(".fileChartsBorder").css("max-width", "100%", "!important");
						getCandlestickChart(chartId, chartDataObj, 0, chartType);
						return;
					}

					var margin = {};
					if (chartType != null && chartType != '' && chartType != undefined && chartType == 'treemap') {
						margin = {
							l: 0,
							r: 0,
							b: 0,
							t: 30,
							pad: 0
						};
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'column') {
						margin = {
							l: 50,
							r: 50,
							b: 100,
							t: 50
						};

					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'bar') {
						margin = {
							l: 150,
							r: 50,
							b: 50,
							t: 50
						};

					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'lines') {
						margin = {
							l: 50,
							r: 50,
							b: 100,
							t: 50
						};

					} else {
						margin = {
							l: 30,
							r: 50,
							b: 50,
							t: 50
						};
					}
					layout = {
						margin: margin,
						height: 300,
						dragmode: false,
						font: {
							size: 9
						},
						modebar: {
							orientation: 'v',
							color: '#0b4a99',
							activecolor: '#9ED3CD'
						},

						title: {
							text: title,
							font: {
								family: '"Open Sans", verdana, arial, sans-serif',
								size: 12
							},
							xref: 'paper',
							x: 0.1,
						}
					};
					

					


					Plotly.newPlot(chartId, data, layout);
            } 
			$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
			$(".visionHeaderMain").css("z-index", "999");
			$(".visionFooterMain").css("z-index", "999");
		},
		beforeClose: function(event, ui) {
			$(".visionHeaderMain").css("z-index", "99999");
			$(".visionFooterMain").css("z-index", "99999");
		}
	});


}





function getVoiceSuggestedChartBasedonCols(columnsList, chartType,tableName,joinQueryFlag,script,prependFlag) {
	tableName= tableName.replaceAll(':', ' ');
	columnsList= columnsList.replaceAll(':', ' ');
	var createcount = 0;
	var axisColumns;
	if (columnsList != null && columnsList != '' && columnsList != undefined) {
		columnsList = JSON.parse(columnsList);
	}
	if (columnsList != null && !jQuery.isEmptyObject(columnsList)) {
		
		closeDialogBox("#dialog1");
		var number = (Math.random() + ' ').substring(2, 10) + (Math.random() + ' ').substring(2, 10);
		$("#dialog1").html("<div id='visionVisualizeSuggestedQueryChart" + number + "' class='col-md-6 col-sm-6 col-lg-4 visionVisualizeSuggestedQueryChartClass fileVoiceChartsBorder'><div id='visionVisualizeSuggestedQueryInnerChart" + number + "' class='visionVisualizeSuggestedQueryChartInnerClass'></div><div id='visionVisualizeSuggestedQueryInnerChart" + number + "config' class='visionVisualizeSuggestedQueryChartConfigClass' style='display:none'></div></div>");
		$("#dialog1").dialog({
			title: (labelObject['Chart'] != null ? labelObject['Chart'] : 'Chart'),
			width: 650,
			maxWidth: 650,
			height: 400,
			maxHeight: 1000,
			fluid: true,
			buttons: [],
			open: function() {

                var tablesObj = [];
				var axisColumns = [];
				var valueColumn = [];
				var comboColumn = [];
				var columnName = columnsList[0];
				var columnObj = {};
				columnObj['tableName'] = tableName;
				if (!(joinQueryFlag != null && joinQueryFlag != '' && joinQueryFlag != undefined && joinQueryFlag != "undefined")) {
					columnObj['columnName'] = tableName + "." + columnName;
				} else {
					columnObj['columnName'] = columnName;
				}
				axisColumns.push(columnObj);
				if (!(tablesObj.indexOf(tableName) > -1)) {
					tablesObj.push(tableName);
				}
				for (var i = 1; i < columnsList.length; i++) {
					//var valueColumn = [];
					var numVal = columnsList[i];
					if (numVal != null && numVal != '' && numVal != undefined) {
						var columnName = numVal;
						if (columnName.indexOf("AS") > -1) {
							columnName = columnName.split("AS")[0];
							columnName = columnName.trim();
						}
						if (columnName.indexOf("(") > -1 && columnName.indexOf(")") > -1) {
							var aggColumnName = columnName.substr(0, columnName.indexOf("("));
							var colName = columnName.substr(columnName.indexOf("(") + 1, columnName.length);
							if (colName != null && colName != '' && colName !== undefined) {
								colName = colName.substr(0, colName.length - 1);
								if (!(colName.indexOf(".") > -1)) {
									if (!(joinQueryFlag != null && joinQueryFlag != '' && joinQueryFlag != undefined && joinQueryFlag != "undefined")) {
										columnName = aggColumnName + "(" + tableName + "." + colName + ")";
									} else {
										columnName = aggColumnName + "(" + colName + ")";
									}

								}
							}
							var valueColumnObj = {};
							var comboColumnObj = {};
							var axixColumnObj = {};
							if (chartType == "BarAndLine") {
								if (i > 1) {
									comboColumnObj['tableName'] = tableName;
									comboColumnObj['columnName'] = columnName;
									comboColumnObj['aggColumnName'] = aggColumnName;
									comboColumnObj['columnLabel'] = colName;
								} else {
									valueColumnObj['tableName'] = tableName;
									valueColumnObj['columnName'] = columnName;
									valueColumnObj['aggColumnName'] = aggColumnName;
									valueColumnObj['columnLabel'] = colName;
								}

							} else {
								valueColumnObj['tableName'] = tableName;
								valueColumnObj['columnName'] = columnName;
								valueColumnObj['aggColumnName'] = aggColumnName;
								valueColumnObj['columnLabel'] = colName;
							}


						} else {
							var valueColumnObj = {};
							var comboColumnObj = {};
							var axixColumnObj = {};
							valueColumnObj['tableName'] = tableName;
							if (!(columnName.indexOf(".") > -1)) {
								if (!(joinQueryFlag != null && joinQueryFlag != '' && joinQueryFlag != undefined && joinQueryFlag != "undefined")) {
									columnName = tableName + "." + columnName;
								} else {
									columnName = columnName;
								}


							}

							if (chartType == "BarAndLine") {
								if (i > 1) {
									comboColumnObj['tableName'] = tableName;
									comboColumnObj['columnName'] = columnName;
									comboColumnObj['aggColumnName'] = "";
									comboColumnObj['columnLabel'] = columnName.split(".")[1];
								} else {

									valueColumnObj['columnName'] = columnName;
									valueColumnObj['aggColumnName'] = "";
									valueColumnObj['columnLabel'] = columnName.split(".")[1];
								}

							} else if (chartType == "heatMap" || chartType == "treemap" || chartType == "sunburst") {

								valueColumnObj['columnName'] = columnName;
								valueColumnObj['aggColumnName'] = "";
								valueColumnObj['columnLabel'] = columnName.split(".")[1];
							} else if (chartType == 'sankey') {
								if (i < 2) {
									axixColumnObj['tableName'] = tableName;
									axixColumnObj['columnName'] = columnName;
								} else {
									valueColumnObj['columnName'] = columnName;
									valueColumnObj['aggColumnName'] = "";
									valueColumnObj['columnLabel'] = columnName.split(".")[1];

								}

							} else {
								valueColumnObj['columnName'] = "SUM(" + columnName + ")";
								valueColumnObj['aggColumnName'] = "SUM";
							}

						}
						if (Object.keys(axixColumnObj).length > 1) {
							axisColumns.push(axixColumnObj);
						}
						if (Object.keys(comboColumnObj).length > 1) {
							comboColumn.push(comboColumnObj);
						}
						if (Object.keys(valueColumnObj).length > 1) {
							valueColumn.push(valueColumnObj);
						}
					}
				}//FOR LOOP CLOSING STMT
				var dataObj = {};
				dataObj['axisColumns'] = JSON.stringify(axisColumns);
				dataObj['valuesColumns'] = JSON.stringify(valueColumn);
				dataObj['comboColumns'] = JSON.stringify(comboColumn);
				dataObj['tablesObj'] = JSON.stringify(tablesObj);
				dataObj['chartType'] = chartType;
				dataObj['axisColumnName'] = columnsList[0].split(".")[1];

				
				var chartId = "visionVisualizeSuggestedQueryInnerChart" + number;
				dataObj['chartId'] = chartId;
				var configObj = chartFilterConfigObj[chartType];
				$("#" + chartId + "config").html(configObj);
				var chartOptAllObj = {};
				var chartConfigToggleStatus = {};
				var chartConfigPositionKeyObj = {};
				var errorMessageStr = "";
				var errorCount = 0;
				$("#" + chartId + "config ul li").each(function(i, ele) {
					var optColName = $(this).attr("data-column-name");
					var optKeyType = $(this).attr("data-key-type");
					if (optKeyType != null && optKeyType != '' && optKeyType != undefined) {
						chartConfigPositionKeyObj[optColName] = optKeyType;
					}
					var optName = $("#" + optColName).attr("data-opt-name");
					var optMan = $("#" + optColName).attr("data-man");
					var inputType = $("#" + optColName).attr("type");
					var optValue = $("#" + optColName).val();
					if (inputType == 'checkbox') {
						if ($("#" + optColName).is(':checked')) {
							optValue = true;
						} else {
							optValue = false;
						}
					}
					var isChartHoverActive = $("#toggleButtonForchartHover" + chartType.toUpperCase()).hasClass('active');
					if (!isChartHoverActive && optColName.includes('HOVERLABELDATA')) {
						optValue = 'none';
					}
					if (inputType == 'number') { //nested
						if (optValue != null && optValue != '' && optValue >= 1) {
							optValue = parseInt(optValue);
						}
					}
					var toggleBtnClasses = $(this).find('.toggle-btn').attr('class');
					if (toggleBtnClasses !== null && toggleBtnClasses !== '' && toggleBtnClasses !== undefined) {
						if (toggleBtnClasses.includes('active')) {
							chartConfigToggleStatus[optColName] = true;
						} else {
							chartConfigToggleStatus[optColName] = false;
						}
					}
					var isToggleActive = $(this).hasClass('active-filter');
					if (optValue != null && optValue != '' && isToggleActive) {
						chartOptAllObj[optColName] = optValue;
					} else if (optMan == 'M') {
						errorCount++;
						errorMessageStr += "<tr><td>  " + '<p class="visionGenericTabStatusDialog">' + " " + '<span style="color:blue;">' + " " + optName + "</span><b>:</b> Should not be null.</tr></td><br>";
					} else if (optColName.includes('SHOWLEGEND') && !isToggleActive) {
						chartOptAllObj[optColName] = false;
					}

				});

				var filteredchartOptAllObj = {};
				$.each(chartConfigPositionKeyObj, function(key, value) {
					var newKey = key.replace(/[0-9]/g, '');
					filteredchartOptAllObj[newKey] = value;
				});
				dataObj["chartPropObj"] = JSON.stringify(chartOptAllObj);
				dataObj["chartConfigPositionKeyStr"] = JSON.stringify(filteredchartOptAllObj);
				dataObj["chartConfigToggleStatus"] = JSON.stringify(chartConfigToggleStatus);

				dataObj["columnsKeys"] = JSON.stringify(columnsList);
				var sqlScript;
				for (var entitykey in HtmlEntities) {
					var entity = HtmlEntities[entitykey];
					var regex = new RegExp(entitykey, 'g');
					sqlScript = script.replace(regex, entity);
					/*regexTableName = tableName.replace(regex, entity);*/
				}
				sqlScript = sqlScript.replace(/\xA0/g, ' ');
				dataObj["script"] = sqlScript;

				$("#" + chartId).attr("dataObj", JSON.stringify(dataObj));
				getVoiceModalChartSuggestions(chartId, dataObj, valueColumn, axisColumns, tablesObj, createcount,
					columnsList[0].split(".")[1], chartType, chartOptAllObj, filteredchartOptAllObj, chartConfigToggleStatus);





				$("#Loader").css("display", "none");
				$("body").css({ "pointer-events": "auto" });
				$(".visionVisualizationDragColumns").addClass('visionVisualizationDragFilterColumns');
				$("#dialog1").addClass('filterPopUp');
				$(".ui-dialog").addClass('homePageDDSlicer');
				$(".ui-dialog").css("z-index", "9999"); //jaggu 
			},
			beforeClose: function(event, ui) {

			}
		});
		
		
	}

}




function getVoiceModalChartSuggestions(chartId, dataObj, valueColumns, axisColumns, tablesObj, createcount,
	axisColName, chartType, chartOptAllObj, filteredchartOptAllObj, chartConfigToggleStatus,flag) {
    var tchartId = chartId;
    if(chartType != null && chartType != '' && chartType == 'card'){
        		$.ajax({
        		url: 'fetchCardFromQuestion',
        		type: "POST",
        		data: dataObj,
        		dataType: 'json',
        		traditional: true,
        		cache: false,
        		success: function(response) {
        			stopLoader();

        			if (response != null && !jQuery.isEmptyObject(response)) {
        				var result = response['value'];
        				var chartId = response['chartId'];
        				$('.fileVoiceChartsBorder').addClass("voiceModelup");
        				var parentChartId = $("#" + chartId).parent().attr('id');
                                 $("#" + parentChartId).addClass("fileChartsBorder");
                        var chartTitle = $("#myInput").val() ?? $("#voiceTextBox").val();
        				$("#"+chartId).html(`<div class='showCardTitleAndResultFromVoiceCLS'><div class='showCardTitleFromVoiceCLS' id='showCardTitleFromVoiceID'>${chartTitle}</div><div class='showCardFromQuestionsCLS' id='showCardFromQuestionID'>${result}</div></div>`);
                            				$(".showCardFromVoiceCLS").css('width', '100%', '!important');
        				$(".showCardFromVoiceCLS").css('height', '100%', '!important');



        			}

        		}, error: function(e) {
        			console.log("The Error Message is:::" + e.message);
        			sessionTimeout(e);
        		}
        	});
        	}
        	else{
	$.ajax({
		url: 'fetchModalChartData',
		type: "POST",
		data: dataObj,
		dataType: 'json',
		traditional: true,
		cache: false,
		success: function(response) {
			$("#Loader").css("display", "none");
			$("body").css("pointer-events", "auto");
			$("#modalDataDialog").addClass("modalChartsPopup");
			if (response['flag'] == 'Y' || (response != null && !jQuery.isEmptyObject(response) && response['data'] != null && !jQuery.isEmptyObject(response['data']))) {
				var resultObj = response;
				var chartDataObj = resultObj['data'];
				var dataPropObject = resultObj['dataPropObject'];
				var chartId = resultObj['chartId'];
				var layoutObj = resultObj['layout'];
				var number = resultObj['number'];
				var data = [];
				var layout = {};
				var axisColumnName;
				var valuesColumnName;
				var defaultLegendNames = {};
				var userProvidedLegendNames = {};
				var title = "";
				if(chartId == undefined){
					chartId = tChartId;
				}
				if  (response['flag'] == 'Y' || (chartDataObj != null && chartDataObj != '' && !jQuery.isEmptyObject(chartDataObj))) {
					$.each(valueColumns, function(index, value) {
						var valueColName = value.columnName;
						var valueName = "";
						if(valueColName !=null && valueColName !='' && valueColName !=undefined && valueColName.indexOf(".")>-1)
						{
							 valueName = value.columnName.split(".")[1];
						}else{
							 valueName = value.columnName;
						}
						
						valuesColumnName = valueName.replace(/[()]/g, "");
						valuesColumnName = valuesColumnName.replace(/_/g, " ");
						defaultLegendNames[valuesColumnName] = valuesColumnName;
						var legendLabels = value['userProvidedLegendLabel'];
						if (legendLabels !== '' && legendLabels !== undefined && legendLabels !== null) {
							userProvidedLegendNames[valuesColumnName] = legendLabels;
						}
						title += valuesColumnName;
						if (index < (valueColumns.length - 1)) {
							title += " and ";
						}
					});
					$.each(axisColumns, function(index, value) {
						var axisName = value.columnName.split(".")[1];
						if(!(axisName !=null && axisName !='' && axisName !=undefined))
						{
							axisName = value.columnName;
						}
						axisColumnName = axisName.replace(/[()]/g, "");
						axisColumnName = axisColumnName.replace(/_/g, " ");
						defaultLegendNames[axisColumnName] = axisColumnName;
						title += " by " + axisColumnName;
					});

					var initTitle = "";
					if (title != null && title != '' && title != undefined) {
						title = title.split(' ');
						for (var chr = 0; chr < title.length; chr++) {
							initTitle += title[chr].substring(0, 1).toUpperCase() + title[chr].substring(1, title[chr].length).toLowerCase() + ' '
						}
					}
					var item = $("#voiceTextBox").val();
					if(item !=null)
					{
					  initTitle = item;	 
					}
					var upperChartType = chartType.toUpperCase();
					upperChartType = upperChartType + "CHARTTITLE";
					$("#" + chartId + "config").find("#" + upperChartType).val(initTitle);
					response['chartTitle'] = initTitle;
					var dataObjStr = $("#" + chartId).attr("dataObj");
					var dataObject = '';
					if (dataObj !== null && dataObj !== ''
						&& dataObj !== undefined) {
						dataObject = JSON.parse(dataObjStr);
					}
					var chartConfigurationPropStr = dataObject['chartPropObj'];
					if (chartConfigurationPropStr !== null && chartConfigurationPropStr !== ''
						&& chartConfigurationPropStr !== undefined) {
						var chartConfigurationPropObject = JSON.parse(chartConfigurationPropStr);
						chartConfigurationPropObject[upperChartType] = initTitle;
						dataObject['chartPropObj'] = JSON.stringify(chartConfigurationPropObject);
						$("#" + chartId).attr("dataObj", JSON.stringify(dataObject));
					}
					var colorArray = [];
					var deleteicon = {
						'height': 512,
						'width': 448,
						'path': 'M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z',
						'color': 'rgb(31,119,180)'
					};

					var saveChart = {
						'height': 512,
						'width': 512,
						'id': chartId,
						'path': 'M384 160C366.3 160 352 145.7 352 128C352 110.3 366.3 96 384 96H544C561.7 96 576 110.3 576 128V288C576 305.7 561.7 320 544 320C526.3 320 512 305.7 512 288V205.3L342.6 374.6C330.1 387.1 309.9 387.1 297.4 374.6L191.1 269.3L54.63 406.6C42.13 419.1 21.87 419.1 9.372 406.6C-3.124 394.1-3.124 373.9 9.372 361.4L169.4 201.4C181.9 188.9 202.1 188.9 214.6 201.4L320 306.7L466.7 159.1L384 160z',
						'color': 'rgb(31,119,180)'
					};
					var EditIcon = {
						'height': 512,
						'width': 512,
						'id': chartId,
						'path': 'M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192 63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192 127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1 416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96 63.1H192z',
						'color': 'rgb(31,119,180)'
					};
					var AssignUser = {
						'height': 512,
						'width': 512,
						'path': 'M424.1 287c-15.13-15.12-40.1-4.426-40.1 16.97V352H336L153.6 108.8C147.6 100.8 138.1 96 128 96H32C14.31 96 0 110.3 0 128s14.31 32 32 32h80l182.4 243.2C300.4 411.3 309.9 416 320 416h63.97v47.94c0 21.39 25.86 32.12 40.99 17l79.1-79.98c9.387-9.387 9.387-24.59 0-33.97L424.1 287zM336 160h47.97v48.03c0 21.39 25.87 32.09 40.1 16.97l79.1-79.98c9.387-9.391 9.385-24.59-.0013-33.97l-79.1-79.98c-15.13-15.12-40.99-4.391-40.99 17V96H320c-10.06 0-19.56 4.75-25.59 12.81L254 162.7L293.1 216L336 160zM112 352H32c-17.69 0-32 14.31-32 32s14.31 32 32 32h96c10.06 0 19.56-4.75 25.59-12.81l40.4-53.87L154 296L112 352z',
						'color': 'rgb(31,119,180)'
					};
					var config = {
						responsive: true,
						displayModeBar: true,
						downloadImage: true,
						displaylogo: false,
						dragmode: false,
						modeBarButtonsToAdd: [
							/*{
								name: 'Delete', icon: deleteicon, click: function() {
									deleteModalChart(chartId);
								}
							}, 
							{
								name: 'Save', icon: saveChart, click: function(event) {
									saveModalChart(chartId)
								}
							}, 
							{
								name: 'Edit', icon: EditIcon, click: function(event) {
									getModalChartSetting(chartId, chartType, layout, data, createcount, event, "", JSON.stringify(chartConfigToggleStatus));
								}
							}, {
								name: 'Chart Types', icon: AssignUser, click: function(event) {
									changeModalGraph(event, chartId, chartType, layout, data, createcount);
								}
							}*/

						],
						modeBarButtonsToRemove: ['zoomin', 'resetViews', 'resetScale2d', 'zoomout', 'toImage', 'pan2d', 'sendDataToCloud', 'hoverClosestCartesian', 'autoScale2d', 'lasso2d', 'select2d', 'zoom2d']
					};

					if (chartType !== null && chartType !== '' && chartType !== undefined && chartType === 'pie') {
						$.each(chartDataObj, function(key) {

							var traceObj = {};
							var colorObj = {};
							if (key !== axisColumnName) {
								traceObj['labels'] = chartDataObj[axisColumnName];
								traceObj['values'] = chartDataObj[key];
								traceObj['type'] = chartType;
								traceObj['name'] = 'value';
								traceObj['marker'] = colorObj;
								$.each(dataPropObject, function(key, val) {
									traceObj[key] = val;
								});
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'donut') {
						$.each(chartDataObj, function(key) {

							var traceObj = {};
							var colorObj = {};
							if (key !== axisColumnName) {
								traceObj['labels'] = chartDataObj[axisColumnName];
								traceObj['values'] = chartDataObj[key];
								traceObj['hole'] = 0.4;
								traceObj['type'] = 'pie';
								traceObj['name'] = 'value';
								traceObj['marker'] = colorObj;
								$.each(dataPropObject, function(key, val) {
									traceObj[key] = val;
								});
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && ( chartType == 'bar' 
					 || chartType == 'waterfall' || chartType == 'histogram')) {
						var colorCount = 0;
						colorArray = ['#1864ab', '#fd7e14', '#0b7285', '#ff6b6b'];
						$.each(chartDataObj, function(keyName) {

							var traceObj = {};
							var colorObj = {};
							if (keyName !== axisColumnName) {
								if(chartType == 'waterfall'){
									traceObj['x'] = chartDataObj[axisColumnName];
									traceObj['y'] = chartDataObj[keyName];
									traceObj['orientation'] = 'v';
								} else if(chartType == 'histogram'){
									//traceObj['y'] = chartDataObj[axisColumnName];
									traceObj['x'] = chartDataObj[keyName];
								} else{
									traceObj['x'] = chartDataObj[axisColumnName];
									traceObj['y'] = chartDataObj[keyName];
								}
								traceObj['type'] = chartType;
								
								
								
								
								var keys = keyName.split("ASCOL");
								keyName = keys[0];
								traceObj = addlegendLabelToTrace(traceObj, keyName, defaultLegendNames, userProvidedLegendNames);
								$.each(dataPropObject, function(key, val) {
									if (key === 'marker' && !jQuery.isEmptyObject(val) && val !== null) {
										var colorsArray = val['colors'];
										if (colorsArray !== undefined && colorsArray !== null && !$.isArray(colorsArray)) {
											colorObj['color'] = colorsArray;
										} else if (colorsArray !== undefined && colorsArray !== null && $.isArray(colorsArray)) {
											colorObj['color'] = colorsArray[colorCount++];
										} else {
											colorObj['color'] = colorArray[colorCount++];
										}
										traceObj[key] = colorObj;
									} else if (key === 'marker' && (jQuery.isEmptyObject(val) || val === null)) {
										colorObj['color'] = colorArray[colorCount++];
										traceObj[key] = colorObj;
									} else {
										traceObj[key] = val;
									}
								});
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'column') {
						$.each(chartDataObj, function(keyName) {
							var traceObj = {};
							var colorObj = {};
							if (keyName !== axisColumnName) {
								traceObj['x'] = chartDataObj[axisColumnName];
								traceObj['y'] = chartDataObj[keyName];
								traceObj['type'] = "bar";
								var keys = keyName.split("ASCOL");
								keyName = keys[0];
								traceObj = addlegendLabelToTrace(traceObj, keyName, defaultLegendNames, userProvidedLegendNames);
								$.each(dataPropObject, function(key, val) {
									if (key === 'marker' && !jQuery.isEmptyObject(val) && val !== null) {
										var colorsArray = val['colors'];
										if (colorsArray !== undefined && colorsArray !== null && !$.isArray(colorsArray)) {
											colorObj['color'] = colorsArray;
										} else if (colorsArray !== undefined && colorsArray !== null && $.isArray(colorsArray)) {
											colorObj['color'] = colorsArray[colorCount++];
										} else {
											colorObj['color'] = colorArray[colorCount++];
										}
										traceObj[key] = colorObj;
									} else if (key === 'marker' && (jQuery.isEmptyObject(val) || val === null)) {
										colorObj['color'] = colorArray[colorCount++];
										traceObj[key] = colorObj;
									} else {
										traceObj[key] = val;
									}
								});
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'lines') {
						var colorCount = 0;
						var lineColorCount = 0;
						colorArray = ['#1864ab', '#fd7e14', '#0b7285', '#ff6b6b'];
						$.each(chartDataObj, function(keyName, val) {
							var traceObj = {};
							var colorObj = {};
							if (keyName !== axisColumnName) {
								traceObj['x'] = chartDataObj[axisColumnName];
								traceObj['y'] = chartDataObj[keyName];
								traceObj['type'] = chartType;
								var keys = keyName.split("ASCOL");
								keyName = keys[0];
								traceObj = addlegendLabelToTrace(traceObj, keyName, defaultLegendNames, userProvidedLegendNames);
								$.each(dataPropObject, function(key, val) {
									if (key === 'marker' && !jQuery.isEmptyObject(val) && val !== null) {
										var colorsArray = val['color'];
										if (colorsArray !== undefined && colorsArray !== null && !$.isArray(colorsArray)) {
											colorObj['color'] = colorsArray;
										} else if (colorsArray !== undefined && colorsArray !== null && $.isArray(colorsArray)) {
											colorObj['color'] = colorsArray[colorCount++];
										} else {
											colorObj['color'] = colorArray[colorCount++];
										}
										colorObj['size'] = val['size'];
										traceObj[key] = colorObj;
									} else if (key === 'marker' && (jQuery.isEmptyObject(val) || val === null)) {
										colorObj['color'] = colorArray[colorCount++];
										traceObj[key] = colorObj;
									} else if (key === 'line' && !jQuery.isEmptyObject(val) && val !== null) {
										var lineObject = Object.assign({}, val);
										var colorsArray = lineObject['color'];
										if (colorsArray !== undefined && colorsArray !== null && !$.isArray(colorsArray)) {
											lineObject['color'] = colorsArray;
										} else if (colorsArray !== undefined && colorsArray !== null && $.isArray(colorsArray)) {
											lineObject['color'] = colorsArray[lineColorCount++];
										} else {
											lineObject['color'] = colorArray[lineColorCount++];
										}
										traceObj[key] = lineObject;
									} else {
										traceObj[key] = val;
									}
								});
							}

							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'scatter') {
						var colorCount = 0;
						colorArray = ['#1864ab', '#fd7e14', '#0b7285', '#ff6b6b'];
						$.each(chartDataObj, function(keyName, val) {

							var traceObj = {};
							var colorObj = {};
							if (keyName !== axisColumnName) {
								traceObj['x'] = chartDataObj[axisColumnName];
								traceObj['y'] = chartDataObj[keyName];
								traceObj['type'] = chartType;
								traceObj['mode'] = 'markers';
								traceObj['marker'] = colorObj;
								var keys = keyName.split("ASCOL");
								keyName = keys[0];
								traceObj = addlegendLabelToTrace(traceObj, keyName, defaultLegendNames, userProvidedLegendNames);
								$.each(dataPropObject, function(key, val) {
									if (key === 'marker' && !jQuery.isEmptyObject(val) && val !== null) {
										var colorsArray = val['color'];
										if (colorsArray !== undefined && colorsArray !== null && !$.isArray(colorsArray)) {
											colorObj['color'] = colorsArray;
										} else if (colorsArray !== undefined && colorsArray !== null && $.isArray(colorsArray)) {
											colorObj['color'] = colorsArray[colorCount++];
										} else {
											colorObj['color'] = colorArray[colorCount++];
										}
										colorObj['size'] = val['size'];
										traceObj[key] = colorObj;
									} else if (key === 'marker' && (jQuery.isEmptyObject(val) || val === null)) {
										colorObj['color'] = colorArray[colorCount++];
										traceObj[key] = colorObj;
									} else {
										traceObj[key] = val;
									}
								});
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					}else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'indicator') {
						var traceObj = {};
						var domainObj = {};
						var domainArr = [];
						domainArr.push(0);
						domainArr.push(1);
						domainObj["x"] = domainArr;
						domainObj["y"] = domainArr;
						traceObj['domain'] = domainObj;
						traceObj['value'] = chartDataObj[0];
						traceObj['type'] = chartType;
						traceObj['mode'] = "gauge+number";
						traceObj['gauge'] = resultObj['gauge'];
						if (dataPropObject != null && !jQuery.isEmptyObject(dataPropObject)) {
							$.each(dataPropObject, function(key, val) {
								traceObj[key] = val;
							});
						}
						if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
							data.push(traceObj);
						}
					}
					 else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'funnel') {
						var colorCount = 0;
						colorArray = ['#1864ab', '#fd7e14', '#0b7285', '#ff6b6b'];
						$.each(chartDataObj, function(key) {
							var traceObj = {};
							var colorObj = {};
							if (key !== axisColumnName) {
								traceObj['y'] = chartDataObj[axisColumnName];
								traceObj['x'] = chartDataObj[key];
								traceObj['type'] = chartType;
								//                                traceObj['orientation'] = 'h';
								traceObj['name'] = 'value';
								$.each(dataPropObject, function(key, val) {
									if (key === 'marker' && !jQuery.isEmptyObject(val) && val !== null) {
										var colorsArray = val['colors'];
										if (colorsArray !== undefined && colorsArray !== null && colorsArray.length !== null) {
											colorObj['color'] = colorsArray[colorCount++];
										} else {
											colorObj['color'] = colorArray[colorCount++];
										}
										traceObj[key] = colorObj;
									} else if (key === 'marker' && (jQuery.isEmptyObject(val) || val === null)) {
										colorObj['color'] = colorArray[colorCount++];
										traceObj[key] = colorObj;
									} else {
										traceObj[key] = val;
									}
								});
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'scatterpolar') {
						var colorCount = 0;
						colorArray = ['#1864ab', '#fd7e14', '#0b7285', '#ff6b6b'];
						$.each(chartDataObj, function(keyName) {
							var traceObj = {};
							var colorObj = {};
							if (keyName !== axisColumnName) {
								traceObj['r'] = chartDataObj[keyName];
								traceObj['theta'] = chartDataObj[axisColumnName];
								traceObj['type'] = chartType;
								traceObj['fill'] = 'toself';
								var keys = keyName.split("ASCOL");
								keyName = keys[0];
								traceObj = addlegendLabelToTrace(traceObj, keyName, defaultLegendNames, userProvidedLegendNames);
								$.each(dataPropObject, function(key, val) {
									if (key === 'marker' && !jQuery.isEmptyObject(val) && val !== null) {
										var colorsArray = val['colors'];
										if (colorsArray !== undefined && colorsArray !== null && !$.isArray(colorsArray)) {
											colorObj['color'] = colorsArray;
										} else if (colorsArray !== undefined && colorsArray !== null && $.isArray(colorsArray)) {
											colorObj['color'] = colorsArray[colorCount++];
										} else {
											colorObj['color'] = colorArray[colorCount++];
										}
										traceObj[key] = colorObj;
									} else if (key === 'marker' && (jQuery.isEmptyObject(val) || val === null)) {
										colorObj['color'] = colorArray[colorCount++];
										traceObj[key] = colorObj;
									} else {
										traceObj[key] = val;
									}
								});
							}
							if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
								data.push(traceObj);
							}
						});
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'BarAndLine') {
						getBarAndLineChart(chartId, response, count, chartType);
						return;
					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'treemap') {
						getTreeMapChart(chartId, response, count, chartType);
						return;



					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'sunburst') {
						getSunburstChart(chartId, response, count, chartType);
						return;

					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'heatMap') {
						getEchartHeatMap(chartId, response, count);
						return;
					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'candlestick') {


						getCandlestickChart(chartId, response, count, chartType);
						return;
					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'BasicAreaChart') {
						getBasicAreaChart(chartId, response, count, chartType);
						return;

					}else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'StackedAreaChart') {
						getStackedAreaChart(chartId, response, count, chartType);
						return;

					}
						else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'GradStackAreaChart') {
						getGradientStackedAreaChart(chartId, response, count, chartType);
						return;

					}
					else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'AreaPiecesChart') {
						getAreaPiecesChart(chartId, response, count, chartType);
						return;

					}
					else if (chartType != null && chartType != '' && chartType == 'sankey') {
						getSankeyChart(chartId, response, count, chartType);
						return;
					}

					var margin = {};
					if (chartType != null && chartType != '' && chartType != undefined && chartType == 'treemap') {
						margin = {
							l: 0,
							r: 0,
							b: 0,
							t: 30,
							pad: 0
						};
					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'column') {
						margin = {
							l: 50,
							r: 50,
							b: 100,
							t: 50
						};

					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'bar') {
						margin = {
							l: 100,
							r: 50,
							b: 50,
							t: 50
						};

					} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'lines') {
						margin = {
							l: 50,
							r: 50,
							b: 100,
							t: 50
						};

					} else {
						margin = {
							l: 30,
							r: 50,
							b: 50,
							t: 50
						};
					}
					layout = {
						margin: margin,
						height: 300,
						dragmode: false,
						font: {
							size: 9
						},
						modebar: {
							orientation: 'v',
							color: '#0b4a99',
							activecolor: '#9ED3CD'
						},

						title: {
							text: initTitle,
							font: {
								family: '"Open Sans", verdana, arial, sans-serif',
								size: 12
							},
							xref: 'paper',
							x: 0.1,
						}
					};
					var legend = {
						"x": 0.2,
						"y": 0.2,
						"orientation": "h"
					};

					if (layoutObj != null && !jQuery.isEmptyObject(layoutObj)) {
						$.each(layoutObj, function(key, val) {
							layout[key] = val;
						});
					} 


					Plotly.newPlot(chartId, data, layout, config);
					

					$("#" + chartId + " .svg-container").append("<div class='xAxisLabelTooltip'></div>");
					var currentChartXaxisLabelSelector = $("#" + chartId).find(".xaxislayer-above").children();
					currentChartXaxisLabelSelector.each(function(index, element) {
						var labelTitle = $(this).children().text();
						$("#" + chartId + " .xAxisLabelTooltip").append('<span class="xlabelTooltipText">' + labelTitle + "</span>");
					});
					$("#" + chartId + " .xtick").unbind("mouseenter").mouseenter(function(e) {
						var cssTransformProp = $(this).children().attr("transform");
						var firstIndexOfTransformProp = cssTransformProp.split(",")[0];
						var indexOfTransformOpenPar = firstIndexOfTransformProp.indexOf("(");
						var transformHorStr = firstIndexOfTransformProp.substring(indexOfTransformOpenPar + 1, cssTransformProp.length);
						var transformHorVal = parseInt(transformHorStr) - 15;
						showAxisLabelsTooltipOnHover($(this), "xAxisLabelTooltip", chartId, transformHorVal, 0);
					});
					$("#" + chartId + " .xtick").unbind("mouseleave").mouseleave(function(e) {
						hideAxisLabelsTooltipOnHover($(this), "xAxisLabelTooltip", chartId);
					});

					$("#" + chartId + " .svg-container").append("<div class='yAxisLabelTooltip'></div>");
					var currentChartXaxisLabelSelector = $("#" + chartId).find(".yaxislayer-above").children();
					currentChartXaxisLabelSelector.each(function(index, element) {
						var labelTitle = $(this).children().text();
						$("#" + chartId + " .yAxisLabelTooltip").append('<span class="ylabelTooltipText">' + labelTitle + "</span>");
					});
					$("#" + chartId + " .ytick").unbind("mouseenter").mouseenter(function(e) {
						var cssTransformProp = $(this).children().attr("transform");
						var firstIndexOfTransformProp = cssTransformProp.split(",")[1];
						var transformVerStr = firstIndexOfTransformProp.substring(0, firstIndexOfTransformProp.length - 1);
						var transformVerVal = parseInt(transformVerStr) - 230;
						showAxisLabelsTooltipOnHover($(this), "yAxisLabelTooltip", chartId, 0, transformVerVal);
					});
					$("#" + chartId + " .ytick").unbind("mouseleave").mouseleave(function(e) {
						hideAxisLabelsTooltipOnHover($(this), "yAxisLabelTooltip", chartId);
					});

					
				} else {
					chartId = chartId.replace("Inner", "");
					$("#" + chartId).remove();
					
				}
			} else {
				chartId = response['chartId'];
				$("#" + chartId).parent().remove();
				}

		}, error: function(e) {
			console.log("The Error Message is:::" + e.message);
			sessionTimeout(e);
		}
	});
	}
}

