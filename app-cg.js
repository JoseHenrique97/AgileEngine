if(getURLParam("dc") == "eu"){
    var STORAGE =  "https://cloudgymeu.s3-eu-west-2.amazonaws.com/"
    var ENDPOINT_API = "https://api.cloudgym.com/"
    var ENDPOINT_CG = "https://app.cloudgym.com/"
    var ENDPOINT_SATELLITE = "https://satellite.cloudgym.io/"
    var ENDPOINT_CHECKOUT = "https://cloudgym.com/checkout/"
}else{
    var STORAGE =  "https://cloudgym.s3-sa-east-1.amazonaws.com/"
    var ENDPOINT_API = "https://api.cloudgym.io/"
    var ENDPOINT_CG = "https://cloudgym.com.br/"
    var ENDPOINT_SATELLITE = "https://satellite.cloudgym.io/"
    var ENDPOINT_CHECKOUT = "https://cloudgym.io/checkout/"
}

var deviceType = "";
const userAgent = navigator.userAgent;

var livesId = [];
var validator;
var selectedWorkoutId;
var selectedPlanId;
var registerAddress;
var registerCity;
var registerUF;
var registerDistrict;
var CGData;
var CGDataMember;
var npsScore = 0;
var postAllowedToAll = false;
var clientId = "";
var clientGroupId = "";
var version = "";
var color = "#393d87";
var secColor = "#cbcbe7";
var isLogin = false;
var counterCompanyDataLoad = true;
var layoutSetted = false;
let e = jQuery.Event('keydown');
var counterLogin = 0;
var exercises = [];
var selectedCrossfitId;
var isMyClass = false;
var showClassParticipants = true;
var unitsCount = 0;
var timelineMountCount = 0;
var unitToShow;
var currentScreen;
var workoutChecks = [];

function triggerMenu(){
    $("#kt_aside_mobile_toggler").trigger("click");
}

function setScrollPosition(){
    sessionStorage.scrollTop = document.body.scrollTop;
}

function changeWorkoutDay(workoutGroup){
    var lookup = {};
    var result = [];
    $.each(CGDataMember.workout.exercises, function (index, item){
        var items = item.workoutGroup;
        var workoutGroup;
        for (workoutGroup, i = 0; workoutGroup = items[i++];) {
            var name = items;
            if (!(name in lookup)) {
                lookup[name] = 1;
                result.push(name);
            }
        }
    });
    workoutDay = localStorage.workoutDay;
    workoutDay++;
    $("#tab"+workoutGroup).append('<button type="button" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn disabled kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 kt-font-bolder btn-google btn-upper kt-font-bold text-white">' + i18n.t("workoutFinished") + '</button>');
    $("#btn"+workoutGroup).hide();
    if(workoutGroup == "workouta" && result.length > 1){
        workoutDay = 1; 
    }else if(workoutGroup == "workoutb" && result.length > 2){
        workoutDay = 2; 
    }else if(workoutGroup == "workoutc" && result.length > 3){
        workoutDay = 3; 
    }else if(workoutGroup == "workoutd" && result.length > 4){
        workoutDay = 4; 
    }else if(workoutGroup == "workoute" && result.length > 5){
        workoutDay = 5; 
    }else if(workoutGroup == "workoutf" && result.length > 6){
        workoutDay = 6; 
    }else if(workoutGroup == "workoutg" && result.length > 7){
        workoutDay = 7; 
    }else{
        workoutDay = 0;    
    }
    localStorage.workoutDay = workoutDay;

    workoutChecks = [];
    mountWorkout();
}

function setupLayout(){
    unitToShow = localStorage.unitID;
    if (localStorage.companyData != null && localStorage.companyData != "" && localStorage.companyData !== undefined){
        CGData = JSON.parse(localStorage.companyData);
        if(clientGroupId != null && clientGroupId != ""){ //Verify if is an custom app
            if (CGData.mainColor === undefined || CGData.mainColor == "" || CGData.mainColor == "#ffffff"){
                color = "#383838";
            }else{
                color = CGData.mainColor;
            }
            if(CGData.mobileBackground !== undefined && CGData.mobileBackground !== null && CGData.mobileBackground !== ""){
                $("#backgroundImage1").hide();
                if(CGData.mobileBackground == 1){
                    $("#backgroundImage2").show();
                }else if(CGData.mobileBackground == 2){
                    $("#backgroundImage3").show();
                }else if(CGData.mobileBackground == 3){
                    $("#backgroundImage4").show();
                }else if(CGData.mobileBackground == 4){
                    $("#backgroundImage2").hide();
                    $("#backgroundImage3").hide();
                    $("#backgroundImage4").hide();
                }
            }
            if (CGData.secundaryColor === undefined || CGData.secundaryColor == ""){
                secColor = "#ffffff";
            }else{
                secColor = CGData.secundaryColor;
            }
        }
        if(localStorage.memberType != "member"){
            mountStaffMenu();
            $('#unitList').empty();
            $('#selectUnit').empty();
            $.each(CGData.units, function (index, item){
                if (localStorage.unitListIDS != null && localStorage.unitListIDS.includes(item.id)){
                    $('#unitList').append('<a class="dropdown-item" href="javascript:changeUnit(\'' + item.id + '\')">' + item.name + '</a>');
                    if(localStorage.unitID == item.id){
                        $('#selectUnit').append('<option selected="selected" value="' + item.id + '">' + item.name + '</option>');
                    }else{
                        $('#selectUnit').append('<option value="' + item.id + '">' + item.name + '</option>');
                    }
                }
            });
    
            callSelector(localStorage.unitID);
            mountInstructors(localStorage.unitID);
        }

        if(CGData.showClassParticipants !== "" && CGData.showClassParticipants !== null && CGData.showClassParticipants == false){
            showClassParticipants = false;
        }
    }

    if(clientGroupId != null && clientGroupId != ""){
        $("#logoBar").show();
        $("#logo").attr("src", STORAGE + clientGroupId + "/logo.png");
        $("#logo2").attr("src", STORAGE + clientGroupId + "/logo.png");
    }else{
        $("#logoBar").show();
        $("#logo").attr("src", "assets/media/logo.png");
        $("#logo2").attr("src", "assets/media/logo.png");
    }

    if (localStorage.id != undefined && localStorage.id != null && localStorage.id != "" && CGData != null && CGData !== undefined && localStorage.memberData != null && localStorage.memberData != "" && localStorage.memberData !== undefined && localStorage.companyData != null && localStorage.companyData != "" && localStorage.companyData !== undefined){
        
        CGDataMember = JSON.parse(localStorage.memberData);

        callSelector(localStorage.unitID);
        mountInstructors(localStorage.unitID);

        if(layoutSetted){
            return;
        }
        layoutSetted = true;

        if(CGDataMember.mrkOptIn == "false"){
            $("#receiveNews").prop('checked', false);
        }else{
            $("#receiveNews").prop('checked', true);
        }

        if(localStorage.id != "" && localStorage.id != null && localStorage.id !== undefined && localStorage.bearerToken != "" && localStorage.bearerToken != null && localStorage.bearerToken !== undefined && localStorage.bearerToken != "undefined"){
            if (localStorage.unitID == "" || localStorage.unitID == null){
                showGroupItem('profile');
            }else{
                if(CGData.mainScreen === undefined || CGData.mainScreen == ""){
                    showGroupItem("timeline");
                }else{
                    showGroupItem(CGData.mainScreen);
                }
            }
        }else{
            logout();
        }

        postAllowedToAll = CGData.allowMemberPost;
        if (localStorage.memberType == "staff" || (postAllowedToAll === undefined || postAllowedToAll == null)) {
            postAllowedToAll = true;
        }

        if (postAllowedToAll){
            $("#createPostPanel").show();
        }else{
            $("#createPostPanel").hide();
        }
        if (CGData.navBar === undefined || CGData.navBar == ""){
            $("#kt_aside_mobile_toggler").hide();
            $("#menu").show();
            $("#menuBottom").hide();
            navItensFixed = "";
            navItens = navItensFixed.split(",");
        }else{
            if(!isLogin){
                $("#kt_aside_mobile_toggler").show();
                $("#menuBottom").show();
                $("#menu").hide();
            }
            navItens = CGData.navBar.split(",");
        }

        $("#timelineNavBar").hide();
        $("#workoutNavBar").hide();
        $("#wodNavBar").hide();
        $("#scheduleNavBar").hide();
        $("#bookedSessionNavBar").hide();
        $("#profileNavBar").hide();
        $("#catalogNavBar").hide();
        $("#prsNavBar").hide();
        $("#wodNavBar").hide();
        $("#releaseNavBar").hide();
        $("#paNavBar").hide();
        $("#npsNavBar").hide();
        
        $.each(navItens, function (index, item) {
            $("#" + item + "NavBar").show();
            if(CGData.catalog.length <= 0){
                $("#catalogNavBar").hide();
            }
        });

        showAllUnits = false;
        $.each(CGDataMember.contracts, function (index, item){
            $.each(CGData.plans, function (index, itemC){
                if(item.name == itemC.name){
                    if(itemC.allowedUnits == "-1"){
                        showAllUnits = true;
                    }
                }
            });
        });

        //Fill units on grade classes and profile
        $('#selectUnit').empty();
        $("#unitList").empty();
        $.each(CGData.units, function (index, item){
            if(localStorage.unitListIDS != null && localStorage.unitListIDS.includes(item.id) && !showAllUnits){
                $('#unitList').append('<a class="dropdown-item" href="javascript:changeUnit(\'' + item.id + '\')">' + item.name + '</a>');
                unitsCount++;
                if(localStorage.unitID == item.id){
                    $('#selectUnit').append('<option selected="selected" value="' + item.id + '">' + item.name + '</option>');
                }else{
                    $('#selectUnit').append('<option value="' + item.id + '">' + item.name + '</option>');
                }
            }else if(showAllUnits && item.showOnline){
                $('#unitList').append('<a class="dropdown-item" href="javascript:changeUnit(\'' + item.id + '\')">' + item.name + '</a>');
                unitsCount++;
                if(localStorage.unitID == item.id){
                    $('#selectUnit').append('<option selected="selected" value="' + item.id + '">' + item.name + '</option>');
                }else{
                    $('#selectUnit').append('<option value="' + item.id + '">' + item.name + '</option>');
                }
            }
        });
        //Fill units on grade classes and profile
        if(localStorage.memberType == "staff" && unitsCount > 1){
            $('#selectUnit').show();
        }else if(showAllUnits || unitsCount > 1){
            $('#selectUnit').show();
        }else{
            $('#selectUnit').hide();
        }

        curdate = new Date();
        curYear = curdate.getFullYear();
        
        if ($("#prmonth").val() == "12" && curdate.getMonth()==0){
            curYear = curYear-1;
        }
    
        curdate = new Date();
        month = curdate.getMonth()+1;
        day = curdate.getDate();
    
        if (month <= 9){ month = "0" + month;}
        if (day <= 9){ day = "0" + day;}
        
        date = curYear + '-' + month + '-' + day;
        foundActiveContract = false;
        $.each(CGDataMember.contracts, function (index, item){
            if (item.endDate >= date){
                foundActiveContract = true;
            }
        });

        if (CGDataMember.contracts == "" || CGDataMember.contracts == null || CGDataMember.contracts == undefined || !foundActiveContract){
            unitsCount = 0;
            showGroupItem("profile");
        }

        if (CGData.services === undefined || CGData.services == ""){
            if (CGData.whatsapp != null && CGData.whatsapp != "" && localStorage.companyData != null && localStorage.companyData != "" && localStorage.companyData !== undefined){
                $("#whatsMenu").empty();
                $("#whatsMenu").append('<a href="https://api.whatsapp.com/send?phone=' + CGData.whatsapp  + '&text=" target="_blank" class="kt-menu__link "><i style="font-size: 27px; color: var(--secondary-color)" class="kt-padding-r-15 la la-whatsapp"></i><span class="kt-menu__link-text kt-font-light" style="font-size: 13px">' + i18n.t("talkWithUs") + '</span></a><hr>');
            }
            menuItensFixed = "profile,timeline,workout,wod,schedule,bookedSession,catalog,prs,timers,release,pa,nps";
            menuItens = menuItensFixed.split(",");
        }else{
            if (CGData.whatsapp != null && CGData.whatsapp != "" && localStorage.companyData != null && localStorage.companyData != "" && localStorage.companyData !== undefined){
                $("#whatsMenu").empty();
                $("#whatsMenu").append('<a href="https://api.whatsapp.com/send?phone=' + CGData.whatsapp  + '&text=" target="_blank" class="kt-menu__link "><i style="font-size: 27px; color: var(--secondary-color)" class="kt-padding-r-15 la la-whatsapp"></i><span class="kt-menu__link-text kt-font-light" style="font-size: 13px">' + i18n.t("talkWithUs") + '</span></a><hr>');
            }
            menuItens = CGData.services.split(",");
        }

        counter = 0;
        
        $.each(menuItens, function(index, item){
            counter++;
            if (localStorage.memberType != "staff"){
                if (unitsCount == 0){
                    hideMenuAll();
                    $('#unit').hide();
                    $('#withoutContract').show();
                    $("#menuProfile").show();
                    $("#credits").empty();
                    $("#credits").append("0");
                    $("#contractRow").hide();
                    $("#unitProfileRow").hide();
                    $("#buyCreditRow").hide();

                    $("#timelineNavBar").hide();
                    $("#workoutNavBar").hide();
                    $("#prsNavBar").hide();
                    $("#wodNavBar").hide();
                    $("#scheduleNavBar").hide();
                    $("#bookedSessionNavBar").hide();
                    $("#profileNavBar").hide();
                    $("#catalogNavBar").hide();
                    $("#releaseNavBar").hide();
                    $("#paNavBar").hide();
                    $("#npsNavBar").hide();
                }else if (unitsCount > 1){
                    $('#contractRow').show();
                    $('#unitProfileRow').show();
                    if(counter == 1){
                        hideMenuAll();
                    }
                    if(currentScreen == "profile"){
                        $('#unit').show();
                    }
                    $("#" + item + "Menu").show();
                    if(CGData.catalog.length <= 0){
                        $("#catalogMenu").hide();
                    }
                    $('#withoutContract').hide();
                }else{
                    $('#contractRow').show();
                    $('#unitProfileRow').show();
                    if(counter == 1){
                        hideMenuAll();
                    }
                    $('#unit').hide();
                    $('#withoutContract').hide();
                    $("#" + item + "Menu").show();
                    if(CGData.catalog.length <= 0){
                        $("#catalogMenu").hide();
                    }
                }
            }else{
                mountStaffMenu();
            }
        });
    }
    fillColors();
}

function fillColors(){
    $("body").get(0).style.setProperty("--main-color", color);
    $("body").get(0).style.setProperty("--secondary-color", secColor);
    $("body").get(0).style.setProperty("--secondary-color-dark", shadeBlend(-0.5, secColor));
    $("body").get(0).style.setProperty("--secondary-color-light", shadeBlend(0.1, secColor));
    $("body").get(0).style.setProperty("--main-color-light", shadeBlend(0.09, color));
    $("body").get(0).style.setProperty("--main-color-button", shadeBlend(0.15, color));
    $("body").get(0).style.setProperty("--main-color-lighter", shadeBlend(0.3, color));
    $("body").get(0).style.setProperty("--main-color-lightest", shadeBlend(0.7, color));
}

function callSelector(id){
    //Get classes Array
    var classesName = [];
    $.each(CGData.classes, function (index, item){
        $.each(CGData.units, function (index, itemC){
            if(localStorage.memberType == "member"){
                if(classAllowed(item.name, item.minAge, item.maxAge) && item.unitId == itemC.id && id == item.unitId && (item.instructor == $("#selectInstructor").val() || $("#selectInstructor").val() == "all" || $("#selectInstructor").val() == null)){
                    if(item.name != undefined){
                        classesName.push(item.name);
                    }
                }
            }else if(item.unitId == itemC.id && id == item.unitId && (item.instructor == $("#selectInstructor").val() || $("#selectInstructor").val() == "all" || $("#selectInstructor").val() == null)){
                if(item.name != undefined){
                    classesName.push(item.name);
                }
            }
        });
    });
    //Get classes Array

    //Append classes selector
    var classesList = [];
    $.each(classesName, function(i, el){
        if($.inArray(el, classesList) === -1) classesList.push(el);
    });

    $("#classesFilter").empty();
    $.each(classesList, function(index, item){
        var newItem = item.replace(/\W+/g, '');

        strClassesList= '<div class="form-group row bg-light" style="padding-top: 8px; margin-bottom: 16px; margin-top: -10px">'
        strClassesList+='     <div class="kt-align-left col-9 kt-margin-t-10">'
        strClassesList+='         <span class="kt-align-justify kt-font-boldest kt-font-dark"> ' + item + '</span>'
        strClassesList+='     </div>'
        strClassesList+='     <div class="kt-align-right col-3">'
        strClassesList+='         <span class="kt-switch kt-switch--icon">'
        strClassesList+='             <label>'
        strClassesList+='                 <input type="checkbox" id="ftr' + newItem + '" name="ftr' + newItem + '" checked="checked">'
        strClassesList+='                 <span></span>'
        strClassesList+='             </label>'
        strClassesList+='         </span>'
        strClassesList+='     </div>'
        strClassesList+=' </div>'

        $("#classesFilter").append(strClassesList);

        $('input[name="ftr' + newItem + '"]').click(function(){
            mountClasses(unitToShow);
        });
    });
    //Append classes selector
}

function mountInstructors(id){
    //Get instructors Array
    var instructorNames = [];
    $.each(CGData.classes, function (index, item){
        $.each(CGData.units, function (index, itemC){
            if(localStorage.memberType == "member"){
                if(classAllowed(item.name, item.minAge, item.maxAge) && id == item.unitId && item.instructor != undefined){
                    instructorNames.push(item.instructor);
                }
            }else if(id == item.unitId && item.instructor != undefined){
                instructorNames.push(item.instructor);
            }
        });
    });
    //Get instructors Array

    //Append instructors selector
    var instructorList = [];
    $.each(instructorNames, function(i, el){
        if($.inArray(el, instructorList) === -1) instructorList.push(el);
    });
    $('#selectInstructor').empty();
    $('#selectInstructor').append('<option value="all">' + i18n.t("allInstructors") + '</option>');
    $.each(instructorList, function(index, item){
        $('#selectInstructor').append('<option value="' + item + '">' + item + '</option>');
    });
    //Append instructors selector
}

function resetStatusClass(){
    $("#onlineClasses").prop('checked', true);
    $("#faceToFaceClasses").prop('checked', true);
}

//Unit selector
$("#selectUnit").change(function(){
    resetStatusClass();
    mountInstructors(this.value);
    callSelector(this.value);
    mountClasses(this.value);
});
//Unit selector

//Instructor selector
$("#selectInstructor").change(function(){
    resetStatusClass();
    callSelector(unitToShow, this.value);
    mountClasses(unitToShow);
});
//Instructor selector

//Online classes selector
$('input[name="onlineClasses"]').click(function(){
    mountClasses(unitToShow, true);
});
//Online classes selector

//Face to face classes selector
$('input[name="faceToFaceClasses"]').click(function(){
    mountClasses(unitToShow, true);
});
//Face to face classes selector

//Change Newsletter status
$('input[name="receiveNews"]').click(function(){
    sendNews = "false";
    if($(this).parent().find('input').is(':checked')) {
        sendNews = "true";
    }

    $.ajax({
        url: ENDPOINT_API + "app/mrkoptin",
        headers: {
            'memberID':localStorage.id,
            'email': localStorage.email,
            'token': localStorage.token,
            'groupID': localStorage.groupID
        },
        method: "PUT",
        dataType: "text",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({mrkoptin: sendNews})
    }).done(function(data) {
    })
});
//Change Newsletter status

function formatNavBar(id){
    $("#timelineText").removeClass("text-white active");
    $("#workoutText").removeClass("text-white active");
    $("#scheduleText").removeClass("text-white active");
    $("#myClassesText").removeClass("text-white active");
    $("#menuText").removeClass("text-white active");
    $("#profileText").removeClass("text-white active");
    $("#prText").removeClass("text-white active");
    $("#wodText").removeClass("text-white active");
    $("#catalogText").removeClass("text-white active");
    $("#physicalAssessmentSelectText").removeClass("text-white active");
    $("#npsText").removeClass("text-white active");

    $("#timelineIcon").removeClass("text-white");
    $("#workoutIcon").removeClass("text-white");
    $("#scheduleIcon").removeClass("text-white");
    $("#myClassesIcon").removeClass("text-white");
    $("#menuIcon").removeClass("text-white");
    $("#profileIcon").removeClass("text-white");
    $("#catalogIcon").removeClass("text-white");
    $("#prIcon").removeClass("text-white");
    $("#wodIcon").removeClass("text-white");
    $("#physicalAssessmentSelectIcon").removeClass("text-white");
    $("#npsIcon").removeClass("text-white");

    $("#" + id + "Text").addClass("text-white active");
    $("#" + id + "Icon").addClass("text-white");
}

function openCheckoutPage(status){
    if(status == "alreadyClient"){
        window.location.href = ENDPOINT_CHECKOUT + 'index.html?id=' + localStorage.groupID + '&clientID=' + localStorage.clientID2 + '&memberID=' + localStorage.id + '&email=' + localStorage.email + '&token=' + localStorage.token;
    }else if (status == "newClient"){
        window.location.href = ENDPOINT_CHECKOUT + 'index.html?id=' + clientGroupId + '&clientID=' + clientId;
    }
}

function mountStaffMenu(){
    if(CGData.units.length > 1 && currentScreen == "profile"){
        $('#unit').show();
    }else{
        $('#unit').hide();
    }

    if (CGData.navBar === undefined || CGData.navBar == ""){
        $("#kt_aside_mobile_toggler").hide();
        $("#menu").show();
        $("#menuBottom").hide();
    }else{
        if(!isLogin){
            $("#kt_aside_mobile_toggler").show();
            $("#menuBottom").show();
            $("#menu").hide();
        }
    }

    hideMenuAll();
    hideNavBarAll();
    showHideStaffLogin();

    if(CGData != null && CGData !== undefined){
        if(CGData.catalog.length <= 0){
            $("#catalogNavBar").hide();
            $("#catalogMenu").hide();
        }
    }
    if(isLogin == false){
        showGroupItem('timeline');
    }
}

function showGroupItem(id){
    currentScreen = id;
    hideAll();
    //Stop all lives stream players
    $.each(livesId, function (index, item){
        try{
            player = videojs(item);
            player.dispose();
        }catch(e){
        }
    });
    livesId = [];
    $("#" + id).show();
    if (id=='login'){
        isLogin = true;
        $("#bodyAside").removeClass("kt-aside--fixed");
        $("#menu").hide();
        $("#menuBottom").hide();
        localStorage.removeItem("feeds");
        localStorage.removeItem("timeLineSeq");
        $("#timelineFeed").empty();
        $("#kt_aside").hide();
        if(clientGroupId != ""){
            localStorage.groupID = clientGroupId;
            if(counterCompanyDataLoad){
                counterCompanyDataLoad = false;
                loadCompanyData();
            }
        }
    }else{
        isLogin = false;
        $("#bodyAside").addClass("kt-aside--fixed");
        $("#kt_aside").show();
        $("#kt_aside_close_btn").trigger ("click");
    }
    
    currentScreen = id;
    unitsCountProfile = 0;
        
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    formatNavBar(id);

    if (id == 'profile'){
        showProfile();
    }else if (id == 'timeline' && timelineMountCount < 1){
        timelineMountCount++;
        loadTimeLine();
    }else if (id == 'workout'){
        mountWorkout();
    }else if (id == 'schedule'){
        isMyClass = false;
        $("#filterCollapse").removeClass("show");
        resetStatusClass();
        mountClasses(unitToShow);
    }else if (id == 'myClasses'){
        isMyClass = true;
        if (CGDataMember.classes.length >= 1){
            mountMyClasses();
        }else{
            $("#noClassBooked").show();
        }
    }else if (id == 'chat'){
        mountChat();
    }else if (id == 'catalog'){
        mountCatalogMenu(); 
    }else if (id == 'physicalAssessmentSelect'){
        $("#physicalAssessmentSelect").empty();
        $("#physicalAssessmentSelectGraph").empty();
        if(CGDataMember.physicalAssessment.length >= 1){
            mountPhysicalAssessmentSelect();
        }else{
            $("#noPa").show();
        }
    }else if (id == 'athletes'){
        mountAthletes();
    }else if (id == 'pr'){
        showPRResults("barbell");
    }else if (id == 'wod'){
        mountWod();
    }else if (id == "timers"){
        $("#timers").show();
    }else if (id == "ranking"){
        $("#ranking").show();
        $("#rankingBar").show();
    
        dt = new Date();
        strDate = "";
        if (dt.getDate() < 10){
            strDate = "0" + dt.getDate();
        }else{
            strDate = dt.getDate();
        }
        strDate += "/";
        if (dt.getMonth() < 9){
            strDate += "0" + (dt.getMonth()+1);
        }else{
            strDate += (dt.getMonth()+1);
        }
        strDate += "/";
        strDate += dt.getFullYear();
        $("#rankingDate").empty();
        $("#rankingDate").append(strDate);
        loadRanking();
    }else if(id == "gamification"){
        $("#gamificationMenu").show();
    }
}

function shadeBlend(p,c0,c1) {
    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
    }
}

function hideAll(){
    $("#noWorkout").hide();
    $("#noClassBooked").hide();
    $("#noPa").hide();
    $("#rankingBar").hide();
    $("#profile").hide();
    $("#timeline").hide();
    $("#catalogBody").hide();
    $("#menuCatalog").hide();
    $("#workout").hide();
    $("#chat").hide();
    $("#schedule").hide();
    $("#myClasses").hide();
    $("#login").hide();
    $("#logout").hide();
    $("#physicalAssessment").hide();
    $("#physicalAssessmentSelect").hide();
    $("#physicalAssessmentSelectGraph").hide();
    $("#athletes").hide();
    $("#nps").hide();
    $('#unit').hide();
    $('#pr').hide();
    $('#timers').hide();
    $('#tabataM').hide();
    $('#emomM').hide();
    $('#timerM').hide();
    $("#tabataT").hide();
    $('#emomT').hide();
    $('#timerT').hide();
    $('#stopTimerT').hide();
    $('#btnBackCatalog').hide();
    $("#btnBackTimers").hide();
    $("#wod").hide();
}

function initTimeLine(){
    $("#timelineFeed").empty();
    if (typeof localStorage.feeds === undefined || localStorage.feeds == null || localStorage.feeds == ""){
       localStorage.feeds = "[]";
       localStorage.timeLineSeq = 0;
    }
    
    $.each(JSON.parse(localStorage.feeds), function (index, obj) {
        if (obj!=null){
            $("#timelineFeed").prepend(mountPortletPost(obj.id, localStorage.groupID, localStorage.unitID, obj.owner.id, obj.owner.name, obj.postDate, obj.postTime, obj.description, obj.img, obj.likes, obj.comments));
        }
    });
}

function loadTimeLine(){
    var sequence = localStorage.timeLineSeq;
    var feeds = [];

    if (isNaN(sequence)){
        sequence = 0;
    }

    $.ajax({
        url: ENDPOINT_CG + 'app.php',
        method: "POST",
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({ action: "listPosts", groupID: localStorage.groupID, unitID: localStorage.unitID, sequence: sequence})
    }).done(function(data) {
        $.each(data, function (index, item) {
            var obj = JSON.parse(item);
            feeds[feeds.length] = obj;

            $("#timelineFeed").prepend(mountPortletPost(obj.id, localStorage.groupID, localStorage.unitID, obj.owner.id, obj.owner.name, obj.postDate, obj.postTime, obj.description, obj.img, obj.likes, obj.comments));

            localStorage.timeLineSeq = obj.sequence;
        });

        newJsonStr = JSON.stringify(feeds);
        storedJsonStr = localStorage.feeds;

        newJsonStr = newJsonStr.substring(1, newJsonStr.length - 1);
        if (storedJsonStr != null){
            storedJsonStr = storedJsonStr.substring(1, storedJsonStr.length - 1);
        }else{
            storedJsonStr = "";
        }

        auxComma = "";
        if (storedJsonStr.trim() != "" && newJsonStr.trim() != ""){
            auxComma = ", ";
        }

        localStorage.feeds = "[" + storedJsonStr +  auxComma + newJsonStr + "]";

        updateCommentsLikes();
    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + error);
    });

    $.each(CGData.classes, function (index, item){
        var d = new Date();
        curDayOfWeek = d.getDay();
        if (curDayOfWeek == 0) curDayOfWeek = 7;

        curMinute = d.getMinutes();

        if (curMinute < 10){
            curMinute = "0"+curMinute;
        }
        
        curTime = parseInt(d.getHours() + '' + curMinute);
        classTime = parseInt(item.startTime.substring(0,5).replace(':', ''));
        
        if (item.endTime == "" || item.endTime == undefined){
            endTime = "";
        }else{
            endTime = parseInt(item.endTime.substring(0,5).replace(':', ''));
        }
        
        
        strLiveClasses = '<div class="bg-white">';
        strLiveClasses += '    <div class="alert alert-light-dark" style="margin-bottom: 1px;">';
        strLiveClasses += '        <div class="alert-icon">                                            ';
        strLiveClasses += '            <img onerror="this.src=\'assets/media/avatarProfile.png\'" class="avatar avatar-xl" src="' + ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/s" + item.instructorID + '.png" alt="image">';
        strLiveClasses += '        </div>';
        strLiveClasses += '        <div class="alert-text text-left" style="font-size: 14px">';
        strLiveClasses += '            <h6 class="kt-widget__username kt-font-boldest kt-font-dark" style="font-size: 14px">' + item.name + '</h6>';
        strLiveClasses += '            <h6 class="kt-widget__desc kt-font-bold kt-font-dark"> ' + formatTimeLocale(item.startTime) + ' - ' + formatTimeLocale(item.endTime) + ' </h6>';
        if(item.instructor != null && item.instructor != "" && item.instructor != "null"){
            strLiveClasses += '            <h6 class="kt-widget__desc kt-font-bold kt-font-dark">' + item.instructor + '</h6>';
        }
        strLiveClasses += '        </div>';
        strLiveClasses += '        <div class="text-center">';
        strLiveClasses += '            <button onclick="window.open(\'' + item.liveStreamURI + '\')"; type="button" class="kt-margin-b-5 kt-margin-t-15 btn btn-lg change-color-btn btn-icon btn-circle btn-upper"><i style="font-size: 20px; padding-top: 4px; padding-left: 3px" class="fa fa-play text-white kt-margin-b-10 kt-margin-t-5"></i></button><br><p class="text-dark kt-font-bold">Iniciar</p>';
        strLiveClasses += '        </div>';
        strLiveClasses += '    </div>';
        strLiveClasses += '</div>';

        if(item.liveStream == true && curDayOfWeek == item.dayOfWeek && curTime+10 >= classTime && classTime+20 >= curTime){
            $("#followingStreamClasses").show();
            $("#followingStreamClasses").append(strLiveClasses);
        }
    });
}

function addLike(postID){
    total = $('#likes_' + postID).text().split(" ")[0].trim();
    postLike = true;
    
    if ($('#like_' + postID).css("color").indexOf("100,")>=0){
        $('#like_' + postID).css("color", "#a83f39");
        postLike = true;
        total++;
    }else{
        $('#like_' + postID).css("color", "");
        total--;
        postLike = false;
    }
    
    $('#likes_' + postID).text(total);
    $.ajax({
        url: ENDPOINT_CG + 'app.php',
        method: "POST",
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({ action: "like", id: postID, like: postLike, groupID: localStorage.groupID, unitID: localStorage.unitID, memberID: localStorage.id, memberName: localStorage.name})
    }).done(function(data) {
        feeds = JSON.parse(localStorage.feeds);
        $.each(feeds, function (index, obj) {
            if (obj.id == postID){
                obj.likes = total;
            }
        });
        localStorage.feeds = JSON.stringify(feeds);

        if (postLike){
            if (localStorage.likes != null){
                localStorage.likes += postID + ',';
            }else{
                localStorage.likes = postID + ',';
            }
        }else{
            ids = localStorage.likes.split(",");
            newIds = "";
            $.each(ids, function (index, item) {
                if (postID != item){
                    newIds += item + ',';
                }
            });
            localStorage.likes = newIds;
        }
    });
}

function markLikes(){
    if (localStorage.likes != null){
        ids = localStorage.likes.split(",");
        newIds = "";
        $.each(ids, function (index, item) {
            $('#like_' + item).css("color", "#a83f39");
            if ((ids.length - index) <= 100){
                newIds += item + ',';
            }
        });

        localStorage.likes = newIds;
    }
}

function updateCommentsLikes(){
    markLikes();

    $.ajax({
        url: ENDPOINT_CG + 'app.php',
        method: "POST",
        dataType: "json",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({action: "count", groupID: localStorage.groupID, unitID: localStorage.unitID})
    }).done(function(_data) {
        feeds = JSON.parse(localStorage.feeds);

        $.each(_data, function (index, item) {
            $('#likes_' + item.id).text(item.likes);
            
            $('#commentsLink_' + item.id).text(i18n.t("seeAll") + ' ' + item.comments + ' ' + i18n.t("comments"));
            
            $.each(feeds, function (index, obj) {
                if (obj != null && obj.id == item.id){
                    obj.likes = item.likes;
                    obj.comments = item.comments;
                }
            });
        });

        localStorage.feeds = JSON.stringify(feeds);

    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + error);
    });
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function mountPortletPost(id, groupID, unitID, ownerId, memberName, postDate, postTime, description, img, likes, comments){
    strTimeLine = ' <div id="portletPost'+ id +'" class="kt-widget border kt-widget--user-profile-4 kt-bg-light kt-margin-b-10" style="border-radius: 5px">';
    strTimeLine += '   <div class="kt-widget kt-widget--user-profile-2">';
    strTimeLine += '     <div class="card-body">';
    strTimeLine += '         <div class="media">';
    strTimeLine += '             <img onerror="this.src=\'assets/media/avatarProfile.png\';" class="avatar avatar-xs" src="' + ENDPOINT_SATELLITE + "profile_images/" + groupID + "/" + ownerId + '.png">';
    strTimeLine += '             <div class="media-body col-10">';
    strTimeLine += '                 <div class="col-md-6 kt-font-bolder kt-label-font-color-3">' + memberName + '</div>';
    strTimeLine += '                 <small class="text-lighter col-md-6 kt-label-font-color-3">' + formatShortDateLocale(postDate) + ' ' + formatTimeLocale(postTime) + '</small>';
    strTimeLine += '             </div>';
    if(localStorage.memberType == "staff" || ownerId == localStorage.id){
        strTimeLine += '         <div onclick="deletePortletPost(\''+ id + '\')" class="text-right media-body col-2">';
        strTimeLine += '            <button class="btn btn-icon btn-circle btn-label-dark">';
        strTimeLine += '                <i style="font-size: 18px" class="fas fa-trash"></i>';
        strTimeLine += '            </button>';
        strTimeLine += '         </div>';
    }else{
        strTimeLine += '         <div onclick="reportContent(\''+ id + '\')" class="text-right media-body col-2">';
        strTimeLine += '            <button class="btn btn-icon btn-circle btn-label-google">';
        strTimeLine += '                <i style="font-size: 18px" class="fa fa-exclamation"></i>';
        strTimeLine += '            </button>';
        strTimeLine += '         </div>';
    }
    strTimeLine += '         </div>';
    strTimeLine += '     </div>';
    if (img){
        strTimeLine += '<div class="text-center">';
        strTimeLine += '     <img class="card-img-top" src=' + STORAGE + groupID + '/' + unitID + '/timeline/' + id + '.png style="max-width: 512px;">' ;
        strTimeLine += '</div>';
    }
    strTimeLine += '     <div class="card-body">';
    strTimeLine += '         <div class="col-xs-12">';
    checkMemberType = ownerId.slice(0,1);
    // Verify if description has a link
    if (!img && description.includes("http") && checkMemberType == "s"){
        // Extract the link inside the post description
        startLink = description.indexOf('http');
        endLink = description.indexOf(' ', startLink);
        if(endLink == -1){
            endLink = description.length;
        }
        completeLink = description.slice(startLink, endLink+1);
        // Verify if is youtube to show the video <iframe>
        if (completeLink.includes('youtube')){
            newDescription = description.replace(completeLink, "");
            strTimeLine += '     <span style="font-size: 22px">' + newDescription + '</span><br><br>';
            youtubeLinkStart = completeLink.indexOf("?v=", "watch");
            youtubeLinkEnd = completeLink.indexOf("&", youtubeLinkStart);
            if(youtubeLinkEnd == -1){youtubeLinkEnd = completeLink.length}
            youtubeLink = completeLink.slice(youtubeLinkStart+3, youtubeLinkEnd);
            strTimeLine += '     <div style="margin-left: -16px; margin-right: -16px" class="video-container2">';
            strTimeLine += '         <iframe class="" src="https://www.youtube.com/embed/' + youtubeLink + '" frameborder="0"></iframe>';
            strTimeLine += '     </div><br>';
        }else{
            if(completeLink.includes("https://")){
                reducedLink = completeLink.replace("https://", "")
            }else{
                reducedLink = completeLink.replace("http://", "")
            }
            newDescription = description.replace(completeLink, "<a href=" + completeLink + " target=\"_blank\">" + reducedLink + " </a>");
            strTimeLine += '     <span style="font-size: 22px">' + newDescription + '</span><br><br>';
        }
    }else if (!img){
        strTimeLine += '         <span style="font-size: 22px" class="kt-label-font-color-3">' + description + '</span><br><br>';
    }
    strTimeLine += '             <span  onclick="addLike(\''+ id + '\')"><i id=like_' + id + ' class="kt-margin-r-10 fa fa-heart" style="font-size: 21px;"></i></span>';
    strTimeLine += '             <span onclick="$(\'#comment_' + id + '\').focus()"><i class="fa fa-comment" style="font-size: 21px"></i></span><br>';
    strTimeLine += '             <span class="kt-font-boldest kt-label-font-color-3" id=likes_' + id + '>' + likes + '</span><span class="kt-font-bold kt-label-font-color-3"> ' + i18n.t("likes") + '</span><br>';
    if (img && description.includes("http") && checkMemberType == "s"){
        startLink = description.indexOf('http');
        endLink = description.indexOf(' ', startLink);
        if(endLink == -1){
            endLink = description.length;
        }
        completeLink = description.slice(startLink, endLink+1);
        if(completeLink.includes("https://")){
            reducedLink = completeLink.replace("https://", "")
        }else{
            reducedLink = completeLink.replace("http://", "")
        }
        newDescription = description.replace(completeLink, "<a href=" + completeLink + " target=\"_blank\">" + reducedLink + " </a>");
        strTimeLine += '          <span style="font-size: 11px" class="kt-font-bolder kt-label-font-color-3">' + memberName + '&nbsp; </span><span class="kt-label-font-color-3" style="font-size: 11px">' + newDescription + '</span><br>';
    }else if(img){
        strTimeLine += '          <span style="font-size: 11px" class="kt-font-bolder kt-label-font-color-3">' + memberName + '&nbsp; </span><span class="kt-label-font-color-3" style="font-size: 11px">' + description + '</span><br>';
    }
    if (comments > 0){
        strTimeLine += '         <small id="commentsLink_' + id + '" class="kt-font-dark kt-label-font-color-3" onClick="showComments(\'' + id + '\');" > ' + i18n.t("seeAll") + ' ' + comments + ' ' + i18n.t("comments") + '</small>';
    }
    strTimeLine += '             <div class="kt-label-font-color-3" style="display:none; margin-top: 7px" id=comments_' + id + '></div>';
    strTimeLine += '             <div class="kt-input-icon kt-input-icon--right">';
    strTimeLine += '                <div class="input-line mt-2 row" style="background-color: #F5F5F5; padding-top: 3px; border-radius: 20px">';
    strTimeLine += '                    <textarea style="font-size: 10px;" id=comment_' + id + ' class="kt-label-font-color-3 col-12 form-control" rows="1" placeholder="&nbsp;&nbsp;&nbsp;' + i18n.t("addComment") + '"></textarea>';
    strTimeLine += '                </div>';
    strTimeLine += '                <span id="btnAddComment' + id + '" onClick="addComment(\'' + id + '\')" style="margin-right: -5px" class="kt-input-icon__icon kt-input-icon__icon--right">';
    strTimeLine += '                    <span><i style="color: var(--main-color)" class="flaticon2-send-1"></i></span>';
    strTimeLine += '                </span>';
    strTimeLine += '             </div>';
    strTimeLine += '         </div>';
    strTimeLine += '     </div>';
    strTimeLine += '   </div>';
    strTimeLine += '</div>';

    return strTimeLine;
}

function deletePortletPost(postId) {
    Swal.fire({
        backdrop:false,
        title: i18n.t("reallyWantToDelete"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: i18n.t("delete"),
        cancelButtonText: i18n.t("cancel")
    }).then((result) => {
        if (result.value) {
            startAnnimation();
            $.ajax({
                url: ENDPOINT_CG + 'app.php',
                method: "POST",
                dataType: "json",
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify({ action: "removePost", id: postId, groupID: localStorage.groupID, unitID: localStorage.unitID})
            }).done(function(data) {
                stopAnnimation();
                $("#portletPost"+postId).remove();
                showInfo(i18n.t("deletedPost"));
                feeds = JSON.parse(localStorage.feeds);
                $.each(feeds, function (index, obj) {
                    if (obj!=null && obj.id == postId){
                        delete feeds[index];
                    }
                });
                localStorage.feeds = JSON.stringify(feeds);
            }).fail(function(jqXHR, textStatus, error) {
                stopAnnimation();
                showError(i18n.t("errorOccurred") + error);
            });
        }
    });
}

function reportContent(){
    Swal.fire({
        backdrop:false,
        title: i18n.t("wantToReportContent"),
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: i18n.t("report"),
        cancelButtonText: i18n.t("cancel")
    }).then((result) => {
        if (result.value) {
            showInfo(i18n.t("contentReported"));
        }
    });
}

function showComments(postId){
    if($('#comments_' + postId).is(":visible")){
        $('#comments_' + postId).hide();
    }else{
        $.ajax({
            url: ENDPOINT_CG + 'app.php',
            method: "POST",
            dataType: "json",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify({ action: "listComments", id: postId, groupID: localStorage.groupID, unitID: localStorage.unitID})
        }).done(function(data) {
            $('#comments_' + postId).empty();
            $.each(data, function (index, item) {
                appendComment(postId, item.owner.name, item.comment, item.owner.id);
            });
            $('#comments_' + postId).show();
        }).fail(function(jqXHR, textStatus, error) {
            showError(i18n.t("errorOccurred") + error);
        });
    }
}

function appendComment(postId, memberName, comment, memberId){
    $("#comments_" + postId).append('<div class="row"><div class="col-2"><img onerror="this.src=\'assets/media/avatarProfile.png\';" class="avatar avatar-xs" src="' + ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/" + memberId + '.png"></div><div class="col-10 kt-padding-l-15 kt-padding-r-15 kt-padding-t-10 kt-padding-b-10" style="background-color: #F5F5F5; margin-left: -10px; margin-right: -10px; border-radius: 20px"><span style="font-size: 11px;" class="kt-font-bolder">' + memberName + ' </span><span style="font-size: 11px"><br>' + comment + '</span></div></div><br>');
}

function addComment(postId){
    if ($("#comment_" + postId).val().trim() != ""){
        appendComment(postId, localStorage.name, $("#comment_" + postId).val());
        
        $("#comments_" + postId).show();
        
        $("#btnAddComment" + postId).css("pointer-events", "none");
        $.ajax({
            url: ENDPOINT_CG + 'app.php',
            method: "POST",
            dataType: "json",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify({ action: "comment", id: postId, groupID: localStorage.groupID, unitID: localStorage.unitID, memberID: localStorage.id, memberName: localStorage.name, comment: $("#comment_" + postId).val()})
        }).done(function(_data) {
            $("#comment_" + postId).val("");
            $("#btnAddComment" + postId).css("pointer-events", "auto");
        });
    }
}

function mountChat(){
    $("#chatBox").empty();
    strChat = '<div class="kt-chat__messages">';
    strChat += '    <div class="kt-chat__message">';
    strChat += '        <div class="kt-chat__user">';
    strChat += '            <span class="kt-media kt-media--circle kt-media--sm">';
    strChat += '                <img src="assets/media/avatarProfile.png" alt="image">';
    strChat += '            </span>';
    strChat += '            <span href="#" class="kt-chat__username">Jason Muller</span>';
    strChat += '            <span class="kt-chat__datetime">2 Hours</span>';
    strChat += '        </div>';
    strChat += '        <div class="kt-chat__text kt-bg-light-success">';
    strChat += '            How likely are you to recommend our company <br>to your friends and family?';
    strChat += '        </div>';
    strChat += '    </div>';
    strChat += '    <div class="kt-chat__message kt-chat__message--right">';
    strChat += '        <div class="kt-chat__user">';
    strChat += '            <span class="kt-chat__datetime">30 Seconds</span>';
    strChat += '            <a href="#" class="kt-chat__username">You</a>';
    strChat += '            <span class="kt-media kt-media--circle kt-media--sm">';
    strChat += '                <img src="assets/media/avatarProfile.png" alt="image">';
    strChat += '            </span>';
    strChat += '        </div>';
    strChat += '        <div class="kt-chat__text kt-bg-light-brand">';
    strChat += '            Hey there, we’re just writing to let you know <br>that you’ve been subscribed to a repository on GitHub.';
    strChat += '        </div>';
    strChat += '    </div>';
    strChat += '</div>';

    $("#chatBox").append(strChat);
}

function switched (switchElement){
    if($("#"+switchElement.id).parent().find('input').is(':checked')) {
        workoutChecks.push('workout' + switchElement.id);
    }else{
        var itemtoRemove = 'workout' + switchElement.id;
        workoutChecks.splice($.inArray(itemtoRemove, workoutChecks),1);
    }
}

function mountWorkout(){
    var scroll = parseInt(sessionStorage.getItem("scrollTop"));
    if (!isNaN(scroll)){
        document.body.scrollTop = scroll;
    }
    $("#tabworkouta").empty();
    $("#liworkouta").hide();
    $("#tabworkouta").removeClass("active");
    $("#aworkouta").removeClass("active");

    $("#tabworkoutb").empty();
    $("#liworkoutb").hide();
    $("#tabworkoutb").removeClass("active");
    $("#aworkoutb").removeClass("active");

    $("#tabworkoutc").empty();
    $("#liworkoutc").hide();
    $("#tabworkoutc").removeClass("active");
    $("#aworkoutc").removeClass("active");

    $("#tabworkoutd").empty();
    $("#liworkoutd").hide();
    $("#tabworkoutd").removeClass("active");
    $("#aworkoutd").removeClass("active");

    $("#tabworkoute").empty();
    $("#liworkoute").hide();
    $("#tabworkoute").removeClass("active");
    $("#aworkoute").removeClass("active");

    $("#tabworkoutf").empty();
    $("#liworkoutf").hide();
    $("#tabworkoutf").removeClass("active");
    $("#aworkoutf").removeClass("active");

    $("#tabworkoutg").empty();
    $("#liworkoutg").hide();
    $("#tabworkoutg").removeClass("active");
    $("#aworkoutg").removeClass("active");

    $("#tabworkouth").empty();
    $("#liworkouth").hide();
    $("#tabworkouth").removeClass("active");
    $("#aworkouth").removeClass("active");

    if(localStorage.workoutDay == 1){
        $("#tabworkoutb").addClass("active");
        $("#aworkoutb").addClass("active");
    }else if(localStorage.workoutDay == 2){
        $("#tabworkoutc").addClass("active");
        $("#aworkoutc").addClass("active");
    }else if(localStorage.workoutDay == 3){
        $("#tabworkoutd").addClass("active");
        $("#aworkoutd").addClass("active");
    }else if(localStorage.workoutDay == 4){
        $("#tabworkoute").addClass("active");
        $("#aworkoute").addClass("active");
    }else if(localStorage.workoutDay == 5){
        $("#tabworkoutf").addClass("active");
        $("#aworkoutf").addClass("active");
    }else if(localStorage.workoutDay == 6){
        $("#tabworkoutg").addClass("active");
        $("#aworkoutg").addClass("active");
    }else if(localStorage.workoutDay == 7){
        $("#tabworkouth").addClass("active");
        $("#aworkouth").addClass("active");
    }else{
        $("#tabworkouta").addClass("active");
        $("#aworkouta").addClass("active");
    }
    
    $("#workoutStartDate").empty();
    $("#workoutEndDate").empty();
    $("#workoutInstructor").empty();
    $("#workoutObs").empty();

    workoutGroup = "";
    if(CGDataMember.workout.exercises.length >= 1){
        $.each(CGDataMember.workout.exercises, function (index, item){
            workoutGroup = item.workoutGroup;
            exerciseId = item.id;
            strWorkout = '<div id="workoutPortlet' + item.id + '" class="kt-portlet__body kt-bg-light kt-margin-b-10" style="border-radius: 5px">';
            strWorkout += '  <div class="kt-widget kt-widget--user-profile-3">';
            strWorkout += '      <div class="kt-widget__top">';
            strWorkout += '          <div class="kt-widget__content">';
            strWorkout += '              <div class="kt-widget__head kt-padding-l-10 kt-padding-r-10">';
            strWorkout += '                  <span class="kt-widget__username row" style="margin-left: -15px">';
            strWorkout += '                      <i style="font-size: 22px; color: var(--main-color)" class="kt-padding-r-5 fa fa-dumbbell"></i><p style="margin-top: 15px"> ' + item.name + '</p>';
            strWorkout += '                  </span>';
            strWorkout += '                  <div class="kt-align-right kt-padding-t-5">';
            strWorkout += '                      <div class="col-2">';
            strWorkout += '                          <span class="kt-switch kt-switch--sm kt-switch--icon">';
            strWorkout += '                              <label>';
            if(workoutChecks.length >= 1){
                $.each(workoutChecks, function (index, itemA){
                    if('workout' + item.id == itemA){
                        strWorkout += '                      <input id="' + item.id + '" checked="checked" onclick="switched(this)" type="checkbox" name="">';
                    }
                });
            }
            strWorkout += '                                  <input id="' + item.id + '" onclick="switched(this)" type="checkbox" name="">';
            strWorkout += '                                  <span></span>';
            strWorkout += '                              </label>';
            strWorkout += '                          </span>';
            strWorkout += '                      </div>';
            strWorkout += '                  </div>';
            strWorkout += '              </div>';
            if (item.obs != null && item.obs != '' && item.obs != 'null'){
                strWorkout += '          <div class="kt-widget__info">';
                strWorkout += '              <div class="kt-widget__desc">' + item.obs + '</div>';
                strWorkout += '          </div>';
            }
            if (item.link != null && item.link != '' && item.link != 'null'){
                strWorkout += '          <div id="video' + item.id + '"></div>';
            }
            strWorkout += '          </div>';
            strWorkout += '      </div>';
            strWorkout += '      <div class="kt-margin-t-0 kt-padding-b-20 kt-widget__bottom">';
            if (item.link != null && item.link != '' && item.link != 'null'){
                strWorkout += '      <div class="kt-widget__item d-flex justify-content-center">';
                strWorkout += '          <div class="kt-widget__details">';
                strWorkout += '             <button onclick="loadWorkoutVideo(' + item.id + ',\'' + item.link + '\')" class="btn btn-icon change-color-btn btn-pill">';
                strWorkout += '                 <i style="font-size: 28px" class="text-white la la-play"></i>';
                strWorkout += '             </button>';
                strWorkout += '              <span class="kt-widget__title text-center">' + i18n.t("video") + '</span>';
                strWorkout += '          </div>';
                strWorkout += '      </div>';
            }
            strWorkout += '          <div class="kt-widget__item d-flex justify-content-center">';
            strWorkout += '              <div class="kt-widget__icon">';
            strWorkout += '                  <i class="flaticon-pie-chart"></i>';
            strWorkout += '              </div>';
            strWorkout += '              <div class="kt-widget__details">';
            strWorkout += '                  <span class="kt-widget__value kt-align-center" style="font-size: 20px; color: var(main-color)"> ' + item.series + ' </span>';
            strWorkout += '                  <span class="kt-widget__title">' + i18n.t("sets") + '</span>';
            strWorkout += '              </div>';
            strWorkout += '          </div>';
            strWorkout += '          <div class="kt-widget__item d-flex justify-content-center">';
            strWorkout += '              <div class="kt-widget__icon">';
            strWorkout += '                  <i class="flaticon-rotate"></i>';
            strWorkout += '              </div>';
            strWorkout += '              <div class="kt-widget__details">';
            strWorkout += '                  <span class="kt-widget__value kt-align-center" style="font-size: 20px; color: var(main-color)"> ' + item.reps + ' </span>';
            strWorkout += '                  <span class="kt-widget__title">' + i18n.t("reps") + '</span>';
            strWorkout += '              </div>';
            strWorkout += '          </div>';
            strWorkout += '          <div class="kt-widget__item d-flex justify-content-center">';
            strWorkout += '              <div class="kt-widget__details">';
            if(item.load == "" || item.load == null || item.load == undefined){
                item.load = "-"
            }
            strWorkout += '                  <button id="workoutLoad' + item.id + '" onclick="showInputLoadModal(' + item.id + ',\'' + item.load + '\')" class="kt-widget__value btn btn-icon change-color-btn btn-pill text-white" style="font-size: 20px;">' + item.load + '</button>';
            strWorkout += '                  <span class="kt-widget__title text-center">' + i18n.t("load") + '</span>';
            strWorkout += '              </div>';
            strWorkout += '          </div>';
            strWorkout += '      </div>';
            strWorkout += '  </div>';
            strWorkout += '</div>';

            $("#tab" + item.workoutGroup).append(strWorkout);
            $("#li" + item.workoutGroup).show();
        });
        $("#tabworkouta").append('<button id="btnworkouta" type="button" onclick="changeWorkoutDay(\'workouta\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        $("#tabworkoutb").append('<button id="btnworkoutb" type="button" onclick="changeWorkoutDay(\'workoutb\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        $("#tabworkoutc").append('<button id="btnworkoutc" type="button" onclick="changeWorkoutDay(\'workoutc\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        $("#tabworkoutd").append('<button id="btnworkoutd" type="button" onclick="changeWorkoutDay(\'workoutd\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        $("#tabworkoute").append('<button id="btnworkoute" type="button" onclick="changeWorkoutDay(\'workoute\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        $("#tabworkoutf").append('<button id="btnworkoutf" type="button" onclick="changeWorkoutDay(\'workoutf\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        $("#tabworkoutg").append('<button id="btnworkoutg" type="button" onclick="changeWorkoutDay(\'workoutg\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        $("#tabworkouth").append('<button id="btnworkouth" type="button" onclick="changeWorkoutDay(\'workouth\')" style="width: 100%; font-size: 14px; border-radius: 0px" class="btn kt-margin-b-10 kt-padding-t-15 kt-padding-b-15 text-white change-color-btn btn-upper kt-font-bold">' + i18n.t("finishWorkout") + '</button>');
        
    }else{
        $("#workout").hide();
        $("#noWorkout").show();
    }
    
    if(CGDataMember.workout.instructor == "" || CGDataMember.workout.instructor == null || CGDataMember.workout.instructor == "null"){
        $("#instructorWorkoutRow").hide();
    }else{
        $("#workoutInstructor").append(CGDataMember.workout.instructor);
    }
    
    if(CGDataMember.workout.startDate == "" || CGDataMember.workout.startDate == null || CGDataMember.workout.startDate == "null"){
        $("#startWorkoutRow").hide();
    }else{
        $("#workoutStartDate").append(formatShortDateLocale(CGDataMember.workout.startDate));
    }
    
    if(CGDataMember.workout.endDate == "" || CGDataMember.workout.endDate == null || CGDataMember.workout.endDate == "null"){
        $("#changeWorkoutRow").hide();
    }else{
        $("#workoutEndDate").append(formatShortDateLocale(CGDataMember.workout.endDate));
    }
    
    if(CGDataMember.workout.Obs == "" || CGDataMember.workout.Obs == null || CGDataMember.workout.Obs == "null"){
        $("#obsWorkoutRow").hide();
    }else{
        $("#workoutObs").append(CGDataMember.workout.Obs);
    }
}

function loadWorkoutVideo(id, link){
    $("#workoutVideo").remove();
    $("#video"+id).append('<div id="workoutVideo" class="video-container"><iframe class="" src="https://www.youtube.com/embed/' + link + '?rel=0&amp;showMsgInfo=0" frameborder="0"></iframe></div>');
}

function mountCatalogMenu(){
    $("#menuCatalog").empty();
    
    groups = [];

    $.each(CGData.catalog, function (index, item){
        idx = 0;
        foundGroup = false;
        $.each(groups, function (index, itemC){
            str = itemC[0];
            if (item.groupBy === undefined || item.groupBy == null || item.groupBy.trim() == "" || item.groupBy == "null"){
                item.groupBy = "Outros";

            }
            if(str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() == item.groupBy.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()){
                foundGroup = true;
                idx = index;
            }
        });
        
        if (!foundGroup){
            size = groups.length;
            groups[size] = [];
            groups[size][0] = item.groupBy;
            groups[size][1] = 1;
        }else{
            groups[idx][1]++;
        }
    });
    $.each(groups, function (index, itemC){
        strmountCatalogMenu = '<div onClick="mountCatalog(\''+itemC[0]+'\')" class="kt-portlet__body bg-light kt-margin-b-10" style="border-radius: 5px">';
        strmountCatalogMenu += '   <div class="row">';
        strmountCatalogMenu += '      <div class="row col-9" style="margin-top: 15px">';
        strmountCatalogMenu += '          <div class="col-3">';
        strmountCatalogMenu += '              <button type="button" class="btn btn-lg btn-elevate btn-circle btn-icon text-light" style="font-size: 20px; background-color: var(--main-color)">' + itemC[0].substring(0, 2).toUpperCase() + '</button>&nbsp;';
        strmountCatalogMenu += '          </div>';
        strmountCatalogMenu += '          <div class="col-9 text-left" style="padding-left: 5px; padding-top: 5px">';
        strmountCatalogMenu += '              <span class="kt-widget__username kt-font-bold" style="font-size: 22px; color: var(--main-color)"> ' + itemC[0] + '</span>';
        strmountCatalogMenu += '          </div>';
        strmountCatalogMenu += '      </div>';
        strmountCatalogMenu += '      <div class="text-right col-3">';
        strmountCatalogMenu += '          <button style="margin-right: -15px; color: var(--main-color)" type="button" class="kt-font-bolder btn-pill btn btn-upper">&nbsp;<span><i style="font-size: 50px; color: var(--main-color)" class="la la-play-circle-o"></i></span><br>'+ itemC[1] + ' ' +i18n.t("videos") + '</button>';
        strmountCatalogMenu += '      </div>';
        strmountCatalogMenu += '   </div>';
        strmountCatalogMenu += '</div>';

        $("#menuCatalog").append(strmountCatalogMenu);
        $("#menuCatalog").show();
    });
}


function mountCatalog(groupBy){
   $("#catalogBody").empty();
   $("#menuCatalog").hide();
   $("#btnBackCatalog").show();
   
    $.each(CGData.catalog, function (index, item){
        if(item.groupBy.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase() == groupBy.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()){
            exerciseId = item.id;
            strWorkout = '<div id="workoutPortlet' + item.id + '" class="kt-portlet__body kt-bg-light kt-margin-b-10" style="border-radius: 5px">';
            strWorkout += '  <div class="kt-widget kt-widget--user-profile-3">';
            strWorkout += '      <div class="kt-widget__top">';
            strWorkout += '          <div class="kt-widget__content">';
            strWorkout += '              <div class="kt-widget__head kt-padding-l-10 kt-padding-r-10 kt-padding-t-5 kt-padding-b-5">';
            strWorkout += '                  <span class="kt-widget__username row">';
            strWorkout += '                     <i style="font-size: 24px; color: var(--main-color)" class="kt-padding-r-5 fa fa-video"></i> ' + item.title;
            strWorkout += '                  </span>';
            strWorkout += '                  <div style="margin-top: -5px" class="kt-align-right row">';
        strWorkout += '                         <div class="text-dark">' + item.groupBy + ' &nbsp;&nbsp;</div>';
            strWorkout += '                  </div>';
            strWorkout += '              </div>';

            if (item.link.includes('youtube')){
                strWorkout += '          <div class="video-container">';
                strWorkout += '              <iframe class="" src="' + item.link + '" frameborder="0"></iframe>';
                strWorkout += '          </div>';
            }else{
                strWorkout += '          <div class="video-container">';
                strWorkout += '             <video width="100%" controls="controls" preload="metadata"><source src="' + item.link + '" type="video/mp4"></video>';
                strWorkout += '          </div>';
            }
            
            strWorkout += '          </div>';
            strWorkout += '      </div>';
            strWorkout += '      <div class="kt-margin-t-0 kt-padding-b-20 kt-widget__bottom kt-margin-l-5">';
            strWorkout += '          <div class="kt-widget__item">';
            strWorkout += '              <div class="kt-widget__details">';
            strWorkout += '                  <span class="kt-widget__title">' + item.description + '</span>';
            strWorkout += '              </div>';
            strWorkout += '          </div>';
            strWorkout += '      </div>';
            strWorkout += '  </div>';
            strWorkout += '</div>';

            $("#catalogBody").append(strWorkout);
            $("#catalogBody").show();
        }
    });
}

function showBenchmark(id){
    isToShow = false;
    //$('#prp' + id).hide();
    $('span[id^="pret"]').css("font-weight", "");
    if($('#prp' + id).is(":visible")){
        isToShow = false;
        $('#iconPrChange'+id).addClass('la-angle-right');
        $('#iconPrChange'+id).removeClass('la-angle-down');
    }else{
        isToShow = true;
        $('#pret' + id).css("font-weight", "bold");
        $('#iconPrChange'+id).removeClass('la-angle-right');
        $('#iconPrChange'+id).addClass('la-angle-down');
    }

    $('div[id^="prp"]').hide();
    
    if (isToShow){
        $('#prp' + id).show();
    }
}

function showPRResults (id){
    $("#barbell").hide();
    $("#gymnastic").hide();
    $("#endurance").hide();
    $("#notables").hide();
    $("#girls").hide();
    $("#theHerous").hide();
    $("#"+id).show();
    $('#prsBar').scroll();
    $("#prsBar").animate({
        scrollLeft: $("#"+id+"Nav").position().left -35
    }, 200);
}

function loadExercises(){
    exercise = new Object();
    exercise.id = 1;
    exercise.name = 'Back Squat';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 2;
    exercise.name = 'Bench Press';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 3;
    exercise.name = 'Clean';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 4;
    exercise.name = 'Clean & Jerk';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 5;
    exercise.name = 'Clean Pull';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 6;
    exercise.name = 'Cluster';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 7;
    exercise.name = 'Deadlift';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 8;
    exercise.name = 'Front Squat';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 9;
    exercise.name = 'Hang Power Clean';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 10;
    exercise.name = 'Hang Power Snatch';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 11;
    exercise.name = 'Hang Squat Clean';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 12;
    exercise.name = 'hang Squat Snatch';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 13;
    exercise.name = 'Muscle Clean';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 14;
    exercise.name = 'Muscle Snatch';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 15;
    exercise.name = 'Overhead Lunge';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 16;
    exercise.name = 'Overhead Squat';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 17;
    exercise.name = 'Power Clean';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 18;
    exercise.name = 'Power Snatch';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 19;
    exercise.name = 'Push Jerk';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 20;
    exercise.name = 'Push Press';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 21;
    exercise.name = 'Shoulder Press';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 22;
    exercise.name = 'Snatch';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 23;
    exercise.name = 'Snatch Balance';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 24;
    exercise.name = 'Snatch Deadlift';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 25;
    exercise.name = 'Snatch Pull';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 26;
    exercise.name = 'Split Jerk';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 27;
    exercise.name = 'Squat Clean';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 28;
    exercise.name = 'Squat Jerk';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 29;
    exercise.name = 'Squat Snatch';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 30;
    exercise.name = 'Sumo Deadlift';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 31;
    exercise.name = 'Sumo Deadlift High Pull';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 32;
    exercise.name = 'Thruster';
    exercise.type='load';
    exercise.benchmark = 'barbell';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 33
    exercise.name = 'Abmat';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 34
    exercise.name = 'Bar Muscle-Ups';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 35
    exercise.name = 'Box Jump';
    exercise.type='distance';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 36
    exercise.name = 'Double Unders';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 37
    exercise.name = 'Handstand Push-Ups';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 38
    exercise.name = 'Handstand Walk';
    exercise.type='distance';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 39
    exercise.name = 'L-Sit';
    exercise.type='time';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 40
    exercise.name = 'Muscle-Ups';
    exercise.type='time';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 41
    exercise.name = 'Pull-Ups (Weighted)';
    exercise.type='load';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 42
    exercise.name = 'Pull-Ups (Chest To Bar)';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 43
    exercise.name = 'Pull-Ups (Strict Chest To Bar)';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 44
    exercise.name = 'Pull-Ups (Strict)';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 45
    exercise.name = 'Pull-Ups';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 46
    exercise.name = 'Push-Ups';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 47
    exercise.name = 'Ring Dips';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 48
    exercise.name = 'Ring Muscle-Ups';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 49
    exercise.name = 'Single Unders';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 50
    exercise.name = 'Strict Handstand Push-Ups';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 51
    exercise.name = 'Strict Ring Muscle-Ups';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 52
    exercise.name = 'Tabata Squat';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 53
    exercise.name = 'Toes To Bar';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.id = 54
    exercise.name = 'WallBall';
    exercise.type='rep';
    exercise.benchmark = 'gymnastic';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 55;
    exercise.name = 'Air Bike (100 Cal)';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 56;
    exercise.name = 'Air Bike (50 Cal)';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 57;
    exercise.name = 'Air Bike (Max Cal 1`)';
    exercise.type='calories';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 58;
    exercise.name = 'Row 1 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 59;
    exercise.name = 'Row 10 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 60;
    exercise.name = 'Row 100 m';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 61;
    exercise.name = 'Row 2 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 62;
    exercise.name = 'Row 21 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 63;
    exercise.name = 'Row 5 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 64;
    exercise.name = 'Row 500m';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 65;
    exercise.name = 'Run 1 mile';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 66;
    exercise.name = 'Run 1.200m';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 67;
    exercise.name = 'Run 10 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 68;
    exercise.name = 'Run 100m';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 69;
    exercise.name = 'Run 15 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 70;
    exercise.name = 'Run 200m';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 71;
    exercise.name = 'Run 400m';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 72;
    exercise.name = 'Run 5 km';
    exercise.type='time';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'endurance';
    exercise.id = 73;
    exercise.name = 'Run 800m';
    exercise.type='time';  
    exercises.push(exercise); 

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 74;
    exercise.name = '300';
    exercise.type='time';
    exercise.wod = 'For Time\n25 Pull-Ups\n50 Deadlifts (135/95 lb)\n50 Push-Ups\n50 Box Jumps (24/20 in)\n50 Floor Wipers (135/95 lb) (one count)\n50 Kettlebell Clean-and-Press (1/.75 Pood) (alternating)\n25 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 75;
    exercise.name = 'Bear Complex';
    exercise.type='load';
    exercise.wod = '5 Rounds For Load\nComplete 7 Unbroken Sets of this Complex:\n1 Power Clean\n1 Front Squat\n1 Push Press\n1 Back Squat\n1 Push Press';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 76;
    exercise.name = 'Broomstick mile';
    exercise.type='time';
    exercise.wod = 'For Time\n25 Back Squats\n25 Front Squats\n25 Overhead Squats\n400 meter Run\n25 Shoulder Presses\n25 Push Presses\n25 Push Jerks\n400 meter Run\n50 Hang Cleans\n400 meter Run\n50 Snatches\n400 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 77;
    exercise.name = 'Crossfit Total';
    exercise.type='load';
    exercise.wod = 'Sum of the Best of Each Lift\nBack Squat\nShoulder Press\nDeadlift';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 78;
    exercise.name = 'Death by Pull-Ups';
    exercise.type='rounds';
    exercise.wod = 'With a continuously running clock perform:\n1 Pull-up in the first 1 min,\n2 Pull-ups in the second 1 minexercise = new Object();\\n3 Pull-ups in the third 1 min\n\nContinuing this for as long as you are able.';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 79;
    exercise.name = 'Fight Gone Bad';
    exercise.type='rep';
    exercise.wod = '3 Rounds For Total Reps in 17 minutes\n1 minute Wall Balls (20/14 lb)\n1 minute Sumo Deadlift High-Pulls (75/55 lb)\n1 minute Box Jumps (20 in)\n1 minute Push Press (75/55 lb)\n1 minute Row (calories)\n1 minute Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 80;
    exercise.name = 'Filthy Fifty';
    exercise.type='time';
    exercise.wod = 'For Time \n50 Box Jumps (24/20 in)\n50 Jumping Pull-Ups\n50 Kettlebell Swings (1/.75 pood)\n50 Walking Lunges\n50 Knees-to-Elbows\n50 Push Press (45/35 lb)\n50 Back Extensions\n50 Wall Balls (20/14 lb)\n50 Burpees\n50 Double-Unders';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 81;
    exercise.name = 'Hope';
    exercise.type='rep';
    exercise.wod = '3 Rounds For Total Reps in 17 minutes\n1 minute Burpees\n1 minute Power Snatch (75/55 lb)\n1 minute Box Jump (24/20 in)\n1 minute Thruster (75/55 lb)\n1 minute Chest-to-Bar Pull-Ups\n1 minute Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 82;
    exercise.name = 'Iron Triathlon';
    exercise.type='time';
    exercise.wod = 'For time 1-20 reps of Linda:\n\nDeadlift 1.5xBW\nBench Press 1xBW\nSquat Clean 0.75xBW';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 83;
    exercise.name = 'Jeremy';
    exercise.type='time';
    exercise.wod = '21-15-9 Reps For Time\nOverhead Squats (95/65 lb)\nBurpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 84;
    exercise.name = 'King Kong';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n1 Deadlift (455/320 lb)\n2 Muscle-Ups\n3 Squat Cleans (250/175 lb)\n4 Handstand Push Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 85;
    exercise.name = 'Nasty Girls';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n50 Air Squats\n7 Muscle-Ups\n10 Hang Power Cleans (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 86;
    exercise.name = 'Tabata Something Else';
    exercise.type='rep';
    exercise.wod = 'With a Running Clock in 16 minutes\nTabata Pull-Ups\nTabata Push-Ups\nTabata Sit-Ups\nTabata Air Squats';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 87;
    exercise.name = 'Tabata This';
    exercise.type='rep';
    exercise.wod = 'With a Running Clock in 24 minutes\nTabata Row\nTabata Air Squats\nTabata Pull-Ups\nTabata Push-Ups\nTabata Sit-Ups\n1 minute Rest between each Tabata';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'notables';
    exercise.id = 88;
    exercise.name = 'The Chief';
    exercise.type='<\nPRENCHER \n>';
    exercise.wod = 'Five 3-minute AMRAPs in 19 minutes\nAMRAP in 3 minutes\n3 Power Cleans (135/95 lbs)\n6 Push-Ups\n9 Air Squats\nThen Rest 1 minute\nRepeat 5 times';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 89;
    exercise.name = 'Amanda';
    exercise.type='time';
    exercise.wod = '9-7-5 Reps For Time\nMuscle-Ups\nSquat Snatches (135/95 lbs)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 90;
    exercise.name = 'Angie';
    exercise.type='time';
    exercise.wod = 'For Time\n100 Pull-Ups\n100 Push-Ups\n100 Sit-Ups\n100 Air Squats';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 91;
    exercise.name = 'Annie';
    exercise.type='time';
    exercise.wod = '50-40-30-20-10 Reps For Time\nDouble-Unders\nSit-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 92;
    exercise.name = 'Barbara';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time/n20 Pull-Ups\n30 Push-Ups\n40 Sit-Ups\n50 Air Squats\n3 Minutes Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 93;
    exercise.name = 'Chelsea';
    exercise.type='<\nPRENCHER \n>';
    exercise.wod = 'EMOM in 30 minutes\n5 Pull-Ups\n10 Push-Ups\n15 Air Squats';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 94;
    exercise.name = 'Christine';
    exercise.type='time';
    exercise.wod = '3 Rounds for Time\n500 meter Row\n12 Deadlifts (Bodyweight)\n21 Box Jumps (24/20 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 95;
    exercise.name = 'Cindy';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 20 minutes\n5 Pull-Ups\n10 Push-Ups\n15 Air Squats';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 96;
    exercise.name = 'Diane';
    exercise.type='time';
    exercise.wod = '21-15-9 Reps For Time\nDeadlift (225/155 lb)\nHandstand Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 97;
    exercise.name = 'Elizabeth';
    exercise.type='time';
    exercise.wod = '21-15-9 Reps For Time\nSquat Cleans (135/95 lb)\nRing Dips';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 98;
    exercise.name = 'Eva';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n800 meter Run\n30 Kettlebell Swings (2/1.5 pood)\n30 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 99;
    exercise.name = 'Fran';
    exercise.type='time';
    exercise.wod = '21-15-9 Reps For Time\nThrusters (95/65 lb)\nPull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 100;
    exercise.name = 'Grace';
    exercise.type='time';
    exercise.wod = 'For Time\n30 Clean-and-Jerks (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 101;
    exercise.name = 'Gwen';
    exercise.type='load';
    exercise.wod = '15-12-9 Reps for Load\nClean-and-Jerks (unbroken)\nRest as needed between sets';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 102;
    exercise.name = 'Helen';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n400 meter Run\n21 Kettlebell Swings (1.5/1 pood)\n12 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 103;
    exercise.name = 'Isabel';
    exercise.type='time';
    exercise.wod = 'For Time\n30 Snatches (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 104;
    exercise.name = 'Jackie';
    exercise.type='time';
    exercise.wod = 'For Time\n1,000 Meter Row\n50 Thrusters (45/35 lb bar)\n30 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 105;
    exercise.name = 'Karen';
    exercise.type='time';
    exercise.wod = 'For Time\n150 Wall Ball Shots (20/14 lb, 10/9 ft)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 106;
    exercise.name = 'Kelly';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n400 meter Run\n30 Box Jumps (24/20 in)\n30 Wall Ball Shots (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 107;
    exercise.name = 'Linda';
    exercise.type='time';
    exercise.wod = '10-9-8-7-6-5-4-3-2-1 Reps, For Time\nDeadlift (1.5 bodyweight)\nBench Press (bodyweight)\nClean (3/4 bodyweight)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 108;
    exercise.name = 'Lynne';
    exercise.type='rep';
    exercise.wod = '5 Rounds for Max Reps\nBench Press (bodyweight)\nPull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 100;
    exercise.name = 'Mary';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 20 minutes\n5 Handstand Push-Ups\n10 Pistols (alternating legs)\n15 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 109;
    exercise.name = 'Megan';
    exercise.type='time';
    exercise.wod = '21 - 15 - 9 reps for time\nBurpees\nKettlebell Swings(53/35lbs)\nDouble-Unders';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 110;
    exercise.name = 'Nancy';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n400 meter Run\n15 Overhead Squats (95/65 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'girls';
    exercise.id = 111;
    exercise.name = 'Nicole';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 20 minutes\n400 Meter Run\nMax Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 112;
    exercise.name = '31 Heroes';
    exercise.type='rep';
    exercise.wod = 'AMRAP (with a Partner) in 31 minutes\n8 Thrusters (155/105 lb)\n6 Rope Climbs (15 ft)\n11 Box Jumps (30/24 in)\nPartners alternate 400m sandbag run (45/25 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 113;
    exercise.name = 'Abbate';
    exercise.type='time';
    exercise.wod = 'For Time\n1 mile Run\n21 Clean-and-Jerk (155/105 lb)\n800 Meter Run\n21 Clean-and-Jerk (155/105 lb)\n1 mile Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 114;
    exercise.name = 'AdamBrown';
    exercise.type='time';
    exercise.wod = '2 Rounds For Time\n24 Deadlifts (295/205 lb)\n24 Box Jumps (24/20 in)\n24 Wall Ball Shots (20/14 lb)\n24 Bench Press (195/125 lb)\n24 Box Jumps (24/20 in)\n24 Wall Ball shots (20/14 lb)\n24 Cleans (145/100 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 115;
    exercise.name = 'Adrian';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n3 Forward Rolls\n5 Wall Climbs\n7 Toes-to-Bar\n9 Box Jumps (30/24 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 116;
    exercise.name = 'Alexander';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n31 Back Squats (135/95 lb)\n12 Power Cleans (185/135 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 117;
    exercise.name = 'Andy';
    exercise.type='time';
    exercise.wod = 'For Time\n25 Thrusters (115/85 lb)\n50 Box Jumps (24/20 in)\n75 Deadlifts (115/85 lb)\n1.5 mile Run\n75 Deadlifts, (115/85 lb)\n50 Box Jumps (24/20 in)\n25 Thrusters (115/85 lb)\nWear a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 118;
    exercise.name = 'Arnie';
    exercise.type='time';
    exercise.wod = 'For Time\n21 Turkish Get-Ups, Right Arm\n50 Kettlebell Swings\n21 Overhead Squats, Left Arm\n50 Kettlebell Swings\n21 Overhead Squats, Right Arm\n50 Kettlebell Swings\n21 Turkish Get-Ups, Left Arm\nUse a single Kettlebell (2/1.5 pood)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 119;
    exercise.name = 'Artie';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 20 minutes\n5 Pull-Ups\n10 Push-Ups\n15 Squats\n5 Pull-Ups\n10 Thrusters (95/65 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 121;
    exercise.name = 'Badger';
    exercise.type='time';
    exercise.wod = '3 Round For Time\n30 Squat Cleans (95/65 lb)\n30 Pull-Ups\n800 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 122;
    exercise.name = 'Barraza';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 18 minutes\n200 meter Run\n9 Deadlift (275/185 lb)\n6 Burpee Bar Muscle-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 123;
    exercise.name = 'Bell';
    exercise.type='time';
    exercise.wod = '3 Rounds for Time\n21 Deadlifts (185/135 lb)\n15 Pull-Ups\n9 Front Squats (185/135 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 124;
    exercise.name = 'Big Sexy';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n6 Deadlifts (315/205 lb)\n6 Burpees\n5 Cleans (225/155 lb)\n5 Chest-to-Bar Pull-Ups\n4 Thrusters (155/115 lb)\n4 Muscle-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 125;
    exercise.name = 'Blake';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n100 ft Overhead Walking Lunge (45/35 lb plate)\n30 Box Jumps (24/20 in)\n20 Wall Balls Shots (20/14 lb, 10/9 ft)\n10 Handstand Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 126;
    exercise.name = 'Bowen';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n800 meter Run\n7 Deadlifts (275/185 lb)\n10 Burpee Pull-Ups\n14 Single Arm Kettlebell Thrusters (1.5/1 pood)\n20 Box Jumps (24/20 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 127;
    exercise.name = 'Bradley';
    exercise.type='time';
    exercise.wod = '10 Rounds For TIme\n100 meter Sprint\n10 Pull-Ups\n100 meter Sprint\n10 Burpees\n30 seconds Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 128;
    exercise.name = 'Bradshaw';
    exercise.type='time';
    exercise.wod = '10 Rounds for Time\n3 Handstand Push-Ups\n6 Deadlift (225/155 lb)\n12 Pull-Ups\n24 Double-Unders';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 129;
    exercise.name = 'Brehm';
    exercise.type='time';
    exercise.wod = 'For Time\n10 Rope Climbs (15 ft)\n20 Back Squats (225 lb)\n30 Handstand Push-Ups\n40 calorie Row';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 130;
    exercise.name = 'Brenton';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\nBear Crawl (100 ft)\nStanding Broad-Jumps (100 ft)\nPerform 3 Burpees after every 5 Broad-Jumps\nWear a Weight Vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 131;
    exercise.name = 'Brian';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n5 Rope Climbs (15 ft)\n25 Back Squats (185/135 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 132;
    exercise.name = 'Bruck';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n400 meter Run\n24 Back Squats (185/135 lb)\n24 Jerks (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 133;
    exercise.name = 'Bulger';
    exercise.type='time';
    exercise.wod = '10 Rounds For Time\n150 Meter Run\n7 Chest-to-Bar Pull-Ups\n7 Front Squats (135/95 lbs)\n7 Handstand Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 134;
    exercise.name = 'Bull';
    exercise.type='time';
    exercise.wod = '2 Rounds For Time\n200 Double-Unders\n50 Overhead Squats (135/95 lb)\n50 Pull-Ups\n1 mile Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 135;
    exercise.name = 'Cameron';
    exercise.type='time';
    exercise.wod = 'For Time\n50 Walking Lunges\n25 Chest-to-Bar Pull-Ups\n50 Box Jumps (24/20 in)\n25 Triple-Unders\n50 Back Extensions\n25 Ring Dips\n50 Knees-to-Elbows\n25 Wall Ball - 2-for-1s (20/14 lb)\n50 Sit-Ups\n5 Rope Climb (15 ft)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 136;
    exercise.name = 'Capoot';
    exercise.type='time';
    exercise.wod = 'For Time\n100 Push-Ups\n800 meter Run\n75 Push-Ups\n1,200 meter Run\n50 Push-Ups\n1,600 meter Run\n25 Push-Ups\n2,000 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 137;
    exercise.name = 'Carse';
    exercise.type='time';
    exercise.wod = '21-18-15-12-9-6-3 Reps for Time\nSquat Clean (95/65 lb)\nDouble-Unders\nDeadlift (185/135 lb)\nBox Jump (24/20 in)\nStart each round with a 50 meter Bear crawl';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 138;
    exercise.name = 'Chad';
    exercise.type='time';
    exercise.wod = 'For Time (in a Team of 4)\n400 meter Weighted Walk/Run (190 lb) (together)\n25 Deadlifts (100 lb) (each)\n400 meter Weighted Walk/Run (190 lb) (together)\n25 Thrusters (45 lb) (each)\n400 meter Weighted Walk/Run (190 lb) (together)\n25 Sandbag Front Squats (50 lb) (each)\n400 meter Weighted Walk/Run (190 lb) (together)\n25 Push Presses (45 lb) (each)\n400 meter Weighted Walk/Run (190 lb) (together)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 139;
    exercise.name = 'Clovis';
    exercise.type='time';
    exercise.wod = 'For Time\n10 mile Run\n150 Burpee Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 140;
    exercise.name = 'Coe';
    exercise.type='time';
    exercise.wod = '10 Rounds For Time\n10 Thrusters (95/65 lb)\n10 Ring Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 141;
    exercise.name = 'Coffey';
    exercise.type='time';
    exercise.wod = 'For Time\n800 meter Run\n50 Back Squats (135/95 lb)\n50 Bench Press (135/95 lb)\n800 meter Run\n35 Back Squat (135/95 lb)\n35 Bench Press (135/95 lb)\n800 meter Run\n20 Back Squat (135/95 lb)\n20 Bench Press (135/95 lb)\n800 meter Run\n1 Muscle-Up';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 142;
    exercise.name = 'Coffland';
    exercise.type='time';
    exercise.wod = 'For Time\n6 minute Hang Hold (cumulative)\nEach time you drop from the bar, perform:\n800 meter Run\n30 Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 143;
    exercise.name = 'Collin';
    exercise.type='time';
    exercise.wod = '6 Rounds For TIme\n400 meter Sandbag Carry (50/40 lb)\n12 Push Press (115/75 lbs)\n12 Box Jumps (24/20 in)\n12 Sumo Deadlift High-Pull (95/65 lbs)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 144;
    exercise.name = 'Crain';
    exercise.type='time';
    exercise.wod = '2 Rounds For Time\n34 Push-Ups\n50 yard Sprint\n34 Deadlifts (135/95 lb)\n50 yard Sprint\n34 Box Jumps (24/20 in)\n50 yard Sprint\n34 Clean-and-Jerks (95/65 lb)\n50 yard Sprint\n34 Burpees\n50 yard Sprint\n34 Wall Ball Shots (20/14 lb)\n50 yard Sprint\n34 Pull-Ups\n50 yard Sprint';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 145;
    exercise.name = 'DG';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 10 minutes\n8 Toes-to-Bar\n8 Dumbbell Thrusters (35/25 lb)\n12 Dumbbell Walking Lunges (35/25 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 146;
    exercise.name = 'DT';
    exercise.type='time';
    exercise.wod = '5 rounds for time:\n12 Deadlift (155lbs)\n9 Hang Power Clean (155lbs)\n6 Push Jerk (155lbs)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 147;
    exercise.name = 'DVB';
    exercise.type='time';
    exercise.wod = 'For Time\n1 mile Run with medicine ball (20/14 lb)\nThen 8 Rounds of:\n10 Wall Ball Shots (20/14 lb)\n1 Rope Climb (15 ft)\nThen, 800 meter Run with medicine ball (20/14 lb)\nThen 4 Rounds of:\n10 Wall Ball Shots (20/14 lb)\n1 Rope Climb (15 ft)\nThen, 400 meter Run with medicine ball (20/14 lb)\nThen 2 Rounds of:\n10 Wall Ball Shots (20/14 lb)\n1 Rope Climb (15 ft)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 148;
    exercise.name = 'Dae Han';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n800 meter Run (with 45/35 lb barbell)\n3 Rope Climbs (15 ft)\n12 Thrusters (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 149;
    exercise.name = 'Dallas 5';
    exercise.type='rep';
    exercise.wod = 'Five 5-minute AMRAPs in 29 minutes\nAMRAP from 0:00-5:00:\nBurpees\nAMRAP from 6:00-11:00:\n7 Deadlifts (155/105 lb)\n7 Box Jumps (24/20 in)\nAMRAP from 12:00-17:00:\nTurkish Get-Ups (40/30 lb Dumbbell)\nAMRAP from 18:00-23:00:\n7 Snatches (75/55 lb)\n7 Push-Ups\nAMRAP from 24:00-29:00:\nRow (calories)\nRest 1 minute between each AMRAP station';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 150;
    exercise.name = 'Daniel';
    exercise.type='time';
    exercise.wod = 'For Time\n50 Pull-Ups\n400 meter Run\n21 Thrusters (95/65 lb)\n800 meter Run\n21 Thrusters (95/65 lb)\n400 meter Run\n50 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 151;
    exercise.name = 'Danny';
    exercise.type='rounds';
    exercise.wod = 'AMRAP in 20 minutes\n30 Box Jumps (24/20 in)\n20 Push Press (115/75 lb)\n30 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 152;
    exercise.name = 'Del';
    exercise.type='time';
    exercise.wod = 'For Time\n25 Burpees\n400 meter Run (20/14 lb medicine ball)\n25 Weighted Pull-Ups (20/15 lb dumbbell)\n400 meter Run (20/14 lb medicine ball)\n25 Handstand Push-Ups\n400 meter Run (20/14 lb medicine ball)\n25 Chest-to-Bar Pull-Ups\n400 meter Run (20/14 lb medicine ball)\n25 Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 153;
    exercise.name = 'Desforges';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n12 Deadlifts (225/155 lb)\n20 Pull-Ups\n12 Clean-and-Jerks (135/95 lb)\n20 Knees-to-Elbows';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 154;
    exercise.name = 'Dobogai';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n8 Muscle-Ups\n22 Yard Farmer Carry (50/40 lb dumbells)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 156;
    exercise.name = 'Donny';
    exercise.type='time';
    exercise.wod = '21-15-9-9-15-21 Reps, For Time\nDeadlifts (225/155 lb)\nBurpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 157;
    exercise.name = 'Dork';
    exercise.type='time';
    exercise.wod = '6 Rounds for Time\n60 Double-Unders\n30 Kettlebell Swings (1.5/1 pood)\n15 Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 158;
    exercise.name = 'Dragon';
    exercise.type='time';
    exercise.wod = 'For Time\n5k Run\n4 minutes to find 4 rep max Deadlift\n5k Run\n4 minutes to find 4 rep max Push Jerk';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 159;
    exercise.name = 'Dunn';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 19 minutes\n3 Muscle-Ups\nShuttle Sprint (5, 10, 15 yards)\n6 Burpee Box Jump Overs (20 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 160;
    exercise.name = 'Emily';
    exercise.type='time';
    exercise.wod = '10 Rounds for Time\n30 Double-Unders\n15 Pull-Ups\n30 Air Squats\n100 meter Sprint\n2 minute Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 161;
    exercise.name = 'Erin';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n15 Dumbbell Split Cleans (40/30 lb)\n21 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 162;
    exercise.name = 'Falkel';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 25 minutes\n8 Handstand Push-Ups\n8 Box Jump (30/24 in)\n1 Rope Climb (15 ft)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 163;
    exercise.name = 'Feeks';
    exercise.type='time';
    exercise.wod = '2-4-6-8-10-12-14-16 Reps For Time\n100 meter Shuttle Sprint\nDumbbell Clusters (65/45 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 164;
    exercise.name = 'Foo';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 20 minutes\n7 Chest-To-Bar Pull-Ups\n77 Double-Unders\n2 Squat Clean Thrusters (170/125 lb)\n28 Sit-Ups\nBuy in:13 Bench Presses (170/125 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 165;
    exercise.name = 'Forrest';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n20 L-Pull-Ups\n30 Toes-to-Bar\n40 Burpees\n800 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 166;
    exercise.name = 'GI Jane';
    exercise.type='time';
    exercise.wod = 'For Time\n100 Burpee Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 167;
    exercise.name = 'Gallant';
    exercise.type='time';
    exercise.wod = 'For Time\n1 mile Medicine Ball Run (20/14 lb)\n60 Burpee Pull-Ups\n800 meter Medicine Ball Run (20/14 lb)\n30 Burpee Pull-Ups\n400 meter Medicine Ball Run (20/14 lb)\n15 Burpee Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 168;
    exercise.name = 'Garrett';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n75 Air Squats\n25 Ring Handstand Push-Ups\n25 L-Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 169;
    exercise.name = 'Gator';
    exercise.type='time';
    exercise.wod = '8 Rounds For Time\n5 Front Squat (185 lb)\n26 Ring Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 170;
    exercise.name = 'Gaza';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n35 Kettlebell Swings (1.5/1 pood)\n30 Push-Ups\n25 Pull-Ups\n20 Box Jumps (30/24 in)\n1 mile Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 171;
    exercise.name = 'Glen';
    exercise.type='time';
    exercise.wod = 'For Time\n30 Clean-and-Jerks (135/95 lb)\n1 mile Run\n10 Rope Climb (15 ft)\n1 mile Run\n100 Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 172;
    exercise.name = 'Griff';
    exercise.type='time';
    exercise.wod = 'For Time\n800 meter Run\n400 meter Run (backwards)\n800 meter Run\n400 meter Run (backwards)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 173;
    exercise.name = 'Gunny';
    exercise.type='time';
    exercise.wod = 'For Time\n1 mile Weighted Run\n50 Push-Ups\n50 Sit-Ups\n1 mile Weighted Run\n50 Push-Ups\n50 Sit-Ups\n1 mile Weighted Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 174;
    exercise.name = 'Hall';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n3 Cleans (225/155 lb)\n200 meter Sprint\n20 Kettlebell Snatches (1.5/1 pood) (10 each arm)\n2 minutes Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 175;
    exercise.name = 'Hamilton';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n1000 meter Row\50 Push-Ups\n1000 meter Run\n50 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 176;
    exercise.name = 'Hammer';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n5 Power Cleans (135/95 lb)\n10 Front Squats (135/95 lb)\n5 Jerks (135/95 lb)\n20 Pull-Ups\n90 seconds Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 177;
    exercise.name = 'Hansen';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n30 Kettlebell Swings (2/1.5 pood)\n30 Burpees\n30 GHD Sit-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 178;
    exercise.name = 'Harper';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 23 minutes\n9 Chest-to-Bar Pull-Ups\n15 Power Cleans (135/95 lb)\n21 Air Squats\n400 meter Run with a Plate (45/35 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 179;
    exercise.name = 'Havana';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 25 minutes\n150 Double-Unders\n50 Push-Ups\n15 Power Cleans (185/125 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 180;
    exercise.name = 'Helton';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n800 meter Run\n30 Dumbbell Squat Cleans (50/35 lb)\n30 Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 181;
    exercise.name = 'Hidalgo';
    exercise.type='time';
    exercise.wod = 'For Time\n2 Mile Run\n2 Minutes Rest\n20 Squat Cleans (135/95 lb)\n20 Box Jumps (24/20 in)\n20 Overhead Walking Lunges (45/25 lb plate)\n20 Box Jumps (24/20 in)\n20 Squat Cleans (135/95 lb)\n2 minutes Rest\n2 mile Run\nWear a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 182;
    exercise.name = 'Hildy';
    exercise.type='time';
    exercise.wod = 'For Time\n100 calorie Row\n75 Thrusters (45/35 lb barbell)\n50 Pull-Ups\n75 Wall Ball Shots (20/14 lb)\n100 calorie Row\nWith a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 183;
    exercise.name = 'Holbrook';
    exercise.type='time';
    exercise.wod = '10 Rounds For Time\n5 Thrusters (115/85 lb)\n10 Pull-Ups\n100 meter Sprint\n1 minute Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 184;
    exercise.name = 'Holleyman';
    exercise.type='time';
    exercise.wod = '30 Rounds For Time\n5 Wall Balls (20/14 lb)\n3 Handstand Push-Ups\n1 Power Clean (225/155 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 185;
    exercise.name = 'Hollywood';
    exercise.type='time';
    exercise.wod = 'For Time\n2 km Run\n22 Wall Ball Shots (30/20 lb)\n22 Muscle-Ups\n22 Wall Ball Shots (30/20 lb)\n22 Power Cleans (185/135 lb)\n22 Wall Ball Shots (30/20 lb)\n2 km Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 186;
    exercise.name = 'Hortman';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 45 minutes\n800 meter Run\n80 Air Squats\n8 Muscle-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 187;
    exercise.name = 'Horton';
    exercise.type='time';
    exercise.wod = '9 Rounds for Time (with a Partner)\n9 Bar Muscle-Ups\n11 Clean-and-Jerks (155/115 lb)\n50 yard Buddy Carry';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 188;
    exercise.name = 'JJ.';
    exercise.type='time';
    exercise.wod = 'For Time\n1 Squat Clean (185/135 lb)\n10 Parallette Handstand Push-Ups (6" Deficit)\n2 Squat Cleans (185/135 lb)\n9 Parallette Handstand Push-Ups (6" Deficit)\n3 Squat Cleans (185/135 lb)\n8 Parallette Handstand Push-Ups (6" Deficit)\n4 Squat Cleans (185/135 lb)\n7 Parallette Handstand Push-Ups (6" Deficit)\n5 Squat Cleans (185/135 lb)\n6 Parallette Handstand Push-Ups (6" Deficit)\n6 Squat Cleans (185/135 lb)\n5 Parallette Handstand Push-Ups (6" Deficit)\n7 Squat Cleans (185/135 lb)\n4 Parallette Handstand Push-Ups (6" Deficit)\n8 Squat Cleans (185/135 lb)\n3 Parallette Handstand Push-Ups (6" Deficit)\n9 Squat Cleans (185/135 lb)\n2 Parallette Handstand Push-Ups (6" Deficit)\n10 Squat Cleans (185/135 lb)\n1 Parallette Handstand Push-Up (6" Deficit)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 189;
    exercise.name = 'JBO';
    exercise.type='rounds';
    exercise.wod = 'AMRAP in 28 minutes\n9 Overhead Squats (115/75 lb)\n1 Legless Rope Climb (15 ft rope, from seated position)\n12 Bench Presses (115/75 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 190;
    exercise.name = 'JT';
    exercise.type='time';
    exercise.wod = '21-15-9 Reps For Time\nHandstand Push-Ups\nRing Dips\nPush-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 191;
    exercise.name = 'Jack';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 20 minutes\n10 Push Presses (115/85 lb)\n10 Kettlebell Swings (1.5/1 pood)\n10 Box Jumps (24/20 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 192;
    exercise.name = 'Jag 28';
    exercise.type='time';
    exercise.wod = 'For Time\n800 meter Run\n28 Kettlebell Swings (2/1.5 pood)\n28 Strict Pull-Ups\n28 Kettlebell Clean-and-Jerk (2 x 2/1.5 pood)\n28 Strict Pull-Ups\n800 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 193;
    exercise.name = 'Jared';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n800 meter Run\n40 Pull-Ups\n70 Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 194;
    exercise.name = 'Jason';
    exercise.type='time';
    exercise.wod = 'For Time\n100 Air Squats\n5 Muscle-Ups\n75 Air Squats\n10 Muscle-Ups\n50 Air Squats\n15 Muscle-Ups\n25 Air Squats\n20 Muscle-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 195;
    exercise.name = 'Jennifer';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 26 minutes\n10 Pull-Ups\n15 Kettlebell Swings (1.5/1 Pood)\n20 Box Jumps (24/20 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 196;
    exercise.name = 'Jenny';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 20 minutes\n20 Overhead Squats (45/35 lb bar)\n20 Back Squats (45/35 lb bar)\n400 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 197;
    exercise.name = 'Johnson';
    exercise.type='rounds';
    exercise.wod = 'AMRAP in 20 minutes\n9 Deadlifts (245/165 lb)\n8 Muscle-Ups\n9 Squat Clean (155/105 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 198;
    exercise.name = 'Jorge';
    exercise.type='time';
    exercise.wod = 'For Time\n30 GHD Sit-Ups\n15 Squat Cleans (155/105 lb)\n24 GHD Sit-Ups\n12 Squat Cleans (155/105 lb)\n18 GHD Sit-Ups\n9 Squat Cleans (155/105 lb)\n12 GHD Sit-Ups\n6 Squat Cleans (155/105 lb)\n6 GHD Sit-Ups\n3 Squat Cleans (155/105 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 199;
    exercise.name = 'Josh';
    exercise.type='time';
    exercise.wod = 'For Time\n21 Overhead Squats (95/65 lb)\n42 Pull-Ups\n15 Overhead Squats (95/65 lb)\n30 Pull-Ups\n9 Overhead Squats (95/65 lb)\n18 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 200;
    exercise.name = 'Joshie';
    exercise.type='time';
    exercise.wod = '3 Rounds for Time\n21 Dumbbell Squat Snatches, Right Arm (40/25 lb)\n21 L Pull-Ups\n21 Dumbbell Squat Snatches, Left Arm (40/25 lb)\n21 L Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 201;
    exercise.name = 'Josie';
    exercise.type='time';
    exercise.wod = 'For Time\n1 mile Run\nThen, 3 Rounds of:\n30 Burpees\n4 Power Cleans (155/105 lb)\n6 Front Squats (155/105 lb)\nThen, 1 mile Run\nWear a Weight Vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 202;
    exercise.name = 'Justin';
    exercise.type='time';
    exercise.wod = '30-20-10 Reps for Time\nBack Squats (bodyweight)\nBench Presses (bodyweight)\nStrict Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 203;
    exercise.name = 'Kev';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP (with a Partner) in 26 minutes\n6 Deadlifts (315/205 lb), each\n9 Bar-Facing Burpees, synchronized\n9 Bar Muscle-Ups, each\n55 ft Partner Barbell Carry (315/205 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 204;
    exercise.name = 'Kevin';
    exercise.type='time';
    exercise.wod = '3 Rounds for Time\n32 Deadlifts (185/135 lbs)/n32 Hanging Hip Touches (alternating arms)\n800m Running Farmer Carry (15 lb dumbbells)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 205;
    exercise.name = 'Klepto';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n27 Box Jumps (24/20 in)\n20 Burpees\n11 Squat Cleans (145/100 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 206;
    exercise.name = 'Kutschbach';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n11 Back Squats (185/135 lb)\n10 Jerks (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 207;
    exercise.name = 'ledesma';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 20 minutes\n5 Parallette Handstand Push-Ups (6" Deficit)\n10 Toes Through Rings\n15 Medicine Ball Cleans (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 208;
    exercise.name = 'Lee';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n400 meter Run\n1 Deadlift (345/225 lb)\n3 Squat Cleans (185/135 lb)\n5 Push Jerks (185/135 lb)\n3 Muscle-Ups\n1 Rope Climb (15 ft)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 209;
    exercise.name = 'Liam';
    exercise.type='time';
    exercise.wod = 'For Time\n800 meter Run (with 45 lb Plate)\n100 Toes-to-Bars\n50 Front Squats (155/105 lb)\n10 Rope Climbs (15 ft)\n800 meter Run (with 45 lb Plate)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 210;
    exercise.name = 'Loredo';
    exercise.type='time';
    exercise.wod = '6 Rounds For Time\n24 Air Squats\n24 Push-Ups\n24 Walking Lunges\n400 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 211;
    exercise.name = 'Luce';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n1000 meter Run\n10 Muscle-Ups\n100 Air Squats';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 212;
    exercise.name = 'Luke';
    exercise.type='time';
    exercise.wod = 'For Time400 meter Run\n15 Clean-and-Jerks (155/105 lb)\n400 meter Run\n30 Toes-to-Bars\n400 meter Run\n45 Wall Ball Shots (20/14 lb)\n400 meter Run\n45 Kettlebell Swings (1.5/1 pood)\n400 meter Run\n30 Ring Dips\n400 meter Run\n15 Weighted Lunge Steps (155/105 lb)\n400 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 213;
    exercise.name = 'Lumberjack 20';
    exercise.type='time';
    exercise.wod = 'For Time\n20 Deadlifts (275/185 lb)\n400 meter Run\n20 Kettlebell Swings (2/1.5 pood)\n400 meter Run\n20 Overhead Squats (115/75 lb)\n400 meter Run\n20 Burpees\n400 meter Run\n20 Chest-to-Bar Pull-Ups\n400 meter Run\n20 Box Jumps (24/20 in)\n400 meter Run\n20 Dumbbell Squat Cleans (45/35 lb)\n400 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 214;
    exercise.name = 'Manion';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n400 meter Run\n29 Back Squats (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 215;
    exercise.name = 'Manuel';
    exercise.type='rep';
    exercise.wod = '5 Rounds for Reps in 50 minutes\n3 minutes of Max Rope Climbs\n2 minutes of Max Air Squats\n2 minutes of Max Push-Ups\n3 minutes to Run 400 meters\nWear a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 216;
    exercise.name = 'Marco';
    exercise.type='time';
    exercise.wod = '3 Rounds for Time\n21 Pull-Ups\n15 Handstand Push-Ups\n9 Thrusters (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 217;
    exercise.name = 'Marston';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 20 minutes\n1 Deadlift (405/285 lb)\n10 Toes-to-Bar\n15 Bar Facing Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 218;
    exercise.name = 'Matt 16';
    exercise.type='time';
    exercise.wod = 'For Time\n16 Deadlifts (275 lb)\n16 Hang Power Cleans (185 lb)\n16 Push Presses (135 lb)\n800 meter Run\n16 Deadlifts (275 lb)\n16 Hang Power Cleans (185 lb)\n16 Push Presses (135 lb)\n800 meter Run\n16 Deadlifts (275 lb)\n16 Hang Power Cleans (185 lb)\n16 Push Presses (135 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 219;
    exercise.name = 'Maupin';
    exercise.type='time';
    exercise.wod = '4 Rounds for Time\n800 meter Run\n49 Push-Ups\n49 Sit-Ups\n49 Air Squats';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 220;
    exercise.name = 'McCluskey';
    exercise.type='time';
    exercise.wod = '3 Rounds For TIme\n9 Muscle-Ups\n15 Burpee Pull-Ups\n21 Pull-Ups\n800 meter Run\nWear a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 221;
    exercise.name = 'Mcghee';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 30 minutes\n5 Deadlifts (275/185 lb)\n13 Push-Ups\n9 Box Jumps (24/20 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 222;
    exercise.name = 'Meadows';
    exercise.type='time';
    exercise.wod = 'For Time\n20 Muscle-Ups\n25 Lowers from Inverted Hang on the Rings\n30 Ring Handstand Push-Ups\n35 Ring Rows\n40 Ring Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 223;
    exercise.name = 'Michael';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n800 meter Run\n50 Back Extensions\n50 Sit-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 224;
    exercise.name = 'Miron';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time:\n800 meter Run\n23 Back Squats (¾ Body Weight)\n13 Deadlifts (1 ½ Body Weight)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 225;
    exercise.name = 'Monti';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n50 Box Step-Ups (45/35 lb barbell, 20" box)\n15 Cleans (135/95 lb)\n50 Box Step-Ups (45/35 lb barbell, 20" box)\n10 Snatches (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 226;
    exercise.name = 'Moon';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n10 Hang Split Snatch, Right Arm (40/30 lb)\n1 Rope Climb (15 ft)\n10 Hang Split Snatch, Left Arm (40/30 lb)\n1 Rope Climb (15 ft)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 227;
    exercise.name = 'Moore';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 20 minutes\n1 Rope Climb (15 ft)\n400 meter Run\nMax Reps Handstand Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 228;
    exercise.name = 'Morrison';
    exercise.type='time';
    exercise.wod = '50-40-30-20-10 Reps For Time\nWall Ball Shots (20/14 lb)\nBox Jumps (24/20 in)\nKettlebell Swings (1.5/1 pood)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 229;
    exercise.name = 'Mr. Joshua';
    exercise.type='time';
    exercise.wod = 'Five Rounds for Time\n400 Meter Run\n30 GHD Sit-Ups\n15 Deadifts (250/165 lbs)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 230;
    exercise.name = 'Murph';
    exercise.type='time';
    exercise.wod = 'For Time\n1 mile Run\n100 Pull-Ups\n200 Push-Ups\n300 Air Squats\n1 mile Run\nAll with a Weight Vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 231;
    exercise.name = 'Nate';
    exercise.type='rounds';
    exercise.wod = 'AMRAP in 20 minutes\n2 Muscle-Ups\n4 Handstand Push-Ups\n8 Kettlebell Swings (2/1.5 pood)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 232;
    exercise.name = 'Ned';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n11 Back Squats (bodyweight)\n1,000 meter Row';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 233;
    exercise.name = 'Nick';
    exercise.type='time';
    exercise.wod = '12 Rounds For Time\n10 Dumbbell Hang Squat Clean (45/35 lb)\n6 Handstand Push-Ups on Dumbbells';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 234;
    exercise.name = 'Nickman';
    exercise.type='time';
    exercise.wod = '10 Rounds For Time\n200 meter Farmers Carry (55/35 lb)\n10 Weighted Pull-Ups (35/25 lb)\n20 Dumbbell Power Snatches (55/35 lb), alternating';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 235;
    exercise.name = 'Nukes';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 30 minutes\nFrom 0:00-8:00\n1 mile Run\nMax Deadlifts (315/205 lb)\nFrom 8:00-18:00\n1 mile Run\nMax Power Cleans (225/155 lb)\nFrom 18:00-30:00\n1 mile Run\nMax Overhead Squats (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 236;
    exercise.name = 'Nutts';
    exercise.type='time';
    exercise.wod = 'For Time\n10 Handstand Push-Ups\n15 Deadlifts (250/175 lb)\nn25 Box Jumps (30/24 in)\n50 Pull-Ups\n100 Wall Ball Shots (20/14 lb)\n200 Double-Unders\n400 meter Run (with 45/35 lb plate)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 237;
    exercise.name = 'Omar';
    exercise.type='time';
    exercise.wod = 'For Time\n10 Thrusters (95/65 lb)\n15 Bar-Facing Burpees\n20 Thrusters (95/65 lb)\n25 Bar-Facing Burpees\n30 Thrusters (95/65 lb)\n35 Bar-Facing Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 238;
    exercise.name = 'Ozzy';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n11 Deficit Handstand Push-Ups (6/4 in)\n1,000 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 239;
    exercise.name = 'PK';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n10 Back Squats (225/155 lbs)\n10 Deadlifts (275/185 lbs)\n400 meter Sprint\n2 minutes Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 240;
    exercise.name = 'Pat';
    exercise.type='roundsReps';
    exercise.wod = '6 Rounds for Time\n25 Pull-Ups\n50 ft Front-Rack Lunges (75/55 lb)\n25 Push-Ups\n50 ft Front-Rack Lunges (75/55 lb)\nAll while wearing a Weight Vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 241;
    exercise.name = 'Paul';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n50 Double-Unders\n35 Knees-to-Elbows\n20 yard Overhead Walk (185/135 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 242;
    exercise.name = 'Paul Pena';
    exercise.type='time';
    exercise.wod = '7 Rounds for Time\n100 meter Sprint\n19 Kettlebell Swings (2/1.5 pood)\n10 Burpee Box Jumps (24/20 in)\n3 minutes Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 243;
    exercise.name = 'Pheezy';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n5 Front Squats (165/105 lb)\n18 Pull-Ups\n5 Deadlifts (225/155 lb)\n18 Toes-to-Bar\n5 Push Jerks (165/105 lb)\n18 Hand-Release Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 244;
    exercise.name = 'Pike';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n20 Thrusters (75/55 lb)\n10 Strict Ring Dips\n20 Push-Ups\n10 Strict Handstand Push-Ups\n50 meter Bear Crawl';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 245;
    exercise.name = 'RJ';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n800 meter Run\n5 Rope Climb (15 ft)\n50 Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 246;
    exercise.name = 'Rahoi';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 12 minutes\n12 Box Jumps (24 in/20 in)\n6 Thrusters (95 lbs/65 lb)\n6 Bar-Facing Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 247;
    exercise.name = 'Ralph';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n8 Deadlifts (250/175 lb)\n16 Burpees\n3 Rope Climbs (15 ft)\n600 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 248;
    exercise.name = 'Randy';
    exercise.type='time';
    exercise.wod = 'For Time\n75 Power Snatches (75/55 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 249;
    exercise.name = 'Rankel';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 20 minutes\n6 Deadlifts (225/155 lb)\n7 Burpee Pull-Ups\n10 Kettlebell Swings (2/1.5 pood)\n200 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 250;
    exercise.name = 'René';
    exercise.type='time';
    exercise.wod = '7 Rounds for Time\n400 meter Run\n21 Walking Lunges\n15 Pull-Ups\n9 Burpees\nWear a Weight Vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 251;
    exercise.name = 'Rich';
    exercise.type='time';
    exercise.wod = 'For Time\n13 Squat Snatches (155/105 lb)\nThen, 10 Rounds of:\n10 Pull-Ups\n100 meter Sprint\nThen, 13 Squat Cleans (155/105 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 252;
    exercise.name = 'Ricky';
    exercise.type='rep';
    exercise.wod = 'AMRAP in 20 minutes\n10 Pull-Ups\n5 Dumbbell Deadlifts (75/55 lb)\n8 Push-Press (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 253;
    exercise.name = 'Riley';
    exercise.type='time';
    exercise.wod = 'For Time\n1.5 mile Run\n150 Burpees\n1.5 mile Run\nWear a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 254;
    exercise.name = 'Robbie';
    exercise.type='time';
    exercise.wod = 'AMRAP in 25 minutes\n8 Freestanding Handstand Push-Ups\n1 L-Sit Rope Climb (15 foot)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 255;
    exercise.name = 'Rocket';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 30 minutes\n50 meter Swim\n10 Push-Ups\n15 Air Squats';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 256;
    exercise.name = 'Roney';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n200 meter Run\n11 Thrusters (135/95 lb)\n200 meter Run\n11 Push Presses (135/95 lb)\n200 meter Run\n11 Bench Presses (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 257;
    exercise.name = 'Roy';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n15 Deadlift (225/155 lb)n20 Box Jumps (24/20 in)\n25 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 258;
    exercise.name = 'Ryan';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n\n7 Muscle-Ups\n21 Target Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 259;
    exercise.name = 'Santiago';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n18 Dumbbell Hang Squat Clean (35/25 lb)\n18 Pull-Ups\n10 Power Clean (135/95 lb)\n10 Handstand Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 260;
    exercise.name = 'Santora';
    exercise.type='rep';
    exercise.wod = '3 Rounds For Max Reps in 17 minutes\n1 minute Squat Cleans (155/105 lb)\n1 minute Shuttle Sprints (20 ft forward, 20 ft backwards)\n1 minute Deadlifts (245/165 lb)\n1 minute Burpees\n1 minute Jerks (155/105 lb)\n1 minute Rest between rounds';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 261;
    exercise.name = 'Scooter';
    exercise.type='roundsReps';
    exercise.wod = 'With a Running Clock in 35 minutes\nFirst, AMRAP in 30 minutes (with a Partner)\n30 Double-Unders\n15 Pull-Ups\n15 Push-Ups\n100 meter Sprint\nPartners alternate rounds\nThen, 5 minutes to find a 1-rep-max Partner Deadlift';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 262;
    exercise.name = 'Scotty';
    exercise.type='roundsReps';
    exercise.wod = '10 Rounds for Time\n10 meter Farmers Carry (2/1.5 pood)\n5 Strict Chin-Ups\n10 meter Farmers Carry (2/1.5 pood)\n5 Burpees\n5 Deadlifts (265/185 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 263;
    exercise.name = 'Sean';
    exercise.type='time';
    exercise.wod = '10 Rounds For Time\n11 Chest-to-Bar Pull-Ups\n22 Front Squats (75/55 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 264;
    exercise.name = 'Servais';
    exercise.type='time';
    exercise.wod = 'For Time\n1.5 mile Run\nThen 8 rounds of:\n19 Pull-Ups\n19 Push-Ups\n19 Burpees\nThen,\n400 meter Sandbag Carry (heavy)\n1-mile Farmers Carry (45/35 lb dumbbells)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 265;
    exercise.name = 'Severin';
    exercise.type='time';
    exercise.wod = 'For Time\n50 Strict Pull-Ups\n100 Hand-Release Push-Ups\n5k Run\nWear a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 266;
    exercise.name = 'Sham';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n11 Deadlifts (bodyweight)\n100 meter Sprint';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 267;
    exercise.name = 'Shawn';
    exercise.type='time';
    exercise.wod = 'For Time\n5 mile Run\nAfter each 5 minute run interval:\n50 Air Squats\n50 Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 268;
    exercise.name = 'Ship';
    exercise.type='time';
    exercise.wod = '9 Rounds For Time\n\n7 Squat Clean (185/135 lb)\n8 Burpee Box Jump (36/30 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 269;
    exercise.name = 'Sisson';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 20 minutes\n1 Rope Climb (15 ft)\n5 Burpees\n200 meter Run\nWear a weight vest (20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 270;
    exercise.name = 'Small';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n1000 meter Row\n50 Burpees\n50 Box Jumps (24/20 in)\n800 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 271;
    exercise.name = 'Smykowski';
    exercise.type='time';
    exercise.wod = 'For Time\n6 km Run\n60 Burpee Pull-Ups\nWear a weight vest (30/20 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 272;
    exercise.name = 'Spehar';
    exercise.type='time';
    exercise.wod = 'For Time\n100 Thrusters (135/95 lb)\n\n100 Chest-to-Bar Pull-Ups\n6 mile Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 273;
    exercise.name = 'Stephen';
    exercise.type='time';
    exercise.wod = 'For Time\n30-25-20-15-10-5 Reps of:\nGHD Sit-Ups\nBack Extensions\nKnees-to-Elbows\nRomanian Deadlifts (95/65 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 274;
    exercise.name = 'Strange';
    exercise.type='time';
    exercise.wod = '8 Rounds For Time\n600 meter Run\n11 Weighted Pull-Ups (1.5/1 pood)\n11 Walking Lunges (1.5/1 pood)\n11 Thrusters (1.5/1 pood)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 275;
    exercise.name = 'T';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n100-meter sprint\n10 Squat Clean Thrusters (115/75 lb)\n15 Kettlebell Swings (2/1.5 pood)\n100 meter Sprint\n2 minutes Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 276;
    exercise.name = 'TJ.';
    exercise.type='time';
    exercise.wod = 'For Time\n10 Bench Presses (185/135 lb)\n10 Strict Pull-Ups\nMax Thrusters (135/95 lb)\nRepeat until you have completed 100 Thrusters.';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 277;
    exercise.name = 'T.U.P.';
    exercise.type='time';
    exercise.wod = '15-12-9-6-3 Reps For Time\nPower Cleans (135/95 lb)\nPull-Ups\nFront Squats (135/95 lb)\nPull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 278;
    exercise.name = 'TK';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 20 minutes\n8 Strict Pull-Ups\n8 Box Jumps (36/30 in)\n12 Kettlebell Swings (2/1.5 pood)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 279;
    exercise.name = 'Tama';
    exercise.type='time';
    exercise.wod = 'For Time\n800 meter Single-Arm Barbell Farmers Carry (45/35 lb)\n31 Toes-to-Bars\n31 Push-Ups\n31 Front Squats (95/65 lb)\n400 meter Single-Arm Barbell Farmers Carry (95/65 lb)\n31 Toes-to-Bars\n31 Push-Ups\n31 Hang Power Cleans (135/95 lb)\n200 meter Single-Arm Barbell Farmers Carry (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 280;
    exercise.name = 'Terry';
    exercise.type='time';
    exercise.wod = 'For Time\n1 mile Run\n100 Push-Ups\n100 meter Bear Crawl\n1 mile Run\n100 meter Bear Crawl\n100 Push-Ups\n1 mile Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 281;
    exercise.name = 'The Don';
    exercise.type='time';
    exercise.wod = 'For Time\n66 Deadlifts (110/75 lb)\n66 Box Jump (24/20 in)\n66 Kettlebell swings (1.5/1 pood)\n66 Knees-to-Elbows\n66 Sit-Ups\n66 Pull-Ups\n66 Thrusters (55/35 lb)\n66 Wall Ball Shots (20/14 lb)\n66 Burpees\n66 Double-Unders';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 282;
    exercise.name = 'The Lyon';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n7 Squat Cleans (165/115 lb)\n7 Shoulder-to-Overheads (165/115 lb)\n7 Burpee Chest-to-Bar Pull-Ups\n2 minutes Rest between rounds';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 283;
    exercise.name = 'The Seven';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n7 Handstand Push-Ups\n7 Thrusters (135/95 lb)\7 Knees-to-Elbows\n7 Deadlifts (245/165 lb)\n7 Burpees\n7 Kettlebell Swings (2/1.5 pood)\n7 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 284;
    exercise.name = 'Thompson';
    exercise.type='time';
    exercise.wod = '10 Rounds For Time\n1 Rope Climb (15 ft) (from seated)\n29 Back Squats (95/65 lb)\n10 meter Barbell Farmer Carry (135/95 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 285;
    exercise.name = 'Tiff';
    exercise.type='roundsReps';
    exercise.wod = 'With a running clock in 25 minutes\n1.5 mile Run\nThen AMRAP in remaining time:\n11 Chest-to-Bar Pull-Ups\n7 Hang Squat Cleans (155/105 lb)\n7 Push Presses (155/105 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 286;
    exercise.name = 'Tom';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 25 minutes\n7 Muscle-Ups\n11 Thrusters (155/105 lb)\n14 Toes-to-Bar';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 287;
    exercise.name = 'Tommy V';
    exercise.type='time';
    exercise.wod = 'For Time\n21 Thrusters (115/75 lb)\n12 Rope Climbs (15 ft)\n15 Thrusters (115/75 lb)\n9 Rope Climbs (15 ft)\n9 Thrusters (115/75 lb)\n6 Rope Climbs (15 ft)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 288;
    exercise.name = 'Tully';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n200 meter Swim\n23 Dumbell Squat Cleans (2 x 40/30 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 289;
    exercise.name = 'Tumilson';
    exercise.type='time';
    exercise.wod = '8 Rounds For Time\n200 meter Run\n11 Dumbbell Burpee Deadlifts (60/40 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 290;
    exercise.name = 'Tyler';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n7 Muscle-Ups\n21 Sumo-Deadlift High-Pulls (95/65 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 291;
    exercise.name = 'Viola';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 25 minutes\n3, 6, 9, 12, 15, 18 Reps and so on\nThrusters (95/65 lbs)\nPull-ups\nOver-the-Bar Burpees';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 292;
    exercise.name = 'Walsh';
    exercise.type='time';
    exercise.wod = '4 Rounds For Time\n22 Burpee Pull-Ups\n22 Back Squats (185/135 lb)\n200 meter Run (45/35 lb plate overhead)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 293;
    exercise.name = 'War Frank';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n25 Muscle-Ups\n100 Air Squats\n35 GHD Sit-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 294;
    exercise.name = 'Weaver';
    exercise.type='time';
    exercise.wod = '4 Round For Time\n10 L-Pull-Ups\n15 Push-Ups\n15 Chest-to-Bar Pull-Ups\n15 Push-Ups\n20 Pull-Ups\n15 Push-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 295;
    exercise.name = 'Wes';
    exercise.type='time';
    exercise.wod = 'For Time\n800 meter Run (with 25/15 lb Plate)\nThen:\n14 Rounds of:\n5 Strict Pull-Ups\n4 Burpee Box Jumps (24/20 in)\n3 Cleans (185/135 lb)\nThen:\n800 meter Run (with 25/15 lb Plate)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 296;
    exercise.name = 'Weston';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n1000 meter Row\n200 meter Farmer Carry (45 lb dumbbells)\n\n50 meter Waiter Walk, Right Arm (45 lb dumbbell)\n50 meter Waiter Walk, Left Arm (45 lb dumbbell)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 297;
    exercise.name = 'White';
    exercise.type='time';
    exercise.wod = 'EMOM in 23 minutes\n3 Deadlifts (230/160 lb)\n5 Strict Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 298;
    exercise.name = 'Whitten';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n22 Kettlebell Swings (2/1.5 pood)\n22 Box Jumps (24/20 in)\n400 meter Run\n22 Burpees\n22 Wall Ball Shots (10/9 ft, 20/14 lb)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 299;
    exercise.name = 'Willy';
    exercise.type='time';
    exercise.wod = '3 Rounds For TIme\n800 meter Run\n5 Front Squats (225/155 lb)\n200 meter Run\n11 Chest-to-Bar Pull-Ups\n400 meter Run\n12 Kettlebell Swings (2/1.5 pood)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 300;
    exercise.name = 'Wilmot';
    exercise.type='time';
    exercise.wod = '6 Rounds For Time\n50 Air Squats\n25 Ring Dips';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 301;
    exercise.name = 'Wittman';
    exercise.type='time';
    exercise.wod = '7 Rounds For Time\n15 Kettlebell Swings (1.5/1 pood)\n15 Power Cleans (95/65 lb)\n15 Box Jumps (24/20 in)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 302;
    exercise.name = 'Woehlke';
    exercise.type='time';
    exercise.wod = '3 Rounds, Each for Time\n4 Jerks (185/135 lb)\n5 Front Squats (185/135 lb)\n6 Power Cleans (185/135 lb)\n40 Pull-Ups\n50 Push-Ups\n60 Sit-Ups\n3 minutes Rest between rounds';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 303;
    exercise.name = 'Wood';
    exercise.type='time';
    exercise.wod = '5 Rounds For Time\n400 meter Run\n10 Burpee Box Jumps (24/20 in)\n10 Sumo-Deadlift High-pull (95/65 lbs)\n10 Thruster (95/65 lbs)\n1 minute Rest';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 304;
    exercise.name = 'Yeti';
    exercise.type='time';
    exercise.wod = 'For Time\n25 Pull-Ups\n10 Muscle-Ups\n1.5 mile Run\n10 Muscle-Ups\n25 Pull-Ups';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 305;
    exercise.name = 'Zembiec';
    exercise.type='time';
    exercise.wod = '5 Rounds for Time\n11 Back Squats (185/135 lb)\n7 Burpee Pull-Ups (Strict)\n400 meter Run';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 306;
    exercise.name = 'Zeus';
    exercise.type='time';
    exercise.wod = '3 Rounds For Time\n30 Wall Ball Shots (20/14 lb)\n30 Sumo Deadlift High-Pull (75/55 lb)\n30 Box Jump (20 in)\n30 Push Presses (75/55 lb)\n30 calorie Row\n30 Push-Ups\n10 Back Squats (Bodyweight)';
    exercises.push(exercise);

    exercise = new Object();
    exercise.benchmark = 'theHerous';
    exercise.id = 307;
    exercise.name = 'Zimmerman';
    exercise.type='roundsReps';
    exercise.wod = 'AMRAP in 25 minutes\n11 Chest-to-Bar Pull-Ups\n2 Deadlifts (315/205 lb)\n10 Handstand Push-Ups';
    exercises.push(exercise);

    $.each(exercises, function (index, item){
        $("#" + item.benchmark).append(mountExercise(index));
    });
}

function showModalPR(id){
    selectedCrossfitId = id;
    curdate = new Date();
    month = curdate.getMonth()+1;
    day = curdate.getDate();

    if (month <= 9){ month = "0" + month;}
    if (day <= 9){ day = "0" + day;}

    $('#prday').val(day);
    $('#prmonth').val(month);

    $('#modalprtitle').empty();
    $('#prtitle').empty();
    $('#modalprtitle').append(exercises[id].name);
    $("#record").val("");

    if (exercises[id].type == "load"){
        $('#prtitle').append(i18n.t("load"));
        $("#record").inputmask({mask:"9", repeat:4, greedy:!1});
    }else if (exercises[id].type == "rep"){
        $('#prtitle').append(i18n.t("repetitions"));
        $("#record").inputmask({mask:"9", repeat:3, greedy:!1});
    }else if (exercises[id].type == "time"){
        $('#prtitle').append(i18n.t("time"));
        $("#record").inputmask({mask:"99:99", greedy:!1});
    }else if (exercises[id].type == "rounds"){
        $('#prtitle').append(i18n.t("rounds"));
        $("#record").inputmask({mask:"9", repeat:3, greedy:!1});
    }else if (exercises[id].type == "roundsReps"){
        $('#prtitle').append(i18n.t("roundsReps"));
        $("#record").inputmask({mask:"9", repeat:3, greedy:!1});
    }else if (exercises[id].type == "distance"){
        $('#prtitle').append(i18n.t("distance"));
        $("#record").inputmask({mask:"9", repeat:4, greedy:!1});
    }else if (exercises[id].type == "calories"){
        $('#prtitle').append(i18n.t("calories"));
        $("#record").inputmask({mask:"9", repeat:4, greedy:!1});
    }
    
    $('#modalpr').modal('show');
    $("#record").focus();
}

function verifyPRLoad(){
    curdate = new Date();
    curYear = curdate.getFullYear();
    
    if ($("#prmonth").val() == "12" && curdate.getMonth()==0){
        curYear = curYear-1;
    }

    curdate = new Date();
    month = curdate.getMonth()+1;
    day = curdate.getDate();

    if (month <= 9){ month = "0" + month;}
    if (day <= 9){ day = "0" + day;}
    
    date = curYear + '-' + month + '-' + day;

    birthday = localStorage.token.replace(/\//g, '');
    member = localStorage.email.replace(/\//g, '');
    id = selectedCrossfitId;
    type = exercises[id].type;
    load = $("#record").val();
    load = load.replace(/_/g, '0');

    record = 0;
    lowestTime = 9999;
    withoutId = true;

    $.each(CGDataMember.personalRecords, function (index, item){
        if(item.id == exercises[id].id){
            if(type == "time"){
                newRecord = parseInt(item.record.replace(':', ''));
                if(newRecord < lowestTime){
                    lowestTime = newRecord;
                    record = item.record;
                }
            }else if (parseInt(item.record) > parseInt(record)){
                record = item.record;
            }
        }
    });

    if(type != "time"){
        if(parseInt(record) < parseInt(load)){
            changePRLoad(id);
        }else if (parseInt(record) > parseInt(load)){
            Swal.fire({
                backdrop:false,
                title: i18n.t("recordLowerthanCurrentRecord"),
                icon: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: i18n.t("confirm"),
                showCancelButton: true,
                cancelButtonColor: '#d33',
                cancelButtonText: i18n.t("cancel")
              }).then((result) => {
                if (result.value) {
                    changePRLoad(id);
                }else{
                    showError(i18n.t("recordNotUpdated"));
                }
            });
        }
    }else{
        if(lowestTime > parseInt(load.replace(':', ''))){
            changePRLoad(id);
        }else if(lowestTime < parseInt(load.replace(':', ''))){
            Swal.fire({
                backdrop:false,
                title: i18n.t("recordLowerthanCurrentRecord"),
                icon: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: i18n.t("confirm"),
                showCancelButton: true,
                cancelButtonColor: '#d33',
                cancelButtonText: i18n.t("cancel")
              }).then((result) => {
                if (result.value) {
                    changePRLoad(id);
                }else{
                    showError(i18n.t("recordNotUpdated"));
                }
            });
        }
    }
}

function changePRLoad(id){
    curdate = new Date();
    curYear = curdate.getFullYear();
    
    if ($("#prmonth").val() == "12" && curdate.getMonth()==0){
        curYear = curYear-1;
    }

    curdate = new Date();
    month = curdate.getMonth()+1;
    day = curdate.getDate();

    if (month <= 9){ month = "0" + month;}
    if (day <= 9){ day = "0" + day;}
    
    date = curYear + '-' + month + '-' + day;

    birthday = localStorage.token.replace(/\//g, '');
    member = localStorage.email.replace(/\//g, '');
    load = $("#record").val();
    load = load.replace(/_/g, '0');

    record = 0;
    lowestTime = 9999;
    withoutId = true;

    $.ajax({
        url: ENDPOINT_API + "app/newPR/"+ exercises[id].id,
        headers: {
            'memberID':localStorage.id,
            'email': localStorage.email,
            'token': localStorage.token,
            'groupID': localStorage.groupID
        },
        method: "PUT",
        dataType: "text",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({load: load, date: date})
    }).done(function(data) {
        CGDataMember.personalRecords.unshift({bmId: 0, date: date, id: exercises[id].id, record: load});
        $("#btnpr"+id).empty();
        $("#btnpr"+id).append("<b>"+load+"</b>");
        togglePRPercents(id, true);
    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + error);
    });
}

function togglePRPercents(id, showGraph){
    idTrophy = 0;
    record = 0;
    load = $('#btnpr' + id).text();

    if (isNaN(load)){
        load = 0;
    }
    
    strPr = "";
    isToShow = false;
    $('span[id^="pret"]').css("font-weight", "");
    if($('#prp' + id).is(":visible")){
        $('#iconPrChange'+id).addClass('la-angle-right');
        $('#iconPrChange'+id).removeClass('la-angle-down');
        isToShow = false;
    }else{
        isToShow = true;
        $('#pret' + id).css("font-weight", "bold");
        $('#iconPrChange'+id).removeClass('la-angle-right');
        $('#iconPrChange'+id).addClass('la-angle-down');
    }

    $('div[id^="prp"]').hide();
    
    $('#prp' + id).empty();
    strPr = '<section class="dragabblePRGraph' + id + '" style="height: 220px; margin-left: -30px">';
    if(showGraph){
        strPr += '<div style="margin-left: 5px;">';
        strPr += '<div id="sparkline'+id+'" style="padding-top: 14px;"></div>';
        strPr += '</div>';
    }

    var wod = exercises[id].wod;
    if(wod != "" && wod != null && wod != "null" && wod != undefined && wod != "undefined"){
        strPr += '<div style="margin-left: 10px;">';
        strPr += '<div id="prp' + id + '"><pre>' + wod + '</pre></div><hr>';
        strPr += '</div>';
    }
    
    if(exercises[id].benchmark == "barbell"){
        strPr += '<div if="prPercents'+ id +'" style="height: 200px; overflow: auto; margin-left: 10px">';
        strPr += '<div class="col-12 text-center row">';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_105">' + Math.round(load * 1.05) + '</span></b><br><span class="text-dark">105%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_100">' + Math.round(load * 1.00) + '</span></b><br><span class="text-dark">100%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_95">' + Math.round(load * 0.95) + '</span></b><br><span class="text-dark">95%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_90">' + Math.round(load * 0.90) + '</span></b><br><span class="text-dark">90%</span></div>';
        strPr += '</div>';
        strPr += '<br>';
        strPr += '<div class="col-12 text-center row">';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_85">' + Math.round(load * 0.85) + '</span></b><br><span class="text-dark">85%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_80">' + Math.round(load * 0.80) + '</span></b><br><span class="text-dark">80%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_75">' + Math.round(load * 0.75) + '</span></b><br><span class="text-dark">75%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_70">' + Math.round(load * 0.70) + '</span></b><br><span class="text-dark">70%</span></div>';
        strPr += '</div>';
        strPr += '<br>';
        strPr += '<div class="col-12 text-center row">';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_65">' + Math.round(load * 0.65) + '</span></b><br><span class="text-dark">65%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_60">' + Math.round(load * 0.60) + '</span></b><br><span class="text-dark">60%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_55">' + Math.round(load * 0.55) + '</span></b><br><span class="text-dark">55%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_50">' + Math.round(load * 0.50) + '</span></b><br><span class="text-dark">50%</span></div>';
        strPr += '</div>';
        strPr += '<br>';
        strPr += '<div class="col-12 text-center row">';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_45">' + Math.round(load * 0.45) + '</span></b><br><span class="text-dark">45%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_40">' + Math.round(load * 0.40) + '</span></b><br><span class="text-dark">40%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_35">' + Math.round(load * 0.35) + '</span></b><br><span class="text-dark">35%</span></div>';
        strPr += '<div class="col-3 text-center"><b><span class="text-dark" id="pr1_30">' + Math.round(load * 0.30) + '</span></b><br><span class="text-dark">30%</span></div>';
        strPr += '</div>';
        strPr += '</div>';
    }

    strPr += '<div style="height: 220px; overflow: auto">';

    var recordsArray = [];

    $.each(CGDataMember.personalRecords, function (index, item) {
        if (item.id == exercises[id].id){
            strPr += '<hr><div class="col-12 row" style="margin-left: 1px;">';
            strPr +=    '<div class="text-dark col-6 text-left" style="font-size: 15px">' + formatDateLocale(item.date) + '</div>';
            strPr +=    '<div class="text-dark col-5 text-right" style="font-size: 16px">' + item.record + ' KG</div>';
            strPr +=    '<div class="text-dark col-1 text-right" style="font-size: 17px"><span id="trophy' + item.id + '' + item.record + '"></span></div>';
            strPr += '</div>';
            
            if (parseInt(item.record) > parseInt(record)){
                idTrophy = item.id;
                record = item.record;
            }
            recordsArray.unshift(item.record.replace(":","."));
        }
    });
    
    strPr += '</div>';
    strPr += '</section>';
    strPr += '<div class="col-md-offset-3 "><table class="table"><tbody>';    
    strPr += '</tbody></table></div>';

    $('#prp' + id).append(strPr);
    
    $(".dragabblePRGraph" + id).slick({
        dots: true,
        vertical: false,
        infinite: true
    });

    if (idTrophy > 0){
        $('#trophy' + idTrophy + record).append('<i style="font-size: 23px; color: var(--main-color);" class="la la-trophy"></i>');
    }
    
    if (isToShow){
        $('#prp' + id).show();
        $("#sparkline"+id).sparkline(recordsArray, {
            type: 'line',
            width: ($("size").width() - 10),
            height: '190',
            lineColor: color,
            fillColor: shadeBlend(0.7, color),
            lineWidth: 3,
            spotColor: shadeBlend(0.09, color),
            minSpotColor: shadeBlend(0.09, color),
            maxSpotColor: shadeBlend(0.09, color),
            highlightSpotColor: color,
            spotRadius: 5,
            chartRangeMin: 0.5,
            drawNormalOnTop: false
        });
    }
}

function changeUnitMeasure(){
    localStorage.unitMeasure=$("#unitMeasure").prop('checked');
    unitMeasure=$("#unitMeasure").prop('checked');
}

function shiftRankingDate(inc){
    strDate = $("#rankingDate").text().split('/');
    dt = new Date(strDate[2], strDate[1]-1, strDate[0]);
    dt.setDate(dt.getDate() + inc);

    if (dt.getDate() < 10){
        strDate = "0" + dt.getDate();
    }else{
        strDate = dt.getDate();
    }
    strDate += "/";
    if (dt.getMonth() < 9){
        strDate += "0" + (dt.getMonth()+1);
    }else{
        strDate += (dt.getMonth()+1);
    }
    strDate += "/";
    strDate += dt.getFullYear();
    $("#rankingDate").empty();
    $("#rankingDate").append(strDate);
    loadRanking();
}

function getWodType(date){
    result = "";

    if  (localStorage.wodtype != null){
        data = JSON.parse("[" + localStorage.wodtype + "]");
        $.each(data, function (index, item) {
            if (item.date == date){
              result = item.type;
            }
        });
    }

    return result;
}

function prepareSaveResults(date){
    $('#btnSaveRecords').show();
    rankingtype = getWodType(date);

    $('#rankingscore').inputmask("");
    $('#rankingscore').val("");

    if (rankingtype == 'time'){
        $('#rankingscore').inputmask("99:99");
    }else if (rankingtype == 'repeats'){
        $('#rankingscore').inputmask("numeric");
    }else if (rankingtype == 'roundsRepets'){
        $('#rankingscore').inputmask("numeric");
    }else{
        $('#btnSaveRecords').hide();
    }
}

function loadRanking(){
    brithday = localStorage.token.replace(/\//g, '');
    date = $("#rankingDate").text().replace(/\//g, '');
    prepareSaveResults(date);
    startAnnimation();
    $.ajax({
          type: "POST",
          url: ENDPOINT_CG+"cloudgym/rest/workout/listcrossfitranking/" + $("#member").val() + "/" + brithday + "/" + localStorage.unitID + "/" + date
        }).done(function(data) {
            $("#rankingList").empty();
            $.each(data, function (index, item) {
                pos = (index+1);
                if (item[4].indexOf(':') != -1){
                    pos = (data.length - index);
                }

                strItem = '<div class="todo-tasklist-item todo-tasklist-item-border-green">';
                strItem += '         <div class="todo-tasklist-item-title pull-left">' + (index+1) + 'º&nbsp;&nbsp;&nbsp;</div>';
                strItem += '             <img class="todo-userpic pull-left" src="../images/' + localStorage.unitID + '/profile/'  + item[1] + '.png" width="27px" height="27px">';
                strItem += '         <div class="todo-tasklist-item-title">' + item[2] + '</div>';
                strItem += '     <div class="todo-tasklist-item-text pull-right">' + item[4] + '</div>';
                strItem += '</div>';
                
                if (item[4].indexOf(':') == -1){
                    $("#rankingList").append(strItem);
                }else{
                    $("#rankingList").prepend(strItem);
                }
            });
            
            stopAnnimation();
        }).fail(function(jqXHR, textStatus, error) {
            stopAnnimation();
            showError(i18n.t("errorOccurred") + error);
        });
}

function startTimer(type){
    stopCronometer();
    window.scrollTo(0, 0);
    resting = false;
    _seconds = 0;
    _minutes = 0;
    _rest = 0;
    _type = 'progressive';
    _rounds = 1;
    round = 1;
    hundredth = 0;
    seconds = 0;
    minutes = 0;

    playStartAudio();

    if (type == 'stopWhach'){
        resetCronometer();
        control = setInterval(cronometerStopWhach,10);
    }else if (type == 'emom'){
        _minutes = $("#minutesEmom").text();
        _seconds = $("#secondsEmom").text();
        _rounds = $("#roundsEmom").text();
        minutes = parseInt(_minutes);
        resetCronometer();
        control = setInterval(cronometerEmom,10);
    }else if (type == 'tabata'){
        _rest = $("#restTabata").text();
        _seconds = $("#secondsTabata").text();
        _rounds = $("#roundsTabata").text();
        resetCronometer();
        control = setInterval(cronometerTabata,10);
    }else if (type == 'timer'){
        _type = $("input[name='typeTime']:checked").val();
        _minutes = $("#minutesTimer").text();
        _seconds = $("#secondsTimer").text();
        if (_type == 'regressive'){
            hundredth = 99;
            seconds = _seconds;
            minutes = _minutes;
            milis = 0;
        }
        resetCronometer();
        control = setInterval(cronometerTimer,10);
    }

}

function cronometerEmom(){
    curTime = new Date();
    totalSeconds = ((curTime - startTime)/1000);

    if ((parseInt(_seconds) - totalSeconds) > 0){
        seconds = Math.floor((parseInt(_seconds) - totalSeconds));
        minutes = parseInt(_minutes);
    }else{
        if (parseInt(seconds) == 0){
            seconds = 60;
            minutes--;
            minTime = new Date();
        }
        seconds = Math.floor(60 - ((curTime - minTime)/1000));
    }

    remainder = (totalSeconds % 60).toString().split(".");

    if (parseInt(seconds) <= 9){
        seconds = "0" + seconds;
    }

    if (remainder.length > 1){
        milis = remainder[1].substring(0,2);
        if (milis.length == 1){
            milis = "0" + milis;
        }
    }else{
        milis = "00";
    }

    $("#knobEmom").val(parseInt((round-1) * ((parseInt(_minutes) * 60) + parseInt(_seconds)) ) + totalSeconds);
    $("#knobEmom").trigger('change');

    if (parseInt(minutes) < 0) {
        round++;
        
        if (round > _rounds){
            playStopAudio();
            stopCronometer();
            $("#cronometerEmom").text("00:00:00");
            $("#knobEmom").val(((parseInt($("#minutesEmom").text()) * 60) + parseInt($("#secondsEmom").text())) * parseInt($("#roundsEmom").text()));
            $("#knobEmom").trigger('change');
            minutes = "00";
            seconds = "00";
            milis = "00";
        }else{
            $("#emomRound").text("ROUND " + round);
            minutes = parseInt(_minutes);
            seconds = parseInt(_seconds);
            startTime = new Date();
            playStartAudio();
        }
    }

    $("#cronometerEmom").text(minutes + ":" + seconds + ":" + milis);
}

function increase(id){
    $("#" + id).text( parseInt($("#" + id).text())+1 );
}

function decrease(id, min){
    if ($("#" + id).text() != min){
        $("#" + id).text( parseInt($("#" + id).text())-1 );
    }
}

function mountExercise(id){
    strResult = '';
    var aux = '';
    record = 0;
    lowestTime = 9999;
    countRecordLength = 0;
    showGraph = false;

    $.each(CGDataMember.personalRecords, function (index, item) {
        if (item.id == exercises[id].id){
            countRecordLength++;
            if(exercises[id].type == "time"){
                newRecord = parseInt(item.record.replace(':', ''));

                if(newRecord < lowestTime){
                    idTrophy = item.id;
                    lowestTime = newRecord;
                    record = item.record;
                }
            }else if (parseInt(item.record) > parseInt(record)){
                idTrophy = item.id;
                record = item.record;
                $("#btnpr"+id).empty();
                $("#btnpr"+id).append("<b>"+record+"</b>");
            }
        }
    });
    
    if (countRecordLength > 1){
        showGraph = true;
    }

    strResult = '<div class="portlet-title row kt-padding-t-5 kt-padding-b-5">';
    if(countRecordLength >= 1){
        aux = 'onclick="togglePRPercents(' + id + ',' + showGraph + ')"';
    }else{
        aux = 'onclick="showBenchmark(' + id + ')"';
    }
    strResult += '    <div class="col-10"><span class="text-dark" style="font-size: 18px" id="pret' + id + '" ' + aux + ' ><i id="iconPrChange' + id + '" class="la la-angle-right" style="font-size: 16px"></i> ' + exercises[id].name + '</span></div>';
    if(record == "" || record == null || record == undefined){
        strResult += '<div class="text-right col-2"><button id="btnpr' + id + '" type="button" class="pull-right btn-pill btn-sm btn change-color-btn text-white" style="font-size: 15px;" onclick="showModalPR(' + id + ');"><b> - </b></button></div>';
    }else{
        strResult += '<div class="text-right col-2"><button id="btnpr' + id + '" type="button" class="pull-right btn-pill btn-sm btn change-color-btn text-white" style="font-size: 15px" onclick="showModalPR(' + id + ');"><b> ' + record + ' </b></button></div>';
    }
    strResult += '</div>';
    
    strResult += '<div style="display: none; margin-right: -20px;" class="kt-padding-t-10" id="prp' + id + '"></div><hr>';
    
    return strResult;
}

function showTimer(type){
    $("#btnBackTimers").show();
    //stopCronometer();
    window.scrollTo(0, 0);
    $("#emomM").hide();
    $("#tabataM").hide();
    $("#timerM").hide();
    $("#stopTimerT").hide();
    $("#timerT").hide();
    $("#emomT").hide();
    $("#tabataT").hide();
    $("#timers").hide();
    $("#timerBack").show();
    
    if(type=="emomM"){
      $("#emomM").show();
    }else if(type=="tabataM"){
      $("#tabataM").show();
    }else if(type=="timerM"){
      $("#timerM").show();
    }else if(type=="emomT"){
      $("#emomT").show();
    }else if(type=="stopTimerT"){
      $("#stopTimerT").show();
    }else if(type=="timerT"){
      $("#timerT").show();
    }else if(type=="tabataT"){
      $("#tabataT").show();
    }
}

function showInputLoadModal(id, load){
    $("#inputLoad").val(load);
    $("#inputLoadModal").modal("show");
    selectedWorkoutId = id;
}
                                            
function showUnit(){
    if (localStorage.unitListIDS.split(',').length > 1){
        $('#unit').show();
    }else{
        $('#unit').hide();
    }
}
 
function getDateFromDayOfWeek(dayOfWeek){
    var d = new Date();
    curDayOfWeek = d.getDay(); // 0 to 6
    
    daysToAdd = 0;

    if (curDayOfWeek == 0) curDayOfWeek = 7;
    
    if (dayOfWeek < curDayOfWeek){
        daysToAdd = 7 + parseInt(dayOfWeek) - curDayOfWeek;
    }else{
        daysToAdd = dayOfWeek - curDayOfWeek;
    }
    var dt2 = new Date();
    dt2.setDate(dt2.getDate() + daysToAdd);
    
    return dt2;
}

function mountClasses(unitID, alwaysShow){
    hasLiveStream = false;
    hasFaceToFace = false;
    hasClasses = false;
    unitToShow = unitID;

    $("#noClassToShow").hide();

    var d1 = new Date();
    for(i=1;i<=7;i++){
        $("#tabWeek" + i).empty();
        $("#liWeek" + i).hide();
        $("#tabWeek" + i).removeClass("active");
        $("#aWeek" + i).removeClass("active");
        $("#aWeek" + i).empty();

        formatedTime = getDateFromDayOfWeek(i).toLocaleDateString(getLangLocale(), { weekday:'short', day: '2-digit',month: '2-digit'});
        
        if(formatedTime.includes(",")){
            $("#aWeek" + i).append("<b>" + formatedTime.replace(",", "</b><br>").toUpperCase());
        }else{
            $("#aWeek" + i).append("<b>" + formatedTime.replace(" ", "</b><br>").toUpperCase());
        }
    }

    var d2 = new Date();
    curDayOfWeek = d2.getDay(); // 0 to 6
    if (curDayOfWeek == 0) curDayOfWeek = 7;

    $.each(CGData.classes, function (index, item){
        var d = new Date();
        curMinute = d.getMinutes();

        if (curMinute < 10){
            curMinute = "0"+curMinute;
        }
        curTime = parseInt(d.getHours() + '' + curMinute);

        classTime = parseInt(item.startTime.substring(0,5).replace(':', ''));
        if (item.endTime == "" || item.endTime == undefined){
            endTime = "";
            timeEnd = "";
        }else{
            endTime = parseInt(item.endTime.substring(0,5).replace(':', ''));
            timeEnd = item.endTime;
        }

        cancelClassButton = "";
        liveId = "";
        attendanceCounter = 0;

        $.each(CGData.classesAttendance, function (index, itemC){
            if (itemC.class_id == item.id && itemC.date == moment(getDateFromDayOfWeek(item.dayOfWeek)).format("YYYY-MM-DD") ){
                attendanceCounter = itemC.memberId.split(",").length;
            }
        });
            
        var showClass = true;
        if(item.liveStream == true && !$("#onlineClasses").parent().find('input').is(':checked')) {
            showClass = false;
        }    
        if(item.liveStream == "false" && !$("#faceToFaceClasses").parent().find('input').is(':checked')) {
            showClass = false;
        }
        if(!$("#ftr" + item.name.replace(/\W+/g, '')).parent().find('input').is(':checked')){
            showClass = false;
        }

        if (item.unitId == unitID && (item.instructor == $("#selectInstructor").val() || $("#selectInstructor").val() == "all") && showClass){
            classDate = moment(getDateFromDayOfWeek(item.dayOfWeek)).format("YYYY-MM-DD");
            classDateToBookClass = moment(getDateFromDayOfWeek(item.dayOfWeek)).format("DD-MM-YYYY");
            bookingId = classBooked(item.id, classDate);

            strClasses = '<div class="kt-portlet__body bg-light kt-margin-b-5">';
            strClasses += '  <div class="kt-widget kt-widget--user-profile-2">';
            strClasses += '      <div class="row">';
            strClasses += '          <div class="col-3">';
            strClasses += '              <img onerror="this.src=\'assets/media/avatarProfile.png\'" class="avatar avatar-xl" src="' + ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/s" + item.instructorID + '.png" alt="image">';
            strClasses += '          </div>';
            strClasses += '          <div class="kt-widget__info kt-align-left col-6" stxyle="margin-bottom: -100px">';
            strClasses += '              <h6 class="kt-widget__username kt-font-boldest kt-font-dark" style="font-size: 14px"> ' + item.name + ' </h6>';
            strClasses += '              <h6 class="kt-widget__desc kt-font-bold kt-font-dark"> ' + formatTimeLocale(item.startTime) + ' - ' + formatTimeLocale(timeEnd) + ' </h6>';
            if(item.instructor != null && item.instructor != "" && item.instructor != "null"){
                strClasses += '          <h6 class="kt-widget__desc kt-font-bold kt-font-dark"> ' + item.instructor + ' </h6>';
            }else{
                strClasses += '          <br>';
            }
            if(localStorage.memberType != "staff" && showClassParticipants){
                if(item.capacity > 0){
                    strClasses += '      <nobr><h6 id="participants' + item.id + '" class="kt-widget__desc kt-font-bold kt-font-dark">' + i18n.t("participants") + ' (' + attendanceCounter + '/' + item.capacity + ')</h6></nobr>';
                }else{
                    strClasses += '      <nobr><h6 id="participants' + item.id + '" class="kt-widget__desc kt-font-bold kt-font-dark">' + i18n.t("participants") + ' (' + attendanceCounter + ') </h6></nobr>';
                }
            }
            strClasses += '          </div>';
            
            if (item.liveStream == true){
                hasLiveStream = true;
                if(((item.description != "" && item.description != null) || (attendanceCounter >= 1 && showClassParticipants)) && localStorage.memberType != "staff"){
                    strClasses += '      <div class="col-2">';
                    strClasses += '         <button style="width: 37px; height: 37px; background-color: var(--main-color)" class="btn btn-circle btn-icon text-right"><i style="font-size: 15px;" class="fa fa-video text-white"></i></button>';
                    strClasses += '      </div>';
                    strClasses += '      <div class="col-1" id="showDescription' + item.id + '">';
                    strClasses += '          <div class="text-center" onclick="showDescModal(\'' + item.id + '\',\'' + classDate + '\')">';
                    strClasses += '             <i style="font-size: 16px; margin-right: -10px" class="text-dark flaticon-more"></i>';
                    strClasses += '          </div>';
                    strClasses += '      </div>';
                }else{
                    strClasses += '      <div class="col-3 text-right">';
                    strClasses += '         <button style="width: 37px; height: 37px; background-color: var(--main-color)" class="btn btn-circle btn-icon text-right"><i style="font-size: 15px;" class="fa fa-video text-white"></i></button>';
                    strClasses += '      </div>';
                }
                
                if(curDayOfWeek == item.dayOfWeek){
                    if(curMinute >= 55){
                        check5Min = parseInt((d.getHours()+1) + '0' + (curMinute-55));
                    }else{
                        check5Min = parseInt(d.getHours() + '' + curMinute)+5;
                    }
                    newTime = item.startTime.split(':');
                    newHour = newTime[0];
                    newMinute = newTime[1];
                    newMinute = parseInt(newMinute)+30;
                    if(newMinute > 59){
                        newMinute = newMinute-60;
                        if(newMinute.toString().length == 1){
                            newMinute = "0"+newMinute; 
                        }
                        newHour = parseInt(newHour)+1;
                    }
                    cancelClassButton = newHour.toString()+newMinute.toString();
                }

                if(curMinute >= 55){
                    check5Min = parseInt((d.getHours()+1) + '0' + (curMinute-55));
                }else{
                    check5Min = parseInt(d.getHours() + '' + curMinute)+5;
                }

                if (bookingId > 0){
                    if (check5Min >= classTime && curTime < cancelClassButton){
                        strClasses += '<div id="btnZoom' + item.id + '" class="col-12"><button onclick="window.open(\'' + item.liveStreamURI + '\')"; type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-facebook btn-upper kt-font-boldest">' + i18n.t("openLive") + '</button></div>';
                    }else if (curTime > cancelClassButton && curDayOfWeek == item.dayOfWeek){
                        strClasses += '<div id="btnCancel' + item.id + '" class="col-12"><button type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-dark btn-upper kt-font-bold disabled">' + i18n.t("closed") + '</button>';
                    }else{
                        strClasses += '<div id="btnZoom' + item.id + '" class="col-12"><button type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-facebook btn-upper kt-font-boldest disabled">' + i18n.t("liveNotAvailableYet") + '</button></div>';
                    }
                }else if (localStorage.memberType != "staff"){
                    if(curDayOfWeek == item.dayOfWeek && curTime > cancelClassButton){
                        strClasses += '<div id="btnCancel' + item.id + '" class="col-12"><button type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-dark btn-upper kt-font-bold disabled">' + i18n.t("closed") + '</button>';
                    }else{
                        strClasses += '<div id="btnBook' + item.id + '" class="col-12"><button onclick="showModalPosition(' + item.dayOfWeek + ',' + item.id + ',' + item.capacity + ',' + item.bookPosition + ', true, \''+ classDate + '\')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-success btn-upper kt-font-boldest">' + i18n.t("confirmBook") + '</button></div>';
                    }
                }
            }else{
                hasFaceToFace = true;
                strClasses += '      <div class="col-1 ml-auto" id="showDescription' + item.id + '">';
                if(((item.description != "" && item.description != null) || (attendanceCounter >= 1 && showClassParticipants)) && localStorage.memberType != "staff"){
                    strClasses += '      <div onclick="showDescModal(\'' + item.id + '\',\'' + classDate + '\')">';
                    strClasses += '         <i style="font-size: 16px; margin-right: -10px" class="text-dark flaticon-more"></i>';
                    strClasses += '      </div>';
                }
                strClasses += '      </div>';
            }
            strClasses += '      </div>';
            if(localStorage.memberType != "staff"){
                strClasses += '  <div class="kt-widget__info text-right">';
                 classTime = parseInt(item.startTime.substring(0,5).replace(':', ''));
                if(item.liveStream == "false"){
                    if (curDayOfWeek == item.dayOfWeek && curTime > classTime && item.liveStream == "false"){
                        strClasses += '<div id="btnCancel' + item.id + '"><button type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-dark btn-upper kt-font-bold disabled">' + i18n.t("closed") + '</button>';
                    }else if (bookingId > 0){
                        strClasses += '   <div class="row">';
                        strClasses += '       <div class="col-12" id="btnCancel' + item.id + '">';
                        strClasses += '          <button onclick="cancelClassReservation(' + bookingId + ','+ item.id +')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-google btn-upper kt-font-bold">' + i18n.t("cancelBook") + '</button>';
                        strClasses += '       </div>';
                        strClasses += '   </div>';
                    }else{
                        strClasses += '   <div class="row">';
                        strClasses += '       <div class="col-12" id="btnBook' + item.id + '">';
                        strClasses += '          <button onclick="showModalPosition(' + item.dayOfWeek + ',' + item.id + ',' + item.capacity + ',' + item.bookPosition + ', true, \''+ classDate + '\')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-success btn-upper kt-font-boldest">' + i18n.t("confirmBook") + '</button>';
                        strClasses += '       </div>';
                        strClasses += '   </div>';
                    }
                }   
                strClasses += '         </div>';
            }else{
                if(item.bookPosition == true){
                    strClasses += '     <div class="row">';
                    strClasses += '          <div class="kt-widget__info kt-align-right col-6">';
                    strClasses += '             <button onclick="showModalPosition(' + item.dayOfWeek + ',' + item.id + ',' + item.capacity + ',' + item.bookPosition + ', false, \''+ classDate + '\')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn change-class-map btn-upper kt-font-bold">' + i18n.t("classMap") + ' (' + attendanceCounter +'/' + item.capacity + ')</button>';
                    strClasses += '          </div>';
                    strClasses += '          <div class="kt-widget__info kt-align-right col-6">';
                    strClasses += '             <button onclick="showModalList(\'' + item.id + '\',\'' + classDate + '\')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-dark btn-upper kt-font-bold">' + i18n.t("classList") + '</button>';
                    strClasses += '          </div>';
                    strClasses += '     </div>';
                }else{
                    strClasses += '     <div class="row">';
                    strClasses += '         <div class="kt-widget__info kt-align-right col-12">';
                    strClasses += '            <button onclick="showModalList(\'' + item.id + '\',\'' + classDate + '\')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-dark btn-upper kt-font-bold">' + i18n.t("classList") + ' - (' + attendanceCounter +'/' + item.capacity + ')</button>';
                    strClasses += '         </div>';
                    strClasses += '     </div>';
                }
            }
            strClasses += '  </div>';
            strClasses += '</div>';
            if (localStorage.memberType == "staff" || classAllowed(item.name, item.minAge, item.maxAge)){
                hasClasses = true;
                $("#tabWeek" + item.dayOfWeek).append(strClasses);
                $("#liWeek" + item.dayOfWeek).show();
            }
        }
    });
    
    if((hasLiveStream && hasFaceToFace) || alwaysShow){
        $("#statusClassSelector").show();
    }else{
        $("#statusClassSelector").hide();
    }

    if(hasClasses == false){
        $("#noClassToShow").show();
    }

    $.each(livesId, function (index, item){
        player = videojs(item);
        player.on('error', function(e) {
            player.dispose();
            $('#player_' + item).hide();
        });
    });

    $('.enter-fullscreen').click(function(e) {
        e.preventDefault();
        $('.vjs-play-control').click();
        $('.vjs-fullscreen-control').click();
    });

    $("#tabWeek" + curDayOfWeek).addClass("active");
    $("#aWeek" + curDayOfWeek).addClass("active");
}

function showDescModal(id, classDate){
    strParticipants ='';
    $.each(CGData.classes, function (index, item){
        if(item.id == id){
            descriptionItem = item.description;
            if(item.description != null && item.description != undefined && item.description != ""){
                strParticipants +='<div class="row modal-body kt-margin-l-10 kt-margin-r-10" style="margin-bottom: -13px; background-color: #F0F0EC; border-radius: 10px">';
                strParticipants +='    <br><pre class="col-12 text-dark lead">' + item.description + '</pre>';
                strParticipants +='</div><br><hr>';
            }
        }
    });

    bookedNames = [];
    $.each(CGData.classesAttendance, function (indexB, itemB){
        if (itemB.class_id == id && itemB.date == classDate && showClassParticipants){
            bookedId = itemB.id.split(",");
            bookedNames = itemB.memberName.split(",");
            bookedMemberIds = itemB.memberId.split(",");
            bookedCheckedIn = itemB.checkedIn.split(",");
            
            for(i=0;i<bookedNames.length;i++){
                
                strParticipants +='<div class="row col-12">';
                strParticipants +='    <div class="col-2">';
                strParticipants +='        <img onerror="this.src=\'assets/media/avatarProfile.png\'" class="avatar avatar-md" src="' + ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/" + bookedMemberIds[i] + '.png" alt="image">';
                strParticipants +='    </div>';
                strParticipants +='    <div class="col-10" style="margin-top: 13px">';
                strParticipants +='        <p class="kt-font-bolder kt-font-dark" style="font-size: 15px">' + bookedNames[i] + '</p>';
                strParticipants +='    </div>';
                strParticipants +='</div><hr>';
            }
        }
    });

    $("#classDescription").empty();
    if(descriptionItem != null && descriptionItem != undefined && descriptionItem != "" && bookedNames.length >= 1){
        $("#classDescription").append(i18n.t("description/participants"));
    }else if(descriptionItem != null && descriptionItem != undefined && descriptionItem != ""){
        $("#classDescription").append(i18n.t("description"));
    }else{
        $("#classDescription").append(i18n.t("participants"));
    }

    $("#modalDescParticipants").empty();
    $("#modalDescParticipants").append(strParticipants);
    $("#modalDescClasses").modal("show");
}

checkIOSVersion = function () {
   var agent = window.navigator.userAgent,
   start = agent.indexOf( 'OS ' );
   if( ( agent.indexOf( 'iPhone' ) > -1 || agent.indexOf( 'iPad' ) > -1 ) && start > -1 ){
       return window.Number( agent.substr( start + 3, 3 ).replace( '_', '.' ) );
   }
   return 0;
}

function classAllowed(className, minAge, maxAge){
    result = false;
    found = false;
    if(maxAge == 50){
        maxAge = 150; 
    }
    if (localStorage.token != null && localStorage.token != "" && maxAge > 0){
        memberAgeInMonths = -1;
        mBirthDate = moment(localStorage.token, 'DDMMYYYY');
        memberAgeInMonths = Math.floor((moment().diff(mBirthDate, 'months'))/12);

        if (memberAgeInMonths < minAge){
            result = false;
            return result;
        }else if(memberAgeInMonths > maxAge){
            result = false;
            return result;
        }
    }

    className = className.normalize('NFD').replace(/[\u0300-\u036f| \t|,]/g, "").toUpperCase();

    $.each(CGData.plans, function (index, item){
        $.each(CGDataMember.contracts, function (index, itemC){
            if(item.name == itemC.name){
                found = true;
                classes = null;
                if (item.allowedClasses != null){
                    classes = item.allowedClasses.split(",");
                }
                if (classes == null || classes[0] == "-1"){
                    result = true;
                    return;
                }else{
                    $.each(classes, function (index, item){
                        if (item.toUpperCase() == className){
                          result = true;
                          return;
                        }
                    });
                }
            }
        });
    });
    if(!found){
        result = true;
    }
    return result;
}

function classBooked(classID, classDate){
    result = -1;
    if(localStorage.memberType == "staff"){
        return result;
    }

    const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let dateDay = year+"-"+month+"-"+day;
    
    $.each(CGDataMember.classes, function (index, item){
        //if(classID == item.classId && item.date >= dateDay){
        if(classID == item.classId && item.date == classDate){
            result = item.id;
            return;
        }
    });
    
    return result;
}

function mountMyClasses(){
    $("#myClasses").empty();
    
    const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    let dateObj = new Date();
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let dateDay = year+"-"+month+"-"+day;

    $.each(CGDataMember.classes, function (index, item){
        dayOfWeek = "";
        classId = "";
        classCapacity = "";
        instructorID = "";
        instructorName = "";
        description = "";

        $.each(CGData.classes, function (index, itemC){
            if (item.classId == itemC.id){
                dayOfWeek = itemC.dayOfWeek;
                classId = itemC.id ;
                classBookPosition = itemC.bookPosition;
                classCapacity = itemC.capacity;
                instructorID = itemC.instructorID;
                bookPosition = itemC.bookPosition;
                instructorName = itemC.instructor;
                description = itemC.description;
            } 
        });
        
        strMyClasses = '<div id="myClass' + classId + '" class="kt-portlet__body bg-light kt-margin-b-5">';
        strMyClasses += '  <div class="kt-widget kt-widget--user-profile-2">';
        strMyClasses += '      <div class="row">';
        strMyClasses += '          <div class="kt-widget__media col-3">';
        strMyClasses += '              <img onerror="this.src=\'assets/media/avatarProfile.png\'" class="avatar avatar-xl" src="' + ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/s" + instructorID + '.png" alt="image">';
        strMyClasses += '              <div class="kt-widget__pic kt-widget__pic--warning kt-font-warning kt-font-boldest kt-hidden">TF</div>';
        strMyClasses += '          </div>';
        strMyClasses += '          <div class="kt-widget__info text-left col-5">';
        strMyClasses += '              <h6 class="kt-widget__username kt-font-boldest kt-font-dark" style="font-size: 14px"> ' + item.name + ' </h6>';
        strMyClasses += '              <h6 class="kt-widget__desc kt-font-bold kt-font-dark"> '  + formatShortDateLocale(item.date) + ' - ' + formatTimeLocale(item.time) + ' </h6>';
        
        if(instructorName != null && instructorName != "null" && instructorName != ""){
        strMyClasses += '          <h6 class="kt-widget__desc kt-font-bold kt-font-dark"> ' + instructorName + ' </h6>';
        }
        strMyClasses += '          </div>';
        if(classCapacity > 0 && bookPosition == true){
            strMyClasses += '      <div class="kt-align-right col-4">';
            strMyClasses += '          <button onclick="showModalPosition(' + dayOfWeek + ',' + classId + ',' + classCapacity + ',' + classBookPosition + ', false, \''+ item.date + '\')" type="button" class="kt-margin-b-10 kt-padding-l-20 kt-padding-r-20 kt-font-bolder btn-pill btn change-class-map btn-upper"><span class="kt-font-boldest" style="font-size: 13px">' + i18n.t("classMap") + '</span></button>';
            strMyClasses += '      </div>';
        }
        strMyClasses += '      </div>';
        if(description != "" && description != null){
            strMyClasses += '   <div class="row">';
            strMyClasses += '       <div class="col-10">';
            strMyClasses += '          <button onclick="cancelClassReservation(' + item.id + ',' + item.classId + ')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-google btn-upper kt-font-bold">' + i18n.t("cancelBook") + '</button>';
            strMyClasses += '       </div>';
            strMyClasses += '       <div style="margin-left: -5px" class="col-2 text-right">';
            strMyClasses += '          <button onclick="showDescModal(\'' + classId + '\')" type="button" class="kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn change-color-btn btn-upper kt-font-bold"> &nbsp;&nbsp;<i class="text-white text-right flaticon-more-1"></i></button>';
            strMyClasses += '       </div>';
            strMyClasses += '   </div>';
        }else{
            strMyClasses += '   <button onclick="cancelClassReservation(' + item.id + ',' + item.classId + ')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-google btn-upper kt-font-bold">' + i18n.t("cancelBook") + '</button>';
        }
        strMyClasses += '  </div>';
        strMyClasses += '</div>';
        if(dateDay <= item.date){
            $("#myClasses").append(strMyClasses);
        }
    });
}

function startAnnimation(){
    $.blockUI ({baseZ: '2000', css: {position:'absolute', left: '26%', backgroundColor: 'transparent',border: '0'}, message: "<img width=180 src='assets/media/box-cloud.gif' /><h3 class='text-white text-right'>" + i18n.t("wait") + "</h3>"});
}

function stopAnnimation(){
    $.unblockUI();
}

function mountWod(){
    $("#wodDesc").empty();

    registered = false;

    $.each(CGData.classes, function (index, item){
        var d = new Date();
        curDayOfWeek = d.getDay();// 0 to 6

        if (curDayOfWeek == 0) curDayOfWeek = 7;

        if (curDayOfWeek == item.dayOfWeek && item.crossFitWOD != ""){
            
            $.each(CGDataMember.classes, function (indexC, itemC){
                if (item.dayOfWeek == itemC.dayOfWeek-1){
                    registered = true;
                }
            });

            if(localStorage.unitID == item.unitId){
                $("#wodDesc").append(item.crossFitWOD.replace(/\n/g, "<br /><br />"));
                return false;
            }
        }
    });
}

function formatCurrency(str) {
	if (str == null){
		str = "0";
	}
    var parts = (str + "").split("."),
        main = parts[0],
        len = main.length,
        output = "",
        i = len - 1;

    while(i >= 0) {
        output = main.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = "," + output;
        }
        --i;
    }
    // put decimal part back
    if (parts.length > 1) {
    	if (parts[1].length < 2){
    		parts[1] = parts[1] + "0";
    	}
        output += "." + parts[1].substr(0,2);
    }else{
    	output += ".00";
    }
    return output;
}

function showProfile(){
    if(CGData != null && CGData != ""){
        $.each(CGData.units, function (index, item){
            if (item.id == localStorage.unitID){
                $('#unitSelected').empty();
                $('#unitSelected').append(i18n.t("standardUnit") + " (" + item.name+")") ;
            }
        });
        showUnit();
    }
}

function updateWorkoutLoad(){
    $("#workoutLoad"+selectedWorkoutId).empty();
    if($("#inputLoad").val() == "" || $("#inputLoad").val() == null){
        $("#workoutLoad"+selectedWorkoutId).append("-");
    }else{
        $("#workoutLoad"+selectedWorkoutId).append($("#inputLoad").val());
    }
    $("#inputLoadModal").modal("hide");
    
    $.ajax({
        url: ENDPOINT_API + "app/workoutload/"+ selectedWorkoutId,
        headers: {
            'memberID':localStorage.id,
            'email': localStorage.email,
            'token': localStorage.token,
            'groupID': localStorage.groupID
        },
        method: "PUT",
        dataType: "text",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({load: $("#inputLoad").val()})
    }).done(function(data) {
        $.each(CGDataMember.workout.exercises, function (index, item){
            if(item.id == selectedWorkoutId){
                item.load = $("#inputLoad").val();
            }
        });
    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + error);
    });
}

function classCheckIn(memberId, attendanceId, checked){
    $.ajax({
        url: ENDPOINT_API + "appstaff/classcheckin/" + attendanceId,
        headers: {
            'email': localStorage.email,
            'token': localStorage.token,
            'groupID': localStorage.groupID
        },
        method: "PUT",
        dataType: "text",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({checkIn: checked})
    }).done(function(data) {
        $.each(CGData.classesAttendance, function (index, item){
            $.each(item.id.split(","), function (indexI, itemI){
                if(itemI == attendanceId){
                    idList = item.memberId.split(",");
                    memberPos = 0;
                    $.each(idList, function (indexM, itemM){
                        if(itemM == memberId){
                            memberPos = indexM;
                            return;
                        }
                    });
                    newCheckinRow = "";
                    $.each(item.checkedIn.split(","), function (indexC, itemC){
                        if(indexC >0){
                            newCheckinRow += ',';
                        }
                        if(indexC == memberPos){
                            newCheckinRow += checked;
                        }else{
                            newCheckinRow += itemC;
                        }
                    });
                    item.checkedIn = newCheckinRow;
                }
            });

        });
        if(checked == "true"){
            $("#checkinBook"+memberId).empty();
            $("#checkinBook"+memberId).append('<button onclick="classCheckIn(\'' + memberId + '\',\'' + attendanceId + '\',\'false\')" type="button" class="float-right kt-font-bolder btn-pill btn-sm btn btn-google disabled btn-upper"><span class="kt-font-bolder" style="font-size: 10px; white-space: nowrap;">' + i18n.t("cancelBook") + '</span></button>');
            
        }else{
            $("#checkinBook"+memberId).empty();
            $("#checkinBook"+memberId).append('<button onclick="classCheckIn(\'' + memberId + '\',\'' + attendanceId + '\',\'true\')" type="button" class="float-right kt-font-bolder btn-pill btn-sm btn btn-success btn-upper"><span class="kt-font-bolder" style="font-size: 10px; white-space: nowrap;">' + i18n.t("confirmBook") + '</span></button>');
        }
    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + error);
    });
}

function getCardType(number){
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "visa";
    
    //5090914715453207
    //Elo
    //re = new RegExp("^(636368|438935|504175|451416|636297|5067|4576|4011)");
    re = new RegExp("^(40117[8-9]|431274|438935|451416|457393|45763[1-2]|506(699|7[0-6][0-9]|77[0-8])|509\d{3}|504175|627780|636297|636368|65003[1-3]|6500(3[5-9]|4[0-9]|5[0-1])|6504(0[5-9]|[1-3][0-9])|650(4[8-9][0-9]|5[0-2][0-9]|53[0-8])|6505(4[1-9]|[5-8][0-9]|9[0-8])|6507(0[0-9]|1[0-8])|65072[0-7]|6509(0[1-9]|1[0-9]|20)|6516(5[2-9]|[6-7][0-9])|6550([0-1][0-9]|2[1-9]|[3-4][0-9]|5[0-8]))");
    if (number.match(re) != null)
        return "elo";
    
    // Mastercard
    //re = new RegExp("^5[1-5]");
    re = new RegExp("(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}")
    if (number.match(re) != null)
        return "mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
        return "amex";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
        return "discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
        return "diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
        return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
        return "jcb";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
        return "electron";

    //Hipercard
    re = new RegExp("/^(606282\d{10}(\d{3})?)|(3841\d{15})$/");
    if (number.match(re) != null)
        return "hipercard";
    
    return "";
}

function showModalList(classId, _date){
    $("#modalListBody").empty();
    bookedNames = [];
    
    $.each(CGData.classesAttendance, function (index, item){
        if (item.class_id == classId && item.date == _date){
            bookedId = item.id.split(",");
            bookedNames = item.memberName.split(",");
            bookedMemberIds = item.memberId.split(",");
            bookedCheckedIn = item.checkedIn.split(",");
            
            strModalList ='';
            for(i=0;i<bookedNames.length;i++){

                strModalList +='<div class="row col-12">';
                strModalList +='       <div class="col-2">';
                strModalList +='           <img onerror="this.src=\'assets/media/avatarProfile.png\'" style="max-height: 35px; max-width: 35px" class="avatar avatar-xs" src="' + ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/" + bookedMemberIds[i] + '.png" alt="image">';
                strModalList +='       </div>';
                strModalList +='       <div class="kt-align-left col-7" style="padding-top: 5px">';
                strModalList +='           <a class="kt-font-bolder text-dark" style="font-size: 15px;">' + bookedNames[i] + '</a>';
                strModalList +='       </div>';
                strModalList +='       <div class="float-right col-3">';
                strModalList +='           <div id="checkinBook' + bookedMemberIds[i] + '">';
                if(bookedCheckedIn[i] != "true"){
                    strModalList +='          <button onclick="classCheckIn(\'' + bookedMemberIds[i] + '\',\'' + bookedId[i] + '\',\'true\')" type="button" class="float-right kt-font-bolder btn-pill btn-sm btn btn-success btn-upper"><span class="kt-font-bolder" style="font-size: 10px; white-space: nowrap;">Check-in</span></button>';
                }else{
                    strModalList +='          <button onclick="classCheckIn(\'' + bookedMemberIds[i] + '\',\'' + bookedId[i] + '\',\'false\')" type="button" class="float-right kt-font-bolder btn-pill btn-sm btn btn-google btn-upper"><span class="kt-font-bolder" style="font-size: 10px; white-space: nowrap;">' + i18n.t("cancelBook") + '</span></button>';
                }
                strModalList +='          </div>';
                strModalList +='      </div>';
                strModalList +=' </div><hr>';

                continue;
            }
        }

    });
    if(bookedNames.length >=1){
        $("#listBookTitle").empty();
        $("#listBookTitle").append("PRESENÇAS");
        $("#modalListBody").append(strModalList);
    }else if(bookedNames.length < 1){
        $("#listBookTitle").empty();
        $("#listBookTitle").append("SEM PRESENÇA CONFIRMADA");
    }
    $("#modalList").modal("show");
    
}

function checkUpdate(_version) {
    if(/android/i.test(userAgent)){
        updateApp.postMessage(_version)
    }
    if(/iPad|iPhone|iPod/i.test(userAgent)){
        webkit.messageHandlers.updateApp.postMessage(_version)
    }
}

function releaseTurnStile(){
    var dt = new Date();
    var dd = dt.getDate();
    var mm = dt.getMonth()+1; //January is 0!
    var yyyy = dt.getFullYear();
    
    if(dd<10) {dd='0'+dd;}
    if(mm<10) {mm='0'+mm;}

    _date = dd+'-'+mm+'-'+yyyy;
    hh = dt.getHours();
    mm = dt.getMinutes();
    if(hh<10){hh='0'+hh;}
    if(mm<10){mm='0'+mm;}
    _time =  hh + ":" + mm;

    ConfirmTurnStyleText = i18n.t("releaseTurnstyleMessage");

    Swal.fire({
        backdrop:false,
        title: ConfirmTurnStyleText,
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: i18n.t("confirm"),
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: i18n.t("cancel")
      }).then((result) => {
        if (result.value) {
            startAnnimation();
            $.ajax({
                url: ENDPOINT_SATELLITE + 'customer/release_turn_stile',
                method: "POST",
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify({email: localStorage.email, passWD: localStorage.token, token: localStorage.turnStiletoken, date: _date, time: _time})
            }).done(function(data) {
                stopAnnimation();
                if (data.trim() == "ok" || data.length == 5){
                    showInfo(i18n.t("accessCleared"));
                    if(data.length == "5"){
                        localStorage.turnStiletoken = data;
                    }
                }else if (data.trim() == "-11"){
                    showError(i18n.t("userNotFound"));
                }else if (data.trim() == "-12"){
                    showError(i18n.t("accessDenied"));
                }else if (data.trim() == "-13"){
                    showError(i18n.t("invalidToken"));
                }else if (data.trim() == "-14"){
                    showError(i18n.t("reachMaxAccess"));
                }else if (data.trim() == "-15"){
                    showError(i18n.t("outOfAllowedTime"));
                }else{
                    showError(i18n.t("accessDenied"));
                }
            }).fail(function(jqXHR, textStatus, error) {
                stopAnnimation();
                showError(i18n.t("errorOccurred") + error);
            });
        }
    });
}

function showModalPosition(_dayOfWeek, classId, classCapacity, bookPosition, bookAllowed, _date){
    $("#modalPositionBody").empty();
    
    //BEGIN calculate DATE
    var dt = new Date();
    var dayOfWeek = dt.getDay(); // 0 to 6
    daysToAdd = 0;

    if (dayOfWeek == 0) dayOfWeek = 7;
    
    if (_dayOfWeek < dayOfWeek){
        daysToAdd = 7 + _dayOfWeek - dayOfWeek;
    }else if (_dayOfWeek > dayOfWeek){
        daysToAdd = _dayOfWeek - dayOfWeek;
    }
    
    dt.setDate(dt.getDate() + daysToAdd);
    
    var date;
    var dd = dt.getDate();
    var mm = dt.getMonth()+1; //January is 0!
    var yyyy = dt.getFullYear();
    
    if(dd<10) {dd='0'+dd;}
    if(mm<10) {mm='0'+mm;}

    date = dd+'-'+mm+'-'+yyyy;
    //END calculate DATE

    bookedPositions = [];
    bookedNames = [];
    bookedIds = [];
    
    $.each(CGData.classesAttendance, function (index, item){
        if (item.class_id == classId && item.date == _date){
            bookedPositions = item.deviceId.split(",");
            bookedNames = item.memberName.split(",");
            bookedIds = item.memberId.split(",");
        }
    });
    
    strModalPosition = '';
    for (i=0;i<classCapacity;i++){
        positionLabel = "P" + (i+1);
        positionBooked = false;
        selfPosition = false;
        
        for(j=0;j<bookedPositions.length;j++){
            if(bookedPositions[j] == (i+1) ){
               positionBooked = true;
               positionLabel = bookedNames[j];
               if (bookedIds[j] == localStorage.id) {
                    selfPosition = true;
               }
           }
        }
        
        strModalPosition += '<div class="mx-auto">';
        strModalPosition += '<div class="text-center kt-padding-r-5 kt-padding-l-5 kt-margin-b-10">';
        if(positionBooked){
            if(selfPosition){
                strModalPosition +='<button style="background-color: var(--main-color)" type="button" class="btn btn-lg btn-elevate-hover btn-circle btn-icon"><i style="font-size: 25px" class="text-white fa fa-laugh"></i></button>';
            }else{
                strModalPosition +='<button type="button" class="btn btn-lg btn-dark btn-elevate-hover btn-circle btn-icon disabled"><i style="font-size: 25px" class="far fa-bookmark"></i></button>';
            }
        }else{
            if (bookAllowed){
                strModalPosition +='<button onclick="bookClass(\'' + classId + '\',\'' + date + '\',\'' + (i+1) + '\')" type="button" class="btn btn-lg btn-outline-dark btn-elevate-hover btn-circle btn-icon"><i style="font-size: 25px" class="far fa-bookmark"></i></button>';
                //strModalPosition +='<i style="font-size: 45px" class="fab fa-angellist"></i>';
            }else{
                strModalPosition +='<button type="button" class="btn btn-lg btn-outline-dark btn-elevate-hover btn-circle btn-icon disabled"><i style="font-size: 25px" class="far fa-bookmark"></i></button>';
            }
        }
        strModalPosition += '   <br><span class="kt-font-boldest kt-align-center">' + positionLabel + '</span>';
        strModalPosition += '</div>';
        strModalPosition += '</div>';
    }
    if(classCapacity > 0 && bookPosition){
        $("#modalPositionBody").append(strModalPosition);
        $("#modalPosition").modal("show");
    }else if(localStorage.memberType != "staff"){
        bookClass(classId, date, 0);
    }
    if(localStorage.memberType == "staff"){
        $("#myPlace").hide();
    }
}

function bookClass(_classId, _date, _position){
    if(_position == 0){
        ConfirmText = i18n.t("confirmReservation");
    }else{
        ConfirmText = i18n.t("confirmReservationPosition") + _position + ' ?';
    }
    Swal.fire({
      backdrop:false,
      title: ConfirmText,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: i18n.t("confirm"),
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: i18n.t("cancel")
    }).then((result) => {
      if (result.value) {
        $("#modalPosition").modal("hide");
        startAnnimation();
        $.ajax({
            url: ENDPOINT_SATELLITE + "customer/book_class",
            method: "POST",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify({email: localStorage.email, passWD: localStorage.token, date: _date, classId: _classId, position: _position})
        }).done(function(data) {
            console.log(data);
            stopAnnimation();
            if (data > 0){
                //Math class end time if it doesn't exist and set time intervals
                $("#btnBook" + _classId).empty();
                $.each(CGData.classes, function (index, item){
                    var d = new Date();
                    curMinute = d.getMinutes();
                    if (curMinute < 10){
                        curMinute = "0"+curMinute;
                    }
                    curTime = parseInt(d.getHours() + '' + curMinute);
                    classTime = parseInt(item.startTime.substring(0,5).replace(':', ''));
                    if (item.endTime == "" || item.endTime == undefined){
                        endTime = "";
                    }else{
                        endTime = parseInt(item.endTime.substring(0,5).replace(':', ''));
                    }

                    if(curMinute >= 55){
                        check5Min = parseInt((d.getHours()+1) + '0' + (curMinute-55));
                    }else{
                        check5Min = parseInt(d.getHours() + '' + curMinute)+5;
                    }

                    if(endTime == "" || endTime == null){
                        newTime = item.startTime.split(':');
                        newHour = newTime[0];
                        newMinute = newTime[1];
                        newHour = parseInt(newHour)+1;
                        if (newHour == 24 || newHour == "24"){
                            newHour = 00;
                        }
                        endTime = newHour+newMinute;
                    }
                    //Math class end time if it doesn't exist and set time intervals
                    
                    if(item.id == _classId){
                        
                        itemCID = "";
                        itemCClassID = "";
                        if (_classId == item.id){
                            itemCID = data;
                            itemCClassID = _classId;
                        }
                        //Update buttons after booking
                        if (item.liveStream == true){
                            if (check5Min >= classTime && curTime < endTime){
                                meetingLink = item.liveStreamURI;
                                window.location.href = meetingLink;
                                $("#btnBook" + _classId).append('<div id="btnZoom' + item.id + '" class="col-12"><button onclick="window.location.href=\''+ meetingLink +'\';" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-facebook btn-upper kt-font-boldest">' + i18n.t("openLive") + '</button></div>');
                            }else{
                                showInfo(i18n.t("successfullyBookedLiveStream"));
                                $("#btnBook" + _classId).append('<div id="btnZoom' + item.id + '" class="col-12"><button type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-facebook btn-upper kt-font-boldest disabled">' + i18n.t("liveNotAvailableYet") + '</button></div>');
                            }
                        }else{
                            showInfo(i18n.t("successfullyBooked"));
                            $("#btnBook" + _classId).append('<button onclick="cancelClassReservation(' + itemCID + ',' + itemCClassID + ')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-google btn-upper kt-font-bold">' + i18n.t("cancelBook") + '</button>');
                        }
                        //Update buttons after booking

                        //Update CGDataMember into Local Storage
                        CGDataMember.classes.push({checkedIn: "false", classId: _classId, date: moment(_date, "DD-MM-YYYY").format("YYYY-MM-DD"), dayOfWeek: parseInt(item.dayOfWeek), id: data, instructor: item.instructor, name: item.name, time: item.startTime, unit: item.unit});

                        updateClassOcupation(item.id, item.dayOfWeek, item.capacity, 'booking');

                        foundClass = false;
                        $.each(CGData.classesAttendance, function (indexc, itemc){
                            if(itemc.class_id == _classId && itemc.date == moment(_date, "DD-MM-YYYY").format("YYYY-MM-DD")){
                                foundClass = true;
                                itemc.deviceId += "," + _position;
                                itemc.id += "," + data;
                                itemc.memberId += "," + localStorage.id;
                                itemc.memberName += "," + localStorage.name.split(" ")[0];
                                return;
                            }
                        });
                        if (!foundClass){
                            CGData.classesAttendance.push({checkedIn: "false", class_id: _classId, date: moment(_date, "DD-MM-YYYY").format("YYYY-MM-DD"), deviceId: _position + "", id: data, memberId: localStorage.id, memberName: localStorage.name.split(" ")[0]});
                        }
                    }
                });
                setTimeout(loadMemberData, 90000);
            }
            
            if (data == -15){
                $.each(CGData.classes, function (index, item){
                    if(item.id == _classId){
                        if (item.liveStreamURI.includes('zoom')){
                            meetingLink = item.liveStreamURI;
                            window.location.href = meetingLink;
                        }else{
                            showError(i18n.t("alreadyHasBookedThisClass"));
                        }
                    }
                });
            }
            if (data == -17){
                showError(i18n.t("AllPlacesAlreadyBooked"));
            }
            if (data == -18){
                showError(i18n.t("reachSessionBookedLimit"));
            }
            if (data == -19){
                showError(i18n.t("outsideTheTermOfTheContract"));
            }
            if (data == -20){
                showError(i18n.t("notYetAvailableForBooking"));
            }
        }).fail(function(jqXHR, textStatus, error) {
            stopAnnimation();
            showError(i18n.t("errorOccurred") + error);
        });
      }
    });
}

function updateClassOcupation(_id, _dayOfWeek, _capacity, _action){
    if(_action == "booking"){
        attendanceCounter = 1;
        $.each(CGData.classesAttendance, function (index, item){
            if (item.class_id == _id && item.date == moment(getDateFromDayOfWeek(_dayOfWeek)).format("YYYY-MM-DD") ){
                attendanceCounter2 = item.memberId.split(",").length;
                attendanceCounter = attendanceCounter2 +1;
            }
        });

        if(attendanceCounter == 1){
            classDate = moment(getDateFromDayOfWeek(_dayOfWeek)).format("YYYY-MM-DD");
            $("#showDescription" + _id).append('<div class="col-1 text-center" onclick="showDescModal(\'' + _id + '\',\'' + classDate + '\')"><i style="font-size: 16px; margin-right: -10px" class="text-dark pull-right flaticon-more"></i></div>');
        }
        $("#participants" + _id).empty();
        $("#participants" + _id).append(i18n.t("participants") + ' (' + attendanceCounter + '/' + _capacity + ')');
    }else if(_action == "cancelBooking"){
        attendanceCounter = 0;
        $.each(CGData.classesAttendance, function (index, item){
            if (item.class_id == _id && item.date == moment(getDateFromDayOfWeek(_dayOfWeek)).format("YYYY-MM-DD") ){
                attendanceCounter2 = item.memberId.split(",").length;
                attendanceCounter = attendanceCounter2 -1;
            }
        });

        if(attendanceCounter == 0){
            classDate = moment(getDateFromDayOfWeek(_dayOfWeek)).format("YYYY-MM-DD");
            $("#showDescription" + _id).empty();
        }
        $("#participants" + _id).empty();
        $("#participants" + _id).append(i18n.t("participants") + ' (' + attendanceCounter + '/' + _capacity + ')');
    }
}

function cancelClassReservation(id, classId){
    console.log(id);
    if (id == "-1"){
      showError(i18n.t("reservationInConfirmProcess"));
      return;
    }
    Swal.fire({
      backdrop:false,
      title: i18n.t("sureToCancelBooking"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: i18n.t("yes"),
      cancelButtonText: i18n.t("no")
    }).then((result) => {
        if (result.value) {
            startAnnimation();
            $.ajax({
                url: ENDPOINT_SATELLITE + "customer/cancel_class",
                method: "POST",
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify({attendanceId: id})
            }).done(function(data) {
                console.log(data);
                data = data.replace(/(\n)/gm,"");
                stopAnnimation();
                if (data == "ok"){
                    classesLenght = CGDataMember.classes.length-1;
                    if (classesLenght < 1 && isMyClass){
                        $("#noClassBooked").show();
                    }
                    showInfo(i18n.t("successfullyCanceled"));
                    $("#myClass" + classId).remove();
                    $("#btnCancel" + classId).empty();
                    $("#btnBook" + classId).empty();
                    $.each(CGData.classes, function (index, item){
                        if(item.id == classId){
                            $("#btnBook" + classId).append('<button onclick="showModalPosition(' + item.dayOfWeek + ',' + item.id + ',' + item.capacity + ',' + item.bookPosition + ', true, \'' + moment(getDateFromDayOfWeek(item.dayOfWeek)).format("YYYY-MM-DD") + '\')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-success btn-upper kt-font-boldest">' + i18n.t("confirmBook") + '</button>');
                            $("#btnCancel" + classId).append('<button onclick="showModalPosition(' + item.dayOfWeek + ',' + item.id + ',' + item.capacity + ',' + item.bookPosition + ', true, \'' + moment(getDateFromDayOfWeek(item.dayOfWeek)).format("YYYY-MM-DD") + '\')" type="button" class="btn-block kt-margin-t-5 kt-font-bolder btn-pill btn-sm btn btn-success btn-upper kt-font-boldest">' + i18n.t("confirmBook") + '</button>');
                            $("#mapClass" + classId).hide();
                            $("#btnZoom" + classId).hide();
                            updateClassOcupation(item.id, item.dayOfWeek, item.capacity, 'cancelBooking');
                        }
                    });
                    
                    indexToRemove = -1;
                    $.each(CGDataMember.classes, function (index, item){
                        if (item.id == id){
                            indexToRemove = index;
                            return;
                        }
                    });

                    if (indexToRemove > -1){
                        CGDataMember.classes.splice(indexToRemove, 1);
                    }
                    itemID = [];
                    memberID = [];
                    deviceID = [];
                    memberName = [];
                    $.each(CGData.classesAttendance, function (index, item){
                        if(item.class_id == classId){
                            classAttendaceIDs = item.id.split(",");
                            for(i = 0;i < classAttendaceIDs.length; i++){
                                if (classAttendaceIDs[i] == id){
                                    indexToRemove = index;
                                    memberIDs = item.memberId.split(",");
                                    deviceIDs = item.deviceId.split(",");
                                    memberNames = item.memberName.split(",");

                                    classAttendaceIDs.splice(i, 1);
                                    memberIDs.splice(i, 1);
                                    deviceIDs.splice(i, 1);
                                    memberNames.splice(i, 1);
                                    
                                    if(memberIDs.length <= 0){
                                        CGData.classesAttendance.splice(indexToRemove, 1);
                                    }else{
                                        item.deviceId = deviceIDs.toString();
                                        item.id = classAttendaceIDs.toString();
                                        item.memberId = memberIDs.toString();
                                        item.memberName = memberNames.toString();    
                                    }
                                    return;
                                }
                            }
                        }
                    });
                }else if (data == "-20"){
                    showError(i18n.t("classCantBeCanceled"));
                }else{
                    showError(i18n.t("errorOccurred") + data);
                }
                //$("#modalPosition").modal("hide");
            }).fail(function(jqXHR, textStatus, error) {
                stopAnnimation();
                showError(i18n.t("errorOccurred") + error);
            });
        }
    });
}

function formatTimeLocale(timeString){
    if(timeString == "" || timeString == undefined){
        return "";
    }else{
        var datetime = new Date('1970-01-01T' + timeString + "Z");
        formatedTime = datetime.toLocaleTimeString(getLangLocale(), { timeZone: 'UTC' }).split(":");
        return formatedTime[0] + ":" + formatedTime[1] + " " + formatedTime[2].replace(/0/g, "");
    }
}

function getLangLocale(){
    var langLocale = "";
    
    if(typeof(Storage) !== "undefined" && localStorage !== null) {
        if (localStorage.language !== "undefined"){
            langLocale = localStorage.language;
        }
    }
    
    if (langLocale == "" || langLocale==null){
        langLocale = navigator.language.toLowerCase();
    }
    
    return langLocale;
}

function formatShortDateLocale(timeString){
    var datetime = new Date(timeString);
    formatedTime = datetime.toLocaleDateString(getLangLocale(), { timeZone: 'UTC', day: '2-digit',month: '2-digit'});
    return formatedTime;
}

function formatDateLocale(timeString){
    var datetime = new Date(timeString);
    formatedTime = datetime.toLocaleDateString(getLangLocale(), { timeZone: 'UTC', day: '2-digit',month: '2-digit',year: '2-digit'});
    return formatedTime;
}

function mountPhysicalAssessmentSelect(){
    $("#physicalAssessmentSelectGraph").show();
    
    if (CGDataMember.physicalAssessment.length > 1){
        strPhysicalAssessmentSelectGraph = '<div style="border-radius: 5px; margin-bottom: -15px" class="bg-light">';
        strPhysicalAssessmentSelectGraph += '   <section class="dragabblePAGraph" style="height: 180px; margin-left: -15px; padding-bottom: 230px">';
        strPhysicalAssessmentSelectGraph += '       <div style="margin-top: 10px;"><span class="text-dark kt-font-bolder" style="font-size: 18px; margin-left: 5px">' + i18n.t("weight") + '</span><hr style="width: 3000px; margin-left: -20px"><div id="sparklineWeight" style="padding-top: 14px;"></div></div>';
        strPhysicalAssessmentSelectGraph += '       <div style="margin-top: 10px;"><span class="text-dark kt-font-bolder" style="font-size: 18px; margin-left: 5px">' + i18n.t("fat") + '</span><hr style="width: 3000px; margin-left: -20px"><div id="sparklineFat" style="padding-top: 14px;"></div></div>';
        strPhysicalAssessmentSelectGraph += '       <div style="margin-top: 10px;"><span class="text-dark kt-font-bolder" style="font-size: 18px; margin-left: 5px">' + i18n.t("slimMass") + '</span><hr style="width: 3000px; margin-left: -20px"><div id="sparklineSlimMass" style="padding-top: 14px;"></div></div>';
        strPhysicalAssessmentSelectGraph += '       <div style="margin-top: 10px;"><span class="text-dark kt-font-bolder" style="font-size: 18px; margin-left: 5px">' + i18n.t("fatMass") + '</span><hr style="width: 3000px; margin-left: -20px"><div id="sparklineFatMass" style="padding-top: 14px;"></div></div>';
        strPhysicalAssessmentSelectGraph += '   </section>';
        strPhysicalAssessmentSelectGraph += '</div>';
        $("#physicalAssessmentSelectGraph").append(strPhysicalAssessmentSelectGraph);
    }
    
    $('#PaImage').attr('src', ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/" + localStorage.id + ".png");

    var weightArray = [];
    var fatArray = [];
    var slimMassArray = [];
    var fatMassArray = [];

    $.each(CGDataMember.physicalAssessment, function (index, item){
        strPhysicalAssessmentSelect = '<div class="kt-portlet__body bg-light kt-margin-b-5">';
        strPhysicalAssessmentSelect += '      <div class="row">';
        strPhysicalAssessmentSelect += '          <div class="text-left col-8">';
        strPhysicalAssessmentSelect += '              <h5 class="kt-font-boldest kt-font-dark"><i style="font-size: 18px; color: var(--main-color)" class="flaticon2-user-outline-symbol"></i> &nbsp;&nbsp;' + i18n.t("appraiser") + ': ' + item.appraiser + ' </h5><br>';
        strPhysicalAssessmentSelect += '              <h5 class="kt-font-boldest kt-font-dark"><i style="font-size: 18px; color: var(--main-color)" class="flaticon2-calendar-5"></i> &nbsp;&nbsp;' + formatDateLocale(item.appraisalDate) + ' </h5>';
        strPhysicalAssessmentSelect += '          </div>';
        strPhysicalAssessmentSelect += '          <div class="text-right col-4">';
        strPhysicalAssessmentSelect += '              <button onclick="showPhysicalAssessment(' + item.id + ')" type="button" class="kt-font-bolder btn-pill btn change-class-map btn-upper"><span class="kt-font-boldest"><i style="font-size: 24px" class="flaticon-search-magnifier-interface-symbol"></i></span><br>'+ i18n.t("verify") + '</button>';
        strPhysicalAssessmentSelect += '          </div>';
        strPhysicalAssessmentSelect += '      </div>';
        strPhysicalAssessmentSelect += '</div>';

        $("#physicalAssessmentSelect").append(strPhysicalAssessmentSelect);

        if(item.foldprotocol == 5){
            bodySlimMass = item.bodyMass;
            bodyFatMass = item.bodyFatMass;
        }else{
            bodySlimMass = (item.weightc - (item.weightc * item.bodyFat) / 100).toFixed(2);
            bodyFatMass = ((item.weightc * item.bodyFat) / 100).toFixed(2);
        }

        weightArray.push(item.weightc);
        fatArray.push(item.bodyFat);
        slimMassArray.push(bodySlimMass);
        fatMassArray.push(bodyFatMass);
    });

    $(".dragabblePAGraph").slick({
        dots: true,
        vertical: false,
        infinite: true
    });

    $("#sparklineWeight").sparkline(weightArray, {
        type: 'line',
        width: $("size").width() -10,
        height: '150',
        lineColor: color,
        fillColor: shadeBlend(0.7, color),
        lineWidth: 3,
        spotColor: shadeBlend(0.09, color),
        minSpotColor: shadeBlend(0.09, color),
        maxSpotColor: shadeBlend(0.09, color),
        highlightSpotColor: color,
        spotRadius: 5,
        chartRangeMin: 0.5,
        drawNormalOnTop: false
    });

    $("#sparklineFat").sparkline(fatArray, {
        type: 'line',
        width: $("size").width() -10,
        height: '150',
        lineColor: color,
        fillColor: shadeBlend(0.7, color),
        lineWidth: 3,
        spotColor: shadeBlend(0.09, color),
        minSpotColor: shadeBlend(0.09, color),
        maxSpotColor: shadeBlend(0.09, color),
        highlightSpotColor: color,
        spotRadius: 5,
        chartRangeMin: 0.5,
        drawNormalOnTop: false
    });

    $("#sparklineSlimMass").sparkline(slimMassArray, {
        type: 'line',
        width: $("size").width() -10,
        height: '150',
        lineColor: color,
        fillColor: shadeBlend(0.7, color),
        lineWidth: 3,
        spotColor: shadeBlend(0.09, color),
        minSpotColor: shadeBlend(0.09, color),
        maxSpotColor: shadeBlend(0.09, color),
        highlightSpotColor: color,
        spotRadius: 5,
        chartRangeMin: 0.5,
        drawNormalOnTop: false
    });

    $("#sparklineFatMass").sparkline(fatMassArray, {
        type: 'line',
        width: $("size").width() -10,
        height: '150',
        lineColor: color,
        fillColor: shadeBlend(0.7, color),
        lineWidth: 3,
        spotColor: shadeBlend(0.09, color),
        minSpotColor: shadeBlend(0.09, color),
        maxSpotColor: shadeBlend(0.09, color),
        highlightSpotColor: color,
        spotRadius: 5,
        chartRangeMin: 0.5,
        drawNormalOnTop: false
    });
}

function showPhysicalAssessment (id){
    $("#paAppraiser").empty();
    $("#paAppraisalDate").empty();
    $("#patall").empty();
    $("#paMemberAge").empty();
    $("#paBodyFat").empty();
    $("#paIdealFat").empty();
    $("#paBodyFatMass").empty();
    $("#paBodyMass").empty();
    $("#paWeightc").empty();
    $("#paHeight").empty();
    $("#paAnamnesisq1").empty();
    $("#paAnamnesisq2").empty();
    $("#paAnamnesisq3").empty();
    $("#paAnamnesisq4").empty();
    $("#paAnamnesisq5").empty();
    $("#paAnamnesisq6").empty();
    $("#pachestrelaxed").empty();
    $("#patoraxinspired").empty();
    $("#parelaxedrightarm").empty();
    $("#pacontractedrightarm").empty();
    $("#paforearm").empty();
    $("#padiameterhandle").empty();
    $("#pabistyloid").empty();
    $("#padiameterfemoral").empty();
    $("#pathigh").empty();
    $("#pacalf").empty();
    $("#paneck").empty();
    $("#pashouder").empty();
    $("#parelaxedleftarm").empty();
    $("#pacontractedleftarm").empty();
    $("#paforearmleft").empty();
    $("#pawaist").empty();
    $("#paabdomen").empty();
    $("#pahip").empty();
    $("#pathighleft").empty();
    $("#pacalfleft").empty();
    $("#pafeetfront").empty();
    $("#pashinbone").empty();
    $("#pakneespatellafront").empty();
    $("#pahippelvisfront").empty();
    $("#paeipscrystalline").empty();
    $("#pashoulderfront").empty();
    $("#patrunk").empty();
    $("#paclavicle").empty();
    $("#paMMSSfront").empty();
    $("#paneckcervical").empty();
    $("#paheadfront").empty();
    $("#pafeetankleposterior").empty();
    $("#pashinboneposterior").empty();
    $("#pakneesposterior").empty();
    $("#paeiascrystalline").empty();
    $("#palumbarspineposterior").empty();
    $("#pathoracicspineposterior").empty();
    $("#pacervicalspineposterior").empty();
    $("#pashoulderposteriorposterior").empty();
    $("#pammssposterior").empty();
    $("#paleftscapula").empty();
    $("#parightcapula").empty();
    $("#paheadposterior").empty();
    $("#pafeetankleleft").empty();
    $("#pakneesleft").empty();
    $("#pahippelvisleft").empty();
    $("#palumbarspineleft").empty();
    $("#pathoracicspineleft").empty();
    $("#pacervicalspineleft").empty();
    $("#pashoulderleft").empty();
    $("#paheadleft").empty();
    $("#pafeetankleright").empty();
    $("#pakneesright").empty();
    $("#pahippelvisright").empty();
    $("#palumbarspineright").empty();
    $("#pathoracicspineright").empty();
    $("#pacervicalspineright").empty();
    $("#pashoulderright").empty();
    $("#paheadright").empty();
    $("#paimc").empty();
    $("#paweight").empty();
    $("#paphysicalactivity").empty();
    $("#pafamilyhistory").empty();
    $("#pasmoking").empty();
    $("#pacholesterol").empty();
    $("#pasystolicpersal").empty();
    $("#pacoronaryRisk").empty();
    $("#pawaistVsHipRisk").empty();
    $("#pavo2Max").empty();
    $("#pawells").empty();
    $("#papushups").empty();
    $("#paabdominalr").empty();
    $("#paName").empty();

    $("#pasubscapularis").empty();
    $("#patricipital").empty();
    $("#pamidaxillary").empty();
    $("#pasuprailiac").empty();
    $("#pabreastplate").empty();
    $("#paabdominal").empty();
    $("#pathighfold").empty();
    
    $.each(CGDataMember.physicalAssessment, function (index, item){
        if (item.id == id){
            $("#paName").append(localStorage.name.substring(0,14));
            $("#paAppraiser").append(item.appraiser);
            $("#paAppraisalDate").append(formatDateLocale(item.appraisalDate));
            $("#patall").append(item.tall);
            $("#paMemberAge").append(item.memberAge);
            $("#paBodyFat").append(item.bodyFat);
            $("#paIdealFat").append(item.idealfat);

            if(item.foldprotocol == 5){
                $("#paBodyFatMass").append(item.bodyFatMass);
                $("#paBodyMass").append(item.bodyMass);
            }else{
                $("#paBodyMass").append((item.weightc - (item.weightc * item.bodyFat) / 100).toFixed(2));
                $("#paBodyFatMass").append(((item.weightc * item.bodyFat) / 100).toFixed(2));
            }


            $("#paWeightc").append(item.weightc);
            $("#paHeight").append();
            $("#paAnamnesisq1").append(item.anamnesisq1);
            $("#paAnamnesisq2").append(item.anamnesisq2);
            $("#paAnamnesisq3").append(item.anamnesisq3);
            $("#paAnamnesisq4").append(item.anamnesisq4);
            $("#paAnamnesisq5").append(item.anamnesisq5);
            $("#paAnamnesisq6").append(item.anamnesisq6);
            if (item.parq1 == true){
                $("#paParq1").empty();
                $("#paParq1").append(i18n.t("yes"));
                $("#paParq1").removeClass("kt-badge--dark");
                $("#paParq1").addClass("kt-badge--brand");
            }else{
                $("#paParq1").empty();
                $("#paParq1").append(i18n.t("no"));
                $("#paParq1").removeClass("kt-badge--brand");
                $("#paParq1").addClass("kt-badge--dark");
            }
            
            if (item.parq2 == true){
                $("#paParq2").empty();
                $("#paParq2").append(i18n.t("yes"));
                $("#paParq2").removeClass("kt-badge--dark");
                $("#paParq2").addClass("kt-badge--brand");
            }else{
                $("#paParq2").empty();
                $("#paParq2").append(i18n.t("no"));
                $("#paParq2").removeClass("kt-badge--brand");
                $("#paParq2").addClass("kt-badge--dark");
            }
            
            if (item.parq3 == true){
                $("#paParq3").empty();
                $("#paParq3").append(i18n.t("yes"));
                $("#paParq3").removeClass("kt-badge--dark");
                $("#paParq3").addClass("kt-badge--brand");
            }else{
                $("#paParq3").empty();
                $("#paParq3").append(i18n.t("no"));
                $("#paParq3").removeClass("kt-badge--brand");
                $("#paParq3").addClass("kt-badge--dark");
            }
            
            if (item.parq4 == true){
                $("#paParq4").empty();
                $("#paParq4").append(i18n.t("yes"));
                $("#paParq4").removeClass("kt-badge--dark");
                $("#paParq4").addClass("kt-badge--brand");
            }else{
                $("#paParq4").empty();
                $("#paParq4").append(i18n.t("no"));
                $("#paParq4").removeClass("kt-badge--brand");
                $("#paParq4").addClass("kt-badge--dark");
            }
            
            if (item.parq5 == true){
                $("#paParq5").empty();
                $("#paParq5").append(i18n.t("yes"));
                $("#paParq5").removeClass("kt-badge--dark");
                $("#paParq5").addClass("kt-badge--brand");
            }else{
                $("#paParq5").empty();
                $("#paParq5").append(i18n.t("no"));
                $("#paParq5").removeClass("kt-badge--brand");
                $("#paParq5").addClass("kt-badge--dark");
            }
            
            if (item.parq6 == true){
                $("#paParq6").empty();
                $("#paParq6").append(i18n.t("yes"));
                $("#paParq6").removeClass("kt-badge--dark");
                $("#paParq6").addClass("kt-badge--brand");
            }else{
                $("#paParq6").empty();
                $("#paParq6").append(i18n.t("no"));
                $("#paParq6").removeClass("kt-badge--brand");
                $("#paParq6").addClass("kt-badge--dark");
            }
            
            
            
            //BEGIN RISCO CORONÁRIO
            $("#paweight").append(item.weight);
            $("#paphysicalactivity").append(item.physicalactivity);
            $("#pafamilyhistory").append(item.familyhistory);
            $("#pasmoking").append(item.smoking);
            $("#pacholesterol").append(item.cholesterol);
            $("#pasystolicpersal").append(item.systolicpersal);
            $("#pacoronaryRisk").append(item.coronaryRisk);
            
            if (item.coronaryRisk <= 11){
                $("#coronaryImg1").addClass("borderimg");
            }else if (item.coronaryRisk >= 12 && item.coronaryRisk <= 17){
                $("#coronaryImg2").addClass("borderimg");
            }else if (item.coronaryRisk >= 18 && item.coronaryRisk <= 24){
                $("#coronaryImg3").addClass("borderimg");
            }else if (item.coronaryRisk >= 25 && item.coronaryRisk <= 31){
                $("#coronaryImg4").addClass("borderimg");
            }else if (item.coronaryRisk >= 32 && item.coronaryRisk <= 40){
                $("#coronaryImg5").addClass("borderimg");
            }else{
                $("#coronaryImg6").addClass("borderimg");
            }
            
            
            if (item.imc < 17){
                $("#imcImg1").addClass("borderimg");
            }else if (item.imc >= 17 && item.imc <=18.49){
                $("#imcImg2").addClass("borderimg");
            }else if (item.imc >= 18.5 && item.imc <=24.99){
                $("#imcImg3").addClass("borderimg");
            }else if (item.imc >= 25 && item.imc <=29.99){
                $("#imcImg4").addClass("borderimg");
            }else if (item.imc >= 30 && item.imc <=34.99){
                $("#imcImg5").addClass("borderimg");
            }else if (item.imc >= 35 && item.imc <=39.99){
                $("#imcImg6").addClass("borderimg");
            }else{
                $("#imcImg7").addClass("borderimg");
            }
            

            if (item.memberAge <= 29){
                if (item.gender == "F"){
                    if (item.waistVsHipRisk < 0.71){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.77){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.82){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 0.82){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }else{
                    if (item.waistVsHipRisk < 0.83){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.88){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.94){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 0.94){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }
            }else if (item.memberAge <= 39){
                if (item.gender == "F"){
                    if (item.waistVsHipRisk < 0.72){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.78){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.84){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 0.84){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }else{
                    if (item.waistVsHipRisk < 0.84){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.91){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.96){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 0.96){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }
            }else if (item.memberAge <= 49){
                if (item.gender == "F"){
                    if (item.waistVsHipRisk < 0.73){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.79){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.87){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 0.87){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }else{
                    if (item.waistVsHipRisk < 0.88){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.95){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 1.00){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 1.00){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }
            }else if (item.memberAge <= 59){
                if (item.gender == "F"){
                    if (item.waistVsHipRisk < 0.74){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.81){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.88){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 0.88){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }else{
                    if (item.waistVsHipRisk < 0.90){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.96){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 1.02){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 1.02){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }
            }else if (item.memberAge >= 60){
                if (item.gender == "F"){
                    if (item.waistVsHipRisk < 0.76){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.83){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.90){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 0.90){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }else{
                    if (item.waistVsHipRisk < 0.91){
                        $("#waistHipResultLow").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 0.98){
                        $("#waistHipResultModerate").addClass("borderimg");
                    }else if (item.waistVsHipRisk < 1.03){
                        $("#waistHipResultHigh").addClass("borderimg");
                    }else if (item.waistVsHipRisk >= 1.03){
                        $("#waistHipResultTooHigh").addClass("borderimg");
                    }
                }
            }
            
            
            if (item.gender == "F"){
                $('#avatarF1').removeClass("kt-hidden");
            }else{
                $('#avatarM1').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#avatarF2').removeClass("kt-hidden");
            }else{
                $('#avatarM2').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#avatarF3').removeClass("kt-hidden");
            }else{
                $('#avatarM3').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#avatarF4').removeClass("kt-hidden");
            }else{
                $('#avatarM4').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#avatarF5').removeClass("kt-hidden");
            }else{
                $('#avatarM5').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#avatarF6').removeClass("kt-hidden");
            }else{
                $('#avatarM6').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#avatarF7').removeClass("kt-hidden");
            }else{
                $('#avatarM7').removeClass("kt-hidden");
            }
            
            
            
            if (item.gender == "F"){
                $('#lowF1').removeClass("kt-hidden");
            }else{
                $('#lowM1').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#lowF2').removeClass("kt-hidden");
            }else{
                $('#lowM2').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#lowF3').removeClass("kt-hidden");
            }else{
                $('#lowM3').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#lowF4').removeClass("kt-hidden");
            }else{
                $('#lowM4').removeClass("kt-hidden");
            }
            
            
            if (item.gender == "F"){
                $('#pushupF').removeClass("kt-hidden");
            }else{
                $('#pushupM').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#abdominalF').removeClass("kt-hidden");
            }else{
                $('#abdominalM').removeClass("kt-hidden");
            }
            
            if (item.gender == "F"){
                $('#wellsF').removeClass("kt-hidden");
            }else{
                $('#wellsM').removeClass("kt-hidden");
            }
            
            
            //BEGIN PERIMETRIA
            $("#pachestrelaxed").append(item.chestrelaxed);
            $("#patoraxinspired").append(item.toraxinspired);
            $("#parelaxedrightarm").append(item.relaxedrightarm);
            $("#pacontractedrightarm").append(item.contractedrightarm);
            $("#paforearm").append(item.forearm);
            $("#padiameterhandle").append(item.diameterhandle);
            $("#pabistyloid").append(item.bistyloid);
            $("#padiameterfemoral").append(item.diameterfemoral);
            $("#pathigh").append(item.thigh);
            $("#pacalf").append(item.calf);
            $("#paneck").append(item.neck);
            $("#pashouder").append(item.shouder);
            $("#parelaxedleftarm").append(item.relaxedleftarm);
            $("#pacontractedleftarm").append(item.contractedleftarm);
            $("#paforearmleft").append(item.forearmleft);
            $("#pawaist").append(item.waist);
            $("#paabdomen").append(item.abdomen);
            $("#pahip").append(item.hip);
            $("#pathighleft").append(item.thighleft);
            $("#pacalfleft").append(item.calfleft);
            
            
            //BEGIN POSTURAL visão anterior
            $("#pafeetfront").append(item.feetfront);
            $("#pashinbone").append(item.shinbone);
            $("#pakneespatellafront").append(item.kneespatellafront);
            $("#pahippelvisfront").append(item.hippelvisfront);
            $("#paeipscrystalline").append(item.eipscrystalline);
            $("#pashoulderfront").append(item.shoulderfront);
            $("#patrunk").append(item.trunk);
            $("#paclavicle").append(item.clavicle);
            $("#paMMSSfront").append(item.MMSSfront);
            $("#paneckcervical").append(item.neckcervical);
            $("#paheadfront").append(item.headfront);
            
            
            //BEGIN POSTURAL visão posterior
            $("#pafeetankleposterior").append(item.feetankleposterior);
            $("#pashinboneposterior").append(item.shinboneposterior);
            $("#pakneesposterior").append(item.kneesposterior);
            $("#paeiascrystalline").append(item.eiascrystalline);
            $("#palumbarspineposterior").append(item.lumbarspineposterior);
            $("#pathoracicspineposterior").append(item.thoracicspineposterior);
            $("#pacervicalspineposterior").append(item.cervicalspineposterior);
            $("#pashoulderposteriorposterior").append(item.shoulderposteriorposterior);
            $("#pammssposterior").append(item.mmssposterior);
            $("#paleftscapula").append(item.leftscapula);
            $("#parightcapula").append(item.rightcapula);
            $("#paheadposterior").append(item.headposterior);
            
            
            //BEGIN POSTURAL visão lateral esquerda
            $("#pafeetankleleft").append(item.feetankleleft);
            $("#pakneesleft").append(item.kneesleft);
            $("#pahippelvisleft").append(item.hippelvisleft);
            $("#palumbarspineleft").append(item.lumbarspineleft);
            $("#pathoracicspineleft").append(item.thoracicspineleft);
            $("#pacervicalspineleft").append(item.cervicalspineleft);
            $("#pashoulderleft").append(item.shoulderleft);
            $("#paheadleft").append(item.headleft);
            
            
            //BEGIN POSTURAL visão lateral direita
            $("#pafeetankleright").append(item.feetankleright);
            $("#pakneesright").append(item.kneesright);
            $("#pahippelvisright").append(item.hippelvisright);
            $("#palumbarspineright").append(item.lumbarspineright);
            $("#pathoracicspineright").append(item.thoracicspineright);
            $("#pacervicalspineright").append(item.cervicalspineright);
            $("#pashoulderright").append(item.shoulderright);
            $("#paheadright").append(item.headright);
            
            
            //BEGIN COMPOSIÇÃO
            $("#pasubscapularis").append(item.subscapularis);
            $("#patricipital").append(item.tricipital);
            $("#pamidaxillary").append(item.midaxillary);
            $("#pasuprailiac").append(item.suprailiac);
            $("#pabreastplate").append(item.breastplate);
            $("#paabdominal").append(item.abdominal);
            $("#pathighfold").append(item.thighfold);
            $("#paimc").append(item.imc);
            $("#pawaistVsHipRisk").append(item.waistVsHipRisk);
            $("#pavo2Max").append(item.vo2Max);
            
            $("#pawells").append(item.wells);
            $("#papushups").append(item.pushups);
            $("#paabdominalr").append(item.abdominalr);
            
            
            //break;
        }
    });
    $("#physicalAssessmentSelect").hide();
    $("#physicalAssessmentSelectGraph").hide();
    $("#physicalAssessment").show();
}


function login(){
    counterLogin++;
    if (counterLogin <= 1){ //Impede erro de apertar botão 2 vezes quando está na tela de logins
        var mail = $('#email').val().toLowerCase();
        var expRegValidMail =  /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        var password = $('#password').val();
        password = password.replace(/[\/]/g,"");
        $('#password').val('');
        
        if (mail.length >= 10 && expRegValidMail.test(mail)== true && password.length >= 6){
            localStorage.unitID = null;
            startAnnimation();
            $.ajax({
                url: ENDPOINT_SATELLITE + "customer/login",
                method: "POST",
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify({email: mail, passWD: password})
            }).done(function (data){
                stopAnnimation();
                workoutDay = 0;
                counterLogin = 0;
                if (data.status == "success"){
                    counterLogin = 1;
                    localStorage.id=data.id;
                    localStorage.groupID=data.groupID;
                    localStorage.unitID=data.unitID.split(',')[0];
                    localStorage.unitListIDS=data.unitID;
                    localStorage.name=data.name;
                    localStorage.email=mail;
                    localStorage.token=password;
                    localStorage.memberType=data.type;
                    localStorage.clientID2=data.clientID;
                    localStorage.workoutDay=workoutDay;
                    localStorage.bearerToken=data.token;
                    setupAccessType();
                    $('#login').hide();
                    loadCompanyData();
                    if(localStorage.memberType == "member"){
                        loadMemberData();
                    }else{
                        showGroupItem('timeline');
                        showHideStaffLogin();
                    }
                }else if (data.status == "fail"){
                    showError(i18n.t("invalidLogin"));
                }else{
                    showError(i18n.t("unexpectedErrorOccurred"));
                }
            }).fail(function(jqXHR, textStatus, error){
                stopAnnimation();
                counterLogin = 0;
                showError(i18n.t("errorOcurredCheckInternet"));
            });
        }else{
            counterLogin = 0;
            showError(i18n.t("fillEmailAndPasswordFields"));
        }    
    }
}

function hideMenuAll(){
    $("#profileMenu").hide();
    $("#timelineMenu").hide();
    $("#workoutMenu").hide();
    $("#catalogMenu").hide();
    $("#scheduleMenu").hide();
    $("#bookedSessionMenu").hide();
    $("#releaseMenu").hide();
    $("#paMenu").hide();
    $("#npsMenu").hide();
    $("#wodMenu").hide();
    $("#prsMenu").hide();
    //$("#menuTimers").hide();
}

function showHideStaffLogin(){
    hideMenuAll();
    $("#timelineMenu").show();
    $("#timelineNavBar").show();
    $("#scheduleNavBar").show();
    $("#scheduleMenu").show();
    $("#profileNavBar").show();
    $("#profileMenu").show();
    $("#catalogNavBar").show();
    $("#catalogMenu").show();
    $("#memberName").empty();
    $("#memberName").append(localStorage.name);
    $('#withoutContract').hide();
    $("#contractRow").hide();
    $("#unitProfileRow").hide();
    $("#buyCreditRow").hide();
}

function hideNavBarAll(){
    $("#profileNavBar").hide();
    $("#timelineNavBar").hide();
    $("#workoutNavBar").hide();
    $("#catalogNavBar").hide();
    $("#scheduleNavBar").hide();
    $("#bookedSessionNavBar").hide();
    $("#releaseNavBar").hide();
    $("#paNavBar").hide();
    $("#npsNavBar").hide();
    $("#wodNavBar").hide();
    $("#prsNavBar").hide();
    //$("#menuTimers").hide();
}

function loadCompanyData(){
    $.ajax({
        url: STORAGE + localStorage.groupID + "/cgdata.json",
        method: "GET",
        cache: false
    }).done(function (data){
        if(data.constructor == "test".constructor){
            CGData = JSON.parse(data);
        }else{
            CGData = data;
        }
        
        $.each(CGData.classes, function (index, item){
            $.each(CGData.units, function (index, itemC){
                if(item.unitId == itemC.id){
                    userTz = moment.tz.guess();
                    if(itemC.timeZone == undefined || itemC.timeZone == "" || itemC.timeZone == userTz){
                        return;
                    }else{
                        classDate = moment(getDateFromDayOfWeek(item.dayOfWeek)).format("YYYY-MM-DD");
                        hostStartDate = moment.tz(classDate + "T" + item.startTime, itemC.timeZone);
                        clientTZStartDate = hostStartDate.clone().tz(moment.tz.guess(true));
                        item.dayOfWeek = clientTZStartDate.day();
                        if (item.dayOfWeek == 0) item.dayOfWeek = 7;
                        item.startTime = clientTZStartDate.format("HH:mm:ss");
                        if (item.endTime != undefined && item.endTime != ""){
                            hostEndDate = moment.tz(classDate + "T" + item.endTime, itemC.timeZone);
                            clientTZEndDate = hostEndDate.clone().tz(moment.tz.guess(true));
                            item.endTime = clientTZEndDate.format("HH:mm:ss");
                        }
                    }
                }
            });
        });

        localStorage.companyData = JSON.stringify(CGData);
        setupLayout();
        localStorage.version = CGData.appVersion;
        if (CGData.registerOnline == true){
            $('#buyRow').show();
        }else{
            $('#buyRow').hide();
            $('#withoutContractBtn').hide();
        }

        if (clientId !="" && clientId != undefined && (CGData.registerOnline == true || CGData.registerOnline == "true")) {
            $("#btnRegister").removeClass("kt-hidden");
        }else{
            $("#btnRegister").addClass("kt-hidden");
        }
        if(CGData.country == "br"){
            $("#registerMobile").inputmask("mask", {"mask": "(99) 99999-9999",autoUnmask: true});
            $("#registerZipcode").inputmask({"mask": "99999-999",autoUnmask: true,placeholder: ""});
            $("#registerCpf").inputmask({"mask": "999.999.999-99",autoUnmask: true,placeholder: ""});
        }else if(CGData.country == "uk"){
            $("#registerMobile").inputmask("mask", {"mask": "999999999999999",autoUnmask: true});
            $("#registerZipcode").inputmask({"mask": "********",autoUnmask: true,placeholder: ""});
            $("#registerCpf").hide();
        }

    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + error);
    });
}

function changeUnit(id){
    $.each(CGData.units, function (index, item){
        if (item.id == id){
            $('#unitSelected').empty();
            $('#unitSelected').append(item.name);
        }
    });

    if(currentScreen == "profile"){
        $("#timelineFeed").empty();
        localStorage.unitID = id;
        localStorage.feeds = [];
        localStorage.timeLineSeq = 0;
        loadTimeLine();
    }
}

function loadMemberData(){
    $("#contractDate").empty();
    $("#nutritionText").empty();
    $('#credits').empty();
    $("#memberName").empty();

    $.ajax({
        url: STORAGE + localStorage.groupID + "/member/" + localStorage.id + ".json",
        method: "GET",
        cache: false
    }).done(function (data){
        if(data.constructor == "test".constructor){
            CGDataMember = JSON.parse(data);
        }else{
            CGDataMember = data;
        }
        localStorage.memberData = JSON.stringify(CGDataMember);
        setupLayout();
        if(CGDataMember.credits >= 0){
            $('#credits').append(CGDataMember.credits);
        }else{
            $('#creditRow').hide();
        }
        $("#memberName").append(localStorage.name);

        if(localStorage.memberType == "staff"){
            return;
        }

        if(CGDataMember.contracts.length > 1){
            $("#collapseTwo5").addClass("collapse");
        }else{
            $("#collapseTwo5").removeClass("collapse");
        }

        $("#nutritionText").empty();
        if(CGDataMember.nutrition != "" && CGDataMember.nutrition != null && CGDataMember.nutrition != undefined){
            $("#nutritionText").append('<p class="text-dark kt-padding-t-10 kt-padding-b-10">' + CGDataMember.nutrition + '</p>');
            $("#nutritionRow").show();
        }else{
            $("#nutritionRow").hide();
        }
        
        $.each(CGDataMember.contracts, function (index, item){
            strModalPlans = '<table style="table-layout: fixed;" class="table table-checkable kt-align-center">';
            strModalPlans += '  <div style="background-color: var(--main-color-light)" class="kt-align-center"><br>';
            strModalPlans += '      <h4 class="kt-font-boldest kt-font-light"> ' + item.name + ' </h4><hr>';
            strModalPlans += '  </div>';
            strModalPlans += '  <thead>';
            strModalPlans += '      <tr class="kt-shape-font-color-4">';
            strModalPlans += '          <th class="kt-padding-b-20 kt-font-dark kt-font-boldest text-uppercase"><p id="profileStartDate" style="font-size: 20px; color: var(--main-color)"> ' + formatDateLocale(item.startDate) + ' </p> ' + i18n.t("start") + ' <br>&nbsp;</th>';
            strModalPlans += '          <th class="kt-padding-b-20 kt-font-dark kt-font-boldest text-uppercase"><p id="profileEndDate" style="font-size: 20px; color: var(--main-color)"> ' + formatDateLocale(item.endDate) + ' </p> ' + i18n.t("end") + ' <br>&nbsp;</th>';
            strModalPlans += '      </tr>';
            strModalPlans += '  </thead>';
            strModalPlans += '</table>';
            
            $('#contractDate').append(strModalPlans);
            if(item.type == "std"){
                $('#creditRow').hide();
            }
            $('#buyCreditRow').show();
        });

        $('#pendingPayments').empty();
        $.each(CGDataMember.payments, function (index, item){
            if (CGData.registerOnline == true){
                $("#paymentRow").show();
            }
            strPendingPayments = '<div class="form-group bg-light row kt-padding-t-10 kt-padding-b-10 kt-margin-5">';
            strPendingPayments += '    <div class="kt-align-left col-4" style="padding-top: 3px;">';
            strPendingPayments += '        <span style="font-size: 16px;" class="kt-align-justify kt-font-boldest kt-font-dark kt-padding-r-20 text-uppercase">R$ ' + item.amount + ' &nbsp; </span>';
            strPendingPayments += '    </div>';
            strPendingPayments += '    <div class="kt-align-left col-4" style="padding-top: 3px">';
            strPendingPayments += '        <span style="font-size: 16px;" class="kt-align-justify kt-font-bold kt-font-dark kt-padding-r-20 text-uppercase">' + formatDateLocale(item.dueDate) + '</span>';
            strPendingPayments += '    </div>';
            strPendingPayments += '    <div class="kt-align-right col-4">';
            if(clientId == "" || clientId == null || clientId == undefined){
                clientId = localStorage.clientID2; 
            }

            if(item.methodPayment == "BT" || item.methodPayment == "BL"){
                strPendingPayments +=   '<a id="payDebitsBtn' + item.id + '" href="' + ENDPOINT_CHECKOUT + 'pix.html?memberID=' + localStorage.id + '&paymentID=' + item.id + '&clientID=' + clientId + '" class="btn btn-sm btn-success btn-elevate btn-pill btn-upper"><span style="font-weight: 600;" class="text-white">' + i18n.t("pay") + '</span></a>';
            }else if (item.methodPayment == "CC"){
                strPendingPayments +=   '<a id="payDebitsBtn' + item.id + '" onclick="updateCard(' + item.cid + ',' + item.id + ')"; class="btn btn-sm btn-success btn-elevate btn-pill btn-upper"><span style="font-weight: 600;" class="text-white">' + i18n.t("pay") + '</span></a>';
            }
            strPendingPayments += '    </div>';
            strPendingPayments += '</div>';
            
            $('#pendingPayments').append(strPendingPayments);
        });
        loadExercises();
    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + error);
    });
}

function updateCard(contractID, id){
    $('#payDebitsBtn'+id).addClass('disabled');

    $.ajax({
        url: ENDPOINT_API + "app/tokenupdtcard",
        headers: {
            'memberID':localStorage.id,
            'email': localStorage.email,
            'token': localStorage.token,
            'groupID': localStorage.groupID,
            'contractID': contractID
        },
        method: "GET",
        dataType: "json",
        processData: false,
        contentType: 'application/json'
    }).done(function(data) {
        window.location = ENDPOINT_CHECKOUT + "card.html?id=" + localStorage.groupID + "&token=" + data.token;
        $('#payDebitsBtn'+id).removeClass('disabled');
    })
}

function showImg(input) {
    var img = new Image();
    newWidth = 200;
    newHeight = 200;
    var orientation = -1;
    
    canvas = document.getElementById("myCanvas");
    var ctx=canvas.getContext("2d");

    var dpr= window.devicePixelRatio || 1;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        img.src = URL.createObjectURL(input.files[0]);
        
        img.onload = function(){
            if (img.height > img.width){
                dif=img.width/img.height;
                newWidth = newWidth*dif;
            }else if (img.width > img.height){
                dif=img.height/img.width;
                newHeight = newHeight*dif;
            }

            EXIF.getData(img, function() {
                orientation = EXIF.getTag(this, "Orientation");
                if(/android/i.test(userAgent)){
                    orientation = -1;
                }else if(/iPad|iPhone|iPod/i.test(userAgent)){
                    if(checkIOSVersion() >= 13){
                        orientation = -1;
                    }
                }
                var ratio = (img.width / newWidth);
                var h = (img.height / ratio);
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.clearRect(0, 0, newWidth, newHeight);
                ctx.resetTransform();

                if (orientation == 3){
                    ctx.translate(newWidth/2, newHeight/2);
                    ctx.rotate(180*Math.PI/180.0);
                    ctx.translate(-newWidth/2, -newHeight/2);
                }else if (orientation == 5){
                    ctx.translate(h, 0);
                    ctx.rotate( (90 * Math.PI) / 180);
                }else if (orientation == 6){
                    canvas.width = newHeight;
                    canvas.height = newWidth;
                    ctx.clearRect(0, 0, newHeight, newWidth);
                    ctx.resetTransform();
                                        
                    ctx.translate(h, 0);
                    ctx.rotate( (90 * Math.PI) / 180);
                }else if (orientation == 7){
                    ctx.translate(h, 0);
                    ctx.rotate( (90 * Math.PI) / 180);
                }else if (orientation == 8){
                    canvas.width = newHeight;
                    canvas.height = newWidth;
                    ctx.clearRect(0, 0, newHeight, newWidth);
                    ctx.resetTransform();
                    ctx.translate(newWidth-newHeight, newWidth);
                    ctx.rotate( (-90 * Math.PI) / 180);
                    ctx.translate(0,-(newWidth-newHeight));
                }

                ctx.drawImage(img,0,0,newWidth,newHeight);
                ctx.save();
                $('#selectImg').attr('src', canvas.toDataURL());
                
                fileUpload(canvas.toDataURL("image/png"));
            });
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function fileUpload(dataURL){
    $.ajax({
        url: ENDPOINT_SATELLITE + "customer/profile_pic",
        method: "POST",
        processData: false,
        contentType: 'application/json',
        headers: {Authorization: 'Bearer ' + localStorage.bearerToken},
        data: JSON.stringify({img: dataURL})
    }).done(function(data) {
    }).fail(function(jqXHR, textStatus, error) {
        showError(i18n.t("errorOccurred") + jqXHR.status + " - " + error);
    });
}

function initApp(){
    setScrollPosition();
    if (localStorage.unitMeasure != undefined && localStorage.unitMeasure == "true"){
        $("#unitMeasure").prop('checked', true).change()
        unitMeasure = "Kg";
    }else{
        $("#unitMeasure").prop('checked', false).change();
        unitMeasure = "Lb";
    }

    if(clientGroupId != "" && clientGroupId != null && clientGroupId != undefined && clientId != "" && clientId != null && clientId != undefined){
        localStorage.groupID = clientGroupId;
        localStorage.clientID = clientId;
    }
    detectUserLanguage();
    if(localStorage.groupID != undefined && localStorage.groupID != ""){
        loadCompanyData();
    }

    if(localStorage.groupID != null && localStorage.groupID != "" && localStorage.clientID != null && localStorage.clientID != ""){
        clientGroupId = localStorage.groupID;
        clientId = localStorage.clientID;
    }

    fillColors();
    setupAccessType();

    // if (localStorage.id != undefined && localStorage.id != null && localStorage.id != ""){
    if (localStorage.id != undefined && localStorage.id != null && localStorage.id != "" && localStorage.bearerToken != undefined && localStorage.bearerToken != "undefined" && localStorage.bearerToken != null && localStorage.bearerToken != ""){
        initTimeLine();
        if(localStorage.memberType != "staff"){
            loadMemberData();
            showGroupItem(currentScreen);
        }
    }else{
        logout();
    }
    
    jQuery.extend(jQuery.validator.messages, {
        required: i18n.t("fieldRequired"),
        remote: "Please fix this field.",
        email: "Insira um endereço de email válido.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Entre com um número válido",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        accept: "Please enter a value with a valid extension.",
        creditcard: "Insira um número de cartão de crédito válido.",
        maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
        minlength: jQuery.validator.format("Insira pelo menos {0} caracteres."),
        rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
        range: jQuery.validator.format("Please enter a value between {0} and {1}."),
        max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
        min: jQuery.validator.format("Please enter a value greater than or equal to {0}."),
        pattern: i18n.t("invalidFormat")
    });
    
    $("#registerCardNumber").inputmask({"mask": "9","repeat": 16,"greedy": false});
    $("#registerCcv").inputmask({"mask": "9","repeat": 4,"greedy": false});
    $("#registerValidThru").inputmask("datetime", {inputFormat: "mm/yy",jitMasking:false,placeholder:"__/__"});
    $("#registerBirthDay").inputmask("datetime", {inputFormat: "dd/mm/yyyy",inputEventOnly: true,jitMasking:true,placeholder:"dd/mm/yyyy"});

    //Check whether there is a new version. Using native method for that
    if (localStorage.version !== undefined && localStorage.version != null && localStorage.version != "null" && localStorage.version != ''){
        checkUpdate(localStorage.version);
    }
}

function setupAccessType(){
    if (localStorage.memberType == "staff"){
        $("#menuAccessRelease").hide();
        $("#menuWorkout").hide();
        $("#menuMyClasses").hide();
        $("#menuPhysicalAssessment").hide();
        $("#menuNps").hide();
        $("#menuClasses").show();
        $("#menuCatalog").show();
        $("#menuTimeline").show();
        $("#createPostPanel").show();
        $('#selectImg').attr('src', ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/s" + localStorage.id + ".png");
    }else if(localStorage.memberType == "member"){
        if (postAllowedToAll){
            $("#createPostPanel").show();
        }else{
            $("#createPostPanel").hide();
        }
        $('#selectImg').attr('src', ENDPOINT_SATELLITE + "profile_images/" + localStorage.groupID + "/" + localStorage.id + ".png");
        $("#menuWorkout").show();
        $("#menuCatalog").show();
        $("#menuAccessRelease").show();
        $("#menuMyClasses").show();
        $("#menuPhysicalAssessment").show();
        $("#menuNps").show();
    }
}

function logout(){
    resetStatusClass();
    $("#menuBottom").hide();
    localStorage.id = "";
    localStorage.companyData = "";
    localStorage.memberData = "";
    localStorage.groupID = "";
    localStorage.bearerToken = "";
    layoutSetted = false;
    showClassParticipants = true;
    isMyClass = false;
    counterLogin = 0;
    unitsCount = 0;
    $("#whatsMenu").empty();
    $("#barbell").empty();
    $("#gymnastic").empty();
    $("#endurance").empty();
    $("#notables").empty();
    $("#girls").empty();
    $("#theHerous").empty();
    showGroupItem('login');
}

function savePost(){
    if (localStorage.termsAccepted == null || localStorage.termsAccepted === undefined){
        acceptTerms();
        return;
    }

    $("#closePostImage").addClass("kt-hidden");
    var canvas = document.getElementById("postCanvas");
    var ctx=canvas.getContext("2d");
    var memberId = localStorage.id;
    if(localStorage.memberType == "staff"){
        memberId = "s"+memberId;
    }
    
    imgPost = "";
    if (canvas.toDataURL().length > 4000){
        imgPost = canvas.toDataURL();
    }
    if (canvas.toDataURL().length > 4000 || $('#postDescription').val().trim().length > 1){
        startAnnimation();
        $.ajax({
            url: ENDPOINT_CG + 'app.php',
            method: "POST",
            dataType: "json",
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify({ action: "post", groupID: localStorage.groupID, unitID: localStorage.unitID, memberID: memberId, memberName: localStorage.name, description: $('#postDescription').val(), img: imgPost})
        }).done(function(data) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.resetTransform();
            canvas.width = 0;
            canvas.height = 0;
            $('#postDescription').val("");
            $("#postCanvas").hide();
            loadTimeLine();
            stopAnnimation();
        }).fail(function(jqXHR, textStatus, error) {
            stopAnnimation();
            showError(i18n.t("errorOccurred") + jqXHR.status + " - " + jqXHR.statusText + " - " + error);
        });
    }
}

function acceptTerms(){
    Swal.fire({
      backdrop:false,
      title: i18n.t("termsOfUse"),
      text: i18n.t("termOfUseText"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: i18n.t("disagree"),
      confirmButtonText: i18n.t("agree")
    }).then((result) => {
      if (result.value) {
        localStorage.termsAccepted = true;
        savePost();
      }
    });
}

function loadPostImage(){
    $('#imagePost').trigger('click');
}

function showPostImg(input){
    var img = new Image();
    newWidth = 512;
    newHeight = 512;

    var orientation = -1;
    
    canvas = document.getElementById("postCanvas");
    var ctx=canvas.getContext("2d");
    
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        img.src = URL.createObjectURL(input.files[0]);

        img.onload = function(){
            if (img.height > img.width){
                newWidth = (img.width/img.height)*newHeight;
            }else if (img.width > img.height){
                newHeight = (img.height/img.width)*newWidth;
            }

            EXIF.getData(img, function() {
                orientation = EXIF.getTag(this, "Orientation");
                    
                if(/android/i.test(userAgent)){
                    orientation = -1;
                }else if(/iPad|iPhone|iPod/i.test(userAgent)){
                    if(checkIOSVersion() >= 13){
                        orientation = -1;
                    }
                }

                var ratio = (img.width / newWidth);
                var h = (img.height / ratio);
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.clearRect(0, 0, newWidth, newHeight);
                ctx.resetTransform();

                if (orientation == 3){
                    ctx.translate(newWidth/2, newHeight/2);
                    ctx.rotate(180*Math.PI/180.0);
                    ctx.translate(-newWidth/2, -newHeight/2);
                }else if (orientation == 5){
                    ctx.translate(h, 0);
                    ctx.rotate( (90 * Math.PI) / 180);
                }else if (orientation == 6){
                    canvas.width = newHeight;
                    canvas.height = newWidth;
                    ctx.clearRect(0, 0, newHeight, newWidth);
                    ctx.resetTransform();

                    ctx.translate(h, 0);
                    ctx.rotate( (90 * Math.PI) / 180);
                }else if (orientation == 7){
                    ctx.translate(h, 0);
                    ctx.rotate( (90 * Math.PI) / 180);
                }else if (orientation == 8){
                    canvas.width = newHeight;
                    canvas.height = newWidth;
                    ctx.clearRect(0, 0, newHeight, newWidth);
                    ctx.resetTransform();

                    ctx.translate(newWidth-newHeight, newWidth);
                    ctx.rotate( (-90 * Math.PI) / 180);
                    ctx.translate(0,-(newWidth-newHeight));
                }

                ctx.drawImage(img,0,0,newWidth,newHeight);
                ctx.save();
                $("#postCanvas").show();
            });
        }
        reader.readAsDataURL(input.files[0]);
    }
    $("#closePostImage").removeClass("kt-hidden");
}

function removePostImg(){
    $("#postCanvas").hide();
    $("#closePostImage").addClass("kt-hidden");
}

function selectNPSScore(id){
     for (i=0;i<=10;i++){
        $("#nps" + i).removeClass("detractor-hover passive-hover promoter-hover");
        if (i<=id){
            if (id <=5){
              $("#nps" + i).addClass("detractor-hover");
            }else if (id <=8){
              $("#nps" + i).addClass("passive-hover");
            }else if (id <=10) {
                $("#nps" + i).addClass("promoter-hover");
            }
        }
     }

     npsScore = id;
}

function showInfo(msg){
   Swal.fire({
      backdrop:false,
      title: msg,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    })
}

function showError(msg){
   Swal.fire({
      backdrop:false,
      title: msg,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    })
}


function showTimelineExit(){
    exitUnitsCount = 0;
    $.each(CGData.units, function (index, item){
        if (localStorage.unitListIDS != null && localStorage.unitListIDS.includes(item.id)){
            exitUnitsCount++;
        }
    });
    if (exitUnitsCount == 0){
        $("#profile").show();
        $("#logout").hide();
    }else{
        $("#timeline").show();
        $("#logout").hide();
    }
}

function sendNPS(){
    startAnnimation();
    $.ajax({
        url: ENDPOINT_SATELLITE + "nps",
        method: "POST",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({score: npsScore, text: $("#feedback").val(), member_id: localStorage.id, client_id: localStorage.clientID2, timestamp: Date.now()})
    }).done(function(data) {
        showInfo(i18n.t("thankYou"));
        stopAnnimation();
    }).fail(function(jqXHR, textStatus, error) {
        if(jqXHR.status == 409){
            showError(i18n.t("oneRegistrationAllowed"));
        }else{
            showError(i18n.t("errorOccurred") + " - " + jqXHR.status);
        }
        stopAnnimation();
    });
}

function detectUserLanguage(callback){
    var language = "";
    if(typeof(Storage) !== "undefined" && localStorage !== null) {
        if (localStorage.language !== "undefined"){
            language = localStorage.language;
        }
    }   
    if (language == "" || language==null){
        language = navigator.language.toLowerCase();
    }
    changeLanguage(language, callback);
}

function changeLanguage(language, callback){
    $("#selectedLang").empty();
    if (language == "en-gb"){
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/260-united-kingdom.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
    }else if (language == "pt-br"){
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/255-brazil.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
    }else if (language.substring(0,2) == "pt"){
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/224-portugal.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
    }else if (language.substring(0,2) == "it"){
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/013-italy.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
    }else if (language.substring(0,2) == "fr"){
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/195-france.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
    }else if (language.substring(0,2) == "de"){
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/162-germany.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
    }else if (language.substring(0,2) == "es"){
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/128-spain.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
    }else{
        $('#selectedLang').append('<img width="20px" src="assets/media/flags/226-united-states.svg">&nbsp;&nbsp;&nbsp;<span class="kt-font-boldest kt-font-dark text-uppercase" data-i18n="changeLanguage"></span>');
        language = "en-us";
    }

    $("#collapselang").collapse('hide');

    if(typeof(Storage) !== "undefined" && localStorage !== null) {
        localStorage.language = language;
    }

    i18n.setLng(language, {fixLng: true, resStore: resources }, function(translation){
        $('[data-i18n]').i18n();
        if (callback != null) callback();
    });
}

function getURLParam(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if(sParameterName[0] == sParam){
          return sParameterName[1];
        }
    }
 }

$(() => {

    let $audio = $("audio"), // from https://tide.moreless.io/en/
        $theme = $(".theme"),
        $title = $("#title"),
        $controls = $("#controls"),
        $options = $("#options"),
        $minutes = $("#minutes"),
        $seconds = $("#seconds"),
        $start = $("#start"),
        $pause = $("#pause"),
        $reset = $("#reset"),
        $incrSession = $("#incrSession"),
        $sessionInput = $("#sessionInput"),
        $decrSession = $("#decrSession"),
        $incrBreak = $("#incrBreak"),
        $breakInput = $("#breakInput"),
        $decrBreak = $("#decrBreak"),
        breakLength = 5 * 60,
        breakMax = 10,
        breakMin = 1,
        sessionLength = 30 * 60,
        sessionMax = 60,
        sessionMin = 5,
        sessionNum = 0,
        countdown,
        countType,
        remainingTime = sessionLength;
  
    init();
  
    function init(){
      $audio.prop("volume", 0);
      $incrSession.click(() => incrSession());
      $decrSession.click(() => decrSession());
      $incrBreak.click(() => incrBreak());
      $decrBreak.click(() => decrBreak());
      $sessionInput.on("change", e => updateSession(e.target.value));
      $breakInput.on("change", e => updateBreak(e.target.value));
      $start.click(() => { if (countType === "break"){ startBreak(); } else { startSession(); } });
      $pause.click(() => pause());
      $reset.click(() => reset());
      $theme.click(e => audioSelect(e));
    }
    function startSession(){
      sessionNum++;
      countType = "session";
      $options.slideUp(143);
      $controls.removeClass().addClass("started");
      $title.fadeOut(43, function(){
        $(this).html("Round " + sessionNum).fadeIn();
      });
      $audio.animate({volume: 1}, 1000);
      start(remainingTime || sessionLength);
    }
    function startBreak(){
      countType = "break";
      $title.fadeOut(43, function(){
        $(this).html("Break " + sessionNum).fadeIn();
      });
      $audio.animate({volume: 0}, 5000);
      start(remainingTime || breakLength);
    }
    function start(timeLeft){
      clearInterval(countdown);
      countdown = setInterval(() => {
        timeLeft--;
        remainingTime = timeLeft;
        let minLeft = Math.floor(timeLeft / 60),
            secLeft = timeLeft - minLeft * 60;
        updateMinutes(minLeft);
        updateSeconds(secLeft < 10 ? "0" + secLeft : secLeft);
        if (timeLeft < 1){
          if (countType === "session"){
            startBreak(breakLength);
          } else {
            startSession();
          }
        }
      }, 1000);
    }
    function pause(){
      sessionNum--;
      $audio.animate({volume: 0}, 1000);
      clearInterval(countdown);
      $options.slideDown(143);
      $controls.removeClass().addClass("paused");
      $title.fadeOut(43, function(){
        $(this).html("Paused").fadeIn();
      });
    }
    function reset(){
      clearInterval(countdown);
      updateMinutes(sessionLength / 60);
      updateSeconds("00");
      countType = undefined;
      $controls.removeClass().addClass("reset");
      $title.html("Round!");
      remainingTime = sessionLength;
    }
    function incrSession(){
      let num = Number($sessionInput.val());
      num = num + (num === sessionMax ? 0 : 1);
      sessionLength = num * 60;
      updateSession(num);
      updateMinutes(num);
      updateSeconds("00");
      reset();
    }
    function decrSession(){
      let num = Number($sessionInput.val());
      num = num - (num === sessionMin ? 0 : 1);
      sessionLength = num * 60;
      updateSession(num);
      updateMinutes(num);
      updateSeconds("00");
      reset();
    }
    function incrBreak(){
      let num = Number($breakInput.val());
      num = num + (num === breakMax ? 0 : 1);
      breakLength = num * 60;
      updateBreak(num);
      reset();
    }
    function decrBreak(){
      let num = Number($breakInput.val());
      num = num - (num === breakMin ? 0 : 1);
      breakLength = num * 60;
      updateBreak(num);
      reset();
    }
    function updateMinutes(num){
      $minutes.text(num);
    }
    function updateSeconds(num){
      $seconds.text(num);
    }
    function updateSession(num){
      num = num < sessionMin ? sessionMin : num > sessionMax ? sessionMax : num;
      $sessionInput.val(num).blur();
      updateMinutes(num);
      updateSeconds("00");
      sessionLength = num * 60;
      reset();
    }
    function updateBreak(num){
      $breakInput.val(num < breakMin ? breakMin : num > breakMax ? breakMax : num).blur();
      breakLength = num * 60;
      reset();
    }
    function audioSelect(e){
      $theme.removeClass("selected");
      $(e.target).addClass("selected");
      switch(e.target.id){
        case "forest": $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/forest.mp3"); break;
        case "ocean": $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/ocean.mp3"); break;
        case "rainy": $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/rain.mp3"); break;
        case "peace": $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/peace.mp3"); break;
        case "cafe": $audio.attr("src", "https://joeweaver.me/codepenassets/freecodecamp/challenges/build-a-pomodoro-clock/cafe.mp3"); break;
      }
    }
  });

  (function ($) {
    $.prototype.enterPressed = function (fn) {
        $(this).keyup(function(e) {
            if ((e.keyCode || e.which) == 13) {
                fn();
            }
        });
    };
  }(jQuery || {}));

  function submitted(){
    login();
  }

  $("#password").enterPressed(submitted);
  $("#loginButton").click(submitted);