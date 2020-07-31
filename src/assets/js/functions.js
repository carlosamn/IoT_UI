$(document).ready(function(){
    // Calendar Picker
    //  $('.datepicker').datepicker()
    /* --------------------------------------------------------
    Components
    -----------------------------------------------------------*/
    (function(){
        /* Textarea */
    if($('.auto-size')[0]) {
        $('.auto-size').autosize();
    }

        //Select
    if($('.select')[0]) {
        $('.select').selectpicker();
    }
        
        //Sortable
        if($('.sortable')[0]) {
        $('.sortable').sortable();
    }
    
        //Tag Select
    if($('.tag-select')[0]) {
        $('.tag-select').chosen();
    }
        
        /* Tab */
    if($('.tab')[0]) {
        $('.tab a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
        });
    }
        
        /* Collapse */
    if($('.collapse')[0]) {
        $('.collapse').collapse();
    }
        
        /* Accordion */
        $('.panel-collapse').on('shown.bs.collapse', function () {
            $(this).prev().find('.panel-title a').removeClass('active');
        });

        $('.panel-collapse').on('hidden.bs.collapse', function () {
            $(this).prev().find('.panel-title a').addClass('active');
        });

        //Popover
        if($('.pover')[0]) {
            $('.pover').popover();
        } 
    })();

    /* --------------------------------------------------------
    Sidebar + Menu
    -----------------------------------------------------------*/
    (function(){
        /* Menu Toggle */
        $('body').on('click', '#menu-toggle', function(e){
            e.preventDefault();
            $('html').toggleClass('menu-active');
            $('#sidebar').toggleClass('toggled');
            //$('#content').toggleClass('m-0');
        });
         
        /* Active Menu */
        $('#sidebar .menu-item').hover(function(){
            $(this).closest('.dropdown').addClass('hovered');
        }, function(){
            $(this).closest('.dropdown').removeClass('hovered');
        });

        /* Prevent */
        $('.side-menu .dropdown > a').click(function(e){
            e.preventDefault();
        });
    

    })();
    /* --------------------------------------------------------
    Todo List
    -----------------------------------------------------------*/
    (function(){
        setTimeout(function(){
            //Add line-through for alreadt checked items
            $('.todo-list .media .checked').each(function(){
                $(this).closest('.media').find('.checkbox label').css('text-decoration', 'line-through')
            });

            //Add line-through when checking
            $('.todo-list .media input').on('ifChecked', function(){
                $(this).closest('.media').find('.checkbox label').css('text-decoration', 'line-through');
            });

            $('.todo-list .media input').on('ifUnchecked', function(){
                $(this).closest('.media').find('.checkbox label').removeAttr('style');
            });    
        })
    })();

    /* --------------------------------------------------------
    Form Validation
    -----------------------------------------------------------*/
    (function(){
    if($("[class*='form-validation']")[0]) {
        $("[class*='form-validation']").validationEngine();

        //Clear Prompt
        $('body').on('click', '.validation-clear', function(e){
        e.preventDefault();
        $(this).closest('form').validationEngine('hide');
        });
    }
    })();

    /* --------------------------------------------------------
     Date Time Picker
     -----------------------------------------------------------*/
    (function(){
        //Date Only
    if($('.date-only')[0]) {
        $('.date-only').datetimepicker({
        pickTime: false
        });
    }

        //Time only
    if($('.time-only')[0]) {
        $('.time-only').datetimepicker({
        pickDate: false
        });
    }

        //12 Hour Time
    if($('.time-only-12')[0]) {
        $('.time-only-12').datetimepicker({
        pickDate: false,
        pick12HourFormat: true
        });
    }
        
        $('.datetime-pick input:text').on('click', function(){
            $(this).closest('.datetime-pick').find('.add-on i').click();
        });
    })();


    /* --------------------------------------------------------
     Media Player
     -----------------------------------------------------------*/
    (function(){
    if($('audio, video')[0]) {
        $('audio,video').mediaelementplayer({
        success: function(player, node) {
            $('#' + node.id + '-mode').html('mode: ' + player.pluginType);
        }
        });
    }
    })();

    /* ---------------------------
    Image Popup [Pirobox]
    --------------------------- */
    (function() {
    if($('.pirobox_gall')[0]) {
        //Fix IE
        jQuery.browser = {};
        (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
        })();
        
        //Lightbox
        $().piroBox_ext({
        piro_speed : 700,
        bg_alpha : 0.5,
        piro_scroll : true // pirobox always positioned at the center of the page
        });
    }
    })();

    /* ---------------------------
     Vertical tab
     --------------------------- */
    (function(){
        $('.tab-vertical').each(function(){
            var tabHeight = $(this).outerHeight();
            var tabContentHeight = $(this).closest('.tab-container').find('.tab-content').outerHeight();

            if ((tabContentHeight) > (tabHeight)) {
                $(this).height(tabContentHeight);
            }
        })

        $('body').on('click touchstart', '.tab-vertical li', function(){
            var tabVertical = $(this).closest('.tab-vertical');
            tabVertical.height('auto');

            var tabHeight = tabVertical.outerHeight();
            var tabContentHeight = $(this).closest('.tab-container').find('.tab-content').outerHeight();

            if ((tabContentHeight) > (tabHeight)) {
                tabVertical.height(tabContentHeight);
            }
        });


    })();
    
    /* --------------------------------------------------------
     Login + Sign up
    -----------------------------------------------------------*/
    (function(){
    $('body').on('click touchstart', '.box-switcher', function(e){
        e.preventDefault();
        var box = $(this).attr('data-switch');
        $(this).closest('.box').toggleClass('active');
        $('#'+box).closest('.box').addClass('active'); 
    });
    })();
    
    
    /* --------------------------------------------------------
        MAC Hack 
    -----------------------------------------------------------*/
    (function(){
    //Mac only
        if(navigator.userAgent.indexOf('Mac') > 0) {
            $('body').addClass('mac-os');
        }
    })();
    
});

$(window).on('load', function() {
    /* --------------------------------------------------------
     Tooltips
     -----------------------------------------------------------*/
    (function(){
        if($('.tooltips')[0]) {
            $('.tooltips').tooltip();
        }
    })();

    /* --------------------------------------------------------
     Animate numbers
     -----------------------------------------------------------*/
    $('.quick-stats').each(function(){
        var target = $(this).find('h2');
        var toAnimate = $(this).find('h2').attr('data-value');
        // Animate the element's value from x to y:
        $({someValue: 0}).animate({someValue: toAnimate}, {
            duration: 1000,
            easing:'swing', // can be anything
            step: function() { // called on every step
                // Update the element's text with rounded-up value:
                target.text(commaSeparateNumber(Math.round(this.someValue)));
            }
        });

        function commaSeparateNumber(val){
            while (/(\d+)(\d{3})/.test(val.toString())){
                val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            }
            return val;
        }
    });
    
});

/* --------------------------------------------------------
Date Time Widget
-----------------------------------------------------------*/
(function(){
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    // Create a newDate() object
    var newDate = new Date();

    // Extract the current date from Date object
    newDate.setDate(newDate.getDate());

    // Output the day, date, month and year
    $('#date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
})();