document.querySelector("#giveme")?.addEventListener("click", async () => {
    const input = document.querySelector("input");
    if (!input?.files?.[0]) return;

    const file = input.files[0];
    let fileType = file.name.split(".").pop();

    const string = await file.text();

    EFIConfig.doServerExtras = false;
    const patchedFile = await patchClient(string, new DOMParser());

    const blob = new Blob([patchedFile], { type: file.type });
    saveAs(blob, "processed." + fileType);
    backgroundLog("Saving file...", true);
});

document.querySelector("#givemeserver")?.addEventListener("click", async () => {
    const input = document.querySelector("input");
    if (!input?.files?.[0]) return;

    const file = input.files[0];
    let fileType = file.name.split(".").pop();

    const string = await file.text();

    EFIConfig.doServerExtras = true;
    const patchedFile = await patchClient(string, new DOMParser());

    const blob = new Blob([patchedFile], { type: file.type });
    saveAs(blob, "efserver." + fileType);
    backgroundLog("Saving file...", true);
});
