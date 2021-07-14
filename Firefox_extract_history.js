ObjC.import('sqlite3');
ObjC.import('Foundation');
app = Application.currentApplication();
app.includeStandardAdditions = true;

function history_extract(){
	var output = "";
	var fileMan = $.NSFileManager.defaultManager;
	var err;
	var username = $.NSUserName().js
	var ffoxpath = '/Users/' + username + '/Library/Application\ Support/Firefox/Profiles';
	if (fileMan.fileExistsAtPath(ffoxpath)){
		let prof_folders = ObjC.deepUnwrap(fileMan.contentsOfDirectoryAtPathError(ffoxpath,$()));
		try{
			for (p=0; p< prof_folders.length; p++){
				if ((prof_folders[p]).includes('-release')){
					var changeto = ffoxpath + "/" + prof_folders[p];
					var dircontents = ObjC.deepUnwrap(fileMan.contentsOfDirectoryAtPathError(changeto,$()));
					for (n=0; n<dircontents.length; n++){
						if (dircontents[n] == 'places.sqlite'){
							var hpath = changeto + "/" + dircontents[n];
							var ppDb = Ref();
							var err = $.sqlite3_open(hpath, ppDb)
							var db = ppDb[0]
							if(err != $.SQLITE_OK) throw new Error($.sqlite3_errmsg(db))
							var sql = 'select datetime(visit_date/1000000,\'unixepoch\') as time, url FROM moz_places, moz_historyvisits where moz_places.id=moz_historyvisits.place_id order by time'
							var ppStmt = Ref()
							var err = $.sqlite3_prepare(db, sql, -1, ppStmt, Ref())
							if(err != $.SQLITE_OK) throw new Error($.sqlite3_errmsg(db))
							pStmt = ppStmt[0]
							try{
								output += 'FORMAT: Date | URL\n';
								output += '___________________________________________________________________________________________________\n';
								while((err = $.sqlite3_step(pStmt)) == $.SQLITE_ROW){
									output += $.sqlite3_column_text(pStmt,0) + " | " + $.sqlite3_column_text(pStmt,1) + " | \n"
								}
								output += '#####################################################################################################\n';
								return output
							}
							catch(error) {
								output += error.toString()
								return output
							}
							//finally{
								//var err = $.sqlite3_finalize(pStmt)
									//																				var err = $.sqlite3_close(db)
								//																					if(err != $.SQLITE_OK) throw new Error($.sqlite3_errmsg(db))
							//}

						}



					}
}
}
}
catch(err){

}
}
}

history_extract()
