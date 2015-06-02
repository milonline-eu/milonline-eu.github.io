/**
 * @file insert Hard Space for CKEditor
 * Copyright (C) 2015 Milon Krejca
 * Use Ctrl+Space or menu icon to insert hard space in CKEditor
 *
 */

CKEDITOR.plugins.add( 'nbsp2', {
    requires: 'widget',
    icons: 'nbsp2',
    onLoad: function() {
        // Register styles for placeholder widget frame.
        CKEDITOR.addCss( '.cke-nbsp2 {background-color: #999}' );
    },
    init: function( editor ) {
        // Insert &nbsp; if Ctrl+Space is pressed:
        editor.addCommand( 'insertNbsp2', {
            exec: function( editor ) {
                editor.execCommand( 'nbsp2' );
            }
        });
        editor.setKeystroke( CKEDITOR.CTRL + 32 /* space */, 'insertNbsp' );
        editor.widgets.add( 'nbsp2', {
            button: 'Insert hard space',
            template: '<span class="cke-nbsp2">&nbsp;</span>',
            allowedContent: 'span(cke-nbsp2);',
            requiredContent: 'span(cke-nbsp2)',
            upcast: function( element ) {
                return element.name == 'span' && element.hasClass( 'cke-nbsp2' );
            },
            downcast: function() {
                return new CKEDITOR.htmlParser.text( '&nbsp;' );
            },
        });
    },

    afterInit: function( editor ) {
        var placeholderReplaceRegex = /\&nbsp\;/g;

        editor.dataProcessor.dataFilter.addRules( {
            text: function( text, node ) {
                var dtd = node.parent && CKEDITOR.dtd[ node.parent.name ];

                // Skip the case when placeholder is in elements like <title> or <textarea>
                // but upcast placeholder in custom elements (no DTD).
                if ( dtd && !dtd.span )
                    return;

                return text.replace( placeholderReplaceRegex, function( match ) {
                    // Creating widget code.
                    var widgetWrapper = null,
                        innerElement = new CKEDITOR.htmlParser.element( 'span', {
                            'class': 'cke-nbsp2'
                        } );

                    // Adds placeholder identifier as innertext.
                    innerElement.add( new CKEDITOR.htmlParser.text( '&nbsp;' ) );
                    widgetWrapper = editor.widgets.wrapElement( innerElement, 'nbsp2' );

                    // Return outerhtml of widget wrapper so it will be placed
                    // as replacement.
                    return widgetWrapper.getOuterHtml();
                } );
            }
        } );
    }


} );
