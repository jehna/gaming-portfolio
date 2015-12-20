var RED = 218;
var GREEN = 195;
var BLUE = 180;

$(function() {
    $("#makesgames small").hide();
    
    var $w = $(window);
    var $d = $(document);
    var $b = $("body");
    $score = $("#score");
    var $scroll = $(".scroll");
    var SECTION_COUNT = $("section").length;
    
    // Returns percent loaded, relative to the count of the sections
    function Top() {
        return $w.scrollTop() / ($d.height() - $w.height()) * SECTION_COUNT;
    }
    
    Achievement("Started the game");
    var scrollPoints = 0;
    $w.bind("scroll", function(e) {
        var top = Top();
        
        Achievement("You know how to move!", 150);
        
        if(top > 0.1) {
            $score.fadeIn();
            $scroll.fadeOut();
        } else {
            $score.fadeOut();
            $scroll.fadeIn();
        }
        if(top > 1.2) Achievement("You know who I am", 300);
        if(top > 1.2) $("#makesgames small").fadeIn();
        if(top > 2.2) Achievement("You know what I do", 400);
        if(top == SECTION_COUNT) Achievement("Was that all?", 50);
        
        // Find a way to fix cookies
        /*if(top > scrollPoints) {
            ScoreAdd(Math.floor((top - scrollPoints) * 50));
            scrollPoints = top;
        }*/
        
        
        // $b.css({background: RelColor(RED,GREEN,BLUE,top)}); Not working for Chrome, get a workaround?
    });
    
    AnimScore(parseInt(GetCookie("score")), 1000);
    
    var submitted = false;
    $("#form").submit(function() {
        if($("#contact").val().length < 3 || firstfocus) return false;
        if(!submitted) {
            Achievement("I'll be in touch", 1500);
            setTimeout(function() {
                $("#form").submit();
            }, 1000);
            submitted = true;
            return false;
        }
        return true;
    });
    
    var firstfocus = true;
    $("#contact").addClass("unfocused").val("How can I contact you?").focus(function() { $(this).removeClass("unfocused"); if(firstfocus) { firstfocus = false; $(this).val("");}; }).keyup(function() {
        var val = $("#contact").val().toLowerCase();
        var label = "punch";
        
        if(/^[ \+0123456789]*$/.test(val) && val.length > 8) {
            Achievement("Getting cellular!", 1200);
            label = "call";
        } else if(/facebook.com\/[\.\/a-z0-9]*$/.test(val)) {
            Achievement("Face-to-Face!", 100);
            label = "poke";
        } else if(/^[\.a-z0-9]*@[\.a-z0-9]*$/.test(val)) {
            Achievement("Email's fair enough.", 100);
            label = "post";
        } else if(/twitter.com\/[\.\/a-z0-9]*$/.test(val)) {
            Achievement("Birdie power!", 100);
            label = "tweet";
        }
        
        $("#submit-form").text("Give me a " + label + "!")
        
    });
    
});

function RelColor(r,g,b,top) {
    var re = "#"+C(r,top)+C(g,top)+C(b,top);
    console.log(re);
    return re;
}
function C(value, top) {
    return (255 - Math.floor((255-value)*top)).toString(16);
}

var $score;
var score = parseInt(GetCookie("score"));
function ScoreAdd(value) {
    score += value;
    SetCookie("score", score, 100);
    AnimScore(score, value*10);
}

function AnimScore(value, time) {
    $score.animate({scoreText: value}, {
        duration: time,
        step: function() {
            this.innerHTML = "SCORE +" + Math.ceil(this.scoreText);
        }
    });
}
    
    
var achievements = [];
function Achievement(achievementName, addScore, cb) {
    if(typeof cb == "function") cb();
    if(achievements[achievementName] || GetCookie(achievementName)) return;
    
    if(addScore) ScoreAdd(addScore);
    
    SetCookie(achievementName, "true", 100);
    achievements[achievementName] = true;
    var msg = "<small>New achievement!</small> <br />" + achievementName;
    return $.achtung({message:msg, timeout: 3});
}

setTimeout(function() { Achievement("Nothing to do<br />(30sec on the page)", 420); }, 30000);
setTimeout(function() { Achievement("Addicted<br />(1min on the page)", 500); }, 60000);
setTimeout(function() { Achievement("Help me read!<br />(5min on the page)", 500); }, 300000);

function SetCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}

function GetCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
  return 0;
}

