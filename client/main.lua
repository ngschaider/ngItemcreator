local ESX = nil;

TriggerEvent("esx:getSharedObject", function(obj)
    ESX = obj;
end)

function SendItemDatas(cb) 
    ESX.TriggerServerCallback("ngItemcreator:GetItemDatas", function(success, res)
        if success then
            SendNuiMessage(json.encode({
                name = "SetItemDatas",
                args = {
                    res
                }
            }));
        end
        cb(success, res);
    end);
end

function SaveItem(data, cb)
    if data.isNewRecord then
        ESX.TriggerServerCallback("ngItemcreator:CreateItem", function(success)
            SendItemDatas(function(success, res)
                cb(json.encode({
                    success = success,
                }));
               end);
        end, data.itemData);
    else
        ESX.TriggerServerCallback("ngItemcreator:UpdateItem", function(success)
            SendItemDatas(function(success, res) 
                cb(json.encode({
                    success = success,
                }));
            end)
        end, data.itemData);
    end
end
RegisterNUICallback('SaveItem', SaveItem)

function DeleteItem(data, cb)
    ESX.TriggerServerCallback("ngItemcreator:DeleteItem", function(success)
        SendItemDatas(function(success, res)
            cb(json.encode({
                success = success
            }));
        end);
    end, data.name)
end
RegisterNUICallback("DeleteItem", DeleteItem);

RegisterNUICallback("SetNuiFocus", function(data, cb)
    SetNuiFocus(data.value, data.value);
    cb({
        success = true,
        value = data.value
    });
end)

function ShowMenu()
    SendNuiMessage(json.encode({
        name = "ShowMenu",
    }));
    SendItemDatas(function(success, res)
    end);
end
RegisterNetEvent("ngItemcreator:ShowMenu", ShowMenu)