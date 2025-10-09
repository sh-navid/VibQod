# NaBotX

*NaBotX* is your AI-Powered VS Code Assistant eXtension

<div align="center">
  <picture width="100%">
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logos/N8X.png">
    <source media="(prefers-color-scheme: light)" srcset="./assets/logos/N8X_Invert.png">
    <img src="./assets/logos/N8X_Invert.png" alt="NabotX Logo" width="160">
  </picture>
</div>

---

## ⚠️ Disclaimer & Privacy  

* **NaBotX is not affiliated with or endorsed by OpenAI, Google, or any other model provider.**  
* The extension ships **no credentials**. You must supply your own API keys and comply with each provider’s Terms of Service and data-usage policies.  
* All usage costs are **your responsibility**.  
* Credentials are stored **locally** using VS Code SecretStorage and are **never** transmitted to any server other than the endpoint you configure.  
* The software is provided **“AS IS”, without warranty of any kind**. See the [LICENSE](./LICENSE) file.  

---

## Latest Release
- [NaBotX-Release-V0.1.99](https://github.com/sh-navid/NabotX/releases/tag/Release-V0.1.99)  
- [NaBotX-Release-V0.2.74](https://github.com/sh-navid/NabotX/releases/tag/Release-V0.2.74)

## NaBotX Overview
![NaBotX Extension](./showcase/V09.png)

## Key Features

* **Intelligent Code Completion:** Get smart suggestions and code completions, making coding smoother and faster.  
* **Customizable LLM Integration:** Connect to your preferred LLM, whether it's running locally or hosted online, ensuring secure and efficient code processing.  
* **Full Data Control:** Your code stays where you want it. NaBotX doesn't interact with external servers unless *you* configure it to.  
* **Broad Language Support:** Supports a wide variety of programming languages.  
* **Lightweight & Performant:** Experience fast performance.  

## Configuring Your LLM

The first time you launch NaBotX, you'll be prompted to configure your LLM settings.

![Configuring LLM Settings](./showcase/C03.png)

You can also manually configure these settings by pressing `Ctrl+Shift+P`, typing "NaBotX" and selecting **“NaBotX: Open Settings.”**

![Accessing NaBotX Settings](./showcase/C01.png)

## Usage Instructions

NaBotX offers multiple ways to interact:

* **Direct Prompting:** Send your prompt directly to the NaBotX chat window.  
* **Contextual Chat ("Add 2 Chat"):**
  * Right-click on a file or folder in the Explorer and select **“Add File/Folder to chat.”**
  * Select text within a file, right-click, and choose **“Add to chat.”**
  * Then, send your prompt.
* **Predefined Commands:**  
  * `/tree` – Sends your project structure to the chat.

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