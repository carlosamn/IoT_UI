interface Scripts {
    name: string;
    src: string;
}  
export const ScriptStore: Scripts[] = [
    { name: 'gmaps', src: 'http://maps.googleapis.com/maps/api/js?key=AIzaSyDkBIPFN4FvQuucdG1gXJJppdro2DnmvEU' },
    { name: 'calendar', src: '../assets/js/app/sidebar/calendar.js' },
    { name: 'select', src: '../assets/js/js_full_versions/select.js' }
];