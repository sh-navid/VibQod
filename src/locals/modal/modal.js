// eslint-disable-next-line no-unused-vars
class Modal {
  constructor(options) {
    if (typeof $ === "undefined") {
      console.error("jQuery is not loaded. Modal cannot be initialized.")
      return
    }

    this.options = {
      id: "genericModal",
      title: "Modal Title",
      bodyContent: "",
      container: "body",
      onClose: () => {},
      ...options,
    }

    this.$modal = null
    this._initModal()
  }

  _initModal() {
    const modalHtml = `
      <div id="${this.options.id}" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${this.options.title}</h5>
            <button type="button" class="close-button" aria-label="Close">&times;</button>
          </div>
          <div class="modal-body">
            ${this.options.bodyContent}
          </div>
        </div>
      </div>`

    // Remove existing modal if it has the same ID
    $("#" + this.options.id).remove()

    $(this.options.container).append(modalHtml)
    this.$modal = $("#" + this.options.id)

    this._setupEventListeners()
  }

  _setupEventListeners() {
    this.$modal
      .find(".close-button")
      .off("click.modalClose")
      .on("click.modalClose", () => this.hide())

    this.$modal.off("click.modalDismiss").on("click.modalDismiss", (e) => {
      if ($(e.target).is(this.$modal)) this.hide()
    })

    $(document)
      .off("keydown.modalEscape")
      .on("keydown.modalEscape", (e) => {
        if (e.key === "Escape" && this.$modal.hasClass("show")) this.hide()
      })

    this.$modal.off("transitionend.modalCleanup").on("transitionend.modalCleanup", () => {
      if (!this.$modal.hasClass("show")) {
        this._cleanupEventListeners()
        this.$modal.remove()
        this.options.onClose()
      }
    })
  }

  _cleanupEventListeners() {
    this.$modal.find(".close-button").off("click.modalClose")
    this.$modal.off("click.modalDismiss")
    $(document).off("keydown.modalEscape")
    this.$modal.off("transitionend.modalCleanup")
  }

  show() {
    if (this.$modal) {
      setTimeout(() => this.$modal.addClass("show"), 10)
    }
  }

  hide() {
    if (this.$modal) {
      this.$modal.removeClass("show")
    }
  }
}
