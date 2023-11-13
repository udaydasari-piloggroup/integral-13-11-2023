/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var panaloldData = {};
var basicDatas = {};
var copyData = {};
var typesDataObj = {};
var treeDataArr = [];
var addCustomLevel = false;
var pinnedData = false;
var globalTreeData = '';
var partyChangedColor = '';
var intervalT, intervalY, intervalF, intervalI,
	intervalS, intervalNP, intervalNC, intervalLU = 0;
var counT = 5, counY = 5, counNP = 5, counNC = 5, counLU = 5;
var wavesurfer;
var treeMapObj = '';
FaceEmo = 10;
function workflowBasketTabs(tabId, menuId, roleId) {
	$(".visualizationDashboardView").hide();
	$("#firstDxpSplitterData").html('');
	showLoader();
	$.ajax({
		datatype: "json",
		type: "POST",
		url: 'materialWorkFlow',
		data: {
			'tabId': tabId,
			'menuId': menuId,
			'roleId': roleId,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			$("#mainDxpSplitter").show();
			$("#firstDxpSplitter").show();
			$("#secondDxpSplitter").hide();
			$("#firstDxpSplitterData").html(response);
			$('#firstDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: 270 }] });
		}
	});
}
function getMaterialComponentResults(componentType, componentId, roleId) {
	ajaxStart();
	showLoader();
	$("#decendingOrder").hide();
	$("#secondDxpSplitter").show();
	$("#thirdDxpSplitter").hide();
	$("#fourthDxpSplitter").hide();
	//    $('#firstDxpSplitter').jqxSplitter({width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{size: 30}]});
	$(".searchFirstResultsList").hide();
	$(".decendingFirstOrder").hide();
	firstPanelShowFlag = true;
	$.ajax({
		datatype: "json",
		type: "POST",
		url: 'getsubtabResults',
		data: {
			'componentType': componentType,
			'componentId': componentId,
			'roleId': roleId,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			secondPanelShowFlag = true;
			getSecondPanelShow(event);
			$("#secondDxpSplitterData").html(response);
			//            $("#dxpMaterialListId").hide();
		}
	});
}

function getMaterialComponentGrid(componentType, gridId, roleId) {
	showLoader();
	$("#intellisense").hide();
	$("#thirdDxpSplitter").val('');
	$("#fourthDxpSplitter").val('');
	$("#thirdDxpSplitter").show();
	$('.viewClassDiv').removeClass('active');
	$("#excelExportsearchResults").show();
	var selectedValue = $("#SelectedValue").val();
	$('#thirdDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: '100%' }] });
	//    $('#secondDxpSplitter').jqxSplitter({width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{size: 0}]});
	$(".searchResultsList").hide();
	$(".searchDXPCreate").hide();
	secondPanelShowFlag = true;
	$.ajax({
		datatype: "json",
		type: "POST",
		url: 'getCloudGrid',
		data: {
			'gridId': gridId,
			'roleId': roleId,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			$("#thirdDxpSplitter").val('');
			gridConfig(response, 0, [], gridId);
			$(".searchDXPCreate").show();
			$("#searchGrid").show();
			$("#searchGrid").css("visibility", "visible");
			//            $('#secondDxpSplitter').jqxSplitter({width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{size: 0}]});
			//            $("#thirdDxpSplitter").hide();
			$(".dxpClassHideShow").show();
			$('#thirdDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: 1550 }] }); //31122
			$("#fourthDxpSplitter").hide();
			$("#thirdDxpSplitter").show();
		}
	});
}
function showActionForm() {
	$(".mainBookMark").hide();
	$('#firstDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: 270 }] });
	$('#fourthDxpSplitter').jqxSplitter('collapse');
	$('.decendingFirstOrder').show();
	$('.mainBookMark').hide();
	$('.searchIconsList').show();
	$('#dxpMaterialListId').show();
	$("#secondDxpSplitter").hide();
	$(".searchIconMainInput").show();
	$("#dxpFilterPopOver").show();
	$(".searchIconFilter").show();
	$("#dxpDecendingOrder").show();
	$("#decendingOrder").show();
}
function showActionListForm() {
	$("#secondDxpSplitter").show();
	firstPanelShowFlag = false;
	secondPanelShowFlag = true;
	getFirstPanelShow(event);
	getSecondPanelShow(event);
	$("#thirdDxpSplitter").hide();
	$("#fourthDxpSplitter").hide();
	$('.viewClassDiv').addClass('active');
	$('.viewFormDiv').removeClass('active');
	$('.viewGridDiv').removeClass('active');
	$('.defaultDiv').removeClass('active');
}
function showActionGridForm(gridId) {
	secondPanelShowFlag = false;
	getSecondPanelShow(event);
	thirdPanelShowFlag = true;
	$('#fourthDxpSplitter').hide();
	showThirdPanel();
	$('.viewFormDiv').removeClass('active');
	$('.viewGridDiv').addClass('active');
	$('.viewClassDiv').removeClass('active');
	$('.defaultDiv').removeClass('active');
	setTimeout(resizable, 200);
	gridoperations(gridId, 'refresh');
}
function openMoreItemsPopup(gridId, operationName) {
	$(".openMoreItemsDxpPopupClass").val('');
	$("#openMoreItemsDxpPopup").show();
	$("#openMoreItemsDxpPopup").animate({
		width: 200
	}, 500);
}
function dxpMoreItemsPopupClose(id) {
	$("#openMoreItemsDxpPopup").hide();
}
function dxpCustomizeButtons() {
	$("#openMoreItemsDxpPopup").hide();
	var customizeTable = $("#customizeToolbarData").val();
	var modalObj = {
		title: 'Customize',
		body: customizeTable
	};
	var buttonArray = [
		{
			text: 'Reset',
			click: function() {
				dxpCustomizeButtons();
			},
		},
		{
			text: 'Save',
			click: function() {
				dxpCustomizeSave();
			},
			isCloseButton: true
		},
		{
			text: 'Cancel',
			click: function() {
			},
			isCloseButton: true,
		},
	];
	modalObj['buttons'] = buttonArray;
	createModal("intiateRequestClass", modalObj);
	$(".modal-dialog").addClass("modal-xl dxpToolBarCustomize opacity-animate3");
	callCheckbox();
}
function dxpToolBarBtnClose(divId, checkId) {
	$("#" + divId).hide();
	$("#" + checkId).prop('checked', false);
}
function callCheckbox() {
	$(document).ready(function() {
		$('#customizeAdd').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarAdd").hide();
			} else {
				$("#modalToolbarAdd").show();
			}
		});
		$('#customizeDelete').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarDelete").hide();
			} else {
				$("#modalToolbarDelete").show();
			}
		});
		$('#customizeRefresh').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarRefresh").hide();
			} else {
				$("#modalToolbarRefresh").show();
			}
		});
		$('#customizeCompare').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarDataCompare").hide();
			} else {
				$("#modalToolbarDataCompare").show();
			}
		});
		$('#customizeCockpit').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarCockpit").hide();
			} else {
				$("#modalToolbarCockpit").show();
			}
		});
		$('#customizeCopy').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarCopy").hide();
			} else {
				$("#modalToolbarCopy").show();
			}
		});
		$('#customizeChange').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarChange").hide();
			} else {
				$("#modalToolbarChange").show();
			}
		});
		$('#customizeExtend').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarExtend").hide();
			} else {
				$("#modalToolbarExtend").show();
			}
		});
		$('#customizeUndelete').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarUnDelete").hide();
			} else {
				$("#modalToolbarUnDelete").show();
			}
		});
		$('#customizeDuplicate').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarDuplicate").hide();
			} else {
				$("#modalToolbarDuplicate").show();
			}
		});
		$('#customizeAudit').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarAudit").hide();
			} else {
				$("#modalToolbarAudit").show();
			}
		});
		$('#customizeEnrich').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarEnrichment").hide();
			} else {
				$("#modalToolbarEnrichment").show();
			}
		});
		$('#customizeReVal').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarValidate").hide();
			} else {
				$("#modalToolbarValidate").show();
			}
		});
		$('#customizeQuality').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarQuality").hide();
			} else {
				$("#modalToolbarQuality").show();
			}
		});
		$('#customizeUpdate').on('change', function(event) {
			var checked = this.checked;
			if (!checked) {
				$("#modalToolbarUpdate").hide();
			} else {
				$("#modalToolbarUpdate").show();
			}
		});
	});
}
function validWorkflow() {
	$("#Save").click(function() {
		labelObject = {};
		var resultArray = registerValidation();
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {
		}
		if (resultArray != null && Object.keys(resultArray).length == 0) {
			SaveorUpdate(true, 'Save', '');
		} else {
			for (var textIdKey in resultArray) {
				$("#dis" + textIdKey).html(resultArray[textIdKey]);
				$("#dis" + textIdKey).show();
			}
		}
	});
	$("#Submit").click(function() {
		//        showLoader();
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {

		}
		var resultArray = registerValidation();
		//  alert("resultArray:::"+resultArray);
		if (resultArray != null && Object.keys(resultArray).length == 0) {
			$(".allErrors").hide();
			SaveorUpdate(false, 'Save', '');
			$("#wait").css("display", "none");
			$("body").css("pointer-events", "auto");
			var conf_mesg = $("#Submit").attr('data-conf');
			var success_msg = $("#Submit").attr('data-success-conf');
			var duplCheck = $("#Submit").attr('data-dupl-flag');
			var dataReturnReason = $("#Submit").attr('data-returnreason');
			var dialogSplitMessage = dialogSplitIconText(conf_mesg, "SB");
			var controlInd = $(this).attr("data-value");
			var modalObj = {
				title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
				body: labelObject[dialogSplitMessage] != null ? labelObject[dialogSplitMessage] : dialogSplitMessage,
			};
			var buttonArray = [
				{
					text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
					click: function() {
						if (duplCheck != null && duplCheck != '' && duplCheck == 'Y') {
							if ((dataReturnReason != null && dataReturnReason != '')
								&& dataReturnReason == '1' || dataReturnReason == '6') {
								// if (returnReason != null && returnReason == '6' || returnReason == '1') {
								var msgTitle = controlInd + " Reason";
								var response = "";
								msgTitle = (labelObject[msgTitle] != null ? labelObject[msgTitle] : msgTitle);
								var rejectType = $("#rejectType").val();
								if (rejectType == 0) {
									response = "";
									$("#textReason").html("");
									////////////////////alert("after empty");
									response += "<div id='textReason'>";
									response += "<textarea id='reasonId' class='visionDeleteReason'></textarea></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
								} else if (rejectType == 1) {
									response = "";
									$("#reasonDialog").html("");
									var rejectData = $("#rejectData").val();
									console.log(rejectData);
									response += "<div id='rejectComboBox' class='visionRejectFormComboBox'></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
									if (rejectData != null && rejectData != '') {
										var rejectDataArray = JSON.parse(rejectData);
										$("#rejectComboBox").jqxComboBox({ source: rejectDataArray, searchMode: 'contains', multiSelect: true, width: 280, height: 25 });
									}
								} else if (rejectType == 4) {
									response = "";
									$("#reasonDialog").html("");
									var rejectData = $("#rejectData").val();
									console.log(rejectData);
									response += "<div id='rejectComboBox'  class='visionRejectFormComboBox'></div>";
									$("#textReason").html("");
									////////////////////alert("after empty");
									response += "<div id='textReason'>";
									response += "<textarea id='reasonId' class='visionDeleteReason'></textarea></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
									if (rejectData != null && rejectData != '') {
										var rejectDataArray = JSON.parse(rejectData);
										$("#rejectComboBox").jqxComboBox({
											source: rejectDataArray,
											searchMode: 'containsignorecase',
											multiSelect: true,
											autoComplete: true,
											theme: 'energyblue',
											openDelay: 1,
											closeDelay: 1,
											enableSelection: true,
											width: 280, height: 25
										});
									}


								}
								var modalObj = {
									title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
									body: labelObject['Do you want to create the record?'] != null ? labelObject['Do you want to create the record?'] : 'Do you want to create the record?',
								};
								var buttonArray = [
									{
										text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
										click: function() {
											var retReasonText = "";
											//var returnReason = "";
											var checkBoxdata = "";
											if (rejectType == 0) {
												var textBoxData = $("#reasonId").val();
												//retReasonText = textBoxData;
												retReasonText = textBoxData;
											} else if (rejectType == 1) {
												var selectReason = $("#rejectComboBox").jqxComboBox('getSelectedItems');
												if (selectReason != null) {
													for (var i = 0; i < selectReason.length; i++) {
														checkBoxdata += selectReason[i].value;
														checkBoxdata += ",";
													}
												}

												if (checkBoxdata != null && checkBoxdata != '') {
													var comboListBoxdata = checkBoxdata.substring(0, checkBoxdata.length - 1);
													//retReasonText = returnReason;
													retReasonText = comboListBoxdata;
												}
											} else if (rejectType == 4) {
												var selectReason = $("#rejectComboBox").jqxComboBox('getSelectedItems');
												if (selectReason != null) {
													for (var i = 0; i < selectReason.length; i++) {
														checkBoxdata += selectReason[i].value;
														checkBoxdata += ",";
													}
												}

												if (checkBoxdata != null && checkBoxdata != '') {

													var comboListBoxdata = checkBoxdata.substring(0, checkBoxdata.length - 1);
													retReasonText = comboListBoxdata;
													var textBoxData = $("#reasonId").val();
													if (textBoxData != null && textBoxData != '') {
														retReasonText = comboListBoxdata + ", " + textBoxData;
													}


												} else {
													var textBoxData = $("#reasonId").val();
													if (textBoxData != null && textBoxData != '') {
														retReasonText = textBoxData;
														//                                                                        retReasonText = comboListBoxdata;
													}
												}
											}
											if (!retReasonText) {
												////////////////////////////////////alert("empty"+retReasonText);
												$("#dailog_error_id").show();
											} else if (retReasonText != null) {
												$("#dailog_error_id").hide();
												$(this).html("");
												$(this).dialog("close");
												$(this).dialog("destroy");
												onSubmitIncl(controlInd, retReasonText, success_msg, dataReturnReason);
											} else {

												var returnReason = selectReason;
												console.log("comboListBoxdata:::" + comboListBoxdata);
												if (comboListBoxdata == '' && comboListBoxdata == null) {
													$("#dailog_error_id").show();
												}
												//returnReason = returnReason.trim();
												if (returnReason != '' && returnReason != null) {
													$("#dailog_error_id").hide();
													$(this).html("");
													$(this).dialog("close");
													$(this).dialog("destroy");
													onSubmitIncl(controlInd, returnReason, success_msg, dataReturnReason);
												} else {
													$("#dailog_error_id").show();
												}
											}
										},
										isCloseButton: true
									}
								];
								modalObj['buttons'] = buttonArray;
								createModal("dataDxpSplitterValue", modalObj);
								$(".modal-dialog").addClass("modal-xs");
							} else {//if(dataReturnReason )
								onSubmitIncl(controlInd, '', success_msg, dataReturnReason);
							}
						} else {
							if ((duplCheck != null && duplCheck != '' && duplCheck == 'N') &&
								dataReturnReason == '6' || dataReturnReason == '1') {
								returnReasons(controlInd, success_msg);
							} else // IF DUPLICATE EMPTY && IF DUPLICATE EMPTY,RETURN REASON EMPTY
							{
								onSubmit(controlInd, '', success_msg, "");
							}
						}
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass("modal-xs");
		} else {
			ajaxStop();
			for (var textIdKey in resultArray) {
				//allErrors
				console.log(":::::::::#error_" + textIdKey);
				//$("#dis" + resultArray[i]).html("Should not be null.");
				$("#dis" + textIdKey).html(resultArray[textIdKey]);
				$("#dis" + textIdKey).show();
			}
		}
		//  }

	});
	$("#Delete").click(function() {
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {

		}

		var conf_mesg = $("#Delete").attr('data-conf');
		var success_msg = $("#Delete").attr('data-success-conf');
		var dialogSplitMessage = dialogSplitIconText(conf_mesg, "D");
		var controlInd = $(this).attr("data-value");
		console.log("success_msg:::delte" + success_msg);
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: dialogSplitMessage,
		};
		var buttonArray = [
			{
				text: labelObject['Yes'] != null ? labelObject['Yes'] : 'Yes',
				click: function() {
					returnReasons(controlInd, success_msg);
				},
				isCloseButton: true
			},
			{
				text: labelObject['No'] != null ? labelObject['No'] : 'No',
				click: function() {
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
	});
	$("#Copy").click(function() {
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {

		}
		var conf_mesg = $("#Copy").attr('data-conf');
		var success_msg = $("#Copy").attr('data-success-conf');
		var dialogSplitMessage = dialogSplitIconText(conf_mesg, "C");
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: dialogSplitMessage,
		};
		var buttonArray = [
			{
				text: labelObject['Yes'] != null ? labelObject['Yes'] : 'Yes',
				click: function() {
					copyRequest();
				},
				isCloseButton: true
			},
			{
				text: labelObject['No'] != null ? labelObject['No'] : 'No',
				click: function() {
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
	});
	$("#Approve").click(function() {
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {

		}
		var resultArray = registerValidation();
		//  alert("resultArray:::"+resultArray);
		if (resultArray != null && Object.keys(resultArray).length == 0) {
			$(".allErrors").hide();
			SaveorUpdate(false, 'Save', '');
			var conf_mesg = $("#Approve").attr('data-conf');
			var success_msg = $("#Approve").attr('data-success-conf');
			var duplCheck = $("#Approve").attr('data-dupl-flag');
			console.log("success_msg:::Approve" + success_msg);
			var dialogSplitMessage = dialogSplitIconText(conf_mesg, "S");
			var controlInd = $(this).attr("data-value");
			var modalObj = {
				title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
				body: dialogSplitMessage,
			};
			var buttonArray = [
				{
					text: labelObject['Yes'] != null ? labelObject['Yes'] : 'Yes',
					click: function() {
						var dataReturnReason = $("#Approve").attr('data-returnreason');
						if (duplCheck != null && duplCheck != '' && duplCheck == 'Y') {
							if ((dataReturnReason != null && dataReturnReason != '')
								&& dataReturnReason == '1' || dataReturnReason == '6') {
								// if (returnReason != null && returnReason == '6' || returnReason == '1') {
								var msgTitle = controlInd + " Reason";
								var response = "";
								msgTitle = (labelObject[msgTitle] != null ? labelObject[msgTitle] : msgTitle);
								var rejectType = $("#rejectType").val();
								if (rejectType == 0) {
									response = "";
									$("#textReason").html("");
									////////////////////alert("after empty");
									response += "<div id='textReason'>";
									response += "<textarea id='reasonId' class='visionDeleteReason'></textarea></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
								} else if (rejectType == 1) {
									response = "";
									$("#reasonDialog").html("");
									var rejectData = $("#rejectData").val();
									console.log(rejectData);
									response += "<div id='rejectComboBox' class='visionRejectFormComboBox'></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
									if (rejectData != null && rejectData != '') {
										var rejectDataArray = JSON.parse(rejectData);
										$("#rejectComboBox").jqxComboBox({ source: rejectDataArray, searchMode: 'contains', multiSelect: true, width: 280, height: 25 });
									}
								} else if (rejectType == 4) {
									response = "";
									$("#reasonDialog").html("");
									var rejectData = $("#rejectData").val();
									console.log(rejectData);
									response += "<div id='rejectComboBox'  class='visionRejectFormComboBox'></div>";
									$("#textReason").html("");
									////////////////////alert("after empty");
									response += "<div id='textReason'>";
									response += "<textarea id='reasonId' class='visionDeleteReason'></textarea></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
									if (rejectData != null && rejectData != '') {
										var rejectDataArray = JSON.parse(rejectData);
										$("#rejectComboBox").jqxComboBox({
											source: rejectDataArray,
											searchMode: 'containsignorecase',
											multiSelect: true,
											autoComplete: true,
											theme: 'energyblue',
											openDelay: 1,
											closeDelay: 1,
											enableSelection: true,
											width: 280, height: 25
										});
									}


								}
								var modalObj = {
									title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
									body: labelObject['Do you want to create the record?'] != null ? labelObject['Do you want to create the record?'] : 'Do you want to create the record?',
								};
								var buttonArray = [
									{
										text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
										click: function() {
											var retReasonText = "";
											//var returnReason = "";
											//                        var selectReason = $("#selectReason").val();
											var checkBoxdata = "";
											if (rejectType == 0) {
												var textBoxData = $("#reasonId").val();
												//retReasonText = textBoxData;
												retReasonText = textBoxData;
											} else if (rejectType == 1) {
												var selectReason = $("#rejectComboBox").jqxComboBox('getSelectedItems');
												for (var i = 0; i < selectReason.length; i++) {
													checkBoxdata += selectReason[i].value;
													checkBoxdata += ",";
												}
												if (checkBoxdata != null && checkBoxdata != '') {
													var comboListBoxdata = checkBoxdata.substring(0, checkBoxdata.length - 1);
													//retReasonText = returnReason;
													retReasonText = comboListBoxdata;
												}
											} else if (rejectType == 4) {
												var selectReason = $("#rejectComboBox").jqxComboBox('getSelectedItems');
												for (var i = 0; i < selectReason.length; i++) {
													checkBoxdata += selectReason[i].value;
													checkBoxdata += ",";
												}
												if (checkBoxdata != null && checkBoxdata != '') {

													var comboListBoxdata = checkBoxdata.substring(0, checkBoxdata.length - 1);
													retReasonText = comboListBoxdata;
													var textBoxData = $("#reasonId").val();
													if (textBoxData != null && textBoxData != '') {
														retReasonText = comboListBoxdata + ", " + textBoxData;
													}


												} else {
													var textBoxData = $("#reasonId").val();
													if (textBoxData != null && textBoxData != '') {
														retReasonText = textBoxData;
														//                                                                retReasonText = comboListBoxdata;
													}
												}
											}
											if (!retReasonText) {
												////////////////////////////////////alert("empty"+retReasonText);
												$("#dailog_error_id").show();
											} else if (retReasonText != null) {
												$("#dailog_error_id").hide();
												// showOnSubmitDuplicates(basicData, ssDuplCheckEnableFlag, controlInd, returnReason, success_msg, retReasonText);
												onSubmitIncl(controlInd, retReasonText, success_msg, dataReturnReason);
											} else {

												var returnReason = selectReason;
												console.log("comboListBoxdata:::" + comboListBoxdata);
												if (comboListBoxdata == '' && comboListBoxdata == null) {
													$("#dailog_error_id").show();
												}
												//returnReason = returnReason.trim();
												if (returnReason != '' && returnReason != null) {
													$("#dailog_error_id").hide();
													// showOnSubmitDuplicates(basicData, ssDuplCheckEnableFlag, controlInd, returnReason, success_msg, comboListBoxdata);
													onSubmitIncl(controlInd, returnReason, success_msg, dataReturnReason);
												} else {
													$("#dailog_error_id").show();
												}
											}
										},
										isCloseButton: true
									}
								];
								modalObj['buttons'] = buttonArray;
								createModal("dataDxpSplitterValue", modalObj);
								$(".modal-dialog").addClass("modal-xs");
							} else {//if(dataReturnReason )
								onSubmitIncl(controlInd, '', success_msg, dataReturnReason);
							}

						} else {
							if ((duplCheck != null && duplCheck != '' && duplCheck == 'N') &&
								dataReturnReason == '6' || dataReturnReason == '1') {
								returnReasons(controlInd, success_msg);
							} else// IF DUPLICATE EMPTY && IF DUPLICATE EMPTY,RETURN REASON EMPTY
							{
								onSubmit(controlInd, '', success_msg, "");
							}
						}
					},
					isCloseButton: true
				},
				{
					text: labelObject['No'] != null ? labelObject['No'] : 'No',
					click: function() {
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass("modal-xs");
		} else {
			for (var textIdKey in resultArray) {
				//allErrors
				console.log(":::::::::#error_" + textIdKey);
				//$("#dis" + resultArray[i]).html("Should not be null.");
				$("#dis" + textIdKey).html(resultArray[textIdKey]);
				$("#dis" + textIdKey).show();
			}
		}
	});
	$("#Return").click(function() {
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {

		}
		var conf_mesg = $("#Return").attr('data-conf');
		var success_msg = $("#Return").attr('data-success-conf');
		var dialogSplitMessage = dialogSplitIconText(conf_mesg, "R");
		var controlInd = $(this).attr("data-value");
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: dialogSplitMessage,
		};
		var buttonArray = [
			{
				text: labelObject['Yes'] != null ? labelObject['Yes'] : 'Yes',
				click: function() {
					returnReasons(controlInd, success_msg);
				},
				isCloseButton: true
			},
			{
				text: labelObject['No'] != null ? labelObject['No'] : 'No',
				click: function() {
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
	});
	$("#Duplicate_Check").click(function() {
		//        Duplicate_Check();
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {

		}
		var role = $("#rolehid").val();
		var roleStartsWith = role.substring(0, 2);
		if (role != null && (roleStartsWith == "VM" || roleStartsWith == "CM")) {
			//        if (role != null && role.startsWith("VM")) {
			vendorDuplicateTable();
		} else {
			var basicData = {};
			//            window.open('dupRes?recordNo_Text=' + $("#RECORD_NO").val());
			$("#mat_creation_form_table :input").each(function() {

				var textid = $(this).attr("id");
				var type = $(this).attr("type");
				var textval = $(this).val();
				if (type != 'hidden') {
					if (textval != null && textval != '') {
						textval = textval.toUpperCase();
					}
				}
				if (type != null && type == 'checkbox') {//
					if ($("#" + textid).is(':checked')) {
						textval = "Y";
					} else {
						textval = "N";
					}
				}
				var controlType = "controlType";
				var commentVal = $("#rejColumn").val();
				var rejColumn = "rejColumn";
				var rejectComment = "rejectComment";
				var ACCEPT_COMMENT = "ACCEPT_COMMENT";
				if (textid != null && textid != 'CREATE_DATE' && textid != 'CREATE_BY') {
					basicData[textid] = textval;
					basicData[rejColumn] = commentVal;
				}
				if (textid != null && textid.lastIndexOf("HIDDEN") > -1) {
					var columnNames = $("#" + textid).val();
					var columnsArray = columnNames.split(",");
					var hiddenIds = textid.split("HIDDEN_");
					console.log("textid::::" + textid);
					var hiddenVal = $("#" + hiddenIds[1]).val();
					for (var i = 0; i < columnsArray.length; i++) {
						if (hiddenVal != null) {
							hiddenVal = hiddenVal.toUpperCase();
						}
						basicData[columnsArray[i]] = hiddenVal;
					}
				}
			});
			$.ajax({
				type: "get",
				traditional: true,
				dataType: 'html',
				url: "recordDuplicateCheck",
				cache: false,
				data: {
					basicData: JSON.stringify(basicData)

				},
				error: function(result) {
					return false;
					sessionTimeout(result);
				},
				success: function(result) {
					alert("result::::" + result);
					if ($.trim(result) != null) {
						var duplicateObject = JSON.parse($.trim(result));
						if (duplicateObject != null) {
							if (duplicateObject['messageFlag']) {
								showDuplicates(basicData);
							} else {
								$("#dialog").empty();
								var results = duplicateObject['message'];
								results = labelObject[results] != null ? labelObject[results] : results;
								var conf_mesg = duplicateObject['message'];
								var dialogSplitMessage = dialogSplitIconText(conf_mesg, "P");
								var modalObj = {
									title: labelObject['Duplicate Check'] != null ? labelObject['Duplicate Check'] : 'Duplicate Check',
									body: dialogSplitMessage,
								};
								var buttonArray = [
									{
										text: labelObject['Yes'] != null ? labelObject['OK'] : 'OK',
										click: function() {
											//                                            returnReasons(controlInd, success_msg);
										},
										isCloseButton: true
									},
								];
								modalObj['buttons'] = buttonArray;
								createModal("dataDxpSplitterValue", modalObj);
								$(".modal-dialog").addClass("modal-xs");
							}
						}
					}

				}
			}
			);
		}
	});
	$("#Transfer_to_SAP").click(function() {
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {
		}
		var resultArray = registerValidation();
		console.log("resultArray:::::::" + resultArray);
		if (resultArray != null && Object.keys(resultArray).length == 0) {
			$(".allErrors").hide();
			SaveorUpdate(false, 'Save', '');
			var conf_mesg = $("#Transfer_to_SAP").attr('data-conf');
			var success_msg = $("#Transfer_to_SAP").attr('data-success-conf');
			var duplCheck = $("#Transfer_to_SAP").attr('data-dupl-flag');
			var dialogSplitMessage = dialogSplitIconText(conf_mesg, "T");
			var controlInd = $(this).attr("data-value");
			var modalObj = {
				title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
				body: labelObject[dialogSplitMessage] != null ? labelObject[dialogSplitMessage] : dialogSplitMessage,
			};
			var buttonArray = [
				{
					text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
					click: function() {
						var dataReturnReason = $(this).attr('data-returnreason');
						// startTabLoader();--comment this line
						if (duplCheck != null && duplCheck != '' && duplCheck == 'Y') {
							if ((dataReturnReason != null && dataReturnReason != '')
								&& dataReturnReason == '1' || dataReturnReason == '6') {
								// if (returnReason != null && returnReason == '6' || returnReason == '1') {//nirmala
								var msgTitle = controlInd + " Reason";
								var response = "";
								msgTitle = (labelObject[msgTitle] != null ? labelObject[msgTitle] : msgTitle);
								var rejectType = $("#rejectType").val();
								if (rejectType == 0) {
									response = "";
									$("#textReason").html("");
									response += "<div id='textReason'>";
									response += "<textarea id='reasonId' class='visionDeleteReason'></textarea></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
								} else if (rejectType == 1) {
									response = "";
									$("#reasonDialog").html("");
									var rejectData = $("#rejectData").val();
									console.log(rejectData);
									response += "<div id='rejectComboBox' class='visionRejectFormComboBox'></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
									if (rejectData != null && rejectData != '') {
										var rejectDataArray = JSON.parse(rejectData);
										$("#rejectComboBox").jqxComboBox({ source: rejectDataArray, searchMode: 'contains', multiSelect: true, width: 280, height: 25 });
									}
								} else if (rejectType == 4) {
									response = "";
									$("#reasonDialog").html("");
									var rejectData = $("#rejectData").val();
									console.log(rejectData);
									response += "<div id='rejectComboBox'  class='visionRejectFormComboBox'></div>";
									$("#textReason").html("");
									////////////////////alert("after empty");
									response += "<div id='textReason'>";
									response += "<textarea id='reasonId' class='visionDeleteReason'></textarea></div>";
									response += "<div id='dailog_error_id' style='display:none;color:red'>" + (labelObject['Please give any reason'] != null ? labelObject['Please give any reason'] : 'Please give any reason') + "</div>";
									$("#dialog2").html(response);
									if (rejectData != null && rejectData != '') {
										var rejectDataArray = JSON.parse(rejectData);
										$("#rejectComboBox").jqxComboBox({
											source: rejectDataArray,
											searchMode: 'containsignorecase',
											multiSelect: true,
											autoComplete: true,
											theme: 'energyblue',
											openDelay: 1,
											closeDelay: 1,
											enableSelection: true,
											width: 280, height: 25
										});
									}
								}
								var modalObj = {
									title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
									body: response,
								};
								var buttonArray = [
									{
										text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
										click: function() {
											var retReasonText = "";
											var checkBoxdata = "";
											if (rejectType == 0) {
												var textBoxData = $("#reasonId").val();
												//retReasonText = textBoxData;
												retReasonText = textBoxData;
											} else if (rejectType == 1) {
												var selectReason = $("#rejectComboBox").jqxComboBox('getSelectedItems');
												for (var i = 0; i < selectReason.length; i++) {
													checkBoxdata += selectReason[i].value;
													checkBoxdata += ",";
												}
												if (checkBoxdata != null && checkBoxdata != '') {
													var comboListBoxdata = checkBoxdata.substring(0, checkBoxdata.length - 1);
													//retReasonText = returnReason;
													retReasonText = comboListBoxdata;
												}
											} else if (rejectType == 4) {
												var selectReason = $("#rejectComboBox").jqxComboBox('getSelectedItems');
												for (var i = 0; i < selectReason.length; i++) {
													checkBoxdata += selectReason[i].value;
													checkBoxdata += ",";
												}
												if (checkBoxdata != null && checkBoxdata != '') {
													var comboListBoxdata = checkBoxdata.substring(0, checkBoxdata.length - 1);
													retReasonText = comboListBoxdata;
													var textBoxData = $("#reasonId").val();
													if (textBoxData != null && textBoxData != '') {
														retReasonText = comboListBoxdata + ", " + textBoxData;
													}


												} else {
													var textBoxData = $("#reasonId").val();
													if (textBoxData != null && textBoxData != '') {
														retReasonText = textBoxData;
														//                                                                        retReasonText = comboListBoxdata;//nirmala
													}
												}
											}
											if (!retReasonText) {
												$("#dailog_error_id").show();
											} else if (retReasonText != null) {
												$("#dailog_error_id").hide();
												$(this).html("");
												$(this).dialog("close");
												$(this).dialog("destroy");
												onSubmitIncl(controlInd, retReasonText, success_msg, dataReturnReason);
											} else {
												var returnReason = selectReason;
												console.log("comboListBoxdata:::" + comboListBoxdata);
												if (comboListBoxdata == '' && comboListBoxdata == null) {
													$("#dailog_error_id").show();
												}
												//returnReason = returnReason.trim();
												if (returnReason != '' && returnReason != null) {
													$("#dailog_error_id").hide();
													$(this).html("");
													$(this).dialog("close");
													$(this).dialog("destroy");
													onSubmitIncl(controlInd, returnReason, success_msg, dataReturnReason);
												} else {
													$("#dailog_error_id").show();
												}
											}
										},
										isCloseButton: true
									}
								];
								modalObj['buttons'] = buttonArray;
								createModal("dataDxpSplitterValue", modalObj);
								$(".modal-dialog").addClass("modal-xs");
							} else {//if(dataReturnReason )
								onSubmitIncl(controlInd, '', success_msg, dataReturnReason);
							}
						} else {
							if ((duplCheck != null && duplCheck != '' && duplCheck == 'N') &&
								dataReturnReason == '6' || dataReturnReason == '1') {
								returnReasons(controlInd, success_msg);
							} else// IF DUPLICATE EMPTY && IF DUPLICATE EMPTY,RETURN REASON EMPTY
							{
								onSubmit(controlInd, '', success_msg, "");
							}
						}
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass("modal-xs");
		} else {
			for (var textIdKey in resultArray) {
				console.log(":::::::::#error_" + textIdKey);
				$("#dis" + textIdKey).html(resultArray[textIdKey]);
				$("#dis" + textIdKey).show();
			}
		}
	});
	$("#Instantiate").click(function() {
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {
		}
		var conf_mesg = $("#Instantiate").attr('data-conf');
		var success_msg = $("#Instantiate").attr('data-success-conf');
		var dialogSplitMessage = dialogSplitIconText(conf_mesg, "I");
		var controlInd = $(this).attr("data-value");
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: labelObject[dialogSplitMessage] != null ? labelObject[dialogSplitMessage] : dialogSplitMessage,
		};
		var buttonArray = [
			{
				text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
				click: function() {
					onSubmitIncl(controlInd, '', success_msg);
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
	});
	$("#Change").click(function() {

		var success_msg = $("#Change").attr('data-success-conf');
		var conf_mesg = $("#Change").attr('data-conf');
		var baskettype = $('#baskettypehid').val();
		var basicIds = [];
		var basicData = {};
		$("#mat_creation_form_table :input").each(function() {
			var textid = $(this).attr("id");
			var displayAttr = $("#" + textid).attr("display");
			var type = $(this).attr("type");
			var textval = $(this).val();
			if (type != 'hidden') {
				if (textval != null && textval != '') {
					textval = textval.toUpperCase();
				}
			}
			if (type != null && type == 'checkbox') {//
				if ($("#" + textid).is(':checked')) {
					textval = "Y";
				} else {
					textval = "N";
				}
			}
			basicIds.push(textid);
			if (textid != null && textid != 'CREATE_DATE') {
				basicData[textid] = textval;
			}

			if (textid != null && textid.lastIndexOf("HIDDEN") > -1) {
				var columnNames = $("#" + textid).val();
				var columnsArray = columnNames.split(",");
				var hiddenIds = textid.split("HIDDEN_");
				var hiddenVal = $("#" + hiddenIds[1]).val();
				for (var i = 0; i < columnsArray.length; i++) {
					basicIds.push(columnsArray[i]);
					if (hiddenVal != null) {
						hiddenVal = hiddenVal.toUpperCase();
					}
					basicData[columnsArray[i]] = hiddenVal;
					//                    basicData[columnsArray[i]] = encodeURIComponent(hiddenVal);
				}

			}


		});
		console.log("panaloldData::::" + JSON.stringify(panaloldData));
		var baskettype = $('#baskettypehid').val();
		var basicIds = [];
		var basicData = {};
		$("#mat_creation_form_table :input").each(function() {
			var textid = $(this).attr("id");
			var displayAttr = $("#" + textid).attr("display");
			var type = $(this).attr("type");
			var textval = $(this).val();
			if (type != 'hidden') {
				if (textval != null && textval != '') {
					textval = textval.toUpperCase();
				}
			}
			if (type != null && type == 'checkbox') {//
				if ($("#" + textid).is(':checked')) {
					textval = "Y";
				} else {
					textval = "N";
				}
			}
			basicIds.push(textid);
			if (textid != null && textid != 'CREATE_DATE') {
				basicData[textid] = textval;
			}

			if (textid != null && textid.lastIndexOf("HIDDEN") > -1) {
				var columnNames = $("#" + textid).val();
				var columnsArray = columnNames.split(",");
				var hiddenIds = textid.split("HIDDEN_");
				var hiddenVal = $("#" + hiddenIds[1]).val();
				for (var i = 0; i < columnsArray.length; i++) {
					basicIds.push(columnsArray[i]);
					if (hiddenVal != null) {
						hiddenVal = hiddenVal.toUpperCase();
					}
					basicData[columnsArray[i]] = hiddenVal;
					//                    basicData[columnsArray[i]] = encodeURIComponent(hiddenVal);
				}

			}


		});
		//        console.log("panaloldData::::" + JSON.stringify(panaloldData));
		basicData['NEW_PURCHASE_ORG'] = basicData['PURCHASE_ORG'];
		basicData['NEW_COMPANY_CDE'] = basicData['COMPANY_CDE'];
		basicData['NEW_DISTRIBUTION_CHANNEL'] = basicData['DISTRIBUTION_CHANNEL'];
		basicData['NEW_SALES_ORG'] = basicData['SALES_ORG'];
		//        delete basicData['PLANT'];
		//        delete basicData['PURCHASE_ORG'];
		//        delete basicData['COMPANY_CDE'];
		//        delete basicData['INSTANCE'];
		//        delete basicData['DISTRIBUTION_CHANNEL'];
		//        delete basicData['SALES_ORG'];
		//        basicData['PLANT'] = panaloldData['PLANT'];
		//        basicData['PURCHASE_ORG'] = panaloldData['PURCHASE_ORG'];
		//        basicData['COMPANY_CDE'] = panaloldData['COMPANY_CDE'];
		//        basicData['INSTANCE'] = panaloldData['INSTANCE'];
		//        basicData['DISTRIBUTION_CHANNEL'] = panaloldData['DISTRIBUTION_CHANNEL'];
		//        basicData['SALES_ORG'] = panaloldData['SALES_ORG'];
		basicData['controlType'] = "Change";
		var role = $("#rolehid").val();
		var jsonString = JSON.stringify(basicData);
		console.log("jsonString::::" + JSON.stringify(jsonString));
		var dialogSplitMessage = dialogSplitIconText(conf_mesg, "Y");
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: labelObject[dialogSplitMessage] != null ? labelObject[dialogSplitMessage] : dialogSplitMessage,
		};
		var buttonArray = [
			{
				text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
				click: function() {
					changeRequest(jsonString, 'changeRequest', success_msg);
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
	});
	$("#Delete_Request").click(function() {
		var success_msg = $("#Delete_Request").attr('data-success-conf');
		var conf_mesg = $("#Delete_Request").attr('data-conf');
		var resultArray = registerValidation();
		//  alert("resultArray:::"+resultArray);
		if (resultArray != null && Object.keys(resultArray).length == 0) {

			$(".allErrors").hide();
			// alert("Undelete_Request");
			var baskettype = $('#baskettypehid').val();
			var basicIds = [];
			var basicData = {};
			$("#mat_creation_form_table :input").each(function() {
				var textid = $(this).attr("id");
				var displayAttr = $("#" + textid).attr("display");
				var type = $(this).attr("type");
				var textval = $(this).val();
				if (type != 'hidden') {
					if (textval != null && textval != '') {
						textval = textval.toUpperCase();
					}
				}
				if (type != null && type == 'checkbox') {//
					if ($("#" + textid).is(':checked')) {
						textval = "Y";
					} else {
						textval = "N";
					}
				}
				basicIds.push(textid);
				if (textid != null && textid != 'CREATE_DATE') {
					basicData[textid] = textval;
				}

				if (textid != null && textid.lastIndexOf("HIDDEN") > -1) {
					var columnNames = $("#" + textid).val();
					var columnsArray = columnNames.split(",");
					var hiddenIds = textid.split("HIDDEN_");
					var hiddenVal = $("#" + hiddenIds[1]).val();
					for (var i = 0; i < columnsArray.length; i++) {
						basicIds.push(columnsArray[i]);
						if (hiddenVal != null) {
							hiddenVal = hiddenVal.toUpperCase();
						}
						basicData[columnsArray[i]] = hiddenVal;
						//                    basicData[columnsArray[i]] = encodeURIComponent(hiddenVal);
					}

				}


			});
			console.log("panaloldData::::" + JSON.stringify(panaloldData));
			basicData['NEW_PURCHASE_ORG'] = basicData['PURCHASE_ORG'];
			basicData['NEW_COMPANY_CDE'] = basicData['COMPANY_CDE'];
			//            delete basicData['PLANT'];
			//            delete basicData['PURCHASE_ORG'];
			//            delete basicData['COMPANY_CDE'];
			//            delete basicData['INSTANCE'];
			//            basicData['PLANT'] = panaloldData['PLANT'];
			//            basicData['PURCHASE_ORG'] = panaloldData['PURCHASE_ORG'];
			//            basicData['COMPANY_CDE'] = panaloldData['COMPANY_CDE'];
			//            basicData['INSTANCE'] = panaloldData['INSTANCE'];
			basicData['controlType'] = "Delete Request";
			var role = $("#rolehid").val();
			var jsonString = JSON.stringify(basicData);
			console.log("jsonString::::" + JSON.stringify(jsonString));
			var dialogSplitMessage = dialogSplitIconText(conf_mesg, "D");
			var modalObj = {
				title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
				body: labelObject[dialogSplitMessage] != null ? labelObject[dialogSplitMessage] : dialogSplitMessage,
			};
			var buttonArray = [
				{
					text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
					click: function() {
						changeRequest(jsonString, 'deleteRequest', success_msg);
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass("modal-xs");
		} else {
			for (var textIdKey in resultArray) {
				$("#dis" + textIdKey).html(resultArray[textIdKey]);
				$("#dis" + textIdKey).show();
			}
		}
	});
	$("#Undelete_Request").click(function() {
		var conf_mesg = $("#Undelete_Request").attr('data-conf');
		var success_msg = $("#Undelete_Request").attr('data-success-conf');
		// alert("Undelete_Request");
		var baskettype = $('#baskettypehid').val();
		var basicIds = [];
		var basicData = {};
		$("#mat_creation_form_table :input").each(function() {
			var textid = $(this).attr("id");
			var displayAttr = $("#" + textid).attr("display");
			var type = $(this).attr("type");
			var textval = $(this).val();
			if (type != 'hidden') {
				if (textval != null && textval != '') {
					textval = textval.toUpperCase();
				}
			}
			if (type != null && type == 'checkbox') {//
				if ($("#" + textid).is(':checked')) {
					textval = "Y";
				} else {
					textval = "N";
				}
			}
			basicIds.push(textid);
			if (textid != null && textid != 'CREATE_DATE') {
				basicData[textid] = textval;
			}

			if (textid != null && textid.lastIndexOf("HIDDEN") > -1) {
				var columnNames = $("#" + textid).val();
				var columnsArray = columnNames.split(",");
				var hiddenIds = textid.split("HIDDEN_");
				var hiddenVal = $("#" + hiddenIds[1]).val();
				for (var i = 0; i < columnsArray.length; i++) {
					basicIds.push(columnsArray[i]);
					if (hiddenVal != null) {
						hiddenVal = hiddenVal.toUpperCase();
					}
					basicData[columnsArray[i]] = hiddenVal;
					//                    basicData[columnsArray[i]] = encodeURIComponent(hiddenVal);
				}

			}


		});
		//        console.log("panaloldData::::" + JSON.stringify(panaloldData));
		basicData['NEW_PURCHASE_ORG'] = basicData['PURCHASE_ORG'];
		basicData['NEW_COMPANY_CDE'] = basicData['COMPANY_CDE'];
		//        delete basicData['PLANT'];
		//        delete basicData['PURCHASE_ORG'];
		//        delete basicData['COMPANY_CDE'];
		//        delete basicData['INSTANCE'];
		//        basicData['PLANT'] = panaloldData['PLANT'];
		//        basicData['PURCHASE_ORG'] = panaloldData['PURCHASE_ORG'];
		//        basicData['COMPANY_CDE'] = panaloldData['COMPANY_CDE'];
		//        basicData['INSTANCE'] = panaloldData['INSTANCE'];
		basicData['controlType'] = "Undelete Request";
		var role = $("#rolehid").val();
		var jsonString = JSON.stringify(basicData);
		console.log("jsonString::::" + JSON.stringify(jsonString));
		var dialogSplitMessage = dialogSplitIconText(conf_mesg, "D");
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: labelObject[dialogSplitMessage] != null ? labelObject[dialogSplitMessage] : dialogSplitMessage,
		};
		var buttonArray = [
			{
				text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
				click: function() {
					changeRequest(jsonString, 'deleteRequest', success_msg);
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
	});
	$("#Assign").click(function() {
		labelObject = {};
		try {
			labelObject = JSON.parse($("#labelObjectHidden").val());
		} catch (e) {

		}
		var gridId = $("#gridId").val();
		var roleId = $("#rolehid").val();
		var roleStartsWith = roleId.substring(0, 2);
		var moduleCode = $("#modulehid").val();
		var basicData = {};
		var data = [];
		$("#mat_creation_form_table :input").each(function() {
			var textid = $(this).attr("id");
			var displayAttr = $("#" + textid).attr("display");
			var type = $(this).attr("type");
			var textval = $(this).val();
			if (type != 'hidden') {
				if (textval != null && textval != '') {
					textval = textval.toUpperCase();
				}
			}
			if (type != null && type == 'checkbox') {//
				if ($("#" + textid).is(':checked')) {
					textval = "Y";
				} else {
					textval = "N";
				}
			}

			if (textid != null && textid != 'CREATE_DATE') {
				basicData[textid] = textval;
			}

			if (textid != null && textid.lastIndexOf("HIDDEN") > -1) {
				var columnNames = $("#" + textid).val();
				var columnsArray = columnNames.split(",");
				var hiddenIds = textid.split("HIDDEN_");
				var hiddenVal = $("#" + hiddenIds[1]).val();
				for (var i = 0; i < columnsArray.length; i++) {

					if (hiddenVal != null) {
						hiddenVal = hiddenVal.toUpperCase();
					}
					basicData[columnsArray[i]] = hiddenVal;
				}

			}


		});
		data.push(basicData);
		var result = "<select id='assign'>";
		$.ajax({
			type: "get",
			url: "getUser",
			cache: false,
			traditional: true,
			data: { 'jsonData': JSON.stringify(data) },
			dataType: 'html',
			success: function(response) {
				var obj = JSON.parse(response);
				var flag = obj.flag;
				var dailogProps = {};
				dailogProps.title = "Message";
				dailogProps.modal = true;
				dailogProps.height = "auto";
				dailogProps.width = 350;
				dailogProps.buttons = [];
				dailogProps.fluid = true;
				//  dailogProps.buttons = {};
				// dailogProps.fluid = true;
				dailogProps.beforeClose = function() {
					$(".visionHeaderMain").css("z-index", "99999");
					$(".visionFooterMain").css("z-index", "99999");
				};
				//  alert("flag" + flag);
				if (flag) {
					alert("alert inside flag value true");
					//                    $("#dialog1").html("<div id='value'></div>");
					//                    $('#value').append(obj.userDiv);
					var selectUser = "<div class='visionFormAssignDropdown'><div class='visionFormAssignTitle'>"
						+ (labelObject['Select User'] != null ? labelObject['Select User'] : 'Select User')
						+ "</div><div id='value'></div></div>";
					$("#dialog1").html(obj.userDiv);
					//                    $('#value').append(obj.userDiv);
					dailogProps.buttons.push(
						{
							text: (labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok'),
							click: function() {
								var newCreateBy = "";
								var assignSelectItem = $("#assign").jqxComboBox('getSelectedItem');
								if (assignSelectItem != null) {
									newCreateBy = assignSelectItem['value'];
								}
								//                                    var newCreateBy = $("#assign").val();
								console.log(newCreateBy + ":newCreateBy");
								if (newCreateBy != null && newCreateBy != 'null') {


									onSubmit("ASSIGN", "", "", newCreateBy);
								}

								$(this).html("");
								$(this).dialog("close");
								$(this).dialog("destroy");
								//      $('#' + gridId).jqxGrid('clearselection');

							}
						});
					dailogProps.buttons.push(
						{
							text: (labelObject['Cancel'] != null ? labelObject['Cancel'] : 'Cancel'),
							click: function() {
								$(this).html("");
								$(this).dialog("close");
								$(this).dialog("destroy");
							}
						});
					dailogProps.open = function() {
						$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
						$(this).closest(".ui-dialog").find(".ui-button").eq(2).addClass("dialogno");
						$(this).closest(".ui-dialog").addClass("visionFormDataDialogSuccess");
						$(".visionHeaderMain").css("z-index", "999");
						$(".visionFooterMain").css("z-index", "999");
					};
				} else {
					alert("alert inside flag valuefalse");
					alert(obj.userDiv);
					var selectUser = "<div class='visionFormAssignDropdown'><div class='visionFormAssignTitle'>"
						+ (labelObject['Select User'] != null ? labelObject['Select User'] : 'Select User')
						+ "</div><div id='value'></div></div>";
					$("#dialog1").html(obj.userDiv);
					dailogProps.open = function() {
						$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
						$(this).closest(".ui-dialog").addClass("visionFormDataDialogSuccess");
						$(".visionHeaderMain").css("z-index", "999");
						$(".visionFooterMain").css("z-index", "999");
					};
				}
				$("#assign").jqxComboBox({
					searchMode: 'containsignorecase', multiSelect: false, width: 280,
					autoComplete: true,
					theme: 'energyblue',
					openDelay: 1,
					closeDelay: 1,
					enableSelection: true,
					height: 25
				});
				$("#dialog1").dialog(dailogProps);
			}
			,
			error: function(e) {
				sessionTimeout(e);
			}

		});
	});
	$("#Extend").click(function() {
		var conf_mesg = $("#Extend").attr('data-conf');
		var resultArray = registerValidation();
		//  alert("resultArray:::"+resultArray);
		if (resultArray != null && Object.keys(resultArray).length == 0) {
			$(".allErrors").hide();
			var baskettype = $('#baskettypehid').val();
			var success_msg = $("#Extend").attr('data-success-conf');
			var basicIds = [];
			var basicData = {};
			$("#mat_creation_form_table :input").each(function() {
				var textid = $(this).attr("id");
				var displayAttr = $("#" + textid).attr("display");
				//  console.log(textid+"::::displayAttr:::"+displayAttr);
				var type = $(this).attr("type");
				var textval = $(this).val();
				if (type != 'hidden') {
					if (textval != null && textval != '') {
						textval = textval.toUpperCase();
					}
				}
				if (type != null && type == 'checkbox') {//
					if ($("#" + textid).is(':checked')) {
						textval = "Y";
					} else {
						textval = "N";
					}
				}
				//                console.log("column nameL:::"+textid);
				//                console.log("column Value:::"+textval);

				basicIds.push(textid);
				//                  jsonOBJ.ids.push(textid.toLowerCase());
				if (textid != null && textid != 'CREATE_DATE') {

					basicData[textid] = textval;
				}

				if (textid != null && textid.lastIndexOf("HIDDEN") > -1) {
					var columnNames = $("#" + textid).val();
					var columnsArray = columnNames.split(",");
					var hiddenIds = textid.split("HIDDEN_");
					var hiddenVal = $("#" + hiddenIds[1]).val();
					for (var i = 0; i < columnsArray.length; i++) {
						basicIds.push(columnsArray[i]);
						basicData[columnsArray[i]] = hiddenVal;
					}

				}


			});
			console.log("panaloldData::::" + JSON.stringify(basicData));
			//  basicData['NEW_PLANT'] = basicData['PLANT'];
			basicData['NEW_PURCHASE_ORG'] = basicData['PURCHASE_ORG'];
			basicData['NEW_COMPANY_CDE'] = basicData['COMPANY_CDE'];
			// basicData['NEW_INSTANCE'] = basicData['INSTANCE'];
			/// FOR CM
			basicData['NEW_DISTRIBUTION_CHANNEL'] = basicData['DISTRIBUTION_CHANNEL'];
			basicData['NEW_DIVISION'] = basicData['DIVISION'];
			basicData['NEW_SALES_ORG'] = basicData['SALES_ORG'];
			//            delete basicData['PLANT'];
			//            delete basicData['PURCHASE_ORG'];
			//            delete basicData['COMPANY_CDE'];
			//            delete basicData['INSTANCE'];
			//            delete basicData['DISTRIBUTION_CHANNEL'];
			//            delete basicData['SALES_ORG'];
			//            delete basicData['DIVISION'];
			//            basicData['PLANT'] = panaloldData['PLANT'];
			//            basicData['PURCHASE_ORG'] = panaloldData['PURCHASE_ORG'];
			//            basicData['COMPANY_CDE'] = panaloldData['COMPANY_CDE'];
			//            basicData['INSTANCE'] = panaloldData['INSTANCE'];
			//            basicData['DISTRIBUTION_CHANNEL'] = panaloldData['DISTRIBUTION_CHANNEL'];
			//            basicData['DIVISION'] = panaloldData['DIVISION'];
			//            basicData['SALES_ORG'] = panaloldData['SALES_ORG'];
			basicData['controlType'] = "Extend";
			var role = $("#rolehid").val();
			var roleStartsWith = role.substring(0, 2);
			//            var dialogSplitMessage = dialogSplitIconText(conf_mesg, "Y");
			var dialogSplitMessage = dialogSplitIconText(conf_mesg, "Y");
			var modalObj = {
				title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
				body: labelObject[dialogSplitMessage] != null ? labelObject[dialogSplitMessage] : dialogSplitMessage,
			};
			var buttonArray = [
				{
					text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
					click: function() {
						instanceDropDownMM(JSON.stringify(basicData), success_msg, basicData);
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass("modal-xs");
		} else {
			for (var textIdKey in resultArray) {
				$("#dis" + textIdKey).html(resultArray[textIdKey]);
				$("#dis" + textIdKey).show();
			}
		}
	});
}
function showActionBasketForm() {
	$(".mainBasketBookMark").hide();
	$(".dxpMaterialListClass").show();
	$('#firstDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: 270 }] });
	$('#fourthDxpSplitter').jqxSplitter('collapse');
	$('.decendingFirstOrder').show();
	$('.searchIconsList').show();
	$('#dxpMaterialListId').show();
	$("#secondDxpSplitter").hide();
	$(".searchIconMainInput").show();
	$("#dxpFilterPopOver").show();
	$(".searchIconFilter").show();
	$("#dxpDecendingOrder").show();
	$("#decendingOrder").show();
}
function showActionBasketListForm() {
	$("#secondDxpSplitter").show();
	firstPanelShowFlag = false;
	secondPanelShowFlag = true;
	getFirstPanelShow(event);
	getSecondPanelShow(event);
	$("#thirdDxpSplitter").hide();
	$("#fourthDxpSplitter").hide();
	$('.viewClassBasketDiv').addClass('active');
	$('.viewFormBasketDiv').removeClass('active');
	$('.viewGridBasketDiv').removeClass('active');
	$('.defaultBasketDiv').removeClass('active');
}
function showActionBasketGridForm(gridId) {
	secondPanelShowFlag = false;
	getSecondPanelShow(event);
	thirdPanelShowFlag = true;
	$('#fourthDxpSplitter').hide();
	showThirdPanel();
	$('.viewFormBasketDiv').removeClass('active');
	$('.viewGridBasketDiv').addClass('active');
	$('.viewClassBasketDiv').removeClass('active');
	$('.defaultBasketDiv').removeClass('active');
	$(".searchIconMainInput").hide();
	$(".searchIconFilter").hide();
	$("#dxpFilterPopOver").hide();
	$(".filterDxpResults").hide();
	$("#dxpDecendingOrder").hide();
	setTimeout(resizable, 200);
	var currentGridId = $("#currentGridId").val();
	gridoperations(currentGridId, 'refresh');
}
function dataOnPopup(paramsData) {
	showLoader();
	if (paramsData != null && !jQuery.isEmptyObject(paramsData)) {
		// need to open form
		$.ajax({
			type: "POST",
			url: 'clusterFormData',
			// async: false,
			data: paramsData,
			traditional: true,
			cache: false,
			success: function(response) {
				ajaxStop();
				if (response != null && response != '') {
					//                    $.getScript("/VisionDev/js/valid.js");
					//                    $.getScript("/VisionDev/js/uniquefunctions.js")
					var modalObj = {
						title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
						body: response,
					};
					var buttonArray = [
						{
							text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
							click: function() {
								newDxpClassCreation(data['TERM']);
							},
							isCloseButton: true
						}
					];
					modalObj['buttons'] = buttonArray;
					createModal("dataDxpSplitterValue", modalObj);
					$(".modal-dialog").addClass("modal-xs");
					$(this).closest(".ui-dialog").find(".ui-button").eq(1).addClass("dialogyes");
					$(".visionHeaderMain").css("z-index", "999");
					$(".visionFooterMain").css("z-index", "999");
					$(".accordian").accordion({
						theme: 'energyblue',
						collapsible: true,
						heightStyle: "content",
						active: false,
						autoHeight: false,
						animate: 300
					});
					$('.accordian h3').bind('click', function() {
						var userIds = $(this).data('onclick');
						eval(userIds);
						$('.collapseAll').removeAttr("disabled");
					});
					$("#backToSearch").click(function() {
						window.parent.focus();
						window.close();
					});
					$(window).scroll(function() {
						$("#top_arrow").show();
						$("#bottom_arrow").hide();
						var scroll = $(window).scrollTop();
						//console.log(scroll);
						if (scroll <= 0) {
							$("#top_arrow").hide();
							$("#bottom_arrow").show();
						} else {
							$("#top_arrow").show();
							$("#bottom_arrow").hide();
						}
					});
					$('.scrollToBottom').bind("click", function() {

						var heightscroll = $(document).height();
						$('html, body').animate({ scrollTop: heightscroll }, 1200);
						return false;
					});
					$('.scrollToTop').bind("click", function() {
						$('html, body').animate({ scrollTop: 0 }, 600);
						$("#top_arrow").hide();
						$("#bottom_arrow").show();
						return false;
					});
					var icons = $("#accordion").accordion("option", "icons");
					$('.expandAll').click(function() {
						var userIds = $('.ui-accordion-header').map(function() {
							return $(this).data('onclick');
						}).get();
						for (var i = 0; i < userIds.length; i++) {
							eval(userIds[i]);
						}

						$('.ui-accordion-header').removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({
							'aria-selected': 'true',
							'tabindex': '0'
						});
						$('.ui-accordion-header-icon').removeClass(icons.header).addClass(icons.headerSelected);
						$('.ui-accordion-content').addClass('ui-accordion-content-active').attr({
							'aria-expanded': 'true',
							'aria-hidden': 'false'
						}).show();
						$(this).attr("disabled", "disabled");
						$('.collapseAll').removeAttr("disabled");
						$(".ui-accordion-header").addClass("ui-state-disabled");
						$('#expandAll').css("display", "none");
						$('#collapseAll').css("display", "inline-block");
					});
					$('.collapseAll').click(function() {
						$('.ui-accordion-header').removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({
							'aria-selected': 'false',
							'tabindex': '-1'
						});
						$('.ui-accordion-header-icon').removeClass(icons.headerSelected).addClass(icons.header);
						$('.ui-accordion-content').removeClass('ui-accordion-content-active').attr({
							'aria-expanded': 'false',
							'aria-hidden': 'true'
						}).hide();
						$(this).attr("disabled", "disabled");
						$('.expandAll').removeAttr("disabled");
						$(".ui-accordion-header").removeClass("ui-state-disabled");
						$('#collapseAll').css("display", "none");
						$('#expandAll').css("display", "inline-block");
					});
					$('.ui-accordion-header').click(function() {
						$('.expandAll').removeAttr("disabled");
						$('.collapseAll').removeAttr("disabled");
					});
					$('.visionRegisterMaterialTableTab').on("click", "li", function() {
						var self = this;
						setTimeout(function() {
							var theOffset = $(self).offset();
							$('body,html').animate({ scrollTop: theOffset.top - 80 });
							$(this).next().visionTabMenuFormData('show', 20);
						}, 310); // ensure the collapse animation is done
					});
				}
			},
			error: function(e) {
				ajaxStop();
				sessionTimeout(e);
			}
		});
	}
}
var response = "";
function dropDownLevel() {
	//    $(".colorselectMainForm").show();
	$("#DropdownList").toggleClass("show");
}

function nestedObjToArray(daObj) {
	var result = null;
	if (daObj instanceof Array) {
		for (var i = 0; i < daObj.length; i++) {
			result = nestedObjToArray(daObj[i]);
		}
	} else {
		for (var prop in daObj) {
			if (daObj[prop] instanceof Array) {
				treeDataArr.push(
					{
						name: daObj.name,
						parent: daObj.parent, //assigning parent obj to daobj for its children 
						type: daObj.type, //type is nothing but depth of the tree
					}
				);
				result = nestedObjToArray(daObj[prop]);
			}
		}
	}
}
function createTableFromArray(treeDataArr) {//10522
	$("#exportTreeTable").remove();
	var table = document.createElement('table');
	table.setAttribute('id', 'exportTreeTable');
	var tableBody = document.createElement('tbody');
	var tableHead = table.createTHead();
	var headers = ['NAME', 'PARENT_PATH', 'DEPTH_LEVEL'];
	var headerRow = tableHead.insertRow(-1);
	for (var i = 0; i < headers.length; i++) {
		var cell = headerRow.insertCell(-1);
		cell.innerHTML = headers[i];
		headerRow.appendChild(cell);
		tableHead.appendChild(headerRow);
	}
	for (var i = 0; i < treeDataArr.length; i++) {
		var row = document.createElement('tr');
		var arrObj = Object.values(treeDataArr[i]);
		for (var j = 0; j < arrObj.length; j++) {
			var baseArray = arrObj[j];
			var cell = document.createElement('td');
			cell.appendChild(document.createTextNode(baseArray));
			row.appendChild(cell);
		}
		tableBody.appendChild(row);
	}

	table.appendChild(tableBody);
	document.body.appendChild(table);
	$("#exportTreeTable").hide();
}
function exportTypeDropDown() {
	$("#exportTypeContainer").toggleClass("show");
}
$("#myBtn").click(function() {
	$("#myDropdown").toggle();
});
function getUserProfileData(userName, event, currentElement) {
	showLoader();
	$(".homeSocialTrends").hide();
	$(".IndiaVotesTemp").hide();
	$(".electrolAnalysis").hide();
	$("#secondDxpSplitter").show();
	$("#profileUser").val(userName);
	$('.dxpUserBasedTemplateClass').removeClass('activeClass');
	var parentDIv = $(currentElement).parent();
	parentDIv.addClass('activeClass');
	$.ajax({
		type: "POST",
		url: 'getDXPProfileUserTemplateData',
		data: {
			userName: userName,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			if (response != null && response != '' && response != undefined) {
				response = JSON.parse(response);
				var result = response['result'];
				var tchartData = response['tChartData'];
				var yChartData = response['yChartData'];
				var TweetChartData = response['TweetChartData'];
				var type = response['type'];
				var chartTypeData = "";
				if (type != null && type != '' && type != undefined && type == 'NP') {
					chartTypeData = response["NPChartData"]
				} else if (type != null && type != '' && type != undefined && type == 'YT') {
					chartTypeData = response["YTChartData"]
				}
				$("#secondDxpSplitter").show();
				$("#secondDxpSplitterData").html(result);
				//                $('#secondDxpSplitter').jqxSplitter({width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{size: 1500}]});

				convertSentimentCountToPercent();
				var partyName = $("#partyName").val();
				if (partyName == 'BJP') {
					$(".profileBioData .card-header").addClass('bjp');
				} else if (partyName == 'INC') {
					$(".profileBioData .card-header").addClass('inc');
				} else if (partyName == 'AIMIM') {
					$(".profileBioData .card-header").addClass('aimim');
				} else if (partyName == 'TRS') {
					$(".profileBioData .card-header").addClass('trs');
				} else {
					$(".profileBioData .card-header").addClass('default');
				}
				//                $('#selectCandidate').selectpicker();
				var constituencyList = $("#constituencySearchListBox").val()  //
				var districtList = $("#districtSearchListBox").val()
				var candidateList = $("#candidateSearchListBox").val()  //
				$("#dxpConstitutionsListClass").append(constituencyList); //
				$("#selectCandidate").append(candidateList); //
				$("#dxpDistrictListClass").append(districtList); //

				$("#dxpConstitutionsListClass").jqxDropDownList({
					theme: 'energyblue',
					filterable: true,
					checkboxes: true,
					placeHolder: "Select Constituency"
				});
				$("#dxpConstitutionsListClass").jqxDropDownList('uncheckAll');
				$("#dxpDistrictListClass").jqxDropDownList({//
					theme: 'energyblue',
					filterable: true,
					checkboxes: true,
					placeHolder: "Select District"
				});
				$("#dxpDistrictListClass").jqxDropDownList('uncheckAll');
				$("#selectCandidate").jqxDropDownList({
					theme: 'energyblue',
					filterable: true,
					checkboxes: true,
					placeHolder: "Select Candidate"
				});
				$("#selectCandidate").jqxDropDownList('uncheckAll');
				getChartData(TweetChartData, "sentimentAnalysisTweetSChartId", 'TWEET');
				getChartData(TweetChartData, "sentimentAnalysisTweetDChartId", 'TWEET');
				getChartData(tchartData, "sentimentAnalysisChartIdST", 'T');
				getChartData(tchartData, "sentimentAnalysisChartIdDT", 'T');
				getChartData(yChartData, "sentimentAnalysisChartIdSY", 'Y');
				getChartData(yChartData, "sentimentAnalysisChartIdDY", 'Y');
				getChartData(chartTypeData, "sentimentAnalysisSYTChartId", 'TWEET');
				getChartData(chartTypeData, "sentimentAnalysisDYTChartId", 'TWEET');
				getChartData(chartTypeData, "sentimentAnalysisD" + type + "ChartId", 'TWEET');
				$("#defaultOpenTwitter").click();
			}
			pinnedData = false;
			$('[data-toggle="tooltip"]').tooltip();
		}

	});
}
function getChartData(chartData, chartId, typeFlag) {
	var chartDataArr = [];
	if (chartData != null && !jQuery.isEmptyObject(chartData)) {
		chartData['type'] = 'pie';
		if (typeFlag != null && typeFlag != '' && typeFlag != undefined && typeFlag != 'TWEET') {
			chartData['hole'] = '0.4';
		}
		var colorArr = ['#00c60b', '#fc0203', '#f99800'];
		var markerObj = {};
		markerObj['colors'] = colorArr;
		chartData['marker'] = markerObj;
		chartDataArr.push(chartData);
	}
	var data = chartDataArr;
	var layout = {
		height: 200,
		width: 250,
		margin: {
			l: 50,
			b: 3,
			t: 0
		},
		padding: {
			l: 10,
		},
	};
	Plotly.newPlot(chartId, data, layout);
}
function colorAdderSecondary(thisEle) {
	var color = $(thisEle).val();
	var depthLevel = $(thisEle).attr("level");
	changeTreeColor(color, depthLevel);
}

function applyColorChanges() {
	dropDownLevel();
	if (globalTreeData != null && globalTreeData != undefined && globalTreeData != '') {
		globalTreeData['tree']['collapse'] = true;
		globalTreeData['tree']['init'] = true;
		$(".svgContainer").remove();
		gridTreeBoxes('', globalTreeData['tree']);
	}
}
function generateDecompositionBoxesTreeSecondary(gridId) {
	showLoader();
	var level0value = $("#Decompose0LevelSecondary").val();
	var level1value = $("#Decompose1LevelSecondary").val();
	var level2value = $("#Decompose2LevelSecondary").val();
	var level3value = $("#Decompose3LevelSecondary").val();
	if (addCustomLevel == true) {
		var level4value = $("#Decompose4LevelSecondary").val();
	}
	//    if()
	if ((level0value != null && level0value != '' && level0value != undefined) &&
		(level1value != null && level1value != '' && level1value != undefined) &&
		(level2value != null && level2value != '' && level2value != undefined) &&
		(level3value != null && level3value != '' && level3value != undefined)
	) {
		$('#settingsPanelSecondary').toggle('slide', { direction: 'right' }, 800);
		$("#tree-container").html("");
		$.ajax({
			type: "POST",
			url: 'getDxpGridLevelDecomposeTree',
			data: {
				'gridId': gridId,
				level0value: level0value,
				level1value: level1value,
				level2value: level2value,
				level3value: level3value,
				level4value: level4value,
				addCustomLevel: addCustomLevel

			},
			traditional: true,
			cache: false,
			success: function(response) {
				$(".svgContainer").remove(); //24522
				addCustomLevel = false;
				var result = JSON.parse(response);
				var treeData = result;
				globalTreeData = []; //cleaning old data
				globalTreeData = treeData;
				var result = treeData['result'];
				var listOfValues = treeData['listOfValues'];
				$("#listOfValues").val(listOfValues);
				d3.json(treeData, function(error, json) {
					treeData['tree']['collapse'] = false;
					var color, colorHex, depthLevel;
					$(".colorAdder").change(function(event) {
						color = $(this).val();
						depthLevel = $(this).attr("level");
						$(".svgContainer").remove(); //21422
						treeData['tree']['color'] = color;
						treeData['tree']['depthLevel'] = depthLevel;
						gridTreeBoxes('', treeData['tree']);
					});
					//                    $("#collapseChildren").click(function (event) {
					//                        treeData['tree']['collapse'] = true;
					//                        $(".svgContainer").remove(); //21422              
					//                        gridTreeBoxes('', treeData['tree']);
					//                    });
					//25422
					$("#depthSelector").change(function(event) {
						colorHex = $("#depthSelector").find(":selected").attr("colorHex");
						$(".colorAdder").val(colorHex);
					});
					gridTreeBoxes('', treeData['tree']);
				});
				stopLoader();
				$("#Decompose0LevelSecondary").val(level0value);
				$("#Decompose1LevelSecondary").val(level1value);
				$("#Decompose2LevelSecondary").val(level2value);
				$("#Decompose3LevelSecondary").val(level3value);
				$("#Decompose4LevelSecondary").val(level4value);
			}
		});
	} else {
		stopLoader();
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: labelObject['Please select level value(s)'] != null ? labelObject['Please select level value(s)'] : 'Please select level value(s)',
		};
		var buttonArray = [
			{
				text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
				click: function() {
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
	}
}
function decompositionGridBoxesTree(gridId, levelFlag, id) {
	showLoader();
	if (levelFlag != null && levelFlag != undefined && levelFlag != ''
		&& levelFlag == true) {
		addCustomLevel = true;
	}


	$.ajax({
		type: "POST",
		url: 'getDxpGridLevelDecomposeTree',
		data: {
			'gridId': gridId,
			addCustomLevel: addCustomLevel,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			if (addCustomLevel && ($("#colorAdderlevel4").val() == undefined || $("#colorAdderlevel4").val() == '')) {//16522
				$(".colorselectDiv").append("<div class='innerColorSelect'><span class='colorLevelLabel' value='4' colorHex='#AE7A9B'>Level 4</span><span class='colorLevelSelect'><input type='color' class='colorAdder' id='colorAdderlevel4' level ='4' value='#AE7A9B'></span>");
			}

			addCustomLevel = false;
			$(".svgContainer").remove();
			var result = JSON.parse(response);
			var treeData = result;
			var listOfValues = result['listOfValues'];
			var addCustomLevel = result['addCustomLevel'];
			if (addCustomLevel) {
				var level4 = "<div class='levelInnerMainDiv'>"
					+ "<div class='levelLabel'>Level 4</div>"
					+ "<div class='level0DropdownDiv'>"
					+ "<select id='Decompose4LevelSecondary'>" + listOfValues + "</select>"
					+ "</div>"
					+ "</div>";
				$(".colorselectDiv").append("<div class='innerColorSelect'><span class='colorLevelLabel' value='4' colorHex='#AE7A9B'>Level 4</span><span class='colorLevelSelect'><input type='color' class='colorAdder' id='colorAdderlevel4' level ='4' value='#AE7A9B'></span>");
			}
			$(".levelsMainDiv").append(level4);
			$("#treeContainerWithBoxes").show();
			var result = treeData['result'];
			var resultListSecondary = treeData['resultListSecondary'];
			var exportBoxTreeJson = {}; //30422 working on exporting the tree
			exportBoxTreeJson['data'] = treeData['tree'];
			exportBoxTreeJson['headers'] = Object.keys(treeData['tree']);
			treeDataArr = [];
			nestedObjToArray(exportBoxTreeJson['data']);
			createTableFromArray(treeDataArr); //10522
			$("#dxpDecompositionLevels").html(resultListSecondary);
			d3.json(treeData, function(error, json) {
				treeData['tree']['collapse'] = false;
				var color, colorHex, depthLevel;
				$(".colorAdder").on('input', function(event) {//27422
					color = $(this).val();
					depthLevel = $(this).attr("level");
					changeTreeColor(color, depthLevel); //27422
				});
				//                $("#collapseChildren").click(function (event) {
				//                    dropDownLevel();
				//                    treeData['tree']['collapse'] = true;
				//                    treeData['tree']['init'] = true;
				//                    $(".svgContainer").remove(); //21422
				//                    if (id == 'AddLevelsSecondary' && id != null && id != undefined) {
				//                        gridTreeBoxes('', treeData['tree']);
				//                    } else {
				//                        $("#treeContainerWithBoxes").show();//24522 impt
				//                        treeBoxes('', treeData['tree']);
				//                    }
				//
				//                });
				treeData['tree']['color'] = '#AE7A9B';
				if (id == 'AddLevelsSecondary' && id != null && id != undefined) {
					gridTreeBoxes('', treeData['tree']);
				} else {
					$("#dxpDecompositionLevels").append(result);
					$("#dxpDecompositionLevels").append(result['resultList']);
					$("#treeContainerWithBoxes").show();
					treeBoxes('', treeData['tree']);
					$(".decompositionBoxTreeSection").find(".decompositionBoxTreeSection").remove();
				}

			});
			stopLoader();
			$("#dxpDecompositionLevels").children().remove();
			$("#dxpDecomposeTreeClass").html(result['resultPersonalizeBtnSecondary']);
			$("#dxpDecompositionLevelsSecondary").html(result['resultListSecondary']);
		}
	});
}
function getConstitutionUserData(id, type) {
	var value = '';
	var errorValue = '';
	var dropDownListId = '';
	var analysisName = '';
	$("#compareType").val(type);
	if (type != null && type != '' && type != undefined && type == 'C') {
		var test = $("#dxpConstitutionsListClass").val(); //
		var value = ',' + test;
		dropDownListId = "dxpConstitutionsListClass";
	} else if (type != null && type != '' && type != undefined && type == 'D') {
		var test = $('#dxpDistrictListClass').val()   //
		var value = ',' + test;
		dropDownListId = "dxpDistrictListClass";
	} else if (type != null && type != '' && type != undefined && type == 'M') {
		var test = $('#selectCandidate').val();
		var value = ',' + test;
		dropDownListId = "selectCandidate";
	}
	if (value != null && value != "" && value != undefined) {
		var userName = $("#profileUser").val();
		ajaxStart();
		$.ajax({
			type: "POST",
			url: 'getSocialMediaSentiment',
			data: {
				'userName': userName,
				'value': value,
				'type': type,
				'id': id,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				ajaxStop();
				response = JSON.parse(response);
				var socialMediaSentiment = response["result"];
				if (response != null && response != undefined && response != '') {

					$("#secondDxpSplitter").show();
					//                    $('#secondDxpSplitter').jqxSplitter({width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{size: 1500}]});
					//                $("#secondDxpSplitterData").html(response);
					$("#dxpConstitutionsListClass").val();
					var modalObj = {
						title: "" + analysisName + " Analysis",
						body: socialMediaSentiment, //8622
					};
					var buttonArray = [
						{
							text: 'OK',
							click: function() {
								$("#" + dropDownListId).jqxDropDownList('uncheckAll');
							},
							isCloseButton: true

						}
					];
					modalObj['buttons'] = buttonArray;
					createModal("dataDxpSplitterValue", modalObj);
					$("#dataDxpSplitterValue .modal-dialog").addClass(" xl opacity-animate3 analytic-modal");
					$("#dataDxpSplitterValue .modal-body").addClass("modal-body-scroll"); //8622
					$("#dataDxpSplitterValue").css("z-index", "9999");
					$("#dataDxpSplitterValue").addClass("analytic-modal"); //8622
					$("#comparedefaultOpen").click();
					$("#lastSevenDays").click();
					$("#comparedefaultOpen").attr("compareValue", value); //28622
					$("#comparedefaultOpen").attr("compareType", type); //28622
				}


			}
		});
	} else {
		var modalObj = {
			title: "Message",
			body: "Please select " + errorValue + " to compare.", //8622
		};
		var buttonArray = [
			{
				text: 'OK',
				click: function() {
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("intiateRequestClass", modalObj);
	}
}
function getTwitterApiData(gridId) {
	$.ajax({
		type: "POST",
		url: 'getTwitterApiData',
		data: {
			'gridId': gridId,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			if (response != null && response != '' && response != undefined) {

			}
		}
	});
}
function getShowDxpProfileResults(parent, childSelector, keySelector) {
	parent = $("#searchedDxpFirstSearchProfilResults");
	childSelector = "div";
	keySelector = "div.dxpUserBasedTemplateSpanClass";
	var items = parent.children(childSelector).sort(function(a, b) {
		var vA = $(keySelector, a).text();
		var vB = $(keySelector, b).text();
		return (vA > vB) ? -1 : (vA > vB) ? 1 : 0;
	});
	parent.append(items);
	$("#decendingFirstProfileOrder").hide();
	$("#AccendingOrderProfile").show();
}
function getShowDxpProfileAscResults(parent, childSelector, keySelector) {
	parent = $("#searchedDxpFirstSearchProfilResults");
	childSelector = "div";
	keySelector = "div.dxpUserBasedTemplateSpanClass";
	var items = parent.children(childSelector).sort(function(a, b) {
		var vA = $(keySelector, a).text();
		var vB = $(keySelector, b).text();
		return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
	});
	parent.append(items);
	$("#AccendingOrderProfile").hide();
	$("#decendingFirstProfileOrder").show();
}
function changeConstitutionValues(event, id, type) {
	if (type != null && type != '' && type != undefined && type == 'C') {
		$("#dxpDistrictListClass").val("");
		$('#selectCandidate').jqxComboBox('uncheckAll');
		$('#selectCandidate').jqxComboBox('selectItem', 'Select Candidate');
	} else if (type != null && type != '' && type != undefined && type == 'D') {
		$("#dxpConstitutionsListClass").val("");
		$('#selectCandidate').jqxComboBox('uncheckAll');
		$('#selectCandidate').jqxComboBox('selectItem', 'Select Candidate');
	} else if (type != null && type != '' && type != undefined && type == 'M') {
		$("#dxpConstitutionsListClass").val("");
		$("#dxpDistrictListClass").val("");
	}
}
function getChartCounts(id, columnName, fromWeek, toWeek, table, chartType) {
	var icon = {
		'width': 1000,
		'path': 'm250 850l-187 0-63 0 0-62 0-188 63 0 0 188 187 0 0 62z m688 0l-188 0 0-62 188 0 0-188 62 0 0 188 0 62-62 0z m-875-938l0 188-63 0 0-188 0-62 63 0 187 0 0 62-187 0z m875 188l0-188-188 0 0-62 188 0 62 0 0 62 0 188-62 0z m-125 188l-1 0-93-94-156 156 156 156 92-93 2 0 0 250-250 0 0-2 93-92-156-156-156 156 94 92 0 2-250 0 0-250 0 0 93 93 157-156-157-156-93 94 0 0 0-250 250 0 0 0-94 93 156 157 156-157-93-93 0 0 250 0 0 250z" transform="matrix(1 0 0 -1 0 850)"',
		'ascent': 850,
		'descent': -150
	};
	var selectType = $("#visionDXPProfileTwitterchartTypesId").val();
	if (selectType != null && selectType != '' && selectType != undefined) {
		chartType = selectType;
	}

	var value = '';
	var constitutionName = $("#dxpConstitutionsListClass").val();
	var district = $("#dxpDistrictListClass").val();
	var test = $('#selectCandidate').jqxComboBox('getCheckedItems');
	var selectedCandidates = '';
	test.forEach(function(i, x) {
		var names = i.label;
		var index = i.index;
		if (index != 0) {
			selectedCandidates += ',' + names;
		} else if (index != 1) {
			selectedCandidates += names;
		}
	});
	if (id != null && id != '' && id != undefined && id == 'dxpConstitutionsListClass') {
		value = constitutionName;
	} else if (id != null && id != '' && id != undefined && id == 'dxpDistrictListClass') {
		value = district;
	} else if (id != null && id != '' && id != undefined && id == 'selectCandidate') {
		value = selectedCandidates;
		//        value = value.replace("Select Candidate,", "");
	}
	var userName = $("#profileUser").val();
	$.ajax({
		type: "POST",
		url: 'getDXPProfileUsersChartsData',
		data: {
			'userName': userName,
			'value': value,
			'id': id,
			'columnName': columnName,
			'chartType': chartType,
			'fromWeek': fromWeek,
			'toWeek': toWeek,
			'table': table
		},
		traditional: true,
		cache: false,
		success: function(response) {
			if (response != null && response != undefined && response != '') {
				var chartDataObj = response['data'];
				var selectBoxStr = response['selectBoxStr'];
				var chartType = response['chartType'];
				userName = userName.replace(" ", "_");
				var chartId = userName + columnName + "_Expand";
				var data = [];
				try {
					$("#dialog1").html("");
					$("#dialog1").dialog("close");
					$("#dialog1").dialog("destroy");
				} catch (e) {

				}

				$("#dialog1").html("<div class='visionDXPProfileTwitterChartsClass'><div id='visionDXPProfileTwitterChartsTypeId' class='visionDXPProfileTwitterChartsTypeClass'></div><div id = '" + chartId + "' class = 'visionDXPProfileTwitterChartsImage'></div></div>");
				$("#visionDXPProfileTwitterChartsTypeId").html(selectBoxStr);
				$("#dialog1").dialog({
					title: 'Image',
					modal: true,
					width: 600,
					height: 500,
					fluid: true,
					buttons: [{
						text: (labelObject['Close'] != null ? labelObject['Close'] : 'Close'),
						click: function() {
							$(this).html("");
							$(this).dialog("close");
							$(this).dialog("destroy");
						}
					}],
					open: function(event, ui) {
						var axisColumnName = "USER_NAME";
						if (chartType != null && chartType != '' && chartType == 'pie') {
							$.each(chartDataObj, function(key) {
								var traceObj = {};
								var colorObj = {};
								var colorArr = ['red', 'green', 'blue'];
								if (key !== axisColumnName) {
									traceObj['labels'] = chartDataObj[axisColumnName];
									traceObj['values'] = chartDataObj[key];
									traceObj['type'] = 'pie';
									traceObj['name'] = 'count';
									var markerObj = {};
									markerObj['colors'] = colorArr;
									traceObj['marker'] = markerObj;
								}
								if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
									data.push(traceObj);
								}
							});
						} else if (chartType != null && chartType != '' && chartType == 'bar') {
							$.each(chartDataObj, function(key) {
								var traceObj = {};
								var colorObj = {};
								if (key !== axisColumnName) {
									traceObj['y'] = chartDataObj[axisColumnName];
									traceObj['x'] = chartDataObj[key];
									traceObj['type'] = 'bar';
									traceObj['name'] = 'count';
									traceObj['marker'] = colorObj;
									traceObj['orientation'] = 'h';
								}
								if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
									data.push(traceObj);
								}
							});
						} else if (chartType != null && chartType != '' && chartType == 'column') {
							$.each(chartDataObj, function(key) {
								var traceObj = {};
								var colorObj = {};
								if (key !== axisColumnName) {
									traceObj['x'] = chartDataObj[axisColumnName];
									traceObj['y'] = chartDataObj[key];
									traceObj['type'] = 'bar';
									traceObj['name'] = 'count';
									traceObj['marker'] = colorObj;
								}
								if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
									data.push(traceObj);
								}
							});
						} else if (chartType != null && chartType != '' && chartType == 'donut') {
							$.each(chartDataObj, function(key) {
								var traceObj = {};
								var colorObj = {};
								if (key !== axisColumnName) {
									traceObj['labels'] = chartDataObj[axisColumnName];
									traceObj['values'] = chartDataObj[key];
									traceObj['type'] = 'pie';
									traceObj['hole'] = 0.4;
									traceObj['name'] = 'count';
									traceObj['marker'] = colorObj;
								}
								if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
									data.push(traceObj);
								}
							});
						}

						var config = {
							responsive: true,
							displayModeBar: true,
							downloadImage: true,
							displaylogo: false,
							modeBarButtonsToAdd: [{
								name: 'Delete Chart', icon: icon, click: function(chartId) {
									$("#" + chartId).remove();
								}
							}],
							modeBarButtonsToRemove: ['zoom2d', 'pan', 'pan2d', 'zoomIn2d', 'zoomOut2d', 'resetViewMapbox', 'resetScale2d', 'sendDataToCloud', 'hoverClosestCartesian', 'autoScale2d', 'lasso2d', 'select2d', 'zoom2d']
						};
						var layout = {
							margin: {
								l: 65,
								r: 30,
								b: 50,
								t: 20,
								pad: 4
							},
							height: 400,
							width: 500,
							dragmode: false

						};
						layout['showlegend'] = true;
						Plotly.newPlot(chartId, data, layout, config);
						$(".visionHeaderMain").css("z-index", "99999");
						$(".visionFooterMain").css("z-index", "99999");
						$(this).closest(".ui-dialog").addClass("visionAnalyticgraphDialog");
						$(".ui-dialog").css("z-index", "99999");
						//                        $(window).resize(function () {
						//                            $(".visionReportFlipcontainer").css("width", "100%");
						//                        }).resize();
					},
					beforeClose: function(event, ui) {
						$(".visionHeaderMain").css("z-index", "99999");
						$(".visionFooterMain").css("z-index", "99999");
					}
				});
			}

		}
	});
}
function getkeyProfilResults(event) {
	ajaxStart();
	var value = $("#firstSplitterSearchId").val().toUpperCase();
	console.log("value" + value);
	$(".dxpUserBasedTemplateClass").filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	});
	$.ajax({
		type: "POST",
		url: 'getSearchProfileData',
		data: {
			'value': value,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			ajaxStop();
			$("#mainDxpSplitter").show();
			$('#firstDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: 250 }] });
			$("#searchedDxpFirstSearchProfilResults").html(response);
		}
	});
}
function twitterSortTime(userName, party, appendedId, mediaFlag) {
	console.log(event.target.value);
	showLoader();
	var url = "getDXPProfileUserTemplateData";
	var fromDate = $("#filterDateSearchFrom" + mediaFlag + "").val();
	var toDate = $("#filterDateSearchTo" + mediaFlag + "").val();
	$("#filterDateSearchTo" + mediaFlag + "").attr('min', fromDate);
	var partyClass = $("#Tweek1").siblings().attr('class');
	var partyArr = partyClass.split(" ");
	if (fromDate != null && fromDate != '' && fromDate != undefined) {
		$.ajax({
			type: "POST",
			url: url,
			data: {
				'fromDate': fromDate,
				'toDate': toDate,
				'party': partyArr[2],
				'userName': userName,
				'party': party,
				'mediaFlag': mediaFlag,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				if (response != null && response != '' && response != undefined) {
					stopLoader();
					var result = JSON.parse(response);
					var data = result['result'];
					$("#calendarFrom_HIDDEN").val(fromDate);
					$("#calendarTo_HIDDEN").val(toDate);
					$("#" + appendedId).children().remove();
					$("#" + appendedId).append(data);
					convertSentimentCountToPercent();
					$("#filterDateSearchFrom" + mediaFlag + "").val(fromDate);
					$("#filterDateSearchTo" + mediaFlag + "").val(toDate);
					//                    if (party == 'BJP') {
					//                        $("#profileId .card-header").addClass('bjp');
					//                    } else if (party == 'INC') {
					//                        $("#profileId .card-header").addClass('inc');
					//                    } else if (party == 'AIMIM') {
					//                        //    $("#profileId .card-header").addClass('aimim');
					//                    } else if (party == 'TRS') {
					//                        $("#profileId .card-header").addClass('trs');
					//                    } else {
					//                        $("#profileId .card-header").addClass('default');
					//                    }
				}
			}
		});
	} else {
		var modalObj = {
			title: labelObject['Message'] != null ? labelObject['Message'] : 'Message',
			body: labelObject['Please Choose the date'] != null ? labelObject['Please Choose the date'] : 'Please Choose from date',
		};
		var buttonArray = [
			{
				text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
				click: function() {
				},
				isCloseButton: true
			}
		];
		modalObj['buttons'] = buttonArray;
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-xs");
		stopLoader();
	}
}
function socialMediaTabs(evt, sociallink, currentElementDiv, userName, id, party) {
	var i, tabcontentSingle, tablinksSingle;
	var targetID = currentElementDiv.id;
	tabcontentSingle = $(".tabcontentSingle");
	for (i = 0; i < tabcontentSingle.length; i++) {
		tabcontentSingle[i].style.display = "none";
	}
	tablinksSingle = $(".tablinksSingle");
	for (i = 0; i < tablinksSingle.length; i++) {
		tablinksSingle[i].className = tablinksSingle[i].className.replace(" active", "");
	}
	$("#" + sociallink).css("display", "block");
	//    $(a).addClass('active');
	$("#" + targetID).addClass('active');
	//    var calendarEl = document.getElementById('calendarFull');
	if (sociallink == "timelineContent") {
		socialLinkAllCard(userName, id, party, 'TL');
		//        var calendarEl = document.getElementById('calendarFull');
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        var sociallinkTag = "TW_TIMELINE_REPLY_ANALYSIS";
		//        calanderEventCompare(calendarEl, "M", currentUserProfile, sociallinkTag, 'T');
	} else if (sociallink == "voice-emotionContent") {
		socialLinkAllCard(userName, id, party, 'V');
		//        var calendarE3 = document.getElementById('calendarFullVoiceEmotions');
		//        var sociallinkTag = "AUDIO_EMOTION_ANALYSIS";
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        calanderEventCompare(calendarE3, "M", currentUserProfile, sociallinkTag, 'V');
	} else if (sociallink == "twitterContent") {
		//        var calendarE2 = document.getElementById('calendarFullTwi');
		//        var sociallinkTag = "TW_TIMELINE_REPLY_ANALYSIS";
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'T');
	} else if (sociallink == "newsChannelContent") {
		socialLinkAllCard(userName, id, party, 'NC');
		//        var calendarE2 = document.getElementById('calendarFullNewsChannel');
		//        var sociallinkTag = "DXP_NEWSPAPER_ANALYSIS";
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'NC');
	} else if (sociallink == "newspaperContent") {
		socialLinkAllCard(userName, id, party, 'NP');
		//        var calendarE2 = document.getElementById('calendarFullNewsPaper');
		//        var sociallinkTag = "NP_ANALYSIS";
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'NP');
	} else if (sociallink == "youtubeContent") {
		socialLinkAllCard(userName, id, party, 'Y');
		//        var calendarE2 = document.getElementById('calendarFullYouTube');
		//        var sociallinkTag = "YT_ANALYSIS";
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'Y');
	} else if (sociallink == "facebookContent") {
		socialLinkAllCard(userName, id, party, 'F');
		//        var calendarE2 = document.getElementById('calendarFullFacebook');
		//        var sociallinkTag = "TW_TIMELINE_TW_SENT_ANALYSIS";
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'F');
	} else if (sociallink == "instagramContent") {
		socialLinkAllCard(userName, id, party, 'I');
		//        var calendarE2 = document.getElementById('calendarFullInstagram');
		//        var sociallinkTag = "AUDIO_EMOTION_ANALYSIS";
		//        var currentUserProfile = $(".innerBodyContent h4").text();
		//        calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'I');
	} else if (sociallink == "faceEmotionContent") {
		socialLinkAllCard(userName, id, party, 'FE');
	} else if (sociallink == "surveyContent") {
		socialLinkAllCard(userName, id, party, 'S');
	}
}
function socialLinkAllCard(userName, id, party, socialType) {
	showLoader();
	$.ajax({
		type: "POST",
		url: 'getSocialLinkUserProfileAllCard',
		data: {
			userName: userName,
			id: id,
			party: party,
			socialType: socialType,
			flag: false
		},
		traditional: true,
		cache: false,
		success: function(result) {
			stopLoader();
			var response = JSON.parse(result);
			result = response['result'];
			var yChartData = response['yChartData'];
			var type = response['type'];
			var chartTypeData = "";
			if (type != null && type != '' && type != undefined && type == 'NP') {
				chartTypeData = response["NPChartData"]
			} else if (type != null && type != '' && type != undefined && type == 'YT') {
				chartTypeData = response["YTChartData"]
			}
			if (socialType == "Y") {
				$("#accordionYoutubeProfile").html(result);
				getChartData(yChartData, "sentimentAnalysisChartIdSY", 'Y');
				getChartData(yChartData, "sentimentAnalysisChartIdDY", 'Y');
				getChartData(chartTypeData, "sentimentAnalysisSYTChartId", 'TWEET');
				getChartData(chartTypeData, "sentimentAnalysisDYTChartId", 'TWEET');
			} else if (socialType === "NP") {
				$("#accordionNewsPaperProfile").html(result);
				getChartData(chartTypeData, "sentimentAnalysisD" + type + "ChartId", 'TWEET');
			} else if (socialType === "F") {
				$("#accordionFacebookProfile").html(result);
			} else if (socialType === "NC") {
				$("#accordionNewsChannelProfile").html(result);
			} else if (socialType === "I") {
				$("#accordionInstagramProfile").html(result);
			} else if (socialType === "FE") {
				$("#accordionFaceEmotionProfile").html(result);
				$("#faceEmoctionAllEmageRecord").scroll(function() {
					var values = $(this).scrollTop() + $(this).innerHeight();
					var value = parseFloat(values).toFixed(0);
					var pointvalue = parseFloat(values + .50).toFixed(0);
					if (value >= $(this)[0].scrollHeight) {
						setFaceEmotionCardScrollOnLoad(event, userName);
					} else if (pointvalue >= $(this)[0].scrollHeight) {
						setFaceEmotionCardScrollOnLoad(event, userName);
					}
				});
			} else if (socialType === "TL") {
				$("#accordionTimelineProfile").html(result);
				setFullCalender("TL");
			} else if (socialType === "V") {
				$("#accordionEmotionsProfile").html(result);
			} else if (socialType === "S") {
				$("#accordionSurveyProfile").html(result);
			} else if (socialType === "FE") {
				$("#accordionFaceEmotionProfile").html(result);
				$("#faceEmotionContent").scroll(function() {
					var values = $(this).scrollTop() + $(this).innerHeight();
					var value = parseFloat(values).toFixed(0);
					var pointvalue = parseFloat(values + .50).toFixed(0);
					if (value >= $(this)[0].scrollHeight) {
						setFaceEmotionCardScrollOnLoad(event, userName);
					} else if (pointvalue >= $(this)[0].scrollHeight) {
						setFaceEmotionCardScrollOnLoad(event, userName);
					}
				});
			}
		}
	});
}

function setFaceEmotionCardScrollOnLoad(event, candidateName, youtubeUrl, mediaFlag) {
	showLoader();
	var today = new Date();
	var todate = today.getFullYear() + "-" + today.getMonth() + 1 + "-" + today.getDate();
	var fromDate = today.getFullYear() - 1 + "-" + today.getMonth() + 1 + "-" + today.getDate();
	var count = FaceEmo + 5;
	FaceEmo = count;
	$.ajax({
		type: "POST",
		url: 'getSocialLinkUserProfileAllCard',
		data: {
			youtubeUrl: youtubeUrl,
			count: count,
			fromDate: fromDate,
			todate: todate,
			candidateName: candidateName,
			flag: true
		},
		traditional: true,
		cache: false,
		success: function(result) {
			stopLoader();
			var response = JSON.parse(result);
			result = response['result'];
			if (mediaFlag != null && mediaFlag != undefined && mediaFlag == 'Y') {
				$("#faceEmotionCard").html(result);
			} else {
				$("#faceEmoctionAllEmageRecord").html(result);
			}
		}
	});

}





function setFullCalender(type) {
	if (type === "TL") {
		var calendarEl = document.getElementById('calendarFull');
		var currentUserProfile = $(".innerBodyContent h4").text();
		var sociallinkTag = "TW_TIMELINE_REPLY_ANALYSIS";
		calanderEventCompare(calendarEl, "M", currentUserProfile, sociallinkTag, 'T');
	} else if (type === "T") {
		var calendarE2 = document.getElementById('calendarFullTwi');
		var sociallinkTag = "TW_TIMELINE_REPLY_ANALYSIS";
		var currentUserProfile = $(".innerBodyContent h4").text();
		calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'T');
	} else if (type === "Y") {
		var calendarE2 = document.getElementById('calendarFullYouTube');
		var sociallinkTag = "YT_ANALYSIS";
		var currentUserProfile = $(".innerBodyContent h4").text();
		calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'Y');
	} else if (type === "F") {
		var calendarE2 = document.getElementById('calendarFullFacebook');
		var sociallinkTag = "TW_TIMELINE_TW_SENT_ANALYSIS";
		var currentUserProfile = $(".innerBodyContent h4").text();
		calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'F');
	} else if (type === "I") {
		var calendarE2 = document.getElementById('calendarFullInstagram');
		var sociallinkTag = "AUDIO_EMOTION_ANALYSIS";
		var currentUserProfile = $(".innerBodyContent h4").text();
		calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'I');
	} else if (type === "NP") {
		var calendarE2 = document.getElementById('calendarFullNewsPaper');
		var sociallinkTag = "NP_ANALYSIS";
		var currentUserProfile = $(".innerBodyContent h4").text();
		calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'NP');
	} else if (type === "V") {
		var calendarE3 = document.getElementById('calendarFullVoiceEmotions');
		var sociallinkTag = "AUDIO_EMOTION_ANALYSIS";
		var currentUserProfile = $(".innerBodyContent h4").text();
		calanderEventCompare(calendarE3, "M", currentUserProfile, sociallinkTag, 'V');
	} else if (type === "NC") {
		var calendarE2 = document.getElementById('calendarFullNewsChannel');
		var sociallinkTag = "DXP_NEWSPAPER_ANALYSIS";
		var currentUserProfile = $(".innerBodyContent h4").text();
		calanderEventCompare(calendarE2, "M", currentUserProfile, sociallinkTag, 'NC');
	}
}

function audioModal(url) {
	var controlInd = $(this).attr("data-value");
	var iframe = "<div class='dxpvideo'><iframe width='100%' height='315' id='iFrameVideo' src='" + url + "' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></div>";
	var modalObj = {
		title: 'User Profile Data',
		body: iframe
	};
	var buttonArray = [
		{
			text: 'OK',
			click: function() {
				$('#iFrameVideo').attr('src', "");
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".modal-dialog").addClass("modal-xs");
}
function compareCandidate(evt, cityName, compareFlag, currentElementDiv) {
	var i, tabcontentCompare, tablinksCompare;
	var targetDivID = currentElementDiv.id;
	tabcontentCompare = document.getElementsByClassName("tabcontentCompare");
	for (i = 0; i < tabcontentCompare.length; i++) {
		tabcontentCompare[i].style.display = "none";
	}
	tablinksCompare = document.getElementsByClassName("tablinksCompare");
	for (i = 0; i < tablinksCompare.length; i++) {
		tablinksCompare[i].className = tablinksCompare[i].className.replace(" active", "");
	}
	//    document.getElementById(cityName).style.display = "block";
	$("#" + cityName).css("display", "block");
	//    evt.target.className += " active";
	$("#" + targetDivID).addClass('active');
	if (compareFlag !== null && compareFlag !== '' && compareFlag !== undefined) {
		$("#lastSevenDays" + compareFlag + "").click();
		if (compareFlag === 'TL') {
			var calendarEl = document.getElementById(cityName);
			var compareValue = $("#comparedefaultOpen").attr("compareValue"); //28622
			var compareType = $("#comparedefaultOpen").attr("compareType"); //28622
			//27622
			calanderEventCompare(calendarEl, compareType, compareValue, "", "T");
		}
	}
}
function compareSocialInfo(evt, cityName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontentCompareHorizontal");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	//    document.getElementById(cityName).style.display = "block";
	$("#" + cityName).css("display", "block");
	evt.target.className += " active";
}
function showMoreProfDetails(basicData) {
	var divValue = '</div><div class="card-body"><table class="table table-bordered"><tbody>\n\
                    <tr><td>Born</td><td>24 July 1976 (age 45 years), Siddipet</td></tr>\n\
                    <tr><td>Full Name</td><td>Kalvakuntla Taraka Rama Rao</td></tr>\n\
                    <tr><td>Permenant Address</td><td>Siddipet</td></tr>\n\
                    <tr><td>Present Address</td><td>Pragathi Bhavan</td></tr>\n\
                    <tr><td>Children</td><td>Himanshu Rao, Alekhya Rao</td></tr>\n\
                    <tr><td>Political party</td><td>Telangana Rashtra Samithi</td></tr>\n\
                    <tr><td>Parent(s)</td><td>K. Chandrashekar Rao (father)</br> Shobha Rao (mother)</td></tr>\n\
                    <tr><td>Relatives</td><td>K. Kavitha (sister)</td></tr>\n\
                    </tbody></table></div></div>';
	var modalObj = {
		title: labelObject['Profile Data'] != null ? labelObject['Profile Data'] : 'Profile Data',
		body: divValue,
	};
	var buttonArray = [
		{
			text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".dataDxpSplitterValue").addClass("moreProfileData");
	$(".modal-dialog").addClass("modal-xs");
	stopLoader();
}
function showPinnedData(basicdata) {
	if (pinnedData == false) {
		partyChangedColor = basicdata['party'];
		var divValue = '<div class="card-header trs party' + partyChangedColor + '"><h5 class="card-title">More Profile Data</h5>\n\
                    <span class="dxpViewCloseUser" onclick="dxpprofClose()">X</span></div>\n\
                    </div><div class="card-body"><table class="table table-bordered"><tbody>\n\
                    <tr><td>Born</td><td>24 July 1976 (age 45 years), Siddipet</td></tr>\n\
                    <tr><td>Full Name</td><td>Kalvakuntla Taraka Rama Rao</td></tr>\n\
                    <tr><td>Permenant Address</td><td>Siddipet</td></tr>\n\
                    <tr><td>Present Address</td><td>Pragathi Bhavan</td></tr>\n\
                    <tr><td>Children</td><td>Himanshu Rao, Alekhya Rao</td></tr>\n\
                    <tr><td>Political party</td><td>Telangana Rashtra Samithi</td></tr>\n\
                    <tr><td>Parent(s)</td><td>K. Chandrashekar Rao (father), Shobha Rao (mother)</td></tr>\n\
                    <tr><td>Relatives</td><td>K. Kavitha (sister)</td></tr>\n\
                    </tbody></table></div></div>';
		$(".dxpProfileMoreDataApndClass").append(divValue);
		$(".dxpProfileMoreDataApndClass").css("display", "block");
		$(".dxpProfileMoreDetails").hide();
		$(".dxpProfilePinClass").hide();
	} else {
		$(".dxpProfileMoreDataApndClass").css("display", "block");
		$(".dxpProfileMoreDetails").hide();
		$(".dxpProfilePinClass").hide();
		var partyT = basicdata['party'];
		$("#profileId .dxpProfileMoreDataApndClass .trs").addClass('party' + partyT);
	}
}
function dxpprofClose() {
	pinnedData = true;
	$(".dxpProfileMoreDataApndClass").hide();
	$(".dxpProfileMoreDataApndClass").val("");
	$(".dxpProfileMoreDetails").show();
	$(".dxpProfilePinClass").show();
}
function getkeyPartyResults(user) {
	var party = user;
	if (party == "TRS") {
		window.open("https://en.wikipedia.org/wiki/Telangana_Rashtra_Samithi");
	} else if (party == "BJP") {
		window.open("https://en.wikipedia.org/wiki/Bharatiya_Janata_Party");
	} else if (party == "AIMIM") {
		window.open("https://en.wikipedia.org/wiki/All_India_Majlis-e-Ittehadul_Muslimeen");
	}
}
function getkeyRelegionResults(user) {
	var religion = user;
	if (religion == "HINDU") {
		window.open("https://en.wikipedia.org/wiki/Hinduism");
	} else if (religion == "MUSLIM") {
		window.open("https://www.newworldencyclopedia.org/entry/Islam_in_India");
	}
}
function getkeyCasteResults(user) {
	var caste = user;
	if (caste == "ST") {
		window.open("https://en.wikipedia.org/wiki/Scheduled_Castes_and_Scheduled_Tribes");
	} else if (caste == "OC") {
		window.open("https://en.wikipedia.org/wiki/Forward_caste");
	} else if (caste == "SC") {
		window.open("https://en.wikipedia.org/wiki/Scheduled_Castes_and_Scheduled_Tribes");
	} else if (caste == "OBC") {
		window.open("https://en.wikipedia.org/wiki/Other_Backward_Class");
	}
}
function getkeyEducationResults(user) {
	var education = user;
	window.open("https://en.wikipedia.org/wiki/" + education);
}
function getkeyPoliticalCareerResults(user) {
	var religion = user;
	if (religion != "") {
		window.open("https://en.wikipedia.org/wiki/MLA");
	}
}

function getkeyConstitutionResults(user) {
	var constitution = user;
	if (constitution != "") {
		window.open("https://en.wikipedia.org/wiki/" + constitution);
	}
}
function getkeySpouseResults(user) {
	var spouse = user;
	var name = spouse.toLowerCase();
	var uppercaseWords = str => str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
	var username = uppercaseWords(name);
	if (spouse != "") {
		window.open("https://en.wikipedia.org/wiki/" + username);
	}
}
function getMobileNoShow(mobileNo) {
	var modalObj = {
		title: labelObject['Mobile Number'] != null ? labelObject['Mobile Number'] : 'Mobile Number',
		body: mobileNo,
	};
	var buttonArray = [
		{
			text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".modal-dialog").addClass("modal-xs");
}
function initialize() {

	var body = '<div id="map_canvas" style="width:100%; height:100%;"></div>';
	var modalObj = {
		title: 'Vendor Location',
		body: body
	};
	var buttonArray = [
		{

		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dxpClassficationAppendClass", modalObj);
	$(".modal-dialog").addClass("modal-xl dxpCompareGridRowsData");
	$(".dxpClassficationAppendClass").css("padding-top", "0");
	$(".dxpCompareGridRowsData .modal-dialog").css("margin-top", "20");
	$(".dxpCompareGridRowsData .modal-body").addClass("mapData");
	var points = [
		['name1', 77.609255, 30.19232525792222, 12, 'https://docs.jsfiddle.net/use-cases/code-snippets-hosting'],
		['name2', 59.941412822085645, 30.263564729357767, 11, 'https://jsfiddle.net/about'],
		['name3', 59.939177197629455, 30.273554411974955, 10, 'https://docs.jsfiddle.net/']
	];
	var myOptions = {
		center: new google.maps.LatLng(59.91823239768787, 30.243222856188822),
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	setMarkers(map, points);
}
function setMarkers(map, locations) {
	var shape = {
		coord: [1, 1, 1, 20, 18, 20, 18, 1],
		type: 'poly'
	};
	for (var i = 0; i < locations.length; i++) {
		var place = locations[i];
		var myLatLng = new google.maps.LatLng(place[1], place[2]);
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			shape: shape,
			title: place[0],
			zIndex: place[3],
			url: place[4]
		});
		google.maps.event.addListener(marker, 'click', function() {
			window.location.href = this.url;
		});
	}
}
function showMap(constitutionName, type) {
	var titleWord = "";
	if (type != null && type != undefined && type != "" && type == 'C') {
		titleWord = "Constituency";
	} else if (type != null && type != undefined && type != "" && type == 'D') {
		titleWord = "District";
	} else {
		titleWord = "Location";
	}
	var url = "https://maps.google.com/?q=" + constitutionName + "&t=&z=13&ie=UTF8&iwloc=&output=embed";
	var iframe = "<iframe width='100%' height='500' id='gmap_canvas' src='" + url + "' frameborder='0' scrolling='no' marginheight='0' marginwidth='0'></iframe>";
	//    window.open(url);
	var modalObj = {
		title: labelObject["" + constitutionName + " " + titleWord + ""] != null ? labelObject["" + constitutionName + " " + titleWord + ""] : "" + constitutionName + " " + titleWord + "",
		body: iframe,
	};
	var buttonArray = [
		{
			text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".dataDxpSplitterValue").addClass('candidateLocation');
	$(".modal-dialog").addClass("modal-xl");
	//    showConstituenciesMap(constitutionName,type);
	stopLoader();
}
function selectedDataShowInPopup(colname, colValue) {
	var modalObj = {
		title: labelObject[colname] != null ? labelObject[colname] : colname,
		body: colValue,
	};
	var buttonArray = [
		{
			text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("showPopupdialogBox", modalObj);
	$(".modal-dialog").addClass("modal-xs");
	$(".showPopupdialogBox").css("z-index", '9999');
}
function calanderEventCompare(calendarEl, type, value, tableName, flag) {
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear() + "-" + (month) + "-" + (day);
	var obj = {
		initialView: 'dayGridMonth',
		initialDate: today,
		headerToolbar: {
			left: '',
			center: 'title',
			right: 'prev,next'
		},
		dayMaxEvents: true, //28622 for multiple event Popup
		themeSystem: 'bootstrap',
		eventClick: function(calEvent, jsEvent, view) {
			detailedSocialMediaPosts(calEvent, value, tableName, flag);
		},
	};
	$.ajax({
		type: 'POST',
		url: "getCalanderEvents",
		data: {
			compareType: type,
			compareValue: value,
			mediaflag: flag,
		},
		traditional: true,
		cache: false,
		success: function(result) {
			if (result != null && result != undefined && result != '') {
				obj.events = [];
				console.log(result);
				result = JSON.parse(result);
				if (result.userList != null && result.userList != undefined && result.userList != '') {
					result.userList = result.userList.split(",");
					for (let i in result.start) {
						var resultObj = {};
						resultObj.start = result.start[i];
						resultObj.title = result.title[i];
						if (resultObj.title == result.userList[1]) {
							resultObj.backgroundColor = "red";
						} else {
							resultObj.backgroundColor = "blue";
						}
						obj.events.push(resultObj);
					}
				}
				console.log(resultObj);
				var calendar = new FullCalendar.Calendar(calendarEl, obj);
				calendar.render();
			}
		}
	});
}
function getkeyConstituencyResults(event) {
	ajaxStart();
	var value = $("#firstSplitterSearchId").val().toUpperCase();
	console.log("value" + value);
	$(".dxpUserBasedTemplateClass").filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	});
	$.ajax({
		type: "POST",
		url: 'getSearchConstituencyData',
		data: {
			'value': value,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			ajaxStop();
			$("#mainDxpSplitter").show();
			$('#firstDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: 250 }] });
			$("#searchedDxpFirstSearchProfilResults").html(response);
		}
	});
}
function getUserConstituencyData(constituencyName, currentElement) {
	showLoader();
	//    $("#profileUser").val(userName);
	$(".homeSocialTrends").hide();
	$(".IndiaVotesTemp").hide();
	$("#mainDxpSplitter").show();
	$(".dxpUserBasedTemplateClass").removeClass('activeClass');
	var parentDIv = $(currentElement).parent();
	parentDIv.addClass('activeClass');
	$.ajax({
		type: "POST",
		url: 'getDXPConstituencyUserTemplateData',
		data: {
			constitution: constituencyName,
		},
		traditional: true,
		cache: false,
		success: function(result) {
			stopLoader();
			$("#secondDxpSplitter").show();
			$("#secondDxpSplitterData").html(result);
			$("#AcNameDefaultOpen").click();
			showEachConstituencyMap(constituencyName, '', 'isIndudvalConstituency');
			$('#secondDxpSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', splitBarSize: 0, panels: [{ size: 1500 }] });
		}

	});
}
//function showConstituency(constitutionName) {
//    showLoader();
//    var url = "https://maps.google.com/?q=" + constitutionName + "&t=&z=13&ie=UTF8&iwloc=&output=embed";
//    var iframe = "<iframe width='1300' height='800' id='gmap_canvas' src='" + url + "' frameborder='0' scrolling='no' marginheight='0' marginwidth='0'></iframe>";
//
//    stopLoader();
//}
function ConstituencyVtabs(evt, tabName) {
	var i, constituencyTabContent, constituencyTabLink;
	constituencyTabContent = $(".constituencyTabContent");
	for (i = 0; i < constituencyTabContent.length; i++) {
		constituencyTabContent[i].style.display = "none";
	}
	constituencyTabLink = document.getElementsByClassName("constituencyTabLink");
	for (i = 0; i < constituencyTabLink.length; i++) {
		constituencyTabLink[i].className = constituencyTabLink[i].className.replace(" active", "");
	}
	$("#" + tabName).css("display", "block");
	evt.target.className += " active";
}
function detailedSocialMediaPosts(dateValue, value, table, flag) {
	showLoader();
	var date = "";
	if (flag != null && flag != undefined && flag != "" && flag.lastIndexOf(":") > -1) {
		date = dateValue;
		var flagTypes = flag.split(":");
		flag = flagTypes[0];
	} else {
		date = convert(dateValue.event.start);
	}

	var compareType = $("#compareType").val();
	console.log(value, date);
	$.ajax({
		type: 'POST',
		url: "getUserMediaDetailsByDate",
		data: {
			candName: value,
			postDate: date,
			socialMedia: table,
			compareType: compareType,
			Mediaflag: flag,
		},
		traditional: true,
		cache: false,
		success: function(result) {
			stopLoader();
			var resultObj = JSON.parse(result);
			var modalObj = {
				title: "Day Wise " + resultObj['mediaFlag'] + " Details (" + date + ")",
				body: resultObj['displayContent'],
			};
			var buttonArray = [
				{
					text: "OK",
					click: function() {
					},
					isCloseButton: true
				},
			];
			modalObj['buttons'] = buttonArray;
			createModal("modalInfoDailogDiv", modalObj);
			$(".modal-dialog").addClass("modal-xl dxpToolBarCustomize opacity-animate3");
			$("#modalInfoDailogDiv").css('z-index', '99999', '!important');
			$(".modal-body").css("height", "350");
			$(".modal-body").css("overflow-y", "auto");
			if (flag == 'T' && flag != null && flag != '') {
				$(".modal-header").addClass("intsenseTHeader");
			} else if (flag == 'Y' && flag != null && flag != '') {
				$(".modal-header").addClass("intsenseYHeader");
			} else if (flag == 'NP' && flag != null && flag != '') {
				$(".modal-header").addClass("intsenseNPHeader");
			} else if (flag == 'NC' && flag != null && flag != '') {
				$(".modal-header").addClass("intsenseNCHeader");
			}
			$(".modal-header").css("color", "white");
		}
	});
}

function convert(str) {
	var date = new Date(str),
		mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		day = ("0" + date.getDate()).slice(-2);
	return [date.getFullYear(), mnth, day].join("-");
}
function showSubmenus() {
	console.log('values');
}
function showCountDetails(userName, fromDate, toDate, tableName) {
	showLoader();
	$.ajax({
		type: 'POST',
		url: "getCandidateSentimentTweets",
		data: {
			userName: userName,
			fromDate: fromDate,
			toDate: toDate,
			tableName: tableName,
		},
		traditional: true,
		cache: false,
		success: function(result) {
			stopLoader();
			var displayContent = "";
			var popupsize = "";
			if (result == null || result == '' || result == undefined || result == '{}') {
				displayContent = "No data to display.";
				popupsize = "modal-xs";
			} else {
				var resultObj = JSON.parse(result);
				displayContent = resultObj['displayContent'];
				popupsize = "modal-xl";
			}
			var modalObj = {
				title: "Tweet Details",
				body: displayContent,
			};
			var buttonArray = [
				{
					text: "OK",
					click: function() {
					},
					isCloseButton: true
				},
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass(popupsize);
		}
	});
}
function showCollabaratorsData(id, type) {
	$("#" + id).addClass("collaborativeClick");
	$('.collaborativeClick').css("color", "blue");
}
function collabrativetToggleView(event, id) {
	var checked = event.currentTarget.checked;
	if (checked) {
		$(".switchTextTitles").hide();
		$(".switchTextTitle").show();
		$("#showListView").hide();
		$(".collabarativeViewsClass").show();
	} else {
		$("#showListView").show();
		$(".collabarativeViewsClass").hide();
		$(".switchTextTitle").hide();
		$(".switchTextTitles").show();
	}
}
function socialMedialShowCaseCards() {
	showLoader();
	$.ajax({
		type: "POST",
		url: 'getHomepageShowcaseCards',
		data: {
			constitution: "",
		},
		traditional: true,
		cache: false,
		success: function(result) {
			stopLoader();
			if (result != null && result != "" && result != undefined) {
				var resultObj = JSON.parse(result);
				$("#pageBodyContent").html(resultObj['showCards']);
				$("#hintImageID").show();
				$("#hintImageID").html('<img src="images/idea-icon-trans-bg.png" class="hintImageClass" id="hintImageID" width="20px"/><span class="textHint" id="textHintID" onclick="homePageGuide()">Help me to navigate</span>');
				$("#districtSearchListBox").val(resultObj['districtSearchListBox']);
				$("#constituencySearchListBox").val(resultObj['constituencySearchListBox']);
				$("#candidateSearchListBox").val(resultObj['candidateSearchListBox']);
				$("#partySearchListBox").val(resultObj['partySearchListBox']);
				typesDataObj = resultObj['typesDataObj'];
			}
			$('.card-body').scroll(function() {
				var values = $(this).scrollTop() + $(this).innerHeight();
				var value = parseFloat(values).toFixed(0);
				var pointvalue = parseFloat(values + .50).toFixed(0);
				if (value >= $(this)[0].scrollHeight) {
					allCardrefreshOnLoad(event);
				} else if (pointvalue >= $(this)[0].scrollHeight) {
					allCardrefreshOnLoad(event);
				}
			});
			var fromDate = new Date().toISOString().split("T")[0];
			$(".filterTweets").attr("max", fromDate);
			$(".card").draggable({
				revert: true,
				refreshPositions: true,
				cursor: 'move',
				zindex: false,
				opacity: false,
				start: function(event, ui) {
					var charts = $(".trendsCols");
					var zindexMaxVal = 399;
					$.each(charts, function(i, val) {
						var zIndex = $(this).css("z-index");
						if (zIndex != null && zIndex != '' && zIndex == 'auto') {
							zIndex = 399;
						}
						zIndex = parseInt(zIndex);
						if (zIndex > zindexMaxVal) {
							zindexMaxVal = zIndex
						}

					})
					var target = event.target;
					var chartDragId = target['id'];
				},
				stop: function(event, ui) {
					ui.helper.removeClass("draggableTable");
				}
			});
			$(".trendscolumn").droppable({
				revert: "invalid",
				refreshPositions: true,
				cursor: 'move',
				accept: '.card',
				drop: function(event, ui) {
					var $this = $(this);
					var children = $(this).children();
					var draggable = $(ui.draggable);
					if ($(this).children().length > 0) {
						var move = $(this).children().detach();
						$(ui.draggable).parent().append(move);
					}
					$(this).append($(ui.draggable));
				}
			});
			var PartyData = resultObj['partyHomeData'];
			var data = PartyData.split(',');
			var data3 = resultObj['candidatesListList'];
			var data2 = resultObj['constitutionList'];
			var data1 = resultObj['districtList'];
			//            var data4 = resultObj['partySearchListBox'];
			$("#partyListListData").jqxDropDownList({
				source: data,
				theme: 'energyblue',
				filterable: true,
				checkboxes: true,
				placeHolder: "<div style='color:#00186a;font-weight:bold;'>Search Party....</div>"
			});
			$("#partyListListData").jqxDropDownList('uncheckAll');
			$("#districtListData").jqxDropDownList({
				source: data1,
				theme: 'energyblue',
				checkboxes: true,
				filterable: true,
				placeHolder: "<div style='color:#00186a;font-weight:bold;'>Search District....</div>"
			});
			$("#constitutionListData").jqxDropDownList({
				source: data2,
				theme: 'energyblue',
				filterable: true,
				checkboxes: true,
				placeHolder: "<div style='color:#00186a;font-weight:bold;'>Search Constitution....</div>"
			});
			//13-12-2022
			$("#dropDownButton").jqxDropDownButton({
				width: 250,
				height: 25,
				theme: "blue",

			});
			var placeHolder = "<div style='color:#00186a;font-weight:bold;margin-top: 4px;'>Select Candidate....</div>";
			$("#dropDownButton").jqxDropDownButton('setContent', placeHolder);
			$('#candidatesListListData').on('select', function(event) {
				var args = event.args;
				var item = $('#candidatesListListData').jqxTree('getItem', args.element);
				var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + item.label + '</div>';
				$("#dropDownButton").jqxDropDownButton('setContent', dropDownContent);
			});
			$('#candidatesListListData').jqxTree('checkAll');
			$("#candidatesListListData").jqxTree({
				width: 250,
				height: 220,
				checkboxes: true
			});
			var placeHolder = "<div style='color:#00186a;font-weight:bold;'>Select State....</div>";
			$("#candidatesListListData").jqxDropDownButton('setContent', placeHolder);
			//13-12-2022
			//			$("#candidatesListListData").jqxDropDownList({
			//				source: data3,
			//				theme: 'energyblue',
			//				filterable: true,
			//				checkboxes: true,
			//				placeHolder: "<div style='color:#00186a;font-weight:bold;'>Search Candidate....</div>"
			//			});
			$("#candidatesStateListData").jqxDropDownList({
				//                source: data4,
				theme: 'energyblue',
				checkboxes: true,
				filterable: true,
				placeHolder: "<div style='color:#00186a;font-weight:bold;'>Select State....</div>"
			});
			$("#candidatesStateListData").jqxDropDownList('uncheckAll');
			//            $('#candidatesStateListData').jqxDropDownList({animationType: 'fade'});
			var typesArr = [];
			typesArr.push('T');
			typesArr.push('Y');
			typesArr.push('F');
			typesArr.push('I');
			typesArr.push('NP');
			typesArr.push('NC');
			typesArr.push('LU');
			typesArr.push('S');
			$("#partyListListData").on('checkChange', function(event) {
				var selectedData = $("#partyListListData").jqxDropDownList('val');
				var id = "intellisenseP";
				getHomeCardResults(id, 'P', event, selectedData);
				if (selectedData != null && selectedData != undefined && selectedData != '') {
					setTimeout(function() {

						for (var i = 0; i < typesArr.length; i++) {

							showWithFilterMsginHeader(typesArr[i], selectedData + " Party");
						}
					}, 500);
				}
			});
			$("#districtListData").on('checkChange', function(event) {
				var selectedData = $("#districtListData").jqxDropDownList('val');
				var id = "intellisenseD";
				getHomeCardResults(id, 'D', event, selectedData);
				if (selectedData != null && selectedData != undefined && selectedData != '') {
					setTimeout(function() {
						for (var i = 0; i < typesArr.length; i++) {
							showWithFilterMsginHeader(typesArr[i], selectedData + " District");
						}
					}, 500);
				}
			});
			$("#constitutionListData").on('checkChange', function(event) {
				var selectedData = $("#constitutionListData").jqxDropDownList('val');
				var id = "intellisenseC";
				getHomeCardResults(id, 'C', event, selectedData);
				if (selectedData != null && selectedData != undefined && selectedData != '') {
					setTimeout(function() {
						for (var i = 0; i < typesArr.length; i++) {
							showWithFilterMsginHeader(typesArr[i], selectedData + " Constituency");
						}
					}, 500);
				}
			});
			$("#candidatesListListData").on('checkChange', function(event) {
				var args = event.args;
				var element = args.element;
				var checked = args.checked;
				var item = $('#candidatesListListData').jqxTree('getItem', args.element);
				var listContent = item.label;
				if (checked != null && checked != '' && checked == true && listContent == 'MLA' || listContent == 'MP' || listContent == 'Lok Sabha' || listContent == 'Rajya Sabha') {
					var selectedData = "";
					listContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + item.label + '</div>';
					$("#dropDownButton").jqxDropDownButton('setContent', listContent);

				}
				else if (checked != null && checked != '' && checked == true) {
					var selectedData = $(element).text();
					listContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">' + item.label + '</div>';
					$("#dropDownButton").jqxDropDownButton('setContent', listContent);
				}
				else {
					var selectedData = "";
					var listContent = "";
					$("#dropDownButton").jqxDropDownButton('setContent', listContent);

				}
				var id = "intellisenseM";
				//                if (selectedData != null && selectedData != undefined && selectedData != '') {
				getHomeCardResults(id, 'M', event, selectedData);

				if (selectedData != null && selectedData != undefined && selectedData != '') {
					setTimeout(function() {
						for (var i = 0; i < typesArr.length; i++) {
							showWithFilterMsginHeader(typesArr[i], selectedData + " Candidate");
						}
					}, 500);
				}

			});
			changeThemeVisualization();
			//			$("#candidatesListListData").on('checkChange', function(event) {
			//				var selectedData = $("#candidatesListListData").jqxDropDownList('val');
			//				var id = "intellisenseM";
			//				//                if (selectedData != null && selectedData != undefined && selectedData != '') {
			//				getHomeCardResults(id, 'M', event, selectedData);
			//				//                }
			//				if (selectedData != null && selectedData != undefined && selectedData != '') {
			//					setTimeout(function() {
			//						for (var i = 0; i < typesArr.length; i++) {
			//							showWithFilterMsginHeader(typesArr[i], selectedData + " Candidate");
			//						}
			//					}, 500);
			//				}
			//			});
			//			changeThemeVisualization();
		}
	});
}
function openSocialMediaSite(tweetUrl) {
	window.open(tweetUrl);
}
function dateFilterPinnedCard(className, type) {
	showWithFilterMsginHeader(type, "Date");
	$("." + className).show();
	$("." + className + type + "Remove").show();
	$("." + className + type).hide();
	$("#isFilterAllTypes" + type).hide();
}
function showcaseCardsTime(id, type, appendClass, showHideFilteClass) {
	showLoader();
	var fromDate = $("#filterCardsDateFrom" + type + "").val();
	//    $("#filterCardsDateFrom" + type + "").setAttribute("max", fromDate);
	var toDate = $("#filterCardsDateTo" + type + "").val();
	//    $("#filterCardsDateTo" + type + "").setAttribute("max", toDate);
	if (fromDate != null && fromDate != '' && fromDate != undefined
		&& toDate != null && toDate != '' && toDate != undefined) {
		$.ajax({
			type: "POST",
			url: 'getShowCasecardsFilterData',
			data: {
				'fromDate': fromDate,
				'toDate': toDate,
				'id': id,
				'type': type,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				stopLoader();
				if (response != null && response != undefined && response != '') {
					$("#" + appendClass).html(response);
				}
				dateFilterPinnedCard(showHideFilteClass, type);
				$("#filterCardsDateTo" + type + "").attr("max", toDate);
				var newFromDate = new Date().toISOString().split("T")[0];
				$("#filterCardsDateFrom" + type + "").attr("max", newFromDate);
				$("#filterCardsDateFrom" + type + "").val(fromDate);
				$("#filterCardsDateTo" + type + "").val(toDate);
				showWithFilterMsginHeader(type, "Date");
			}
		});
	}
}
function refreshPinnedCard(type, appendClass, updatedClass) {
	showWithFilterMsginHeader(type, "Refresh");
	showLoader();
	$.ajax({
		type: "POST",
		url: 'getShowCasecardsFilterData',
		data: {
			'type': type,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			var interval = "interval" + type + "";
			if (intervalNP != 0 && interval == 'intervalNP') {
				clearInterval(intervalNP);
			} else if (intervalNC != 0 && interval == 'intervalNC') {
				clearInterval(intervalNC);
			} else if (intervalS != 0 && interval == 'intervalS') {
				clearInterval(intervalS);
			} else if (intervalLU != 0 && interval == 'intervalLU') {
				clearInterval(intervalLU);
			} else if (intervalI != 0 && interval == 'intervalI') {
				clearInterval(intervalI);
			} else if (intervalF != 0 && interval == 'intervalF') {
				clearInterval(intervalF);
			} else if (intervalY != 0 && interval == 'intervalY') {
				clearInterval(intervalY);
			} else if (intervalT != 0 && interval == 'intervalT') {
				clearInterval(intervalT);
			}
			if (response != null && response != undefined && response != '') {
				$("#" + appendClass).html(response);
			}
			var intervalTypeCount = interval + "Count";
			intervalTypeCount = 0;
			if (interval == 'intervalNP') {
				intervalNP = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			} else if (interval == 'intervalNC') {
				intervalNC = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			} else if (interval == 'intervalS') {
				intervalS = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			} else if (interval == 'intervalLU') {
				intervalLU = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			} else if (interval == 'intervalI') {
				intervalI = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			} else if (interval == 'intervalF') {
				intervalF = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			} else if (interval == 'intervalY') {
				intervalY = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			} else if (interval == 'intervalT') {
				intervalT = setInterval(function() {
					intervalTypeCount++;
					$("#" + updatedClass).text("" + intervalTypeCount + " min(s) ago");
				}, 60000);
			}
			$(".card").draggable({
				revert: true,
				refreshPositions: true,
				cursor: 'move',
				zindex: false,
				opacity: false,
				start: function(event, ui) {
					var charts = $(".trendsCols");
					var zindexMaxVal = 399;
					$.each(charts, function(i, val) {
						var zIndex = $(this).css("z-index");
						if (zIndex != null && zIndex != '' && zIndex == 'auto') {
							zIndex = 399;
						}
						zIndex = parseInt(zIndex);
						if (zIndex > zindexMaxVal) {
							zindexMaxVal = zIndex
						}

					})
					var target = event.target;
					var chartDragId = target['id'];
				},
				stop: function(event, ui) {
					ui.helper.removeClass("draggableTable");
				}
			});
			$(".trendscolumn").droppable({
				revert: "invalid",
				refreshPositions: true,
				cursor: 'move',
				accept: '.card',
				drop: function(event, ui) {
					var $this = $(this);
					var children = $(this).children();
					var draggable = $(ui.draggable);
					if ($(this).children().length > 0) {
						var move = $(this).children().detach();
						$(ui.draggable).parent().append(move);
					}
					$(this).append($(ui.draggable));
				}
			});
			$("#appendTypeToCard" + type + "").hide();
		}
	});
}
function convertSentimentCountToPercent() {
	$(".sentimentProgress").each(function() {
		var value = $(this).attr('data-value');
		var left = $(this).find('.sentimentProgress-left .sentimentProgress-bar');
		var right = $(this).find('.sentimentProgress-right .sentimentProgress-bar');
		if (value > 0) {
			if (value <= 50) {
				right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
			} else {
				right.css('transform', 'rotate(180deg)')
				left.css('transform', 'rotate(' + percentageToDegrees(value - 90) + 'deg)')
			}
		}

	})

}
function percentageToDegrees(percentage) {
	return percentage / 100 * 360;
}
$('#districtListData').on('click', function(event) {
	var args = event.args;
	var checkedCandidates = "";
	checkedCandidates = args.label;
	if (!args.checked) {
		var cand = checkedCandidates.replace(/\s+/g, '');
		$("#table" + cand + "").remove();
	}
});
function getHomeCardResults(id, cardType, event, selectedData) {
	showLoader();
	var cardValue = selectedData;
	$.ajax({
		type: "POST",
		url: 'getHomepageShowcaseCards',
		data: {
			'cardValue': cardValue,
			'cardType': cardType,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			if (response != null && response != "" && response != undefined) {
				var resultObj = JSON.parse(response);
				if (cardType == null) {
					$("#pageBodyContent").html(resultObj['showCards']);
				} else {
					$("#homeSocialTrends").html(resultObj['showCards']);
				}
				$("#districtSearchListBox").val(resultObj['districtSearchListBox']);
				$("#constituencySearchListBox").val(resultObj['constituencySearchListBox']);
				$("#candidateSearchListBox").val(resultObj['candidateSearchListBox']);
				$("#partySearchListBox").val(resultObj['partySearchListBox']);
				typesDataObj = resultObj['typesDataObj'];
			}
			$(".card").draggable({
				revert: true,
				refreshPositions: true,
				cursor: 'move',
				zindex: false,
				opacity: false,
				start: function(event, ui) {
					var charts = $(".trendsCols");
					var zindexMaxVal = 399;
					$.each(charts, function(i, val) {
						var zIndex = $(this).css("z-index");
						if (zIndex != null && zIndex != '' && zIndex == 'auto') {
							zIndex = 399;
						}
						zIndex = parseInt(zIndex);
						if (zIndex > zindexMaxVal) {
							zindexMaxVal = zIndex
						}

					})
					var target = event.target;
					var chartDragId = target['id'];
				},
				stop: function(event, ui) {
					ui.helper.removeClass("draggableTable");
				}
			});
			$(".trendscolumn").droppable({
				revert: "invalid",
				refreshPositions: true,
				cursor: 'move',
				accept: '.card',
				drop: function(event, ui) {
					var $this = $(this);
					var children = $(this).children();
					var draggable = $(ui.draggable);
					if ($(this).children().length > 0) {
						var move = $(this).children().detach();
						$(ui.draggable).parent().append(move);
					}
					$(this).append($(ui.draggable));
				}
			});
		}
	});
	stopLoader();
}
function showHidePinnedCard(type) {
	showWithFilterMsginHeader(type, "Pinned");
	$("#pinCarddxpImg" + type).hide();
	$("#unpinCarddxpImg" + type).show();
	$("#SocialMediaCard" + type).draggable('disable');
}
function showWithFilterMsginHeader(type, message) {
	$("#appendTypeToCard" + type + "").show();
	$("#appendTypeToCard" + type + "").html("");
	var messages = '<img src=\"images/filter_icon_white.png\" style="width:20px"> ' + message;
	$("#appendTypeToCard" + type + "").html(messages);
}
function showHideUnPinnedCard(type) {
	//    showWithFilterMsginHeader(type, "UnPinned")
	$("#appendTypeToCard" + type + "").hide();
	$("#unpinCarddxpImg" + type).hide();
	$("#pinCarddxpImg" + type).show();
	$("#SocialMediaCard" + type).draggable('enable');
}
function threedotImg(type) {
	$("#listofGroupFiltersId" + type).toggle();
	//    showWithFilterMsginHeader(type, "More Options");
}
function salectValueThree() {
	$('#showCaseCardT').toggle();
}
function getEachCardResults(id, politicalType) {
	var filterValue = $("#" + id).val();
	var msg = "";
	var mediaType = $("#showCaseCardType").val();
	if (politicalType == 'P') {
		msg = "Party  " + filterValue + "";
	} else if (politicalType == 'C') {
		msg = "Constituency  " + filterValue + "";
	} else if (politicalType == 'M') {
		msg = "Candidate  " + filterValue + "";
	} else if (politicalType == 'D') {
		msg = "District  " + filterValue + "";
	}
	var type = $("#currentSocialMediaFlag").val();
	showWithFilterMsginHeader(type, msg);
	if (filterValue != null && filterValue != undefined && filterValue != '') {
		$.ajax({
			type: "POST",
			url: 'getEachCardFilterResults',
			data: {
				'politicalType': politicalType,
				'mediaType': mediaType,
				'politicalValue': filterValue,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				if (response != null && response != undefined && response != '') {

					var responseObj = JSON.parse(response);
					$("#" + responseObj['appendedClass']).html("");
					$("#" + responseObj['appendedClass']).html(responseObj['result']);
					$("#isFilterTypes" + mediaType).show();
					$("#isShowSelValue" + mediaType).show();
					showWithFilterMsginHeader(type, msg);
					$("#isFilterAllTypes" + mediaType).jqxDropDownList({
						theme: 'energyblue',
						filterable: true,
						filterPlaceHolder: 'startswith'
					});
					$("#isFilterAllTypes" + mediaType).on('change', function(event) {
						var id = ("isFilterAllTypes" + mediaType);
						var homePageAllShowCaseCardClass = "isShowSelValue" + mediaType;
						var homePageAllShowCaseCardClassSecond = "isFilterTypes" + mediaType;
						getFilterTypesData(id, mediaType, homePageAllShowCaseCardClass, homePageAllShowCaseCardClassSecond)
					});
				}
			}
		});
	}
}
function filterTypes(id, type) {
	$("#isFilterTypes" + type).show();
	$("#isFilterAllTypes" + type).show();
	$("#" + id).show();
	showWithFilterMsginHeader(type, "Party, Ac, Candidate, District");
	$("#showCaseCardType").val(type);
	$("#filterTypesdxpF" + type).hide();
	$("#filterTypesdxpC" + type).show();
	$("#isFilterAllTypes" + type).jqxDropDownList({
		theme: 'energyblue',
		filterable: true,
		filterPlaceHolder: 'startswith'
	});
	$("#isFilterAllTypes" + type).on('change', function(event) {
		var id = ("isFilterAllTypes" + type);
		var homePageAllShowCaseCardClass = "isShowSelValue" + type;
		var homePageAllShowCaseCardClassSecond = "isFilterTypes" + type;
		getFilterTypesData(id, type, homePageAllShowCaseCardClass, homePageAllShowCaseCardClassSecond)
	});
}
function unFilterTypes(id, type) {
	$("#" + id).hide();
	$("#appendTypeToCard" + type + "").hide();
	$("#showCaseCardType").val(type);
	$("#isShowSelValue" + type + "").hide();
	$("#filterTypesdxpC" + type).hide();
	$("#filterTypesdxpF" + type).show();
}
function getFilterTypesData(id, type, appendClass, mainClass) {
	$("#currentSocialMediaFlag").val(type);
	var filterValue = $("#" + id).val();
	$("#" + mainClass).show();
	$("#isFilterTypes" + type + "").show();
	var flagType = "";
	if (filterValue != null && filterValue != undefined && filterValue != '') {
		var selectString = typesDataObj[filterValue];
		var salectFilterString = "";
		if (filterValue != null && filterValue != undefined && filterValue == 'CANDIDATE_NAME') {
			flagType = "M";
			salectFilterString = "<div id='isSelectEachCardM'><b>Cand :</b><select id ='intellisenseCardM' class='intellisenseCardM form-control' onchange=\"getEachCardResults(id,'M','" + type + "')\">" + selectString + "</select></div>";
		} else if (filterValue != null && filterValue != undefined && filterValue == 'CONSTITUENCY_NAME') {
			flagType = "C";
			salectFilterString = "<div id='isSelectEachCardC'><b>Const :</b><select id ='intellisenseCardC' class='intellisenseCardC form-control' onchange=\"getEachCardResults(id,'C','" + type + "')\">" + selectString + "</select></div>";
		} else if (filterValue != null && filterValue != undefined && filterValue == 'DISTRICT') {
			flagType = "D";
			salectFilterString = "<div id='isSelectEachCardD'><b>Dist :</b><select id ='intellisenseCardD' class='intellisenseCardD form-control' onchange=\"getEachCardResults(id,'D','" + type + "')\">" + selectString + "</select></div>";
		} else {
			flagType = "P";
			salectFilterString = selectString;
		}
		$("#isShowSelValue" + type + "").show();
		$("#" + appendClass).html(salectFilterString);
		$(".intellisenseCard" + flagType).jqxDropDownList({
			theme: 'energyblue',
			filterable: true,
			filterPlaceHolder: 'startswith'
		});
		$(".intellisenseCard" + flagType).on('change', function(event) {
			var id = ("intellisenseCard" + flagType);
			getEachCardResults(id, flagType);
		});
	}
	showWithFilterMsginHeader(type, filterValue);
	$("#isFilterAllTypes" + type).hide();
}
$(document).ready(function() {
	$(".isTwitterScrollClass").scroll(function() {
		console.log('scroll happened');
	});
});
function dateFilterUnPinnedCard(className, type) {
	$("#appendTypeToCard" + type + "").hide();
	$("." + className + type).show();
	$("." + className + type + "Remove").hide();
	$("." + className).hide();
	$("#isFilterAllTypes" + type).hide();
}
//function getHomePageSelectBoxResults(id, type) {
//	if (type == null && type == undefined && type == ''){         
//		type = $("#" + id).val();  
//	}
//    if (type != null && type != undefined && type != '' && type == 'MEDIA') {
//        $("#homepagedashboardType").show();
//        $("#mainintelliSenseSelectBoxId").hide();
//        $("#homepagedashboardType").addClass("homePageFilters");
//        showLoader();
//        socialMedialShowCaseCards();
//        stopLoader();
//        $(".visualizationDashboardView").hide();
//        $("#isMainPageDropdownBoxes").show();
//    } else if (type != null && type != undefined && type != '' && type == 'CHARTS') {
//        var htmlData = $("#intelliSenseHomePageOptions").html();
//        getHomePageChartDiv();   
//        setTimeout(function () {
//            $("#mainintelliSenseInnerSelectBoxId").html(htmlData);
//            $(".chartSelectionsDropDown").show();
//            $("#mainintelliSenseSelectBoxId").show();
//            $("#isMainPageDropdownBoxes").hide();
//            $('#intellisenseHomeSelectBox option').removeAttr('selected').filter('[value=CHARTS]').attr('selected', true)
//            showLoader();
//            getVisualizationchart();
//        }, 1000);
//    } else if (type != null && type != undefined && type != '' && type == 'PilogMedia'){
//	   getPilogMedialShowCaseCards();
//      }
//    stopLoader();
//}
function getHomePageSelectBoxResults(id) {
	showLoader();
	$(".mainConversationalAIcontainer").show(); 
	var type = '';
	type = $("#" + id).val();
	if (type == undefined) {
		type = id;
	}
	//    var option='<div class="dashboardTypeSelection"><span class="dashBoardType" id="dashBoardType">'
	//             +'<select id ="intellisenseHomeSelectBox" class="intellisenseHomeSelectBox form-control" style="color:#00186a;font-weight:bold;" onchange=\'getHomePageSelectBoxResults("MEDIA")\'>'
	//             +'<option value="MEDIA">Social Media & News Analysis</option><option value="CHARTS">Infographics</option>'
	//             +'<option value="PilogMedia">Pilog Media & News Analysis</option></select></span></div>';

	if (type != null && type != undefined && type != '' && type == 'MEDIA') {
		$("#homepagedashboardType").show();
		$("#mainintelliSenseSelectBoxId").hide();
		$("#homepagedashboardType").addClass("homePageFilters");
		socialMedialShowCaseCards();
		$(".visualizationDashboardView").hide();
		$("#isMainPageDropdownBoxes").show();
		//		stopLoader();
	} else if (type != null && type != undefined && type != '' && type == 'CHARTS') {
		//        var htmlData = $("#intelliSenseHomePageOptions").html();
		var htmlData = '';
		htmlData = $("#intelliSenseHomePageOptions").html();
		if (htmlData == undefined) {
			htmlData = '<div class="dashboardTypeSelection"><span class="dashBoardType" id="dashBoardType">'
				+ '<select id ="intellisenseHomeSelectBox" class="intellisenseHomeSelectBox form-control" style="color:#00186a;font-weight:bold;" onchange=\'getHomePageSelectBoxResults("intellisenseHomeSelectBox")\'>'
				//+ '<option value="MEDIA">Social Media & News Analysis</option>'
				+ '<option value="CHARTS">InfoGraphics</option>'
				//+ '<option value="PilogMedia">PiLog Media & News Analysis</option>'
				+'</select></span></div>';
		}
		getHomePageChartDiv();
		
		setTimeout(function() {
			$("#mainintelliSenseInnerSelectBoxId").html(htmlData);
			$(".chartSelectionsDropDown").show();
			$("#mainintelliSenseSelectBoxId").show();
			$("#isMainPageDropdownBoxes").hide();
			$("#pilogHomePageCreateCard").hide();
			$('#intellisenseHomeSelectBox option').removeAttr('selected').filter('[value=CHARTS]').attr('selected', true)
			showLoader();
			getVisualizationchart();
		}, 1000);
		//		stopLoader();
	} else if (type != null && type != undefined && type != '' && type == 'PilogMedia') {
		getPilogMedialShowCaseCards();
		//		stopLoader();
	}

}
function getMainSelectBoxData(id, type) {
	var type = $("#" + id).val();
	if (type != null && type != undefined && type != '' && type == 'MEDIA') {
		$(".intelliSenseFilterMultiDropdowns").show();
		$("#homepagedashboardType").show();
		$(".chartSelectionsDropDown").hide();
		$("#homepagedashboardType").addClass("homePageFilters");
		//        socialMedialShowCaseCards();
		$(".visualizationDashboardView").hide();
	} else if (type != null && type != undefined && type != '' && type == 'CHARTS') {
		$(".homeSocialTrends").hide();
		$(".intelliSenseFilterMultiDropdowns").hide();
		$("#homepagedashboardType").removeClass("homePageFilters");
		$("#homepagedashboardType").hide();
		$(".chartSelectionsDropDown").show();
		showLoader();
		getVisualizationchart();
		stopLoader();
	}
}
function showcaseCardsCalendar(type) {
	var fromDate = $("#filterCardsDateFrom" + type + "").val();
	$("#filterCardsDateTo" + type + "").attr("min", fromDate);
	$("#filterCardsDateTo" + type + "").removeAttr("max");
	var fromDate = new Date().toISOString().split("T")[0];
	$("#filterCardsDateTo" + type + "").attr("max", fromDate);
}
function getSurveyData(id, type) {
	var surveyValue = $("#" + id).val();
	if (surveyValue != null && surveyValue != undefined && surveyValue != '') {
		$.ajax({
			type: "POST",
			url: 'getSurveyCardData',
			data: {
				'columnName': surveyValue,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				if (response != null && response != undefined && response != '') {
					$("#showCaseSurveyCard").html(response);
					$("#isFilterSurvey").val(surveyValue);
				}
			}
		});
	}
}
function showConstituenciesMap(district, type, appendDiv) {
	var geocoder = new google.maps.Geocoder();

	geocoder.geocode({ 'address': district }, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			var latitude = results['0']['geometry']['viewport']['Bb']['lo'];
			var longitude = results['0']['geometry']['viewport']['Va']['lo'];


			var constLat = "";
			var constLon = "";
			require([
				"esri/WebMap",
				"esri/Map",
				"esri/layers/GeoJSONLayer",
				"esri/views/MapView",
				"esri/widgets/Legend",
				"esri/PopupTemplate",
				"esri/widgets/Editor"
			], (
				WebMap,
				Map,
				GeoJSONLayer,
				MapView,
				Legend,
				PopupTemplate,
				Editor
			) => {
				var query = "SELECT FILE_CONTENT FROM IS_GEOJSON_FILES WHERE STATE='TELANGANA' AND FIELD_NAME='ASSEMBLY_CONSTITUENCIES' AND YEAR='2018'";
				const url = "getGeoJsonFiles?query=" + query;
				//        const renderer = getRendererProfile("TELANGANA", "2018", "AC");
				const renderer = {
					type: "simple",
					field: "ac_name",
					symbol: {
						type: "simple-fill", // autocasts as new SimpleFillSymbol()
						color: '#' + Math.floor(Math.random() * 19777215).toString(16),
						style: "solid",
						outline: {
							width: 0.2,
							//            color: [255, 255, 255, 0.5]
							color: [0, 0, 0, 0.5]
						}
					}
				};
				getGeoCurrentLocation();
				var location = getLocation(district);
				constLat = latitude;
				constLon = longitude;

				const geojsonLayer = new GeoJSONLayer({
					url: url,
					renderer: renderer,
					opacity: 0.8,
					title: "Constituencies"
				});
				const map = new Map({
					basemap: "gray-vector",
					layers: [geojsonLayer]
				});
				const view = new MapView({
					container: appendDiv,
					center: [constLon, constLat],
					zoom: 8.5,
					map: map
				});
				view.popup.watch("selectedFeature", (graphic) => {
					if (graphic) {
					}
				});
				view.on("click", function(event) {
					console.log(" const clickkkkk");
				});
				const template = new PopupTemplate({
					outFields: ["*"],
					title: "Constituency: {ac_name}",
					content: []
				});
				geojsonLayer.popupTemplate = template;
				const labelClass = {
					// autocasts as new LabelClass()
					symbol: {
						type: "text", // autocasts as new TextSymbol()
						color: "black",
						font: {
							family: "segeo-ui,-apple-system,Roboto,Helvetica Neue,sans-serif",
							size: 8,
						}
					},
					labelPlacement: "above-center",
					labelExpressionInfo: {
						expression: "$feature.ac_name",
					}
				};
				geojsonLayer.labelingInfo = [labelClass];
				if (district != null) {
					geojsonLayer.definitionExpression = "Dist_Name = '" + district + "'";
				}
			});
		}
	});
}
function showDistrictWiseConstistuencies(district, type, appendDiv) {
	var districtValue = district.toLowerCase();
	districtValue = districtValue[0].toUpperCase() + districtValue.substring(1);
	var modalObj = {
		title: labelObject["" + district + ""] != null ? labelObject["" + district + ""] : "" + district + "",
		body: "<div id='districtView'></div>",
	};
	var buttonArray = [
		{
			text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".dataDxpSplitterValue").addClass('candidateLocation');
	showConstituenciesMap(districtValue, type, 'districtView');
	$(".modal-dialog").addClass("modal-xl");
}
function showVideoComments(channelName, title, date) {
	var value = "";
	if (channelName != null && channelName != '' && channelName != undefined &&
		title != null && title != '' && title != undefined) {
		$.ajax({
			type: "POST",
			url: 'getVideoComments',
			data: {
				'channelName': channelName,
				'title': title,
				'date': date,
			},
			traditional: true,
			cache: false,
			success: function(response) {

				var modalObj = {
					title: labelObject["Comments"] != null ? labelObject["Comments"] : "Comments",
					body: response,
				};
				var buttonArray = [
					{
						text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
						click: function() {
						},
						isCloseButton: true
					}
				];
				modalObj['buttons'] = buttonArray;
				createModal("dataDxpSplitterValue", modalObj);
				if (response != null && response != '' && response != undefined) {
					$(".modal-dialog").addClass("modal-xl");
				} else {
					$(".modal-dialog").addClass("modal-xs");
				}
			}
		});
	}
}
function showTwitterSentimentComments(tweetId, userName, fromDate, toDate, sentimentType) {
	showLoader();
	if (tweetId != null && tweetId != '' && tweetId != undefined) {
		$.ajax({
			type: "POST",
			url: 'getTwitterSentimentComments',
			data: {
				'tweetId': tweetId,
				'candidate': userName,
				'fromDate': fromDate,
				'toDate': toDate,
				'sentimentType': sentimentType,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				stopLoader();
				var imageSrc = "";
				var sentimentTpeLu = sentimentType.toLowerCase();
				if (sentimentTpeLu != null && sentimentTpeLu != '' && sentimentTpeLu != undefined && sentimentTpeLu == 'positive') {
					imageSrc = "<img id='imagePos' src='images/positiveThumb.png' width='18px'>";
				} else if (sentimentTpeLu != null && sentimentTpeLu != '' && sentimentTpeLu != undefined && sentimentTpeLu == 'negative') {
					imageSrc = "<img id='imageNeg' src='images/negativeThumb.png' width='18px'>";
				} else if (sentimentTpeLu != null && sentimentTpeLu != '' && sentimentTpeLu != undefined && sentimentTpeLu == 'neutral') {
					imageSrc = "<img id='imageNeg' src='images/neutralThumb.png' width='18px'>";
				}
				var value = "";
				if (response != null && response != '' && response != undefined) {

					value = response;
				} else {
					value = "No data to display";
				}
				var modalObj = {
					title: labelObject["Twitter " + sentimentTpeLu + " comments"] != null ? labelObject["Twitter " + sentimentTpeLu + " comments"] : "Twitter " + sentimentTpeLu + " comments " + imageSrc + "",
					body: value,
				};
				var buttonArray = [
					{
						text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
						click: function() {
						},
						isCloseButton: true
					}
				];
				modalObj['buttons'] = buttonArray;
				createModal("dataDxpSplitterValue", modalObj);
				$(".dataDxpSplitterValue").addClass("showSentimentComments");
				if (response != null && response != '' && response != undefined) {
					$(".modal-dialog").addClass("modal-xl");
					$(".modal-header").addClass("intsenseTwitHeader");
					$(".intsenseTwitHeader").css("background-color", "#1DA1F2");
					$(".intsenseTwitHeader").css("color", "white");
				} else {
					$(".modal-dialog").addClass("modal-xs");
				}
			}
		});
	}
}
function getSurveyAnalyticchart(dashbordname) {
	$.ajax({
		url: 'getChartData',
		type: "POST",
		dataType: 'json',
		traditional: true,
		cache: false,
		async: true,
		data: {
			dashbordname: dashbordname
		},
		success: function(response) {
			stopLoader();
			if (response != null && !jQuery.isEmptyObject(response)) {
				var dataarr = response['dataarr'];
				if (dataarr != null && dataarr != '' && dataarr != undefined) {
					var count = 0;
					for (var i = 0; i < dataarr.length; i++) {
						var XAxix = dataarr[i]['xAxix'];
						var yAxix = dataarr[i]['yAxix'];
						var type = dataarr[i]['type'];
						var table = dataarr[i]['table'];
						var id = dataarr[i]['chartid'];
						var Lebel = dataarr[i]['Lebel'];
						var aggColumnName = dataarr[i]['aggColumnName'];
						var filterCondition = dataarr[i]['filterCondition'];
						var chartPropObj = dataarr[i]['chartPropObj'];
						var chartConfigObj = dataarr[i]['chartConfigObj'];
						var labelLegend = dataarr[i]['labelLegend'];
						var colorsObj = dataarr[i]['colorsObj'];
						var comboValue = dataarr[i]['comboValue'];
						if (yAxix != null && yAxix != '' && yAxix != 'undefined' && type != 'Card') {
							var chartid = id;
							var divClass = "col-md-6 col-sm-6 col-lg-3";
							$("#surveyAnalyticChartsDataId").append("<div class='" + divClass + " homeChartWrapDiv' id ='visionVisualizeChartHome" + count + "'><div id='homeChartParentDiv" + count + "' class='homeChartParentDiv'><div class='chartMain' id='" + chartid + "'></div>"
								+ "<div class='rightControls'><div class='iconDiv'><img src='images/Plus-Icon-02.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/FeedBack_Icon.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/Settings_Icon.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/Filter.svg' class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/search_blue.png'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div></div></div>"
								+ "<div class='editPopup' id='homepagechartsettingId'></div>"
								+ "<div class='chartDialogClass' id='chartDialog" + count + "' style='display: none;'></div>"
								+ "<div class='createpopupClass' id='homepagecreatepopupId" + count + "' style='display: none;'></div>"
								+ "<input type='hidden' id='" + chartid + "_filter' value=''/>"
								+ "<input type='hidden' id='" + chartid + "_options' value=''/>"
								+ "</div>");
							getVisualizeChart(chartid, type, XAxix, yAxix, table, aggColumnName, filterCondition, chartPropObj, chartConfigObj, count, labelLegend, colorsObj, comboValue);
							count++
						}

					}
				}

			}
		}, error: function(e) {
			sessionTimeout(e);
		}
	});
}
function showSortScoreCard(id, sortType, mediaType) {

	showLoader();
	if (sortType != null && sortType != '' && sortType != undefined) {
		$.ajax({
			type: "POST",
			url: 'getScoreCardSortResults',
			data: {
				'sortType': sortType,
				'mediaType': mediaType,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				stopLoader();
				if (response != null && response != undefined && response != '') {
					var responseObj = JSON.parse(response);
					$("#" + responseObj['appendedClass']).html("");
					$("#" + responseObj['appendedClass']).html(responseObj['sortResult']);
					showWithFilterMsginHeader(mediaType, "Sort " + sortType + " Order");
				}
				if (sortType != null && sortType == 'ASC' && sortType != undefined) {
					$("#sortScoreCard" + mediaType + "Asc").removeAttr("onclick");
					$("#sortScoreCard" + mediaType + "Asc").css("color", "LightGray");
					$("#sortScoreCard" + mediaType + "Asc").css("pointer-events", "none");
					showWithFilterMsginHeader(mediaType, "Sort " + sortType + " Order");
				} else if (sortType != null && sortType == 'DESC' && sortType != undefined) {
					$("#sortScoreCard" + mediaType + "Desc").removeAttr("onclick");
					$("#sortScoreCard" + mediaType + "Desc").css("color", "LightGray");
					$("#sortScoreCard" + mediaType + "Desc").css("pointer-events", "none");
					showWithFilterMsginHeader(mediaType, "Sort " + sortType + " Order");
				} else if (sortType != null && sortType == 'RSORT' && sortType != undefined) {
					$("#sortScoreCard" + mediaType + "Rsort").removeAttr("onclick");
					$("#appendTypeToCard" + mediaType + "").hide();
					//                    showWithFilterMsginHeader(mediaType, "Sort " + sortType + " Order").hide();
					$("#sortScoreCard" + mediaType + "Rsort").css("color", "LightGray");
					$("#sortScoreCard" + mediaType + "Rsort").css("pointer-events", "none");

				}

			}
		});
	}
}
function getSurveyDetails() {

	$.ajax({
		type: "post",
		traditional: true,
		url: 'getSurveyAnalyticsChartsLayout',
		cache: false,
		data: {
			dataObj: "value"
		},
		success: function(response) {
			stopLoader();
			if (response != null && response != '' && response != undefined) {
				var result = response;
				$("#pageBodyContent").remove();
				$("#pageBody").append('<div class="page-body-content" id="pageBodyContent"><div id ="surveyAnalysisPageBody" class="surveyAnalysispagebody"></div></div>');
				$("#surveyAnalysisPageBody").append(result);
				getSurveyAnalyticchart("Mobile Survey");
			}
		},
		error: function(e) {
			console.log(e);
			sessionTimeout(e);
			stopLoader();
		}
	});
}
function getSurveyAnalyticchart(dashbordname) {
	$.ajax({
		url: 'getChartData',
		type: "POST",
		dataType: 'json',
		traditional: true,
		cache: false,
		async: true,
		data: {
			dashbordname: dashbordname
		},
		success: function(response) {
			stopLoader();
			if (response != null && !jQuery.isEmptyObject(response)) {
				var dataarr = response['dataarr'];
				if (dataarr != null && dataarr != '' && dataarr != undefined) {
					var count = 0;
					$("#surveyAnalyticChartsDataId").empty();
					for (var i = 0; i < dataarr.length; i++) {
						var XAxix = dataarr[i]['xAxix'];
						var yAxix = dataarr[i]['yAxix'];
						var type = dataarr[i]['type'];
						var table = dataarr[i]['table'];
						var id = dataarr[i]['chartid'];
						var Lebel = dataarr[i]['Lebel'];
						var aggColumnName = dataarr[i]['aggColumnName'];
						var filterCondition = dataarr[i]['filterCondition'];
						var chartPropObj = dataarr[i]['chartPropObj'];
						var chartConfigObj = dataarr[i]['chartConfigObj'];
						var labelLegend = dataarr[i]['labelLegend'];
						var colorsObj = dataarr[i]['colorsObj'];
						var comboValue = dataarr[i]['comboValue'];
						if (yAxix != null && yAxix != '' && yAxix != 'undefined' && type != 'Card') {
							var chartid = id;
							var divClass = "col-md-6 col-sm-6 col-lg-3";
							$("#surveyAnalyticChartsDataId").append("<div class='" + divClass + " homeChartWrapDiv' id ='visionVisualizeChartHome" + count + "'><div id='homeChartParentDiv" + count + "' class='homeChartParentDiv'><div class='chartMain' id='" + chartid + "'></div>"
								+ "<div class='rightControls'><div class='iconDiv'><img src='images/Plus-Icon-02.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/FeedBack_Icon.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/Settings_Icon.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/Filter.svg' class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/search_blue.png'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div></div></div>"
								+ "<div class='editPopup' id='homepagechartsettingId'></div>"
								+ "<div class='chartDialogClass' id='chartDialog" + count + "' style='display: none;'></div>"
								+ "<div class='createpopupClass' id='homepagecreatepopupId" + count + "' style='display: none;'></div>"
								+ "<input type='hidden' id='" + chartid + "_filter' value=''/>"
								+ "<input type='hidden' id='" + chartid + "_options' value=''/>"
								+ "</div>");
							getVisualizeChart(chartid, type, XAxix, yAxix, table, aggColumnName, filterCondition, chartPropObj, chartConfigObj, count, labelLegend, colorsObj, comboValue);
							count++
						}

					}
				}

			}
		}, error: function(e) {
			sessionTimeout(e);
		}
	});
}

function getSurveyAnalyticChangeQuestionData() {
	var sureveyFilterArr = [];
	var assembly = $("#surveyAnalyticChartQuestionACId").val();
	var social_category = $("#surveyAnalyticChartQuestionSOCIAL_CATEGORYId").val();
	var pc2019 = $("#surveyAnalyticChartQuestionPARTY_LOKSABHA_ELECTIONId").val();
	var popularScheme = $("#surveyAnalyticChartQuestionPOPULAR_SCHEMEId").val();
	var caste = $("#surveyAnalyticChartQuestionCASTEId").val();
	var education = $("#surveyAnalyticChartQuestionEDUCATIONId").val();
	var district = $("#surveyAnalyticChartQuestionDISTRICTId").val();
	var area = $("#surveyAnalyticChartQuestionAREAId").val();
	var religion = $("#surveyAnalyticChartQuestionRELIGIONId").val();
	var ac2023 = $("#surveyAnalyticChartQuestionPARTY_UPCOMING_ASSEMBLY_ELECTIId").val();
	var gender = $("#surveyAnalyticChartQuestionGENDERId").val();
	var occuapation = $("#surveyAnalyticChartQuestionOCCUPATIONId").val();
	var age = $("#surveyAnalyticChartQuestionAGEId").val();
	var ac2018 = $("#surveyAnalyticChartQuestionPARTY_LAST_ASSEMBLY_ELECTIONId").val();
	if (assembly != null && assembly != '' && assembly != undefined && assembly != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'AC';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = assembly;
		sureveyFilterArr.push(filterObj);
	}
	if (social_category != null && social_category != '' && social_category != undefined && social_category != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'SOCIAL_CATEGORY';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = social_category;
		sureveyFilterArr.push(filterObj);
	}
	if (pc2019 != null && pc2019 != '' && pc2019 != undefined && pc2019 != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'PARTY_LOKSABHA_ELECTION';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = pc2019;
		sureveyFilterArr.push(filterObj);
	}
	if (popularScheme != null && popularScheme != '' && popularScheme != undefined && popularScheme != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'POPULAR_SCHEME';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = popularScheme;
		sureveyFilterArr.push(filterObj);
	}
	if (caste != null && caste != '' && caste != undefined && caste != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'CASTE';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = caste;
		sureveyFilterArr.push(filterObj);
	}
	if (education != null && education != '' && education != undefined && education != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'EDUCATION';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = education;
		sureveyFilterArr.push(filterObj);
	}
	if (district != null && district != '' && district != undefined && district != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'DISTRICT';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = district;
		sureveyFilterArr.push(filterObj);
	}
	if (area != null && area != '' && area != undefined && area != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'AREA';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = area;
		sureveyFilterArr.push(filterObj);
	}
	if (religion != null && religion != '' && religion != undefined && religion != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'RELIGION';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = religion;
		sureveyFilterArr.push(filterObj);
	}
	if (ac2023 != null && ac2023 != '' && ac2023 != undefined && ac2023 != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'PARTY_UPCOMING_ASSEMBLY_ELECTI';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = ac2023;
		sureveyFilterArr.push(filterObj);
	}
	if (gender != null && gender != '' && gender != undefined && gender != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'GENDER';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = gender;
		sureveyFilterArr.push(filterObj);
	}
	if (occuapation != null && occuapation != '' && occuapation != undefined && occuapation != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'OCCUPATION';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = occuapation;
		sureveyFilterArr.push(filterObj);
	}
	if (age != null && age != '' && age != undefined && age != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'AGE';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = age;
		sureveyFilterArr.push(filterObj);
	}
	if (ac2018 != null && ac2018 != '' && ac2018 != undefined && ac2018 != 'select') {
		var filterObj = {};
		filterObj['colName'] = 'PARTY_LAST_ASSEMBLY_ELECTION';
		filterObj['operator'] = 'EQUALS';
		filterObj['values'] = ac2018;
		sureveyFilterArr.push(filterObj);
	}

	if (sureveyFilterArr != null && !jQuery.isEmptyObject(sureveyFilterArr)) {
		sureveyFilterArr = JSON.stringify(sureveyFilterArr);
	}

	$.ajax({
		url: 'getSurveyHomeCharts',
		type: "POST",
		dataType: 'json',
		traditional: true,
		cache: false,
		async: true,
		data: {
			dashBoardName: "Mobile Survey",
			sureveyFilterArr: sureveyFilterArr
		},
		success: function(response) {
			stopLoader();
			if (response != null && !jQuery.isEmptyObject(response)) {
				var dataarr = response['dataarr'];
				if (dataarr != null && dataarr != '' && dataarr != undefined) {
					$("#surveyAnalyticChartsDataId").empty();
					var count = 0;
					for (var i = 0; i < dataarr.length; i++) {
						var XAxix = dataarr[i]['xAxix'];
						var yAxix = dataarr[i]['yAxix'];
						var type = dataarr[i]['type'];
						var table = dataarr[i]['table'];
						var id = dataarr[i]['chartid'];
						var Lebel = dataarr[i]['Lebel'];
						var aggColumnName = dataarr[i]['aggColumnName'];
						var filterCondition = dataarr[i]['filterCondition'];
						var chartPropObj = dataarr[i]['chartPropObj'];
						var chartConfigObj = dataarr[i]['chartConfigObj'];
						var labelLegend = dataarr[i]['labelLegend'];
						var colorsObj = dataarr[i]['colorsObj'];
						var comboValue = dataarr[i]['comboValue'];
						var sureveyFilterCond = dataarr[i]['sureveyFilterArr'];
						//                        var parentDiv = $('#' + id).parent();
						//                        var parentId = parentDiv[0]['id'];
						//                        var count;
						//                        if (parentId != null && parentId != '' && parentId != undefined) {
						//                            count = parentId.replace("homeChartParentDiv", "");
						//                        }
						var chartOptionsObj = $("#" + id + "_options").val();
						if (chartOptionsObj != null && chartOptionsObj != '' && chartOptionsObj != undefined) {
							chartPropObj = chartOptionsObj;
						}
						var chartFilter = $("#" + id + "_filter").val();
						if (sureveyFilterCond != null && sureveyFilterCond != '' && sureveyFilterCond != undefined) {
							sureveyFilterCond = JSON.parse(sureveyFilterCond);
							if (filterCondition != null && filterCondition != '' && filterCondition != undefined) {
								filterCondition = JSON.parse(filterCondition);
								if (filterCondition != null && !jQuery.isEmptyObject(filterCondition)) {
									for (var key in filterCondition) {
										var paramObj = filterCondition[key];
										sureveyFilterCond.push(paramObj);
									}
								}
							}
							if (chartFilter != null && chartFilter != '' && chartFilter != undefined) {
								chartFilter = JSON.parse(chartFilter);
								if (chartFilter != null && !jQuery.isEmptyObject(chartFilter)) {
									for (var key in chartFilter) {
										var paramObj = chartFilter[key];
										sureveyFilterCond.push(paramObj);
									}
								}
							}
						} else {
							sureveyFilterCond = [];
							if (filterCondition != null && filterCondition != '' && filterCondition != undefined) {
								filterCondition = JSON.parse(filterCondition);
								if (filterCondition != null && !jQuery.isEmptyObject(filterCondition)) {
									for (var key in filterCondition) {
										var paramObj = filterCondition[key];
										sureveyFilterCond.push(paramObj);
									}
								}
							}
							if (chartFilter != null && chartFilter != '' && chartFilter != undefined) {
								chartFilter = JSON.parse(chartFilter);
								if (chartFilter != null && !jQuery.isEmptyObject(chartFilter)) {
									for (var key in chartFilter) {
										var paramObj = chartFilter[key];
										sureveyFilterCond.push(paramObj);
									}
								}
							}
						}
						if (sureveyFilterCond != null && !jQuery.isEmptyObject(sureveyFilterCond)) {
							sureveyFilterCond = JSON.stringify(sureveyFilterCond);
						}
						if (yAxix != null && yAxix != '' && yAxix != 'undefined' && type != 'Card') {
							var chartid = id;
							var divClass = "col-md-6 col-sm-6 col-lg-3";
							$("#surveyAnalyticChartsDataId").append("<div class='" + divClass + " homeChartWrapDiv' id ='visionVisualizeChartHome" + count + "'><div id='homeChartParentDiv" + count + "' class='homeChartParentDiv'><div class='chartMain' id='" + chartid + "'></div>"
								+ "<div class='rightControls'><div class='iconDiv'><img src='images/Plus-Icon-02.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/FeedBack_Icon.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/Settings_Icon.svg'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/Filter.svg' class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div>"
								+ "<div class='iconDiv'><img src='images/search_blue.png'  class='visionVisualizeHorizontalDotsClass visionVisualChartBoxSelected'></div></div></div>"
								+ "<div class='editPopup' id='homepagechartsettingId'></div>"
								+ "<div class='chartDialogClass' id='chartDialog" + count + "' style='display: none;'></div>"
								+ "<div class='createpopupClass' id='homepagecreatepopupId" + count + "' style='display: none;'></div>"
								+ "<input type='hidden' id='" + chartid + "_filter' value=''/>"
								+ "<input type='hidden' id='" + chartid + "_options' value=''/>"
								+ "</div>");
							getVisualizeChart(chartid, type, XAxix, yAxix, table, aggColumnName, sureveyFilterCond, chartPropObj, chartConfigObj, count, labelLegend, colorsObj, comboValue);
							count++;
						}

					}
				}

			}
		}, error: function(e) {
			sessionTimeout(e);
		}
	});
}
function showMoreOptionData(currentIcon, id, optionType, flag) {
	showWithFilterMsginHeader(flag, "Show Full Screen");
	var homepageCurrentCardId = $(currentIcon).closest("div.trendsCols").attr('id');
	if (optionType != null && optionType != '' && optionType != 'undefined' && optionType == 'EX') {
		var homepageTrendsCards = $('#rowAllShowCard').children();
		$.each(homepageTrendsCards, function(index, element) {
			var currentLoopElementId = $(this).attr('id')
			$(this).toggle();
			if (homepageCurrentCardId === currentLoopElementId) {
				$(this).show();
				$(this).toggleClass('ic-maximize');
			}
		});
	}
}
function showMoreOptionChartData(event, id, flagType, mediaType) {
	showWithFilterMsginHeader(mediaType, "Line Chart");
	if (flagType != null && flagType != '' && flagType != 'undefined' && flagType == 'CH') {
		$.ajax({
			url: 'getScoreCardsOptionData',
			type: "POST",
			traditional: true,
			cache: false,
			async: true,
			data: {
				flagType: flagType,
				mediaType: mediaType,
			},
			success: function(response) {
				var chartData = {};
				var chartDataArr = [];
				if (response != null && response != '' && response != undefined) {
					var respObj = JSON.parse(response);
					chartData['x'] = respObj['xAxis'];
					chartData['y'] = respObj['yAxis'];
					chartData['type'] = 'lines';
					var markerObj = {};
					//                    markerObj['color'] = colorArr;
					chartData['marker'] = markerObj;
					chartDataArr.push(chartData);
				}
				var data = chartDataArr;
				var layout = {
					height: 440,
					width: 1050,
					margin: {
						l: 50,
						b: 100,
						t: 50,
					},
				};
				var districtBox = $("#districtSearchListBox").val();
				var constituencyBox = $("#constituencySearchListBox").val();
				var candidateBox = $("#candidateSearchListBox").val();
				var partyBox = $("#partySearchListBox").val();
				var modalObj = {
					title: labelObject["Candidate with count"] != null ? labelObject["Candidate with count"] : "Candidate with count",
					body: "<div id='lineChartWithOptionsId'><div id='showChartOptionsData'></div></div>",
				};
				var buttonArray = [
					{
						text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
						click: function() {
						},
						isCloseButton: true
					}
				];
				modalObj['buttons'] = buttonArray;
				createModal("dataDxpSplitterValue", modalObj);
				$(".modal-dialog").addClass("modal-xl");
				$(".dataDxpSplitterValue").addClass("lineChartOptionsData");
				Plotly.newPlot("showChartOptionsData", data, layout);
				$("#listofGroupFiltersId" + mediaType).hide();
			}
		});
	}
}
function playAudioClipEmoji(url) {
	var iframe = "<audio id ='playAudioClipEmojiStop' controls src='" + url + "' type='audio/mp3'></audio>";
	var modalObj = {
		title: labelObject["Audio"] != null ? labelObject["Audio"] : "Audio",
		body: iframe,
	};
	var buttonArray = [
		{
			text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
			click: function() {
				$("#playAudioClipEmojiStop").remove();
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".modal-dialog").addClass("modal-xs");
}


function getRendererProfile(state, year, acpc, filterColumn, filterValue) {

	var partiesObj = [];
	const TRS = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "pink",
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	const INC = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "skyblue",
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	const AIMIM = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "#90EE90",
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	const TDP = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "#FAF884",
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	const AIFB = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "#FF7276",
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	const BJP = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "#FFD580",
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	const IND = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "white",
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	const other = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: '#' + Math.floor(Math.random() * 19777215).toString(16),
		style: "solid",
		outline: {
			width: 0.2,
			//            color: [255, 255, 255, 0.5]
			color: [0, 0, 0, 0.5]
		}
	};
	var uniqueValueInfos = [];
	var uniqueValObj = {};
	// uniqueValObj['value'] = "BJP";
	// uniqueValObj['value'] = "TDP";
	// uniqueValObj['value'] = "TRS";
	uniqueValObj['value'] = "AIMIM";
	// uniqueValObj['value'] = "IND";
	// uniqueValObj['symbol'] = BJP;
	// uniqueValObj['symbol'] = TDP;
	// uniqueValObj['symbol'] = TRS;
	uniqueValObj['symbol'] = AIMIM;
	// uniqueValObj['symbol'] = IND;
	uniqueValueInfos.push(uniqueValObj);
	const renderer = {
		type: "unique-value",
		field: "party",
		legendOptions: {
			title: "Parties"
		},
		defaultSymbol: {
			type: "simple-fill", // autocasts as new SimpleFillSymbol()
			color: "white",
			style: "backward-diagonal",
			outline: {
				width: 0.5,
				color: [50, 50, 50, 0.6]
			}
		},
		defaultLabel: "no data",
		uniqueValueInfos: uniqueValueInfos
	};
	return renderer;
}
function showEachConstituencyMap(constituencyName, type, appendDiv) {
	var constLat = "";
	var constLon = "";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'address': constituencyName }, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			constLat = results['0']['geometry']['viewport']['Bb']['lo'];
			constLon = results['0']['geometry']['viewport']['Va']['lo'];
			require([
				"esri/WebMap",
				"esri/Map",
				"esri/layers/GeoJSONLayer",
				"esri/views/MapView",
				"esri/widgets/Legend",
				"esri/PopupTemplate",
				"esri/widgets/Editor"
			], (
				WebMap,
				Map,
				GeoJSONLayer,
				MapView,
				Legend,
				PopupTemplate,
				Editor
			) => {
				var query = "SELECT FILE_CONTENT FROM IS_GEOJSON_FILES WHERE STATE='TELANGANA' AND FIELD_NAME='ASSEMBLY_CONSTITUENCIES' AND YEAR='2018'";
				const url = "getGeoJsonFiles?query=" + query;
				//        const renderer = getRendererProfile("TELANGANA", "2018", "AC");
				const renderer = {
					type: "simple",
					field: "ac_name",
					symbol: {
						type: "simple-fill", // autocasts as new SimpleFillSymbol()
						color: '#' + Math.floor(Math.random() * 19777215).toString(16),
						style: "solid",
						outline: {
							width: 0.2,
							//            color: [255, 255, 255, 0.5]
							color: [0, 0, 0, 0.5]
						}
					}
				};
				const geojsonLayer = new GeoJSONLayer({
					url: url,
					renderer: renderer,
					opacity: 0.8,
					title: "Constituencies"
				});
				const map = new Map({
					basemap: "gray-vector",
					layers: [geojsonLayer]
				});
				const view = new MapView({
					container: appendDiv,
					center: [constLon, constLat],
					zoom: 8.5,
					map: map
				});
				view.popup.watch("selectedFeature", (graphic) => {
					if (graphic) {
					}
				});
				view.on("click", function(event) {
					console.log(" const clickkkkk");
				});
				const template = new PopupTemplate({
					outFields: ["*"],
					title: "Constituency: {ac_name}",
					content: []
				});
				geojsonLayer.popupTemplate = template;
				var constituency = constituencyName.charAt(0).toUpperCase() + constituencyName.slice(1).toLowerCase();
				const labelClass = {
					// autocasts as new LabelClass()
					symbol: {
						type: "text", // autocasts as new TextSymbol()
						color: "black",
						font: {
							family: "segeo-ui,-apple-system,Roboto,Helvetica Neue,sans-serif",
							size: 8,
						}
					},
					labelPlacement: "above-center",
					labelExpressionInfo: {
						expression: "$feature.ac_name",
					}
				};
				geojsonLayer.labelingInfo = [labelClass];
				if (constituency != null) {
					geojsonLayer.definitionExpression = "ac_name = '" + constituency + "'";
				}
			});
		}
	});
}
function showYouTubeSentimentComments(tableName, userName, fromDate, toDate, sentimentType) {
	showLoader();
	if (userName != null && userName != '') {
		$.ajax({
			type: "POST",
			url: 'getYouTubeSentimentComments',
			data: {
				'fromDate': fromDate,
				'toDate': toDate,
				'tableName': tableName,
				'userName': userName,
				'sentimentType': sentimentType
			},
			traditional: true,
			cache: false,
			success: function(response) {
				stopLoader();
				var value = "";
				if (response != null && response != '' && response != undefined) {
					value = response;
				} else {
					value = "No data to dispaly."
				}
				sentimentType = sentimentType.toLowerCase();
				sentimentType = sentimentType[0].toUpperCase() + sentimentType.slice(1);
				var modalObj = {
					title: 'YouTube ' + sentimentType + ' Comments',
					body: value,
				};
				var buttonArray = [
					{
						text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
						click: function() {
						},
						isCloseButton: true
					}
				];
				modalObj['buttons'] = buttonArray;
				createModal("dataDxpSplitterValue", modalObj);
				$(".dataDxpSplitterValue").addClass("showSentimentComments");
				if (response != null && response != '' && response != undefined) {
					$(".modal-dialog").addClass("modal-xl");
					$(".modal-header").addClass("intsenseYouTubeHeader");
					$(".intsenseYouTubeHeader").css("background-color", "red");
					$(".intsenseYouTubeHeader").css("color", "white");
				} else {
					$(".modal-dialog").removClass("modal-xl");
					$(".modal-dialog").addClass("modal-xs");
				}
			}
		});
	}
}
function getSelectDate(userName, table, mediaFlag) {
	var value = $("#selectWeekDate" + mediaFlag + "").val();
	if (value != null && value != '') {
		showLoader();
		$.ajax({
			type: "POST",
			url: 'getSelectDateList',
			data: {
				'userName': userName,
				'table': table,
				'value': value,
				'mediaFlag': mediaFlag

			},
			traditional: true,
			cache: false,
			success: function(response) {
				stopLoader();
				if (value != null && value != '') {
					$("#selectAddCountValue" + mediaFlag + "").html(response);
				}
			}
		});
	}
}
function showDayWiseChart(userName, fromDate, toDate) {
	$.ajax({
		type: "POST",
		url: 'showSevenDaysChart',
		data: {
			'userName': userName,
			'fromDate': fromDate,
			'toDate': toDate,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			var chartData = JSON.parse(response);
			stopLoader();
			var modalObj = {
				title: labelObject["Followers Chart"] != null ? labelObject["Followers Chart"] : "Followers Chart",
				body: "<div id='showDaywiseLineChart'></div>",
			};
			var buttonArray = [
				{
					text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
					click: function() {
						$("#playAudioClipEmojiStop").remove();
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass("modal-xl");
			getLineChartData(chartData, "showDaywiseLineChart", "");
		}
	});
}
function getLineChartData(chartData, chartId, typeFlag) {
	var chartDataArr = [];
	if (chartData != null && !jQuery.isEmptyObject(chartData)) {
		chartData['type'] = 'lines';
		var colorArr = ['#00c60b', '#fc0203', '#f99800'];
		var markerObj = {};
		markerObj['color'] = colorArr;
		chartData['marker'] = markerObj;
		chartDataArr.push(chartData);
	}
	var data = chartDataArr;
	var layout = {
		height: 500,
		width: 950,
		margin: {
			l: 60,
			b: 90,
			t: 40,
			r: 50,
		},
		modebar: {
			//            orientation: 'v',
			color: '#0b4a99',
			activecolor: '#9ED3CD'
		},
	};
	Plotly.newPlot(chartId, data, layout);
}
function allCardrefreshOnLoad(event) {
	var id = event['path']['1'].id;
	var flag = '';
	var count = '';
	if (id === 'SocialMediaCardT') {
		flag = 'T';
		count = counT + 5;
		counT = count;
	} else if (id === 'SocialMediaCardY') {
		flag = 'Y';
		count = counY + 5;
		counY = count;
	} else if (id === 'SocialMediaCardNP') {
		flag = 'NP';
		count = counNP + 5;
		counNP = count;
	} else if (id === 'SocialMediaCardNC') {
		flag = 'NC';
		count = counNC + 5;
		counNC = count;
	} else if (id === 'SocialMediaCardLU') {
		flag = 'LU';
		count = counLU + 5;
		counLU = count;
	}
	if (flag != null && flag != '') {
		showLoader();
		$.ajax({
			type: "POST",
			url: 'getScrollOnLoad',
			data: {
				'flag': flag,
				'count': count,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				stopLoader();
				if (response != null && response != '') {
					$("#" + id + "GroupFilter").html(response);
				}
			}
		});
	}
}
function showScoreCardBasedChart(mediaFlag, mediaName) {
	showLoader();
	if (mediaFlag == null || mediaFlag == '' || mediaFlag == undefined
		|| mediaName == null || mediaName == '' || mediaName == undefined) {
		mediaFlag = $("#mediaFlag").val();
		mediaName = $("#mediaName").val();
	}
	var PartyData = $("#partySearchListBox").val();
	var candidateData = $("#candidateSearchListBox").val();
	//    var constData = $("#constituencySearchListBox").val();
	//    var districtData = $("#districtSearchListBox").val();
	$.ajax({
		type: "post",
		traditional: true,
		dataType: 'json',
		url: 'showScoreCardBasedChart',
		cache: false,
		data: {
			mediaFlag: mediaFlag,
			mediaName: mediaName,
			PartyData: PartyData,
			candidateData: candidateData,
			treeFlag: "Y",
			//            districtData:districtData, 
		},
		success: function(response) {
			stopLoader();
			var values = response['values'];
			var labels = response['labels'];
			var chartDiv = response['chartDiv'];
			var chartTreeObj = response['chartTreeObj'];
			var MainTreeObj = response['MainTreeObj'];
			treeMapObj = chartTreeObj;
			if (chartDiv == null || chartDiv == '' || chartDiv == undefined) {
				chartDiv = "No Data to Disaplay the Charts."
			}
			var modalObj = {
				title: labelObject["" + mediaName + " Analysis"] != null ? labelObject["" + mediaName + " Analysis"] : "" + mediaName + " Analysis",
				body: chartDiv,
			};
			var buttonArray = [
				{
					text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
					click: function() {
						$("#chartType").val('');
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			$("#chartType").val('');
			createModal("dataDxpSplitterValue", modalObj);
			if (chartDiv == null || chartDiv == '' || chartDiv == undefined) {
				$(".modal-dialog").addClass("modal-xs");
			} else {
				$(".modal-dialog").addClass("modal-xl");
			}

			$("#dataDxpSplitterValue").addClass("dataDxpSplitterValueScoreCard");
			showTreeMapChart('treemap', MainTreeObj, "showScoreCardsDataWithChart");
			//            $("#chartType").val('treemap');
			//            getBarChart(values, labels, "showScoreCardsDataWithChart", mediaName);
			$("#partyListData").jqxDropDownList({
				theme: 'energyblue',
				filterable: true,
				checkboxes: true,
				filterPlaceHolder: 'startswith',
				placeHolder: 'Select Party',
			});
			$("#candidatesListData").jqxDropDownList({
				theme: 'energyblue',
				filterable: true,
				checkboxes: true,
				filterPlaceHolder: 'startswith',
				placeHolder: 'Select Candidate',
			});
			$("#partyListData").jqxDropDownList('uncheckAll');
			$("#candidatesListData").jqxDropDownList('uncheckAll');
			$("#partyListData").on('checkChange', function(event) {
				var selectedData = $("#partyListData").jqxDropDownList('val');
				var candData = $("#candidatesListData").jqxDropDownList('val');
				var mediaFlag = $("#mediaFlag").val();
				var mediaName = $("#mediaName").val();
				if (selectedData != null && selectedData != undefined && selectedData != '') {
					showMediaValueBasedResults(mediaName, mediaFlag, selectedData, candData, 'P');
				}
			});
			$("#candidatesListData").on('checkChange', function(event) {
				var selectedData = $("#partyListData").jqxDropDownList('val');
				var candData = $("#candidatesListData").jqxDropDownList('val');
				var mediaFlag = $("#mediaFlag").val();
				var mediaName = $("#mediaName").val();
				if (candData != null && candData != undefined && candData != '') {
					showMediaValueBasedResults(mediaName, mediaFlag, selectedData, candData, 'C');
				}
			});
			var start = moment().subtract(29, 'days');
			var end = moment();
			$('#reportrange').daterangepicker({
				startDate: start,
				endDate: end
			}, dateRangePicker);
			dateRangePicker(start, end);
		}

	});
}
function getBarChart(values, labels, chartId, mediaName, type) {
	var data = [{
		y: values,
		x: labels,
		type: 'bar',
		textinfo: "percent",
		marker: {
			color: generateRandomColourArray(labels)
		}
	}];
	var layout = {
		height: 500,
		width: 1100,
		title: "" + mediaName + " Data",
	};
	Plotly.newPlot(chartId, data, layout)
}
function showMediaValueBasedResults(mediaName, mediaFlag, partyValue, candValue, selectionType) {
	showLoader();
	$("#showScoreCardsDataWithChart").val("");
	$("#candidatesListListDataClass").val("");
	var chartType = $("#chartType").val();
	if (chartType == '') {
		chartType = "treemap";
	}
	$.ajax({
		type: "post",
		traditional: true,
		dataType: 'json',
		url: 'showScoreCardBasedChart',
		cache: false,
		data: {
			mediaFlag: mediaFlag,
			mediaName: mediaName,
			partyValue: partyValue,
			candValue: candValue,
			selectionType: selectionType,
			chartType: chartType,
		},
		success: function(response) {
			if (response != null && response != '' && response != undefined) {
				stopLoader();
				var dataObj = {};
				var values = response['values'];
				var labels = response['labels'];
				var chartTypes = response['chartTypes'];
				var candidateData = response['Data'];
				var mainTreemapObj = response['MainTreeObj'];
				dataObj['y'] = values;
				dataObj['x'] = labels;
				$("#candidatesListListDataClass").html(candidateData);
				$("#candidatesListData").jqxDropDownList({
					theme: 'energyblue',
					filterable: true,
					checkboxes: true,
					filterPlaceHolder: 'startswith',
					placeHolder: 'Select Candidate',
				});
				if (chartType == "treemap") {
					showTreeMapChart('treemap', mainTreemapObj, "showScoreCardsDataWithChart");
				} else {
					getLineChartData(dataObj, "showScoreCardsDataWithChart", mediaName);
				}
				$("#candidatesListData").jqxDropDownList('uncheckAll');
				$("#candidatesListData").on('checkChange', function(event) {
					var selectedData = $("#partyListData").jqxDropDownList('val');
					var candData = $("#candidatesListData").jqxDropDownList('val');
					var mediaFlag = $("#mediaFlag").val();
					var mediaName = $("#mediaName").val();
					if (candData != null && candData != undefined && candData != '' && candData == 'Select All') {
						$("#candidatesListData").jqxDropDownList('checkAll');
						candData = $("#candidatesListData").jqxDropDownList('val');
					} else {

					}
					if (candData != null && candData != undefined && candData != '') {
						showMediaPartyValueBasedResults(mediaName, mediaFlag, selectedData, candData, 'C');
					}
				});
			}
		}
	});
	stopLoader();
}
function showMediaPartyValueBasedResults(mediaName, mediaFlag, partyValue, candValue, selectionType) {
	showLoader();
	$("#showScoreCardsDataWithChart").val("");
	$("#candidatesListListDataClass").val("");
	var chartType = $("#chartType").val();
	if (chartType == '') {
		chartType = "treemap";
	}
	$.ajax({
		type: "post",
		traditional: true,
		dataType: 'json',
		url: 'showScoreCardBasedChart',
		cache: false,
		data: {
			mediaFlag: mediaFlag,
			mediaName: mediaName,
			partyValue: partyValue,
			candValue: candValue,
			selectionType: selectionType,
			chartType: chartType,
		},
		success: function(response) {
			if (response != null && response != '' && response != undefined) {
				stopLoader();
				var dataObj = {};
				var values = response['values'];
				var labels = response['labels'];
				var mainTreemapObj = response['MainTreeObj'];
				dataObj['y'] = values;
				dataObj['x'] = labels;
				if (chartType == "treemap") {
					showTreeMapChart('treemap', mainTreemapObj, "showScoreCardsDataWithChart");
				} else {
					getLineChartData(dataObj, "showScoreCardsDataWithChart", mediaName);
				}

			}
		}
	});
}

function showScoreCardChartDateFilterResults(mediaName, mediaFlag, start, end) {
	showLoader();
	$("#showScoreCardsDataWithChart").val("");
	$("#candidatesListListDataClass").val("");
	var partyValue = $("#partyListData").jqxDropDownList('val');
	var candValue = $("#candidatesListData").jqxDropDownList('val');
	var fromDate = start.toISOString().split('T')[0].split('-');
	var toDate = end.toISOString().split('T')[0].split('-');
	fromDate = `${fromDate[0]}-${fromDate[1]}-${fromDate[2]};`
	toDate = `${toDate[0]}-${toDate[1]}-${toDate[2]};`
	var chartType = $("#chartType").val();
	if (chartType == '') {
		chartType = "treemap";
	}
	$.ajax({
		type: "post",
		traditional: true,
		dataType: 'json',
		url: 'showScoreCardBasedChart',
		cache: false,
		data: {
			mediaFlag: mediaFlag,
			mediaName: mediaName,
			partyValue: partyValue,
			candValue: candValue,
			selectionType: '',
			fromDate: fromDate,
			toDate: toDate,
			'chartType': chartType
		},
		success: function(response) {
			if (response != null && response != '' && response != undefined) {
				stopLoader();
				var dataObj = {};
				var values = response['values'];
				var labels = response['labels'];
				var mainTreemapObj = response['MainTreeObj'];
				dataObj[0] = values;
				dataObj['x'] = labels;
				var treeObj = response['chartTreeObj'];
				//                var chartType = $("#chartType").val();
				if (chartType == null && chartType == '' && chartType == undefined) {
					getLineChartData(dataObj, "showScoreCardsDataWithChart", mediaName);
				} else if (chartType == "treemap") {
					showTreeMapChart('treemap', mainTreemapObj, "showScoreCardsDataWithChart");
				} else if (chartType != '') {
					showCustomizedChart(chartType, "showScoreCardsDataWithChart", dataObj, treeObj)
				}
			}
		}
	});
}
function getSurveyDetails() {
	var id = "intellisenseHomeSelectBox";
	$("#intellisenseHomeSelectBox").val("CHARTS");
	getHomePageSelectBoxResults(id, 'CHARTS');
}
function showMultipleChartImages(mediaName, mediaType) {
	var chartTypes = "<div id='charttypeId' class ='charttypeId'>"
		+ "<div id='visionVisualizeBasicTabs' class='visionVisualizeChartsTabsClass'>"
		+ "<img onclick=\"showCustomizedChart('pie','showScoreCardsDataWithChart')\" src='images/Pie.svg' class='visualDarkMode' title='Pie chart'>"
		+ "<img onclick=\"showCustomizedChart('bar','showScoreCardsDataWithChart')\" src='images/Bar.svg' class='visualDarkMode' title='Bar chart'>"
		+ "<img onclick=\"showCustomizedChart('donut','showScoreCardsDataWithChart')\"  src='images/Donut.svg' class='visualDarkMode' title='Donut chart'>"
		+ "<img onclick=\"showCustomizedChart('column','showScoreCardsDataWithChart')\"  src='images/Column.svg' class='visualDarkMode' title='Column chart'>"
		+ "<img onclick=\"showCustomizedChart('lines','showScoreCardsDataWithChart')\"  src='images/Line.svg' class='visualDarkMode' title='Line chart'>"
		+ "<img onclick=\"showCustomizedChart('scatter','showScoreCardsDataWithChart')\"  src='images/Scatter.svg' class='visualDarkMode' title='Scatter chart'>"
		+ "<img onclick=\"showCustomizedChart('scatterpolar','showScoreCardsDataWithChart')\"  src='images/Redar-Chart.svg' class='visualDarkMode' title='Radar chart'>"
		+ "<img onclick=\"showCustomizedChart('treemap','showScoreCardsDataWithChart')\"  src='images/Tree_Chart.svg' class='visualDarkMode' title='Tree chart'>"
		+ "<img onclick=\"showCustomizedChart('funnel','showScoreCardsDataWithChart')\"  src='images/Funnel.svg' class='visualDarkMode' title='Funnel chart'>"
		+ "</div>";
	$("#dxpColorPopOver").remove();
	$(".isMultiChartPopOverClass").html("<div id='dxpColorPopOver'></div>");
	$("#dxpColorPopOver").html(chartTypes);
	$("#dxpColorPopOver").jqxPopover({
		offset: { left: 0, top: 0 },
		position: 'right',
		width: 150,
		height: 150,
		autoClose: true,
		title: "graph Types",
		showCloseButton: true,
		selector: $("#imageMulti")
	});
	$('#dxpColorPopOver').jqxPopover({ showArrow: true, arrowOffsetValue: 10 });
	$("#dxpColorPopOver").jqxPopover('open');
}
function showCustomizedChart(chartType, chartId, chartObj, treeObj) {
	var chartData = {};
	var mainTreeObjArr = [];
	$("#chartType").val(chartType);
	$("#chartId").val("");
	var linesData = {};
	var labels = $("#chartObj").val();
	var mainTreeObj = $("#MainTreeObj").val();
	chartData = JSON.parse(labels);
	var treemapRemoveVal = $("#showScoreCardsDataWithChart .plotly").html()
	if (treemapRemoveVal == undefined) {
		$("#showScoreCardsDataWithChart div").hide();
	} else if (treemapRemoveVal == '') {
		$("#showScoreCardsDataWithChart div").hide();
		$("#showScoreCardsDataWithChart .plotly").show();
	}
	var data = [];
	var dataObj = '';
	if (treeObj == null && treeObj == undefined) {
		dataObj = treeMapObj;
	} else {
		dataObj = treeObj;
	}
	if (chartObj == null && chartObj == undefined) {
		linesData['x'] = chartData[0];
		linesData['y'] = chartData[1];
	} else {
		linesData['x'] = chartObj['x'];
		linesData['y'] = chartObj['0'];
	}
	if (chartType != null && chartType != '' && chartType != undefined && chartType == 'lines') {
		var chartDataArr = [];
		if (linesData != null && !jQuery.isEmptyObject(linesData)) {
			linesData['type'] = 'lines';
			var colorArr = ['#00c60b', '#fc0203', '#f99800'];
			var markerObj = {};
			markerObj['color'] = colorArr;
			linesData['marker'] = markerObj;
			chartDataArr.push(linesData);
		}
		var data = chartDataArr;
		var layout = {
			height: 500,
			width: 950,
			margin: {
				l: 60,
				b: 90,
				t: 40,
				r: 50,
			},
			modebar: {
				//            orientation: 'v',
				color: '#0b4a99',
				activecolor: '#9ED3CD'
			},
		};
	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'bar') {
		var data = [{
			y: linesData['x'],
			x: linesData['y'],
			orientation: 'h',
			type: chartType,
			textinfo: "percent",
			marker: {
				color: generateRandomColourArray(labels)
			}
		}];
		var layout = {
			height: 500,
			width: 1100,
			title: "Candidate Data",
		};
	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'pie') {
		var traceObj = {};
		var colorObj = {};
		var chartData = {};
		var labels = $("#chartObj").val();
		chartData = JSON.parse(labels);
		var data = [];
		traceObj['labels'] = linesData['x'];
		traceObj['values'] = linesData['y'];
		traceObj['type'] = chartType;
		traceObj['name'] = 'value';
		traceObj['LABELPOSITION'] = 'inside';
		traceObj['marker'] = colorObj;
		$.each(chartData, function(key, val) {
			traceObj[key] = val;
		});
		if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
			data.push(traceObj);
		}
	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'donut') {
		var traceObj = {};
		var colorObj = {};
		var chartData = {};
		var labels = $("#chartObj").val();
		chartData = JSON.parse(labels);
		var data = [];
		traceObj['labels'] = linesData['x'];
		traceObj['values'] = linesData['y'];
		traceObj['hole'] = 0.4;
		traceObj['type'] = 'pie';
		traceObj['name'] = 'value';
		traceObj['marker'] = colorObj;
		$.each(chartData, function(key, val) {
			traceObj[key] = val;
		});
		if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
			data.push(traceObj);
		}
	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'column') {
		var data = [{
			y: linesData['y'],
			x: linesData['x'],
			type: 'bar',
			textinfo: "percent",
			marker: {
				color: generateRandomColourArray(labels)
			}
		}];
		var layout = {
			height: 500,
			width: 1100,
			title: "Candidate Data",
		};
	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'scatter') {
		var traceObj = {};
		var colorObj = {};
		var chartData = {};
		var labels = $("#chartObj").val();
		chartData = JSON.parse(labels);
		var data = [];
		traceObj['x'] = chartData[0],
			traceObj['y'] = chartData[1];
		traceObj['type'] = chartType;
		traceObj['mode'] = 'markers';
		traceObj['marker'] = colorObj;
		if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
			data.push(traceObj);
		}
	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'funnel') {
		var traceObj = {};
		var colorObj = {};
		var chartData = {};
		var labels = $("#chartObj").val();
		chartData = JSON.parse(labels);
		var data = [];
		traceObj['x'] = chartData[0],
			traceObj['y'] = chartData[1];
		traceObj['type'] = chartType;
		traceObj['mode'] = 'markers';
		traceObj['marker'] = colorObj;
		if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
			data.push(traceObj);
		}
	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'treemap') {
		$(".plotly").text("");
		mainTreeObjArr = JSON.parse(mainTreeObj);
		showTreeMapChart('treemap', mainTreeObjArr, "showScoreCardsDataWithChart");

	} else if (chartType != null && chartType != '' && chartType != undefined && chartType == 'scatterpolar') {
		var labels = $("#chartObj").val();
		chartData = JSON.parse(labels);
		var data = [];
		var traceObj = {};
		var colorObj = {};
		traceObj['r'] = chartData[0];
		traceObj['theta'] = chartData[1];
		traceObj['type'] = chartType;
		traceObj['fill'] = 'toself';
		if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
			data.push(traceObj);
		}
	}
	if (chartType != null && chartType != '' && chartType != undefined && chartType != 'treemap') {
		Plotly.newPlot(chartId, data);
	}
}
function getGeoCurrentLocation() {
	var data = {};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			data.latitude = latitude;
			data.logtitude = longitude;
			resolve(data);
		});
	}

}
function showTreeMapChart(chartType, data, chartId) {
	$("#showScoreCardsDataWithChart div").show();
	$("#showScoreCardsDataWithChart").css("height", "400px");
	$("#showScoreCardsDataWithChart").css("width", "1000px");
	var dom = document.getElementById(chartId);
	var mediaFlag = $("#mediaFlag").val();
	var myChart = echarts.init(dom, null, {
		renderer: 'svg',
		useDirtyRect: true
	});
	const formatUtil = echarts.format;

	var option = {
		tooltip: {
			show: true,
			formatter: function(info) {
				var value = info.value;
				var treePathInfo = info.treePathInfo;
				var treePath = [];
				for (var i = 1; i < treePathInfo.length; i++) {
					treePath.push(treePathInfo[i].name);
				}
				return ['<div class="tooltip-title">' +
					echarts.format.encodeHTML(treePath.join('/')) +
					'</div>',
				formatUtil.addCommas(value)
				].join('');
			}
		},
		series: {
			name: 'Start',
			type: 'treemap',
			visibleMin: 1,
			visualMin: 1,
			// roam: 'move',
			label: {
				show: true,
				distance: 5,
				rich: {
					Candidate: {
						height: 20,
						width: 20,
						align: 'left',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/CandidatesW.png'
							image: 'http://localhost:8081/insights/images/CandidatesW.png'
						}
					},
					Tweets: {
						height: 20,
						width: 20,
						align: 'left',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/TweetsEmojiW.png'
							image: 'http://localhost:8081/insights/images/TweetsEmojiW.png'
						}
					},
					Likes: {
						height: 20,
						width: 20,
						align: 'left',
						backgroundColor: {
							image: 'http://localhost:8081/insights/images/like_white.png'
							//                            image: 'http://192.169.1.105:9999/insights/images/like_white.png'
						}
					},
					Retweets: {
						height: 20,
						width: 20,
						align: 'left',
						title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/RetweetEmojiW.png'
							image: 'http://localhost:8081/insights/images/RetweetEmojiW.png'
						}
					},
					HigtTwtCnt: {
						height: 20,
						width: 20,
						align: 'left',
						title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/highTwtCntW.png'
							image: 'http://localhost:8081/insights/images/highTwtCntW.png'
						}
					},
					LowTwtCnt: {
						height: 20,
						width: 20,
						align: 'left',
						title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/lowTwtCntW.png'
							image: 'http://localhost:8081/insights/images/lowTwtCntW.png'
						}
					},
					highTwtDt: {
						height: 20,
						width: 20,
						align: 'left',
						title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/calendarUpW.png'
							image: 'http://localhost:8081/insights/images/calendarUpW.png'
						}
					},
					lowTwtDt: {
						height: 20,
						width: 20,
						align: 'left',
						title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/calendarDownW.png'
							image: 'http://localhost:8081/insights/images/calendarDownW.png'
						}
					},
					youTube: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/youtubeW.png'
							image: 'http://localhost:8081/insights/images/youtubeW.png'
						}
					},
					NewsPaper: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/newsPaperW.png'
							image: 'http://localhost:8081/insights/images/newsPaperW.png'
						}
					},
					NewsChannel: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/NewsChW.png'
							image: 'http://localhost:8081/insights/images/NewsChW.png'
						}
					},
					VViews: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/VViewsW.png'
							image: 'http://localhost:8081/insights/images/VViewsW.png'
						}
					},
					VDisLikes: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/dislike_white.png'
							image: 'http://localhost:8081/insights/images/dislike_white.png'
						}
					},
					VComments: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/VCommentsW.png'
							image: 'http://localhost:8081/insights/images/VCommentsW.png'
						}
					},
					NCHeadLine: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/headlineW.png'
							image: 'http://localhost:8081/insights/images/headlineW.png'
						}
					},
					NCMedia: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/newsMediaW.png'
							image: 'http://localhost:8081/insights/images/newsMediaW.png'
						}
					},
					HighTwtCan: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/highTwtW.png'
							image: 'http://localhost:8081/insights/images/highTwtW.png'
						}
					},
					Average: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/averageW.png'
							image: 'http://localhost:8081/insights/images/averageW.png'
						}
					},
					DownTwtCan: {
						height: 20,
						width: 20,
						align: 'left',
						//                        title: 'Retweets',
						backgroundColor: {
							//                            image: 'http://192.169.1.105:9999/insights/images/downTW.png'
							image: 'http://localhost:8081/insights/images/downTW.png'
						}
					},

				},
				formatter: function(params) {

					let arr = [];
					var chidrenData = params.data.tweetData;
					if (params.data.count != null && params.data.count != '' && params.data.count != undefined) {
						if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'T') {
							var average = params.data.avgCount / 30;
							average = Math.round(average);
							arr = [params.name, ['{Tweets|} : ' + echarts.format.addCommas(params.value)].join('\n'),
							['{Candidate|} : ' + params.data.count].join('\n'),
							['{Average|} : ' + average].join('\n'),
							['{HighTwtCan|} : ' + params.data.highTwtCan].join('\n'),
							['{HigtTwtCnt|} : ' + params.data.partyHighCount].join('\n'),
							['{DownTwtCan|} : ' + params.data.lowTweetCan].join('\n'),
							['{LowTwtCnt|} : ' + params.data.partyLowCount].join('\n')];
						} else if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'Y') {
							average = Math.round(average);
							arr = [params.name, ['{youTube|} : ' + echarts.format.addCommas(params.value)].join('\n'),
							['{Candidate|} : ' + params.data.count].join('\n'),
							['{Average|} : ' + average].join('\n'),
							['{HighTwtCan|} : ' + params.data.highTwtCan].join('\n'),
							['{HigtTwtCnt|} : ' + params.data.partyHighCount].join('\n'),
							['{DownTwtCan|} : ' + params.data.lowTweetCan].join('\n'),
							['{LowTwtCnt|} : ' + params.data.partyLowCount].join('\n')];
						} else if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'NP') {
							arr = [params.name, ['{NewsPaper|} : ' + echarts.format.addCommas(params.value)].join('\n'), ['{Candidate|} : ' + params.data.count].join('\n')];
						} else if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'NC') {
							arr = [params.name, ['{NewsChannel|} : ' + echarts.format.addCommas(params.value)].join('\n'), ['{Candidate|} : ' + params.data.count].join('\n')];
						}

					} else if (chidrenData != null && chidrenData != '' && chidrenData != undefined) {
						if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'T') {
							arr = [params.data.name, ['{Tweets|} : ' + echarts.format.addCommas(params.data.value)].join('\n'),
							['{Likes|} : ' + params.data.tweetData.likesCount].join('\n'),
							['{Retweets|} : ' + params.data.tweetData.retweetCpunt].join('\n'),
							['{highTwtDt|} : ' + params.data.tweetData.highTweetsDate].join('\n'),
							['{HigtTwtCnt|} : ' + params.data.tweetData.highTweetsCount].join('\n'),
							['{lowTwtDt|} : ' + params.data.tweetData.lowTweetsDate].join('\n'),
							['{LowTwtCnt|} : ' + params.data.tweetData.lowTweetsCount].join('\n')];
						} else if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'Y') {
							arr = [params.data.name, ['{youTube|} : ' + echarts.format.addCommas(params.data.value)].join('\n'),
							['{VViews|} : ' + params.data.tweetData.videoViewsCount].join('\n'),
							['{Likes|} : ' + params.data.tweetData.videoLikesCount].join('\n'),
							['{VDisLikes|} : ' + params.data.tweetData.videoDisLikesCount].join('\n'),
							['{VComments|} : ' + params.data.tweetData.videoCommentsCount].join('\n'),
							['{highTwtDt|} : ' + params.data.tweetData.highTweetsDate].join('\n'),
							['{HigtTwtCnt|} : ' + params.data.tweetData.highTweetsCount].join('\n'),
							['{lowTwtDt|} : ' + params.data.tweetData.lowTweetsDate].join('\n'),
							['{LowTwtCnt|} : ' + params.data.tweetData.lowTweetsCount].join('\n')];
						} else if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'NC') {
							arr = [params.data.name, ['{NewsChannel|} : ' + echarts.format.addCommas(params.data.value)].join('\n'),
							['{VViews|} : ' + params.data.tweetData.videoViewsCount].join('\n'),
							['{Likes|} : ' + params.data.tweetData.videoLikesCount].join('\n'),
							['{VDisLikes|} : ' + params.data.tweetData.videoDisLikesCount].join('\n'),
							['{VComments|} : ' + params.data.tweetData.videoCommentsCount].join('\n'),
							['{highTwtDt|} : ' + params.data.tweetData.highTweetsDate].join('\n'),
							['{HigtTwtCnt|} : ' + params.data.tweetData.highTweetsCount].join('\n'),
							['{lowTwtDt|} : ' + params.data.tweetData.lowTweetsDate].join('\n'),
							['{LowTwtCnt|} : ' + params.data.tweetData.lowTweetsCount].join('\n')];
						} else if (mediaFlag != null && mediaFlag != '' && mediaFlag != undefined && mediaFlag == 'NP') {
							arr = [params.data.name, ['{NewsPaper|} : ' + echarts.format.addCommas(params.data.value)].join('\n'),
							['{NCHeadLine|} : ' + params.data.tweetData.headLinesCount].join('\n'),
							['{NCMedia|} : ' + params.data.tweetData.mediaNamesCount].join('\n'),
							['{highTwtDt|} : ' + params.data.tweetData.highTweetsDate].join('\n'),
							['{HigtTwtCnt|} : ' + params.data.tweetData.highTweetsCount].join('\n'),
							['{lowTwtDt|} : ' + params.data.tweetData.lowTweetsDate].join('\n'),
							['{LowTwtCnt|} : ' + params.data.tweetData.lowTweetsCount].join('\n')];
						}
					} else {
						arr = [params.name, echarts.format.addCommas(params.value)];
					}

					return arr.join('\n');
				},

			},

			levels: [
				{
					itemStyle: {
						//borderWidth: 3,
						//borderColor: '#333',
						//gapWidth: 1
					}
				},
			],
			data: data,
			leafDepth: 1

		},

	};
	if (option && typeof option === 'object') {
		myChart.setOption(option);
	}
}
function showFullImageOnPopup(id, title) {
	var imagePath = $("#" + id).attr("src");
	imagePath = "<span><img src='" + imagePath + "' style='width: 1105px !important;'></span>";
	var modalObj = {
		title: labelObject[title] != null ? labelObject[title] : title,
		body: imagePath,
	};
	var buttonArray = [
		{
			text: labelObject['Close'] != null ? labelObject['Close'] : 'Close',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".modal-dialog").addClass("modal-xl");
	$(".dataDxpSplitterValue").addClass("dataDxpSplitterShowFullImageOnPopup");
}
function searchLoadETL(featureType) {
	var suggetionType = $("#suggetionType").val();
	if (suggetionType == null || suggetionType == '' || suggetionType == undefined) {
		loadETL('ETL');
		$("#intellisense").hide();
		$("#SearchResult").val(featureType);
		if (featureType != null && featureType != "" && featureType != undefined && featureType.indexOf('Job') > -1) {
			showEtlList('availableJobsDiv', 'availableJobs');
		} else if (featureType != null && featureType != "" && featureType != undefined && featureType.indexOf("Data") > -1) {
			showEtlList('schemaObjectsDiv', 'schemaObjects');
		} else if (featureType != null && featureType != "" && featureType != undefined && featureType.indexOf("Data") > -1) {
			showEtlList('savedConnectionsIconsDiv', 'availableConnections');
		} else {
			showEtlList('savedConnectionsIconsDiv', 'availableConnections');
		}
	}

}
function searchResultDetails(searchedValue, searchFlag) {
	$(".modal-content").val('');
	var titleName = '';
	var sourceValue = '';
	$("#suggetionType").val(searchFlag);
	if (searchedValue != null && searchedValue != undefined && searchedValue != '') {
		if (searchFlag != null && searchFlag != '' && searchFlag != undefined && searchFlag == 'V') {
			titleName = searchedValue + ' Video';
			sourceValue = "images/Videos/JobExe.mp4";
		} else if (searchFlag != null && searchFlag != '' && searchFlag != undefined && searchFlag == 'G') {
			titleName = searchedValue + ' Gif';
			sourceValue = "images/Videos/JobExe.gif";
		} else if (searchFlag != null && searchFlag != '' && searchFlag != undefined && searchFlag == 'H') {
			titleName = searchedValue + ' Help';
			sourceValue = "images/Videos/JobExe.docx";
		}
		//        var iframe = "<div class='dxpvideo'><video><source src='..Downloads/jobExe.mp4' width='100%' height='315' id='iFrameVideo' type='video/mp4' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></video></div>";
		var iframe = "<div class='dxpvideo' ><iframe width='100%' height='287' id='iFrameVideo' src='" + sourceValue + "' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></div>";
		var modalObj = {
			title: labelObject[titleName] != null ? labelObject[titleName] : titleName,
			body: iframe,
		};
		createModal("dataDxpSplitterValue", modalObj);
		$(".modal-dialog").addClass("modal-md");
		$(".dataDxpSplitterValue").addClass("dataDxpSplitterShowFullImageOnPopup");


		if (searchFlag != null && searchFlag != '' && searchFlag != undefined && searchFlag == 'H') {
			setTimeout(function() {
				$("#dataDxpSplitterValue").hide();
			}, 1000);
		}
	}
}
function showTransformFeatures(menu, selectedMenu) {
	$("#intellisense").hide();
	$("#mainFeaturesMenu").val(menu);
	if (menu == "Smart BI") {
		console.log('Added onclick to analytics');
		$("#textHintID").attr('onclick', 'analyticsFeaturesGuideHome()');
	}
	else if (menu == "ETL") {
		console.log('Added onclick to transformFeatures');
		$("#textHintID").attr('onclick', 'transformFeaturesGuideHome()');
	}
	if (menu == "AI") {
		console.log('Added onclick to aiFeature');
		$("#textHintID").attr('onclick', 'aiFeatureGuideHome()');
	}
	else if (menu == "AIKB") {
		console.log('Added onclick to DS knowlegde');
		$("#textHintID").attr('onclick', 'dsKnowledgeHomeGuide()')
	}
	showLoader();
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'getTransformFeaturesmenu',
		cache: false,
		data: {
			menu: menu,
			mediaFlag: "M",
			flag: true,
			highMenu: menu,
			selectedMenu: selectedMenu,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			$("#pageBodyContent").html(response['menu']);
		}
	});

}

function TransformFeaturesmenuList(features, appendClass) {
	$("#intellisense").hide();
	$(".allLiFeaturesMenuList").removeClass("allLiFeaturesActive");
	var mainFeaturesMenu = $("#mainFeaturesMenu").val();
	showLoader();
	//    $("#"+appendClass).css("background-color", "red");
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'getTransformFeaturesmenu',
		cache: false,
		data: {
			menu: features,
			mediaFlag: "F",
			flag: false,
			highMenu: mainFeaturesMenu
		},
		success: function(response) {
			stopLoader();
			$("#featuresMenuList").show();
			$("#featuresMenuGraphPageList").show();
			$("#featuresMenuList").html(response['menu']);

			$("#" + features.toLowerCase().replaceAll(" ", "").replaceAll(" ", "")).addClass("allLiFeaturesActive");
			var chartDom = document.getElementById('featuresMenuGraphList');
			var myChart = echarts.init(chartDom, null, {
				renderer: 'canvas',
				useDirtyRect: false
			});
			var option;
			var data = response['sunburst'];
			option = {
				title: {
					text: features,
					left: "center",
					top: "auto",
					textStyle: {
						fontSize: 30
					}
				},
				series: {
					type: 'sunburst',
					data: data,
					radius: [0, '95%'],
					sort: undefined,
					emphasis: {
						focus: 'ancestor'
					},
					levels: [
						{},
						{
							r0: '15%',
							r: '35%',
							itemStyle: {
								borderWidth: 2
							},
							label: {
								rotate: 'tangential'
							}
						},
						{
							r0: '35%',
							r: '70%',
							label: {
								minAngle: 60,
								position: "inside",
								align: 'center',
								rotate: 'tangential'
							}
						},
					],
					renderLabelForZeroData: false
				}
			};
			myChart.setOption(option);
			//            Plotly.newPlot("featuresMenuGraphList", data, layout);
		}
	});
}
function searchOnKeyupList(flag, list) {
	showLoader();
	var val = $("#searchOnTypeCard" + flag).val();
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'getSearchTransformFeaturesmenu',
		cache: false,
		data: {
			flag: flag,
			val: val,
			list: list
		},
		traditional: true,
		cache: false,
		success: function(response) {
			stopLoader();
			$("#allFeaturesMenuList" + flag).html(response['list']);
		}
	});
}
function showFeaturesForm(operation, menu) {
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'showFeaturesOnCardForm',
		cache: false,
		data: {
			operation: operation,
			menu: menu
		},
		traditional: true,
		cache: false,
		success: function(response) {
			//			$("#featuresMenuGraphPageList").show();
			//			$("#featuresMenuGraphPageList").removeClass("col-sm-8");
			//			$("#featuresMenuGraphPageList").addClass("col-sm-10");
			//			$("#featuresMenuGraphList").hide(); 
			//			
			//		$("#dsKnowledgeBaseID").html(response['dictTableResult']);
			var modalObj = {
				title: "<img src='images/BrainAI.png' style='width:20px;margin-top: -3px;'>&nbsp;&nbsp;&nbsp;<span style='font-size: 18px;'>" + operation + "</span>",
				body: response['dictTableResult'],
			};
			var buttonArray = [
				{
					text: labelObject['Close'] != null ? labelObject['Close'] : 'Close',
					click: function() {
					},
					isCloseButton: true
				}
			];
			modalObj['buttons'] = buttonArray;
			createModal("dataDxpSplitterValue", modalObj);
			$(".modal-dialog").addClass("modal-xl");
		}
	});

}
function showMySubscriptionsData() {
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'mySubscriptions',
		cache: false,
		data: {
			operation: "subscription",
		},
		traditional: true,
		cache: false,
		success: function(response) {
			$("#pageBodyContent").html(response['mySubscriptions']);
		}
	});
}
function showMyTransactionsData() {
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'myTransactions',
		cache: false,
		data: {
			operation: "transactions",
		},
		traditional: true,
		cache: false,
		success: function(response) {
			$("#pageBodyContent").html(response['myTransactions']);
		}
	});
}
function getPilogMedialShowCaseCards() {
	showLoader();
	$.ajax({
		type: "POST",
		dataType: 'html',
		traditional: true,
		url: 'getPilogMedialShowCaseCards',
		data: {
			constitution: "transactions"
		},
		cache: false,
		success: function(response) {
			stopLoader();
			if (response != null && response != "" && response != undefined) {
				$("#pageBodyContent").html(response);
				$("#intellisenseHomeSelectBox").val('PilogMedia');
				GartnerPI_Widget({
					size: "large",
					theme: "light",
					sourcingLink: "https://gtnr.it/2YwPiDk",
					widget_id: "YzMyZjJkYTctMDZhOC00NDg2LTg0ZTktOWI1NDQ4Mjk5YzM1",
					version: "2",
					container: document.querySelector('#myNodeContainer'),
				});
				$('.card-body').scroll(function() {
					var values = $(this).scrollTop() + $(this).innerHeight();
					var value = parseFloat(values).toFixed(0);
					var pointvalue = parseFloat(values + 1).toFixed(0);
					if (value >= $(this)[0].scrollHeight) {
						getPilogMedialRefreshOnLoad(event);
					} else if (pointvalue >= $(this)[0].scrollHeight) {
						getPilogMedialRefreshOnLoad(event);
					}
				});
			}
		}
	});
}
function setNewCreatePilogCard() {
	var list = '<div class="pilogCardHeaderMainDiv container"><form class="needs-validation" novalidate><div class="form-group">'
		+ '<label for="uname">Header Name:</label><input type="text" class="form-control" id="uname" placeholder="Enter header name" name="uname" required></div>'
		+ '<div class="form-group"><label for="pwd">Name:</label><input type="password" class="form-control" id="pwd" placeholder="Enter name" name="pswd" required></div>'
		+ '<div class="form-group"><label for="pwd">Comment:</label><input type="password" class="form-control" id="pwd" placeholder="Enter comment" name="pswd" required></div>';
	var modalObj = {
		title: 'Create Form',
		body: list,
	};
	var buttonArray = [
		{
			text: labelObject['Ok'] != null ? labelObject['Ok'] : 'Ok',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$(".modal-dialog").addClass("modal-xl");
}
//function subscriptionDetails() {
//	//	var result ='<div class="container-fluid">'
//	//     +'<div class="row">'
//	// +'<div class="col-md-4">'
//	//        +'<div class="pricing-card">'
//	//         +' <h3 class="pricing-card-header">Free Lancer</h3>'
//	//         +' <div class="price">0<span>/MO</span></div>'
//	//          +'<ul>'
//	//          +'<li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 100 MB</li>'
//	//      +'<li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 20 Charts Creation</li>'
//	//     +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 2 Jobs Creation</li>'
//	//      +'<li><span class="crossMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Drilldown Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> ChartTypes & Features</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Auto Generated Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Etl Saved Jobs</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Features & Use Cases</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> AI Based Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Search Based Operations</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Color Palette</li>' 
//	//          +'</ul>'
//	//          +" <a href='#' class='order-btn' onclick=\"paymentProcess('0','FREELANCER')\">Free Trial</a>"
//	//        +'</div>'
//	//      +'</div>'  
//	//      +'<div class="col-md-4">'  
//	//      +'<div class="pricing-card">'
//	//    +'<h3 class="pricing-card-header">Professional</h3>'
//	//    +'<div class="price">99<span>/MO</span></div>'
//	//    +'<ul>'
//	//     +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 200 MB</li>'
//	//      +'<li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 50 Charts Creation</li>'
//	//     +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 5 Jobs Creation</li>'
//	//      +'<li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Drilldown Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> ChartTypes & Features</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Auto Generated Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Etl Saved Jobs</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Features & Use Cases</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> AI Based Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Search Based Operations</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Color Palette</li>'
//	//    +'</ul>'
//	//     +" <a href='#' class='order-btn' onclick=\"paymentProcess('99','PROFESSIONAL')\">Subscribe</a>"  
//	//  +'</div>'
//	//   +'</div>'
//	//  +'<div class="col-md-4">'
//	//  +'<div class="pricing-card">'
//	//   +' <h3 class="pricing-card-header">Team ( 1-5 )</h3>'
//	//   +' <div class="price">199<span>/MO</span></div>'
//	//   +' <ul>'
//	//    +'  <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 500 MB</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 100 Charts Creation</li>'
//	//     +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 10 Jobs Creation</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Drilldown Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> ChartTypes & Features</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Auto Generated Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Etl Saved Jobs</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Features & Use Cases</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> AI Based Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Search Based Operations</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Color Palette</li>'
//	//   +' </ul>'
//	//    +" <a href='#' class='order-btn' onclick=\"paymentProcess('199','TEAM')\">Subscribe</a>"   
//	//  +'</div>'
//	//   +'</div>'
//	//  +'<div class="col-md-4">'
//	//  +'<div class="pricing-card">'
//	//   +' <h3 class="pricing-card-header">Company</h3>'   
//	//   +' <div class="price">499<span>/MO</span></div>'
//	//    +'<ul>'
//	//     +'<li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 1 GB</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 100 Charts Creation</li>'
//	//      +'<li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 10 Jobs Creation</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Drilldown Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> ChartTypes & Features</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Auto Generated Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Etl Saved Jobs</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Features & Use Cases</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> AI Based Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Search Based Operations</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Color Palette</li>'
//	//    +'</ul>'
//	//    +" <a href='#' class='order-btn' onclick=\"paymentProcess('499','COMPANY')\">Subscribe</a>"   
//	//  +'</div>'
//	//   +'</div>'
//	//  +'<div class="col-md-4">'
//	// +' <div class="pricing-card">'
//	//   +' <h3 class="pricing-card-header">Ultimate</h3>'
//	//    +'<div class="price">999<span>/MO</span></div>'
//	//    +'<ul>'
//	//     +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Unlimited</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Unlimited</li>'
//	//     +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Unlimited</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Drilldown Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> ChartTypes & Features</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Auto Generated Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Etl Saved Jobs</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Features & Use Cases</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> AI Based Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Search Based Operations</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Color Palette</li>'
//	//   +' </ul>'
//	//   +" <a href='#' class='order-btn' onclick=\"paymentProcess('999','ULTIMATE')\">Subscribe</a>"   
//	//  +'</div>'
//	//   +'</div>'      
//	//  +'<div class="col-md-4">'
//	//  +'<div class="pricing-card">'
//	//    +'<h3 class="pricing-card-header">Custome</h3>'
//	//    +'<div class="price"><sup>starting</sup>149<span>/MO</span></div>'
//	//    +'<ul>'
//	//     +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 500 MB</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 100 Charts Creation</li>'
//	//      +'<li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Upto 10 Jobs Creation</li>'
//	//     +' <li><span class="crossMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Drilldown Charts</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> ChartTypes & Features</li>'
//	//	 +' <li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Auto Generated Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-check" aria-hidden="true"></i></span><strong></strong> Etl Saved Jobs</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Features & Use Cases</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> AI Based Charts</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Search Based Operations</li>'
//	//	  +'<li><span class="checkMarker"><i class="fa fa-times" aria-hidden="true"></i></span><strong></strong> Color Palette</li>'
//	//   +' </ul>'
//	//   +" <a href='#' class='order-btn' onclick=\"paymentProcess('149','CONTACTUS')\">Contact Us</a>"   
//	//  +'</div>'
//	//   +'</div>'
//	//      +'</div></div>';
//	var result = '<div class="pricingCustomeTable">'
//		+ '<table class="table table-hover table-bordered"'
//		+ ' style="text-align:center;padding-left:200px;'
//		+ 'padding-right:200px;">'
//		+ '<thead>'
//		+ '<tr class="active">'
//		+ ' <th style="background:#fff" class="firstChildClass"></th>'
//		+ ' <th><center><h3 class="PlanTitle"><b>Free Lancer</b></h3><p'
//		+ ' class="text-muted text-sm">Try for single user.</p>'
//		+ ' <h3 class="panel-title price">₹ 0.00</h3>'
//		+ ' <button class="btn btn-primary" onclick=\'paymentForm("0","FREELANCER")\'>Try Now</button>'
//		+ '</center></th>'
//		+ '<th><center><h3 class="PlanTitle"><b>Professional</b></h3><p class="text-muted text-sm">Perfect for Single User.</p>'
//		+ '<h3 class="panel-title price">₹ 199.00</h3>'
//		+ ' <button class="btn btn-primary" onclick=\'paymentForm("199","PROFESSIONAL")\'>Buy Now</button></center></th>'
//		+ '<th><center><h3 class="PlanTitle"><b>Team(1-5)</b></h3><p'
//		+ ' class="text-muted text-sm">Perfect for Single Team.</p>'
//		+ '<h3 class="panel-title price">₹ 499.00</h3>'
//		+ '<button class="btn btn-primary" onclick=\'paymentForm("499","TEAM")\'>Buy Now</button></center></th>'
//
//		+ ' <th><center><h3 class="PlanTitle"><b>Company</b></h3><p'
//		+ ' class="text-muted text-sm">Perfect for Organization.</p>'
//		+ ' <h3 class="panel-title price">₹ 999.00</h3>'
//		+ ' <button class="btn btn-primary" onclick=\'paymentForm("999","COMPANY")\'>Buy Now</button>'
//		+ '</center></th>'
//		+ ' <th><center><h3 class="PlanTitle"><b>Ultimate</b></h3><p'
//		+ ' class="text-muted text-sm">Perfect for Unlimited Users.</p>'
//		+ ' <h3 class="panel-title price">₹ 1199.00</h3>'
//		+ ' <button class="btn btn-primary" onclick=\'paymentForm("999","ULTIMATE")\'>Buy Now</button>'
//		+ '</center></th>'
//		+ ' <th><center><h3 class="PlanTitle"><b>Customize</b></h3><p'
//		+ ' class="text-muted text-sm">Perfect for Customization.</p>'
//		+ ' <h3 class="panel-title price">Starting ₹ 199.00</h3>'
//		+ ' <button class="btn btn-primary" onclick=\'paymentForm("999","CUSTOMIZE")\'>Try Now</button>'
//		+ '</center></th>'
//		+ '</tr>'
//		+ '</thead>'
//		+ '<tbody>'
//		+ '<tr data-toggle="collapse" data-target="#accordion"'
//		+ ' class="clickable collapse-row collapsed">'
//		+ ' <td colspan="7" align="left" style="padding-left:20px;background-color: #a2c0ed;"'
//		+ ' class="active"><b>Website Features</b></td>'
//		+ ' </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ ' <td><b>Responsive design</b></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td>Customize</td>'
//		+ ' </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ ' <td><b>Dark Theme Mode</b></td>'
//		+ ' <td>-</td>'
//		+ ' <td>-</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td>Customize</td>'
//		+ ' </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ ' <td><b>AI Features</b></td>'
//		+ ' <td>-</td>'
//		+ ' <td>-</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td>Customize</td>'
//		+ ' </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ ' <td><b>Analytic Use Cases</b></td>'
//		+ ' <td>-</td>'
//		+ ' <td>-</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td>Customize</td>'
//		+ ' </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ ' <td><b>Transform Use Cases</b></td>'
//		+ ' <td>-</td>'
//		+ ' <td>-</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td>Customize</td>'
//		+ ' </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ '<td><b>Scales to mobile</b></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td>Customize</td>'
//		+ ' </tr>'
//		+ '<tr id="accordion" class="collapse">'
//		+ ' <td><b>Contact Form</b></td>'
//		+ ' <td>-</td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td>Customize</td>'
//
//		+ '  </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ '<td><b>Social Media Integration</b></td>'
//		+ '<td>-</td>'
//		+ '<td>-</td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td>Customize</td>'
//
//		+ ' </tr>'
//		+ '<tr id="accordion" class="collapse">'
//		+ ' <td><b>Custom Pages</b></td>'
//		+ ' <td>2</td>'
//		+ '<td>2</td>'
//		+ ' <td>10</td>'
//		+ ' <td>20</td>'
//		+ ' <td>Unlimited</td>'
//		+ ' <td>Customize</td>'
//		+ ' </tr>'
//		+ ' <tr id="accordion" class="collapse">'
//		+ '<td><b>Storage</b></td>'
//		+ '<td>100 MB</td>'
//		+ ' <td>200 MB</td>'
//		+ ' <td>500 MB</td>'
//		+ ' <td>1GB</td>'
//		+ ' <td>Unlimited</td>'
//		+ ' <td>Customize</td>'
//		+ '</tr>'
//		+ ' <tr>'
//		+ '<td colspan="7" align="left" style="padding-left:20px;background-color: #a2c0ed;"'
//		+ ' class="active"><b>Features</b></td>'
//		+ '</tr>'
//		+ ' <tr>'
//		+ ' <td><b>Powerful Analytics</b></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ 'fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' </tr>'
//		+ ' <tr>'
//		+ '<td><b>24/7 Support</b></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ ' </tr>'
//
//		+ ' <tr>'
//		+ '<td colspan="7" align="left" style="padding-left:20px;background-color: #a2c0ed;"'
//		+ ' class="active"><b>Integration</b></td>'
//		+ ' </tr>'
//		+ ' <tr>'
//		+ '  <td><b>Connections</b></td>'
//		+ ' <td>Upto 2 Connections</td>'
//		+ ' <td>Upto 5 Connections</td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ '</tr>'
//		+ '<tr>'
//		+ '<td><b>AI Charts</b></td>'
//		+ ' <td>Basic AI Charts</td>'
//		+ '  <td>Default AI Chart Types</td>'
//		+ '  <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ ' </tr>'
//		+ ' <tr>'
//		+ '<td><b>Chart Types</b></td>'
//		+ '<td>Upto 2 Chart Types</td>'
//		+ '<td>Upto 5 chart Types</td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ '  fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ '  </tr>'
//		+ ' <tr>'
//		+ ' <td><b>DrillDown Charts</b></td>'
//		+ ' <td>Default DrillDown Charts</td>'
//		+ ' <td>Upto 5 Drill Charts</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ '</tr>'
//		+ ' <tr>'
//		+ ' <td><b>Search Based Operations</b></td>'
//		+ ' <td>Basic Search</td>'
//		+ ' <td>Basic Search</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ '</tr>'
//		+ ' <tr>'
//		+ ' <td><b>Color Palette</b></td>'
//		+ ' <td>Basic Color</td>'
//		+ ' <td>Basic Color</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ '</tr>'
//		+ ' <tr>'
//		+ ' <td><b>Saved Jobs</b></td>'
//		+ ' <td>Upto 2 Jobs</td>'
//		+ ' <td>Upto 5 Jobs</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ '</tr>'
//		+ ' <tr>'
//		+ ' <td><b>Features & Use Cases</b></td>'
//		+ ' <td>Analytic Features</td>'
//		+ ' <td>Analytic Features</td>'
//		+ '<td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//		+ ' <td><i style="color:limegreen" class="fa fa-check'
//		+ ' fa-lg"></i></td>'
//
//		+ '</tr>'
//
//		+ '</tbody>'
//		+ ' </table>'
//
//		+ '</div>';
//	$("#pageBodyContent").html(result);
//}
function showViewFont(id, val) {
	if (id == 'Menu') {
		if (val != null && val == 'UpperCase') {
			$(".menuTitle").css('text-transform', 'uppercase');
		} else if (val != null && val == 'LowerCase') {
			$(".menuTitle").css('text-transform', 'lowercase');
		} else if (val != null && val == 'Refresh') {
			$(".menuTitle").css('text-transform', 'capitalize');
		}
	} else if (id == 'Description') {
		if (val != null && val == 'UpperCase') {
			$(".titleClass").css('text-transform', 'uppercase');
		} else if (val != null && val == 'LowerCase') {
			$(".titleClass").css('text-transform', 'lowercase');
		} else if (val != null && val == 'Refresh') {
			$(".titleClass").css('text-transform', 'capitalize');
		}
	} else if (id == 'Content') {
		if (val != null && val == 'UpperCase') {
			$(".card-body").css('text-transform', 'uppercase');
		} else if (val != null && val == 'LowerCase') {
			$(".card-body").css('text-transform', 'lowercase');
		} else if (val != null && val == 'Refresh') {
			$(".card-body").css('text-transform', 'capitalize');
		}
	}
}

function menuFontSizeData(List, val) {

	if (List = "Menu") {

		if (val != null && val != '' && val != undefined && val == 'Smaller') {
			$(".menuTitle").css("font-size", "smaller", '!important');


		}
		else if (val != null && val != '' && val != undefined && val == 'Medium') {
			$(".menuTitle").css("font-size", "medium", '!important');
		}
		else if (val != null && val != '' && val != undefined && val == 'Large') {
			$(".menuTitle").css("font-size", "x-large", '!important');

		} else if (val != null && val != '' && val != undefined && val == 'Reset') {
			$(".menuTitle").css("font-size", "12px");
		}
	}
}
function contentFontSizeData(List, val) {
	if (List = "Content") {

		if (val != null && val != '' && val != undefined && val == 'Smaller') {

			$(".postedName").css("font-size", "smaller", '!important');
			$(".postedDate").css("font-size", "smaller", '!important');
			$(".isFilterSurvey").css("font-size", "smaller", '!important');


		}
		else if (val != null && val != '' && val != undefined && val == 'Medium') {
			$(".postedName").css("font-size", "medium", '!important');
			$(".postedDate").css("font-size", "medium", '!important');
			$(".isFilterSurvey").css("font-size", "medium", '!important');

		}
		else if (val != null && val != '' && val != undefined && val == 'Large') {
			$(".postedName").css("font-size", "x-large", '!important');
			$(".postedDate").css("font-size", "x-large", '!important');
			$(".isFilterSurvey").css("font-size", "x-large", '!important');

		} else if (val != null && val != '' && val != undefined && val == 'Reset') {
			$(".postedName").css("font-size", "13px");
			$(".postedDate").css("font-size", "13px");
			$(".isFilterSurvey").css("font-size", "12px");
		}
	}
}
function descriptionFontSize(List, val) {
	if (List = "Description") {

		if (val != null && val != '' && val != undefined && val == 'Smaller') {
			$(".titleClass").css("font-size", "smaller", '!important');
			$(".isAnalyticsNameClass").css("font-size", "smaller", '!important');
			$(".footerText").css("font-size", "smaller", '!important');
			$(".intellisenseHomeSelectBox ").css("font-size", "smaller", '!important');


		}
		else if (val != null && val != '' && val != undefined && val == 'Medium') {
			$(".titleClass").css("font-size", "medium", '!important');
			$(".isAnalyticsNameClass").css("font-size", "medium", '!important');
			$(".footerText").css("font-size", "medium", '!important');
			$(".intellisenseHomeSelectBox ").css("font-size", "medium", '!important');

		}
		else if (val != null && val != '' && val != undefined && val == 'Large') {
			$(".titleClass").css("font-size", "x-large", '!important');
			$(".isAnalyticsNameClass").css("font-size", "x-large", '!important');
			$(".footerText").css("font-size", "x-large", '!important');
			$(".intellisenseHomeSelectBox ").css("font-size", "x-large", '!important');

		} else if (val != null && val != '' && val != undefined && val == 'Reset') {
			$(".titleClass").css("font-size", "16px");
			$(".isAnalyticsNameClass").css("font-size", "12px");
			$(".footerText").css("font-size", "12px");
			$(".intellisenseHomeSelectBox ").css("font-size", "13px");
		}
	}
}
var scrollCL = 20, scrollCF = 20, scrollCT = 20, scrollCI = 20, scrollCY = 20, scrollC = 20;
function getPilogMedialRefreshOnLoad(event) {
	var id = event['path']['1'].id;
	var flag = '';
	var count = '';
	if (id === 'pilogSocialMediaCardL') {
		flag = 'L';
		count = scrollCL + 5;
		scrollCL = count;
	} else if (id === 'pilogSocialMediaCardY') {
		flag = 'Y';
		count = scrollCY + 5;
		scrollCY = count;
	} else if (id === 'pilogSocialMediaCardT') {
		flag = 'T';
		count = scrollCT + 5;
		scrollCT = count;
	} else if (id === 'pilogSocialMediaCardI') {
		flag = 'I';
		count = counNC + 5;
		counNC = count;
	} else if (id === 'pilogSocialMediaCardF') {
		flag = 'F';
		count = scrollCF + 5;
		scrollCF = count;
	} else {
		flag = 'N';
		count = scrollC + 5;
		scrollC = count;
	}
	if (flag != null && flag != '') {
		showLoader();
		$.ajax({
			type: "POST",
			url: 'getScrollOnLoadPilogMedia',
			data: {
				'flag': flag,
				'count': count,
			},
			traditional: true,
			cache: false,
			success: function(response) {
				stopLoader();
				if (response != null && response != '') {
					$("#" + id + "GroupFilter").html(response['list']);
				}
			}
		});
	}

}
function paymentForm(cost, subscriptionType) {
	var result = '<div class="container integralStepFormDiv">'
		+ ' <form class="integralStepForm">'

		+ ' <section class="step-indicator">'
		+ '  <div class="step step1 active">'
		+ '<div class="step-icon"></div>'
		+ ' <p>About you</p>'
		+ ' </div>'
		+ ' <div class="indicator-line"></div>'
		+ '<div class="step step3">'
		+ ' <div class="step-icon"></div>'
		+ ' <p>Payment Status</p>'
		+ ' </div>'
		+ ' </section>'

		+ ' <div class="heading">'

		+ ' </div>'
		+ ' <div class="form-row">'
		+ '  <div class="form-group col-md-6">'
		+ ' <label for="inputEmail4">First Name</label>'
		+ ' <input type="text" class="form-control" id="inputEmail4">'
		+ ' </div>'
		+ '  <div class="form-group col-md-6">'
		+ '  <label for="inputPassword4">Middle Name (optional)</label>'
		+ ' <input type="text" class="form-control" id="inputPassword4">'
		+ ' </div>'
		+ '</div>'
		+ ' <div class="form-row">'
		+ ' <div class="form-group col-md-6">'
		+ ' <label for="inputAddress">Surname</label>'
		+ ' <input type="text" class="form-control" id="inputAddress">'
		+ '  </div>'
		+ '  <div class="form-group col-md-6">'
		+ '   <label for="inputAddress2">Business phone number</label>'
		+ ' <input type="text" class="form-control" id="inputAddress2">'
		+ '</div>'
		+ '</div>'
		+ '  <div class="form-row">'
		+ '  <div class="form-group col-md-6">'
		+ '   <label for="inputCity">Company name</label>'
		+ '  <input type="text" class="form-control" id="inputCity">'
		+ ' </div>'
		+ '  <div class="form-group col-md-6">'
		+ '   <label for="inputState">Company size</label>'
		+ ' <select id="inputState" class="form-control">'
		+ '  <option selected>Choose size</option>'
		+ '<option >0-5</option>'
		+ ' <option >5-10</option>'
		+ ' <option >10-30</option>'
		+ ' <option >30-100</option>'
		+ '  <option >100-500</option>'
		+ ' <option >500-1000</option>'
		+ ' </select>'
		+ ' </div>'

		+ ' <div class="form-group col-md-12">'
		+ ' <label for="inputState">Country or Region</label>'
		+ '<select id="inputState" class="form-control">'
		+ ' <option selected>Choose country or region</option>'
		+ ' <option value="IND" label="India">India</option>'
		+ ' <option value="JP" label="Japan">Japan</option>'
		+ ' <option value="JO" label="Jordan">Jordan</option>'
		+ ' <option value="KZ" label="Kazakhstan">Kazakhstan</option>'
		+ ' <option value="KW" label="Kuwait">Kuwait</option>'
		+ ' <option value="KG" label="Kyrgyzstan">Kyrgyzstan</option>'
		+ ' <option value="LA" label="Laos">Laos</option>'
		+ '<option value="LB" label="Lebanon">Lebanon</option>'
		+ ' <option value="MO" label="Macau SAR China">Macau SAR China</option>'
		+ '  <option value="MY" label="Malaysia">Malaysia</option>'
		+ ' <option value="MV" label="Maldives">Maldives</option>'
		+ ' <option value="MN" label="Mongolia">Mongolia</option>'
		+ ' <option value="MM" label="Myanmar [Burma]">Myanmar [Burma]</option>'
		+ ' <option value="NP" label="Nepal">Nepal</option>'
		+ ' <option value="NT" label="Neutral Zone">Neutral Zone</option>'
		+ '  <option value="KP" label="North Korea">North Korea</option>'
		+ ' <option value="OM" label="Oman">Oman</option>'
		+ ' <option value="PK" label="Pakistan">Pakistan</option>'
		+ ' </select>'
		+ ' </div>'


		+ ' </div>'
		+ '  <div class="form-group">'
		+ ' <div class="form-check">'
		+ '  <input class="form-check-input" type="checkbox" id="gridCheck">'
		+ '  <label class="form-check-label" for="gridCheck">'
		+ '  As part of our commitment to protecting your privacy, this statement is designed to provide you with information regarding <a href="#">Privecy Statement.</a>'
		+ '</label>'
		+ '</div>'
		+ ' </div>'
		+ ' <button type="submit" class="btn btn-primary" id="btn" onclick=\'paymentProcess("+cost+","+subscr+")\'>Next</button>'
		+ ' </form>'
		+ ' </div>';
	var modalObj = {
		//                    title: 'Payment Process', 
		title: labelObject['Message'] != null ? labelObject['Message'] : 'User Details and Payment Details',
		body: "<div id='showUserCostForm'></div>"
	};
	var buttonArray = [
		{
			text: 'Ok',
			click: function() {
				//                           paymentProcess(cost, subscriptionType); 
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$("#showUserCostForm").html(result);
	$("#dataDxpSplitterValue").addClass("newCostForm");
	$(".modal-dialog").addClass("modal-xl");
}
function showSearchBasedResults(mainMenu, menu) {
	if (mainMenu == 'AI') {
		showTransformFeatures(mainMenu);
		$("#searchOnTypeCardM").val(menu);
		setTimeout(function() {
			searchOnKeyupList(menu);

		}, 310); // ensure the collapse animation is done
		setTimeout(function() {

			TransformFeaturesmenuList(menu);
		}, 310);
		setTimeout(function() {
			showFeaturesForm(menu, mainMenu);
		}, 310);
	} else if (mainMenu == 'AIKB') {
		showTransformFeatures(mainMenu);
		//		showFeaturesForm(menu, mainMenu);
	}

}
function showMyWorkSpaceData(worSpaceType) {
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'myWorkSpacedetails',
		cache: false,
		data: {
			workSpaceType: worSpaceType,
		},
		traditional: true,
		cache: false,
		success: function(response) {
			if (worSpaceType != null && worSpaceType != undefined && worSpaceType != "" && worSpaceType == 'FORM') {
				var modalObj = {
					title: labelObject['Message'] != null ? labelObject['Message'] : 'My Workspace Details',
					body: "<div id='showUserCostForm'></div>"
				};
				var buttonArray = [
					{
						text: 'Ok',
						click: function() {
						},
						isCloseButton: true
					}
				];
				modalObj['buttons'] = buttonArray;
				createModal("dataDxpSplitterValue", modalObj);
				$("#showUserCostForm").html(response['dictTableResult']);
				$("#dataDxpSplitterValue").addClass("newCostForm");
				$(".modal-dialog").addClass("modal-xl");
			} else {
				var traceObj = {};
				var colorObj = {};
				var chartData = {};
				var labels = {};
				var values = {};
				labels = response['labels'];
				values = response['values'];
				var data = [];
				traceObj['labels'] = labels;
				traceObj['values'] = values;
				traceObj['hole'] = 0.4;
				traceObj['type'] = 'pie';
				traceObj['name'] = 'value';
				traceObj['marker'] = colorObj;
				$.each(chartData, function(key, val) {
					traceObj[key] = val;
				});
				if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
					data.push(traceObj);
				}

				var modalObj = {
					title: labelObject['Message'] != null ? labelObject['Message'] : 'My Workspace Details',
					body: "<div id='dataDxpWorkSpace'></div>"
				};
				var buttonArray = [
					{
						text: 'Ok',
						click: function() {
						},
						isCloseButton: true
					}
				];
				modalObj['buttons'] = buttonArray;
				createModal("dataDxpSplitterValue", modalObj);
				$("#dataDxpSplitterValue").addClass("newCostForm");
				$(".modal-dialog").addClass("modal-xl");
				Plotly.newPlot("dataDxpWorkSpace", data);
			}
		}
	});
}
function showKnowledgeFeaturesForm(operation, menu) {
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'showFeaturesOnCardForm',
		cache: false,
		data: {
			operation: operation,
			menu: menu
		},
		traditional: true,
		cache: false,
		success: function(response) {
			$("#featuresMenuGraphPageList").show();
			$("#featuresMenuGraphPageList").removeClass("col-sm-8");
			$("#featuresMenuGraphPageList").addClass("col-sm-10");
			$("#featuresMenuGraphList").hide();
			$("#dsKnowledgeBaseID").html(response['dictTableResult']);
		}
	});

}
function showWorkSpaceDataAnalytics() {
	var traceObj = {};
	var colorObj = {};
	var chartData = {};
	var labels = {};
	var values = {};
	labels = ["Available Space", "User Space"];
	values = ["100", "88.5"];
	var data = [];
	traceObj['labels'] = labels;
	traceObj['values'] = values;
	traceObj['hole'] = 0.4;
	traceObj['type'] = 'pie';
	traceObj['name'] = 'value';
	traceObj['marker'] = colorObj;
	$.each(chartData, function(key, val) {
		traceObj[key] = val;
	});
	if (traceObj !== null && !jQuery.isEmptyObject(traceObj)) {
		data.push(traceObj);
	}

	var modalObj = {
		title: labelObject['Message'] != null ? labelObject['Message'] : 'My Workspace Details',
		body: "<div id='dataDxpWorkSpace'></div>"
	};
	var buttonArray = [
		{
			text: 'Ok',
			click: function() {
			},
			isCloseButton: true
		}
	];
	modalObj['buttons'] = buttonArray;
	createModal("dataDxpSplitterValue", modalObj);
	$("#dataDxpSplitterValue").addClass("newCostForm");
	$(".modal-dialog").addClass("modal-xl");
	Plotly.newPlot("dataDxpWorkSpace", data);
}
function subscriptionDetails() {
	showLoader();
	$.ajax({
		type: "POST",
		traditional: true,
		dataType: 'json',
		url: 'getPricingDetails',
		traditional: true,
		cache: false,
		data: {

		},
		success: function(response) {
			stopLoader();
			$("#pageBodyContent").html(response['result']);

		}
	});
}
function homeSideMenu() {
	$("#sidebar").toggle();
	$(".dxpPageContent").toggleClass("fluidWidth");

}
$(function() {
	$('#toggleintroID').tooltip({ title: "Toggle to disable function", trigger: "hover", delay: { hide: 800 }, placement: "top" });
})
function toggleCheck() {
	var togglediv = $('#toggle');
	var hidediv = $('#hintImageID');
	if (togglediv.is(':checked')) {
		hidediv.hide();
		$('#toggleSearchFeildDiv').removeAttr('onclick', 'searchToggleGuide()')
		$('.calenderguide').removeAttr('onclick', 'calenderGuide()')
		$('.settingGuide').removeAttr('onclick', 'settingsGuide()')
		$('.helpguide').removeAttr('onclick', '')
		$('.userMainProfile').removeAttr('onclick', 'userProfileGuide()')
		console.log("isChecked")
	} else {
		hidediv.show();
		$('#toggleSearchFeildDiv').attr('onclick', 'searchToggleGuide()')
		$('.calenderguide').attr('onclick', 'calenderGuide()')
		$('.settingGuide').attr('onclick', 'settingsGuide()')
		$('.helpguide').attr('onclick', 'helpGuide()')
		$('.userMainProfile').attr('onclick', 'userProfileGuide()')
		console.log("isNotChecked")
	}
}


function getFeedbackForm() {  

	$.ajax({
		type: "POST",
		traditional: true,
		url: 'getNIICFeedbackForm',
		cache: false,
		success: function(response) {

			if (response != null && !jQuery.isEmptyObject(response)) {

				var ratingCount = response['feedBackratingCount'];
				$(".visionLoginpageInner").show();
				var modalObj = {
					title: 'Feedback Form',
					body: response['feedBackResponse']
					//    body: mdrm
				};
				var buttonArray = [
					{
						text: 'Save',
						"class": 'dialogyes',
						click: function() {
							// Collect values from jqxRating elements
							var dataToSend = {};
							var ratingLableCnt = 0;
							for (var i = 0; i < ratingCount; i++) {
								var label = $("#jqxRating" + i).parent().find('span').text();
								var ratingValue = $("#jqxRating" + i).jqxRating("getValue");
								if (ratingValue > 0) {
									dataToSend['rating' + ratingLableCnt] = label + ":" + ratingValue;
									ratingLableCnt++;
								}

							}
							dataToSend['ratingCount'] = ratingLableCnt;
							var nameValue = $("#niicFeedbackUserId").val();
							var emailValue = $("#niicFeedbackUserEmailId").val();


							if (!nameValue) {
								$("#nameError").text("Please Provide Name.");
							}
							if (ratingLableCnt == 0) {
								$("#emailError").text("Please Provide Rating To Atleat One Product.");
							}
							var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
							if (!emailValue || !emailRegex.test(emailValue)) {
								$("#emailError").text("Please provide a valid email.");
							}
							if (!nameValue || !emailValue || !emailRegex.test(emailValue) || ratingLableCnt == 0) {
								return; // Prevent form submission
							}
							$(".visionLoginpageInner").html("");
							$(".visionLoginpageInner").hide();



							// Create a data object to send to the backend
							dataToSend['name'] = nameValue;
							dataToSend['email'] = emailValue;

							$.ajax({
								type: 'POST',
								url: 'getNIICSaveFeedbackForm',
								data:
								{
									dataToSend: JSON.stringify(dataToSend)
								},
								success: function(result) {
									// Handle the backend response here
									var modalObj = {
										title: 'Response Form',
										body: result['result']
										//    body: mdrm
									};
									var buttonArray = [
										{
											text: 'close',
											"class": 'dialogyes',
											click: function() {

											},
											isCloseButton: true
										}];
									modalObj['buttons'] = buttonArray;
									createModal("accountActivationModal", modalObj);
									$(".modal-dialog").addClass("modal-xm");
									$(".modal-body").css("height", "350");
									$(".modal-body").css("overflow-y", "auto");
									$("#Loader").css("display", "none");
									$('#chatBotIcon').attr('data-flag', 'A'); // Update flag
								},
								error: function(error) {
									// Handle the error here
									console.error("Error sending data to backend:", error);
								}
							});
						},
						isCloseButton: false
					}
				];
				modalObj['buttons'] = buttonArray;
				createModal("visionLoginpageInner", modalObj);

				for (var i = 0; i < ratingCount; i++) {
					$("#jqxRating" + i).jqxRating({
						width: 1000, height: 200, theme: 'classic', precision: 0.2, itemWidth: 100,
						itemHeight: 100
					});
				}


			}

		},
		error: function(e) {
			sessionTimeout(e);
		}


	});
}






