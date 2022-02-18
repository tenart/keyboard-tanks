$(function() {
    
    var listener = new window.keypress.Listener();
    
    var startup = new Howl({
        src: ['sound/startup.mp3'],
        autoplay: true,
        loop: false,
        volume: 0.1,
    });
    
    var engine1 = new Howl({
        src: ['sound/engine_idle.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.1,
    });
    
    var engine2 = new Howl({
        src: ['sound/engine_idle2.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.1,
    });
    
    var turret1 = new Howl({
        src: ['sound/motor.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.02,
    });
    
    var turret2 = new Howl({
        src: ['sound/motor.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.02,
    });
    
    var gunshot1 = new Howl({
        src: ['sound/gunshot.mp3'],
        autoplay: false,
        loop: false,
        volume: 0.5,
    });
    
    var whistle1 = new Howl({
        src: ['sound/whistle.mp3'],
        autoplay: false,
        loop: false,
        volume: 0.5,
    });
    
    var gunshot2 = new Howl({
        src: ['sound/gunshot.mp3'],
        autoplay: false,
        loop: false,
        volume: 0.5,
    });
    
    var whistle2 = new Howl({
        src: ['sound/whistle.mp3'],
        autoplay: false,
        loop: false,
        volume: 0.5,
    });

    var mute = false;
    
    var cursor = {
        x: 0,
        y: 0,
        down: false
    }
    
    var orbit = {
        x: 0,
        y: 0,
        xdir: "",
        ydir: "",
        hdeg: -20,
        vdeg: -10,
        hspeed: 0,
        vspeed: 0,
        sensitivity: 0.5,
        drag: 1,
        zoom: 400,
        mode: "move",
        midX: 1250,
        midY: 1250,
    }
    
    var movement = {
        x : -200,
        z : -200,
        direction: "",
        keyDown: false,
        speed: 10
    }
    
    var tank1 = {
        x : 1150,
        y : 1250,
        turretDir: 0,
        direction: 180,
        w: false,
        e: false,
        s: false,
        d: false,
        q: false,
        e: false,
        speed: 0,
        actualSpeed: 0,
        reloaded: false,
        recoil: 0
    }
    
    var tank2 = {
        x : 1350,
        y : 1250,
        turretDir: 0,
        direction: 180,
        w: false,
        e: false,
        s: false,
        d: false,
        q: false,
        e: false,
        speed: 0,
        actualSpeed: 0,
        reloaded: false,
        recoil: 0
    }
    
    var shell1 = {
        x: 0,
        y: 0,
        direction: 0,
        isFiring: false,
    }
    
    var tracer1 = {
        x: 0,
        y: 0,
        oriX: 0,
        oriY: 0,
        opacity: 0,
    }
    
    var shell2 = {
        x: 0,
        y: 0,
        direction: 0,
        isFiring: false,
    }
    
    var tracer2 = {
        x: 0,
        y: 0,
        oriX: 0,
        oriY: 0,
        opacity: 0,
    }
    
    var tank3 = {
        x : 1550,
        y : 1250,
        direction: 180,
    }
    
    var tank4 = {
        x : 1750,
        y : 1250,
        direction: 180,
    }
    
    var tank5 = {
        x : 1950,
        y : 1250,
        direction: 180,
    }
    
    var tank6 = {
        x : 2150,
        y : 1250,
        direction: 180,
    }

    
    $("#about").click(function() {
        $("#info").fadeToggle(100);
        $(this).toggleClass("active");
    })
    
    $("#audio").click(function() {
        if( ambient.volume() > 0 ) {
            ambient.volume(0);
            fan.volume(0);
            walking.volume(0);
            $(this).find("i").removeClass("fa-volume-off");
            $(this).find("i").addClass("fa-volume-up");
            mute = true;
        } else {
            ambient.volume(0.2);
            fan.volume(0.03);
            walking.volume(0.3);
            $(this).find("i").removeClass("fa-volume-up");
            $(this).find("i").addClass("fa-volume-off");
            mute = false;
        }
    })
    
    $("#center").click(function() {
        if( orbit.mode == "move" ) {
            orbit.vdeg = -10;
            orbit.hdeg = -20;
            movement.z = -200;
            movement.x = -200;
        } else {
            orbit.vdeg = -10;
            orbit.hdeg = -20;
            movement.z = 0;
            movement.x = 0;
        }
    })
    
    $("#mode").click(function() {
        if( orbit.mode == "move" ) {
            $(this).find("i").addClass("fa-arrows");
            $(this).find("i").removeClass("fa-refresh");
            orbit.mode = "orbit";
        } else {
            $(this).find("i").addClass("fa-refresh");
            $(this).find("i").removeClass("fa-arrows");
            orbit.mode = "move";
        }
    })
    
    $("#debug").draggable();
    
    $(document).mousewheel(function(e) {
        e.preventDefault();
        var delta = (e.deltaY * 10);
        orbit.zoom += delta;
    })
    
    $(document).bind('touchstart mousedown', function(e) {
        //e.preventDefault();
        cursor.down = true;
    })

    $(document).bind('touchend mouseup', function(e) {
        //e.preventDefault();
        cursor.down = false;
    })
    
    $('body').bind('touchmove mousemove', function(e) {
        //e.preventDefault();
        var relX = e.pageX;
        var relY = e.pageY;

        if( cursor.down ) {
            
            if( relX > orbit.x ) {
                orbit.xdir = "+";
            } else if( relX < orbit.x ){
                orbit.xdir = "-";
            }

            if( relY > orbit.y ) {
                orbit.ydir = "-";
            } else if( relY < orbit.y ){
                orbit.ydir = "+";
            }

            orbit.hspeed = Math.abs(relX - orbit.x);
            orbit.vspeed = Math.abs(relY - orbit.y);
        }
        
        orbit.x = relX;
        orbit.y = relY;
    });
    
    
    listener.register_combo({
        "keys"              : "e",
        "on_keydown"        :   function() {
                                    tank1.e = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank1.e = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "w",
        "on_keydown"        :   function() {
                                    tank1.w = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank1.w = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "s",
        "on_keydown"        :   function() {
                                    tank1.s = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank1.s = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "d",
        "on_keydown"        :   function() {
                                    tank1.d = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank1.d = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "q",
        "on_keydown"        :   function() {
                                    tank1.q = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank1.q = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "r",
        "on_keydown"        :   function() {
                                    tank1.r = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank1.r = false;
                                    return true;
                                },
    });
    
    
    
    
    
    listener.register_combo({
        "keys"              : "o",
        "on_keydown"        :   function() {
                                    tank2.e = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank2.e = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "i",
        "on_keydown"        :   function() {
                                    tank2.w = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank2.w = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "k",
        "on_keydown"        :   function() {
                                    tank2.s = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank2.s = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "l",
        "on_keydown"        :   function() {
                                    tank2.d = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank2.d = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "u",
        "on_keydown"        :   function() {
                                    tank2.q = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank2.q = false;
                                    return true;
                                },
    });
    
    listener.register_combo({
        "keys"              : "p",
        "on_keydown"        :   function() {
                                    tank2.r = true;
                                    return true;
                                },
        "on_keyup"          :   function() {
                                    tank2.r = false;
                                    return true;
                                },
    });
    
    function distance(x1,x2,y1,y2) {
        return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
    }
    
    setTimeout(function() {
        tank1.reloaded = true;
        tank2.reloaded = true;
    }, 3000);
    
    // Dirt trail refs
    
    var leftRear = $("#tank1 .tr_left .tr_dirt_back");
    var leftFront = $("#tank1 .tr_left .tr_dirt_front");
    var rightRear = $("#tank1 .tr_right .tr_dirt_back");
    var rightFront = $("#tank1 .tr_right .tr_dirt_front");
    
    var leftRear2 = $("#tank2 .tr_left .tr_dirt_back");
    var leftFront2 = $("#tank2 .tr_left .tr_dirt_front");
    var rightRear2 = $("#tank2 .tr_right .tr_dirt_back");
    var rightFront2 = $("#tank2 .tr_right .tr_dirt_front");
    
    var leftTracks = $("#tank1 .tr_left .link");
    var rightTracks = $("#tank1 .tr_right .link");
    
    var leftTracks2 = $("#tank2 .tr_left .link");
    var rightTracks2 = $("#tank2 .tr_right .link");
    
    
    // Game update
    setInterval(update, 0);

    function update() {    
        
        $("html, body").scrollTop(0);

        if( !cursor.down ) {
            orbit.hspeed -= orbit.drag;
            orbit.vspeed -= orbit.drag;
        }
        
        if( orbit.hspeed < 0 ) {
            orbit.hspeed = 0;
        }
        
        if( orbit.vspeed < 0 ) {
            orbit.vspeed = 0;
        }

        if( true ) {
            if( orbit.xdir == "+" ) {
                orbit.hdeg += orbit.hspeed*orbit.sensitivity;
            } else if( orbit.xdir == "-" ) {
                orbit.hdeg -= orbit.hspeed*orbit.sensitivity;
            }

            if( orbit.ydir == "+" ) {
                orbit.vdeg += orbit.vspeed*orbit.sensitivity;
            } else if( orbit.ydir == "-" ) {
                orbit.vdeg -= orbit.vspeed*orbit.sensitivity;
            }
        }
        
        $(".center").each(function() {
            var height = $(this).outerHeight();
            var width = $(this).outerWidth();
            $(this).css("left", "calc(50% - " + width/2 + "px)");
            $(this).css("top", "calc(50% - " + height/2 + "px)");
        })
        
        $("#tank1 .tb_2, #tank1 .t_left1, #tank1 .t_right1").text( $("#tank1_label").val() );
        $("#tank2 .tb_2, #tank2 .t_left1, #tank2 .t_right1").text( $("#tank2_label").val() );
        
        engine1.volume( Math.abs(tank1.actualSpeed)/20 + 0.1 );
        engine2.volume( Math.abs(tank2.actualSpeed)/20 + 0.1 );
        
        tank1.direction = Math.round(10*tank1.direction)/10;
        tank1.x = Math.round(10*tank1.x)/10;
        tank1.y = Math.round(10*tank1.y)/10;
        tank1.actualSpeed = Math.round(10*tank1.actualSpeed)/10;
        
        tank2.direction = Math.round(10*tank2.direction)/10;
        tank2.x = Math.round(10*tank2.x)/10;
        tank2.y = Math.round(10*tank2.y)/10;
        tank2.actualSpeed = Math.round(10*tank2.actualSpeed)/10;    
        
        if(tank1.q || tank1.r) {
            turret1.volume(0.03);
        } else {
            turret1.volume(0);
        }
        
        if(tank2.q || tank2.r) {
            turret2.volume(0.03);
        } else {
            turret2.volume(0);
        }
        
        if(tank1.q && !tank1.r) {
            tank1.turretDir -= 1;
        }
        
        if(tank1.r && !tank1.q) {
            tank1.turretDir += 1;
        }
        
        if( tank1.actualSpeed < tank1.speed ) {
            tank1.actualSpeed += 0.3;
        } else if( tank1.actualSpeed > tank1.speed ) {
            tank1.actualSpeed -= 0.2;
        }
                        
        var nextY = tank1.y + tank1.actualSpeed * Math.sin( (tank1.direction-90) * 0.017453292519 );
        var nextX = tank1.x + tank1.actualSpeed * Math.cos( (tank1.direction-90) * 0.017453292519 );
        
        if(   distance(nextX, tank2.x, nextY, tank2.y) < 120   ) {
            tank1.actualSpeed = 0;
            tank1.speed = 0;
        } else {
            tank1.x = nextX;
            tank1.y = nextY;
        }
        
        if( leftTracks.css("animation").indexOf("tracks_forward") >= 0 ) {
            $("#tank1 .tr_left .wheel").css("animation-name", "wheels_f");
        } else if( leftTracks.css("animation").indexOf("tracks_backward") >= 0 ) {
            $("#tank1 .tr_left .wheel").css("animation-name", "wheels_b");
        } else {
            $("#tank1 .tr_left .wheel").css("animation-name", "")
        }
        
        if( rightTracks.css("animation").indexOf("tracks_forward") >= 0 ) {
            $("#tank1 .tr_right .wheel").css("animation-name", "wheels_f");
        } else if( rightTracks.css("animation").indexOf("tracks_backward") >= 0 ) {
            $("#tank1 .tr_right .wheel").css("animation-name", "wheels_b");
        } else {
            $("#tank1 .tr_right .wheel").css("animation-name", "")
        }
        
        
        if(tank1.e && tank1.w) {
            tank1.speed = 8;
            
            leftTracks.css("animation-name", "tracks_forward");
            rightTracks.css("animation-name", "tracks_forward");
            
        }
        
        if(tank1.s && tank1.d) {
            tank1.speed = -3;
            
            leftTracks.css("animation-name", "tracks_backward");
            rightTracks.css("animation-name", "tracks_backward");
        }
        
        if(tank1.e && !tank1.w) {
            tank1.direction -= 0.5;
            tank1.speed = 0.5;
            
            leftTracks.css("animation-name", "");
            rightTracks.css("animation-name", "tracks_forward");
        }
        
        if(!tank1.e && tank1.w) {
            tank1.direction += 0.5;
            tank1.speed = 0.5;
            
            leftTracks.css("animation-name", "tracks_forward");
            rightTracks.css("animation-name", "");
        }
        
        if(tank1.s && !tank1.d) {
            tank1.direction -= 0.5;
            tank1.speed = -0.5;
            
            leftTracks.css("animation-name", "tracks_backward");
            rightTracks.css("animation-name", "");
        }
        
        if(!tank1.s && tank1.d) {
            tank1.direction += 0.5;
            tank1.speed = -0.5;
            
            leftTracks.css("animation-name", "");
            rightTracks.css("animation-name", "tracks_backward");
        }
        
        if(tank1.e && tank1.s) {
            tank1.direction -= 0.6;
            tank1.speed = 0;
            
            leftTracks.css("animation-name", "tracks_backward");
            rightTracks.css("animation-name", "tracks_forward");
        }
        
        if(tank1.w && tank1.d) {
            tank1.direction += 0.6;
            tank1.speed = 0;
            
            leftTracks.css("animation-name", "tracks_forward");
            rightTracks.css("animation-name", "tracks_backward");
        }
        
        if(!tank1.w && !tank1.e && !tank1.s && !tank1.d) {
            tank1.speed = 0;
            
            leftTracks.css("animation-name", "");
            rightTracks.css("animation-name", "");
        }
        
        if(tank1.w && tank1.s || tank1.e && tank1.d) {
            tank1.speed = 0;
            
            leftTracks.css("animation-name", "");
            rightTracks.css("animation-name", "");
        }
        
        
        
        
        
        
        
        if(tank2.q && !tank2.r) {
            tank2.turretDir -= 1;
        }
        
        if(tank2.r && !tank2.q) {
            tank2.turretDir += 1;
        }
        
         if( tank2.actualSpeed < tank2.speed ) {
            tank2.actualSpeed += 0.3;
        } else if( tank2.actualSpeed > tank2.speed ) {
            tank2.actualSpeed -= 0.2;
        }
        
        
        var nextY2 = tank2.y + tank2.actualSpeed * Math.sin( (tank2.direction-90) * 0.017453292519 );
        var nextX2 = tank2.x + tank2.actualSpeed * Math.cos( (tank2.direction-90) * 0.017453292519 );
        
        if(   distance(nextX2, tank1.x, nextY2, tank1.y) < 120   ) {
            tank2.actualSpeed = 0;
            tank2.speed = 0;
        } else {
            tank2.x = nextX2;
            tank2.y = nextY2;
        }
        
        
        if( leftTracks2.css("animation").indexOf("tracks_forward") >= 0 ) {
            $("#tank2 .tr_left .wheel").css("animation-name", "wheels_f");
        } else if( leftTracks2.css("animation").indexOf("tracks_backward") >= 0 ) {
            $("#tank2 .tr_left .wheel").css("animation-name", "wheels_b");
        } else {
            $("#tank2 .tr_left .wheel").css("animation-name", "")
        }
        
        if( rightTracks2.css("animation").indexOf("tracks_forward") >= 0 ) {
            $("#tank2 .tr_right .wheel").css("animation-name", "wheels_f");
        } else if( rightTracks2.css("animation").indexOf("tracks_backward") >= 0 ) {
            $("#tank2 .tr_right .wheel").css("animation-name", "wheels_b");
        } else {
            $("#tank2 .tr_right .wheel").css("animation-name", "")
        }
        
        
        
        if(tank2.e && tank2.w) {
            tank2.speed = 8;
            
            leftTracks2.css("animation-name", "tracks_forward");
            rightTracks2.css("animation-name", "tracks_forward");

        }
        
        if(tank2.s && tank2.d) {
            tank2.speed = -3;
            
            leftTracks2.css("animation-name", "tracks_backward");
            rightTracks2.css("animation-name", "tracks_backward");
        }
        
        if(tank2.e && !tank2.w) {
            tank2.direction -= 0.5;
            tank2.speed = 0.5;
            
            leftTracks2.css("animation-name", "");
            rightTracks2.css("animation-name", "tracks_forward");
        }
        
        if(!tank2.e && tank2.w) {
            tank2.direction += 0.5;
            tank2.speed = 0.5;
            
            leftTracks2.css("animation-name", "tracks_forward");
            rightTracks2.css("animation-name", "");
        }
        
        if(tank2.s && !tank2.d) {
            tank2.direction -= 0.5;
            tank2.speed = -0.5;
            
            leftTracks2.css("animation-name", "tracks_backward");
            rightTracks2.css("animation-name", "");
        }
        
        if(!tank2.s && tank2.d) {
            tank2.direction += 0.5;
            tank2.speed = -0.5;
            
            leftTracks2.css("animation-name", "");
            rightTracks2.css("animation-name", "tracks_backward");
        }
        
        if(tank2.e && tank2.s) {
            tank2.direction -= 0.6;
            tank2.speed = 0;
            
            leftTracks2.css("animation-name", "tracks_backward");
            rightTracks2.css("animation-name", "tracks_forward");
        }
        
        if(tank2.w && tank2.d) {
            tank2.direction += 0.6;
            tank2.speed = 0;
            
            leftTracks2.css("animation-name", "tracks_forward");
            rightTracks2.css("animation-name", "tracks_backward");
        }
        
        if(!tank2.w && !tank2.e && !tank2.s && !tank2.d) {
            tank2.speed = 0;
            
            leftTracks2.css("animation-name", "");
            rightTracks2.css("animation-name", "");
        }
        
        if(tank2.w && tank2.s || tank2.e && tank2.d) {
            tank2.speed = 0;
            
            leftTracks2.css("animation-name", "");
            rightTracks2.css("animation-name", "");
        }
        
        
        
        
        
        
        // FIRE CONTROL
        if( tank1.q && tank1.r ) {
            if(tank1.reloaded) {
                tank1.reloaded = false;
                tank1.recoil = 20;
                
                shell1.x = tank1.x;
                shell1.y = tank1.y;
                tracer1.x = tank1.x;
                tracer1.y = tank1.y;
                tracer1.oriX = tank1.x;
                tracer1.oriY = tank1.y;
                tracer1.opacity = 1;
                shell1.isFiring = true;
                shell1.direction = tank1.direction + tank1.turretDir;
                
                $("#blast1 .blast_gfx_2").css("animation-name","blast2");
                
                gunshot1.play();
                whistle1.play();
                
                
                
                setTimeout(function() {
                    tank1.reloaded = true;
                    shell1.isFiring = false;
                    $("#blast1 .blast_gfx_2").css("animation-name","");
                }, 3000);
            }
        }
        
        if( tank1.recoil > 0) {
            tank1.recoil -= 1;
        }
        if( tank1.recoil <= 0 ) {
            tank1.recoil = 0;
        }
        
        if( tracer1.opacity > 0) {
            tracer1.opacity -= 0.02;
        }
        if( tracer1.opacity <= 0 ) {
            tracer1.opacity = 0;
        }
        
        $("#tank1 .gun_wrap2").css("transform", "translateY(" + (-70 + tank1.recoil) + "px) scale3d(0.7,0.7,0.7) rotateZ(180deg)") ;
        
        $("#tracer1 *").css("opacity", tracer1.opacity) ;
        
        
        $("#tracer1 *").css("width", distance(shell1.x, tracer1.oriX, shell1.y, tracer1.oriY) );
        
        if( shell1.isFiring ) {
            shell1.y = shell1.y + 100 * Math.sin( (shell1.direction-90) * 0.017453292519 );
            shell1.x = shell1.x + 100 * Math.cos( (shell1.direction-90) * 0.017453292519 );
            
            if(   distance(shell1.x, tank2.x, shell1.y, tank2.y) < 80   ) {
                shell1.isFiring = false;
            }
            
            $("#shell1").show();
        } else {
            $("#shell1").hide();
        }
        
        
        // FIRE CONTROL 2
        
        if( tank2.q && tank2.r ) {
            if(tank2.reloaded) {
                tank2.reloaded = false;
                tank2.recoil = 20;
                
                shell2.x = tank2.x;
                shell2.y = tank2.y;
                tracer2.x = tank2.x;
                tracer2.y = tank2.y;
                tracer2.oriX = tank2.x;
                tracer2.oriY = tank2.y;
                tracer2.opacity = 1;
                shell2.isFiring = true;
                shell2.direction = tank2.direction + tank2.turretDir;
                
                $("#blast2 .blast_gfx_2").css("animation-name","blast2");
                
                gunshot2.play();
                whistle2.play();
                
                setTimeout(function() {
                    tank2.reloaded = true;
                    shell2.isFiring = false;
                    $("#blast2 .blast_gfx_2").css("animation-name","");
                }, 3000);
            }
        }
        
        if( tank2.recoil > 0) {
            tank2.recoil -= 1;
        }
        if( tank2.recoil <= 0 ) {
            tank2.recoil = 0;
        }
        
        if( tracer2.opacity > 0) {
            tracer2.opacity -= 0.02;
        }
        if( tracer2.opacity <= 0 ) {
            tracer2.opacity = 0;
        }
        
        $("#tank2 .gun_wrap2").css("transform", "translateY(" + (-70 + tank2.recoil) + "px) scale3d(0.7,0.7,0.7) rotateZ(180deg)") ;
        
        $("#tracer2 *").css("opacity", tracer2.opacity) ;
        
        
        $("#tracer2 *").css("width", distance(shell2.x, tracer2.oriX, shell2.y, tracer2.oriY) );
        
        if( shell2.isFiring ) {
            shell2.y = shell2.y + 100 * Math.sin( (shell2.direction-90) * 0.017453292519 );
            shell2.x = shell2.x + 100 * Math.cos( (shell2.direction-90) * 0.017453292519 );
            
            if(   distance(shell2.x, tank1.x, shell2.y, tank1.y) < 80   ) {
                shell2.isFiring = false;
            }
            
            $("#shell2").show();
        } else {
            $("#shell2").hide();
        }
        
        
        
        
        
        
        
        $("#tank1 .turret_wrap").css("transform", "translateY(6px) translateZ(30px) rotateZ(" + tank1.turretDir + "deg)");
        $("#tank1").css("transform", "translateZ(30px) translateX(" + tank1.x + "px) translateY(" + tank1.y + "px) rotateZ(" + tank1.direction + "deg)");
        //$("#tank1").css("left", (tank1.x-50));
        //$("#tank1").css("top", (tank1.y-50));
        
        
        $("#tank2 .turret_wrap").css("transform", "translateY(6px) translateZ(30px) rotateZ(" + tank2.turretDir + "deg)");
        $("#tank2").css("transform", "translateZ(30px) translateX(" + tank2.x + "px) translateY(" + tank2.y + "px) rotateZ(" + tank2.direction + "deg)");
        //$("#tank2").css("left", (tank2.x-50));
        //$("#tank2").css("top", (tank2.y-50));
        
        $("#shell1").css("transform", "translateZ(60px) translateX(" + shell1.x + "px) translateY(" + shell1.y + "px) rotateZ(" + shell1.direction + "deg)")
        
        $("#tracer1").css("transform", "translateZ(60px) translateX(" + tracer1.x + "px) translateY(" + tracer1.y + "px) rotateZ(" + (shell1.direction - 90) + "deg)")
        
        $("#blast1").css("transform", "translateX(" + tracer1.oriX + "px) translateY(" + tracer1.oriY + "px) rotateZ(" + (shell1.direction +180) + "deg)")
        
        
        
        
        $("#shell2").css("transform", "translateZ(60px) translateX(" + shell2.x + "px) translateY(" + shell2.y + "px) rotateZ(" + shell2.direction + "deg)")
        
        $("#tracer2").css("transform", "translateZ(60px) translateX(" + tracer2.x + "px) translateY(" + tracer2.y + "px) rotateZ(" + (shell2.direction - 90) + "deg)")
        
        $("#blast2").css("transform", "translateX(" + tracer2.oriX + "px) translateY(" + tracer2.oriY + "px) rotateZ(" + (shell2.direction +180) + "deg)")
        
        
        
        
        $("#tank3").css("transform", "translateZ(30px) translateX(" + tank3.x + "px) translateY(" + tank3.y + "px) rotateZ(" + tank3.direction + "deg)");
        
        $("#tank4").css("transform", "translateZ(30px) translateX(" + tank4.x + "px) translateY(" + tank4.y + "px) rotateZ(" + tank4.direction + "deg)");
        
        $("#tank5").css("transform", "translateZ(30px) translateX(" + tank5.x + "px) translateY(" + tank5.y + "px) rotateZ(" + tank5.direction + "deg)");
        
        $("#tank6").css("transform", "translateZ(30px) translateX(" + tank6.x + "px) translateY(" + tank6.y + "px) rotateZ(" + tank6.direction + "deg)");
        
        
        
        /*
        if( movement.keyDown ) {
            if(movement.direction == "forward") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg + 90) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg + 90) * 0.017453292519 );
            }
            
            if(movement.direction == "left") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg) * 0.017453292519 );
            }
            
            if(movement.direction == "right") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg + 180) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg + 180) * 0.017453292519 );
            }
            if(movement.direction == "back") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg - 90) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg - 90) * 0.017453292519 );
            }
            
            
            movement.z = newZ;
            movement.x = newX;
        }
        */
        
        // Orbit clamps
        
        /*
        if( orbit.hdeg > 70) {
            orbit.hdeg = 70;
        } else if( orbit.hdeg < -70 ) {
            orbit.hdeg = -70;
        }
        */
        
        if( orbit.vdeg > 80) {
            orbit.vdeg = 80;
        } else if( orbit.vdeg < -80 ) {
            orbit.vdeg = -80;
        }
        
        
        if( orbit.zoom > 600) {
            orbit.zoom = 600;
        } else if( orbit.zoom < -3000 ) {
            orbit.zoom = -3000;
        }
        
        
        if( true ) {
            if( movement.z > 200) {
                movement.z = 200;
            } else if( movement.z < -200 ) {
                movement.z = -200;
            }

            if( movement.x > 200) {
                movement.x = 200;
            } else if( movement.x < -200 ) {
                movement.x = -200;
            }
        }
        
        /*
        if( movement.keyDown ) {
            if(!mute) {
                walking.volume(0.3);
            } 
        }
        
        if(! movement.keyDown ) {
            walking.volume(0);
        }
        */    
            
        //$("#wrap").css("transform", "scale(" + orbit.zoom + ") translateZ(700px)");
        
        
        orbit.midX = (tank1.x + tank2.x)/2;
        orbit.midY = (tank1.y + tank2.y)/2;
        
        var angleDeg = Math.atan2(tank2.y - tank1.y, tank2.x - tank1.x) * 180 / Math.PI;
        
        if( orbit.mode == "orbit" ) {
            $("#plane").css("transform", "rotateX(" + orbit.vdeg + "deg) rotateY(" + orbit.hdeg + "deg)");
            $("#wrap").css("transform", "translateZ(" + orbit.zoom + "px)");
            $("#movement_wrap").css("transform", "");
        } else {
            $("#plane").css("transform", "");
            $("#wrap").css("transform", "translateZ(" + orbit.zoom + "px) rotateX(" + orbit.vdeg + "deg) rotateY(" + -45 + "deg)");
            $("#movement_wrap").css("transform", "translateZ(" + ((orbit.midY - 1500)*-1) + "px) translateX(" + ((orbit.midX - 1500)*-1) + "px)");
        }
        
        
        // DUBUG
        
        $("#t1_direction").text("direction: " + tank1.direction);
        $("#t1_turretDir").text("turretDir: " + tank1.turretDir);
        $("#t1_x").text("x: " + tank1.x);
        $("#t1_y").text("y: " + tank1.y);
        $("#t1_reloaded").text("reloaded: " + tank1.reloaded);
        
        $("#t2_direction").text("direction: " + tank2.direction);
        $("#t2_turretDir").text("direction: " + tank2.turretDir);
        $("#t2_x").text("direction: " + tank2.x);
        $("#t2_y").text("direction: " + tank2.y);
        $("#t2_reloaded").text("reloaded: " + tank2.reloaded);
        
        $("#distance").text("distance: " + distance(nextX2, tank1.x, nextY2, tank1.y));
    }
    
})