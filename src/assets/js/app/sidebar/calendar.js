
/* --------------------------------------------------------
Calendar
-----------------------------------------------------------*/
(function(){

    //Sidebar
    if ($('#sidebar-calendar')[0]) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        $('#sidebar-calendar').fullCalendar({
            editable: false,
            events: [],
            header: {
                left: 'title'
            }
        });
    }

    //Content widget
    if ($('#calendar-widget')[0]) {
        $('#calendar-widget').fullCalendar({
            header: {
                left: 'title',
                right: 'prev, next',
                //right: 'month,basicWeek,basicDay'
            },
            editable: true,
            events: [
                {
                    title: 'All Day Event',
                    start: new Date(y, m, 1)
                },
                {
                    title: 'Long Event',
                    start: new Date(y, m, d-5),
                    end: new Date(y, m, d-2)
                },
                {
                    title: 'Repeat Event',
                    start: new Date(y, m, 3),
                    allDay: false
                },
                {
                    title: 'Repeat Event',
                    start: new Date(y, m, 4),
                    allDay: false
                }
            ]
        });
    }

})();