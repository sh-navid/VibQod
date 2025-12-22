# NaBotX now is Rebranding to VibQod

_NaBotX_ is your AI-Powered **VS Code Assistant eXtension**

<div align="center">
  <picture width="100%">
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logos/N8X.png">
    <source media="(prefers-color-scheme: light)" srcset="./assets/logos/N8X_Invert.png">
    <img src="./assets/logos/N8X_Invert.png" alt="NaBotX Logo" width="160">
  </picture>
</div>

## NaBotX Overview

![NaBotX Extension](./showcase/V09.png)

## Key Features

- **Intelligent Code Completion:** Get smart suggestions and code completions, making coding smoother and faster.
- **Customizable LLM Integration:** Connect to your preferred LLM, whether it's running locally or hosted online, ensuring secure and efficient code processing.
- **Full Data Control:** Your code stays where you want it. NaBotX doesn't interact with external servers unless _you_ configure it to.
- **Broad Language Support:** Supports a wide variety of programming languages.
- **Lightweight & Performant:** Experience fast performance.

---

## Latest Release

- [NaBotX-Release-V0.1.99](https://github.com/sh-navid/NabotX/releases/tag/Release-V0.1.99)
- [NaBotX-Release-V0.2.74](https://github.com/sh-navid/NabotX/releases/tag/Release-V0.2.74)

---

## Configuring Your LLM

The first time you launch NaBotX, you'll be prompted to configure your LLM settings.

<div align="center">
  <img src="./showcase/C03.png" alt="Configuring LLM Settings" />
</div>

You can also manually configure these settings by pressing `Ctrl+Shift+P`, typing **“NaBotX”** and selecting **“NaBotX: Open Settings.”**

<div align="center">
  <img src="./showcase/C01.png" alt="Accessing NaBotX Settings" />
</div>


---

## Usage Instructions

NaBotX offers multiple ways to interact:

- **Direct Prompting:** Send your prompt directly to the NaBotX chat window.
- **Contextual Chat ("Add 2 Chat"):**
  - Right-click on a file or folder in the Explorer and select **“Add File/Folder to chat.”**
  - Select text within a file, right-click, and choose **“Add to chat.”**
  - Then, send your prompt.
- **Predefined Commands:**
  - `/tree` – Sends your project structure to the chat.

## `n8x.json`

```json
{
  "excludeFromChat": [
    "/assets",
    "/showcase",
    "/node_modules",
    "*.vsix"
  ],
  "preference": [
    "Anything that should be always remembered for your project"
  ]
}
```


---

## ⚠️ Disclaimer & Privacy

1. **Independent Project** – NaBotX is an open-source community project and is **NOT** affiliated with, endorsed by, or sponsored by Google, OpenAI, Anthropic, or any other model or service provider.
   *All trademarks are the property of their respective owners.*

2. **Bring Your Own Key** – The extension ships **no credentials**. You must supply your own API key(s), keep them secure, and maintain an active account with each provider you choose to use.

3. **Your Cost / Your Compliance** – You are solely responsible for all usage costs, rate-limits, and for complying with each provider’s Terms of Service, Acceptable-Use Policy, privacy rules, and data-handling requirements.

4. **Local Storage Only** – NaBotX **never transmits, ships, or stores** your keys on any remote server. Credentials are stored **locally** using VS Code SecretStorage and sent only to the endpoint you configure.

5. **No Warranty** – The software is provided **“AS IS”, without warranty of any kind**, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability.

6. **Data Responsibility** – By using NaBotX you agree that you are solely responsible for any prompts and data you send to third-party APIs and for ensuring that no sensitive or regulated information is shared in violation of law or policy.

> This notice is provided for convenience only and does **not** constitute legal advice.
> NaBotX is licensed under the **Apache License 2.0**.
> See the [LICENSE.txt](./LICENSE.txt) file for the full legal text.
