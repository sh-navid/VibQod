/*
 *  NaBotX – VS Code AI Assistant
 *  -------------------------------------------------------------
 *  DISCLAIMER – READ CAREFULLY
 *
 *  1. NaBotX is an independent open-source project and is NOT
 *     affiliated with, endorsed by, or sponsored by Google, OpenAI,
 *     Anthropic, or any other model or service provider.
 *     All trademarks are the property of their respective owners.
 *
 *  2. You must supply your own API key(s) and maintain an active
 *     account with each provider you choose to use.
 *
 *  3. You are solely responsible for all usage costs, rate-limits,
 *     and compliance with each provider’s Terms of Service,
 *     Acceptable-Use Policy, privacy rules, and data-handling
 *     requirements.
 *
 *  4. NaBotX never transmits, ships, or stores any credential on a
 *     remote server. All keys are kept locally via VS Code
 *     SecretStorage. You remain responsible for keeping your keys
 *     and local environment secure.
 *
 *  5. The software is provided “AS IS”, WITHOUT WARRANTY OF ANY
 *     KIND, express or implied, including but not limited to the
 *     warranties of merchantability, fitness for a particular
 *     purpose, and non-infringement. In no event shall the authors
 *     or copyright holders be liable for any claim, damages, or
 *     other liability, whether in an action of contract, tort, or
 *     otherwise, arising from, out of, or in connection with the
 *     software or the use or other dealings in the software.
 *
 *  6. By using NaBotX you agree that you are solely responsible
 *     for the prompts and data you send to any third-party API and
 *     for ensuring that no sensitive or regulated information is
 *     shared in violation of law or policy.
 *
 *  This notice is provided for convenience only and does not
 *  constitute legal advice.  The project is licensed under the
 *  Apache License, Version 2.0.  See the LICENSE.txt file
 *  distributed with this source code for the full licensing terms.
 *  -------------------------------------------------------------
 */

const Models = Object.freeze({
  "google/gemma-3-27b-it": { name: "Gemma-3-27b" },
  "google/gemini-2.5-flash": { name: "Gemini-2.5-flash" },
  "google/gemini-2.0-flash-lite-001": { name: "Gemini-2.0-flash-lite" },
  "google/gemini-2.0-flash-001": { name: "Gemini-2.0-flash" },
  "google/gemini-2.5-pro-preview": { name: "Gemini-2.5-pro" },
  "openai/o3": { name: "GPT-o3" },
  "openai/gpt-5-codex": { name: "GPT-5 Codex" },
  "qwen/qwen-turbo": { name: "Qwen/Qwen-turbo" },
  "mistralai/mistral-nemo": { name: "Mistralai/Mistral-nemo" },
  "deepseek/deepseek-chat-v3-0324": { name: "Deepseek/Deepseek-chat-v3" },
  "anthropic/claude-sonnet-4": { name: "Anthropic/Claude-sonnet-4" },
  "x-ai/grok-3-beta": { name: "xAI/Grok-3-beta" },
  "meta-llama/llama-3.3-70b-instruct": { name: "Meta/Llama-3.3-70b-instruct" },
  "perplexity/sonar-pro": { name: "Perplexity/Sonar-pro" },
  "moonshotai/kimi-k2-0905": { name: "Moonshotai/Kimi-k2" },
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
   * @param {string} containerId ID of the HTML element where the modal should be appended.
   * @param {(selectedModelId: string) => void} callback Function to be called with the selected model ID.
   */
  modal: (containerId, callback) => {
    if (typeof Modal === "undefined") {
      console.error("Modal component is not loaded. Cannot open model selection modal.")
      return
    }

    const modelSelectionBody = `
      <p class="model-api-warning" role="alert" aria-live="polite">
        <strong>Important:</strong>
        You must supply your own API key. You are responsible for usage costs
        and for complying with each provider’s Terms&nbsp;of&nbsp;Service and
        usage policies. NaBotX is distributed under the Apache&nbsp;2.0&nbsp;License
        and never transmits or stores your credentials.
      </p>
      <ul class="list-group">
        ${Object.entries(Models)
          .map(
            ([id, m]) =>
              `<li class="list-group-item" data-model-id="${id}">
                 <span class="model-name">${m.name}</span>
               </li>`
          )
          .join("")}
      </ul>`

    const modelSelectModal = new Modal({
      id: "modelSelectionModal",
      title: "Select an AI Model",
      bodyContent: modelSelectionBody,
      container: "#" + containerId,
      onClose: () => {
        $("#modelSelectionModal").find(".list-group-item").off("click.modelSelect")
      },
    })

    modelSelectModal.show()

    $("#modelSelectionModal")
      .find(".list-group-item")
      .off("click.modelSelect")
      .on("click.modelSelect", function () {
        const selectedModelId = $(this).data("model-id")
        modelSelectModal.hide()
        if (typeof callback === "function") {
          setTimeout(() => callback(selectedModelId), 300)
        }
      })
  },
}
