/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$("a[data-action=clearEvent]").live('click',function(e){
    var $this = $(this);
    var id = $this.attr('data-id')
    e.preventDefault();
    if(typeof(store.events[id])=="undefined"){
        delete store.events['bak_'+id];
    }else{
        delete store.events[id];
    }
    saveStore();
    if($('.cloudSyncList li').length==0){
        $("#modalSyncEvents").modal('hide');
    }
    $(this).parent().fadeOut(500,function(){
        $(this).remove();
    }) 
        
})
$("a[data-action=acceptEvent]").live('click',function(e){
    var $this = $(this);
    e.preventDefault();
    syncEvents();
    $("#modalSyncEvents").modal('hide');
})
$("a[data-action=closeModal]").live('click',function(e){
    e.preventDefault();
    $("#modalSyncEvents").modal('hide');

})

$('a[href="#tasks_notifications"]').live('click',function(){
    $("#nu_notifications").fadeOut(1000);
    $("#nu_notifications").html(0);
    removeBadge();
       
})
$('a[href="#tasks_new_task"]').live('click',function(){
    renderTaskForm()
})
$('a[href="#tasks_notifications"]').live('click',function(){
    renderUserToNotify()
})
//Subtasks
$('#addSubtaskForm').on('submit', function(e){
    e.preventDefault();
    createSubtask();
} ); 
$("[data-action=editTask]").live('click',function(e){
    e.preventDefault();
    editTask();
})
$("[data-action=closeTask]").live('click',function(e){
    e.preventDefault();
    closeTask();
})
    
    
$('a[data-action="closeComments"]').live('click',function(e){
    e.preventDefault();
    $('#addCommentForm textarea').css('height','22px')
    $('#addCommentForm').removeClass('active');
})
$('#addCommentForm textarea').on('focus',function(){
    $('#addCommentForm').addClass('active');
    $('#addCommentForm textarea').css('height','120px')
        
});
$('#addCommentForm button[type="reset"]').on('click',function(){
    $('#addCommentForm').removeClass('active');
    $('#addCommentForm textarea').css('height','22px')
}) 
//TASK FORM
$('#taskForm').TrackerForm({
    'type':'tasks'
});
$('#taskForm').live('submit',function(e){
    e.preventDefault();
    createTask();
})

/*
window.onerror = function(errorMsg, url, lineNumber){
    console.log("COPIEN ESTO : JS ERRROR : in line"+ lineNumber + ' | in URL : '+ url+"| Message : "+errorMsg);
    return true;
}
*/

function hideTaskTabs(){
    if($('a[href=#tasks_subtasks]').parent().css('display') != 'none'){
        $("a[href=#tasks_subtasks]").parent().hide();
        $("a[href=#task_comments]").parent().hide();
        $('#panelTabs a[href="#tasks_notifications"]').tab('show')
    }
}
function showTaskTabs(){
    if($('a[href=#tasks_subtasks]').parent().css('display') == 'none'){
        $("a[href=#tasks_subtasks]").parent().show();
        $("a[href=#task_comments]").parent().show();
        $('#panelTabs a[href="#tasks_subtasks"]').tab('show')
    }
}

initNotifications(); //importante

//AUTOSUGGEST
(function( $ ) {
    $.widget( "ui.combobox", {
        _create: function() {
            var input,
            that = this,
            select = this.element.hide(),
            selected = select.children( ":selected" ),
            value = selected.val() ? selected.text() : "",
            wrapper = this.wrapper = $( "<span>" )
            .addClass( "ui-combobox" )
            .insertAfter( select );
 
            function removeIfInvalid(element) {
                var value = $( element ).val(),
                matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( value ) + "$", "i" ),
                valid = false;
                select.children( "option" ).each(function() {
                    if ( $( this ).text().match( matcher ) ) {
                        this.selected = valid = true;
                        return false;
                    }
                });
                if ( !valid ) {
                // remove invalid value, as it didn't match anything
                /*
                        $( element )
                            .val( "" )
                            .attr( "title", value + " didn't match any item" )
                            .tooltip( "open" );
                        select.val( "" );
                        setTimeout(function() {
                            input.tooltip( "close" ).attr( "title", "" );
                        }, 2500 );
                        input.data( "autocomplete" ).term = "";
                        return false;
                        */
                }
            }
 
            input = $( "<input>" )
            .appendTo( wrapper )
            .val( value )
            .attr( "title", "" )
            .addClass( "ui-state-default ui-combobox-input" )
            .autocomplete({
                delay: 0,
                minLength: 0,
                source: function( request, response ) {
                    var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
                    response( select.children( "option" ).map(function() {
                        var text = $( this ).text();
                        if ( this.value && ( !request.term || matcher.test(text) ) )
                            return {
                                label: text.replace(
                                    new RegExp(
                                        "(?![^&;]+;)(?!<[^<>]*)(" +
                                        $.ui.autocomplete.escapeRegex(request.term) +
                                        ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                        ), "<strong>$1</strong>" ),
                                value: text,
                                option: this
                            };
                    }) );
                },
                select: function( event, ui ) {
                    ui.item.option.selected = true;
                    that._trigger( "selected", event, {
                        item: ui.item.option
                    });
                },
                change: function( event, ui ) {
                    if ( !ui.item )
                        return removeIfInvalid( this );
                }
            })
            .addClass( "ui-widget ui-widget-content ui-corner-left" );
 
            input.data( "autocomplete" )._renderItem = function( ul, item ) {
                return $( "<li>" )
                .data( "item.autocomplete", item )
                .append( "<a>" + item.label + "</a>" )
                .appendTo( ul );
            };
 
            $( "<a>" )
            .attr( "tabIndex", -1 )
            .attr( "title", "Show All Items" )
            .tooltip()
            .appendTo( wrapper )
            .button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
            .removeClass( "ui-corner-all" )
            .addClass( "ui-corner-right ui-combobox-toggle" )
            .click(function() {
                // close if already visible
                if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
                    input.autocomplete( "close" );
                    removeIfInvalid( input );
                    return;
                }
 
                // work around a bug (likely same cause as #5265)
                $( this ).blur();
 
                // pass empty string as value to search for, displaying all results
                input.autocomplete( "search", "" );
                input.focus();
            });
 
            input
            .tooltip({
                position: {
                    of: this.button
                },
                tooltipClass: "ui-state-highlight"
            });
        },
 
        destroy: function() {
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call( this );
        }
    });
})( jQuery );

function renderTaskForm(){ 
    console.log('task form')
    $("#taskForm")[0].reset();
    $('#task_id_input').remove();
    //init combo
    $( "#skillCombo" ).combobox();
    $( "#projectCombo" ).combobox();
    $("#projectComboContainer .ui-autocomplete-input").attr('placeholder','Select a project');
    $("#skillComboContainer .ui-autocomplete-input").attr('placeholder','Select a skill');
    $( '#userCombo' ).val(APIgetFromLocalStore( "user_id" )) 
    $( "#due_date" ).datepicker({
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat:"yy-mm-dd" 
    });
    
}


$(document).on('tasksDataUpdated', taskDataUpdated ); 
    
    
// TASKS PROJECT COLLAPSE
//click action:

$('.listTitle').on('click',function(){
        $item = $(this);
        var pID = $item.data('projectid');
        var state = $item.data('state');
        
        if(state=="uncollapsed"){
            $('.task[data-projectid='+pID+']').hide("blind", {
                direction: "vertical"
            }, 400,function(){})
            $item.data('state','collapsed');
            $('i',$item).removeClass('icon-chevron-down');
            $('i',$item).addClass('icon-chevron-up');
            saveListsPreferences()
        }else{
            $('.task[data-projectid='+pID+']').show("blind", {
                direction: "vertical"
            }, 400,function(){ });
            $item.data('state','uncollapsed');
            $('i',$item).addClass('icon-chevron-down');
            $('i',$item).removeClass('icon-chevron-up');
            saveListsPreferences()
        }
        
    })

function updateProjectlist(){
    
    $('.listTitle').each(function(){
        $item = $(this);
        var pID = $item.data('projectid');
        if($('.task[data-projectid='+pID+']').length==0){
            $item.hide("blind", {
                direction: "vertical"
            }, 400,function(){
                $item.remove();
            })
        }
    })
    
}

function saveListsPreferences(){
    var list_pref = [];
    $('.listTitle').each(function(){
        $item = $(this);
        var pID = $item.data('projectid');
        var state = $item.data('state');
        list_pref.push({
            projectid:pID,
            state:state
        })
    })
    offSaveListPrefs(list_pref)
    
}
function setList(){
    
    var list_pref = offGetListPrefsFromStore();
    if(list_pref!=false){
        for(i=0; i<list_pref.length;i++){
            if(list_pref[i].state == 'collapsed'){
                $item = $('.listTitle[data-projectid='+list_pref[i].projectid+']');
                $item.data('state','collapsed');
                $('i',$item).addClass('icon-chevron-up');
                $('i',$item).removeClass('icon-chevron-down');
                $('.task[data-projectid='+list_pref[i].projectid+']').hide();
            }
        }
    }
}
//------------------- end

// TASKS : clicks selects etc -----

$( '[data-component=tasklist] li' ).not('.listTitle').click(function(e) {
        var that = this;
        setTimeout(function() {
            var dblclick = parseInt($(that).data('double'), 10);
            if (dblclick > 0) {
                $(that).data('double', dblclick-1);
            } else {
                singleClick.call(that, e);
            }
        }, 300);
    }).dblclick(function(e) {
        $(this).data('double', 2);
        doubleClick.call(this, e);
    });

//singleClick : 
function singleClick(e) {
    // do something, "this" will be the DOM element
    $item = $(this);
            
    if($item.hasClass('selected')){
        $( '[data-component=tasklist] li' ).removeClass('selected');
        unSelectTask()
    }else{
        $( '[data-component=tasklist] li' ).removeClass('selected');
        $item.addClass('selected');
        selectTask($item.data('id'));
    } 
    e.preventDefault();
}


//doubleClick : 
function doubleClick(e) {
    // do something, "this" will be the DOM element
    $item = $(this);
    if($item.hasClass('tracking')){
        $( '[data-component=tasklist] li' ).removeClass('tracking');
        stopTimer()
    }else{
        $( '[data-component=tasklist] li' ).removeClass('selected');
        $( '[data-component=tasklist] li' ).removeClass('tracking');
        $item.addClass('selected');
        $item.addClass('tracking');
        takeTask($item.data('id'));
        selectTask($item.data('id'));
    }
            
    e.preventDefault();
}
//unSelectTask : 
function unSelectTask(){
    
        $('#head_tracking_name').html("..")
        $('#head_tracking_project').html("..");
        $('#head_tracking_time').html("..");
        $('#head_tracking_progress').html('--%<span class="label label-inverse">--</span>');
}
//Select Task : 
function selectTask(id){ 
    $('.task').removeClass('selected');
    var pr_name = $('.task[data-id='+id+']').attr('data-project');
    var pr_id = $('.task[data-id='+id+']').attr('data-projectid');
    pr_name = (pr_name==undefined)? '..':pr_name
    
    $("#topRow .taskDetail").data('task_id',id);
    $('#head_tracking_name').html($('.task[data-id='+id+']').attr('data-name'))
    $('#head_tracking_project').html(pr_name)
    $('#head_tracking_project').append( 
        ' <a href="#" data-id="'+id+'" data-action="editTask"><i class="icon-pencil icon-white"> </i></a>'+
        ' <a href="#" data-id="'+id+'" data-action="closeTask"><i class="icon-ok icon-white"> </i></a>'
        )
    $('#head_tracking_time').html( ssTOhhmmss($('.task[data-id='+id+']').data('time'))+'hs' )
    var estimated =  $('.task[data-id='+id+']').attr('data-estimated')
    var accumulated =  $('.task[data-id='+id+']').attr('data-time')
    var percent = Math.round(porcentaje(accumulated,estimated*60*60));
    
    if(estimated == 0){
        $('#head_tracking_progress').css('background-image','url(http://dev.trackingtime.co/img-v2/graphs/completion/completion_.png)')
        $('#head_tracking_progress').html('--%<span class="label label-inverse">'+ssTOhhmm(accumulated)+'hs</span>')
    }
    if(percent>=100 && percent!= Infinity ){
        $('#head_tracking_progress').css('background-image','url(http://dev.trackingtime.co/img-v2/graphs/completion/completion_101.png)')
        $('#head_tracking_progress').html(100+'%<span class="label label-important">'+ssTOhhmm(accumulated)+' / '+ssTOhhmm(estimated*60*60)+'hs</span>')
    }
    if(percent<100){
        $('#head_tracking_progress').css('background-image','url(http://dev.trackingtime.co/img-v2/graphs/completion/completion_'+percent+'.png)')
        $('#head_tracking_progress').html(percent+'%<span class="label label-success">'+ssTOhhmm(accumulated)+' / '+ssTOhhmm(estimated*60*60)+'hs</span>')
    }
    
    $('.task[data-id='+id+']').addClass('selected');
    var $project_list = $('.listTitle[data-projectid='+pr_id+']');
    if( $project_list.data('state')=="collapsed" ){
        $project_list.trigger('click')
    }
    
    
    initSubtasks(id);
    initComments(id);
}
    
    
//------------------- end -----