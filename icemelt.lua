local shaderName = "icemelt"
local isShaderSupported = false
local currentProgress = 0.0
local startTransition = false

function onCreatePost()
    if shadersSupported then
        isShaderSupported = true
        initLuaShader(shaderName)
        
        runHaxeCode([[
            var shader = game.createRuntimeShader(']] .. shaderName .. [['');
            game.camGame.setFilters([new openfl.filters.ShaderFilter(shader)]);
            
            shader.setFloatArray('iResolution', [1280.0, 720.0, 0.0]);
            shader.setFloat('iTime', 0.0);
            shader.setFloat('progress', 0.0);
        ]])
    end
end

function onStepHit()
    -- EXAMPLE: Trigger the melt transition at step 128
    if curStep == 128 then
        startTransition = true
    end
end

function onUpdate(elapsed)
    if isShaderSupported then
        -- Update iTime global uniform
        local shaderTime = getPropertyFromClass('backend.Conductor', 'songPosition') / 1000
        
        -- If triggered, increment the progress variable from 0.0 to 1.0
        if startTransition and currentProgress < 1.0 then
            currentProgress = currentProgress + (elapsed * 0.8) -- Adjust 0.8 to change melt speed
            if currentProgress > 1.0 then currentProgress = 1.0 end
        end
        
        runHaxeCode([[
            var shader = game.camGame.getFilters()[0].shader;
            if (shader != null) {
                shader.setFloat('iTime', ]] .. shaderTime .. [[);
                shader.setFloat('progress', ]] .. currentProgress .. [[);
            }
        ]])
    end
end
