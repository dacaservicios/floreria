$(document).ready(function() { 
    $('.datepickerCumple').datepicker({
        language: 'es',
        changeMonth: true,
        changeYear: true,
        todayHighlight: true
    }).on('changeDate', function(e){
        $(this).datepicker('hide');
    });

    $('.datepicker').datepicker({
        language: 'es',
        changeMonth: true,
        changeYear: true,
        todayHighlight: true
    }).on('changeDate', function(e){
        $(this).datepicker('hide');
    });
    
    $('.fecha1, .fecha2, .fecha3, .fecha4, .fecha5, .fecha6, .fecha7, .fecha8, .fecha9, .fecha10, .fecha11, .fecha12').datepicker({
        language: 'es',
        changeMonth: true,
        changeYear: true,
        todayHighlight: true
    }).on('changeDate', function(e){
        $(this).datepicker('hide');
    });
    
    $('.fecha1').datepicker({
        startDate: '+5d',
        endDate: '+35d',
    }).on('changeDate',
        function (selected) {
            $('.fecha2').datepicker('setStartDate', moment(selected.date).format('DD-MM-YYYY'));
        });
    
    $('.fecha2').datepicker({
        startDate: '+6d',
        endDate: '+36d',
    }).on('changeDate',
        function (selected) {
            $('.fecha1').datepicker('setEndDate', moment(selected.date).format('DD-MM-YYYY'));
        });
        
        $('.fecha3').datepicker({
            startDate: '+5d',
            endDate: '+35d',
        }).on('changeDate',
            function (selected) {
                $('.fecha4').datepicker('setStartDate', moment(selected.date).format('DD-MM-YYYY'));
         });
        
        $('.fecha4').datepicker({
            startDate: '+6d',
            endDate: '+36d',
        }).on('changeDate',
            function (selected) {
                $('.fecha3').datepicker('setEndDate', moment(selected.date).format('DD-MM-YYYY'));
        });

        $('.fecha5').datepicker({
            startDate: '+5d',
            endDate: '+35d',
        }).on('changeDate',
            function (selected) {
                $('.fecha6').datepicker('setStartDate', moment(selected.date).format('DD-MM-YYYY'));
         });
        
        $('.fecha6').datepicker({
            startDate: '+6d',
            endDate: '+36d',
        }).on('changeDate',
            function (selected) {
                $('.fecha5').datepicker('setEndDate', moment(selected.date).format('DD-MM-YYYY'));
        });

        $('.fecha7').datepicker({
            startDate: '+5d',
            endDate: '+35d',
        }).on('changeDate',
            function (selected) {
                $('.fecha8').datepicker('setStartDate', moment(selected.date).format('DD-MM-YYYY'));
            });
        
        $('.fecha8').datepicker({
            startDate: '+6d',
            endDate: '+36d',
        }).on('changeDate',
            function (selected) {
                $('.fecha7').datepicker('setEndDate', moment(selected.date).format('DD-MM-YYYY'));
            });
        $('.fecha9').datepicker({
            startDate: '+5d',
            endDate: '+35d',
        }).on('changeDate',
            function (selected) {
                $('.fecha10').datepicker('setStartDate', moment(selected.date).format('DD-MM-YYYY'));
            });
        
        $('.fecha10').datepicker({
            startDate: '+6d',
            endDate: '+36d',
        }).on('changeDate',
            function (selected) {
                $('.fecha9').datepicker('setEndDate', moment(selected.date).format('DD-MM-YYYY'));
            });

            $('.fecha11').datepicker({
                startDate: '+5d',
                endDate: '+35d',
            }).on('changeDate',
                function (selected) {
                    $('.fecha12').datepicker('setStartDate', moment(selected.date).format('DD-MM-YYYY'));
                });
            
            $('.fecha12').datepicker({
                startDate: '+6d',
                endDate: '+36d',
            }).on('changeDate',
                function (selected) {
                    $('.fecha11').datepicker('setEndDate', moment(selected.date).format('DD-MM-YYYY'));
                });

});



