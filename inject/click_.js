var rnd = function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
};
var button = window.localStorage.getItem('button-selector');
(function(button) {
    if ($(button)) {
        $(button).trigger('mousedown');
        // TODO: it seems that any coordinates are ok for current anticheat script
        var ev = $.Event('tap', {x:rnd(1,100),y:rnd(1,100)});
        $(button).trigger(ev);
    } else {
        console.log('button selector ['+button+'] not found');
    }
})(button);