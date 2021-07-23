var diddlejs = {
	scripts: [ ],
	get largs() {
		var LaunchArguments = {};
		// Fetch process.argv and remove first two objects
		var filtered = process.argv.filter(a => a != process.argv[0] && a != process.argv[1]);
		for ( let i = 0; i < filtered.length; i++ ) {
			var input = filtered[i].replace("--","");
	
			var objName,objData;
	
			if (input.split("=").length == 1) {
				objName = input.split("=")[0];
				objData = true;
			} else {
				objName = input.split("=")[0];
				objData = input.split("=")[1];
			}
	
			LaunchArguments[objName] = objData;
		}
		if (process.largs == undefined || process.largs != LaunchArguments) {
			process.largs = LaunchArguments;
		}
		return LaunchArguments;
	}
}

console.log("Parsed Launch Arguments;",diddlejs.largs);