function waitingtimetoMap() {
	const cw = 430;
	const ch = 240;
	var c = createCanvas(cw,ch);
	var ctx = c.getContext("2d", {alpha: false});
	  base_image = new Image();
	  //ctx.fillStyle = "#3c1c00";
	  ctx.fillStyle = "black";
	 ctx.fillRect(0, 0, c.width, c.height);
	 
	  base_image.src = splashPNG;
	  base_image.onload = function(){ 
			ctx.imageSmoothingEnabled = false;
		  ctx.drawImage(base_image, 0, 0);
			ctx.font = "20px Comic Sans MS";
		  ctx.fillStyle = "#542800";
		  ctx.textAlign = "center";
		  ctx.fillText("tournament starts "+getTimeTo(), cw/2, 95); 	
		  const reset = 110;
		  const max = 220;
		  let widthS = 40;
		  let heightS = reset;
		  var i=0;
		  for (let pl of  subscribedPlayers.values()) {
			ctx.font = "12px Arial";
		  ctx.textAlign = "left";
		  
		  ctx.fillStyle = "#88480c";

		  // ctx.lineWidth=1;			
			ctx.fillText(pl.name.substring(0,16), widthS, heightS); 
			heightS = heightS + 15;
			if (heightS>max) {
				heightS = reset;
				widthS = widthS + 85;
			}
			i++;
		  }

			
		(function nextLev() {
		  ctx.font = "10px Arial";
		  ctx.textAlign = "left";
	  
		  ctx.fillStyle = "#9494f8";
		  ctx.fillText("currently "+subscribedPlayers.size+" players registered", cw-150, ch-15); 
		})();
			
		var imgData = ctx.getImageData(0, 0, cw, ch-10);
		let rawData = [];

		for (let i = 0; i < imgData.data.length; i += 4) {
			let colorVal = getbestpixelValue(imgData.data[i],imgData.data[i + 1],imgData.data[i + 2]);
			rawData.push(colorVal);
			/*
			if (colorVal==1) {			
				imgData.data[i]=108;
				imgData.data[i + 1]=56;
				imgData.data[i + 2]=00;
				imgData.data[i + 3]=255;
			} */
			
		}
		//ctx.putImageData(imgData, 20, 0); 
		console.log("done", rawData, failures);
		room.loadRawLevel("batman_custom.lev",new Uint8Array(rawData).buffer, cw, ch);
	  }
		let failures = 0;
	  function getbestpixelValue(red,green,blue) {
		 let colorVal = Array.prototype.slice.call(arguments).join("_");;
		if (invPal.get(colorVal)==undefined) {
				if (red<25){ 
					return 0;
				} else if (red>100 && green>100 && blue > 100){
					return invPal.get("148_148_248");
				}				
				return 1;
				
			} 
			return invPal.get(colorVal);		
			
	  }
}

function getTimeTo() {
	var hours =(new Date()).getUTCHours();
	if (hours>=14) {
		return "very soon";
	}
	var min = 60-(new Date()).getUTCMinutes();
	return "in "+(14-hours-(min==60?0:1))+" hours and "+(min==60?0:min)+" minute"+(min!=1?"s":"");
}

var timerID;

function startSplashWaiting()
{
	timerID = setInterval(function() {
		waitingtimetoMap();
	}, 30 * 1000); 	
}

function stopSplashWaiting()
{
	clearInterval(timerID);
}