<?php
// $Id: brightcove_cck_handler_field_video_tags.inc,v 1.1.2.2 2010/05/25 17:39:25 meba Exp $

/**
 * @file
 * The subclass adds basic field and formatter info,
 * for field-specific subclasses to use if they need to.
 *
 * Fields could extend this class if they want field and formatter handling
 * but don't want the multiple value grouping options created by
 * content_handler_field_multiple.
 */
class brightcove_cck_handler_field_video_tags extends content_handler_field_multiple {
  var $content_field;

  function construct() {
    parent::construct();
    $this->content_field = content_fields($this->definition['content_field_name']);
  }

  function init(&$view, $options) {
    $field = $this->content_field;
    parent::init($view, $options);
    if ($field['multiple']) {
      $this->additional_fields['delta'] = 'delta';
    }
    // Make sure we grab enough information to build a pseudo-node with enough
    // credentials at render-time.
    $this->additional_fields['type'] = array('table' => 'node', 'field' => 'type');
    $this->additional_fields['nid'] = array('table' => 'node', 'field' => 'nid');
    $this->additional_fields['vid'] = array('table' => 'node', 'field' => 'vid');

    // This is a generic handler - we take the BC video object field from real_field. Example:
    // real_field: field_bc_video_video_id
    // field: field_bc_video_video_id_name
    // field - real_field = 'name' -> Display 'name' field.
    $this->bc_field = str_replace($this->real_field . '_', '', $this->field);

  }

    function admin_summary() {
      return '';
    }

  function options(&$options) {
    parent::options($options);
    $field = $this->content_field;

    // Override views_handler_field_node's default label
    $options['label'] = '';
    $options['separator'] = ',';
  }

  /**
   * Provide formatter option.
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    // TODO: do we want the 'link to node' checkbox ?
    // That's usually formatters business...

    $field = $this->content_field;
    $options = $this->options;
      
    unset($form['format']);
    unset($form['label_type']);
    $form['label'] = array( 
      '#type' => 'textfield', 
      '#title' => t('Label'), 
      '#default_value' => isset($this->options['label']) ? $this->options['label'] : '', 
      '#description' => t('The label for this field that will be displayed to end users if the style requires it.'),
    );
    $time = time();

    $form['separator'] = array(
        '#type' => 'textfield',
        '#description' => t('Lists tags separated by a character (or a string) specified here.'),
        '#title' => t('Tag separator'),
        '#default_value' => isset($this->options['separator']) ? $this->options['separator'] : 'small',
        );
  }

  function label() {
    return $this->options['label'];
  }

  function options_validate($form, &$form_state) { }

  function render($values) {
    $value = $values->{$this->field_alias};
    if (empty($value)) {
      return '';
    }
    $video = brightcove_video_load($value);
    if (!empty($video)) {
      if (isset($video->{$this->bc_field})) {
        $bc = _brightcove_initialize();
        $tags = $bc->tags($video->{$this->bc_field});
        return join($this->options['separator'] . ' ', array_map('check_plain', $tags));
      }
    }
    return theme('views_nodate');
  }

}
