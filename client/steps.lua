local ESX = nil;

TriggerEvent("esx:getSharedObject", function(obj)
    ESX = obj;
end)

RegisterNetEvent("ngItemcreator:ExecuteCode", function(itemData, step)
    local func, err = load(step.code);
    if func then
        local ok, realFunc = pcall(func);
        if ok then
            local ok, result = pcall(realFunc, itemData, step);
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
end)

--[[
RegisterNetEvent("ngItemcreator:AttachProp", function(propName, pos, rot)
    local playerPed = PlayerPedId()
    local x,y,z = table.unpack(GetEntityCoords(playerPed))
    local prop = CreateObject(GetHashKey(prop_name), x, y, z + 0.2, true, true, true)
    local boneIndex = GetPedBoneIndex(playerPed, 18905)
    AttachEntityToEntity(prop, playerPed, boneIndex, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z, true, true, false, true, 1, true);
end);

RegisterNetEvent("ngItemcreator:PlayAnimation", function(animDict, animName, blendInSpeed, blendOutSpeed, duration, flags, playbackRate, lock)
    ESX.Streaming.RequestAnimDict(animDict, function()
        local playerPed = PlayerPedId();
        print(playerPed, animDict, animName, blendInSpeed, blendOutSpeed, duration, flags, playbackRate, lock.x, lock.y, lock.z);
        TaskPlayAnim(playerPed, animDict, animName, blendInSpeed, blendOutSpeed, duration, flags, playbackRate, lock.x, lock.y, lock.z);

        Citizen.Wait(3000)
        ClearPedSecondaryTask(playerPed)
        --DeleteObject(prop)
    end)
    
end);
]]--

RegisterNetEvent("ngItemcreator:Eat", function(prop_name)
    prop_name = prop_name or 'prop_cs_burger_01'

    Citizen.CreateThread(function()
        local playerPed = PlayerPedId()
        local x,y,z = table.unpack(GetEntityCoords(playerPed))
        local prop = CreateObject(GetHashKey(prop_name), x, y, z + 0.2, true, true, true)
        local boneIndex = GetPedBoneIndex(playerPed, 18905)
        AttachEntityToEntity(prop, playerPed, boneIndex, 0.12, 0.028, 0.001, 10.0, 175.0, 0.0, true, true, false, true, 1, true)

        ESX.Streaming.RequestAnimDict('mp_player_inteat@burger', function()
            TaskPlayAnim(playerPed, 'mp_player_inteat@burger', 'mp_player_int_eat_burger_fp', 8.0, -8, -1, 49, 0, 0, 0, 0)

            Citizen.Wait(3000)
            ClearPedSecondaryTask(playerPed)
            DeleteObject(prop)
        end)
    end)
end);

RegisterNetEvent("ngItemcreator:Drink", function(prop_name)
    prop_name = prop_name or 'prop_ld_flow_bottle'

    Citizen.CreateThread(function()
        local playerPed = PlayerPedId()
        local x,y,z = table.unpack(GetEntityCoords(playerPed))
        local prop = CreateObject(GetHashKey(prop_name), x, y, z + 0.2, true, true, true)
        local boneIndex = GetPedBoneIndex(playerPed, 18905)
        AttachEntityToEntity(prop, playerPed, boneIndex, 0.12, 0.028, 0.001, 10.0, 175.0, 0.0, true, true, false, true, 1, true)

        ESX.Streaming.RequestAnimDict('mp_player_intdrink', function()
            TaskPlayAnim(playerPed, 'mp_player_intdrink', 'loop_bottle', 1.0, -1.0, 2000, 0, 1, true, true, true)

            Citizen.Wait(3000)
            IsAnimated = false
            ClearPedSecondaryTask(playerPed)
            DeleteObject(prop)
        end)
    end)
end);


RegisterNetEvent("ngItemcreator:ExecuteCommand", function(command)
    ExecuteCommand(command);
end);