fx_version 'cerulean'

games { 
	'gta5' 
}

lua54 "yes"

name 'ngItemcreator'
author 'Niklas Gschaider <niklas.gschaider@gschaider-systems.at>'
description ''
version 'v1.0.3'

dependencies {
	"es_extended",
}

ui_page "ui/index.html"

files {
	"config.js",
	"ui/**"
}

client_scripts {
	"client/*",
}

server_scripts {
	'@mysql-async/lib/MySQL.lua',
	"server/*",
}