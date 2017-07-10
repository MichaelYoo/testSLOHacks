let home = function($) {
    'use strict';       // Begin Strict Mode

    // require('../../vendor/gutabslider/gutabslider')($);

    $(document).ready(function() {

        // $("#tabs").gutabslider();
        // $("#tabs li a").click(function() {
        //     $("#tabs .active").removeClass("active");
        //     $(this).parent("li").addClass("active");
        //     $("#tabs").gutabslider("active-tab-changed");
        // });

        // Smooth Scroll for anchor links
        // Also fixes the page clipping bug when clicking anchor links
        $('nav li a').on('click', function(e){
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $( $.attr(this, 'href') ).offset().top
            }, 500);
        });


        $('#subscribe-form').submit(function(e) {
            e.preventDefault();
            $.ajax({
                type:   $(this).attr('method'),
                url:    $(this).attr('action'),
                data:   $(this).serialize(),
                beforeSend: function() {
                    $('#subscribe-form input').prop('disabled', true);
                },
                success: function(results) {
                    formResponse(results);
                }
            });
        });

        if (window.innerWidth <= 520) {
            $('nav ul').hide();
            $('.hamburger').click(function() {
                $(this).toggleClass('is-active');
                $('nav ul').fadeToggle(200)
            });
            $('nav a').click(function () {
                $('.hamburger').click()
            })
        }


        $(window).resize(function() {
           if (window.innerWidth <= 520) {
               $('nav ul').hide();
           }
           else {
                $('nav a').unbind();
               $('nav ul').show();
           }
        })

    });


    function formResponse(result) {
        $('#formResponse').remove();
        if (result.error == 0) {
            $('#subscribe-form input').prop('disabled', false).removeClass('error').addClass('success');
        }
        else {
            $('#subscribe-form input').prop('disabled', false).removeClass('success').addClass('error');
        }
        $('#subscribe-form').append(`<h4 id="formResponse">${result.message}</h4>`);
    }

};


export default home;