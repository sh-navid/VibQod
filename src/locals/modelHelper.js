/*
 *  NaBotX – VS Code AI Assistant
 *  -------------------------------------------------------------
 *  DISCLAIMER – READ CAREFULLY
 *  1. NaBotX is NOT affiliated with, endorsed by, or sponsored by
 *     Google, OpenAI, or any other model provider.
 *  2. You must supply your own API key and maintain an active
 *     account with the selected provider.
 *  3. You are solely responsible for all usage costs and for
 *     complying with the provider’s Terms of Service, usage
 *     policy, and data-handling rules.
 *  4. NaBotX never ships or stores any credential on a remote
 *     server. Keys are kept locally via VS Code SecretStorage.
 *  5. The software is provided “AS IS”, WITHOUT WARRANTY OF ANY
 *     KIND. See the project LICENSE for details.
 *  -------------------------------------------------------------
 */

//Clean
const Models = Object.freeze({
  "google/gemma-3-27b-it": {name: "gemma-3-27b"},
  "google/gemini-2.5-flash": {name: "gemini-2.5-flash"},
  "google/gemini-2.0-flash-lite-001": {name: "gemini-2.0-flash-lite"},
  "google/gemini-2.0-flash-001": {name: "gemini-2.0-flash"},
  "google/gemini-2.5-pro-preview": {name: "gemini-2.5-pro"},
  "openai/o3": {name: "GPT-o3"},
  "openai/gpt-5-codex": {name: "GPT-5 Codex"},
})

// eslint-disable-next-line no-unused-vars
const modelHelper = {
  /**
   * Displays the name of the selected model in a specified container.
   * @param {string} containerId ID of the HTML element to update.
   * @param {string} modelId     ID of the selected model.
   */
  show: (containerId, modelId) => {
    $("#" + containerId).text(Models[modelId].name)
  },

  /**
   * Opens a modal dialog that lets the user pick a model.
   * @param {(selectedModelId: string) => void} callback
   */
  modal: (containerId,callback) => {
    if (typeof $ === "undefined") {
      console.error("jQuery is not loaded. Cannot open model selection modal.")
      return
    }

    const modalId = "naModelSelectionModal"
    let $modal = $("#" + modalId)

    if ($modal.length) {
      $modal.remove()
    }

    const modalHtml = `
      <div id="${modalId}" class="na-modal">
        <div class="na-modal-content">
          <div class="na-modal-header">
            <h5 class="na-modal-title">Select an AI Model</h5>
            <button type="button" class="na-close-button" aria-label="Close">&times;</button>
          </div>
          <div class="na-modal-body">
            <p style="padding:10px 20px;font-size:.9em;border-bottom:1px solid #444;margin:0;background:#333;">
              <strong>Important:</strong> Bring your own API key. You are
              responsible for usage costs and for complying with the provider’s
              Terms of Service. NaBotX never supplies credentials.
            </p>
            <ul class="na-list-group">
              ${Object.entries(Models)
                .map(
                  ([id, m]) =>
                    `<li class="na-list-group-item" data-model-id="${id}">
                       <span class="na-model-name">${m.name}</span>
                     </li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      </div>`

    $("#"+containerId).append(modalHtml)
    $modal = $("#" + modalId)

    setTimeout(() => $modal.addClass("na-show"), 10)

    $modal
      .find(".na-list-group-item")
      .off("click.naModelSelect")
      .on("click.naModelSelect", function () {
        const selectedModelId = $(this).data("model-id")
        $modal.removeClass("na-show")
        if (typeof callback === "function") callback(selectedModelId)
      })

    $modal
      .find(".na-close-button")
      .off("click.naModalClose")
      .on("click.naModalClose", () => $modal.removeClass("na-show"))

    $modal.off("click.naModalDismiss").on("click.naModalDismiss", (e) => {
      if ($(e.target).is($modal)) $modal.removeClass("na-show")
    })

    $(document)
      .off("keydown.naModalEscape")
      .on("keydown.naModalEscape", (e) => {
        if (e.key === "Escape" && $modal.hasClass("na-show")) $modal.removeClass("na-show")
      })

    $modal.off("transitionend.naModalCleanup").on("transitionend.naModalCleanup", () => {
      if (!$modal.hasClass("na-show")) {
        $modal.find(".na-list-group-item").off("click.naModelSelect")
        $modal.find(".na-close-button").off("click.naModalClose")
        $modal.off("click.naModalDismiss")
        $(document).off("keydown.naModalEscape")
        $modal.off("transitionend.naModalCleanup")
        $modal.remove()
      }
    })
  },
}
