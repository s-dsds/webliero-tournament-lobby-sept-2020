(async function () {
	console.log("Running Server...");
	var room = WLInit({
		token: window.WLTOKEN,
		roomName: "Tournament Lobby",
		maxPlayers: 60,	
		public: false
	});

	room.setSettings({
		scoreLimit: 10,
		timeLimit: 10,
		gameMode: "htf",
		levelPool: "allBest",
		respawnDelay: 3,
		bonusDrops: "health",
		teamsLocked: true,
	});
	window.WLROOM = room;
	initFirebase();
})();

const admins = new Set(CONFIG.admins);

let subscribedPlayers = new Map();
let auth = new Map();
var fdb;
var commentsRef;
var notifsRef;

var registrationIsClosed = false;

window.WLROOM.onPlayerJoin = (player) => {
	if ( admins.has(player.auth) ) {
		window.WLROOM.setPlayerAdmin(player.id, true);
	}
	window.WLROOM.sendAnnouncement("Hi, this room is the Tournament's lobby room,", player.id, 2550000, "italic", 1);
	window.WLROOM.sendAnnouncement("the tournament is planned for saturday, the 19 the of september 2020, starting at 2:00pm UTC,", player.id, 2550000, "italic", 1);	
	window.WLROOM.sendAnnouncement("feel free to stay in here while matches are going on in the main room", player.id, 2550000, "italic", 1);
	window.WLROOM.sendAnnouncement("any updates about the schedule will be posted here first!", player.id, 2550000, "italic", 1);
	if (player.auth){		
		sp = subscribedPlayers.get(player.auth);
		if (sp) {
			window.WLROOM.sendAnnouncement("you are already registered for the tournament, please kindly wait for your turn ;) we will keep you updated", player.id, 2550000, "bold", 1);
			notifyAdmins("'"+player.name+"' is registered as '"+sp.name+"' with key '"+player.auth+"'");
		} else {
			window.WLROOM.sendAnnouncement("either you are not registered or did not register through the registration room", player.id, 2550000, "bold", 1);
			if (!registrationIsClosed) {
				window.WLROOM.sendAnnouncement("you can still register by typing 'register'", player.id, 2550000, "bold", 1);
			}
			
			notifyAdmins("'"+player.name+"' is not registered key is '"+player.auth+"'");
		}
		auth.set(player.id, player.auth);
	} else {
		window.WLROOM.sendAnnouncement("your auth key seems to not exist", player.id, 2550000, "bold", 1);	
		notifyAdmins("'"+player.name+"' has no key");
	}
	
}

function notifyAdmins(msg) {
	getAdmins().forEach((a) => { window.WLROOM.sendAnnouncement(msg, a.id); });
	notifsRef.push({msg:msg, time:Date.now(), formatted:(new Date(Date.now()).toLocaleString())});
}

function getAdmins() {
	return window.WLROOM.getPlayerList().filter((p) => p.admin);
}


window.WLROOM.onPlayerLeave = function(player) {  
	auth.delete(player.id);
}

var mypool = [		
	];


	window.WLROOM.onPlayerChat = function (p, m) {
	console.log(p.name+" "+m);
	if (m=="register") {
		register(p);
	} else if (m=="cancel") {
		cancel(p);
	} else if (p.admin && adminCommand(p, m)) {
		return false;
	}
	writeLog(p,m);
}

function adminCommand(p, m) {
	if (m=="ro") {
		registrationIsClosed=false;		
	} else if (m=="rc"){
		registrationIsClosed=true;		
	} else if (m=="startWait") {
		startSplashWaiting();
	} else if (m=="stopWait") {
		stopSplashWaiting();
	} else {
		return false;
	}
	return true;
}

function register(p) {
	if (registrationIsClosed) {
		return false;
	}
	let a = auth.get(p.id);
	let subbed = subscribedPlayers.get(a);
	if (subbed) {				
		window.WLROOM.sendAnnouncement("you are already registered for the tournament, join us on discord for more information, you can cancel by typing 'cancel'", p.id, 2550000, "italic", null);
	} else {
		subscribedPlayers.set(a, p);
		console.log(a);
		window.WLROOM.sendAnnouncement("thanks "+p.name+" your registration is done good luck to you!", p.id, 2550000, "italic", null);
		window.WLROOM.sendAnnouncement("public key is "+a, p.id, 2550000, "italic", null);
		window.WLROOM.sendAnnouncement("there are now "+subscribedPlayers.size+" players registered", p.id, 2550000, "italic", null);
		window.WLROOM.sendAnnouncement("you can remove your registration by typing 'cancel' anytime until the tournament begins", p.id, 2550000, "italic", null);
		genNewMap();
		console.log(p);
		writeUser(a,p.name);
	}
}

function cancel(p) {
	if (registrationIsClosed) {
			return false;
		}
		let a = auth.get(p.id);
		console.log("auth"+a);
		let subbed = subscribedPlayers.get(a);
		console.log(subbed);
		if (subbed) {								
			subscribedPlayers.delete(a);
			window.WLROOM.sendAnnouncement("your registration has been canceled", p.id, 2550000, "italic", null);
			console.log(subscribedPlayers);
			genNewMap();
			deleteUser(a);
			return;
		}
					
		window.WLROOM.sendAnnouncement("it seems your registration was not found", p.id, 2550000, "italic", null);
}
