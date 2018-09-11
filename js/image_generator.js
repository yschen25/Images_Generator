$(function(){

	var uploadFile, index, imgName, 
		cusText, cusImgName,
		downloadImg;

	var canvas    = $('#canvas')[0],
		ctx       = canvas.getContext('2d');
	canvas.width  = 400;
	canvas.height = 300;

	// Choose image from this website
	$('.imgs').click(function(){
		var changeImg = $(this).attr('src');
		cvsObj.image  = changeImg;
		sendToCanvas(cvsObj);
	})
	
	// Get uploaded image
	$('#uploadButton').change(function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		uploadFile = $('#uploadButton')[0].files[0];
		index      = uploadFile.name.lastIndexOf('.');
		imgName    = uploadFile.name.slice(0, index);
		readImg();
	});

	// Change original image to uploaded image
	function readImg(){
		var reader    = new FileReader();
		// Save image path by Data Url(Base64 format)
		reader.readAsDataURL(uploadFile);
		reader.onload = function(){
			cvsObj.image = this.result;
			sendToCanvas(cvsObj);
		};
	}

	// Start drawing canvas
	function sendToCanvas(ob){
		var img    = new Image();
		img.onload = function(){
			ctx.drawImage(img, 0, 0);
			ctx.fillStyle = ob.color;
			ctx.font = ob.fontWeight + ' ' + ob.fontSize + ' ' + ob.fontFamily;
			ctx.fillText(ob.text, canvas.width/8, canvas.height/2.5);
		};
		img.crossOrigin = "Anonymous";
		img.src = ob.image;
	}

	var cvsObj = {
		image      : 'images/5.jpg',
	    text       : 'brain is a good thing',
 	    fontFamily : 'Noto Sans TC',
	    fontWeight : 'bold',
	    fontSize   : '1.2rem',
	    color      : '#fff',
	};
	sendToCanvas(cvsObj);

	// Get the customize text
	$('#cusText').on("input", function(){
		cvsObj.text = $('#cusText').val();
		sendToCanvas(cvsObj);
	});

	// Get the customize filename
	$('#cusImgName').change(function(){
		cusImgName = $('#cusImgName').val();
	});

	// Download image
	$('#downloadBtn').click(function(){
		downloadImg = canvas.toDataURL("image/jpg");
		$('#downloadBtn').attr('href', downloadImg);

		// Detect customize filename change
		if(cusImgName)   $('#downloadBtn').attr('download', cusImgName + '.jpg');
		else if(imgName) $('#downloadBtn').attr('download', imgName + '-image_generator_ByKa' + '.jpg');

		// Clear customize text after download
		$('#cusText').val('');
	})

	// Palette
	var colors  = ['#e81212', '#ff941c','#fff130', '#169933', '#391bf9', '#a90ac9', '#000', '#767676', '#fff','linear-gradient(to bottom, red, orange, yellow, green, blue, purple)'];
	var palette = [];

	$.each(colors, function(key, value){
		palette.push('<div class="option" style="background:' + value + '"></div>');
	})

	$('#paletteWrapper').append(palette);

	// Brush size setting
	var pen = [];
	for(var i=0; i<9; i++){
		pen.push('<div class="penBox"><div class="penSize" data-value="' + (i+1) +'" style="height:' + (i+10) + 'px; width:'+ (i+10) + 'px; background: #e81212;"></div></div>');
	}

	$('#penWrapper').append(pen);
	$('.option').first().addClass('active');
	$('.penBox').first().addClass('active');

	// Change brush color
	var paint = true;
	var rainbowSwitch;
	var colorChoice = '#e81212';
	$('.option').click(function(){
		paint = true;
		rainbowSwitch = false;
		$('.option, #eraser').removeClass('active');
		$(this).addClass('active');
		
		if ($('.option:last-child').hasClass('active')) {
			rainbowSwitch = true;
			colorChoice = 'linear-gradient(to bottom right, red, orange, yellow, green, blue, purple';
			$('.penSize').css('background', colorChoice);
		}else{
			colorChoice = $(this).css('background-color');
			$('.penSize').css('background', colorChoice);
		}
	});

	// Change brush size
	var sizeChoice = 1;
	$('.penBox').click(function(){
		$('.penBox, #eraser').removeClass('active');
		$(this).addClass('active');
		sizeChoice = ($('.penSize', this).data('value'));
	});
	
	// Start drawing
	var $canvas = $('#canvas');
	var drawMode = false;
	$canvas.mousedown(function(e){
			// Rainbow brush
			var gradient = ctx.createLinearGradient(e.offsetX, e.offsetY, (e.offsetX+70), (e.offsetY+70));
			gradient.addColorStop('0.0','#f7120c'); 
			gradient.addColorStop('0.1','#ef540b'); 
			gradient.addColorStop('0.2','#f7890c'); 
			gradient.addColorStop('0.3','#f3f70c'); 
			gradient.addColorStop('0.4','#89f70c'); 
			gradient.addColorStop('0.5','#0cf795'); 
			gradient.addColorStop('0.6','#0ceff7'); 
			gradient.addColorStop('0.7','#0c69f7'); 
			gradient.addColorStop('0.8','#660cf7'); 
			gradient.addColorStop('0.9','#950cf7'); 
			gradient.addColorStop('1.0','#c40cf7');

			if (rainbowSwitch) ctx.strokeStyle = gradient; 
			else ctx.strokeStyle = colorChoice;
			ctx.lineWidth   = sizeChoice;
		if (paint)ctx.globalCompositeOperation = 'source-over';
		else {
			ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
			ctx.globalCompositeOperation = 'destination-out';
		}
			ctx.beginPath();
			ctx.lineCap = 'round';
			ctx.moveTo(e.offsetX, e.offsetY);
			drawMode = true;

	})
	.mousemove(function (e) {
        if(drawMode){
    		ctx.lineTo(e.offsetX, e.offsetY);
        	if (paint) ctx.globalCompositeOperation = 'source-over';
	        else ctx.globalCompositeOperation = 'destination-out';
            ctx.stroke();
        }
     })
    .mouseup(function (e) {
        drawMode = false;
        ctx.closePath();
    });

    // Change canvas width 'n' heigh when the device is phone
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		canvas.width  = 250;
		canvas.height = 300;
	}

	// Share by line 
	$('.lineShare').click(function(){
		window.open('https://lineit.line.me/share/ui?url='+encodeURIComponent("http://ka.com:9123/image_generator.html"),"_blank","toolbar=yes,location=yes,directories=no,status=no, menubar=yes,scrollbars=yes,resizable=no, copyhistory=yes,width=600,height=400")
	})

    // Eraser tool
    // $('#eraser').click(function(){
    //     paint = false;
    // 	$('.option').removeClass('active');
    // 	$(this).addClass('active');
    // })
})