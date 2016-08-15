<div class="col-md-12 topm10">

    <div class="row">
        <div class="col-md-9">
            <p><strong>{$LANG.admin_template_title_template}:</strong>
                <br />{if $template.type neq default}<a href="#" id="sdns_template_name" data-type="text">{/if}{if $template.name}{$template.name}{/if}{if $template.type neq default}</a>{/if}</p>
        </div>
        <div class="col-md-3">
            <div class="text-right">
                <!-- Split button -->
                <div class="btn-group">
                    <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#dialog_addRecord" onclick=""><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> {$LANG.admin_manage_records_addrecord}</button>
                </div>
            </div>
        </div>
    </div>

    <h2>{$LANG.admin_manage_tab_records}</h2>
    <table class="dataTable display" id="sdns_template_records" width="100%" border="0" cellspacing="1" cellpadding="3">
        <thead>
            <tr>
                <th></th>
                <th>{$LANG.admin_manage_table_id}</th>
                <th>{$LANG.admin_manage_name}</th>
                <th>{$LANG.admin_manage_type}</th>
                <th>{$LANG.admin_manage_content}</th>
                <th>{$LANG.admin_manage_prio}</th>
                <th>{$LANG.admin_manage_ttl}</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="8" class="dataTables_empty">{$LANG.admin_loading_data}</td>
            </tr>
        </tbody>
    </table>

</div>

<!-- Add Modal -->
<div class="bootstrap">
    <div class="modal fade" id="dialog_addRecord" tabindex="-1" role="dialog" aria-labelledby="dialog_addRecord" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">{$LANG.admin_manage_records_addrecord}</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div id="sdns_z-name_0" class="col-md-3">
                            <label for="sdns_name_0">{$LANG.admin_manage_name}:</label>
                            <input type="text" class="form-padding form-control" name="sdns_name_0" id="sdns_name_0" placeholder="&lt;domain&gt;">
                        </div>
                        <div class="col-md-2">
                            <label for="sdns_type_0">{$LANG.admin_manage_type}:</label>
                            <select class="form-padding form-control" name="sdns_type_0" id="sdns_type_0">
                                <option value="A">A</option>
                                <option value="AAAA">AAAA</option>
                                <option value="CNAME">CNAME</option>
                                <option value="MX">MX</option>
                                <option value="NAPTR">NAPTR</option>
                                <option value="PTR">PTR</option>
                                <option value="RP">RP</option>
                                <option value="SPF">SPF</option>
                                <option value="SRV">SRV</option>
                                <option value="SSHFP">SSHFP</option>
                                <option value="TLSA">TLSA</option>
                                <option value="TXT">TXT</option>
                            </select>
                        </div>
                        <div id="sdns_z-content_0" class="col-md-4">
                            <label for="sdns_content_0">{$LANG.admin_manage_content}:</label>
                            <input type="text" class="form-padding form-control" name="sdns_content_0" id="sdns_content_0">
                        </div>
                        <div id="sdns_z-prio_0" class="col-md-1">
                            <label for="sdns_prio_0">{$LANG.admin_manage_prio}:</label>
                            <input type="text" class="form-padding form-control" name="sdns_prio_0" id="sdns_prio_0">
                        </div>
                        <div class="col-md-2">
                            <label for="sdns_ttl_0">{$LANG.admin_manage_ttl}:</label>
                        	{if $ttl.preset}
                            <select class="form-padding form-control" name="sdns_ttl_0" id="sdns_ttl_0">
                                <option {if $template.default_ttl eq "60"}SELECTED{/if} value="60">1 {$LANG.admin_manage_minute}</option>
                                <option {if $template.default_ttl eq "300"}SELECTED{/if} value="300">5 {$LANG.admin_manage_minutes}</option>
                                <option {if $template.default_ttl eq "3600"}SELECTED{/if} value="3600">1 {$LANG.admin_manage_hour}</option>
                                <option {if $template.default_ttl eq "86400"}SELECTED{/if} value="86400">1 {$LANG.admin_manage_day}</option>
                                {if $template.default_ttl neq "60" && $template.default_ttl neq "300" && $template.default_ttl neq "3600" && $template.default_ttl neq "86400"}
                                <option SELECTED value="{$template.default_ttl}">{$template.default_ttl}</option>
                                {/if}
                            </select>
                            {else}
                            <input type="text" class="form-padding form-control" name="sdns_ttl_0" id="sdns_ttl_0">
                            {/if}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal" onclick="record_add('template')">{$LANG.admin_add}</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.admin_cancel}</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Delete Modal -->
<div class="bootstrap">
    <div class="modal fade" id="dialog_deleteRecord" tabindex="-1" role="dialog" aria-labelledby="dialog_deleteRecord" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">{$LANG.admin_manage_records_deleterecord}</h4>
                </div>
                <div class="modal-body">
                    <p>{$LANG.admin_manage_text_deleterecord}</p>
                    <br />
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="record_delete('template')">{$LANG.admin_delete}</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">{$LANG.admin_cancel}</button>
                </div>
            </div>
        </div>
    </div>
</div>

<input type="hidden" id="sdns_zone" value="{$template.id}">
<input type="hidden" id="sdns_record">

<script>
$(document).ready(function() {    
    // Make template name editable
    $('#sdns_template_name').editable({
		mode: 'inline',
		url: function(param) {
			updateTemplate(param.value);
		},
		emptytext: '{$LANG.admin_template_unnamed}',
	});
});
</script>