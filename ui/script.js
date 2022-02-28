const AddStep = (type) => {
	let wrapper = $("<div>").addClass("form-step form-step-" + type).attr("data-type", type);
	wrapper.appendTo($("#form-steps"));

	let title = $("<h5>").text(GetStepTitle(type));
	title.appendTo(wrapper); 

	let row = $("<div>").addClass("row");
	row.appendTo(wrapper);

	let stepContent = $("<div>").addClass("col-11");
	stepContent.append(GetStepContent(type));
	stepContent.appendTo(row);

	let actionButtons = $("<div>").addClass("col-1");
	actionButtons.appendTo(row);

	let deleteButton = $("<input>").attr("type", "button").attr("value", "X").addClass("btn btn-danger");
	deleteButton.click(() => {
		wrapper.remove();
	});
	deleteButton.appendTo(actionButtons);

	return wrapper;
};

const StepTypes = [
	"addItem",
	"removeItem",
	"showNotification",
	"addStatus",
	"executeServerCommand",
	"executeClientCommand",
	"executeServerCode",
	"executeClientCode",
	"spawnVehicle",
	/*"playAnimation",
	"attachProp",*/
	"eat",
	"drink",
];

const GetStepTitle = type => {
	let localized = GetLocalizedText("stepType" + type[0].toUpperCase() + type.substr(1));
	return localized ? localized : GetLocalizedText("invalidStep");
}

const GetStepContent = (type) => {
	if(type == "addItem") {
		let row = $("<div>").addClass("row");

		let col1 = $("<div>").addClass("col-9");
		col1.appendTo(row);
		
		let name = $("<input>").attr("type", "text").attr("placeholder", GetLocalizedText("name") + " (ID)").addClass("form-control step-data");
		name.attr("data-key", "name");
		name.appendTo(col1);

		let col2 = $("<div>").addClass("col-3")
		col2.appendTo(row);
		
		let amount = $("<input>").attr("type", "number").attr("placeholder", GetLocalizedText("amount")).addClass("form-control step-data");
		amount.attr("data-key", "amount").attr("data-format", "number");
		amount.appendTo(col2);

		return row;
	} else if(type == "removeItem") {
		let row = $("<div>").addClass("row");

		let col1 = $("<div>").addClass("col-9");
		col1.appendTo(row);
		
		let name = $("<input>").attr("type", "text").attr("placeholder", GetLocalizedText("name") + " (ID)").addClass("form-control step-data");
		name.attr("data-key", "name");
		name.appendTo(col1);

		let col2 = $("<div>").addClass("col-3")
		col2.appendTo(row);
		
		let amount = $("<input>").attr("type", "number").attr("placeholder", GetLocalizedText("amount")).addClass("form-control step-data");
		amount.attr("data-key", "amount").attr("data-format", "number");
		amount.appendTo(col2);

		return row;
	} else if(type == "showNotification") {
		let text = $("<input>").attr("type", "text").attr("placeholder", GetLocalizedText("text")).addClass("form-control step-data");
		text.attr("data-key", "text");
		
		return text;
	} else if(type == "addStatus") {
		let row = $("<div>").addClass("row");

		let col1 = $("<div>").addClass("col-9");
		col1.appendTo(row);
		
		let statusTypes = $("<select>").addClass("form-control step-data");
		statusTypes.attr("data-key", "name");
		statusTypes.appendTo(col1);

		let hungerType = $("<option>").text(GetLocalizedText("hunger")).val("hunger");
		hungerType.appendTo(statusTypes);

		let thirstType = $("<option>").text(GetLocalizedText("thirst")).val("thirst");
		thirstType.appendTo(statusTypes);

		let stressType = $("<option>").text(GetLocalizedText("stress")).val("stress");
		stressType.appendTo(statusTypes);

		let col2 = $("<div>").addClass("col-3")
		col2.appendTo(row);
		
		let amount = $("<input>").attr("type", "number").attr("placeholder", GetLocalizedText("value")).addClass("form-control step-data");
		amount.attr("data-key", "amount").attr("data-format", "number");
		amount.appendTo(col2);

		return row;
	} else if(type == "executeServerCommand" || type == "executeClientCommand") {
		let command = $("<input>").attr("type", "text").attr("placeholder", GetLocalizedText("command")).addClass("form-control step-data");
		command.attr("data-key", "command");
		
		return command;
	} else if(type == "executeServerCode" || type == "executeClientCode") {
		let code = $("<textarea>").attr("type", "text").attr("placeholder", GetLocalizedText("code")).addClass("form-control step-data");
		code.attr("data-key", "code");
		code.css("width", "100%");
		
		return code;
	} else if(type == "spawnVehicle") {
		let row = $("<div>").addClass("row");

		let col1 = $("<div>").addClass("col-9");
		col1.appendTo(row);
		
		let name = $("<input>").attr("type", "text").attr("placeholder", GetLocalizedText("modelName")).addClass("form-control step-data");
		name.attr("data-key", "modelName");
		name.appendTo(col1);

		let col2 = $("<div>").addClass("col-3")
		col2.appendTo(row);
		
		let label = $("<label>").text(GetLocalizedText("persistent") + "?");
		label.appendTo(col2);

		let persistent = $("<input>").attr("type", "checkbox").addClass("step-data");
		persistent.attr("data-key", "persistent").attr("data-format", "boolean");
		persistent.appendTo(label);

		return row;
	} /*else if(type == "attachProp") {
		let wrapper = $("<div>");

		let propName = $("<input>").attr("type", "text").addClass("form-control step-data").attr("data-key", "propName");
		propName.attr("placeholder", "Prop name")
		propName.appendTo(wrapper);

		// ROW 1
		let row1 = $("<div>").addClass("row");
		row1.appendTo(wrapper);

			// EL11
		let col11 = $("<div>").addClass("col-4");
		col11.appendTo(row1);

				// POS X
		let posX = $("<input>").attr("type", "text").addClass("form-control step-data").attr("data-key", "posX").attr("placeholder", "Position X");
		posX.appendTo(col11);

			// col12
		let col12 = $("<div>").addClass("col-4");
		col12.appendTo(row1);

				// POS Y
		let posY = $("<input>").attr("type", "text").addClass("form-control step-data").attr("data-key", "posY").attr("placeholder", "Position Y");
		posY.appendTo(col12);

			// col13
		let col13 = $("<div>").addClass("col-4");
		col13.appendTo(row1);

				// POS Z
		let posZ = $("<input>").attr("type", "text").addClass("form-control step-data").attr("data-key", "posZ").attr("placeholder", "Position Z");
		posZ.appendTo(col13);

		// ROW 2
		let row2 = $("<div>").addClass("row");
		row2.appendTo("wrapper");

			// col21
		let col21 = $("<div>").addClass("col-4");
		col21.appendTo(row2);

				// ROT X
		let rotX = $("<input>").attr("type", "text").addClass("form-control step-data").attr("data-key", "rotY").attr("placeholder", "Rotation X");
		rotX.appendTo(col21);

			// col22
		let col22 = $("<div>").addClass("col-4");
		col22.appendTo(row2);

				// ROT Y
		let rotY = $("<input>").attr("type", "text").addClass("form-control step-data").attr("data-key", "rotY").attr("placeholder", "Rotation Y");
		rotY.appendTo(col22);

			// col23
		let col23 = $("<div>").addClass("col-4");
		col23.appendTo(row2);

				// ROT Z
		let rotZ = $("<input>").attr("type", "text").addClass("form-control step-data").attr("data-key", "rotZ").attr("placeholder", "Rotation Z");
		rotZ.appendTo(col23);

		return wrapper;
	}*/ /*else if(type == "playAnimation") {
		// animDict, animName, blendInSpeed, blendOutSpeed, duration, flags, playbackRate, lock

		let wrapper = $("<div>");

		// ROW 1
		let row1 = $("<div>").addClass("row");
		row1.appendTo(wrapper);

			// COL 11
		let col11 = $("<div>").addClass("col-6")
		col11.appendTo(row1);

				// ANIM DICT
		let animDict = $("<input>").attr("type", "text").attr("data-key", "animDict").attr("placeholder", "Animation Dictionary").addClass("form-control step-data");
		animDict.appendTo(col11);

			// COL 12
		let col12 = $("<div>").addClass("col-6");
		col12.appendTo(row1);

				// ANIM NAME
		let animName = $("<input>").attr("type", "text").attr("data-key", "animName").attr("placeholder", "Animation Name").addClass("form-control step-data");
		animName.appendTo(col12);

		// ROW 2
		let row2 = $("<div>").addClass("row");
		row2.appendTo(wrapper);

			// COL 21
		let col21 = $("<div>").addClass("col-6");
		col21.appendTo(row2);

				// BLEND IN SPEED
		let blendInSpeed = $("<input>").attr("type", "number").attr("data-format", "number").attr("data-key", "blendInSpeed").attr("placeholder", "Blend in speed").addClass("form-control step-data");
		blendInSpeed.appendTo(col21);

			// COL 22
		let col22 = $("<div>").addClass("col-6");
		col22.appendTo(row2);

				// BLEND OUT SPEED
		let blendOutSpeed = $("<input>").attr("type", "number").attr("data-format", "number").attr("data-key", "blendOutSpeed").attr("placeholder", "Blend out speed").addClass("form-control step-data");
		blendOutSpeed.appendTo(col22);

		// ROW 3
		let row3 = $("<div>").addClass("row");
		row3.appendTo(wrapper);

			// COL 31
		let col31 = $("<div>").addClass("col-4");
		col31.appendTo(row3);

				// DURATION
		let duration = $("<input>").attr("type", "number").attr("data-format", "number").attr("data-key", "flags").attr("placeholder", "Flags").addClass("form-control step-data");
		duration.appendTo(col31);

			// COL 32
		let col32 = $("<div>").addClass("col-4");
		col32.appendTo(row3);

				// FLAGS
		let flags = $("<input>").attr("type", "number").attr("data-format", "number").attr("data-key", "flags").attr("placeholder", "Flags").addClass("form-control step-data");
		flags.appendTo(col32);

			// COL 33
		let col33 = $("<div>").addClass("col-4");
		col33.appendTo(row3);

				// PLAYBACK RATE
		let playbackRate = $("<input>").attr("type", "number").attr("data-format", "number").attr("data-key", "playbackRate").attr("placeholder", "Playback Rate").addClass("form-control step-data");
		playbackRate.appendTo(col33);

		// ROW 4
		let row4 = $("<div>").addClass("row");
		row4.appendTo(wrapper);

			// COL 41
		let col41 = $("<div>").addClass("col-4");
		col41.appendTo(row4);

				// LOCK X Label
		let lockXLabel = $("<label>").text("Lock X?");
		lockXLabel.appendTo(col41);

				// LOCK X
		let lockX = $("<input>").attr("type", "checkbox").addClass("step-data");
		lockX.attr("data-key", "lockX").attr("data-format", "boolean");
		lockX.appendTo(lockXLabel);

			// COL 42
		let col42 = $("<div>").addClass("col-4");
		col42.appendTo(row4);

				// LOCK Y Label
		let lockYLabel = $("<label>").text("Lock Y?");
		lockYLabel.appendTo(col42);

		let lockY = $("<input>").attr("type", "checkbox").addClass("step-data");
		lockY.attr("data-key", "lockY").attr("data-format", "boolean");
		lockY.appendTo(lockYLabel);

			// COL 43
		let col43 = $("<div>").addClass("col-4");
		col43.appendTo(row4);

				// LOCK Z Label
		let lockZLabel = $("<label>").text("Lock Z?");
		lockZLabel.appendTo(col43);

				// LOCK Z
		let lockZ = $("<input>").attr("type", "checkbox").addClass("step-data");
		lockZ.attr("data-key", "lockZ").attr("data-format", "boolean");
		lockZ.appendTo(lockZLabel);


		return wrapper;
	} */ else if(type == "eat" || type == "drink") {
		let row = $("<div>").addClass("row");
		
		let col1 = $("<div>").addClass("col-12");
		col1.appendTo(row);

		let propName = $("<input>").attr("type", "text").addClass("form-control step-data");
		propName.attr("data-key", "propName").attr("placeholder", "Prop name (" + GetLocalizedText("optional") + ")");
		propName.appendTo(col1);

		return row;
	}
}

let itemDatas = [];

const EnableSpinner = () => {
	$("#spinner").removeClass("d-none");
}

const DisableSpinner = () => {
	$("#spinner").addClass("d-none");
}

const IsSpinnerEnabled = () => {
	return !$("#spinner").hasClass("d-none");
}

const SetItemDatas = (newItemDatas) => {
	itemDatas = newItemDatas;
	RefreshList();
	DisableSpinner();
}

const RefreshList = () => {
	let searchText = $("#search-input").val();

	if(searchText == "") {
		SetList(itemDatas);
		return;
	}

	let results = [];
	for(const itemData of itemDatas) {
		if(itemData.name.toLowerCase().includes(searchText.toLowerCase()) || itemData.label.toLowerCase().includes(searchText.toLowerCase())) {
			results.push(itemData);
		}
	}

	SetList(results);
}

const SetList = (itemDatas) => {
	$("#item-list").empty();
	for(const itemData of itemDatas) {
		let row = $("<tr>");
		row.append($("<td>").text(itemData.name));
		row.append($("<td>").text(itemData.label));
		row.append($("<td>").text(itemData.weight));

		let updateButton = $("<input>");
		updateButton.attr("type", "button");
		updateButton.attr("data-edit", itemData.name);
		updateButton.attr("value", GetLocalizedText("edit"));
		updateButton.addClass("btn btn-success mx-2");
		updateButton.click(() => {
			if(IsSpinnerEnabled()) {
				return;
			}
			OpenItemForm(itemData);
		});

		let deleteButton = $("<input>");
		deleteButton.attr("type", "button");
		deleteButton.attr("data-delete", itemData.name);
		deleteButton.attr("value", GetLocalizedText("delete"));
		deleteButton.addClass("btn btn-danger");
		deleteButton.click(() => {
			if(IsSpinnerEnabled()) {
				return;
			}
			DeleteItem(itemData.name);
		});
		$("<td>").append(updateButton).append(deleteButton).appendTo(row);

		row.appendTo($("#item-list"));
	}
};

let modal = new bootstrap.Modal(document.getElementById("form"), {
	keyboard: false,
});

const OpenItemForm = (itemData) => {
	let isNewRecord = !itemData;

	$("#form-steps").empty();

	let title = isNewRecord ? GetLocalizedText("createNewItem") : itemData.label;
	$("#form .modal-title").text(title);

	if(isNewRecord) {
		$("#form").attr("data-new", true);
		$("#form-name").val("");
		$("#form-label").val("");
		$("#form-weight").val(1);
		$("#form-rare").attr("checked", false);
		$("#form-canRemove").attr("checked", true);
	} else {
		$("#form").attr("data-new", false);
		$("#form-name").val(itemData.name);
		$("#form-label").val(itemData.label);
		$("#form-weight").val(itemData.weight);
		$("#form-rare").attr("checked", !!itemData.rare);
		$("#form-canRemove").attr("checked", !!itemData.canRemove);
		
		for(const step of itemData.steps) {
			let stepEl = AddStep(step.type);
			for(const [key,value] of Object.entries(step)) {
				if(key === "type") {
					continue;
				}

				let entryEl = stepEl.find("[data-key='" + key + "']");
				if(entryEl) {
					if(entryEl.attr("data-format") == "boolean") {
						entryEl.attr("checked", value);
					} else {
						entryEl.val(value);
					}
				}
			}
		}
	}

	modal.show();
};

const DeleteItem = (name) => {
	EnableSpinner();
	SendRequest("DeleteItem", {
		name
	});
};

$("#modal-save").click(() => {
	let name = $("#form-name").val();
	let label = $("#form-label").val();
	let weight = $("#form-weight").val();
	let rare = $("#form-rare").is(":checked");
	let canRemove = $("#form-canRemove").is(":checked");

	if(!name || !label) {
		alert("Name oder Label fehlt!");
		return;
	}

	const steps = [];

	$(".form-step").each(function() {
		const stepEl = $(this);

		const step = {
			type: stepEl.attr("data-type"),
		};
		stepEl.find(".step-data").each(function() {
			let stepValueEl = $(this);
			let key = stepValueEl.attr("data-key");
			let format = stepValueEl.attr("data-format");

			if(format == "number") {
				step[key] = parseInt(stepValueEl.val());
			} else if(format == "boolean") {
				step[key] = stepValueEl.is(":checked");
			} else {
				step[key] = stepValueEl.val();
			}			
		});
		steps.push(step);
	});

	const itemData = {
		name, 
		label, 
		weight, 
		rare, 
		canRemove,
		steps
	};
	const isNewRecord = $("#form").attr("data-new") == "true";

	EnableSpinner();
	SendRequest("SaveItem", {
		isNewRecord,
		itemData
	})

	modal.hide();
});

const ShowMenu = () => {
	EnableSpinner();
	SendRequest("SetNuiFocus", {
		value: true
	});
	$("body").removeClass("d-none");
}

const HideMenu = () => {
	SendRequest("SetNuiFocus", {
		value: false
	});
	$("body").addClass("d-none");
}

const SendRequest = (name, data) => {
	fetch("https://" + GetParentResourceName() + "/" + name, {
    	method: 'POST',
    	headers: {
			'Content-Type': 'application/json; charset=UTF-8',
    	},
    	body: data ? JSON.stringify(data) : {},
	}).then(res => {
	});
}

const ApplyL10N = (el) => {
	const allElements = el.find("[data-l10n]");
	allElements.each((index, rawEl) => {
		const el = $(rawEl);
		const l10nData = el.attr("data-l10n");

		const indexed = [];
		if(l10nData.includes(";")) {
			const kvPairs = l10nData.split(";");
			for(const kv of kvPairs) {
				const kvSplited = kv.split(":");
				indexed[kvSplited[0]] = kvSplited[1];
			}
		} else if(l10nData.includes(":")) {
			kvSplited = kv.split(":");
			indexed[kvSplited[0]] = kvSplited[1];
		} else {
			indexed["key"] = l10nData;
		}

		let localized = GetLocalizedText(indexed.key);
		if(indexed.suffix) {
			localized += indexed.suffix;
		}

		if(indexed.target === "value") {
			el.val(localized); 
		} else if(indexed.target === "placeholder") {
			el.attr("placeholder", localized);
		} else {
			el.text(localized);
		}
	})
}

const GetLocalizedText = (key) => {
	return window.locales[window.locale][key];
};

for(const stepType of StepTypes) {
	let option = $("<option>");
	option.val(stepType);
	option.text(GetStepTitle(stepType));
	option.appendTo($("#add-step-type"));
}

$("#create-item").click(() => {
	if(IsSpinnerEnabled()) {
		return;
	}
	OpenItemForm(null);
});

$("#add-step").click(() => {
	let type = $("#add-step-type").val();

	AddStep(type);
});

$("#form-steps").sortable();

$("#close-menu").click(() => {
	if(IsSpinnerEnabled()) {
		return;
	}
	HideMenu();
});

$("#search-input").change(RefreshList);
$("#search-button").click(RefreshList);

window.addEventListener('message', (event) => {
	if(event.data.name) {
		try {
			if(event.data.args) {
				eval(event.data.name + "(...event.data.args);");
			} else {
				eval(event.data.name + "();");
			}
			
		} catch(e) {
			console.error("Error while executing NUI message '" + event.data.name + "'");
			console.log(e);
		}
	}
});

$("#change-language").change(() => {
	window.locale = $("#change-language").val();
	ApplyL10N($("body"));
	RefreshList();
})

$("#change-language").val(window.locale);
ApplyL10N($("body"));


// DEVELOPMENT & TESTING ONLY
/*SetItemDatas([
	{
		name: "test1",
		label: "Test 1",
		rare: 0,
		weight: 1,
		canRemove: 0,
		steps: [],
	},
	{
		name: "test1",
		label: "Test 1",
		rare: 0,
		weight: 2,
		canRemove: 1,
		steps: [],
	},
	{
		name: "test1",
		label: "Test 1",
		rare: 1,
		weight: 3,
		canRemove: 0,
		steps: [],
	},
	{
		name: "test1",
		label: "Test 1",
		rare: 1,
		weight: 4,
		canRemove: 1,
		steps: [],
	},
])*/