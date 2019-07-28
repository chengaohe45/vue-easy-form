/**
 * 点击拖拽
 * @param {*} event mousedown事件
 * @param {*} callback 回调函数。mousemove返回偏移量，mouseup返回false
 */
function esDrag(event, callback) {
  // The mouse position (in window coordinates)
  // at which the drag begins

  var cb = callback;

  var startX = event.clientX,
    startY = event.clientY;
  // var deltaX = startX - origX, deltaY = startY - origY;

  document.addEventListener("mousemove", moveHandler, true);
  document.addEventListener("mouseup", upHandler, true);
  window.addEventListener("blur", upHandler, true);

  // We've handled this event. Don't let anybody else see it.
  if (event.stopPropagation) event.stopPropagation();
  // DOM Level 2
  else event.cancelBubble = true; // IE

  // Now prevent any default action.
  if (event.preventDefault) event.preventDefault();
  // DOM Level 2
  else event.returnValue = false; // IE

  /**
   * This is the handler that captures mousemove events when an element
   * is being dragged. It is responsible for moving the element.
   **/
  function moveHandler(e) {
    if (!e) e = window.event; // IE Event Model

    // Move the element to the current mouse position, adjusted as
    // necessary by the offset of the initial mouse-click.
    // elementToDrag.style.left = (e.clientX - deltaX) + "px";
    // elementToDrag.style.top = (e.clientY - deltaY) + "px";

    var offsetX = e.clientX - startX;
    var offsetY = e.clientY - startY;

    cb({ offsetX, offsetY });

    // And don't let anyone else see this event.
    if (e.stopPropagation) e.stopPropagation();
    // DOM Level 2
    else e.cancelBubble = true; // IE
  }

  /**
   * This is the handler that captures the final mouseup event that
   * occurs at the end of a drag.
   **/
  function upHandler(e) {
    if (!e) e = window.event; // IE Event Model

    document.removeEventListener("mousemove", moveHandler, true);
    document.removeEventListener("mouseup", upHandler, true);
    window.removeEventListener("blur", upHandler, true);

    cb(false);

    cb = null;

    // And don't let the event propagate any further.
    if (e.stopPropagation) e.stopPropagation();
    // DOM Level 2
    else e.cancelBubble = true; // IE
  }

  event = null;
  callback = null;
}

export default esDrag;
