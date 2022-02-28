ESX = nil;

TriggerEvent('esx:getSharedObject', function(obj)
    ESX = obj;
end);

function ExecuteStep(source, itemData, step) 
    if step.type == "addItem" then
        local xPlayer = ESX.GetPlayerFromId(source);
        xPlayer.addInventoryItem(step.name, step.amount);

    elseif step.type == "removeItem" then
        local xPlayer = ESX.GetPlayerFromId(source);
        xPlayer.removeInventoryItem(step.name, step.amount);

    elseif step.type == "showNotification" then
        local xPlayer = ESX.GetPlayerFromId(source);
        xPlayer.showNotification(step.text);

    --[[
    elseif step.type == "playAnimation" then
        TriggerClientEvent("ngItemcreator:PlayAnimation", source, step.animDict, step.animName, step.blendInSpeed, step.blendOutSpeed, step.duration, step.flags, step.playbackRate, {
            x = step.lockX,
            y = step.lockY,
            z = step.lockZ
        });
        -- animDict, animName, blendInSpeed, blendOutSpeed, duration, flags, playbackRate, lock

    elseif step.type == "attachProp" then
        TriggerClientEvnet("ngItemcreator:AttachProp", source, step.propName, {
            x = step.posX, 
            y = step.posY, 
            z = step.posZ  
        }, {
            x = step.rotX, 
            y = step.rotY, 
            z = step.rotZ, 
        });
    ]]--

    elseif step.type == "drink" then
        TriggerClientEvent("ngItemcreator:Drink", source, step.propName);

    elseif step.type == "eat" then
        TriggerClientEvent("ngItemcreator:Eat", source, step.propName);

    elseif step.type == "addStatus" then
        TriggerClientEvent('cd_playerhud:status:add', source, step.name, step.amount);

    elseif step.type == "executeServerCommand" then
        ExecuteCommand(step.command);
    
    elseif step.type == "executeClientCommand" then
        TriggerClientEvent("ngItemcreator:ExecuteCommand", source, step.command);
        
    elseif step.type == "executeServerCode" then
        local func, err = load(step.code);
        if func then
            local ok, realFunc = pcall(func);
            if ok then
                local ok, result = pcall(realFunc, source, itemData, step);
                if ok then
                    if result == nil then
                        -- function did not return anything
                        result = true;
                    end

                    return result;
                else
                    print("Error while calling step code inner function\n" .. step.code);
                    print(result);
                    return false;
                end
            else
                print("Error while calling step code\n" .. step.code);
                print(realFunc);
                return false;
            end
        else
            print("Error while loading step code \n" .. step.code);
            print(err);
            return false;
        end

    elseif step.type == "executeClientCode" then
        TriggerClientEvent("ngItemcreator:ExecuteCode", source, itemData, step);

    elseif step.type == "spawnVehicle" then
        local playerPed = GetPlayerPed(source);

        local coords = GetEntityCoords(playerPed);
        local heading = GetEntityHeading(playerPed);
        local hash = GetHashKey(step.modelName);

        local vehicle = CreateVehicle(hash, coords.x, coords.y, coords.z, heading, true, false);
        local plate = GeneratePlateText();
        SetVehicleNumberPlateText(vehicle, plate);

        TaskWarpPedIntoVehicle(playerPed, vehicle, -1)

        if step.persistent then
            while not DoesEntityExist(vehicle) do
                Wait(10);
            end

            local vehicleType = GetVehicleType(vehicle);
            local vehicleTypeDb = "";
            if vehicleType == "automobile" or vehicleType == "bike" or vehicleType == "trailer" then
                vehicleTypeDb = "car";
            elseif vehicleType == "boat" or vehicleType == "submarine" then
                vehicleTypeDb = "boat";
            elseif vehicleType == "heli" or vehicleType == "plane" then
                vehicleTypeDb = "airplane";
            else
                vehicleTypeDb = "unknown";
            end

            local xPlayer = ESX.GetPlayerFromId(source);
            local identifier = xPlayer.getIdentifier();

            MySQL.Async.execute("INSERT INTO owned_vehicles (owner, vehicle, type, plate) VALUES(@owner, @vehicle, @type, @plate)", {
                ["@owner"] = identifier,
                ["@vehicle"] = json.encode({
                    model = hash,
                    plate = plate,
                });
                ["@plate"] = plate,
                ["@type"] = vehicleTypeDb,
            });
        end

    end

    return true;
end

function CreateItem(cb, itemData)
    if DoesItemExist(itemData.name) then
        cb(false);
        return;
    end

    local query1Finished = false;
    MySQL.Async.execute("INSERT INTO items (name, label, weight, rare, can_remove) VALUES (@name, @label, @weight, @rare, @canRemove);", {
        ["@name"] = itemData.name,
        ["@label"] = itemData.label,
        ["@weight"] = itemData.weight,
        ["@rare"] = itemData.rare,
        ["@canRemove"] = itemData.canRemove,
    }, function()
        query1Finished = true;
    end);

    local query2Finished = false;
    MySQL.Async.execute("INSERT INTO ng_itemcreator (name, steps) VALUES (@name, @steps);", {
        ["@name"] = itemData.name,
        ["@steps"] = json.encode(itemData.steps),
    }, function()
        query2Finished = true;
    end);

    Citizen.CreateThread(function()
        while not query1Finished or not query2Finished do
            Wait(0);
        end
        RegisterCustomItem(itemData);
        --TriggerEvent("esx:addItem", itemData);
        TriggerEvent("esx:refreshItems");

        cb(true);
    end)
end

ESX.RegisterServerCallback("ngItemcreator:CreateItem", function(source, cb, itemData)
    if not IsAdmin(source) then 
        cb(false);
        return;
    end

    CreateItem(cb, itemData);
end);

function UpdateItem(cb, itemData)
    if not DoesItemExist(itemData.name) then 
        cb(false);
        return;
    end

    MySQL.Async.execute("UPDATE items SET label=@label, weight=@weight, rare=@rare, can_remove=@canRemove WHERE name=@name;", {
        ["@name"] = itemData.name,
        ["@label"] = itemData.label,
        ["@weight"] = itemData.weight,
        ["@rare"] = itemData.rare,
        ["@canRemove"] = itemData.canRemove,
    }, function()
        query1Finished = true;
    end);

    local query2Finished = false;
    if DoesItemDataExist(itemData.name) then
        MySQL.Async.execute("UPDATE ng_itemcreator SET steps=@steps WHERE name=@name;", {
            ["@name"] = itemData.name,
            ["@steps"] = json.encode(itemData.steps),
        }, function()
            query2Finished = true;
        end);
    else
        MySQL.Async.execute("INSERT INTO ng_itemcreator (name, steps) VALUES (@name, @steps);", {
            ["@name"] = itemData.name,
            ["@steps"] = json.encode(itemData.steps),
        }, function()
            query2Finished = true;
        end); 
    end

    Citizen.CreateThread(function()
        while not query1Finished or not query2Finished do
            Wait(0);
        end
        RegisterCustomItem(itemData);
        --TriggerEvent("esx:updateItem", itemData);
        TriggerEvent("esx:refreshItems");
    
        cb(true);
    end)
end
ESX.RegisterServerCallback("ngItemcreator:UpdateItem", function(source, cb, itemData)
    if not IsAdmin(source) then
        cb(false);
        return;
    end

    UpdateItem(cb, itemData);
end);

function DeleteItem(cb, name)
    if not DoesItemExist(name) then
        cb(false);
        return;
    end
    
    MySQL.Async.execute("DELETE FROM ng_itemcreator WHERE name=@name", {
        ["@name"] = name,
    }, function()
        MySQL.Async.execute("DELETE FROM items WHERE name=@name", {
            ["@name"] = name,
        }, function()
            UnregisterCustomItem(name);
            --TriggerEvent("esx:removeItem", name);
            TriggerEvent("esx:refreshItems");
    
            cb(true);
        end);
    end);
end
ESX.RegisterServerCallback("ngItemcreator:DeleteItem", function(source, cb, name)
    if not IsAdmin(source) then 
        cb(false);
        return;
    end
    
    DeleteItem(cb, name);
end);

function GetItemDatas(cb)
    MySQL.Async.fetchAll("SELECT * FROM items", {}, function(items)
        MySQL.Async.fetchAll("SELECT * FROM ng_itemcreator", {}, function(customItems)
            local indexed = {};
            for k,v in pairs(customItems) do
                indexed[v.name] = v;
            end

            local itemDatas = {};

            for k,v in pairs(items) do
                itemDatas[k] = {
                    name = v.name,
                    label = v.label,
                    weight = v.weight,
                    canRemove = v.can_remove,
                    rare = v.rare,
                }

                if indexed[v.name] ~= nil then
                    itemDatas[k].steps = json.decode(indexed[v.name].steps);
                else
                    itemDatas[k].steps = {};
                end
            end

            cb(true, itemDatas);
        end);
    end);
end
ESX.RegisterServerCallback("ngItemcreator:GetItemDatas", function(source, cb)
    if not IsAdmin(source) then
        cb(false, nil);
        return;
    end;

    GetItemDatas(cb)
end);



-- Item Use Handler Register/Unregister

function RegisterCustomItem(itemData)
    if #itemData.steps == 0 then
        return;
    end

    --print("Registering " .. itemData.name);
    ESX.RegisterUsableItem(itemData.name, function(source, item)
        for _,step in pairs(itemData.steps) do
            local result = ExecuteStep(source, itemData, step);
            if not result then
                break;
            end
        end
    end)
end

function UnregisterCustomItem(name)
    ESX.RegisterUsableItem(name, nil);
end



-- Utilities

function GetRandomLetters(length)
    local charset = {"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
    Citizen.Wait(0)
	math.randomseed(GetGameTimer())
	if length > 0 then
		return GetRandomLetters(length - 1) .. charset[math.random(1, #charset)];
	else
		return "";
	end
end

function GetRandomNumbers(length)
    local charset = {"1","2","3","4","5","6","7","8","9","0"};
    Citizen.Wait(0)
	math.randomseed(GetGameTimer())
	if length > 0 then
		return GetRandomNumbers(length - 1) .. charset[math.random(1, #charset)]
	else
		return ''
	end
end

function GeneratePlateText()
    return GetRandomLetters(3) .. " " .. GetRandomNumbers(3);
end

function DoesItemExist(name)
    local results = MySQL.Sync.fetchAll("SELECT name FROM items WHERE name=@name", {
        ["@name"] = name,
    });

    return #results > 0;
end

function DoesItemDataExist(name)
    local results = MySQL.Sync.fetchAll("SELECT name FROM ng_itemcreator WHERE name=@name", {
        ["@name"] = name,
    });

    return #results > 0;
end

function IsAdmin(source)
    local isAdmin = IsPlayerAceAllowed(source, "command.itemcreator");

    return isAdmin;
end

GetItemDatas(function(success, itemDatas)
    if not success then
        return;
    end

    for _,itemData in pairs(itemDatas) do
        RegisterCustomItem(itemData);
    end
    TriggerEvent("esx:refreshItems");
end);

RegisterCommand("itemcreator", function(source, args, rawCommand)
    TriggerClientEvent("ngItemcreator:ShowMenu", source);
end, true);