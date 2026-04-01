class PatchesRegistry {
    static patchFns = []
    static patchedEventNames = []

    static getEventInjectorCode() {
        return `
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script>
globalThis.modapi_specialevents = [${PatchesRegistry.patchedEventNames.map(x => `'${x}'`).join(',')}];
</script>
`;
    }

    static applyEventInjector(html) {
        return html.replace(
            "</head>",
            PatchesRegistry.getEventInjectorCode() + "</head>"
        );
    }

    static patchFile(x) {
        var current = x;
        PatchesRegistry.patchFns.forEach(fn => {
            current = fn(current);
        });
        return current;
    }

    static patchHTML(html) {
        html = PatchesRegistry.applyEventInjector(html);
        return html;
    }

    static addPatch(fn) {
        PatchesRegistry.patchFns.push(fn);
    }

    static regSpecialEvent(x) {
        PatchesRegistry.patchedEventNames.push(x);
    }
}

PatchesRegistry.regSpecialEvent('render');

PatchesRegistry.addPatch(function (input) {
    var output = input.replaceAll(
        /continue main;\s+?}\s+?if\s?\(!\$this.\$renderHand\)/gm,
        "continue main; } ModAPI.events.callEvent('render',{partialTicks:$partialTicks}); if (!$this.$renderHand)"
    );
    return output;
});

if (globalThis.process) {
    module.exports = {
        PatchesRegistry: PatchesRegistry
    }
}
