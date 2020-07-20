export const copyText = async (e, tooltipRef) => {
    // remove extra lines, if any before writing to clipboard
    let content = e.target.innerText ?
                  e.target.innerText.replace(/\n\n/gm, '\n') :
                  e.target.closest('.input-container').firstElementChild.innerText.replace(/\n\n/gm, '\n')
    try {
        await navigator.clipboard.writeText(content)
    } catch (error) {
        console.log(`Couldn't to clipboard: `, error.message)
        return false
    }
    if (tooltipRef) {
        // add quick tooltip indicating copy successful
        let tooltipText = tooltipRef.current
        tooltipText.style.visibility = 'visible';
        tooltipText.style.opacity = 1;
        setTimeout(() => {
              tooltipText.style.visibility = 'hidden';
              tooltipText.style.opacity = 0;
        }, 750)
    }
}

export const pasteText = (e) => {
    const clipboard = (e.clipboardData || window.clipboardData).getData('text')

    // was having issues when trying to copy from Google Docs and other external websites
    // pasted data included style and other tags, but I couldn't get to it
    // clipboard data appeared to be a String and had no html to access before pasting

    // execCommand is obsolete, but use if available to insert unformatted text, preserving line breaks
    if (document.execCommand) { 
        document.execCommand('insertText', false, clipboard)
    // else use innerText to maintain line breaks and remove formatting
    } else {
        let span = document.createElement('span')
        span.innerText = clipboard;
        const selection = window.getSelection()
        if (!selection.rangeCount) return false
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(span)
        selection.getRangeAt(0).collapse(false)
    }
}