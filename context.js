import kingSettings from "./king/kingSettings";
import suecaSettings from "./sueca/suecaSettings";
import heartsSettings from "./hearts/heartsSettings";
import sueca_italianaSettings from "./sueca_italiana/sueca_italianaSettings";

const context = {
    // The order of appearance on the menu
    '/sueca/index.html': suecaSettings,
    '/sueca_italiana/index.html': sueca_italianaSettings,
    '/king/index.html': kingSettings,
    '/hearts/index.html': heartsSettings,
};

export default context;