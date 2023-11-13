<%-- 
    Document   : Home
    Created on : Dec 17, 2020, 5:53:37 PM
    Author     : Devint01
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="sec"
	uri="http://www.springframework.org/security/tags"%>
<!DOCTYPE html>
<html>
<head>
<c:choose>
	<c:when test="${not empty sessionScope.ssUsername}">
		<%--<%@include file="loginHeader.jsp" %>--%>
		<%@include file="commonfiles.jsp"%>
	</c:when>
	<c:otherwise>
		<%@ include file="beforeLoginFiles.jsp"%>
	</c:otherwise>
</c:choose>
<link rel="stylesheet"
	href="https://js.arcgis.com/4.24/esri/themes/light/main.css" />
<link rel="stylesheet" href="./chatbot-ui.css">
<script src="https://js.arcgis.com/4.24/"></script>
<title>Integral Data Analytics | Integral</title>
<link rel="icon" href="images/intellifavicon.svg">
<meta name="description"
	content="PiLog Cloud Platform is a self-service solution for all Data & Analytics services, 
              It provides process-driven and methodology-based lean data harmonization, governance & Analytics for 
              multiple domains, a cloud-based application, providing Master data as a service, saas, business value, 
              learning, and consulting services.">
<style>
/* .carousel-inner img {
	width: 100%;
	height: 80vh;
} */

.head1 {
	font-size: 40px;
	color: #009900;
	font-weight: bold;
}

.head2 {
	font-size: 17px;
	margin-left: 10px;
	margin-bottom: 15px;
}

body {
	margin: 0 auto;
	background-position: center;
	background-size: contain;
}

.menu {
	position: sticky;
	top: 0;
	background-color: #009900;
	padding: 10px 0px 10px 0px;
	color: white;
	margin: 0 auto;
	overflow: hidden;
}

.menu a {
	float: left;
	color: white;
	text-align: center;
	padding: 14px 16px;
	text-decoration: none;
	font-size: 20px;
}

.menu-log {
	right: auto;
	float: right;
}

/* footer {
	width: 100%;
	bottom: 0px;
	background-color: #000;
	color: #fff;
	position: absolute;
	padding-top: 20px;
	padding-bottom: 50px;
	text-align: center;
	font-size: 30px;
	font-weight: bold;
} */

.body_sec {
	margin-left: 20px;
}
</style>
</head>
<body>

	<c:choose>
		<c:when test="${not empty sessionScope.ssUsername}">
			<%@include file="loginHeader.jsp"%>
		</c:when>
		<c:otherwise>
			<%@include file="header.jsp"%>
		</c:otherwise>
	</c:choose>
	<div class="dxpPageWrapper dxpTheme d-flex align-items-stretch toggled">
		<c:choose>
			<c:when test="${not empty sessionScope.ssUsername}">
				<%@include file="sideMenu.jsp"%>
			</c:when>
			<c:otherwise>
			</c:otherwise>
		</c:choose>

		<div class="dxpPageContent">
			<div class="page-body" id="pageBody">
				<div class="page-body-content" id="pageBodyContent"></div>
				<div id="Loader" style="display: none;">
					<div class="loadermain">
						<div class="loader-ring">
							<img src="images/Loader.gif" class="themeModeDark loaderWait">
						</div>
					</div>
				</div>
				<div class="hintImage" id="hintImageID" style='display: none;'></div>
			</div>
			<div class='scrollToTop' onclick='scrollToTop();'>
				<img src="images/top_arrow_icon.svg" width='20px' id='top_arrow'
					style='display: none;' />
			</div>
			<div class='scrollToBottom' onclick=' scrollToBottom();'>
				<img src="images/bottom_arrow_icon.svg" class='scrollToBottom'
					width='20px' id='bottom_arrow' style='display: none;' />
			</div>

			<div id="settingPannel" class="settingPannel">
				<div class="pannelTitle">
					<span class='settingsIcon' id='settingsIcon'></span> <span
						class='spanTitle' id="clickedTitle">Settings</span> <span
						class='spanCloseIcon' onclick="closesettingPannel()">×</span>
				</div>
				<div class="settingPannelInnerWrapper">
					<div class='listofSettingDiv' id='settingContentDiv'
						style='display: none;'>
						<ul>
							<li class="fontChangeIcon dropdown"><a
								class="dropdown-toggle" href="#" data-toggle="dropdown"> <span
									class='listImage'><img src="images/font.png"
										style='width: 20px;' title="Font Type"
										class="fontChangeButton themeModeDark" /> </span> <span
									class='mobileTitle'>Font Type</span>
							</a>
								<ul class="dropdown-menu">
									<li><a class='dropdown-toggle' data-toggle="dropdown"
										href="#"> Menu</a>
										<ul class="submenu dropdown-menu">
											<li><a tabindex="-1" href="#" id="upperCaseMenu"
												onclick="showViewFont('Menu','UpperCase')">UpperCase</a></li>
											<li><a tabindex="-1" href="#" id="LowerCaseMenu"
												onclick="showViewFont('Menu','LowerCase')">LowerCase</a></li>
											<li><a tabindex="-1" href="#" id="capitaliseFontMenu"
												onclick="showViewFont('Menu','Refresh')">Refresh</a></li>

										</ul></li>
									<li><a class='dropdown-toggle' data-toggle="dropdown"
										href="#">Description </a>
										<ul class="submenu dropdown-menu">
											<li><a tabindex="-1" href="#" id="upperCaseDes"
												onclick="showViewFont('Description','UpperCase')">UpperCase</a></li>
											<li><a tabindex="-1" href="#" id="LowerCaseDes"
												onclick="showViewFont('Description','LowerCase')">LowerCase</a></li>
											<li><a tabindex="-1" href="#" id="capitaliseFontDes"
												onclick="showViewFont('Description','Refresh')">Refresh</a></li>

										</ul></li>
									<li><a class='dropdown-toggle' data-toggle="dropdown"
										href="#">Content</a>
										<ul class="submenu dropdown-menu">
											<li><a tabindex="-1" href="#" id="upperCaseContent"
												onclick="showViewFont('Content','UpperCase')">UpperCase</a></li>
											<li><a tabindex="-1" href="#" id="LowerCaseContent"
												onclick="showViewFont('Content','LowerCase')">LowerCase</a></li>
											<li><a tabindex="-1" href="#" id="capitaliseFontContent"
												onclick="showViewFont('Content','Refresh')">Refresh</a></li>
										</ul></li>
								</ul></li>

							<li class="fontSizeIcon dropdown"><a class="dropdown-toggle"
								href="#" data-toggle="dropdown"> <span class='listImage'>
										<img src="images/font-size.png" style='width: 20px;'
										title="Font Size" class="fontSizeChangeButton themeModeDark" />
								</span> <span class='mobileTitle'>Font Size</span>
							</a>
								<ul class="dropdown-menu">
									<li><a class='dropdown-toggle' data-toggle="dropdown"
										href="#"> Menu</a>
										<ul class="submenu dropdown-menu">
											<li><a class="dropdown-item"
												onclick="menuFontSizeData('Menu','Smaller')"
												event.preventDefault(); href="#">Smaller</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="menuFontSizeData('Menu','Medium')">Medium</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="menuFontSizeData('Menu','Large')">Large</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="menuFontSizeData('Menu','Reset')">Reset</a></li>
										</ul></li>
									<li><a class='dropdown-toggle' data-toggle="dropdown"
										href="#"> Content </a>
										<ul class="submenu dropdown-menu">
											<li><a class="dropdown-item" href="#"
												onclick="contentFontSizeData('Content','Smaller')">Smaller</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="contentFontSizeData('Content','Medium')">Medium</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="contentFontSizeData('Content','Large')">Large</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="contentFontSizeData('Content','Reset')">Reset</a></li>
										</ul></li>
									<li><a class='dropdown-toggle' data-toggle="dropdown"
										href="#"> Description </a>
										<ul class="submenu dropdown-menu">
											<li><a class="dropdown-item" href="#"
												onclick="descriptionFontSize('Description','Smaller')">Smaller</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="descriptionFontSize('Description','Medium')">Medium</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="descriptionFontSize('Description','Large')">Large</a></li>
											<li><a class="dropdown-item" href="#"
												onclick="descriptionFontSize('Description','Reset')">Reset</a></li>

										</ul></li>
								</ul></li>
							<li class="themeChangeIcon" onclick="changeTheme()"><a
								class="" href="#"> <span class='listImage'> <img
										src="images/lightmode.png" title="Light Mode"
										class="themeModeClickButton" width="20px">
								</span> <span class="mobileTitle">Dark Mode</span>
							</a></li>

							<li class='extendedViewIcon'
								onclick="javascript:toggleFullScreen()"><a href="#!"
								class="waves-effect waves-light"> <span class='listImage'>
										<img src="images/extendedview.png" class="themeModeDark"
										width="20px" id='IntelliSenseFs' title='View full screen'>
								</span> <span class="mobileTitle">View Full Screen</span>
							</a></li>

							<li class="languageChangeIcon" onclick="changeLanguage()"><a
								class="" href="#"> <span class='listImage'> <img
										src="images/languageSet.png" title="Light Mode"
										class="themeModeClickButton themeModeDark" width="20px">
								</span> <span class="mobileTitle">Language</span>
							</a></li>

							<li class="organizationIcon"><a class="" href="#"> <span
									class='listImage'> <img
										src="images/Organization_Vision_Icon.svg" title="DXP"
										class="profile-img themeModeDark" width="20px">
								</span> <span class="mobileTitle">Organization</span>
							</a></li>
							<li class="feedbackIcon"><a href="#"
								onclick="navigationMenuUrl"> <span class='listImage'>
										<img src="images/FeedBack_Icon.svg" title="Feedback"
										class="headerFeedback themeModeDark" width="20px">
								</span> <span class="mobileTitle">Feedback</span>
							</a></li>


							<li class="ThemesIcon"><a class="" href="#"> <span
									class='listImage'> <img src="images/Themes.png"
										title="Themes" class="profile-img themeModeDark" width="20px">
								</span> <span class="mobileTitle">Themes</span>
							</a>
								<div class="innerThemes">
									<ul>
										<li onclick="applyTheme('defaultColor')">
											<div class="lightthemeColor defaultColor"></div> <span
											class="defaultColorSpan">Default</span>
										</li>
										<li onclick="applyTheme('primaryColor')">
											<div class="darkthemeColor primaryColor"></div> <span
											class="defaultColorSpan">Primary</span>
										</li>
										<li onclick="applyTheme('secondaryColor')">
											<div class="lightthemeColor secondaryColor"></div> <span
											class="defaultColorSpan">Secondary</span>
										</li>
										<li onclick="applyTheme('basicColor')">
											<div class="darkthemeColor basicColor"></div> <span
											class="defaultColorSpan">Basic</span>
										</li>
										<li onclick="applyTheme('darkedColor')">
											<div class="darkthemeColor darkedColor"></div> <span
											class="defaultColorSpan">Dark</span>
										</li>
										<li onclick="applyTheme('lightDarkColor')">
											<div class="darkthemeColor lightDarkColor"></div> <span
											class="defaultColorSpan">lightDark</span>
										</li>
									</ul>
									<ul>
										<li onclick="applyTheme('defaultHomeTheme')"><img
											src="images/home_theme1.png"
											class="lightthemeColors defaulttheme"></li>
										<li onclick="applyTheme('primaryHomeTheme')"><img
											src="images/home_theme2.jpg"
											class="lightthemeColors primarytheme"></li>
										<li onclick="applyTheme('secondaryHomeTheme')"><img
											src="images/home_theme3.jpg"
											class="lightthemeColors secondarytheme"></li>
										<li onclick="applyTheme('basicHomeTheme')"><img
											src="images/home_theme4.jpg"
											class="lightthemeColors basictheme"></li>
									</ul>
								</div>
								<div class="moreThemesShowDiv">More Themes</div>

								<div class="moreThemes" style="display: none">
									<ul>
										<li onclick="applyTheme('moreHomeThemeOne')"><img
											src="images/themebg_1.jpg"
											class="lightthemeColors moreThemeOne"></li>
										<li onclick="applyTheme('moreHomeThemeTwo')"><img
											src="images/themebg_2.jpg"
											class="lightthemeColors moreThemeTwo"></li>
										<li onclick="applyTheme('moreHomeThemeThree')"><img
											src="images/themebg_3.jpg"
											class="lightthemeColors moreThemeThree"></li>
										<li onclick="applyTheme('moreHomeThemeFour')"><img
											src="images/themebg_4.jpg"
											class="lightthemeColors moreThemeFour"></li>
										<li onclick="applyTheme('moreHomeThemeFive')"><img
											src="images/themebg_5.jpg"
											class="lightthemeColors moreThemeFive"></li>
										<li onclick="applyTheme('moreHomeThemeSix')"><img
											src="images/themebg_6.jpg"
											class="lightthemeColors moreThemeSix"></li>
									</ul>
									<ul>
										<li onclick="applyTheme('moreHomeThemeSeveen')"><img
											src="images/themebg_7.jpg"
											class="lightthemeColors moreThemeSeveen"></li>
										<li onclick="applyTheme('moreHomeThemeEight')"><img
											src="images/themebg_8.jpg"
											class="lightthemeColors moreThemeEight"></li>
										<li onclick="applyTheme('moreHomeThemeNine')"><img
											src="images/themebg_9.png"
											class="lightthemeColors moreThemeNine"></li>
										<li onclick="applyTheme('moreHomeThemeTen')"><img
											src="images/themebg_10.jpg"
											class="lightthemeColors moreThemeTen"></li>
										<li onclick="applyTheme('moreHomeThemeEleven')"><img
											src="images/themebg_11.jpg"
											class="lightthemeColors moreThemeNine"></li>
										<li onclick="applyTheme('moreHomeThemeTwelve')"><img
											src="images/themebg_12.jpg"
											class="lightthemeColors moreThemeTen"></li>
									</ul>
								</div>

								<div class="moreThemesHideDiv" style="display: none;">Hide
									Themes</div></li>

							<li class="contactPreferencesIcon"><a class="" href="#">
									<span class='listImage'> <img src="images/SignUp.png"
										title="Contact Preferences" class="profile-img themeModeDark"
										width="20px">
								</span> <span class="mobileTitle">Contact Preferences</span>
							</a></li>
							<li class="RegisterIcon"><a class="" href="#" onclick="showRegisterForm()"> <span
									class='listImage'> <img src="images/SignUp.png"
										title="Other" class="profile-img themeModeDark" width="20px">
								</span> <span class="mobileTitle">Register</span>
							</a></li>
							<li class="passworIcon"><a class="" href="#"> <span
									class='listImage'> <img src="images/passwordSet.png"
										title="Password" class="profile-img themeModeDark"
										width="20px">
								</span> <span class="mobileTitle">Password</span>
							</a></li>
							<li class="aboutUsIcon"><a class="" href="#"> <span
									class='listImage'> <img src="images/AboutUsSet.png"
										title="About Us" class="profile-img themeModeDark"
										width="20px">
								</span> <span class="mobileTitle">About Us</span>
							</a></li>
							<li class="OtherIcon"><a class="" href="#"> <span
									class='listImage'> <img src="images/search_blue1.png"
										title="Other" class="profile-img themeModeDark" width="20px">
								</span> <span class="mobileTitle">Other</span>
							</a></li>
						</ul>
					</div>
					<div class='listofSettingDiv' id='helpContentDiv'
						style='display: none;'>
						<ul>
							<li><a class="" href="#"> <span class='listImage'>
										<img src="images/ChatIcon.png" title="Mycart"
										class="headerShoppingCart themeModeDark" width="20px">
								</span> <span class="mobileTitle">Chat</span>
							</a></li>
							<li><a class="" href="#"> <span class='listImage'>
										<img src="images/SearchHelp.png" title="Help Document"
										class="headerShoppingCart themeModeDark" width="20px">
								</span> <span class="mobileTitle">Help Document</span>
							</a></li>
							<li><a class="" target="_blank" href="https://youtu.be/QeAJRZrFPUc"> <span class='listImage'>
										<img src="images/SearchVideoPlay.png" title="Help Video"
										class="headerShoppingCart themeModeDark" width="20px">
								</span> <span class="mobileTitle">Help Video</span>
							</a></li>
							<li><a class="" href="#"> <span class='listImage'>
										<img src="images/SearchGif.png" title="Help Gif"
										class="headerShoppingCart themeModeDark" width="20px">
								</span> <span class="mobileTitle">Help Gif</span>
							</a></li>
						</ul>
					</div>

					<div class='listofSettingDiv' id='calendarContentDiv'
						style='display: none;'>
						<div class="scheduledCalendarMainWrapper">
							<div class="content-wrapper grey lighten-3">
								<div class="container calendarMainClass">
									<div class="calendar-wrapper z-depth-2">
										<div class="calendar-header">
											<div class="row header-title header-text">
												<div class="col-md-6">
													<h3 id="month-name"></h3>
												</div>
												<div class="col-md-6">
													<div class="currentdate">
														<h5 id="todayDayName">Today</h5>
														<a class="prev-button" id="prev"> <i
															class="fa fa-chevron-left" aria-hidden="true"></i>
														</a> <a class="next-button" id="next"> <i
															class="fa fa-chevron-right" aria-hidden="true"></i>
														</a>
													</div>
												</div>
											</div>
										</div>


										<div class="calendar-content">
											<div id="calendar-table" class="calendar-cells">
												<div id="table-header">
													<div class="row">
														<div class="col-1 colDays">M</div>
														<div class="col-1 colDays">T</div>
														<div class="col-1 colDays">W</div>
														<div class="col-1 colDays">T</div>
														<div class="col-1 colDays">F</div>
														<div class="col-1 colDays">S</div>
														<div class="col-1 colDays">S</div>
													</div>
													<hr />
												</div>

												<div id="table-body"></div>

											</div>
										</div>
										<div class="sidebar-wrapper z-depth-2 side-nav fixed"
											id="sidebar">

											<div class="sidebar-title">
												<h5 id="eventDayName">Date</h5>
												<h5 class="newEventName" onclick="addNewDateWiseEvent()">
													Add new event <span class="newEventSpan"> <img
														src="images/calendarevent.png" class="newEventImage"
														width="20px">
													</span>
												</h5>
											</div>
											<div class="sidebar-events" id="sidebarEvents">
												<div class="empty-message">Currently, no events to
													selected date</div>
											</div>
										</div>

										<!-- 										<div class="calendar-footer"> -->
										<!-- 											<div class="emptyForm" id="emptyForm"> -->
										<!-- 												<h4 id="emptyFormTitle">No events now</h4> -->
										<!-- <!-- 												<a class="addEvent" id="changeFormButton">Add new</a> -->
										<!-- 											</div> -->

										<!-- 										</div> -->

									</div>

								</div>

							</div>
						</div>
					</div>
					<div class='listofSettingDiv' id='userContentDiv'
						style='display: none;'>
						<ul>
							<li class="shoppingIcon"><a href="<c:url value="/"/>myCart">
									<span class='listImage'> <img
										src="images/shopping-Cart-Icon.svg" title="Mycart"
										class="headerShoppingCart themeModeDark" width="20px">
								</span> <span class="mobileTitle">My Cart</span>
							</a></li>
							<li><a href="#" onclick="showMySubscriptionsData()"> <span
									class='listImage'> <img src="images/subscription.png"
										alt="" style='width: 20px;'>
								</span> <span class="subscription mobileTitle">My Subscriptions</span>
							</a></li>
							<li><a href="#" onclick="showMyTransactionsData()"> <span
									class='listImage'> <img src="images/transaction.png"
										alt="" style='width: 20px;'>
								</span> <span class="transaction mobileTitle">My Transactions</span></a></li>
							<li><a href="#" onclick="showMyWalletsData()"> <span
									class='listImage'> <img src="images/wallet.png" alt=""
										style='width: 20px;'></span> <span class="wallet mobileTitle">My
										Wallet</span></a></li>
							<li><a href="#" onclick="showMyWorkSpaceData('FORM')"><span
									class='listImage'> <img src="images/workspace.png"
										alt="" style='width: 20px;'></span><span
									class="workSpace mobileTitle">My Workspace</span></a></li>
							<li><a href="#" onclick="showMyWorkSpaceData('CHART')"><span
									class='listImage'> <img
										src="images/analyticsShowCard.png" alt="" style='width: 20px;'></span><span
									class="analytics mobileTitle">Workspace Analytics</span></a></li>
							<li class="logoutIcon openbtn" onclick="openNav()" title="Logout"
								data-toggle="modal" data-target="#signOut"><a class=""
								href="#"> <span class='listImage'> <img
										src="images/LogOut_Icon.svg" class="profile-img themeModeDark"
										width="20px"></span> <span class="mobileTitle">Log Out</span>
							</a></li>
						</ul>
					</div>

				</div>

			</div>
		</div>

	</div>
	<!-- DXP New Theme Body Layout -->
	<c:choose>
		<c:when test="${not empty sessionScope.ssUsername}">
			<%@include file="footer.jsp"%>
		</c:when>
		<c:otherwise>
		</c:otherwise>
	</c:choose>

	<div class="dataDxpSplitterValue" id="dataDxpSplitterValue"></div>
	<div class="dataDxpSplitterValueNew" id="dataDxpSplitterValueNew"></div>
	<div class="visionTempleteHoverImage" id="visionTempleteHoverImage"></div>
	<div class="" id="cardImageImportDiv">
		<input type="file" name="importCardImage" id="importCardImage"
			style="display: none;">
	</div>
	<input type="hidden" name="rsUserName" id="rsUserName"
		value="${ssUserName}" />
	<input type="hidden" name="chartType" id="chartType" value="" />
	<input type="hidden" name="currentTypedValue" id="currentTypedValue"
		value="" />
	<input type="hidden" name="showCaseCardType" id="showCaseCardType"
		value="" />
	<input type="hidden" name="compareType" id="compareType" value="" />
	<input type="hidden" name="currentSocialMediaFlag"
		id="currentSocialMediaFlag" value="" />
	<input type="hidden" name="districtSearchListBox"
		id="districtSearchListBox" value="" />
	<input type="hidden" name="constituencySearchListBox"
		id="constituencySearchListBox" value="" />
	<input type="hidden" name="candidateSearchListBox"
		id="candidateSearchListBox" value="" />
	<input type="hidden" name="partySearchListBox" id="partySearchListBox"
		value="" />
	<input type="hidden" name="isCurrencyConversionEvent"
		id="isCurrencyConversionEvent" value="" />
	<form action="" id="navigationUrlForm" method="POST">
		<c:if test="true">
			<input type="hidden" name="${_csrf.parameterName}"
				value="${_csrf.token}" />
		</c:if>
	</form>
	<div id="removeDup" class="removeDup"></div>
	<div id="deleteDup" class="deleteDup"></div>
	<div id="columnMappingDialog" class="columnMappingDialog"></div>
	<div id="dialog1"></div>
	<div id= "dataDxpSplitterValue" class="dataDxpSplitterValue"></div>
	<div id="pivotGridDialog">
		<div id='output' style='margin: 30px;'></div>
	</div>
	<div id="jqxpivotGridDialog" style="display: none">
		<table>
			<tr>
				<td>
					<div id="divPivotGridDesigner" style="height: 400px; width: 250px;">
					</div>
				</td>
				<td>
					<div id="divPivotGrid" style="height: 400px; width: 550px;"></div>
				</td>
			</tr>
		</table>
	</div>
	<div class="mainchatcontainer">
		<div class="chatIcon">
			<img src="images/ChatIcon.png" data-flag="I" id="chatBotIcon"
				onclick="chatApplication();" style='width: 50px; cursor: pointer;'>
		</div>

		<div id="chat" class="chatBox chatBoxLargeSpaced">
			<div class="container mainHeader">
				<div class="row  chatBotHeaderTop">
					<div class="col-12 leftBotIcon">
						<span><img src="images/customer-service.png"> </span>
						<div class="chatbotMetaHeader">
							<span>
								<p>Hello...</p>
							</span>
							<p>Welcome to Smart BI one stop solution for all your Data &
								Analytical problems</p>
						</div>
					</div>

					<div class="rightIcons">
						<span class="minmaxIcon" onclick="minimizeChatBot();"><img
							src="images/minimize.png" id="maxminIcon" title="minimize"></span>
						<span class="chatbotClose" onclick="closeChatBot();"><img
							src="images/closeIcon.png" title="close"></span>
					</div>

				</div>
			</div>
		</div>
	</div>

	<div class="mainConversationalAIcontainer" style='display:none'>
		<div class="conversationalAIIcon">
			<img src="images/image_2023_03_27T10_09_03_182Z.png" data-flag="I" id="chatBotIcon"
				onclick="showIntelliSenseAutoSuggestions('visionChartsAutoSuggestionUserId');" style='width: 70px; cursor: pointer;'>
		</div>
	</div>
	<script src="<c:url value="/"/>js/customSchedulCalendar.js"></script>
	<script>
		$(document)
				.ready(
						function() {
							var rsUserName = $("#rsUserName").val();
							if (rsUserName != null && rsUserName != ''
									&& rsUserName != 'null'
									&& rsUserName != undefined) {
								showLoader();
								//getHomePageSelectBoxResults("CHARTS");
								//                     socialMedialShowCaseCards();
								getLocationDetails();
								getHomePageSelectBoxResults("CHARTS");
								
								$("#intellisenseHomeSelectBox").show();
								$('#chatBotIcon').attr('data-flag', 'A');
								stopLoader();
								$(".sidebar-dropdown").hide();

							} else {
								$(".sidebar-dropdown").hide();
								$(".isPoliticalSceince").hide();
								//                    var homePageCarousel = $("#homePageCarousel").val();
								//                    $("#pageBodyContent").html(homePageCarousel);
							}
							var searchCandidate = '${searchCandidate}';
							if (searchCandidate != null
									&& searchCandidate != ''
									&& searchCandidate != 'null') {
								getProfileUserNames(searchCandidate);
							} else {
								$('#mainintelliSenseSelectBoxId').hide();
							}

							$('.dropdown-submenu a.test').on("click",
									function(e) {
										$(this).next('ul').toggle();
										e.stopPropagation();
										e.preventDefault();
									});
							sessionStorage.clear();
						});
	</script>
</body>
</html>

