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
		getCurrentMapIfOk();
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
			getCurrentMapIfOk();
			deleteUser(a);
			return;
		}
					
		window.WLROOM.sendAnnouncement("it seems your registration was not found", p.id, 2550000, "italic", null);
}
