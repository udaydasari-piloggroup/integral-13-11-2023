<%-- 
    Document   : footer
    Created on : 19 Nov, 2021, 1:58:23 PM
    Author     : Onkar
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<div class="footer">
    <div class="container">
        <div class="row">
            <div class="col-md-12 col-xl-6">  
                <ul class="footer-social-icons">
                    <li>
                        <a href="https://www.linkedin.com/company/89702458/admin/" title="Linked In" target="_blank"><i class="fa fa-linkedin" aria-hidden="true"></i></a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com/profile.php?id=100087005881195" class='facebookFontIcon' title="Facebook" target="_blank"><i class="fa fa-facebook" aria-hidden="true"></i></a>
                    </li>
                    <li class="header-notification">
                        <a href="https://www.instagram.com/integralanalytics/" title="Instagram" target="_blank"><i class="fa fa-instagram" aria-hidden="true"></i></a>
                    </li>
                    <li class="header-notification">
                        <a href="https://twitter.com/integral_ana" title="Twitter" target="_blank"><i class="fa fa-twitter" aria-hidden="true"></i></a>
                    </li>
                    <li class="header-notification">
                        <a href="https://www.youtube.com/channel/UC0bkzl0wBcx1r9qtqgOzt6Q" title="You Tube" target="_blank"><i class="fa fa-youtube-play" aria-hidden="true"></i></a>
                    </li>
                </ul>
            </div>
            <div class="col-md-12 col-xl-6 text-right">
                <fmt:formatDate var="currentYear" value="<%=new java.util.Date()%>" pattern="yyyy" />
                <p>Copyright &copy; ${currentYear} PiLog Group</p>
            </div>
        </div>
    </div>
</div>
            <script>
         $(document).ready(function () {
             var screenHeight = screen.height;
             var breadCrumbHeight = $("#breadCrumbDiv").height();
             var headerHeight = $(".pcoded-header").height();
             var footerHeight = $(".footer").height();
     //        console.log("screenHeight:::" + screenHeight);
     //        console.log("breadCrumbHeight:::" + breadCrumbHeight);
     //        console.log("headerHeight:::" + headerHeight);
     //        console.log("footerHeight:::" + footerHeight);
             var menuHeight = parseInt(screenHeight) - (parseInt(breadCrumbHeight) + parseInt(headerHeight) + parseInt(footerHeight));
     //        console.log("menuHeight:::" + menuHeight);
             menuHeight = parseInt(menuHeight)-150;
     //           console.log("menuHeight:::" + menuHeight);
             $(".pcoded-inner-content").css("height",menuHeight + "px");
         });
            </script>