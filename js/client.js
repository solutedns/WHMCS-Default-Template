/**********************************************
 
 *** SoluteDNS PRO for WHMCS ***
 
 File:					template/js/client.js
 File version:			3.18.001
 
 Copyright (C) NetDistrict 2016-2018
 All Rights Reserved
 
 **********************************************/
function sendData(json) {

    NProgress.start();

    if (typeof time1 !== 'undefined') {
        clearTimeout(time1);
    }
    if (typeof time2 !== 'undefined') {
        clearTimeout(time2);
    }

    $.ajax({
        data: {
            'data': json
        },
        url: setDataURL() + 'index.php?m=solutedns&action=post',
        method: "POST",
        cache: false,
        success: function(data) {

            var result = JSON.parse(data);

            if (result) {
                result.forEach(function(data) {

                    setMessage(data['title'], data['msg'], data['status'], data['tablereload'], data['pagereload'], data['fieldreset'], data['msgReset'], data['fixed'], data['errorFields'])

                    if (data['syscheck'] == true) {
                        syscheck();
                    }

                    if (typeof data['field'] !== 'undefined') {
                        setErrorField(data['field']);
                    }

                });
            }

            NProgress.done();

        },
        error: function() {
            alert('Failed to load notifications.\nPlease try to refresh this page.')
        },

    });

}

function setMessage(title, desc, status, tableReload, pageReload, fieldReset, msgReset, fixed, errorFields) {

    /* Message Reset */
    if (msgReset == true) {
        resetMessages();
    }

    /* Generate Unique ID */
    var id = '4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    /* Set message state */
    if (status == 'error') {
        var state = 'alert2 alert2-danger';
    } else {
        var state = 'alert2 alert2-' + status;
    }

    /* Add Message */
    $('#msgConsole').append('<div id=' + id + ' style="display: none;" class="' + state + '"><div><h4>' + title + '</h4></div><div><p>' + desc + '</p></div></div>');

    /* Display Message */
    $("#" + id).show("slow", function() {
        $('html, body').animate({
            scrollTop: $("#msgConsole").offset().top - 10
        }, 400);
        if (fixed != true) {
            setTimeout(function() {
                $("#" + id).hide("slow");
            }, 8000);
            setTimeout(function() {
                $("#" + id).remove();
            }, 8500);
        }
    });

    /* Reload Table Date */
    if (tableReload == true) {
        SDNS_dataTable.fnReloadAjax();
    }

    /* Reload Page */
    if (pageReload == true) {
        setTimeout(function() {
            location.reload()
        }, 2000);
    }

    /* Reset Field Entries */
    if (fieldReset == true) {
        clearFields();
        resetDNSField();
    }

    /* Set Error Field */
    setErrorMark(errorFields);

}

function updateSettings(element) {
    var fields = $("#" + element + " :input").serializeArray();
    var data = JSON.stringify(fields);

    sendData(data)
}

function updatePlain(action) {

    var zone = $("#sdns_zone").val();

    var item = {
        action: action,
        zone: zone,
    };

    jsonString = JSON.stringify(item);
    sendData(jsonString);
	
}

function resetMessages() {

    /* Clear Message Box */
    $("#msgConsole").empty();

    /* Retrieve System Messages */
    getState();

    if ($("#sdns_zone").val().length > 0) {
        getZoneState();
    }

}

function getState() {

    var zone = $("#sdns_domain").val();

    var item = {
        action: 'systemState',
        zone: zone,
    };

    jsonString = JSON.stringify(item);

    sendData(jsonString);

}

function setErrorMark(fields) {

    /* Remove previous set errors */
    $(".col-md-1 div").removeClass("has-error");
    $(".col-md-2 div").removeClass("has-error");
    $(".col-md-3 div").removeClass("has-error");
    $(".col-md-9 div").removeClass("has-error");

    if (fields != null) {

        /* Add error to selected fields */
        var fields = fields.split(",");

        fields.forEach(function(field) {
            $("#" + field + "_field").addClass("has-error");;
        });

    }

}

function isDataTable(nTable) {
    return $.fn.DataTable.fnIsDataTable('#' + nTable);
}

function selectTemplate(value) {
    SDNS_recordTable.fnDestroy();
    drawRecords('sdns_template_records', value);
}

function edit(id) {

    /* Reset previous selected field */
    resetDNSField();

    /* Enable current fields */
    $('#sdns_name_' + id).prop('disabled', false);
    $('#sdns_type_' + id).prop('disabled', false);
    $('#sdns_content_' + id).prop('disabled', false);
    $('#sdns_prio_' + id).prop('disabled', false);
    $('#sdns_ttl_' + id).prop('disabled', false);

    $('#sdns_edit_' + id).hide();
    $('#sdns_save_' + id).show();

    setRecord(id);

}

function resetDNSField() {

    var id = $("#sdns_record").val();

    if (id > 1) {
        /* Disable previous fields */
        $('#sdns_name_' + id).prop('disabled', true);
        $('#sdns_type_' + id).prop('disabled', true);
        $('#sdns_content_' + id).prop('disabled', true);
        $('#sdns_prio_' + id).prop('disabled', true);
        $('#sdns_ttl_' + id).prop('disabled', true);

        $('#sdns_save_' + id).hide();
        $('#sdns_edit_' + id).show();
    }
}

function setErrorField(field) {
    var record_id = $("#sdns_record").val();

    $("#sdns_z-" + field + "_" + record_id).addClass("has-error");
}

function clearFields() {
    $("#sdns_name_0").val("");
    $("#sdns_content_0").val("");
    $("#sdns_prio_0").val("");
}

function clearErrorField() {

    var record_id = $("#sdns_record").val();

    $("#sdns_z-name_" + record_id).removeClass("has-error");
    $("#sdns_z-type_" + record_id).removeClass("has-error");
    $("#sdns_z-content_" + record_id).removeClass("has-error");
    $("#sdns_z-prio_" + record_id).removeClass("has-error");
    $("#sdns_z-ttl_" + record_id).removeClass("has-error");

}

function zone_add() {

    var zone = $("#sdns_addzone_domain").val();

    var item = {
        action: 'addzone',
        zone: zone,
    };

    jsonString = JSON.stringify(item);

    sendData(jsonString);

    $("#sdns_addzone_domain").val('');

}

function zone_delete() {

    var zone = $("#sdns_zone").val();

    var item = {
        action: 'deletezone',
        zone: zone,
    };

    jsonString = JSON.stringify(item);

    sendData(jsonString);

}


function record_add(type) {

    setRecord(0);
    clearErrorField()

    var zone = $("#sdns_zone").val();
    var var1 = $("#sdns_name_0").val();
    var var2 = $("#sdns_type_0").val();
    var var3 = $("#sdns_content_0").val();
    var var4 = $("#sdns_prio_0").val();
    var var5 = $("#sdns_ttl_0").val();

    if (type == 'template') {
        var item = {
            action: 'addtemplate',
            zone: zone,
            name: var1,
            type: var2,
            content: var3,
            prio: var4,
            ttl: var5,
            template: true
        };
    } else {
        var item = {
            action: 'addrecord',
            zone: zone,
            name: var1,
            type: var2,
            content: var3,
            prio: var4,
            ttl: var5
        };
    }

    jsonString = JSON.stringify(item);

    sendData(jsonString);

}

function record_edit(type, record_id) {

    clearErrorField()

    var zone = $("#sdns_zone").val();

    var var1 = $("#sdns_name_" + record_id).val();
    var var2 = $("#sdns_type_" + record_id).val();
    var var3 = $("#sdns_content_" + record_id).val();
    var var4 = $("#sdns_prio_" + record_id).val();
    var var5 = $("#sdns_ttl_" + record_id).val();

    if (type == 'template') {
        var item = {
            action: 'edittemplate',
            zone: zone,
            record_id: record_id,
            name: var1,
            type: var2,
            content: var3,
            prio: var4,
            ttl: var5,
            template: true
        };
    } else {
        var item = {
            action: 'editrecord',
            zone: zone,
            record_id: record_id,
            name: var1,
            type: var2,
            content: var3,
            prio: var4,
            ttl: var5
        };
    }

    jsonString = JSON.stringify(item);

    sendData(jsonString);

}

function record_delete(type) {

    var zone = $("#sdns_zone").val();
    var record_id = $("#sdns_record").val();

    if (type == 'template') {
        var item = {
            action: 'deletetemplate',
            zone: zone,
            record_id: record_id,
            template: true
        };
    } else {
        var item = {
            action: 'deleterecord',
            zone: zone,
            record_id: record_id
        };
    }

    jsonString = JSON.stringify(item);

    sendData(jsonString);

}

function deleteSelected() {

    var deleteArray = [];

    $("input:checkbox[name=sdns_select]:checked").each(function() {
        deleteArray.push($(this).val());
    });

    var zone = $("#sdns_zone").val();
    var records = deleteArray;

    var data = {
        action: 'deleteselectedrecords',
        zone: zone,
        records: records
    };

    jsonString = JSON.stringify(data);

    sendData(jsonString);

}

function update_reverse(id) {
    var action = 'updatereverse';
    var name = $("#sdns_hostname_" + id).val();

    var item = {
        action: action,
        name: name,
        id: id
    };

    jsonString = JSON.stringify(item);

    sendData(jsonString);
}

/* DNS Assistant */
function dnsassist(type) {
    var action = 'dnsassist';
    var zone = $("#sdns_zone").val();

    if (type == 'srv') {

        var item = {
            action: action,
            type: 'srv',
            zone: zone,
            service: $("#sdns_srv_service").val(),
            protocol: $("#sdns_srv_protocol").val(),
            ttl: $("#sdns_srv_ttl").val(),
            priority: $("#sdns_srv_priority").val(),
            weight: $("#sdns_srv_weight").val(),
            target: $("#sdns_srv_target").val(),
            port: $("#sdns_srv_port").val()
        };
    }

    if (type == 'tlsa') {

        var item = {
            action: action,
            type: 'tlsa',
            zone: zone,
            usage: $('input[name=sdns_tlsa_usage]:checked').val(),
            selector: $('input[name=sdns_tlsa_selector]:checked').val(),
            matching_type: $('input[name=sdns_tlsa_type]:checked').val(),
            cert: $("#sdns_tlsa_certificate").val(),
            port: $("#sdns_tlsa_port").val(),
            protocol: $("#sdns_tlsa_protocol").val(),
            name: $("#sdns_tlsa_name").val()
        };

    }

    jsonString = JSON.stringify(item);

    sendData(jsonString);
}

function setRecord(id) {
    $("#sdns_record").val(id);
}

function setZone(id) {
    $("#sdns_zone").val(id);
}

function setZoneName(name) {
    $('#sdns_zone_name span').text(name);
}

function setDataURL() {

    var lastChar = location.pathname.substr(location.pathname.length - 1);
	
    if (lastChar.search(/^\s*\d+|\/\s*$/) != -1) {
		
        var pathName = location.pathname.substr(0, location.pathname.lastIndexOf("\/"));
		
		var secLastChar= location.pathname.substr(location.pathname.length - 2).replace(/.$/,'')
	
		if (lastChar == '\/' && secLastChar.search(/^\s*\d+\s*$/) != -1) {
			 pathName = location.pathname.substr(0, location.pathname.lastIndexOf("\/"));
			 pathName = pathName.substr(0, pathName.lastIndexOf("\/"));	
		}

        pathName = pathName.substr(0, pathName.lastIndexOf("\/"));

    } else {
        var pathName = location.pathname.substr(0, location.pathname.lastIndexOf("\/"));

    }

    return location.protocol + '//' + location.host + pathName + '/';

}

$(document).ready(function() {

    /* Javascript to enable link to tab */
    var url = document.location.toString();
    if (url.match('#')) {
        $('.nav-tabs a[href="#' + url.split('#')[1] + '"]').tab('show');
        var atab = url.split('#')[1];
    }

    /* HTML5 Prevent scrolling! */
    $('.nav-tabs a').on('shown.bs.tab', function(e) {
        if (history.pushState) {
            history.pushState(null, null, e.target.hash);
        } else {
            window.location.hash = e.target.hash; //Polyfill for old browsers
        }
    })

    /* Activate tooltip */
    $(function() {
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
            html: true,

            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large"></div></div>'

        })
    })

    /* Disable Console if EventSource not supported */
    if (typeof(EventSource) !== "undefined") {} else {
        $('#console-job span').text("Your browser does not support the console output.");
        $('#console-status span').text("Console not supported");
    }

    /* Load table of active tab  */
    if (atab == 'tabRecords') {
        drawRecords('sdns_records', $("#sdns_zone").val());
    } else if (atab == 'tabTemplate') {
        drawRecords('sdns_template');
    } else if (atab == 'tabReverse') {
        drawReverse('sdns_reverse');
    } else if (atab == 'tabOverview') {
        drawOverview('sdns_overview');
    } else if (atab == null) {
        if ($("#sdns_zone").val()) {
            drawRecords('sdns_records', $("#sdns_zone").val());
        } else {
            drawOverview('sdns_overview');
        }
    } else if (document.URL.indexOf("server") != -1 || atab != null && atab != 'overview' && atab != 'templates') {
        // No table in active tab
    }

    /* Load table when opening tab */
    $("#Primary_Sidebar-Dns_Management-Overview").click(function() {
        drawOverview('sdns_overview');
    });
    $("#Primary_Sidebar-Dns_Management-Template").click(function() {
        drawRecords('sdns_template');
    });
    $("#Primary_Sidebar-Dns_Management-Reverse").click(function() {
        drawReverse('sdns_reverse');
    });
    $("#Primary_Sidebar-DNS_Management-Records").click(function() {
        drawRecords('sdns_records', $("#sdns_zone").val());
    });

});