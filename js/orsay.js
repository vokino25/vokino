var widgetAPI, tvKey, pluginAPI, orsay_loaded, orsay_call = Date.now(), orsay_tap_back = Date.now(), orsay_tap_back_count = 1, orsay_tap_back_timer;

window.addEventListener("keydown", function (event) {
    try {
        switch (event.keyCode) {
      
        case tvKey.KEY_RETURN:
            widgetAPI.blockNavigation(event);
            window.history.back();
            break;

        case tvKey.KEY_EXIT:
            if (orsay_tap_back + 200 < Date.now()) {
                orsay_tap_back_count = 1;
            } else {
                orsay_tap_back_count++;
            }
            if (orsay_tap_back_count >= 2) {
                widgetAPI.sendExitEvent(event);
            } else {
                widgetAPI.sendReturnEvent(event);
            }

            clearTimeout(orsay_tap_back_timer)

            orsay_tap_back_timer = setTimeout(function () {
                orsay_tap_back = Date.now();
            }, 200)

                break;
        }
    } catch (e) {}
})

function orsayOnshow() {
    if (orsay_loaded)
        return;

    orsay_loaded = true;
    try {
        pluginAPI.SetBannerState(1);
    alert("включили отрисовку");
        pluginAPI.unregistKey(tvKey.KEY_INFO);
        pluginAPI.unregistKey(tvKey.KEY_TOOLS);
        pluginAPI.unregistKey(tvKey.KEY_MENU);
        pluginAPI.unregistKey(tvKey.KEY_VOL_UP);
        pluginAPI.unregistKey(tvKey.KEY_VOL_DOWN);
        pluginAPI.unregistKey(tvKey.KEY_MUTE);
    alert("убрали регистрацию кнопок");
    pluginAPI.setOffScreenSaver();
    alert("убрали заставку ТВ");
    
    } catch (e) {}

};

function orsayOnLoad() {
    try {
        if (typeof Common !== 'undefined' && Common.API && Common.API.TVKeyValue && Common.API.Plugin && Common.API.Widget) {
            widgetAPI = new Common.API.Widget();
            tvKey = new Common.API.TVKeyValue();
            pluginAPI = new Common.API.Plugin();
            window.onShow = orsayOnshow;

            setTimeout(function () {
                orsayOnshow();
            }, 2000);
            widgetAPI.sendReadyEvent();
        } else {
            if (orsay_call + 5 * 1000 > Date.now())
                setTimeout(orsayOnLoad, 50);
        }
    } catch (e) {}
}