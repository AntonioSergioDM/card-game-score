import kingSettings from "./king/kingSettings";
import suecaSettings from "./sueca/suecaSettings";
import heartsSettings from "./hearts/heartsSettings";
import sueca_italianaSettings from "./sueca_italiana/sueca_italianaSettings";
import mimicSettings from "./mimic/mimicSettings";


const context = {};

[
    // The order matters for the menu
    suecaSettings,
    sueca_italianaSettings,
    kingSettings,
    heartsSettings,
    mimicSettings,
].forEach((settings) => context[`/${settings.identifier}/index.html`] = settings)

export default context;