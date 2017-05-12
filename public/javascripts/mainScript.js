/**
 * Created by hamid on 12/1/16.
 */
$(function () {
    var inp = $('input');
    var regex = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$");
    //inp.keypress(fetchContent);
    inp.keypress(function (e) {
        if (e.which==13){
            fetchContent();
        }
    });
    $('#textareaelm').hide();
    var cp_element = '<div class="cp_element" id="cptitle" data-cp-elem-type="title" data-cp-elem-label="Title" data-is-cp-element="true" data-cp-elem-identifier="title">$title</div>';
    var cp_tracker = '<script id="cp-tracker" type="text/javascript" src="https://cdn.captora.com/js/track.js"></script>';
    var cp_modal = '<link id="colodin-modal-forms-styles" class="bootloader-component" rel="stylesheet" type="text/css" href="//colodin.s3.amazonaws.com/shared/dev/styles/modal-forms.css">';
    $('#submit').on('click' , fetchContent);
    $('#switchhtml').on('click' , switchHtmlView);
    $('#switchdesign').on('click' , switchDesignView);
    $('#titlebtn').on('click' , addTitle);
    $('#undo_title').on('click' , undoTitle);
    $('#trackbtn').on('click' , addTrack);
    $('#undo_track').on('click' , undoTrack);
    $('#modalbtn').on('click' , addModal);
    $('#undo_modal').on('click' , undoModal);
    $('#actionme').on('click' , actionme);


    var htmlContainer = '';
    var tags =[
        {tag: 'source', atr:'src'},
        {tag: 'a', atr:'href'},
        {tag: 'link', atr:'href'},
        {tag: 'script', atr:'src'},
         {tag: 'img', atr:'src'}

    ];
    // $('textarea').htmlarea();
    var h1  = '', head = '';
    function fetchContent() {
        setTimeout(function() {
            var dInput = inp.val();

            if(regex.test(dInput)){
                if (dInput.substr(0,3) === 'www') dInput = 'https://' + dInput;
                var request = $.ajax({
                    url: '/request',
                    method: "POST",
                    data: { url : dInput },
                    dataType: "html",
                    success: function(response){
                        //var content = JSON.parse(response).data;


                        // $('textarea').htmlarea('html', content);
                        // $('body').find('iframe').attr('id','htmlcontainer');


                         var iframe = document.getElementById('iframeelm');
                         iframe.setAttribute('srcdoc', response);

                         //     iframedoc = iframe.contentDocument || iframe.contentWindow.document;
                        // iframedoc.body.innerHTML = content;

                         document.getElementsByName('textareaelm')[0].value = response;


                        //makeAbsoluteLinks(response, dInput);

                        //$('iframe')[0].contentWindow.document);
                    },
                    error: function(response) {
                        console.log(response);
                    }
                });
            }
        }, 0);
    }
    function makeAbsoluteLinks(url){
        var hostName = '//'+ extractHostname(url);
        var newAtrr = '';
        //htmlContainer = window.frames['htmlcontainer'].contentDocument.getElementsByTagName('html');
        htmlContainer = $('iframe')[0].contentWindow.document;
        //console.log(htmlContainer) ;

        $.each(tags, function(key, item){
            var tagList = $(htmlContainer).find(item.tag);
            if (tagList.length!=0) {
                try{
                    var i = 0;
                    for (i; i<tagList.length; i++ )
                    $.each(tagList, function (idx, elem) {
                        var oldAttr = $(elem).attr(item.atr);
                        if (oldAttr.indexOf('//') == -1) {
                            if (oldAttr.substr(0,1) != '/') {
                                newAtrr = hostName + '/' + oldAttr;
                            } else {
                                newAtrr = hostName + oldAttr;
                            }
                            $(elem).attr(item.atr, newAtrr);
                        }
                    });

                } catch(err){
                    console.log(err);
                }
            }
        });





    }
    function actionme() {
        makeAbsoluteLinks( inp.val());
    }

    function extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get the hostname
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];

        return hostname;
    }

    function addTitle() {
        h1 = $(htmlContainer).find('h1');
        var style = $(h1).attr('style');
        if (style){
            cp_element = '<div style="'+ style +cp_element.substr(4);
        }
        $(h1).replaceWith(cp_element);

        /** Changing the title with $title*/
        var title = $(htmlContainer).find('title');
        $(title).text('$title');

        /** Finding social meta tags to change */
        chnageSocialMetaTag('property', 'og:title', 'content', '$title');
        chnageSocialMetaTag('name', 'twitter:title', 'content', '$title');

        chnageSocialMetaTag('property', 'og:description', 'content', '$description1');
        chnageSocialMetaTag('name', 'twitter:description', 'content', '$description1');

    }

    function undoTitle() {
        var cpTitle = $(htmlContainer).find('#cptitle');
        $(cpTitle).replaceWith(h1);
    }

    function addTrack() {
        head = $(htmlContainer).find('head');
        head.append(cp_tracker);
    }

    function undoTrack() {
        var track = $(htmlContainer).find('head');
        $(track).find('#cp-tracker').remove();
    }

    function addModal() {
        head = $(htmlContainer).find('head');
        $(head).append(cp_modal);
    }

    function undoModal() {
        var modal = $(htmlContainer).find('head');
        $(modal).find('#colodin-modal-forms-styles').remove();
    }

    /** Finding social meta tags to change */
    function chnageSocialMetaTag(lookFor, orgAttr, chngProp, newVal){
        var meta = $(htmlContainer).find('meta');
        $.each(meta, function (key, item) {
            if (($(item).attr(lookFor) || ' ').indexOf(orgAttr) != -1){
                $(item).attr(chngProp,newVal);
            }
        })
    }

    function switchHtmlView() {
        $('#iframeelm').hide();
        $('#textareaelm').show();

        // if ($('#iframeelm').css('display') == 'none'){
        //     $('#iframeelm').show();
        //     $('#textareaelm').hide();
        //     $(this).text('Html View');
        //     //$('[name="textareaelm"]').hide()
        // } else {
        //     $('#iframeelm').hide();
        //     $('#textareaelm').show();
        //     $(this).text('Design View');
        // }
    }
    function switchDesignView() {
        $('#iframeelm').show();
        $('#textareaelm').hide();
    }

});