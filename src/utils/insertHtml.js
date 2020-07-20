import { clearTypeArray } from './trackTyping'
import DOMPurify from 'dompurify'

const insertHtml = (html, shortcut, selector) => {
    let selection = document.getSelection()
    let startContainer = selection.getRangeAt(0).startContainer // grab current container
    selection.extend(startContainer, startContainer.length - shortcut.length) // select shortcut
    let range = selection.getRangeAt(0)
    range.deleteContents() // delete shorcut
    
    let content = document.createElement('div') // create temp div to hold html
    content.innerHTML = DOMPurify.sanitize(html)
    let fragment = document.createDocumentFragment(), // create fragment
        cursorText = '<? cursor ?>', // cursor text
        cursorTextNode,
        node,
        cursorNode,
        lastNode
    // loop through temp div and append each node to fragment
    // tracking lastNode or cursorNode so we know where to place cursor
    while ( (node = content.firstChild) ) {
        // if cursor placeholder text is on it's own line, set cursorNode
        if (node.textContent === cursorText) {
            cursorNode = node
        // if cursor text is in the middle of other text...
        } else if (node.textContent.includes(cursorText)) {
            // could be textNode (first line) or html (div, etc.)
            // split the text or html at cursor placeholder
            let array = node.innerHTML ?
                node.innerHTML.split('&lt;? cursor ?&gt;') :
                node.textContent.split('<? cursor ?>')
            // remove node from temp div
            content.removeChild(node)
            // maintain original container behavior, whether inline or block
            node = node.nodeName === '#text' ?
                document.createElement('span') : 
                document.createElement(node.nodeName);
            // recreate node with nodes, so we can use the cursorTextNode for cursor placement
            node.appendChild(document.createTextNode(array[0] || ''))
            cursorTextNode = node.appendChild(document.createTextNode('\u00A0'))
            node.appendChild(document.createTextNode(array[1].trim() || ''))
        }
        lastNode = fragment.appendChild(node)
    }
    // insert fragment into document
    range.insertNode(fragment)

    range = range.cloneRange()
    // if cursorNode exists, simulate contenteditable behavior for new line
    // insert cursor at new line position
    if (cursorNode) {
        const newLine = document.createElement('div')
        const space = document.createElement('br')
        newLine.appendChild(space)
        range.setStartBefore(cursorNode)
        range.setEndAfter(cursorNode)
        range.deleteContents()
        range.insertNode(newLine)
        range.setStartBefore(space)
    // if cursor is in the middle of text, set cursor position there
    } else if (cursorTextNode) {
        range.setStartBefore(cursorTextNode)
    // else set cursor position at the end
    } else {
        range.setStartAfter(lastNode)
    }
    // collapse selection and insert cursor
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    // combine text nodes
    selector.normalize()

    // always clear the typeArray after insert
    clearTypeArray()
}

export default insertHtml