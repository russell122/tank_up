"use strict";

var $plugins = {};
window.$plugins = $plugins;

Element.prototype.appendAfter = function (element) {
  element.parentNode.insertBefore(this, element.nextSibling);
};

function noop() {}

function _createModalFooter() {
  var buttons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (buttons.length === 0) {
    return document.createElement('div');
  }

  var wrap = document.createElement('div');
  wrap.classList.add('vmodal__footer');
  buttons.forEach(function (btn) {
    var $btn = document.createElement(btn.tag || 'button');

    if (btn.tag === 'a') {
      $btn.setAttribute('href', btn.link);
    }

    $btn.innerHTML = btn.text;
    $btn.classList.add("".concat(btn.class || 'g-btn'));
    $btn.onclick = btn.handler || noop;
    wrap.appendChild($btn);
  });
  return wrap;
}

function _createModal(options) {
  var DEFAULT_WIDTH = '600px';
  var modal = document.createElement('div');
  modal.classList.add('vmodal');
  modal.insertAdjacentHTML('afterbegin', "\n\t\t<div class=\"vmodal__overlay\">\n\t\t\t<div class=\"vmodal__window\" style=\"max-width: ".concat(options.width || DEFAULT_WIDTH, "\">\n\t\t\t\t<div class=\"vmodal__header\">\n\t\t\t\t\t<span class=\"vmodal__title\" data-title='true'>").concat(options.title || 'Модальное окно', "</span>\n\t\t\t\t\t").concat(options.closable ? "<span class=\"vmodal__close\" data-close=\"true\">&times;</span>" : '', "\n\t\t\t\t</div>\n\t\t\t\t<div class=\"vmodal__body\" data-content=\"true\">\n\t\t\t\t\t").concat(options.content || '', "\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t"));

  var footer = _createModalFooter(options.footerButtons);

  footer.appendAfter(modal.querySelector('[data-content]'));
  document.body.appendChild(modal);
  return modal;
}

$plugins.modal = function (options) {
  var ANIMATION_SPEED = 200;

  var $modal = _createModal(options);

  var closing = false;
  var destroyed = false;
  var modal = {
    open: function open() {
      if (destroyed) {
        return console.log('destroyed true');
      }

      !closing && $modal.classList.add('open');
      !closing && document.body.classList.add('show-modal');
    },
    close: function close() {
      closing = true;
      $modal.classList.remove('open');
      $modal.classList.add('hide');
      document.body.classList.remove('show-modal');
      setTimeout(function () {
        $modal.classList.remove('hide');
        closing = false;
      }, ANIMATION_SPEED);
    }
  };

  var listener = function listener(e) {
    if (e.target.dataset.close) {
      modal.close();
      setTimeout(function () {
        return modal.destroy();
      }, 1000);
    } else if (e.target.classList.contains('vmodal__overlay')) {
      modal.close();
      setTimeout(function () {
        return modal.destroy();
      }, 1000);
    }
  };

  var keyPressEvent = function keyPressEvent(e) {
    if (e.key == 'Escape') {
      modal.close();
      setTimeout(function () {
        return modal.destroy();
      }, 1000);
    }
  };

  $modal.addEventListener('click', listener);
  document.addEventListener('keydown', keyPressEvent);
  return Object.assign(modal, {
    destroy: function destroy() {
      $modal.parentNode.removeChild($modal);
      $modal.removeEventListener('click', listener);
      $modal.removeEventListener('click', keyPressEvent);
      destroyed = true;
    },
    setContent: function setContent() {
      var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Модальное окно';
      var content = arguments.length > 1 ? arguments[1] : undefined;
      $modal.querySelector('[data-title]').innerHTML = title;
      $modal.querySelector('[data-content]').innerHTML = content;
    }
  });
};