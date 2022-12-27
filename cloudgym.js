var groupId;
var clientId;
var STORAGE = "https://cloudgym.s3-sa-east-1.amazonaws.com/";
// var STORAGE = "https://cloudgym.s3-sa-east-1.amazonaws.com/" + groupId + "/";
var CGData;
var selectedUnit;
var selectedPlan;
var selectPosition;
var selectedClass;
var selectedDate;
var weekDayDate = [];
var indexTotal = 0;
var indexTotal2 = 0;
var checkDirection = "next";
var newId = "";
var unitsToShowCount = 0;
var source = "organic";
var unitsLeadSelected;

function loadData(){
    $.ajax({
        url: 'https://cloudgym.io/domains/' + window.location.hostname,
        type: 'get',
        dataType: "json"
    }).done(function(data) {
        groupId = data.id;
        clientId = data.clientid;
        STORAGE += groupId + "/";
        loadCGData();
    });
}

function loadCGData(){
// function loadData(){
    initPage();
    $.ajax({
		url: STORAGE + 'cgdata.json',
        type: 'get',
        async: false,
        cache: false
	}).done(function(data){
        if(data.constructor == "test".constructor){
            CGData = JSON.parse(data);
        }else{
            CGData = data;
        }
        if(CGData.secundaryColor == "" || CGData.secundaryColor == null){
            CGData.secundaryColor = "#ffffff";
        }
        $("body").get(0).style.setProperty("--main-color-light", shadeBlend(0.05, CGData.mainColor));//TO-DO
        $("body").get(0).style.setProperty("--main-color", CGData.mainColor); //TO-DO
        $("body").get(0).style.setProperty("--main-color-lighter", shadeBlend(0.1, CGData.mainColor));//TO-DO
        $("body").get(0).style.setProperty("--sec-color", CGData.secundaryColor); //TO-DO
        $("body").get(0).style.setProperty("--even", shadeBlend(0.1, CGData.mainColor));//TO-DO
        $("body").get(0).style.setProperty("--odd", shadeBlend(-0.1, CGData.mainColor));//TO-DO
        $("#bgImage").css("background-image", "url(" + CGData.bgImage + ")");//TO-DO
        $("#aboutImage").css("background-image", "url(" + CGData.aboutImage + ")");//TO-DO
        $("#footerImage").css("background-image", "url(" + CGData.bgImage + ")");//TO-DO

        $("#title").append(CGData.name);
        $("#logo").attr("src", CGData.logo);
        $("#logo2").attr("src", CGData.logo);
        $("#mobileLogo").attr("src", "assets/img/logo.png");
        $("#contactLogo").attr("src", "assets/img/logo.png");
        $("#slogan").append(CGData.slogan);
        $("#aboutText").append(CGData.about);
        $("#to").val(CGData.emailContact);
        if(CGData.emailContact != "" && CGData.emailContact != null && CGData.emailContact != undefined){
            $("#emailContact").append(CGData.emailContact);
        }else{
            $("#mailArea").hide();
        }

        $.ajax({
            url: STORAGE + 'docs.json',
            type: 'get',
            async: false,
            cache: false
        }).done(function(data) {
          if(data.constructor == "test".constructor){
             DOCS_DATA = JSON.parse(data);
          }else{
             DOCS_DATA = data;
          }

          termOfUse = DOCS_DATA.docs.termofuse;
          if(termOfUse != "" || termOfUse != null){
            $("#termOfUseBtn").show();
          }
          $("#termsOfUseText").empty();
          $("#termsOfUseText").append(termOfUse);
          
          policy = DOCS_DATA.docs.policy;
          if(policy != "" || policy != null){
            $("#privacyPolicyBtn").show();
          }
          $("#policyText").empty();
          $("#policyText").append(policy);
        });

        if (getURLParam("utm_source") !== null && getURLParam("utm_source") !== "" && getURLParam("utm_source") !== undefined) {
            source = getURLParam("utm_source");
        }

        // if(groupId == 2403){
        //     $("#prospectSection").show();
        // }

        // IntlTelInput START
        $("#phone").intlTelInput({
            initialCountry: "auto",
            geoIpLookup: function(callback) {
                $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                    var countryCode = (resp && resp.country) ? resp.country : "br";
                    callback(countryCode);
                });
            },
            separateDialCode: true,
            preferredCountries: ["br","gb","us"]
        });
        
        $("#phone2").intlTelInput({
            initialCountry: "auto",
            geoIpLookup: function(callback) {
                $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                    var countryCode2 = (resp && resp.country) ? resp.country : "br";
                    callback(countryCode2);
                });
            },
            separateDialCode: true,
            preferredCountries: ["br","gb","us"]
        });

        if($("#phone").val()){
            var mask = $("#phone").attr('placeholder').replace(/[0-9]/g, 9);
        }else{
            var mask = "";
        }

        if($("#phone2").val()){
            var mask2 = $("#phone2").attr('placeholder').replace(/[0-9]/g, 9);
        }else{
            var mask2 = "";
        }

        $(document).ready(function () {
            $('#phone').inputmask(mask, {"placeholder": ""});
            $('#phone2').inputmask(mask2, {"placeholder": ""});
        });

        countryData = $("#phone").intlTelInput("getSelectedCountryData");
        countryCode = "+" + countryData.dialCode;
        countryData2 = $("#phone2").intlTelInput("getSelectedCountryData");
        countryCode2 = "+" + countryData2.dialCode;

        $("#phone").on("countrychange", function (e, countryData) {
            countryCode = "+" + countryData.dialCode;
            $("#phone").val('');
            var mask = $("#phone").attr('placeholder').replace(/[0-9]/g, 9);
            $('#phone').inputmask(mask, {"placeholder": ""});
        });

        $("#phone2").on("countrychange", function (e, countryData2) {
            countryCode2 = "+" + countryData2.dialCode;
            $("#phone2").val('');
            var mask2 = $("#phone2").attr('placeholder').replace(/[0-9]/g, 9);
            $('#phone2').inputmask(mask2, {"placeholder": ""});
        });
        // IntlTelInput END
        $.get('data/' + groupId + '.txt', function(data){
            var lines = data.split("\n");
            for (var i = 0, len = lines.length; i < len; i++){
                if(lines[i].includes("apple", 0)){
                    $("#appleDynamic").attr("href", lines[i]);
                    $("#appleDynamic").show();
                    $("#appleCG").hide();
                }else if(lines[i].includes("google", 0)){
                    $("#androidDynamic").attr("href", lines[i]);
                    $("#androidDynamic").show();
                    $("#androidCG").hide();
                }
            }
        }, 'text');

        $("#selectImg").attr("src", "images/" + groupId + ".png");
        $("#selectImg").on("load", function() {
            $("#selectImg").show();
            $("#selectImgGif").hide();
        });

        //Services
        if (CGData.wifi == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Free Wi-Fi</h4></div></div><div class="icon program-item-back" style="background-color: var(--sec-color);"><div class="icon-content program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa fa-wifi"></i></div></div></div></div>');
        }
        if (CGData.bicycleCarrier == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Bicicletário</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-bicycle"></i></div></div></div></div>');
        }
        if (CGData.parking == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Estacionamento</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa fa-car"></i></div></div></div></div>');
        }
        if (CGData.locker == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Armário</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-server"></i></div></div></div></div>');
        }
        if (CGData.hairDryer == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Secador</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-fan"></i></div></div></div></div>');
        }
        if (CGData.massage == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Massagem</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-spa"></i></div></div></div></div>');
        }
        if (CGData.airConditioning == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Ar Condicionado</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-igloo"></i></div></div></div></div>');
        }
        if (CGData.towel == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Toalha</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-brands fa-servicestack"></i></div></div></div></div>');
        }
        if (CGData.physicalAssessment == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Avaliação Física</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-user-doctor"></i></div></div></div></div>');
        }
        if (CGData.steamRoom == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Sauna</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-smog"></i></div></div></div></div>');
        }
        if (CGData.kidsSpace == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Espaço KIDS</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-child"></i></div></div></div></div>');
        }
        if (CGData.store == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Loja</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-store"></i></div></div></div></div>');
        }
        if (CGData.snackBar == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Lanchonete</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-utensils"></i></div></div></div></div>');
        }
        if (CGData.pool == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Piscina</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-water-ladder"></i></div></div></div></div>');
        }
        if (CGData.aerobic == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Aeróbico</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-person-walking"></i></div></div></div></div>');
        }
        if (CGData.functional == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Funcional</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-person-praying"></i></div></div></div></div>');
        }
        if (CGData.weightRoom == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Musculação</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-dumbbell"></i></div></div></div></div>');
        }
        if (CGData.dance == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Dança</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-music"></i></div></div></div></div>');
        }
        if (CGData.gymGames == true){
            $("#services").append('<div class="col-6 col-sm-4 col-md-3 col-xl-2 program-col"><div class="program-item"><div class="program-item-front" style="background-color: var(--sec-color);"><div class="program-item-inner"><h4 style="color: var(--main-color);">Gym games</h4></div></div><div class="program-item-back" style="background-color: var(--sec-color);"><div class="program-item-inner"><i style="color: var(--main-color); font-size: 60px;" class="fa-solid fa-gamepad"></i></div></div></div></div>																		');
        }
        
        if ($('#services').is(':empty')){
            $("#features").hide();
        }
        
        if(CGData.media.length > 0){
            $("#instaSection").show();
        }
        
        showSocialMediaList = false;
        
        //Social Midia
        if (CGData.facebook != null && CGData.facebook != ""){
            showSocialMediaList = true;
            $("#socialList").append('<a target="_blank" href="' + CGData.facebook + '"><i style="color: var(--main-color);" class="fa-brands fa-facebook-square"></i></a>');
        }                                   
        if (CGData.instagram != null && CGData.instagram != ""){
            showSocialMediaList = true;
            $("#socialList").append('<a target="_blank" href="' + CGData.instagram + '"><i target="_blank" href="' + CGData.instagram + '" style="color: var(--main-color);" class="fa-brands fa-instagram"></i></a>');
        }
        if (CGData.twitter != null && CGData.twitter != ""){
            showSocialMediaList = true;
            $("#socialList").append('<a target="_blank" href="' + CGData.twitter + '"><i target="_blank" href="' + CGData.twitter + '" style="color: var(--main-color);" class="fa-brands fa-twitter"></i></a>');
        }    
        if (CGData.youtube != null && CGData.youtube != ""){
            showSocialMediaList = true;
            $("#socialList").append('<a target="_blank" href="' + CGData.youtube + '"><i target="_blank" href="' + CGData.youtube + '" style="color: var(--main-color);" class="fa-brands fa-youtube"></i></a>');
        }
        if (CGData.whatsapp != null && CGData.whatsapp != ""){
           $("#btnWhatsapp").append('<a href="https://api.whatsapp.com/send?phone=' + CGData.whatsapp  + '&text=" class="btnWppBottom" target="_blank"><i class="fa-brands fa-whatsapp WppBottom"></i></a>');
	    }

        if(showSocialMediaList){
            $("#socialMidiaList").show();
        }

        instaName = "";
        if(CGData.instagram != null && CGData.instagram != ""){
            instaName = CGData.instagram.split("/");
        }

        mountInstagram();
        mountInstagramMobile();

        // returns the year (four digits)
        var year = new Date().getFullYear();
        $("#date").append(year);

        var unitAmount = 0;
        $.each(CGData.units, function (index, item){
            if(getURLParam("unitID") == item.id){
                $("#unitName").empty();
                $("#unitName").append(item.name);
            }
            if(item.showOnline){
                lineStr = ' <div style="margin-bottom: 20px; display: inline-block;" class="col-md-4">';
                lineStr += '    <div class="club-card-item">';
                lineStr += '        <h3 style="margin-top: 15px" class="title-decor"><span style="color: var(--sec-color); white-space: normal;">' + item.name + '</span></h3>';
                lineStr += '        <ul id="description' + item.id + '" class="list" style="background-color: rgba(0, 0, 0, 0.6)"><br>';
                lineStr += '            <div padding-top: 10px; padding-bottom: 10px; margin: 4px"><p>' + item.address + '</p></div>';
                lineStr += '            <div padding-top: 10px; padding-bottom: 10px; margin: 4px"><p>' + item.city + ' - ' + item.state + '</p></div>';
                lineStr += '            <div padding-top: 10px; padding-bottom: 10px; margin: 4px"><p>' + item.phone + '</p></div>';
                lineStr += '        </ul><br>';
                lineStr += '        <a href="/unit.html?unitID=' + item.id + '" target="_blank" class="btn">Ir para unidade</a>';
                lineStr += '    </div>';
                lineStr += '</div>';
        
                $("#showUnits").append(lineStr);
                unitAmount++;
                if(getURLParam("unitID") != "" && getURLParam("unitID") != undefined){
                    if(getURLParam("unitID") == item.id){
                        $("#address").append("<br>" + item.address + "<br>" + item.city + " - " + item.state + ", " + item.zipCode + "<br>" + item.phone + "<br>");    
                    }
                }else{
                    $("#address").append("<br>" + item.address + "<br>" + item.city + " - " + item.state + ", " + item.zipCode + "<br>" + item.phone + "<br>");
                }
                if(unitAmount > 1){
                    $("#unitsLeadSection").show();
                    $("#unitsLead").append('<option value="' + item.id + '">' + item.name + '</option>');
                }else{
                    unitsLeadSelected = item.id;
                    $("#unitsLead").append('<option value="' + item.id + '">' + item.name + '</option>');
                }
            }
        });
        
        if(unitAmount > 1){
            if(getURLParam("unitID") != "" && getURLParam("unitID") != undefined){
                mountPlans(getURLParam("unitID"));
                loadClasses(getURLParam("unitID"), "monday");
            }else{
                $("#units").show();
                $("#unitsMenu").show();
                if(unitAmount > 3){
                    $("#slideUnits").show();
                }
            }
        }else if (unitAmount == 1){
            mountPlans();
            loadClasses(getURLParam("unitID"), "monday");
        }
    }).fail(function(jqXHR, textStatus, error) {
		alert(error);
	});
}

function mountPlans(unitId){
    hasDescription = false;
    $.each(CGData.plans, function (index, item) {
        if(item.description != "" && item.description != undefined && item.showOnline){
            hasDescription = true;
            return;
        }
    });
    $("#price").empty();
    $.each(CGData.plans, function (index, item) {
        lineStr = ' <div style="margin-bottom: 20px;" class="col-md-4">';
        lineStr += '    <div class="club-card-item">';
        lineStr += '        <div class="price-cover">';
        lineStr += '            <div class="price" style="font-size: 50px">' + formatCurrency(item.price) + '</div>';
        lineStr += '        </div>';
        lineStr += '        <h3 id="unitNameHeight" style="margin-top: 15px; height: 90px" class="title-decor"><span style="color: var(--sec-color)">' + item.name.substr(0,38) + '</span></h3>';
        if (item.registrationFee == null || item.registrationFee == ""){
            item.registrationFee = "0.00";
        }
        if(item.maintenanceFee == null || item.maintenanceFee == ""){
            item.maintenanceFee = "0.00";
        }
        lineStr += '        <ul class="list">';
        lineStr += '            <li>Taxa de adesão: ' + formatCurrency(item.registrationFee) + '</li>';
        lineStr += '            <li>Taxa de manutenção: ' + formatCurrency(item.maintenanceFee) + '</li>';
        if(hasDescription){
            lineStr += '        <div id="description" style="background-color: rgba(0, 0, 0, 0.6); height: 160px; overflow-y: scroll"><p style="margin: 20px">' + item.description.replace("<br>", "<br><br>") + '</p></div>';
        }
        lineStr += '        </ul>';
        
        if(window.location.href.includes('cloudgym.com')){
            lineStr += '    <a href="/checkout/index.html?id=' + groupId + '&clientID=' + clientId + '&planID=' + item.id + ' " target="_blank" class="btn">Comprar</a>';
        }else{
            lineStr += '    <a href="https://cloudgym.io/checkout/index.html?id=' + groupId + '&clientID=' + clientId + '&planID=' + item.id + '" target="_blank" class="btn">Comprar</a>';
        }
        lineStr += '    </div>';
        lineStr += '</div>';

        if(item.showOnline){
            $("#plans").show();
            $("#planMenu").show();
            $("#headerButton").empty();
            $("#headerButton").append('<a class="btn mt-5" href="#plans">Reserve agora!</a>');

            if(unitId == "" || unitId == undefined){
                $("#price").append(lineStr);                
            }else if(unitId == item.unitId){
                $("#price").append(lineStr);
            }
        }
    });
}

function showModal(modalType){
    if(modalType == "termOfUse"){
        $("#termOfUse").toggle();
    }else if(modalType == "privacyPolicy"){
        $("#privacyPolicy").toggle();
    }
}

function changeSchedule(weekDay){
    loadClasses(newId, weekDay);
}

function mountInstagramMobile(){
    $.each(CGData.media, function (index, item) {
        if(item.source == "instagram"  && indexTotal < 16){
            indexTotal2++;
        }
        if(item.source == "instagram" && item.media_type != "VIDEO" && indexTotal2 < 17){
            instagramStr = '<div class="col-12 fitness-program-col">';
            instagramStr += '    <div class="fitness-program-item2">';
            instagramStr += '        <div class="fitness-program-item-front" style="background-image: url('+ item.media_url +'); border-radius: 30px"></div>';
            instagramStr += '        <div class="fitness-program-item-back" style="background-image: url('+ item.media_url +'); border-radius: 30px">';
            instagramStr += '            <a class="fitness-program-item-inner">';
            instagramStr += '                <p style="font-size: 11px">' + item.caption.substr(0,290) + '...</p>';
            instagramStr += '            </a>';
            instagramStr += '        </div>';
            instagramStr += '    </div>';
            instagramStr += '</div>';
            $("#showInstagramMobile").append(instagramStr);
        }else if(item.media_type == "VIDEO" && indexTotal2 < 17){
            instagramStr = '<div class="col-12 fitness-program-col">';
            instagramStr += '    <video class="fitness-program-item2" style="width: 100%; border-radius: 30px; object-fit: fill;" controls>';
            instagramStr += '       <source style="border-radius: 30px" src="'+ item.media_url +'" type="video/mp4">';
            instagramStr += '    </video>';
            instagramStr += '</div>';
            $("#showInstagramMobile").append(instagramStr);
        }
    });
}

function mountInstagram(){
    $("#companyInstagram").append("@"+instaName[3]);
    $.each(CGData.media, function (index, item) {
        if(item.source == "instagram" && indexTotal < 16){
            indexTotal++;
        }
        if(indexTotal == 1){
            instagramStr = '<div class="col-12 fitness-program-col">';
            instagramStr += '    <div class="fitness-program-item2">';
        }else if(indexTotal > 1 && indexTotal < 6){
            instagramStr = '<div class="col-6 fitness-program-col">';
            instagramStr += '    <div class="fitness-program-item">';
        }else if(indexTotal > 5 && indexTotal < 10){
            instagramStr = '<div class="col-6 fitness-program-col">';
            instagramStr += '    <div class="fitness-program-item">';
        }else if(indexTotal == 10){
            instagramStr = '<div class="col-12 fitness-program-col">';
            instagramStr += '    <div class="fitness-program-item2">';
        }else if(indexTotal == 11){
            instagramStr = '<div class="col-12 fitness-program-col">';
            instagramStr += '    <div class="fitness-program-item2">';
        }else if(indexTotal > 11  && indexTotal < 16){
            instagramStr = '<div class="col-6 fitness-program-col">';
            instagramStr += '    <div class="fitness-program-item">';
        }
        if(item.source == "instagram" && item.media_type != "VIDEO"){
            instagramStr += '        <div class="fitness-program-item-front" style="background-image: url('+ item.media_url +'); border-radius: 30px"></div>';
            instagramStr += '        <div class="fitness-program-item-back" style="background-image: url('+ item.media_url +'); border-radius: 30px">';
            instagramStr += '            <a class="fitness-program-item-inner">';
            instagramStr += '                <p style="font-size: 10px">' + item.caption.substr(0,290) + '...</p>';
            instagramStr += '            </a>';
            instagramStr += '        </div>';
            instagramStr += '    </div>';
            instagramStr += '</div>';
        }else if(item.source == "instagram" && item.media_type == "VIDEO"){
            instagramStr += '    <video class="fitness-program-item-video" style="border-radius: 30px; object-fit: fill;" controls>';
            instagramStr += '       <source style="border-radius: 30px;" src="' + item.media_url + '" type="video/mp4">';
            instagramStr += '    </video>';
            instagramStr += '</div>';
        }
        
        if(item.source == "instagram"){
            if(indexTotal == 1){
                $("#showInstagram").append(instagramStr);
            }else if(indexTotal > 1 && indexTotal < 6){
                $("#showInstagram2").append(instagramStr);
            }else if(indexTotal > 5 && indexTotal < 10){
                $("#showInstagram3").append(instagramStr);
            }else if(indexTotal == 10){
                $("#showInstagram4").append(instagramStr);
            }else if(indexTotal == 11){
                $("#showInstagram5").append(instagramStr);
            }else if(indexTotal > 11  && indexTotal < 16){
                $("#showInstagram6").append(instagramStr);
            }
        }
    });
}

function openApp(){
    localStorage.groupID = groupId;
    localStorage.clientID = clientId;
    window.location.href ="app/";
}

function openImgLarge(newIndex){
    prev = "prev";
    next = "next";
    instaName = CGData.instagram.split("/");
    $("#showInstagramModal").empty();
    $.each(CGData.media, function (index, item) {
        if(item.source == "instagram"){
            if (newIndex == index && item.media_type != "VIDEO"){
                mediaType = item.media_type;
                instagramModalStr =  '<div class="col-md-8 col-sm-12 verticalAlign" style="margin-left: -3.2%; margin-bottom: -2.5%; padding-right: 0;">';
                instagramModalStr += '  <img class="" style="max-width: 100%; border-radius: 3px" src="' + item.media_url + '" alt="Avatar">';
                instagramModalStr += '</div>';
                instagramModalStr += '<div class="col-md-4 col-sm-12 fw-600">';
                instagramModalStr += '  <h5 class="newFont fw-600 pt-6" style="color: var(--main-color)">'+ "@"+instaName[3].substring(0,15) + '</h5>';
                instagramModalStr += '  <p class="pt-3" style="overflow-y: auto; height: auto; max-height: 400px; font-size: 14px">' + item.caption + '<br><br><br></p>';
                instagramModalStr += '  <div style="position:absolute; bottom: 0; padding-left: 3px">';
                if(newIndex > 0){
                    instagramModalStr += '    <button class="btn btn-round text-white" style="background-color: var(--main-color)" onclick="modalSlider(\'' + prev + '\',\'' + newIndex + '\')">ANTERIOR</button>';
                }
                if(newIndex+1 != indexTotal || newIndex+1 != indexTotal2){
                    instagramModalStr += '    <button class="btn btn-round text-white" style="background-color: var(--main-color)" onclick="modalSlider(\'' + next + '\',\'' + newIndex + '\')">PRÓXIMO</button>';
                }
                instagramModalStr += '  </div>';
                instagramModalStr += '</div>';
                $("#showInstagramModal").append(instagramModalStr);
            }else if (newIndex == index && item.media_type == "VIDEO"){
                modalSlider(checkDirection, newIndex);
            }
        }
    });
    $("#signUp2").modal("show");
}

function modalSlider(status, newIndex){
    if(status == "next"){
        checkDirection = "next";
        newIndex++;
    }else{
        if (newIndex != 0){
            checkDirection = "prev";
            newIndex--;
        }
    }
    openImgLarge(newIndex);
}

function showSignUpClass(classId, classDate) {
    selectedClass = classId;
    selectedDate = moment(classDate, "YYYY-MM-DD").format("DD-MM-YYYY");
    $("#signUp").modal("show");
}

function initPage(){
    cutPoint = 0;
    weekday = moment().weekday();
    $("#weekTabModal" + weekday).addClass("active");
    $("#weekPanelModal" + weekday).addClass("active");
    $("#weekTab" + weekday).addClass("active");
    $("#weekPanel" + weekday).addClass("active");

    for (i=0; i<7; i++){
        weekId = i + weekday;
        if (weekId == 7) cutPoint = i;
        if (weekId > 6) {
            weekId = weekId - cutPoint - weekday;
        }
        $("#week" + weekId).append(moment().add(i,'days').format("DD/MM"));
        $("#weekModal" + weekId).append(moment().add(i,'days').format("DD/MM"));
        weekDayDate[weekId] = moment().add(i,'days').format("YYYY-MM-DD");
    }
}

function loadClasses(id, weekDay){
    newId = id;
    $("#schedule").empty();
    $("#weekday1").removeClass("active");
    $("#weekday2").removeClass("active");
    $("#weekday3").removeClass("active");
    $("#weekday4").removeClass("active");
    $("#weekday5").removeClass("active");
    $("#weekday6").removeClass("active");
    $("#weekday7").removeClass("active");

    $("#weekday1").hide();
    $("#weekday2").hide();
    $("#weekday3").hide();
    $("#weekday4").hide();
    $("#weekday5").hide();
    $("#weekday6").hide();
    $("#weekday7").hide();
    
    $.each(CGData.classes, function (index, item) {
        if (item.unitId == id || id == undefined || id == ""){
            $("#classes").show();
            $("#classesMenu").show();

			startTime = "";
			endTime = "";
			instructorName = "";
			if(item.startTime != null){
				startTime = item.startTime.substr(0,5); 	
			}
			if(item.endTime != null && item.endTime != "" && item.endTime != "null"){
				endTime = " às " + item.endTime.substr(0,5);
			}
			if(item.instructor != null && item.instructor != "" && item.instructor != "null"){
				instructorName = item.instructor; 
			}
			if (item.dayOfWeek == 7){
                item.dayOfWeek = 0;
            }

            itemclass  = '<tr>';
            itemclass += '    <td>';
            itemclass += '        <h4>' + item.name + '</h4>';
            itemclass += '    </td>';
            itemclass += '    <td>';
            itemclass += '        <div class="date">' + startTime + endTime + '</div>';
            itemclass += '    </td>';
            itemclass += '    <td>';
            itemclass += '        <div class="name">' + instructorName + '</div>';
            itemclass += '    </td>';
            itemclass += '    <td>';
            itemclass += '        <div class="name">' + item.capacity + ' Vagas</div>';
            itemclass += '    </td>';
            itemclass += '</tr>';
            
            if(weekDay == "monday" && item.dayOfWeek == 1){
			    $("#schedule").append(itemclass);
                $("#weekday1").addClass("active");
            }else if(weekDay == "tuesday" && item.dayOfWeek == 2){
                $("#schedule").append(itemclass);
                $("#weekday2").addClass("active");
            }else if(weekDay == "wednesday" && item.dayOfWeek == 3){
                $("#schedule").append(itemclass);
                $("#weekday3").addClass("active");
            }else if(weekDay == "thursday" && item.dayOfWeek == 4){
                $("#schedule").append(itemclass);
                $("#weekday4").addClass("active");
            }else if(weekDay == "friday" && item.dayOfWeek == 5){
                $("#schedule").append(itemclass);
                $("#weekday5").addClass("active");
            }else if(weekDay == "saturday" && item.dayOfWeek == 6){
                $("#schedule").append(itemclass);
                $("#weekday6").addClass("active");
            }else if(weekDay == "sunday" && item.dayOfWeek == 7){
                $("#schedule").append(itemclass);
                $("#weekday7").addClass("active");
            }
            $("#weekday" +  item.dayOfWeek).show();
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

function getURLParam(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}

function closeModal(){
    $("#gradeModal").hide();
}

function sendLeadForm(){
    if ($("#unitsLeadSection").is(':visible')){
        var e = document.getElementById("unitsLead");
        unitsLeadSelected = e.value;
    }

    var unfCellphone2 = countryCode2 + $("#phone2").val().replace(/[^A-Z0-9]+/ig, "");
    if($("#name2").val() == "" || $("#email2").val() == "" || $("#phone2").val() == ""){
        alert("Favor, preecher os dados corretamente.");
        return;
    }

    if(!$("#checkbox").is(":checked")) {
        alert("Favor, concorde com os termos antes de prosseguir.");
        return;
    }
    $.ajax({
        // url: "http://localhost:3003/leads",
        url: "https://satellite.cloudgym.io/customer/prospect",
        method: "POST",
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({name: $("#name2").val(), email: $("#email2").val(), cellphone: unfCellphone2.toString(), groupID: groupId, clientID: clientId, source: source, unitID: unitsLeadSelected})
    }).done(function(data) {
        alert("Cadastro recebido, obrigado por nos acompanhar!");
    }).fail(function(jqXHR, textStatus, error) {
        alert("Ops, ocorreu um erro!");
    });
}

function sendMessage(){
    var unfCellphone = $("#phone").val().replace(/[^A-Z0-9]+/ig, "");
    if ($('#contact-form')[0].checkValidity()){
        var request = JSON.stringify({action:"sendmail", to: $("#to").val(), name: $("#name").val(), from: $("#from").val(), phone: countryCode + unfCellphone, subject: $("#subject").val(), message: $("#message").val()});
        $.ajax({
            url: 'app.php',
            type: 'post',
            data: request
        }).done(function(data) {
            Swal.fire({ title: 'Mensagem enviada, entraremos em contato. Obrigado!', type: 'success', confirmButtonText: 'OK'})
        }).fail(function(jqXHR, textStatus, error) {
            Swal.fire({ title: 'Mensagem enviada, entraremos em contato. Obrigado!', type: 'success', confirmButtonText: 'OK'})
        });
    }
}