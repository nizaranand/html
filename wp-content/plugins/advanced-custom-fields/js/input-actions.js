/*
*  Input Actions
*
*  @description: javascript for fields functionality		
*  @author: Elliot Condon
*  @since: 3.1.4
*/

var acf = {
	admin_url : '',
	post_id : 0,
	validation : false,
	text : {
		'validation_error' : "Validation Failed. One or more fields below are required.",
		'file_tb_title_add' : "Add File to Field",
		'file_tb_title_edit' : "Edit File",
		'image_tb_title_add' : "Add Image to Field",
		'image_tb_title_edit' : "Edit Image",
		'relationship_max_alert' : "Maximum values reached ( {max} values )",
		'gallery_tb_title_add' : "Add Image to Gallery",
		'gallery_tb_title_edit' : "Edit Image",
		'repeater_min_alert' : "Minimum rows reached ( {min} rows )",
		'repeater_max_alert' : "Maximum rows reached ( {max} rows )"
	},
	conditional_logic : {},
	sortable_helper : null
};

(function($){
	
		
	/*
	*  Exists
	*
	*  @description: returns true / false		
	*  @created: 1/03/2011
	*/
	
	$.fn.exists = function()
	{
		return $(this).length>0;
	};
	
	
	/*
	*  Document Ready
	*
	*  @description: adds ajax data
	*  @created: 1/03/2011
	*/
	
	$(document).ready(function(){
	
		// add classes
		$('#poststuff .postbox[id*="acf_"]').addClass('acf_postbox');
		$('#adv-settings label[for*="acf_"]').addClass('acf_hide_label');
		
		// hide acf stuff
		$('#poststuff .acf_postbox').addClass('acf-hidden');
		$('#adv-settings .acf_hide_label').hide();
		
		// loop through acf metaboxes
		$('#poststuff .postbox.acf_postbox').each(function(){
			
			// vars
			var options = $(this).find('> .inside > .options');
			var show = options.attr('data-show');
			var layout = options.attr('data-layout');
			var id = $(this).attr('id').replace('acf_', '');
			
			// layout
			$(this).addClass(layout);
			
			// show / hide
			if(show == 'true')
			{
				$(this).removeClass('acf-hidden');
				$('#adv-settings .acf_hide_label[for="acf_' + id + '-hide"]').show();
			}
			
		});
	
	});
	
	
	/*
	*  Save Draft
	*
	*  @description: 
	*  @created: 18/09/12
	*/
	var save_post = false;
	$('#save-post').live('click', function(){
		
		save_post = true;
		
	});
	
	
	/*
	*  Submit form
	*
	*  @description: does validation, deletes all hidden metaboxes (otherwise, post data will be overriden by hidden inputs)
	*  @created: 1/03/2011
	*/
	
	$('form#post').live("submit", function(){
		
		if( !save_post )
		{
			// do validation
			do_validation();
			
			
			if(acf.validation == false)
			{
				// show message
				$(this).siblings('#message').remove();
				$(this).before('<div id="message" class="error"><p>' + acf.text.validation_error + '</p></div>');
				
				
				// hide ajax stuff on submit button
				$('#publish').removeClass('button-primary-disabled');
				$('#ajax-loading').attr('style','');
				
				return false;
			}
		}


		$('.acf_postbox:hidden').remove();
		
		
		// submit the form
		return true;
		
	});
	
	
	/*
	*  do_validation
	*
	*  @description: checks fields for required input
	*  @created: 1/03/2011
	*/
	
	function do_validation(){
		
		acf.validation = true;
		
		$('.field.required:visible, .form-field.required').each(function(){
			
			var validation = true;

			// text / textarea
			if($(this).find('input[type="text"], input[type="number"], input[type="hidden"], textarea').val() == "")
			{
				validation = false;
			}
			
			
			// select
			if($(this).find('select').exists())
			{
				validation = true;
				if($(this).find('select').val() == "null" || !$(this).find('select').val())
				{
					validation = false;
				}
			}

			
			// checkbox
			if($(this).find('input[type="checkbox"]:checked').exists())
			{
				validation = true;
			}
			
			// relationship
			if($(this).find('.acf_relationship').exists())
			{
				if($(this).find('.acf_relationship .relationship_right input').exists())
				{
					validation = true;
				}
				else
				{
					validation = false;
				}
				
			}
			
			// repeater
			if($(this).find('.repeater').exists())
			{

				if($(this).find('.repeater tr.row').exists())
				{
					validation = true;
				}
				else
				{
					validation = false;
				}
				
			}
			
			// flexible content
			if($(this).find('.acf_flexible_content').exists())
			{
				if($(this).find('.acf_flexible_content .values table').exists())
				{
					validation = true;
				}
				else
				{
					validation = false;
				}
				
			}
			
			// gallery
			if($(this).find('.acf-gallery').exists())
			{
				if($(this).find('.acf-gallery .thumbnail').exists())
				{
					validation = true;
				}
				else
				{
					validation = false;
				}
				
			}
			
			// set validation
			if(!validation)
			{
				acf.validation = false;
				$(this).closest('.field').addClass('error');
			}
			
		});
		
		
	}
	
	
	/*
	*  Remove error class on focus
	*
	*  @description: 
	*  @created: 1/03/2011
	*/

	// inputs / textareas
	$('.field.required input, .field.required textarea, .field.required select').live('focus', function(){
		$(this).closest('.field').removeClass('error');
	});
	
	// checkbox
	$('.field.required input:checkbox').live('click', function(){
		$(this).closest('.field').removeClass('error');
	});
	
	// wysiwyg
	$('.field.required .acf_wysiwyg').live('mousedown', function(){
		$(this).closest('.field').removeClass('error');
	});
	
	
	/*
	*  Field: Color Picker
	*
	*  @description: 
	*  @created: 1/03/2011
	*/
			
	$(document).ready(function(){
	
		// validate
		if( ! $.farbtastic)
		{
			return;
		}
		
		$('body').append('<div id="acf_color_picker" />');
		
		acf.farbtastic = $.farbtastic('#acf_color_picker');
		
	});
	
	
	// update colors
	$(document).live('acf/setup_fields', function(e, postbox){
		
		$(postbox).find('input.acf_color_picker').each(function(){
			
			// vars
			var input = $(this);
			
			
			// validate
			if( ! $.farbtastic )
			{
				return;
			}
			
			
			// is clone field?
			if( acf.is_clone_field(input) )
			{
				//console.log('Clone Field: Color Picker');
				return;
			}
			

			if( input.val() )
			{
				$.farbtastic( input ).setColor( input.val() ).hsl[2] > 0.5 ? color = '#000' : color = '#fff';
				
				input.css({ 
					backgroundColor : input.val(),
					color : color
				});
			}
			
		});
		
	});
	
				
	$('input.acf_color_picker').live('focus', function(){
		
		var input = $(this);
		
		if( ! input.val() )
		{
			input.val( '#FFFFFF' );
		}
		
		$('#acf_color_picker').css({
			left: input.offset().left,
			top: input.offset().top - $('#acf_color_picker').height(),
			display: 'block'
		});
		
		acf.farbtastic.linkTo(this);
		
	}).live('blur', function(){
		
		var input = $(this);
		
		
		// reset the css
		if( ! input.val() )
		{
			input.css({ 
				backgroundColor : '#fff',
				color : '#000'
			});
			
		}
		
		
		$('#acf_color_picker').css({
			display: 'none'
		});
						
	});
	
	
	/*
	*  Field: File
	*
	*  @description: 
	*  @created: 1/03/2011
	*/
	
	// add file
	$('.acf-file-uploader .add-file').live('click', function(){
				
		// vars
		var div = $(this).closest('.acf-file-uploader');
		
		// set global var
		window.acf_div = div;
			
		// show the thickbox
		tb_show( acf.text.file_tb_title_add , acf.admin_url + 'media-upload.php?post_id=' + acf.post_id + '&type=file&acf_type=file&TB_iframe=1');
	
		return false;
	});
	
	// remove file
	$('.acf-file-uploader .remove-file').live('click', function(){
		
		// vars
		var div = $(this).closest('.acf-file-uploader');
		
		div.removeClass('active').find('input.value').val('').trigger('change');
		
		return false;
		
	});
	
	// edit file
	$('.acf-file-uploader .edit-file').live('click', function(){
		
		// vars
		var div = $(this).closest('.acf-file-uploader'),
			id = div.find('input.value').val();
		

		// set global var
		window.acf_edit_attachment = div;
				
		
		// show edit attachment
		tb_show( acf.text.file_tb_title_edit , acf.admin_url + 'media.php?attachment_id=' + id + '&action=edit&acf_action=edit_attachment&acf_field=file&TB_iframe=1');
		
		
		return false;
			
	});
	
	
	/*
	*  Field: Image
	*
	*  @description: 
	*  @created: 1/03/2011
	*/
	
	// add image
	$('.acf-image-uploader .add-image').live('click', function(){
				
		// vars
		var div = $(this).closest('.acf-image-uploader'),
			preview_size = div.attr('data-preview_size');
		
		// set global var
		window.acf_div = div;
			
		// show the thickbox
		tb_show( acf.text.image_tb_title_add , acf.admin_url + 'media-upload.php?post_id=' + acf.post_id + '&type=image&acf_type=image&acf_preview_size=' + preview_size + 'TB_iframe=1');
	
		return false;
	});
	
	// remove image
	$('.acf-image-uploader .remove-image').live('click', function(){
		
		// vars
		var div = $(this).closest('.acf-image-uploader');
		
		div.removeClass('active');
		div.find('input.value').val('').trigger('change');
		div.find('img').attr('src', '');
		
		return false;
			
	});
	
	// edit image
	$('.acf-image-uploader .edit-image').live('click', function(){
		
		// vars
		var div = $(this).closest('.acf-image-uploader'),
			id = div.find('input.value').val();
		

		// set global var
		window.acf_edit_attachment = div;
				
		
		// show edit attachment
		tb_show( acf.text.image_tb_title_edit , acf.admin_url + 'media.php?attachment_id=' + id + '&action=edit&acf_action=edit_attachment&acf_field=image&TB_iframe=1');
		
		
		return false;
			
	});
	
	
	/*--------------------------------------------------------------------------------------
	*
	*  Field: Relationship
	*
	*  @description: 
	*  @created: 3/03/2011
	* 
	*-------------------------------------------------------------------------------------*/
	
	// add sortable
	$(document).live('acf/setup_fields', function(e, postbox){
		
		$(postbox).find('.acf_relationship').each(function(){
			
			// is clone field?
			if( acf.is_clone_field($(this).children('input[type="hidden"]')) )
			{
				//console.log('Clone Field: Relationship');
				return;
			}
			
			
			$(this).find('.relationship_right .relationship_list').sortable({
				axis: "y", // limit the dragging to up/down only
				items: '> li',
				forceHelperSize: true,
				forcePlaceholderSize: true,
				scroll: true
			});
			
			
			// load more
			$(this).find('.relationship_left .relationship_list').scrollTop(0).scroll( function(){
				
				// vars
				var div = $(this).closest('.acf_relationship');
				
				
				// validate
				if( div.hasClass('loading') )
				{
					return;
				}
				
				
				// Scrolled to bottom
				if( $(this).scrollTop() + $(this).innerHeight() >= $(this).get(0).scrollHeight )
				{
					var paged = parseInt( div.attr('data-paged') );
					
					div.attr('data-paged', (paged + 1) );
					
					acf.relationship_update_results( div );
				}

			});
			
			
			// ajax fetch values for left side
			acf.relationship_update_results( $(this) );
			
		});
		
	});
	
	
	// add from left to right
	$('.acf_relationship .relationship_left .relationship_list a').live('click', function(){
		
		// vars
		var id = $(this).attr('data-post_id'),
			title = $(this).html(),
			div = $(this).closest('.acf_relationship'),
			max = parseInt(div.attr('data-max')),
			right = div.find('.relationship_right .relationship_list');
		
		
		// max posts
		if( right.find('a').length >= max )
		{
			alert( acf.text.relationship_max_alert.replace('{max}', max) );
			return false;
		}
		
		
		// can be added?
		if( $(this).parent().hasClass('hide') )
		{
			return false;
		}
		
		
		// hide / show
		$(this).parent().addClass('hide');
		
		
		// create new li for right side
		var new_li = div.children('.tmpl-li').html()
			.replace( /\{post_id}/gi, id )
			.replace( /\{title}/gi, title );
			


		// add new li
		right.append( new_li );
		
		
		// validation
		div.closest('.field').removeClass('error');
		
		return false;
		
	});
	
	
	// remove from right to left
	$('.acf_relationship .relationship_right .relationship_list a').live('click', function(){
		
		// vars
		var id = $(this).attr('data-post_id'),
			div = $(this).closest('.acf_relationship'),
			left = div.find('.relationship_left .relationship_list');
		
		
		// hide
		$(this).parent().remove();
		
		
		// show
		left.find('a[data-post_id="' + id + '"]').parent('li').removeClass('hide');
		
		
		return false;
		
	});
	
	
	// search
	$('.acf_relationship input.relationship_search').live('keyup', function()
	{	
		// vars
		var val = $(this).val(),
			div = $(this).closest('.acf_relationship');
			
		
		// update data-s
	    div.attr('data-s', val);
	    
	    
	    // new search, reset paged
	    div.attr('data-paged', 1);
	    
	    
	    // ajax
	    clearTimeout( acf.relationship_timeout );
	    acf.relationship_timeout = setTimeout(function(){
	    	acf.relationship_update_results( div );
	    }, 250);
	    
	    return false;
	    
	})
	.live('focus', function(){
		$(this).siblings('label').hide();
	})
	.live('blur', function(){
		if($(this).val() == "")
		{
			$(this).siblings('label').show();
		}
	});
	
	
	// hide results
	acf.relationship_hide_results = function( div ){
		
		// vars
		var left = div.find('.relationship_left .relationship_list'),
			right = div.find('.relationship_right .relationship_list');
			
			
		// apply .hide to left li's
		left.find('a').each(function(){
			
			var id = $(this).attr('data-post_id');
			
			if( right.find('a[data-post_id="' + id + '"]').exists() )
			{
				$(this).parent().addClass('hide');
			}
			
		});
		
	}
	
	
	// update results
	acf.relationship_update_results = function( div ){
		
		
		// add loading class, stops scroll loading
		div.addClass('loading');
		
		
		// vars
		var s = div.attr('data-s'),
			paged = parseInt( div.attr('data-paged') ),
			taxonomy = div.attr('data-taxonomy'),
			post_type = div.attr('data-post_type'),
			lang = div.attr('data-lang'),
			left = div.find('.relationship_left .relationship_list'),
			right = div.find('.relationship_right .relationship_list');
		
		
		// get results
	    $.ajax({
			url: ajaxurl,
			type: 'post',
			dataType: 'html',
			data: { 
				'action' : 'acf_get_relationship_results', 
				's' : s,
				'paged' : paged,
				'taxonomy' : taxonomy,
				'post_type' : post_type,
				'lang' : lang
			},
			success: function( html ){
				
				div.removeClass('no-results').removeClass('loading');
				
				// new search?
				if( paged == 1 )
				{
					left.find('li:not(.load-more)').remove();
				}
				
				
				// no results?
				if( !html )
				{
					div.addClass('no-results');
					return;
				}
				
				
				// append new results
				left.find('.load-more').before( html );
				
				
				// less than 10 results?
				var ul = $('<ul>' + html + '</ul>');
				if( ul.find('li').length < 10 )
				{
					div.addClass('no-results');
				}
				
				
				// hide values
				acf.relationship_hide_results( div );
				
			}
		});
	};
	
	
	/*
	*  Field: WYSIWYG
	*
	*  @description: 
	*  @created: 3/03/2011
	*/
	
	// store wysiwyg buttons
	var acf_wysiwyg_buttons = {};
	
	
	// destroy wysiwyg
	$.fn.acf_deactivate_wysiwyg = function(){
		
		$(this).find('.acf_wysiwyg textarea').each(function(){
			wpActiveEditor = null;
			tinyMCE.execCommand("mceRemoveControl", false, $(this).attr('id'));
		});
		
	};
	
	
	// create wysiwyg
	$.fn.acf_activate_wysiwyg = function(){
		
		
		
		// add tinymce to all wysiwyg fields
		$(this).find('.acf_wysiwyg textarea').each(function(){
			
			
			// is clone field?
			if( acf.is_clone_field($(this)) )
			{
				//console.log('Clone Field: WYSIWYG');
				return;
			}
			
			
			// validate tinymce
			if( tinyMCE == undefined || tinyMCE.settings == undefined )
			{
				return;
			}
			
			
			// reset buttons
			tinyMCE.settings.theme_advanced_buttons1 = acf_wysiwyg_buttons.theme_advanced_buttons1;
			tinyMCE.settings.theme_advanced_buttons2 = acf_wysiwyg_buttons.theme_advanced_buttons2;
		
			var toolbar = $(this).closest('.acf_wysiwyg').attr('data-toolbar');
			
			if(toolbar == 'basic')
			{
				tinyMCE.settings.theme_advanced_buttons1 = "bold, italic, underline, blockquote, |, strikethrough, bullist, numlist, justifyleft, justifycenter, justifyright, undo, redo, link, unlink, fullscreen";
				tinyMCE.settings.theme_advanced_buttons2 = "";
			}
			else
			{
				// add images + code buttons
				tinyMCE.settings.theme_advanced_buttons2 += ",code";
			}

			
			// activate editor
			wpActiveEditor = null;
			tinyMCE.execCommand('mceAddControl', false, $(this).attr('id'));

		});
		
	};
	
	
	// create wysiwygs
	$(document).live('acf/setup_fields', function(e, postbox){
		
		if( typeof(tinyMCE) != "object" )
		{
			return false;
		}
		
		$(postbox).acf_activate_wysiwyg();

	});
	
	$(document).ready( function(){
		
		if( typeof(tinyMCE) != "object" )
		{
			return false;
		}
		
		// store variables
		if( tinyMCE.settings != undefined )
		{
			acf_wysiwyg_buttons.theme_advanced_buttons1 = tinyMCE.settings.theme_advanced_buttons1;
			acf_wysiwyg_buttons.theme_advanced_buttons2 = tinyMCE.settings.theme_advanced_buttons2;
		}
		
		$(document).trigger('acf/setup_fields', $('#poststuff'));
		
	});
	
	$(window).load(function(){
		
		setTimeout(function(){
			$('#acf_settings-tmce').trigger('click');
		}, 1);
		
		setTimeout(function(){
			$(document).trigger('acf/setup_fields', $('#poststuff'));
		}, 10);
		
	});
	
	
	/*
	*  Sortable Helper
	*
	*  @description: keeps widths of td's inside a tr
	*  @since 3.5.1
	*  @created: 10/11/12
	*/
	
	acf.sortable_helper = function(e, ui)
	{
		ui.children().each(function(){
			$(this).width($(this).width());
		});
		return ui;
	};


	/*
	*  acf/sortable_start
	*
	*  @description:
	*  @since 3.5.1
	*  @created: 10/11/12
	*/
	
	$(document).live('acf/sortable_start', function(e, div) {
		
		//console.log( 'sortstart' );
		
		$(div).find('.acf_wysiwyg textarea').each(function(){
			
			// vars
			var textarea = $(this),
				id = textarea.attr('id'),
				wysiwyg = tinymce.get( id );
			
			
			// if wysiwyg was found (should be always...), remove its functionality and set the value (to keep line breaks)
			if( wysiwyg )
			{
				var val = wysiwyg.getContent();
				
				tinyMCE.execCommand("mceRemoveControl", false, id);
			
				textarea.val( val );
			}
			
		});

		
	});
	
	
	/*
	*  acf/sortable_stop
	*
	*  @description:
	*  @since 3.5.1
	*  @created: 10/11/12
	*/
	
	$(document).live('acf/sortable_stop', function(e, div) {
		
		//console.log( 'sortstop' );
		
		$(div).find('.acf_wysiwyg textarea').each(function(){
			
			// vars
			var textarea = $(this),
				id = textarea.attr('id');
			
			// add functionality back in
			tinyMCE.execCommand("mceAddControl", false, id);
		});
		
	});
	
	
	/*
	*  Field: Repeater
	*
	*  @description: 
	*  @created: 3/03/2011
	*/
	
	// create a unique id
	function uniqid()
    {
    	var newDate = new Date;
    	return newDate.getTime();
    }
    
	
	// update order
	function repeater_update_order( repeater )
	{
		repeater.find('> table > tbody > tr.row').each(function(i){
			$(this).children('td.order').html( i+1 );
		});
	
	};
	
	
	// setup repeater fields
	$(document).live('acf/setup_fields', function(e, postbox){
		
		$(postbox).find('.repeater').each(function(){
			
			var repeater = $(this)
			
			
			// set column widths
			repeater_set_column_widths( repeater );
			
			
			// update classes based on row count
			repeater_update_classes( repeater );
			
			
			// add sortable
			repeater_add_sortable( repeater );
						
		});
			
	});
	
	
	/*
	*  repeater_set_column_widths
	*
	*  @description: 
	*  @since 3.5.1
	*  @created: 11/11/12
	*/
	
	function repeater_set_column_widths( repeater )
	{
		// validate
		if( repeater.children('.acf-input-table').hasClass('row_layout') )
		{
			return;
		}
		

		// accomodate for order / remove
		var column_width = 100;
		if( repeater.find('> .acf-input-table > thead > tr > th.order').exists() )
		{
			column_width = 93;
		}
		
		
		// find columns that already have a width and remove these amounts from the column_width var
		repeater.find('> .acf-input-table  > thead > tr > th[width]').each(function( i ){
			
			column_width -= parseInt( $(this).attr('width') );
		});

		
		var ths = repeater.find('> .acf-input-table > thead > tr > th').not('[width]').has('span');
		if( ths.length > 1 )
		{
			column_width = column_width / ths.length;
			
			ths.each(function( i ){
				
				// dont add width to last th
				if( (i+1) == ths.length  )
				{
					return;
				}
				
				$(this).attr('width', column_width + '%');
				
			});
		}
				
	}
	
	
	/*
	*  repeater_update_classes
	*
	*  @description: 
	*  @since 3.5.2
	*  @created: 11/11/12
	*/
	
	function repeater_update_classes( repeater )
	{
		// vars
		var max_rows = parseFloat( repeater.attr('data-max_rows') ),
			row_count = repeater.find('> table > tbody > tr.row').length;	

		
		// empty?
		if( row_count == 0 )
		{
			repeater.addClass('empty');
		}
		else
		{
			repeater.removeClass('empty');
		}
		
		
		// row limit reached
		if( row_count >= max_rows )
		{
			repeater.addClass('disabled');
		}
		else
		{
			repeater.removeClass('disabled');
		}
	}
	
	
	/*
	*  repeater_add_sortable
	*
	*  @description: 
	*  @since 3.5.2
	*  @created: 11/11/12
	*/
	
	function repeater_add_sortable( repeater ){
		
		// vars
		var max_rows = parseFloat( repeater.attr('data-max_rows') );
		
		
		// validate
		if( max_rows <= 1 )
		{
			return;
		}
			
		repeater.find('> table > tbody').unbind('sortable').sortable({
			items : '> tr.row',
			handle : '> td.order',
			helper : acf.sortable_helper,
			forceHelperSize : true,
			forcePlaceholderSize : true,
			scroll : true,
			start : function (event, ui) {
			
				$(document).trigger('acf/sortable_start', ui.item);
				$(document).trigger('acf/sortable_start_repeater', ui.item);

				// add markup to the placeholder
				var td_count = ui.item.children('td').length;
        		ui.placeholder.html('<td colspan="' + td_count + '"></td>');
        		
   			},
   			stop : function (event, ui) {
			
				$(document).trigger('acf/sortable_stop', ui.item);
				$(document).trigger('acf/sortable_stop_repeater', ui.item);
				
				// update order numbers	
				repeater_update_order( repeater );		
				
   			}
		});
	};
	
	
	// add field
	function repeater_add_field( repeater, before )
	{
		// vars
		var max_rows = parseInt( repeater.attr('data-max_rows') ),
			row_count = repeater.find('> table > tbody > tr.row').length;	
			
			
		// validate
		if( row_count >= max_rows )
		{
			alert( acf.text.repeater_max_alert.replace('{max}', max_rows) );
			return false;
		}
		
	
		// create and add the new field
		var new_id = uniqid(),
			new_field_html = repeater.find('> table > tbody > tr.row-clone').html().replace(/(=["]*[\w-\[\]]*?)(\[999\])/g, '$1[' + new_id + ']'),
			new_field = $('<tr class="row"></tr>').append( new_field_html );
		
		
		// add row
		if( !before )
		{
			before = repeater.find('> table > tbody > .row-clone');
		}
		
		before.before( new_field );
		
		
		// trigger mouseenter on parent repeater to work out css margin on add-row button
		repeater.closest('tr').trigger('mouseenter');
		
		
		// update order
		repeater_update_order( repeater );
		
		
		// update classes based on row count
		repeater_update_classes( repeater );
		
		
		// setup fields
		$(document).trigger('acf/setup_fields', new_field);

		
		// validation
		repeater.closest('.field').removeClass('error');
	}
	
	
	// add row - end
	$('.repeater .repeater-footer .add-row-end').live('click', function(){
		
		var repeater = $(this).closest('.repeater');
		
		
		repeater_add_field( repeater, false );
		
		
		return false;
	});
	
	
	// add row - before
	$('.repeater .add-row-before').live('click', function(){
		
		var repeater = $(this).closest('.repeater'),
			before = $(this).closest('tr');
			
			
		repeater_add_field( repeater, before );
		
		
		return false;
	});
	
	
	function repeater_remove_row( tr )
	{	
		// vars
		var repeater =  tr.closest('.repeater'),
			min_rows = parseInt( repeater.attr('data-min_rows') ),
			row_count = repeater.find('> table > tbody > tr.row').length,
			column_count = tr.children('tr.row').length,
			row_height = tr.height();
			
			
		// validate
		if( row_count <= min_rows )
		{
			alert( acf.text.repeater_min_alert.replace('{min}', row_count) );
			return false;
		}
		
		
		// animate out tr
		tr.addClass('acf-remove-item');
		setTimeout(function(){
			
			tr.remove();
			
			
			// trigger mouseenter on parent repeater to work out css margin on add-row button
			repeater.closest('tr').trigger('mouseenter');
		
		
			// update order
			repeater_update_order( repeater );
			
			
			// update classes based on row count
			repeater_update_classes( repeater );
			
		}, 400);
		
	}
	
	
	// remove field
	$('.repeater .remove-row').live('click', function(){
		var tr = $(this).closest('tr');
		repeater_remove_row( tr );
		return false;
	});
	
	
	// hover over tr, align add-row button to top
	$('.repeater tr').live('mouseenter', function(){
		
		var button = $(this).find('> td.remove > a.add-row');
		var margin = ( button.parent().height() / 2 ) + 9; // 9 = padding + border
		
		button.css('margin-top', '-' + margin + 'px' );
		
	});
	
	
	
	/*-----------------------------------------------------------------------------
	*
	*	Flexible Content
	*
	*----------------------------------------------------------------------------*/
	
	
	/*
	*  flexible_content_add_sortable
	*
	*  @description: 
	*  @created: 25/05/12
	*/
	
	function flexible_content_add_sortable( div )
	{
		
		// remove (if clone) and add sortable
		div.children('.values').unbind('sortable').sortable({
			items : '> .layout',
			handle : '> .menu-item-handle',
			forceHelperSize : true,
			forcePlaceholderSize : true,
			scroll : true,
			start : function (event, ui) {
			
				$(document).trigger('acf/sortable_start', ui.item);
				$(document).trigger('acf/sortable_start_flexible_content', ui.item);
        		
   			},
   			stop : function (event, ui) {
			
				$(document).trigger('acf/sortable_stop', ui.item);
				$(document).trigger('acf/sortable_stop_flexible_content', ui.item);
				
				// update order numbers				
				flexible_content_update_order( div );
   			}
		});
		
	};
	
	
	/*
	*  Show Popup
	*
	*  @description: 
	*  @created: 25/05/12
	*/
	
	$('.acf_flexible_content .flexible-footer .add-row-end').live('click', function()
	{
		$(this).trigger('focus');
		
	}).live('focus', function()
	{
		$(this).siblings('.acf-popup').addClass('active');
		
	}).live('blur', function()
	{
		var button = $(this);
		setTimeout(function(){
			button.siblings('.acf-popup').removeClass('active');
		}, 250);
		
	});
	
	
	/*
	*  flexible_content_remove_row
	*
	*  @description: 
	*  @created: 25/05/12
	*/
	
	function flexible_content_remove_layout( layout )
	{
		// vars
		var div = layout.closest('.acf_flexible_content');
		var temp = $('<div style="height:' + layout.height() + 'px"></div>');
		
		
		// animate out tr
		layout.addClass('acf-remove-item');
		setTimeout(function(){
			
			layout.before(temp).remove();
			
			temp.animate({'height' : 0 }, 250, function(){
				temp.remove();
			});
		
			if(!div.children('.values').children('.layout').exists())
			{
				div.children('.no_value_message').show();
			}
			
		}, 400);
		
	}
	
	
	$('.acf_flexible_content .fc-delete-layout').live('click', function(){
		var layout = $(this).closest('.layout');
		flexible_content_remove_layout( layout );
		return false;
	});
		
	
	
	// update order
	function flexible_content_update_order( div )
	{
		div.find('> .values .layout').each(function(i){
			$(this).find('> .menu-item-handle .fc-layout-order').html(i+1);
		});
	
	};
	
	
	// add layout
	$('.acf_flexible_content .acf-popup ul li a').live('click', function(){

		// vars
		var layout = $(this).attr('data-layout');
		var div = $(this).closest('.acf_flexible_content');
		
		
		// create new field
		var new_id = uniqid(),
			new_field_html = div.find('> .clones > .layout[data-layout="' + layout + '"]').html().replace(/(=["]*[\w-\[\]]*?)(\[999\])/g, '$1[' + new_id + ']'),
			new_field = $('<div class="layout" data-layout="' + layout + '"></div>').append( new_field_html );
			
			
		// hide no values message
		div.children('.no_value_message').hide();
		
		
		// add row
		div.children('.values').append(new_field); 
		
		
		// activate wysiwyg
		$(document).trigger('acf/setup_fields',new_field);
		
		
		// update order numbers
		flexible_content_update_order( div );
		
		
		// validation
		div.closest('.field').removeClass('error');
		
		return false;
		
	});
	
	
	$(document).live('acf/setup_fields', function(e, postbox){
		
		$(postbox).find('.acf_flexible_content').each(function(){
			
			var div =  $(this);

			// sortable
			flexible_content_add_sortable( div );
			
			
			// set column widths
			$(div).find('.layout').each(function(){
				repeater_set_column_widths( $(this) );
			});
			
			
		});
		
	});

	
	/*
	*  Hide Show Flexible Content
	*
	*  @description: 
	*  @since 3.5.2
	*  @created: 11/11/12
	*/
	
	$('.acf_flexible_content .layout .menu-item-handle').live('click', function(){
		
		// vars
		var layout = $(this).closest('.layout');
		
		
		if( layout.attr('data-toggle') == 'closed' )
		{
			layout.attr('data-toggle', 'open');
			layout.children('.acf-input-table').show();
		}
		else
		{
			layout.attr('data-toggle', 'closed');
			layout.children('.acf-input-table').hide();
		}
			
	});
	
	
	/*
	*  is_clone_field
	*
	*  @description: returns true|false for an input element
	*  @created: 19/08/12
	*/
	
	acf.is_clone_field = function( input )
	{
		if( input.attr('name') && input.attr('name').indexOf('[999]') != -1 )
		{
			return true;
		}
		
		return false;
	}
	
	
	/*
	*  Field: Datepicker
	*
	*  @description: 
	*  @created: 4/03/2011
	*/
	
	$(document).live('acf/setup_fields', function(e, postbox){
		
		$(postbox).find('input.acf_datepicker').each(function(){
			
			// vars
			var input = $(this),
				alt_field = input.siblings('.acf-hidden-datepicker');
				save_format = input.attr('data-save_format'),
				display_format = input.attr('data-display_format');
			
			
			// is clone field?
			if( acf.is_clone_field(alt_field) )
			{
				return;
			}
			
			
			// get and set value from alt field
			input.val( alt_field.val() );
			
			
			// add date picker and refocus
			input.addClass('active').datepicker({ 
				dateFormat : save_format,
				altField : alt_field,
				altFormat :  save_format,
				changeYear: true,
				yearRange: "-100:+100",
				changeMonth: true,
				showButtonPanel : true
			});
			
			
			// now change the format back to how it should be.
			input.datepicker( "option", "dateFormat", display_format );
			
			
			// wrap the datepicker (only if it hasn't already been wrapped)
			if($('body > #ui-datepicker-div').length > 0)
			{
				$('#ui-datepicker-div').wrap('<div class="ui-acf" />');
			}
			
			
			// allow null
			input.blur(function(){
				
				if( !input.val() )
				{
					alt_field.val('');
				}
				
			});
			
		});
		
	});
	
	
	/*
	*  acf.add_message
	*
	*  @description: 
	*  @since: 3.2.7
	*  @created: 10/07/2012
	*/
	
	acf.add_message = function( message, div ){
		
		var message = $('<div class="acf-message-wrapper"><div class="message updated"><p>' + message + '</p></div></div>');
		
		div.prepend( message );
		
		setTimeout(function(){
			
			message.animate({
				opacity : 0
			}, 250, function(){
				message.remove();
			});
			
		}, 1500);
			
	};
	
	
	/*
	*  Field: Gallery
	*
	*  @description: 
	*  @since: 3.2.7
	*  @created: 10/07/2012
	*/
	
	acf.update_gallery_count = function( div )
	{
		// vars
		var count = div.find('.thumbnails .thumbnail').length,
			max_count = ( count > 2 ) ? 2 : count,
			span = div.find('.toolbar .count');
		
		
		span.html( span.attr('data-' + max_count).replace('{count}', count) );
		
	}
	
	
	// view: Grid
	$('.acf-gallery .toolbar .view-grid').live('click', function(){
		
		// vars
		var gallery = $(this).closest('.acf-gallery');
		
		
		// active class
		$(this).parent().addClass('active').siblings('.view-list-li').removeClass('active');
		
		
		// gallery class
		gallery.removeClass('view-list');
		
		
		return false;
			
	});
	
	
	// view: Grid
	$('.acf-gallery .toolbar .view-list').live('click', function(){
		
		// vars
		var gallery = $(this).closest('.acf-gallery');
		
		
		// active class
		$(this).parent().addClass('active').siblings('.view-grid-li').removeClass('active');
		
		
		// gallery class
		gallery.addClass('view-list');
		
		
		return false;
			
	});
	
	
	// remove image
	$('.acf-gallery .thumbnail .remove-image').live('click', function(){
		
		// vars
		var thumbnail = $(this).closest('.thumbnail'),
			gallery = thumbnail.closest('.acf-gallery');
		
		
		thumbnail.animate({
			opacity : 0
		}, 250, function(){
			
			thumbnail.remove();
			
			acf.update_gallery_count( gallery );
			
		});
		
		return false;
			
	});
	
	
	// remove image
	$('.acf-gallery .thumbnail .edit-image').live('click', function(){
		
		// vars
		var div = $(this).closest('.thumbnail'),
			id = div.attr('data-id');
		
		
		// set global var
		window.acf_edit_attachment = div;
				
		
		// show edit attachment
		tb_show( acf.text.gallery_tb_title_edit , acf.admin_url + 'media.php?attachment_id=' + id + '&action=edit&acf_action=edit_attachment&acf_field=gallery&TB_iframe=1');
		
		
		return false;
			
	});
	
	
	// add image
	$('.acf-gallery .toolbar .add-image').live('click', function(){
		
		// vars
		var gallery = $(this).closest('.acf-gallery'),
			preview_size = gallery.attr('data-preview_size');
		
		
		// set global var
		window.acf_div = gallery;
			
			
		// show the thickbox
		tb_show( acf.text.gallery_tb_title_add , acf.admin_url + 'media-upload.php?post_id=' + acf.post_id + '&type=image&acf_type=gallery&acf_preview_size=' + preview_size + 'TB_iframe=1');
			
			
		return false;
			
	});
	
	
	$(document).live('acf/setup_fields', function(e, postbox){
		
		$(postbox).find('.acf-gallery').each(function(i){
			
			// is clone field?
			if( acf.is_clone_field($(this).children('input[type="hidden"]')) )
			{
				return;
			}
			
			
			// vars
			var div = $(this),
				thumbnails = div.find('.thumbnails');
				
			
			// update count
			acf.update_gallery_count( div );

			
			// sortable
			thumbnails.find('> .inner').sortable({
				items : '> .thumbnail',
				/* handle: '> td.order', */
				forceHelperSize: true,
				forcePlaceholderSize: true,
				scroll: true,
				start: function (event, ui) {
				
					// alter width / height to allow for 2px border
					ui.placeholder.width( ui.placeholder.width() - 4 );
					ui.placeholder.height( ui.placeholder.height() - 4 );
	   			}
			});

			
		});
	
	});
	
	
	/*
	*  Conditional Logic Calculate
	*
	*  @description: 
	*  @since 3.5.1
	*  @created: 15/10/12
	*/
	
	acf.conditional_logic.calculate = function( options )
	{
		// vars
		var field = $('.field-' + options.field),
			toggle = $('.field-' + options.toggle),
			r = false;
		
		
		// compare values
		if( toggle.hasClass('field-true_false') || toggle.hasClass('field-checkbox') || toggle.hasClass('field-radio') )
		{
			if( options.operator == "==" )
			{
				if( toggle.find('input[value="' + options.value + '"]:checked').exists() )
				{
					r = true;
				}
			}
			else
			{
				if( !toggle.find('input[value="' + options.value + '"]:checked').exists() )
				{
					r = true;
				}
			}
			
		}
		else
		{
			if( options.operator == "==" )
			{
				if( toggle.find('*[name]').val() == options.value )
				{
					r = true;
				}
			}
			else
			{
				if( toggle.find('*[name]').val() != options.value )
				{
					r = true;
				}
			}
			
		}
		
		return r;
	}
	
	
})(jQuery);