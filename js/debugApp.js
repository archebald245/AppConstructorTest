function deleteResourcesAll() { //Call in Init function
    $("#clearJsStorage").click(function() {
        deleteResourcesImg();

        var siteUrl = applicationData.UrlForUpdateApp;
        var ProjectId = applicationData.ProjectId;
        var deviceId = $.jStorage.get('ApplicationId');
        $.ajax({
            type: "POST",
            url: siteUrl + "/PushNotification/UnsubscribePushNotification",
            data: {
                projectId: ProjectId,
                deviceId: deviceId
            },
            cache: false,
            success: function() {},
            error: function() {}
        });

        $.jStorage.deleteKey("appData");
        checkJsStorage();
        $(".project-list-wrapper").removeClass("hidden");
        $(".Scan-spiner").addClass("hidden");
        $("#container").attr("style", "");
        $("#container, #custom-hide-container, .singleItem, #orderInfo, .cart, .container-statusBooking, .bookingServices-container, .container-selectFreeBookTime, .dateTimePicker-container, .order-booking").addClass("hidden");
    });
}

function startScan() { //Call in Init function

}

function startLogin() {
    event.preventDefault();
    var networkState = navigator.connection.type;
    if (networkState != Connection.NONE) {
        $(".login-wrapper").addClass('hidden');
        var form = $(".login-wrapper form#login-form");
        // var check = checkValidationAndRequired(form);
        // if (check) {
        $(".login-spiner").removeClass("hidden");
        var siteUrl = "http://appconstructornew.newlinetechnologies.net/";
        $.post('' + siteUrl + '/Account/LoginViewTool', $(form).serialize(), function(data) {
            $(".login-spiner").addClass("hidden");

            if (data.IsLogin) {
                var login = $("#login-data").val();
                $(".viewtool-login span.login-data").html(login);
                $.jStorage.set('ViewToolLogin', login);
                renderProjectList(data.ProjectList)
                $(".project-list-wrapper").removeClass('hidden');
            } else {
                alert(data.ErrorMessage);
                $("#password-data").val("");
                $(".login-wrapper").removeClass('hidden');
                return false;
            }
        });
        // }
    }
}

function checkJsStorage() { //Call in onDeviceReady function
    if ($.jStorage.get('appData') == null) {
        if ($.jStorage.get('ViewToolLogin') == null) {
            $(".login-wrapper").removeClass("hidden");
        } else {
            $(".project-list-wrapper").removeClass("hidden");
        }
        $("#container, #custom-hide-container, .singleItem, #orderInfo, .cart, .container-statusBooking, .bookingServices-container, .container-selectFreeBookTime, .dateTimePicker-container, .order-booking").addClass("hidden");
    } else {
        checkConnection();
    }
}

function deleteResourcesImg() {
    deleteResources();
    $(resources).each(function(i, img) {
        deleteImage(img);
    });
    $.jStorage.deleteKey('resources');
    $.jStorage.deleteKey('oldResources');
    resources = [];
    countFileDownload = 0;
    countFileDownloadFail = 0;

}

function ProjectListEventListener() {

    $(".take-application").unbind("click").on("click", function() {
        var projectId = $(this).parents(".project-list-item").find("[name='projectId']").val();
        var content = $(this).parents(".project-list-item").find("select option:selected").val();
        GetApplicationData(projectId, content);
    });
    $(".logout").unbind("click").on("click", function() {
        ViewToolLogout()
    });
    $(".viewtool-update").unbind("click").on("click", function() {
        startLogin();
    });
}

function GetApplicationData(project, content) {
    $(".spinner-container").removeClass("hidden");
    var siteUrl = "http://appconstructornew.newlinetechnologies.net/";
    var tokenToSend = $.jStorage.get('notificationToken');
    var deviceIdToSend = $.jStorage.get('ApplicationId');
    $.ajax({
        type: "POST",
        url: siteUrl + "/Constructor/GetContentById",
        data: {
            projectId: project,
            contentId: content,
            token: tokenToSend,
            deviceId: deviceIdToSend
        },
        cache: false,
        success: function(jsonObjectOfServer) {
            $(".spinner-container, .project-list-wrapper").addClass("hidden");
            jsonObjectOfServer = JSON.parse(jsonObjectOfServer);
            scrollTop();
            applicationData = JSON.stringify(jsonObjectOfServer.Content);
            // $.jStorage.set('ApplicationId', jsonObjectOfServer.ApplicationId);
            onCheckJson();
        },
        error: function() {
            $(".spinner-container").addClass("hidden");
        }
    });
}

function ViewToolLogout() {
    $.jStorage.set("ViewToolLogin", null);
    $("#login-data").val("");
    $("#password-data").val("");
    $("#project-list-wrapper").addClass("hidden");
    $(".login-wrapper").removeClass("hidden");
    $(".viewtool-login span.login-data").html('');
}