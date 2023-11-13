/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
//    $(".sidebar-dropdown").find(".dxpMaxMinMenuClass").on('mouseenter',function () {
//    $(".sidebar-submenu").slideUp(300);
//    var anchorTag = $(this).closest("a");
//  
//    if (anchorTag.parent().hasClass("active")) {
//      $(".sidebar-dropdown").removeClass("active");
//      anchorTag.parent().removeClass("active");
//    }
//    else {
//      $(".sidebar-dropdown").removeClass("active");
//      anchorTag.next(".sidebar-submenu").slideDown(300);
//      anchorTag.parent().addClass("active");
//    }
//  });

//    var timeOut = null;

    $(".sidebar-dropdown > a").on('click', function () {
        var $this =this;
        clearTimeout(timeOut);
//        timeOut = setTimeout(function () {
            $(".sidebar-submenu").slideUp(100);
            if ($($this).parent().hasClass("active")) {
                $(".sidebar-dropdown").removeClass("active");
                $($this).parent().removeClass("active");
            } else {
                $(".sidebar-dropdown").removeClass("active");
                $($this).next(".sidebar-submenu").slideDown(100);
                $($this).parent().addClass("active");
            }
//        }, 1000)
    });





    $(".level2dropdown >a").on('click', function () {
          var $this =this;
        clearTimeout(timeOut);
//        timeOut = setTimeout(function () {
            $(".level2submenu").slideUp(100);
            if ($($this).parent().hasClass("active")) {
                $(".level2dropdown").removeClass("active");
                $($this).parent().removeClass("active");
            } else {
                $(".level2dropdown").removeClass("active");
                $($this).next(".level2submenu").slideDown(100);
                $($this).parent().addClass("active");
            }
//        }, 1000)
    });
    $(".level3dropdown >a").on('click', function () {
         var $this =this;
        clearTimeout(timeOut);
//        timeOut = setTimeout(function () {
            $(".level3submenu").slideUp(100);
            if ($($this).parent().hasClass("active")) {
                $(".level3dropdown").removeClass("active");
                $($this).parent().removeClass("active");
            } else {
                $(".level3dropdown").removeClass("active");
                $($this).next(".level3submenu").slideDown(100);
                $($this).parent().addClass("active");
            }
//        }, 1000)
    });
    $(".level4dropdown >a").on('click', function () {
         var $this =this;
        clearTimeout(timeOut);
//        timeOut = setTimeout(function () {
            $(".level4submenu").slideUp(100);
            if ($($this).parent().hasClass("active")) {
                $(".level4dropdown").removeClass("active");
                $($this).parent().removeClass("active");
            } else {
                $(".level4dropdown").removeClass("active");
                $($this).next(".level4submenu").slideDown(100);
                $($this).parent().addClass("active");
            }
//        }, 1000)
    });


//   $('.photos div').on('mouseenter mouseleave',function () {

//     $(this).find('img.nocolor').togglefade('slow');
// });

//  $(".level2dropdown").find(".dxpMaxMinSecondClass").on('mouseenter',function () {
//    $(".level2submenu").slideUp(300);
//    var anchorTag = $(this).closest("a");
//    if (anchorTag.parent().hasClass("active")) {
//      $(".level2dropdown").removeClass("active");
//      anchorTag.parent().removeClass("active");
//    }
//    else {
//      $(".level2dropdown").removeClass("active");
//      anchorTag.next(".level2submenu").slideDown(300);
//      anchorTag.parent().addClass("active");
//    }
//  });

    $(".level3dropdown").find(".dxpMaxMinThirdClass").on('click', function () {
           var $this =this;
        clearTimeout(timeOut);
//        timeOut = setTimeout(function () {
            $(".level3submenu").slideUp(100);
            var anchorTag = $($this).closest("a");
            if (anchorTag.parent().hasClass("active")) {
                $(".level3dropdown").removeClass("active");
                anchorTag.parent().removeClass("active");
            } else {
                $(".level3dropdown").removeClass("active");
                anchorTag.next(".level3submenu").slideDown(100);
                anchorTag.parent().addClass("active");
            }
//        }, 1000)
    });
    
    $('#sidebar').on('mouseenter mouseleave', function () {

            $('#sidebar').toggleClass('toggled');
            $('.menuTitle').toggleClass("titleactive");
            // $(".sidebarTitle").toggle();

    });

});



/* Theme Change Javascript Starts Here by Santhosh */
function changeTheme(event) {
    let userLogin = localStorage['userName'];
    var element = $('body');
    element.toggleClass("dark-mode");
    var sourceSrcButton = $('.themeModeClickButton').attr('src');
    if ($(element).hasClass('dark-mode')) {
        localStorage.setItem("localValue", userLogin);
        $('.themeModeClickButton').attr('src', sourceSrcButton.replace("images", "darkimages"));
        $('.themeModeClickButton').attr('title', "Dark Mode");
        $('.themeModeDark').each(function () {
            $(this).attr('src', $(this).attr('src').replace(/images/i, "darkimages"));
        });
        $('.visualDarkMode').each(function () {
            $(this).attr('src', $(this).attr('src').replace(/images/i, "darkimages")); 
        });
    } else {
        localStorage.setItem("localValue", "");
        $('.themeModeClickButton').attr('src', sourceSrcButton.replace("darkimages", "images"));
        $('.themeModeClickButton').attr('title', "Light Mode");
        $('.themeModeDark').each(function () {
            $(this).attr('src', $(this).attr('src').replace(/darkimages/i, "images"));
        });
        $('.visualDarkMode').each(function () {
            $(this).attr('src', $(this).attr('src').replace(/darkimages/i, "images"));
        });
    }
}

/* Theme Change Javascript Ends Here by Santhosh */
$(window).load(function () {
    let userLogin = localStorage['userName'].toLowerCase();
    let localValue = localStorage['localValue'].toLowerCase();
    var current = new Date(); 
    var currentTime = current.getHours();
     var sourceSrcButton = $('.themeModeClickButton').attr('src');
    if ((userLogin === localValue) || (currentTime >= 18 || currentTime <= 6)) { 
        let element = $('body');
        element.addClass("dark-mode");
        let sourceSrcButton = $('.themeModeClickButton').attr('src');
        if ($(element).hasClass('dark-mode')) {
            $('.themeModeClickButton').attr('src', sourceSrcButton.replace("images", "darkimages"));
            $('.themeModeClickButton').attr('title', "Dark Mode");
            $('.themeModeDark').each(function () {
                $(this).attr('src', $(this).attr('src').replace(/images/i, "darkimages"));
            });
            $('.visualDarkMode').each(function () {
                $(this).attr('src', $(this).attr('src').replace(/images/i, "darkimages"));
            });
        }
    } else {
        $('.themeModeClickButton').attr('src', sourceSrcButton.replace("darkimages", "images"));
        $('.themeModeClickButton').attr('title', "Light Mode");
        $('.themeModeDark').each(function () {
            $(this).attr('src', $(this).attr('src').replace(/darkimages/i, "images"));
        });
        $('.visualDarkMode').each(function () {
            $(this).attr('src', $(this).attr('src').replace(/darkimages/i, "images"));
        });
    }

});








/* Visualization  Change theme Images Starts Here by Santhosh */
function changeThemeVisualization() {
    var element = $('body');
    if ($(element).hasClass('dark-mode')) {
        $('.themeModeDark').each(function () {
            var a = $(this).attr('src');
            if (a.includes("dark")){
                console.log("Already Has Dark Class");
            }
            else{
                $(this).attr('src', $(this).attr('src').replace(/images/i, "darkimages"));
            }
        });
    } 
}



$( document ).ready(function() {
    $('.dxpPageContent').scroll(function() {
                $("#top_arrow").show();
                $("#bottom_arrow").hide();
                var scroll = $('.dxpPageContent').scrollTop();
                console.log(scroll);
                if (scroll <= 0) {
                        $("#top_arrow").hide();
                        $("#bottom_arrow").show();
                } else {
                        $("#top_arrow").show(); 
                        $("#bottom_arrow").hide(); 
                }
        });
});





function scrollToBottom() {
        var heightscroll = $(document).height();
        $('.dxpPageContent').animate({ scrollTop: heightscroll }, 1200);
}

function scrollToTop() {
        $('.dxpPageContent').animate({ scrollTop: 0 }, 600); 
        $("#top_arrow").hide();
        $("#bottom_arrow").show();
}

/* Theme Change Javascript Ends Here by Santhosh */ 

function openSettingPannel(clickedIcon) {
	var clickedTitle = "";
	$('#settingsIcon').val('');
	$("#settingPannel").width(300);
	if (clickedIcon === 'settingdiv') {
		var clickedTitle = "Settings";
		$('#settingContentDiv').show();
		$('#helpContentDiv').hide();
		$('#userContentDiv').hide();
		$('#calendarContentDiv').hide();
		$("#settingPannel").addClass("settingPannelPopPannel");
		$("#settingPannel").removeClass("HelpPannelPopPannel");
		$("#settingPannel").addClass("userLoginPannelPopPannel");
		$('#clickedTitle').html(clickedTitle);
		$('#settingsIcon').html("<img src='images/settingsWhiteSet.png' width='20px' class='themeModeDark'/>");
		console.log("Setting Pannel");
	}
	else if (clickedIcon == 'helpdiv') {
		var clickedTitle = "Help";
		$('#settingContentDiv').hide();
		$('#helpContentDiv').show();
		$('#userContentDiv').hide();
		$('#calendarContentDiv').hide();
		$("#settingPannel").addClass("helpPannelPopPannel");
		$("#settingPannel").removeClass("settingPannelPopPannel");
		$("#settingPannel").removeClass("userLoginPannelPopPannel");
		$('#clickedTitle').html(clickedTitle);
		$('#settingsIcon').html("<img src='images/helpWhiteSet.png' width='20px' class='themeModeDark'/>");
		console.log("Help Pannel");
		// $("#settingPannel").width(300);
	}
	else if (clickedIcon == 'useraccdiv') {
		let userLogin = localStorage['userName'];   
		$('#settingContentDiv').hide();
		$('#helpContentDiv').hide();
		$('#userContentDiv').show();
		$('#calendarContentDiv').hide();
		$("#settingPannel").addClass("userLoginPannelPopPannel");
		$("#settingPannel").removeClass("helpPannelPopPannel");
		$("#settingPannel").removeClass("settingPannelPopPannel");
		$('#clickedTitle').html(userLogin);
		console.log("userAccountDetails");
		$('#settingsIcon').html("<img src='images/userWhiteSet.png' width='20px' class='themeModeDark'/>");
		// $("#settingPannel").width(300);
	}
	else if (clickedIcon == 'calendardiv') {
		var clickedTitle = "Calender";
		$('#settingContentDiv').hide();
		$('#helpContentDiv').hide();
		$('#userContentDiv').hide();
		$('#calendarContentDiv').show();
		 $("#settingPannel").width(330); 
		 $('#clickedTitle').html(clickedTitle); 
		 $('#settingsIcon').html("<img src='images/calendarWhiteSet.png' width='20px' class='themeModeDark'/>");
		showCustomScheduledCalendar();  
//   showEvents(selectFullDate);
		setTimeout(function() {
//			showCustomScheduledCalendar(); 
			showEvents();
						}, 210);	
		  
	}
}
function closesettingPannel() {
	$("#settingPannel").width(0);
}
function applyTheme(getThemename) {
	var getTargetThemeName = getThemename;
	if (getTargetThemeName == "defaultColor") {
		$('body').addClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "primaryColor") {
		$('body').addClass("primaryColor");
		$('body').removeClass("defaultColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "secondaryColor") {
		$('body').addClass("secondaryColor");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "basicColor") {
		$('body').addClass("basicColor");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "darkedColor") {
		$('body').addClass("darkedColor");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "lightDarkColor") {
		$('body').addClass("lightDarkColor");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "defaultHomeTheme") {
		$('body').addClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "primaryHomeTheme") {
		$('body').addClass("primaryHomeTheme");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "secondaryHomeTheme") {
		$('body').addClass("secondaryHomeTheme");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "basicHomeTheme") {
		$('body').addClass("basicHomeTheme");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
	}
	else if (getTargetThemeName == "moreHomeThemeOne") {
		$('body').addClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeTwo") {
		$('body').addClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeThree") {
		$('body').addClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeFour") {
		$('body').addClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeFive") {
		$('body').addClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeSix") {
		$('body').addClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeSeveen") {
		$('body').addClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeEight") {
		$('body').addClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeNine") {
		$('body').addClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeTen") {
		$('body').addClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeEleven") {
		$('body').addClass("moreHomeThemeEleven");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeTwelve");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
	else if (getTargetThemeName == "moreHomeThemeTwelve") {
		$('body').addClass("moreHomeThemeTwelve");
		$('body').removeClass("moreHomeThemeOne");
		$('body').removeClass("moreHomeThemeTwo");
		$('body').removeClass("moreHomeThemeThree");
		$('body').removeClass("moreHomeThemeFour");
		$('body').removeClass("moreHomeThemeFive");
		$('body').removeClass("moreHomeThemeSix");
		$('body').removeClass("moreHomeThemeSeveen");
		$('body').removeClass("moreHomeThemeEight");
		$('body').removeClass("moreHomeThemeNine");
		$('body').removeClass("moreHomeThemeTen");
		$('body').removeClass("moreHomeThemeEleven");
		$('body').removeClass("defaultHomeTheme");
		$('body').removeClass("primaryHomeTheme");
		$('body').removeClass("secondaryHomeTheme");
		$('body').removeClass("basicHomeTheme");
		$('body').removeClass("defaultColor");
		$('body').removeClass("primaryColor");
		$('body').removeClass("secondaryColor");
		$('body').removeClass("basicColor");
		$('body').removeClass("darkedColor");
		$('body').removeClass("lightDarkColor");
	}
}
$(document).ready(function() {
	$(".moreThemesShowDiv").click(function() { 
		$(".moreThemes").show();
		$(".moreThemesShowDiv").hide();
		$(".moreThemesHideDiv").show();
	});
	$(".moreThemesHideDiv").click(function() {
		$(".moreThemes").hide();
		$(".moreThemesHideDiv").hide();
		$(".moreThemesShowDiv").show();
	});
});