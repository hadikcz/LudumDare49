import phaserBasicSettings from 'config/json/phaserBasicSettings.json';
import ui from 'config/json/ui.json';

export default {
    PhaserBasicSettings: phaserBasicSettings,
    UI: ui,
    World: {
        size: {
            width: 1360,
            height: 768
        }
    },
    Planet: {
        Atmosphere: {
            inner: 128,
            outer: 156
        }
    },
    AirFriction: {
        default: 0,
        inner: 0.04,
        outer: 0.01
    },
    RemoteControlRadius: 500,
    LastLevel: 3
};
